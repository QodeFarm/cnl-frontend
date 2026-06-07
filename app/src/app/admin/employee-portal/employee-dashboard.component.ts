// employee-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Welcome Banner with Gradient -->
      <div class="welcome-banner">
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>Welcome back, {{ employeeName }}! 👋</h2>
            <p>Here's what's happening with your account today.</p>
          </div>
          <div class="welcome-stats">
            <div class="mini-stat">
              <span class="mini-label">Current Time</span>
              <span class="mini-value">{{ currentTime }}</span>
            </div>
            <div class="mini-stat">
              <span class="mini-label">Today's Date</span>
              <span class="mini-value">{{ currentDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions - Modern Card Design -->
      <div class="section">
        <div class="section-header">
          <h3>Quick Actions</h3>
          <span class="section-subtitle">Frequently used features</span>
        </div>
        <div class="action-grid">
          <div class="action-card" (click)="navigateTo('apply-leave')">
            <div class="action-icon bg-blue">
              <i class="fas fa-calendar-plus"></i>
            </div>
            <div class="action-info">
              <h4>Apply Leave</h4>
              <p>Request new leave</p>
            </div>
          </div>
          <div class="action-card" (click)="navigateTo('my-profile')">
            <div class="action-icon bg-purple">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="action-info">
              <h4>My Profile</h4>
              <p>View/Edit details</p>
            </div>
          </div>
          <div class="action-card" (click)="navigateTo('attendance')">
            <div class="action-icon bg-green">
              <i class="fas fa-fingerprint"></i>
            </div>
            <div class="action-info">
              <h4>Mark Attendance</h4>
              <p>Check in/out</p>
            </div>
          </div>
          <div class="action-card" (click)="navigateTo('salary-slips')">
            <div class="action-icon bg-orange">
              <i class="fas fa-download"></i>
            </div>
            <div class="action-info">
              <h4>Downloads</h4>
              <p>Salary slips & more</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Row with Better Visuals -->
      <div class="stats-row">
        <div class="stat-card stat-card-1">
          <div class="stat-header">
            <span class="stat-title">Present Days</span>
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stat-value">{{ presentDays }}</div>
          <div class="stat-footer">
            <span class="stat-period">This Month</span>
            <span class="stat-trend positive">+{{ attendanceRate }}% vs last month</span>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" [style.width]="presentPercentage + '%'"></div>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-header">
            <span class="stat-title">Leaves Taken</span>
            <i class="fas fa-umbrella-beach"></i>
          </div>
          <div class="stat-value">{{ leavesTaken }}</div>
          <div class="stat-footer">
            <span class="stat-period">This Year</span>
            <span class="stat-trend">Remaining: {{ leaveBalance }}</span>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" [style.width]="leavesPercentage + '%'"></div>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-header">
            <span class="stat-title">Leave Balance</span>
            <i class="fas fa-balance-scale"></i>
          </div>
          <div class="stat-value">{{ leaveBalance }}</div>
          <div class="stat-footer">
            <span class="stat-period">Days Available</span>
            <span class="stat-trend">Annual: 12 days</span>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" [style.width]="balancePercentage + '%'"></div>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-header">
            <span class="stat-title">Net Salary</span>
            <i class="fas fa-rupee-sign"></i>
          </div>
          <div class="stat-value">₹{{ netSalary }}</div>
          <div class="stat-footer">
            <span class="stat-period">This Month</span>
            <span class="stat-trend positive">Credited on 1st</span>
          </div>
        </div>
      </div>

      <!-- Two Column Layout for Recent Activity & Upcoming -->
      <div class="two-col-grid">
        <!-- Recent Activity -->
        <div class="activity-card">
          <div class="card-header">
            <h3>Recent Activity</h3>
            <a (click)="viewAllActivity()" class="view-link">View All →</a>
          </div>
          <div class="timeline">
            <div class="timeline-item" *ngFor="let activity of recentActivities; let i = index">
              <div class="timeline-icon" [class]="activity.type">
                <i [class]="activity.icon"></i>
              </div>
              <div class="timeline-content">
                <div class="timeline-title">{{ activity.title }}</div>
                <div class="timeline-date">{{ activity.date }}</div>
              </div>
              <div class="timeline-status">
                <span class="status-badge" [class]="activity.status.toLowerCase()">
                  {{ activity.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Events / Calendar -->
        <div class="upcoming-card">
          <div class="card-header">
            <h3>Upcoming Events</h3>
            <a (click)="viewCalendar()" class="view-link">View Calendar →</a>
          </div>
          <div class="events-list">
            <div class="event-item" *ngFor="let event of upcomingEvents">
              <div class="event-date">
                <span class="event-day">{{ event.day }}</span>
                <span class="event-month">{{ event.month }}</span>
              </div>
              <div class="event-details">
                <h4>{{ event.title }}</h4>
                <p>{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Leave Summary Table -->
      <div class="leave-summary-card">
        <div class="card-header">
          <h3>Leave Summary - {{ currentYear }}</h3>
          <a (click)="viewAllLeaves()" class="view-link">View All Leaves →</a>
        </div>
        <div class="leave-types">
          <div class="leave-type" *ngFor="let leave of leaveTypes">
            <div class="leave-info">
              <span class="leave-name">{{ leave.name }}</span>
              <span class="leave-days">{{ leave.used }}/{{ leave.total }} days used</span>
            </div>
            <div class="leave-progress">
              <div class="progress-fill" [style.width]="(leave.used / leave.total) * 100 + '%'"
                   [style.background]="leave.color"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Welcome Banner */
    .welcome-banner {
      background: linear-gradient(135deg, #2a3a6e 0%, #2a3a6e 100%);
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 30px;
      color: white;
    }

    .welcome-content {
      display: flex;
      color: white;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .welcome-text h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      color: white;
    }

    .welcome-text p {
      margin: 0;
      opacity: 0.9;
    }

    .welcome-stats {
      display: flex;
      gap: 30px;
    }

    .mini-stat {
      text-align: center;
    }

    .mini-label {
      display: block;
      font-size: 12px;
      opacity: 0.8;
      margin-bottom: 4px;
    }

    .mini-value {
      font-size: 18px;
      font-weight: 600;
    }

    /* Section Header */
    .section {
      margin-bottom: 30px;
    }

    .section-header {
      margin-bottom: 20px;
    }

    .section-header h3 {
      margin: 0 0 5px 0;
      font-size: 18px;
      color: #1a1a2e;
    }

    .section-subtitle {
      font-size: 13px;
      color: #718096;
    }

    /* Action Grid */
    .action-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .action-card {
      background: white;
      padding: 20px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .action-icon {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .bg-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
    .bg-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
    .bg-green { background: linear-gradient(135deg, #10b981, #059669); color: white; }
    .bg-orange { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }

    .action-info h4 {
      margin: 0 0 4px 0;
      font-size: 15px;
      color: #1a1a2e;
    }

    .action-info p {
      margin: 0;
      font-size: 12px;
      color: #718096;
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .stat-title {
      font-size: 14px;
      color: #718096;
      font-weight: 500;
    }

    .stat-header i {
      font-size: 28px;
      opacity: 0.3;
    }

    .stat-value {
      font-size: 36px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 10px;
    }

    .stat-footer {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 12px;
    }

    .stat-period {
      color: #a0aec0;
    }

    .stat-trend {
      color: #10b981;
    }

    .stat-trend.positive {
      color: #10b981;
    }

    .stat-progress {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: #667eea;
      border-radius: 3px;
      transition: width 0.3s;
    }

    /* Two Column Grid */
    .two-col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .activity-card, .upcoming-card, .leave-summary-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 16px;
      color: #1a1a2e;
    }

    .view-link {
      font-size: 12px;
      color: #667eea;
      cursor: pointer;
      text-decoration: none;
    }

    .view-link:hover {
      text-decoration: underline;
    }

    /* Timeline */
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .timeline-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #f0f0f0;
    }

    .timeline-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .timeline-icon.approved { background: #e6f7e6; color: #10b981; }
    .timeline-icon.pending { background: #fff3e0; color: #f59e0b; }
    .timeline-icon.present { background: #e0f2fe; color: #3b82f6; }

    .timeline-content {
      flex: 1;
    }

    .timeline-title {
      font-size: 14px;
      font-weight: 500;
      color: #1a1a2e;
      margin-bottom: 4px;
    }

    .timeline-date {
      font-size: 11px;
      color: #a0aec0;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }

    .status-badge.approved, .status-badge.present {
      background: #e6f7e6;
      color: #10b981;
    }

    .status-badge.pending {
      background: #fff3e0;
      color: #f59e0b;
    }

    /* Events */
    .events-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .event-item {
      display: flex;
      gap: 15px;
      padding: 10px;
      background: #f7f9fc;
      border-radius: 12px;
    }

    .event-date {
      text-align: center;
      min-width: 60px;
      padding: 8px;
      background: white;
      border-radius: 10px;
    }

    .event-day {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .event-month {
      font-size: 11px;
      color: #718096;
    }

    .event-details h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #1a1a2e;
    }

    .event-details p {
      margin: 0;
      font-size: 12px;
      color: #718096;
    }

    /* Leave Types */
    .leave-types {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .leave-type {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .leave-info {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }

    .leave-name {
      font-weight: 500;
      color: #1a1a2e;
    }

    .leave-days {
      color: #718096;
    }

    .leave-progress {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .stats-row, .action-grid, .two-col-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .stats-row, .action-grid, .two-col-grid {
        grid-template-columns: 1fr;
      }
      .welcome-content {
        flex-direction: column;
        text-align: center;
      }
      .welcome-stats {
        justify-content: center;
      }
    }
  `]
})
export class EmployeeDashboardComponent implements OnInit {
  employeeName = '';
  employeeId = '';
  currentTime = '';
  currentDate = '';
  currentYear = new Date().getFullYear();
  
  // Stats from API
  presentDays = 0;
  leavesTaken = 0;
  leaveBalance = 0;
  netSalary = 0;
  
  attendanceRate = 0;
  presentPercentage = 0;
  leavesPercentage = 0;
  balancePercentage = 0;

  recentActivities: any[] = [];
  upcomingEvents: any[] = [];
  leaveTypes: any[] = [];

  loading = true;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
    
    // Get logged in employee data
    const user = localStorage.getItem('employee_user');
    if (user) {
      const userData = JSON.parse(user);
      this.employeeName = userData.name || 'Employee';
      this.employeeId = userData.id || '';
    }
    
    // Load real data from APIs
    this.loadDashboardData();
  }

  updateDateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    this.currentDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  loadDashboardData() {
    if (!this.employeeId) {
      this.loading = false;
      return;
    }

    // Load all data in parallel
    Promise.all([
      this.loadAttendanceSummary(),
      this.loadLeaveSummary(),
      this.loadSalaryData(),
      this.loadRecentActivities(),
      this.loadLeaveBalance()
    ]).finally(() => {
      this.loading = false;
    });
  }

  // employee-dashboard.component.ts

loadAttendanceSummary(): Promise<void> {
  return new Promise((resolve) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    // Use correct API URL
    this.http.get(`hrms/employee_attendance/?employee_id=${this.employeeId}&month=${currentMonth}`).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const attendances = res.data;
          this.presentDays = attendances.filter((a: any) => a.status === 'present').length;
          
          const totalWorkingDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
          this.presentPercentage = (this.presentDays / totalWorkingDays) * 100;
          this.attendanceRate = Math.round(this.presentPercentage);
        }
        resolve();
      },
      error: () => resolve()
    });
  });
}

loadLeaveSummary(): Promise<void> {
  return new Promise((resolve) => {
    const currentYear = new Date().getFullYear();
    // Use correct API URL
    this.http.get(`hrms/employee_leaves/?employee_id=${this.employeeId}&year=${currentYear}`).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const leaves = res.data;
          const approvedLeaves = leaves.filter((l: any) => l.status === 'approved');
          this.leavesTaken = approvedLeaves.length;
          
          const totalAllowedLeaves = 30;
          this.leavesPercentage = (this.leavesTaken / totalAllowedLeaves) * 100;
        }
        resolve();
      },
      error: () => resolve()
    });
  });
}

loadLeaveBalance(): Promise<void> {
  return new Promise((resolve) => {
    // Use correct API URL
    this.http.get(`hrms/employee_leave_balance/?employee_id=${this.employeeId}`).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.leaveBalance = res.data.available_days || 0;
          this.balancePercentage = (this.leaveBalance / 30) * 100;
          
          this.leaveTypes = [
            { name: 'Annual Leave', total: res.data.annual_total || 12, used: res.data.annual_used || 0, color: '#3b82f6' },
            { name: 'Casual Leave', total: res.data.casual_total || 6, used: res.data.casual_used || 0, color: '#10b981' },
            { name: 'Sick Leave', total: res.data.sick_total || 12, used: res.data.sick_used || 0, color: '#f59e0b' }
          ];
        }
        resolve();
      },
      error: () => resolve()
    });
  });
}

loadSalaryData(): Promise<void> {
  return new Promise((resolve) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    // Use correct API URL
    this.http.get(`hrms/employee_salary/?employee_id=${this.employeeId}&month=${currentMonth}`).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.netSalary = res.data.net_salary || 0;
        }
        resolve();
      },
      error: () => resolve()
    });
  });
}

loadRecentActivities(): Promise<void> {
  return new Promise((resolve) => {
    const activities: any[] = [];
    
    // Get recent leaves
    this.http.get(`hrms/employee_leaves/?employee_id=${this.employeeId}&limit=5`).subscribe({
      next: (res: any) => {
        if (res && res.data && Array.isArray(res.data)) {
          res.data.forEach((leave: any) => {
            activities.push({
              icon: 'fas fa-calendar-check',
              title: `${leave.leave_type?.leave_type_name || 'Leave'} Request`,
              date: leave.created_at?.split('T')[0] || '',
              status: leave.status?.charAt(0).toUpperCase() + leave.status?.slice(1) || 'Pending',
              type: leave.status === 'approved' ? 'approved' : 'pending'
            });
          });
        }
        
        // Get recent attendance
        this.http.get(`hrms/employee_attendance/?employee_id=${this.employeeId}&limit=5`).subscribe({
          next: (res2: any) => {
            if (res2 && res2.data && Array.isArray(res2.data)) {
              res2.data.forEach((att: any) => {
                activities.push({
                  icon: 'fas fa-clock',
                  title: `Attendance Marked - ${att.status}`,
                  date: att.date || '',
                  status: att.status?.charAt(0).toUpperCase() + att.status?.slice(1) || 'Present',
                  type: att.status === 'present' ? 'present' : 'pending'
                });
              });
            }
            
            this.recentActivities = activities
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5);
            
            resolve();
          },
          error: () => resolve()
        });
      },
      error: () => resolve()
    });
  });
}

  navigateTo(page: string) {
    this.router.navigate([`/employee-portal/${page}`]);
  }

  viewAllActivity() {
    this.router.navigate(['/employee-portal/attendance']);
  }

  viewCalendar() {
    this.router.navigate(['/employee-portal/calendar']);
  }

  viewAllLeaves() {
    this.router.navigate(['/employee-portal/my-leaves']);
  }
}