
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TaLocalStorage } from '@ta/ta-core';
import { SiteConfigService } from '@ta/ta-core';

@Component({
  selector: 'app-force-change-password',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './force-change-password.component.html',
  styleUrls: ['./force-change-password.component.scss']
})
export class ForceChangePasswordComponent implements OnInit {

  form!: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  requirements = [
    { key: 'minLength',   label: 'At least 8 characters',           met: false },
    { key: 'uppercase',   label: 'One uppercase letter (A–Z)',       met: false },
    { key: 'lowercase',   label: 'One lowercase letter (a–z)',       met: false },
    { key: 'number',      label: 'One number (0–9)',                 met: false },
    { key: 'special',     label: 'One special character (!@#$...)',  met: false },
  ];

  strength = 0;
  strengthLabel = '';
  strengthClass = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private message: NzMessageService,
    private siteConfig: SiteConfigService
  ) {}

  ngOnInit(): void {
    const forceChange = localStorage.getItem('force_password_change');
    if (forceChange !== 'true') {
      this.router.navigateByUrl('/admin/dashboard');
      return;
    }

    const formOptions: AbstractControlOptions = { validators: this.passwordMatchValidator };
    this.form = this.fb.group(
      {
        password:         ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', [Validators.required]],
      },
      formOptions
    );

    this.form.get('password')!.valueChanges.subscribe(val => {
      this.evaluatePassword(val || '');
    });
  }

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const pw  = control.get('password')?.value;
    const cpw = control.get('confirm_password')?.value;
    return pw && cpw && pw !== cpw ? { mismatch: true } : null;
  };

  evaluatePassword(pw: string): void {
    this.requirements[0].met = pw.length >= 8;
    this.requirements[1].met = /[A-Z]/.test(pw);
    this.requirements[2].met = /[a-z]/.test(pw);
    this.requirements[3].met = /[0-9]/.test(pw);
    this.requirements[4].met = /[^a-zA-Z0-9]/.test(pw);

    this.strength = this.requirements.filter(r => r.met).length;

    if (this.strength <= 2) {
      this.strengthLabel = 'Weak';
      this.strengthClass = 'weak';
    } else if (this.strength <= 3) {
      this.strengthLabel = 'Fair';
      this.strengthClass = 'fair';
    } else if (this.strength === 4) {
      this.strengthLabel = 'Good';
      this.strengthClass = 'good';
    } else {
      this.strengthLabel = 'Strong';
      this.strengthClass = 'strong';
    }
  }

  get passwordControl()        { return this.form.get('password')!; }
  get confirmPasswordControl() { return this.form.get('confirm_password')!; }

  get passwordTouched()        { return this.passwordControl.touched; }
  get confirmTouched()         { return this.confirmPasswordControl.touched; }
  get mismatch()               { return this.form.hasError('mismatch') && this.confirmTouched; }
  get strengthPercent()        { return (this.strength / 5) * 100; }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading = true;
    const baseUrl = this.siteConfig.CONFIG.baseUrl;
    const payload = {
      password:         this.passwordControl.value,
      confirm_password: this.confirmPasswordControl.value,
    };

    this.http.post(`${baseUrl}users/force_change_password/`, payload).subscribe({
      next: () => {
        this.isLoading = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('force_password_change');
        localStorage.removeItem('user');
        TaLocalStorage.removeItem('user');
        this.message.success('Password set successfully! Please sign in with your new password.');
        setTimeout(() => this.router.navigateByUrl('/login'), 1800);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onClear(): void {
    this.form.reset();
    this.evaluatePassword('');
  }
}
