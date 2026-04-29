// customer-portal/customer-portal-layout.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-customer-portal-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-portal-layout.component.html',
  styleUrls: ['./customer-portal-layout.component.css']
})
export class CustomerPortalLayoutComponent implements OnInit, OnDestroy {
  private clockInterval: ReturnType<typeof setInterval> | null = null;
  customerName: string = '';
  customerInitials: string = '';
  pageTitle: string = 'Dashboard';
  currentTime: string = '';

  menuItems = [
    { 
      path: 'dashboard', 
      icon: 'fa-chart-pie', 
      label: 'Dashboard',
      // description: 'Overview & stats',
      active: false
    },
    { 
      path: 'profile', 
      icon: 'fa-user-circle', 
      label: 'My Profile',
      // description: 'Personal information',
      active: false
    },
    { 
      path: 'sales-orders', 
      icon: 'fa-shopping-cart', 
      label: 'Sales Orders',
      // description: 'View & create orders',
      active: false,
      badge: 3
    },
    { 
      path: 'invoices', 
      icon: 'fa-file-invoice', 
      label: 'Invoices',
      // description: 'Payment history',
      active: false,
      badge: 2
    },
    { 
      path: 'returns', 
      icon: 'fa-undo-alt', 
      label: 'Returns',
      // description: 'Return requests',
      active: false
    },
    { 
      path: 'credit-notes', 
      icon: 'fa-credit-card', 
      label: 'Credit Notes',
      // description: 'Available credits',
      active: false
    },
    { 
      path: 'ledger', 
      icon: 'fa-book-open', 
      label: 'Payment Receipts',
      // description: 'Transaction history',
      active: false
    },
    { 
      path: 'downloads', 
      icon: 'fa-download', 
      label: 'Downloads',
      // description: 'Documents & files',
      active: false
    }
  ];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    console.log('🏗️ Layout Component Constructor');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerName = user.name || user.username || 'Customer';
    
    // Generate initials for avatar
    this.customerInitials = this.customerName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    // Update page title on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.url;
      this.updateActiveMenu(url);
      this.updatePageTitle(url);
    });

    // Update time every minute
    this.updateTime();
    this.clockInterval = setInterval(() => this.updateTime(), 60000);
  }

  ngOnInit() {
    console.log('✅ Layout loaded, customer:', this.customerName);
  }

  ngOnDestroy(): void {
    if (this.clockInterval !== null) {
      clearInterval(this.clockInterval);
    }
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  updateActiveMenu(url: string) {
    this.menuItems.forEach(item => {
      item.active = url.includes(item.path);
    });
  }

  updatePageTitle(url: string) {
    const activeItem = this.menuItems.find(item => url.includes(item.path));
    if (activeItem) {
      this.pageTitle = activeItem.label;
    } else {
      this.pageTitle = 'Dashboard';
    }
  }

  navigate(route: string) {
    this.router.navigate([`/customer-portal/${route}`]);
  }

  // logout() {
  //   this.http.post('customers/portal/logout/', {}, { withCredentials: true }).subscribe({
  //     next: () => {
  //       localStorage.clear();
  //       window.location.href = '/#/login';
  //     },
  //     error: () => {
  //       localStorage.clear();
  //       window.location.href = '/#/login';
  //     }
  //   });
  // }

  // Add this property
// Add this property
isMobileMenuOpen = false;

// Add this method for mobile menu toggle
toggleMobileMenu() {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    if (this.isMobileMenuOpen) {
      sidebar.classList.add('open');
    } else {
      sidebar.classList.remove('open');
    }
  }
}

logout() {
  // First call logout API (fire and forget)
  this.http.post('customers/portal/logout/', {}, { withCredentials: true }).subscribe({
    next: () => {
      console.log('Logged out successfully');
    },
    error: (err) => {
      console.error('Logout error:', err);
    },
    complete: () => {
      // Always redirect to customer login
      localStorage.clear();
      window.location.href = '/#/customer_portal_login';
    }
  });
}

}