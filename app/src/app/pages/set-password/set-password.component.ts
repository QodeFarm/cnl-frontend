import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, RouterModule],
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
  // Page states
  isLoading: boolean = true;
  isTokenValid: boolean = false;
  isSubmitting: boolean = false;
  isSuccess: boolean = false;
  
  // Error/Status messages
  errorTitle: string = '';
  errorMessage: string = '';
  
  // Route params
  uid: string = '';
  token: string = '';
  
  // Form options for ta-form
  options: any = {
    url: "users/activate-set-password/",
    submit: {
      label: "Activate Account",
      icon: 'check',
      showSuccessMsg: false, // We show our own custom message
      submittedFn: (res: any) => {
        this.onPasswordSet(res);
      },
    },
    reset: {
      cssClass: 'd-none' // Hide reset button
    },
    model: {},
    fields: [
      {
        key: 'password',
        type: 'input',
        className: 'pb-3',
        templateOptions: {
          type: 'password',
          hideLabel: true,
          addonLeftIcon: 'lock',
          label: 'New Password',
          placeholder: 'Enter Password',
          required: true,
          minLength: 8,
          attributes: {
            style: 'padding-left: 10px;'
          }
        },
        validators: {
          passwordStrength: {
            expression: (control: any) => {
              const value = control.value || '';
              if (!value) return true; // Let required handle empty
              const hasUppercase = /[A-Z]/.test(value);
              const hasLowercase = /[a-z]/.test(value);
              const hasDigit = /[0-9]/.test(value);
              const hasMinLength = value.length >= 8;
              return hasUppercase && hasLowercase && hasDigit && hasMinLength;
            },
            message: 'Password must have 8+ chars, uppercase, lowercase, and a number.'
          }
        }
      },
      {
        key: 'confirm_password',
        type: 'input',
        className: 'pb-3',
        templateOptions: {
          type: 'password',
          hideLabel: true,
          addonLeftIcon: 'lock',
          label: 'Confirm Password',
          placeholder: 'Confirm Password',
          required: true,
          attributes: {
            style: 'padding-left: 10px;'
          }
        },
        validators: {
          fieldMatch: {
            expression: (control: any) => {
              const password = control.root?.get('password');
              return !password || control.value === password.value;
            },
            message: 'Passwords do not match.'
          }
        }
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    this.token = this.route.snapshot.params['token'];
    
    if (!this.uid || !this.token) {
      this.showError('Invalid Link', 'The activation link is invalid or incomplete.');
      return;
    }
    
    // Set model with uid and token for form submission
    this.options.model = {
      uid: this.uid,
      token: this.token
    };
    
    // Validate token
    this.validateToken();
  }

  private validateToken(): void {
    this.isLoading = true;
    
    console.log('SetPasswordComponent: Validating token...');
    console.log('SetPasswordComponent: UID:', this.uid);
    console.log('SetPasswordComponent: Token:', this.token);
    console.log('SetPasswordComponent: API URL:', `users/activate-set-password/${this.uid}/${this.token}/`);
    
    this.http.get(`users/activate-set-password/${this.uid}/${this.token}/`)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          console.log('SetPasswordComponent: Token validation response:', res);
          
          // Handle various success response formats
          if (res.count === 1 || res.count === '1' || res.success === true || res.valid === true || res.status === 'valid' || res.data) {
            this.isTokenValid = true;
            console.log('SetPasswordComponent: Token is VALID');
          } else {
            console.log('SetPasswordComponent: Token validation failed - unexpected response format');
            this.showError('Invalid Link', res.message || res.msg || 'This activation link is invalid.');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('SetPasswordComponent: Token validation ERROR:', error);
          console.error('SetPasswordComponent: Error status:', error.status);
          console.error('SetPasswordComponent: Error body:', error.error);
          
          const errorMsg = error.error?.message || error.error?.msg || error.error?.detail || 'This activation link is invalid or has expired.';
          
          if (errorMsg.toLowerCase().includes('expired')) {
            this.showError('Link Expired', 'This activation link has expired. Please contact your administrator for a new link.');
          } else if (errorMsg.toLowerCase().includes('already')) {
            this.showError('Already Activated', 'This account has already been activated. Please login.');
          } else {
            this.showError('Invalid Link', errorMsg);
          }
        }
      });
  }

  private showError(title: string, message: string): void {
    this.isTokenValid = false;
    this.isLoading = false;
    this.errorTitle = title;
    this.errorMessage = message;
  }

  private onPasswordSet(res: any): void {
    this.isSuccess = true;
    this.message.success('Account activated successfully! Redirecting to login...');
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 2000);
  }

  // Password strength helper for UI hints
  getPasswordStrength(password: string): { valid: boolean; checks: any } {
    const checks = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasDigit: /[0-9]/.test(password)
    };
    
    const valid = checks.minLength && checks.hasUppercase && checks.hasLowercase && checks.hasDigit;
    
    return { valid, checks };
  }
}
