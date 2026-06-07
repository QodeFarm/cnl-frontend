import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminCommmonModule],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  isEmployeePortal: boolean = false;
  employeeId: string = '';
  loading: boolean = true;
  isEditing: boolean = false;
  
  // Toast properties
  showToastMessage: boolean = false;
  toastMessage: string = '';
  toastType: string = 'success';
  
  // Employee data
  employeeData: any = {
    first_name: '',
    last_name: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    date_of_birth: '',
    nationality: '',
    emergency_contact: '',
    emergency_contact_relationship: '',
    designation: '',
    department: '',
    hire_date: '',
    username: '',
    last_login: '',
    created_at: ''
  };

  // Leave balance data
  leaveBalances: any[] = [];

  // Original data for cancel
  originalData: any = {};

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if this is employee portal
    this.route.data.subscribe(data => {
      this.isEmployeePortal = data['employeeView'] || false;
      
      if (this.isEmployeePortal) {
        // Get employee ID from localStorage
        const user = JSON.parse(localStorage.getItem('employee_user') || '{}');
        this.employeeId = user.id || null;
        
        console.log('Employee Portal Mode - Employee ID:', this.employeeId);
        
        // Load employee profile
        this.loadEmployeeProfile();
      }
    });
  }

  loadEmployeeProfile() {
    if (!this.employeeId) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.http.get(`hrms/employees/${this.employeeId}/`).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.data) {
          // Extract employee data from the response
          const emp = res.data.employee || res.data;
          
          this.employeeData = {
            employee_id: emp.employee_id,
            first_name: emp.first_name || '',
            last_name: emp.last_name || '',
            full_name: emp.full_name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim(),
            email: emp.email || '',
            phone: emp.phone || '',
            address: emp.address || '',
            gender: emp.gender || '',
            date_of_birth: emp.date_of_birth || '',
            nationality: emp.nationality || '',
            emergency_contact: emp.emergency_contact || '',
            emergency_contact_relationship: emp.emergency_contact_relationship || '',
            designation: emp.designation?.designation_name || emp.designation || '',
            department: emp.department?.department_name || emp.department || '',
            hire_date: emp.hire_date || '',
            username: emp.username || '',
            last_login: emp.last_login || 'Never',
            created_at: emp.created_at || '',
            picture: emp.picture || null
          };
          
          // Get leave balances if available
          if (res.data.employee_leave_balance && Array.isArray(res.data.employee_leave_balance)) {
            this.leaveBalances = res.data.employee_leave_balance;
          }
          
          this.originalData = { ...this.employeeData };
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading employee profile:', err);
        this.showToast('Error loading profile', 'error');
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Cancel editing - restore original data
      this.employeeData = { ...this.originalData };
    }
  }

  saveProfile() {
    this.loading = true;
    
    const updateData = {
      employee: {
        first_name: this.employeeData.first_name,
        last_name: this.employeeData.last_name,
        email: this.employeeData.email,
        phone: this.employeeData.phone,
        address: this.employeeData.address,
        gender: this.employeeData.gender,
        date_of_birth: this.employeeData.date_of_birth,
        nationality: this.employeeData.nationality,
        emergency_contact: this.employeeData.emergency_contact,
        emergency_contact_relationship: this.employeeData.emergency_contact_relationship
      }
    };

    this.http.put(`hrms/employees/${this.employeeId}/`, updateData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.isEditing = false;
        this.showToast('Profile updated successfully!');
        this.loadEmployeeProfile(); // Reload fresh data
      },
      error: (err) => {
        this.loading = false;
        console.error('Error updating profile:', err);
        this.showToast('Error updating profile', 'error');
      }
    });
  }

  showToast(message: string, type: string = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastMessage = true;
    
    setTimeout(() => {
      this.showToastMessage = false;
    }, 3000);
  }

  getInitials(): string {
    if (this.employeeData.full_name) {
      return this.employeeData.full_name
        .split(' ')
        .map((n: string) => n.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (this.employeeData.first_name) {
      return `${this.employeeData.first_name.charAt(0)}${this.employeeData.last_name?.charAt(0) || ''}`.toUpperCase();
    }
    return 'U';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  goBack() {
    this.router.navigate(['/employee-portal/dashboard']);
  }

  getLeavePercentage(leave: any): number {
    const maxDays = leave.leave_type?.max_days_allowed || 30;
    const balance = parseFloat(leave.leave_balance) || 0;
    return (balance / maxDays) * 100;
    }
}