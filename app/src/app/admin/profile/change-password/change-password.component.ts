
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HelpIconComponent } from '../../help/help-icon.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, HelpIconComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  // Force password change flag
  isForcePasswordChange: boolean = false;

  // Password strength
  passwordStrength: string = '';
  passwordStrengthClass: string = '';

  // Form options for ta-form
  options: any = {
    url: "users/change_password/",
    submit: {
      label: "Change Password",
      icon: 'lock',
      successMsg: "Password changed successfully!",
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
            key: 'old_password',
            type: 'input',
            className: 'col-12 mb-2',
            templateOptions: {
              label: 'Old Password',
              type: 'password',
              placeholder: 'Enter your current password',
              required: true,
              description: 'Enter the password you currently use to login.',
            }
          },
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
              label: 'Confirm New Password',
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if this is a forced password change
    this.isForcePasswordChange = localStorage.getItem('force_password_change') === 'true';
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

  // Handle Cancel button
  onCancel(): void {
    if (this.isForcePasswordChange) {
      // Can't cancel if forced to change password
      return;
    }
    this.router.navigateByUrl('/admin/profile');
  }

  // Handle successful password change
  onPasswordChanged(res: any): void {
    // Clear the force_password_change flag after successful password change
    if (this.isForcePasswordChange) {
      localStorage.setItem('force_password_change', 'false');
      this.isForcePasswordChange = false;
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        this.router.navigateByUrl('/admin/dashboard');
      }, 1500);
    }
  }
}
