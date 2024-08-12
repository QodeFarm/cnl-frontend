import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '@ta/ta-core';
import { AdminCommonService } from 'src/app/services/admin-common.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AdminLayoutComponent {
  menulList = <any>[];
  userName: any;
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private router: Router, private taLoacal: LocalStorageService, private aS: AdminCommonService) {
    this.aS.action$.subscribe(res => {
      console.log(res);
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const windowWidth = window.innerWidth;

    if (windowWidth < 768) {
      this.hideSidebarCollapse();
    }

    if (windowWidth < 480 && !this.elementRef.nativeElement.querySelector('.sidebar').classList.contains('toggled')) {
      this.renderer.addClass(document.body, 'sidebar-toggled');
      this.renderer.addClass(this.elementRef.nativeElement.querySelector('.sidebar'), 'toggled');
      this.hideSidebarCollapse();
    }
  }
  ngOnInit() {
    const user = this.taLoacal.getItem('user');
    if (user)
      this.userName = user.username
    this.menulList = [
      {
        link: '/admin/dashboard',
        label: 'Dashboard',
        icon: 'icon icon-dashboard',
      },
      {
        label: 'Sales',
        icon: 'icon icon-sales',
        child: [
          {
            link: '/admin/customers',
            label: 'Customer',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/sales',
            label: 'Sale Order',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/sales/salesinvoice',
            label: 'Sale Invoice',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/sales/sale-returns',
            label: 'Sale Return',
            icon: 'fas fa-tachometer-alt',
          },
        ]
      },
      {
        // link: '/admin/purchase/purchase',
        label: 'Purchase',
        icon: 'icon icon-purchase',
        child: [
          {
            link: '/admin/vendors',
            label: 'Vendors',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/purchase',
            label: 'Purchase',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/purchase/invoice',
            label: 'Purchase Invoice',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/purchase/purchasereturns',
            label: 'Purchase Returns',
            icon: 'fas fa-tachometer-alt',
          }
        ]
      },
      {
        link: '/admin/finance',
        label: 'Finance',
        icon: 'icon icon-finance',
      },
      {
        label: 'Production',
        icon: 'icon icon-production',
        child: []
      },
      {
        label: 'Inventory',
        icon: 'icon icon-inventory',
        child: [
          {
            link: '/admin/inventory',
            label: 'Inventory',
            icon: 'fas fa-boxes',
          },
          {
            link: '/admin/products',
            label: 'Products',
          },
          {
            link: '/admin/warehouses',
            label: 'Warehouses',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/quickpacks',
            label: 'Quick Packs',
            icon: 'fas fa-user',
          },
        ]
      },
      {
        label: 'TASKS',
        icon: 'icon icon-tasks',
        child: [
          {
            link: '/admin/tasks/',
            label: 'Tasks',
            icon: 'fas fa-tachometer-alt',
          },
          // {
          //   link: '/admin/tasks/task_priorities',
          //   label: 'Task Priorities',
          //   icon: 'fas fa-tachometer-alt',
          // },
        ]
      },
      {
        label: 'LEADS',
        icon: 'icon icon-leads',
        child: [
          {
            link: '/admin/leads',
            label: 'Leads',
            icon: 'fas fa-tachometer-alt',
          },
          // {
          //   link: '/admin/leads/lead_statuses',
          //   label: 'Lead statuses',
          //   icon: 'fas fa-tachometer-alt',
          // },
          // {
          //   link: '/admin/leads/interaction_types',
          //   label: 'Interaction types',
          //   icon: 'fas fa-tachometer-alt',
          // }
        ]
      },
      {
        label: 'Assets',
        icon: 'icon icon-assets',
        child: [
          {
            link: '/admin/assets/assets',
            label: 'Assets',
            icon: 'fas fa-tachometer-alt',
          },
          // {
          //   link: '/admin/assets/asset_statuses',
          //   label: 'Asset Statuses',
          //   icon: 'fas fa-tachometer-alt',
          // },
          // {
          //   link: '/admin/assets/asset_categories',
          //   label: 'Asset Categories',
          //   icon: 'fas fa-tachometer-alt',
          // },
          // {
          //   link: '/admin/assets/locations',
          //   label: 'Locations',
          //   icon: 'fas fa-tachometer-alt',
          // },
          {
            link: '/admin/assets/asset_maintenance',
            label: 'Asset Maintenance',
            icon: 'fas fa-tachometer-alt',
          },
        ]
      },
      {
        label: 'HRMS',
        icon: 'icon icon-hrms',
        child: [
          {
            link: '/admin/employees',
            label: 'Employees',
            icon: 'fas fa-tachometer-alt',
          },
          // {
          //   link: '/admin/employees/designations',
          //   label: 'Designations',
          //   icon: 'fas fa-tachometer-alt',
          // },
          // {
          //   link: '/admin/employees/departments',
          //   label: 'Departments',
          //   icon: 'fas fa-tachometer-alt',
          // }
        ]
      },
      {
        link: '/admin/master',
        label: 'Master',
        icon: 'icon icon-masters',
      },
    ]
    this.closeMenu();
  }
  closeMenu() {
    const windowWidth = window.innerWidth;

    if (windowWidth < 768) {
      this.hideSidebarCollapse();
    }
    if (windowWidth < 480 && !this.elementRef.nativeElement.querySelector('.sidebar').classList.contains('toggled')) {
      this.renderer.addClass(document.body, 'sidebar-toggled');
      this.renderer.addClass(this.elementRef.nativeElement.querySelector('.sidebar'), 'toggled');
      this.hideSidebarCollapse();
    }
  }

  hideSidebarCollapse() {
    const collapses = this.elementRef.nativeElement.querySelectorAll('.sidebar .collapse');
    collapses.forEach((collapse: HTMLElement) => {
      collapse.classList.remove('show');
    });
  }
  isActive(parentLink: string, children: any[]): boolean {
    return children.some(child => this.router.isActive(child.link, true));
  }

  menuToggle() {

    document.body.classList.toggle("sidebar-toggled");

    // Toggle the class on the element with class "sidebar"
    const sidebar: any = document.querySelector(".sidebar");
    sidebar.classList.toggle("toggled");

    // Check if the "sidebar" element has the class "toggled"
    if (sidebar.classList.contains("toggled")) {
      // Get all elements with class "collapse" that are descendants of the "sidebar" element
      const collapses: any = sidebar.querySelectorAll('.collapse');

      // Hide each of these elements
      collapses.forEach(function (collapse: any) {
        collapse.classList.remove('show');
      });
    }
  }
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    this.router.navigateByUrl('/login');

  }

}
