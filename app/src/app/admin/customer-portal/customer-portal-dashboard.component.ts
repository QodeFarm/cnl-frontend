import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-portal-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div class="welcome-content">
          <h1>Welcome back, {{ customerName }}! 👋</h1>
          <p>Here's what's happening with your account today.</p>
        </div>
        <div class="date-display">
          {{ currentDate | date:'EEEE, MMMM d, y' }}
        </div>
      </div>

      <!-- Quick Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card" (click)="navigateTo('sales-orders')">
          <div class="stat-icon orders">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-details">
            <h3>Sales Orders</h3>
            <p class="stat-number">{{ stats.salesOrders }}</p>
            <span class="stat-label">Total orders</span>
          </div>
        </div>

        <div class="stat-card" (click)="navigateTo('invoices')">
          <div class="stat-icon invoices">
            <i class="fas fa-file-invoice"></i>
          </div>
          <div class="stat-details">
            <h3>Invoices</h3>
            <p class="stat-number">{{ stats.invoices }}</p>
            <span class="stat-label">Total invoices</span>
          </div>
        </div>

        <div class="stat-card" (click)="navigateTo('returns')">
          <div class="stat-icon returns">
            <i class="fas fa-undo-alt"></i>
          </div>
          <div class="stat-details">
            <h3>Returns</h3>
            <p class="stat-number">{{ stats.returns }}</p>
            <span class="stat-label">Return requests</span>
          </div>
        </div>

        <div class="stat-card" (click)="navigateTo('credit-notes')">
          <div class="stat-icon credits">
            <i class="fas fa-credit-card"></i>
          </div>
          <div class="stat-details">
            <h3>Credit Notes</h3>
            <p class="stat-number">{{ stats.creditNotes }}</p>
            <span class="stat-label">Available credits</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button class="action-btn primary" (click)="navigateTo('sales-orders')">
            <i class="fas fa-plus-circle"></i>
            New Sales Order
          </button>
          <button class="action-btn secondary" (click)="navigateTo('profile')">
            <i class="fas fa-user-cog"></i>
            My Profile
          </button>
          <button class="action-btn secondary" (click)="navigateTo('ledger')">
            <i class="fas fa-history"></i>
            Account Ledger
          </button>
          <button class="action-btn secondary" (click)="navigateTo('downloads')">
            <i class="fas fa-download"></i>
            Downloads
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item" *ngFor="let activity of recentActivities">
            <div class="activity-icon" [ngClass]="activity.type">
              <i class="fas" [ngClass]="getActivityIcon(activity.type)"></i>
            </div>
            <div class="activity-details">
              <p class="activity-title">{{ activity.title }}</p>
              <p class="activity-time">{{ activity.time | date:'short' }}</p>
            </div>
            <div class="activity-status" [ngClass]="activity.status">
              {{ activity.status }}
            </div>
          </div>
          
          <div class="no-activity" *ngIf="recentActivities.length === 0">
            <i class="fas fa-clock"></i>
            <p>No recent activity to show</p>
          </div>
        </div>
      </div>

      <!-- Account Summary -->
      <div class="account-summary">
        <h2>Account Summary</h2>
        <div class="summary-cards">
          <div class="summary-card">
            <div class="summary-label">Credit Limit</div>
            <div class="summary-value">{{ accountSummary.creditLimit | currency:'INR' }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Outstanding</div>
            <div class="summary-value">{{ accountSummary.outstanding | currency:'INR' }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Available Credit</div>
            <div class="summary-value">{{ accountSummary.availableCredit | currency:'INR' }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Last Login</div>
            <div class="summary-value">{{ lastLogin | date:'mediumDate' || 'First time' }}</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-overlay" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
    }

    /* Welcome Banner */
    .welcome-banner {
      background: linear-gradient(135deg, #224385 0%, #2a5298 100%);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 32px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .welcome-content h1 {
      font-size: 28px;
      margin: 0 0 8px 0;
      font-weight: 600;
      color: white;
    }

    .welcome-content p {
      font-size: 16px;
      margin: 0;
      opacity: 0.9;
      color: white;
    }

    .date-display {
      font-size: 18px;
      font-weight: 500;
      opacity: 0.9;
      color: white;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid #e2e8f0;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      border-color: #224385;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-icon.orders { background: #e3f2fd; color: #1976d2; }
    .stat-icon.invoices { background: #e8f5e9; color: #388e3c; }
    .stat-icon.returns { background: #fff3e0; color: #f57c00; }
    .stat-icon.credits { background: #f3e5f5; color: #7b1fa2; }

    .stat-details h3 {
      font-size: 14px;
      color: #4a5568;
      margin: 0 0 8px 0;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      color: #1a202c;
      margin: 0;
      line-height: 1;
    }

    .stat-label {
      font-size: 12px;
      color: #718096;
    }

    /* Quick Actions */
    .quick-actions {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    .quick-actions h2 {
      font-size: 20px;
      color: #1a202c;
      margin: 0 0 20px 0;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .action-btn.primary {
      background: #224385;
      color: white;
    }

    .action-btn.primary:hover {
      background: #1a3468;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(34, 67, 133, 0.4);
    }

    .action-btn.secondary {
      background: #f7fafc;
      color: #4a5568;
      border: 1px solid #e2e8f0;
    }

    .action-btn.secondary:hover {
      background: #edf2f7;
      transform: translateY(-2px);
    }

    /* Recent Activity */
    .recent-activity {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    .recent-activity h2 {
      font-size: 20px;
      color: #1a202c;
      margin: 0 0 20px 0;
      font-weight: 600;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .activity-item:hover {
      background: #f1f5f9;
      transform: translateX(4px);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }

    .activity-icon.order { background: #e3f2fd; color: #1976d2; }
    .activity-icon.invoice { background: #e8f5e9; color: #388e3c; }
    .activity-icon.return { background: #fff3e0; color: #f57c00; }
    .activity-icon.credit { background: #f3e5f5; color: #7b1fa2; }

    .activity-details {
      flex: 1;
    }

    .activity-title {
      font-size: 16px;
      font-weight: 500;
      color: #1a202c;
      margin: 0 0 4px 0;
    }

    .activity-time {
      font-size: 12px;
      color: #718096;
      margin: 0;
    }

    .activity-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .activity-status.completed { background: #e8f5e9; color: #388e3c; }
    .activity-status.pending { background: #fff3e0; color: #f57c00; }
    .activity-status.processing { background: #e3f2fd; color: #1976d2; }

    .no-activity {
      text-align: center;
      padding: 40px;
      color: #718096;
    }

    .no-activity i {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
      color: #718096;
    }

    .no-activity p {
      margin: 0;
      color: #718096;
    }

    /* Account Summary */
    .account-summary {
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    .account-summary h2 {
      font-size: 20px;
      color: #1a202c;
      margin: 0 0 20px 0;
      font-weight: 600;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #224385;
    }

    .summary-label {
      font-size: 14px;
      color: #4a5568;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .summary-value {
      font-size: 20px;
      font-weight: 700;
      color: #1a202c;
    }

    /* Loading Overlay */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #224385;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-overlay p {
      color: #4a5568;
      font-size: 14px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .dashboard { padding: 16px; }
      
      .welcome-banner {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .action-btn {
        width: 100%;
        justify-content: center;
      }
      
      .summary-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CustomerPortalDashboardComponent implements OnInit {
  customerName: string = '';
  customerId: string = '';
  username: string = '';
  currentDate = new Date();
  lastLogin: Date | null = null;
  loading: boolean = true;
  
  stats = {
    salesOrders: 0,
    invoices: 0,
    returns: 0,
    creditNotes: 0
  };

  accountSummary = {
    creditLimit: 0,
    outstanding: 0,
    availableCredit: 0
  };

  recentActivities: any[] = [];

  constructor(private http: HttpClient) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerName = user.name || 'Customer';
    this.customerId = user.id || '';
    this.username = user.username || '';
    
    this.loadCustomerData();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadCustomerData() {
    if (!this.customerId) return;
    
    this.http.get(`customers/customer/${this.customerId}/`).subscribe({
      next: (res: any) => {
        if (res && res.data && res.data.customer_data) {
          this.lastLogin = res.data.customer_data.last_login ? new Date(res.data.customer_data.last_login) : null;
          this.accountSummary.creditLimit = res.data.customer_data.credit_limit || 0;
          this.updateAvailableCredit();
        }
      },
      error: (err) => console.error('Error loading customer data:', err)
    });
  }

  loadDashboardData() {
    if (!this.customerId) {
      this.loading = false;
      return;
    }

    Promise.all([
      this.loadSalesOrders(),
      this.loadInvoices(),
      this.loadReturns(),
      this.loadCreditNotes(),
      this.loadOutstanding()
    ]).then(() => {
      this.updateAvailableCredit();
      this.loadRecentActivity();
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  updateAvailableCredit() {
    this.accountSummary.availableCredit = this.accountSummary.creditLimit - this.accountSummary.outstanding;
  }

  loadSalesOrders(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get(`sales/sale_order/?customer_id=${this.customerId}`).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            this.stats.salesOrders = res.data.length || 0;
          }
          resolve();
        },
        error: (err) => {
          console.error('Error loading orders:', err);
          resolve();
        }
      });
    });
  }

  loadInvoices(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get(`sales/sale_invoice_order/?customer_id=${this.customerId}`).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            this.stats.invoices = res.data.length || 0;
          }
          resolve();
        },
        error: (err) => {
          console.error('Error loading invoices:', err);
          resolve();
        }
      });
    });
  }

  loadReturns(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get(`sales/sale_return_order/?customer_id=${this.customerId}`).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            this.stats.returns = res.data.length || 0;
          }
          resolve();
        },
        error: (err) => {
          console.error('Error loading returns:', err);
          resolve();
        }
      });
    });
  }

  loadCreditNotes(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get(`sales/sale_credit_notes/?customer_id=${this.customerId}`).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            this.stats.creditNotes = res.data.length || 0;
          }
          resolve();
        },
        error: (err) => {
          console.error('Error loading credit notes:', err);
          resolve();
        }
      });
    });
  }

  loadOutstanding(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get(`sales/sale_invoice_order/?customer_id=${this.customerId}`).subscribe({
        next: (res: any) => {
          if (res && res.pending_amount) {
            this.accountSummary.outstanding = res.pending_amount;
          } else if (res && res.data && res.data.pending_amount) {
            this.accountSummary.outstanding = res.data.pending_amount;
          } else {
            this.accountSummary.outstanding = 0;
          }
          resolve();
        },
        error: (err) => {
          console.error('Error loading outstanding:', err);
          resolve();
        }
      });
    });
  }

  loadRecentActivity() {
    // Combine recent items from different modules
    const activities: any[] = [];
    
    // Get recent sales orders
    this.http.get(`sales/sale_order/?customer_id=${this.customerId}&limit=5`).subscribe({
      next: (res: any) => {
        if (res && res.data && Array.isArray(res.data)) {
          res.data.forEach((order: any) => {
            activities.push({
              type: 'order',
              title: `Sales Order #${order.order_no || order.id}`,
              time: new Date(order.created_at),
              status: order.flow_status?.flow_status_name?.toLowerCase() || 'pending'
            });
          });
        }
        this.recentActivities = activities.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);
      },
      error: (err) => console.error('Error loading recent activity:', err)
    });
  }

  navigateTo(route: string) {
    window.location.href = `/#/customer-portal/${route}`;
  }

  getActivityIcon(type: string): string {
    switch(type) {
      case 'order': return 'fa-shopping-cart';
      case 'invoice': return 'fa-file-invoice';
      case 'return': return 'fa-undo-alt';
      case 'credit': return 'fa-credit-card';
      default: return 'fa-circle';
    }
  }
}