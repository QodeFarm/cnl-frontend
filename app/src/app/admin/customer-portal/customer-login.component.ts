import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  loading: boolean = false;
  message: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    this.message = urlParams.get('message') || '';
  }

  ngOnInit() {
    // Check if already logged in
    const user = localStorage.getItem('user');
    const userType = localStorage.getItem('user_type');
    if (user && userType === 'customer') {
      this.router.navigate(['/customer-portal/dashboard']);
    }
    
    // Load remembered username if exists
    const rememberedUser = localStorage.getItem('rememberedUsername');
    if (rememberedUser) {
      this.username = rememberedUser;
    }
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    
    this.http.post('customers/portal/login/', {
      username: this.username,
      password: this.password
    }, {
      withCredentials: true
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.customer) {
          // Store customer data
          localStorage.setItem('user', JSON.stringify(res.customer));
          localStorage.setItem('user_id', res.customer.id);
          localStorage.setItem('user_name', res.customer.name);
          localStorage.setItem('user_type', 'customer');
          
          // Store remember me
          localStorage.setItem('rememberedUsername', this.username);
          
          if (res.token) {
            localStorage.setItem('auth_token', res.token);
          }
          
          // Redirect to customer portal dashboard
          this.router.navigate(['/customer-portal/dashboard']);
        } else {
          this.errorMessage = res.message || 'Invalid response from server';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else if (error.status === 403) {
          this.errorMessage = 'Your account is not activated. Please contact administrator.';
        } else if (error.status === 0) {
          this.errorMessage = 'Network error. Please check your connection.';
        } else {
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.message = '';
    
    // Optional: Clear remembered username from localStorage
    // localStorage.removeItem('rememberedUsername');
    
    // Set focus to username field
    setTimeout(() => {
      const usernameInput = document.getElementById('username') as HTMLInputElement;
      if (usernameInput) {
        usernameInput.focus();
      }
    }, 100);
  }

  forgotPassword() {
    if (this.username) {
      localStorage.setItem('reset_username', this.username);
    }
    this.router.navigate(['/customer-portal/forgot-password']);
  }
}