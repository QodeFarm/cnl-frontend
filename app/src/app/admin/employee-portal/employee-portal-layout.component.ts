// employee-portal-layout.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-portal-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="portal-container">
      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="isSidebarOpen">
        <div class="sidebar-header">
          <div class="logo">
            <div class="logo-main">C&L</div>
            <div class="logo-sub">Employee Portal</div>
          </div>
        </div>

        <!-- User Profile Section -->
        <div class="user-profile">
          <div class="avatar">
            {{ employeeInitials }}
          </div>
          <div class="user-info">
            <h4>{{ employeeName }}</h4>
            <p>{{ employeeDesignation || 'Employee' }}</p>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="sidebar-nav">
          <ul class="nav-menu">
            <li class="nav-item">
              <a routerLink="/employee-portal/dashboard" routerLinkActive="active" class="nav-link">
                <div class="nav-icon">
                  <i class="fas fa-tachometer-alt"></i>
                </div>
                <div class="nav-label">Dashboard</div>
              </a>
            </li>
            
            <li class="nav-item">
              <a routerLink="/employee-portal/my-profile" routerLinkActive="active" class="nav-link">
                <div class="nav-icon">
                  <i class="fas fa-user-circle"></i>
                </div>
                <div class="nav-label">My Profile</div>
              </a>
            </li>
          </ul>

          <div class="nav-divider">HR MANAGEMENT</div>
          
          <ul class="nav-menu">
            <li class="nav-item">
              <a routerLink="/employee-portal/my-leaves" routerLinkActive="active" class="nav-link">
                <div class="nav-icon">
                  <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="nav-label">My Leaves</div>
              </a>
            </li>
            
            <li class="nav-item">
              <a routerLink="/employee-portal/apply-leave" routerLinkActive="active" class="nav-link">
                <div class="nav-icon">
                  <i class="fas fa-plus-circle"></i>
                </div>
                <div class="nav-label">Apply Leave</div>
              </a>
            </li>
            
            <li class="nav-item">
              <a routerLink="/employee-portal/attendance" routerLinkActive="active" class="nav-link">
                <div class="nav-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="nav-label">Attendance</div>
              </a>
            </li>
            
            <li class="nav-item">
              <a routerLink="/employee-portal/leave-balance" routerLinkActive="active" class="nav-link">
                <div class="nav-icon">
                  <i class="fas fa-balance-scale"></i>
                </div>
                <div class="nav-label">Leave Balance</div>
              </a>
            </li>
          </ul>

          <div class="nav-divider">FINANCE</div>
          
          <ul class="nav-menu">
            <li class="nav-item">
              <a routerLink="/employee-portal/salary" routerLinkActive="active" class="nav-link">
                <div class="nav-icon">
                  <i class="fas fa-rupee-sign"></i>
                </div>
                <div class="nav-label">Salary Details</div>
              </a>
            </li>
            
            <li class="nav-item">
              <a routerLink="/employee-portal/salary-slips" routerLinkActive="active" class="nav-link">
                <div class="nav-icon">
                  <i class="fas fa-file-invoice-dollar"></i>
                </div>
                <div class="nav-label">Salary Slips</div>
              </a>
            </li>
          </ul>

          <div class="nav-divider">OTHER</div>
          
          <ul class="nav-menu">
            <li class="nav-item">
              <a routerLink="/employee-portal/documents" routerLinkActive="active" class="nav-link">
                <div class="nav-icon">
                  <i class="fas fa-folder"></i>
                </div>
                <div class="nav-label">Documents</div>
              </a>
            </li>
            
            <li class="nav-item">
              <a routerLink="/employee-portal/calendar" routerLinkActive="active" class="nav-link">
                <div class="nav-icon">
                  <i class="fas fa-calendar-check"></i>
                </div>
                <div class="nav-label">Calendar</div>
              </a>
            </li>
          </ul>
        </div>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <div class="time-display">
            <i class="fas fa-clock"></i>
            <span>{{ currentTime }}</span>
          </div>
          <button class="logout-btn" (click)="logout()" style="cursor: pointer; z-index: 1000; position: relative;">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Content Header -->
        <div class="content-header">
          <div class="header-left">
            <button class="menu-toggle" (click)="toggleSidebar()">
              <i class="fas fa-bars"></i>
            </button>
            <h1>{{ pageTitle }}</h1>
          </div>
          <div class="header-right">
            <div class="notification-badge" (click)="toggleNotifications()">
              <i class="fas fa-bell"></i>
              <span class="badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
            </div>
            <div class="header-user" (click)="toggleUserMenu()">
              <div class="avatar-small">{{ employeeInitials }}</div>
              <span class="user-name">{{ employeeName }}</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="dropdown-menu" *ngIf="showUserMenu">
              <a routerLink="/employee-portal/my-profile">
                <i class="fas fa-user"></i> My Profile
              </a>
              <a routerLink="/employee-portal/settings">
                <i class="fas fa-cog"></i> Settings
              </a>
              <hr>
              <a (click)="logout()" style="color: #ef4444;">
                <i class="fas fa-sign-out-alt"></i> Logout
              </a>
            </div>
          </div>
        </div>

        <!-- Content Body -->
        <div class="content-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* Portal Container - Full width */
    .portal-container {
      display: flex;
      width: 100%;
      min-height: 100vh;
      background: #2a3a6e;
    }

    /* Sidebar - Full height - Navy Blue Background */
    /* Sidebar - Full height - Navy Blue Background */
    .sidebar {
      width: 260px;
      min-width: 260px;
      background: #2a3a6e;
      color: white;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: hidden;  /* Change from 'auto' to 'hidden' - let child handle scroll */
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      z-index: 100;
    }

    /* Custom scrollbar for sidebar-nav */
    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Firefox scrollbar */
    .sidebar-nav {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
    }

    /* Sidebar Header */
    .sidebar-header {
      padding: 32px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: #2a3a6e;
      text-align: center;
    }

    .logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .logo-main {
      font-size: 32px;
      font-weight: 700;
      color: white;
      letter-spacing: 2px;
      line-height: 1.2;
    }

    .logo-sub {
      font-size: 12px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* User Profile Section */
    .user-profile {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: #2a3a6e;
    }

    .avatar {
      width: 48px;
      height: 48px;
      background: #2a3a6e;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
      color: white;
      flex-shrink: 0;
    }

    .user-info h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      color: white;
    }

    .user-info p {
      margin: 0;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.6);
    }

    /* Navigation Menu */
    .sidebar-nav {
      flex: 1;
      padding: 20px 16px;
      background: #2a3a6e;
      overflow-y: scroll; /* Use 'scroll' instead of 'auto' to always show scrollbar */
      overflow-x: hidden;
      max-height: calc(100vh - 200px);
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      margin: 0;
    }

    .nav-divider {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.4);
      padding: 16px 12px 8px 12px;
      margin-top: 8px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 12px;
      margin: 2px 0;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s ease;
      cursor: pointer;
      width: 100%;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    .nav-link.active {
      background: rgba(255, 180, 71, 0.15);
      color: #ffb347;
    }

    .nav-link.active .nav-icon i {
      color: #ffb347;
    }

    .nav-link.active .nav-label {
      color: #ffb347;
      font-weight: 500;
    }

    .nav-icon {
      width: 22px;
      min-width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .nav-icon i {
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
    }

    .nav-link:hover .nav-icon i {
      color: white;
    }

    .nav-link.active .nav-icon i {
      color: #ffb347;
    }

    .nav-label {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: rgba(255, 255, 255, 0.7);
      flex: 1;
    }

    .nav-link:hover .nav-label {
      color: white;
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 20px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin-top: auto;
      background: #2a3a6e;
    }

    .time-display {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }

    .time-display i {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }

    .logout-btn {
      width: 100%;
      padding: 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
      border-radius: 8px;
      cursor: pointer !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      font-size: 13px;
      font-weight: 500;
      pointer-events: auto !important;
      position: relative;
      z-index: 100;
    }

    .logout-btn:hover {
      background: rgba(255, 180, 71, 0.15);
      border-color: rgba(255, 180, 71, 0.3);
      color: #ffb347;
    }

    .logout-btn:hover i {
      color: #ffb347;
    }

    .logout-btn i {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      background: #f5f7fb;
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Content Header */
    .content-header {
      background: white;
      color: #2a3a6e;
      height: 60px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 0;
      z-index: 99;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .menu-toggle {
      background: none;
      border: none;
      font-size: 18px;
      color: #2a3a6e;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      display: none;
      transition: background 0.2s;
    }

    .menu-toggle:hover {
      background: #f0f2f5;
    }

    .content-header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #2a3a6e;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
      position: relative;
    }

    .notification-badge {
      position: relative;
      cursor: pointer;
      padding: 6px;
    }

    .notification-badge i {
      font-size: 18px;
      color: #6b7280;
    }

    .notification-badge .badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #ffb347;
      color: white;
      font-size: 9px;
      padding: 2px 5px;
      border-radius: 10px;
      min-width: 16px;
      text-align: center;
    }

    .header-user {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .header-user:hover {
      background: #f0f2f5;
    }

    .user-name {
      font-size: 13px;
      font-weight: 500;
      color: #2a3a6e;
    }

    .header-user i {
      color: #6b7280;
      font-size: 12px;
    }

    .avatar-small {
      width: 32px;
      height: 32px;
      background: #2a3a6e;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 13px;
      color: white;
    }

    /* Content Body */
    .content-body {
      padding: 24px;
      flex: 1;
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
      box-sizing: border-box;
    }

    /* Dropdown Menu */
    .dropdown-menu {
      position: absolute;
      top: 50px;
      right: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      z-index: 1000;
      overflow: hidden;
    }

    .dropdown-menu a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      color: #4a5568;
      text-decoration: none;
      transition: background 0.2s;
      cursor: pointer;
    }

    .dropdown-menu a:hover {
      background: #f5f7fb;
    }

    .dropdown-menu hr {
      margin: 8px 0;
      border: none;
      border-top: 1px solid #e2e8f0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
      
      .main-content {
        margin-left: 0;
        width: 100%;
      }
      
      .menu-toggle {
        display: block;
      }
      
      .content-body {
        padding: 16px;
      }
    }

    @media (max-width: 480px) {
      .content-body {
        padding: 12px;
      }
      
      .content-header {
        padding: 0 16px;
      }
      
      .user-name {
        display: none;
      }
    }

    /* Scrollbar */
    .sidebar::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    .sidebar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    * {
      box-sizing: border-box;
    }
  `]
})
export class EmployeePortalLayoutComponent implements OnInit {
  isSidebarOpen = false;
  showUserMenu = false;
  showNotifications = false;
  notificationCount = 3;
  employeeName = '';
  employeeId = '';
  employeeDesignation = '';
  employeeInitials = '';
  currentTime = '';
  pageTitle = 'Dashboard';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  // employee-portal-layout.component.ts
// Update the ngOnInit method

ngOnInit() {
  // Check if employee is logged in using EMPLOYEE specific keys
  const isEmployeeLoggedIn = localStorage.getItem('employee_logged_in');
  const employeeUser = localStorage.getItem('employee_user');
  const employeeType = localStorage.getItem('employee_type');
  
  if (!isEmployeeLoggedIn || !employeeUser || employeeType !== 'employee') {
    this.router.navigate(['/employee-portal/login']);
    return;
  }
  
  this.loadEmployeeData();
  
  this.router.events.subscribe(() => {
    this.updatePageTitle();
  });
}

  // Method to load employee data (defined properly)
  loadEmployeeData() {
    // Use EMPLOYEE specific keys
    const user = localStorage.getItem('employee_user');
    if (user) {
      const userData = JSON.parse(user);
      this.employeeName = userData.name || 'Employee';
      this.employeeId = userData.id || '';
      this.employeeDesignation = userData.designation || 'Employee';
      this.employeeInitials = this.getInitials(this.employeeName);
    }
    
    // Fetch latest employee data from API
    if (this.employeeId) {
      this.fetchLatestEmployeeData();
    }
  }

  checkAuthentication() {
    // Use EMPLOYEE specific key
    const userType = localStorage.getItem('employee_type');
    const user = localStorage.getItem('employee_user');
    
    if (!user || userType !== 'employee') {
      this.router.navigate(['/employee-portal/login']);
      return;
    }
    
    // Load employee data
    this.loadEmployeeData();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n: string) => n.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // employee-portal-layout.component.ts

// Fix this method - remove or comment out the conflicting code
fetchLatestEmployeeData() {
  const apiUrl = `hrms/employees/${this.employeeId}/`;
  
  this.http.get(apiUrl).subscribe({
    next: (res: any) => {
      if (res && res.data) {
        const employee = res.data;
        this.employeeName = employee.full_name || this.employeeName;
        this.employeeDesignation = employee.designation?.title || this.employeeDesignation;
        this.employeeInitials = this.getInitials(this.employeeName);
        
        // Update ONLY employee-specific localStorage - NOT 'user'
        const empUser = JSON.parse(localStorage.getItem('employee_user') || '{}');
        empUser.name = this.employeeName;
        empUser.designation = this.employeeDesignation;
        localStorage.setItem('employee_user', JSON.stringify(empUser));
        
        // REMOVE or COMMENT this line - it's causing the conflict
        // const user = JSON.parse(localStorage.getItem('user') || '{}');
        // user.name = this.employeeName;
        // user.designation = this.employeeDesignation;
        // localStorage.setItem('user', JSON.stringify(user));
      }
    },
    error: (err) => {
      console.error('Error fetching employee details:', err);
    }
  });
}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.header-user') && !target.closest('.dropdown-menu')) {
      this.showUserMenu = false;
    }
    if (!target.closest('.notification-badge')) {
      this.showNotifications = false;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  updatePageTitle() {
    const url = this.router.url;
    if (url.includes('dashboard')) this.pageTitle = 'Dashboard';
    else if (url.includes('my-profile')) this.pageTitle = 'My Profile';
    else if (url.includes('my-leaves')) this.pageTitle = 'My Leaves';
    else if (url.includes('apply-leave')) this.pageTitle = 'Apply Leave';
    else if (url.includes('attendance')) this.pageTitle = 'Attendance';
    else if (url.includes('leave-balance')) this.pageTitle = 'Leave Balance';
    else if (url.includes('salary') && !url.includes('slips')) this.pageTitle = 'Salary Details';
    else if (url.includes('salary-slips')) this.pageTitle = 'Salary Slips';
    else if (url.includes('documents')) this.pageTitle = 'Documents';
    else if (url.includes('calendar')) this.pageTitle = 'Calendar';
    else this.pageTitle = 'Employee Portal';
  }

  logout() {
    // Call logout API
    this.http.post('hrms/employee/logout/', {}, {
      withCredentials: true
    }).subscribe({
      next: (res: any) => {
        console.log('Logout successful:', res);
        this.clearLocalStorageAndRedirect();
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still clear localStorage even if API fails
        this.clearLocalStorageAndRedirect();
      }
    });
  }

  clearLocalStorageAndRedirect() {
    // Clear only EMPLOYEE specific localStorage data
    localStorage.removeItem('employee_user');
    localStorage.removeItem('employee_type');
    localStorage.removeItem('employee_id');
    localStorage.removeItem('employee_name');
    localStorage.removeItem('employee_email');
    localStorage.removeItem('employee_designation');
    localStorage.removeItem('employee_department');
    localStorage.removeItem('employee_logged_in');
    localStorage.removeItem('rememberedEmployeeUsername');
    
    // DO NOT clear admin/customer keys
    // Keep: 'user', 'user_type', 'customer_*' etc.
    
    // Navigate to login page
    this.router.navigate(['/employee-portal/login']);
  }

}