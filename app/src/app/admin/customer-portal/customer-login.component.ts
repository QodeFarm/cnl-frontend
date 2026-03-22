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
          
          console.log('Customer login successful');
          
          // Redirect to customer portal dashboard (relative URL)
          window.location.href = '/#/customer-portal/dashboard';
        } else {
          this.errorMessage = 'Invalid response from server';
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
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }
}