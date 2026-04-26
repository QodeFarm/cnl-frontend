import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { CustomerPortalService } from '../services/customer-portal.service';

@Component({
  selector: 'app-customer-reset-password',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './customer-reset-password.component.html',
  styleUrls: ['./customer-reset-password.component.scss']
})
export class CustomerResetPasswordComponent implements OnInit {
  
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  isLoading: boolean = false;
  isValidToken: boolean = false;
  isTokenValidated: boolean = false;
  isPasswordReset: boolean = false;
  
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  
  errorMessage: string = '';
  successMessage: string = '';
  
  // Validation flags
  isValidLength: boolean = false;
  hasNumber: boolean = false;
  hasLetter: boolean = false;
  passwordsMatch: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerPortalService: CustomerPortalService
  ) { }
  
  ngOnInit(): void {
    console.log('Full URL:', window.location.href);
    console.log('Route URL:', this.router.url);
    
    this.token = this.route.snapshot.paramMap.get('token') || '';
    console.log('Token from paramMap:', this.token);
    
    if (!this.token) {
        const urlPath = window.location.pathname;
        console.log('URL Pathname:', urlPath);
        const tokenMatch = urlPath.match(/\/reset-password\/([^\/]+)/);
        console.log('Token from regex:', tokenMatch);
        if (tokenMatch && tokenMatch[1]) {
            this.token = tokenMatch[1];
        }
    }
    
    console.log('Final Token:', this.token);
    // ✅ Method 1: Get token from route params
    this.token = this.route.snapshot.paramMap.get('token') || '';
    
    // ✅ Method 2: Get token from URL path (alternative)
    if (!this.token) {
      const url = this.router.url;
      const matches = url.match(/\/reset-password\/([^\/]+)/);
      if (matches && matches[1]) {
        this.token = matches[1];
      }
    }
    
    console.log('Token extracted:', this.token); // Debug log
    
    if (this.token) {
      // First, validate the token with backend
      this.validateToken();
    } else {
      this.errorMessage = 'Invalid reset link. No token found.';
      this.isTokenValidated = true;
      this.isValidToken = false;
    }
  }
  
  validateToken(): void {
    this.isTokenValidated = false;
    
    // Call backend to validate token
    this.customerPortalService.validateResetToken(this.token).subscribe({
      next: (response: any) => {
        console.log('Token validation response:', response);
        this.isValidToken = true;
        this.isTokenValidated = true;
      },
      error: (error: any) => {
        console.error('Token validation error:', error);
        this.isValidToken = false;
        this.isTokenValidated = true;
        this.errorMessage = error.error?.msg || 'Invalid or expired reset link. Please request a new one.';
      }
    });
  }
  
  onPasswordChange(): void {
    this.isValidLength = this.newPassword.length >= 6;
    this.hasNumber = /[0-9]/.test(this.newPassword);
    this.hasLetter = /[a-zA-Z]/.test(this.newPassword);
    this.checkPasswordsMatch();
  }
  
  onConfirmPasswordChange(): void {
    this.checkPasswordsMatch();
  }
  
  checkPasswordsMatch(): void {
    this.passwordsMatch = this.newPassword === this.confirmPassword && this.newPassword !== '';
  }
  
  isPasswordValid(): boolean {
    return this.isValidLength && this.hasNumber && this.hasLetter && this.passwordsMatch;
  }
  
  onSubmit(): void {
    this.errorMessage = '';
    
    if (!this.isPasswordValid()) {
      this.errorMessage = 'Please meet all password requirements';
      return;
    }
    
    this.isLoading = true;
    
    this.customerPortalService.resetPassword(this.token, this.newPassword, this.confirmPassword).subscribe({
      next: (response: any) => {
        console.log('Reset password response:', response);
        this.isLoading = false;
        this.isPasswordReset = true;
        this.successMessage = response.msg || 'Password reset successful! Redirecting to login...';
        
        // Clear stored data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        setTimeout(() => {
          this.router.navigateByUrl('/customer-portal/login');
        }, 3000);
      },
      error: (error: any) => {
        console.error('Reset password error:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.msg || 'Failed to reset password. Please try again.';
      }
    });
  }
  
  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirm') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }
  
  goToLogin(): void {
    this.router.navigateByUrl('/customer-portal/login');
  }
  
  requestNewLink(): void {
    this.router.navigateByUrl('/customer-portal/forgot-password');
  }
  
  clearError(): void {
    this.errorMessage = '';
  }
}
