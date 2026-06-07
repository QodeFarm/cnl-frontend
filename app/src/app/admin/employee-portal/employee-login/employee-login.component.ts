// employee-login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-login.component.html',
  styleUrls: ['./employee-login.component.scss']
})
export class EmployeeLoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  message: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router, 
    private http: HttpClient
  ) {}

  // ngOnInit() {
  //   // Clear any existing login data first
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('user_type');
  //   localStorage.removeItem('user_id');
  //   localStorage.removeItem('user_name');
  //   localStorage.removeItem('user_email');
    
  //   // Load remembered username if exists (but don't auto-login)
  //   const rememberedUser = localStorage.getItem('rememberedEmployeeUsername');
  //   if (rememberedUser) {
  //     this.username = rememberedUser;
  //   }
  // }

  ngOnInit() {
    // DO NOT clear admin/customer keys - they are separate portals!
    // Only load remembered employee username if exists
    const rememberedUser = localStorage.getItem('rememberedEmployeeUsername');
    if (rememberedUser) {
      this.username = rememberedUser;
    }
    
    // Optional: Check if employee is already logged in
    const isEmployeeLoggedIn = localStorage.getItem('employee_logged_in');
    const employeeUser = localStorage.getItem('employee_user');
    
    if (isEmployeeLoggedIn === 'true' && employeeUser) {
      this.router.navigate(['/employee-portal/dashboard']);
    }
  }

  // onSubmit() {
  //   this.errorMessage = '';
  //   this.loading = true;
    
  //   if (!this.username || !this.password) {
  //     this.errorMessage = 'Please enter both username and password';
  //     this.loading = false;
  //     return;
  //   }

  //   console.log('Attempting login with:', this.username);
    
  //   // CALL YOUR REAL LOGIN API
  //   this.http.post('hrms/employee/login/', {
  //     username: this.username,
  //     password: this.password
  //   }).subscribe({
  //     next: (res: any) => {
  //       this.loading = false;
  //       console.log('Login response:', res);
        
  //       if (res.success && res.employee) {
  //         // Store employee data
  //         localStorage.setItem('user', JSON.stringify(res.employee));
  //         localStorage.setItem('user_id', res.employee.id);
  //         localStorage.setItem('user_name', res.employee.name);
  //         localStorage.setItem('user_email', res.employee.email);
  //         localStorage.setItem('user_type', 'employee');
  //         localStorage.setItem('user_designation', res.employee.designation || '');
  //         localStorage.setItem('user_department', res.employee.department || '');
          
  //         if (this.username) {
  //           localStorage.setItem('rememberedEmployeeUsername', this.username);
  //         }
          
  //         // Redirect to dashboard
  //         this.router.navigate(['/employee-portal/dashboard']);
  //       } else {
  //         this.errorMessage = res.message || 'Login failed';
  //       }
  //     },
  //     error: (error) => {
  //       this.loading = false;
  //       console.error('Login error:', error);
        
  //       if (error.status === 401) {
  //         this.errorMessage = 'Invalid username or password';
  //       } else if (error.status === 404) {
  //         this.errorMessage = 'Login service not found. Please check backend.';
  //       } else {
  //         this.errorMessage = error.error?.message || 'Login failed. Please try again.';
  //       }
  //     }
  //   });
  // }

  // employee-login.component.ts
  onSubmit() {
    this.errorMessage = '';
    this.loading = true;
    
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      this.loading = false;
      return;
    }

    console.log('Attempting login with:', this.username);
    
    this.http.post('hrms/employee/login/', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('Login response:', res);
        
        if (res.success && res.employee) {
          // Use EMPLOYEE specific keys
          localStorage.setItem('employee_user', JSON.stringify(res.employee));
          localStorage.setItem('employee_id', res.employee.id);
          localStorage.setItem('employee_name', res.employee.name);
          localStorage.setItem('employee_email', res.employee.email);
          localStorage.setItem('employee_type', 'employee');
          localStorage.setItem('employee_designation', res.employee.designation || '');
          localStorage.setItem('employee_department', res.employee.department || '');
          localStorage.setItem('employee_logged_in', 'true');
          
          if (this.username) {
            localStorage.setItem('rememberedEmployeeUsername', this.username);
          }
          
          // Redirect to employee dashboard
          this.router.navigate(['/employee-portal/dashboard']);
        } else {
          this.errorMessage = res.message || 'Login failed';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.message = '';
  }

  forgotPassword() {
    this.message = 'Contact HR department to reset password';
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  goToCustomerPortal() {
    this.router.navigate(['/customer_portal_login']);
  }
}