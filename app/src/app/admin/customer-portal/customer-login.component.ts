import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TaLocalStorage } from '@ta/ta-core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css']
})
export class CustomerLoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loading: boolean = false;
  message: string = '';
  errorMessage: string = '';
  currentDomain: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    this.message = urlParams.get('message') || '';
  }

  ngOnInit() {
    // Get current domain for logging/debugging
    this.currentDomain = window.location.hostname;
    console.log('Customer Login Page - Current Domain:', this.currentDomain);
    console.log('Full URL:', window.location.href);
    
    // Check if already logged in
    const user = localStorage.getItem('user');
    const userType = localStorage.getItem('user_type');
    if (user && userType === 'customer') {
      this.router.navigate(['/customer-portal/dashboard']);
    }
    
    // Load remembered username
    const rememberedUser = localStorage.getItem('rememberedUsername');
    if (rememberedUser) {
      this.username = rememberedUser;
      this.rememberMe = true;
    }
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    
    // Use relative URL - the interceptor will handle the base URL
    this.http.post('customers/portal/login/', {
      username: this.username,
      password: this.password,
      remember_me: this.rememberMe
    }, {
      withCredentials: true
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.customer) {
          // Handle remember me functionality
          if (this.rememberMe) {
            localStorage.setItem('rememberedUsername', this.username);
          } else {
            localStorage.removeItem('rememberedUsername');
          }
          
          // Store customer data
          localStorage.setItem('user', JSON.stringify(res.customer));
          localStorage.setItem('user_id', res.customer.id);
          localStorage.setItem('user_name', res.customer.name);
          localStorage.setItem('user_type', 'customer');
          
          // Store token if provided
          if (res.token) {
            localStorage.setItem('auth_token', res.token);
          }
          
          // Store session expiry if provided
          if (res.expires_in) {
            const expiryTime = new Date().getTime() + (res.expires_in * 1000);
            localStorage.setItem('session_expiry', expiryTime.toString());
          }
          
          console.log('Customer login successful');
          
          // Clear any existing error message
          this.errorMessage = '';
          
          // Redirect to customer portal dashboard
          window.location.href = '/#/customer-portal/dashboard';
        } else {
          this.errorMessage = res.message || 'Invalid response from server';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        
        // Handle different error status codes
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else if (error.status === 403) {
          this.errorMessage = 'Your account is not activated. Please contact administrator.';
        } else if (error.status === 0) {
          this.errorMessage = 'Network error. Please check your connection.';
        } else if (error.status === 404) {
          this.errorMessage = 'Login service not found. Please try again later.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else if (error.status === 429) {
          this.errorMessage = 'Too many login attempts. Please try again later.';
        } else {
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
        
        // Auto-clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  forgotPassword() {
    // Store current username if exists for password reset
    if (this.username) {
      localStorage.setItem('reset_username', this.username);
    }
    // Navigate to forgot password page
    window.location.href = '/#/customer-portal/forgot-password';
  }

  // Helper method to clear error message
  clearError() {
    this.errorMessage = '';
  }
}