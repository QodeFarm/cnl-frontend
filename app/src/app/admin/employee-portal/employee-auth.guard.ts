// employee-auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class EmployeeAuthGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check ONLY employee specific keys
    const isEmployeeLoggedIn = localStorage.getItem('employee_logged_in');
    const employeeUser = localStorage.getItem('employee_user');
    const employeeType = localStorage.getItem('employee_type');
    
    if (isEmployeeLoggedIn === 'true' && employeeUser && employeeType === 'employee') {
      return true;
    }
    
    this.router.navigate(['/employee-portal/login']);
    return false;
  }
}