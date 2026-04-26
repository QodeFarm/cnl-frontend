import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerPortalService } from '../services/customer-portal.service';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-forgot-password',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './customer-forgot-password.component.html',
  styleUrls: ['./customer-forgot-password.component.scss']
})
export class CustomerForgotPasswordComponent {

  username: string = '';  // ✅ Changed from email to username
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  constructor(
    private router: Router,
    private customerPortalService: CustomerPortalService
  ) { }
  
  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.username) {
      this.errorMessage = 'Please enter your username';
      return;
    }
    
    this.isLoading = true;
    
    // ✅ Send username instead of email
    this.customerPortalService.forgotPassword(this.username).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.isSubmitted = true;
        this.successMessage = response.msg || 'Password reset link has been sent to your registered email.';
        
        setTimeout(() => {
          this.router.navigateByUrl('/customer-portal/login');
        }, 5000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.msg || 'Failed to send reset link. Please try again.';
      }
    });
  }
  
  goToLogin(): void {
    this.router.navigateByUrl('/customer-portal/login');
  }
  
  clearError(): void {
    this.errorMessage = '';
  }

}
