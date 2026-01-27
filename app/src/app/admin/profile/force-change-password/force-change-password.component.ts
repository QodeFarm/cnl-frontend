
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TaLocalStorage } from '@ta/ta-core';

@Component({
  selector: 'app-force-change-password',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './force-change-password.component.html',
  styleUrls: ['./force-change-password.component.scss']
})
export class ForceChangePasswordComponent implements OnInit {

  // Form options for ta-form
  options: any = {
    url: "users/force_change_password/",
    submit: {
      label: "Set Password",
      icon: 'lock',
      showSuccessMsg: false, // Suppress default notification - we show our own custom message
      submittedFn: (res: any) => {
        this.onPasswordChanged(res);
      },
    },
    reset: {
      label: "Clear",
    },
    fields: [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'password',
            type: 'input',
            className: 'col-12 mb-2',
            templateOptions: {
              label: 'New Password',
              type: 'password',
              placeholder: 'Enter a strong password',
              required: true,
              minLength: 8,
              description: 'Use at least 8 characters with uppercase, lowercase, numbers & symbols.',
            },
            expressionProperties: {
              'templateOptions.description': (model: any, formState: any, field: any) => {
                const password = model?.password || '';
                if (!password) return 'Use at least 8 characters with uppercase, lowercase, numbers & symbols.';
                const strength = this.getPasswordStrength(password);
                return `Password strength: ${strength.label}`;
              }
            }
          },
          {
            key: 'confirm_password',
            type: 'input',
            className: 'col-12 mb-2',
            templateOptions: {
              label: 'Confirm Password',
              type: 'password',
              placeholder: 'Re-enter your new password',
              required: true,
              description: 'Both passwords must match.',
            },
            validators: {
              fieldMatch: {
                expression: (control: any) => {
                  const password = control.root.get('password');
                  return !password || control.value === password.value;
                },
                message: 'Password and Confirm Password do not match.',
              },
            },
          }
        ]
      }
    ]
  };

  constructor(private router: Router, private message: NzMessageService) {}

  ngOnInit(): void {
    // Verify user should be on this page
    const forceChange = localStorage.getItem('force_password_change');
    if (forceChange !== 'true') {
      this.router.navigateByUrl('/admin/dashboard');
    }
  }

  // Calculate password strength
  getPasswordStrength(password: string): { label: string, class: string } {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Weak 🔴', class: 'text-danger' };
    if (strength <= 4) return { label: 'Medium 🟡', class: 'text-warning' };
    return { label: 'Strong 🟢', class: 'text-success' };
  }

  // Handle successful password change
  onPasswordChanged(res: any): void {
    console.log('Password changed successfully, clearing session...');
    
    // Clear ALL authentication data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('force_password_change');
    
    // Clear TaLocalStorage user data
    TaLocalStorage.removeItem('user');
    
    // Also clear any other auth-related items
    localStorage.removeItem('user');
    
    // Show success message
    this.message.success('Password updated successfully! Please login with your new password.');
    
    // Redirect to login page (not dashboard!)
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 1500);
  }
}
