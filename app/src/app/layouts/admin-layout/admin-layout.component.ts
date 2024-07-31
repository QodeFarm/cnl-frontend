import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '@ta/ta-core';

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
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private router: Router, private taLoacal: LocalStorageService) { }

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
        icon: 'fas fa-tachometer-alt',
      },
      {
        label: 'User Management',
        icon: 'fas fa-user',
        child: [
          {
            link: '/admin/users',
            label: 'Users',
            icon: 'fas fa-user',
          },
          {
            link: '/admin/users/roles',
            label: 'Roles',
            icon: 'fas fa-user',
          }
        ]
      },
      {
        label: 'Sales',
        icon: 'fas fa-file-invoice-dollar',
        child: [
          // {
          //   link: '/admin/employee',
          //   label: 'Sales Price List',
          //   icon: 'fas fa-tachometer-alt',
          // },
          // {
          //   link: '/admin/employee',
          //   label: 'Estimate',
          //   icon: 'fas fa-tachometer-alt',
          // },
          {
            link: '/admin/sales',
            label: 'Sale Order',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/sales',
            label: 'Sale Invoice',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/sales',
            label: 'Sale Return',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/employee',
            label: 'Customer',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/employee',
            label: 'Order Shipment',
            icon: 'fas fa-tachometer-alt',
          },
        ]
      },
      {
        // link: '/admin/purchase/purchase',
        label: 'Purchase',
        icon: 'fas fa-hand-holding-usd',
        child: [
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
        link: '/admin/dashboard',
        label: 'Finance',
        icon: 'fas fa-chart-line',
      },
      {
        // link: '/admin/dashboard',
        // link: '/admin/inventory',
        label: 'Inventory',
        icon: 'fas fa-boxes',
        child: [
          {
            link: '/admin/inventory',
            label: 'Inventory',
            icon: 'fas fa-boxes',
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
        icon: 'fas fa-tasks',
        child: [
          {
            link: '/admin/tasks/',
            label: 'Tasks',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/tasks/task_priorities', 
            label: 'Task Priorities',
            icon: 'fas fa-tachometer-alt',
          },
        ]
      },
      {
        label: 'LEADS',
        icon: 'fas fa-star fa-fw',
        child: [
          {
            link: '/admin/leads',
            label: 'Leads',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/leads/lead_statuses',
            label: 'Lead statuses',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/leads/interaction_types',
            label: 'Interaction types',
            icon: 'fas fa-tachometer-alt',
          }
        ]
      },
      {
        label: 'Assets',
        icon: 'fas fa-box',
        child: [
          {
            link: '/admin/assets/assets',
            label: 'Assets',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/assets/asset_statuses',
            label: 'Asset Statuses',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/assets/asset_categories',
            label: 'Asset Categories',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/assets/locations',
            label: 'Locations',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/assets/asset_maintenance',
            label: 'Asset Maintenance',
            icon: 'fas fa-tachometer-alt',
          },
        ]
      },
      {
        label: 'HRMS',
        icon: 'fas fa-lock',
        child: [
          {
            link: '/admin/employees',
            label: 'employees',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/employees/designations',
            label: 'designations',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/employees/departments',
            label: 'departments',
            icon: 'fas fa-tachometer-alt',
          }
        ]
      },
      {
        link: '/admin/master',
        label: 'Master',
        icon: 'fas fa-cog',
      },
      {
        label: 'Product Masters',
        icon: 'fas fa-database',
        child: [
          {
            link: '/admin/products/product-groups',
            label: 'Product Groups'
          },
          {
            link: '/admin/products/product-categories',
            label: 'Product Categories'
          },
          {
            link: '/admin/products/product-stock-units',
            label: 'Product Stock Units'
          },
          {
            link: '/admin/products/product-gst-classifications',
            label: 'Product GST Classifications'
          },
          {
            link: '/admin/products/product-sales-gl',
            label: 'Product Sales GL'
          },
          {
            link: '/admin/products/product-purchase-gl',
            label: 'Product Purchase GL'
          },
          {
            link: '/admin/products/product-unique-quantity-codes',
            label: 'Product Unique Quantity Codes'
          },
          {
            link: '/admin/products/unit-options',
            label: 'Unit Options'
          },
          {
            link: '/admin/products/product-drug-types',
            label: 'Product Drug Types'
          },
          {
            link: '/admin/products/product-types',
            label: 'Product Types'
          },
          {
            link: '/admin/products/product-item-type',
            label: 'Product Item Type'
          },
          {
            link: '/admin/products/brand-salesman',
            label: 'Brand Salesman'
          },
          {
            link: '/admin/products/product-brands',
            label: 'Product Brands'
          },
          {
            link: '/admin/products/products',
            label: 'Products',
          },
        ],
      },
      {
        label: 'Company',
        icon: 'fas fa-file-invoice-dollar',
        child: [
          {
            link: '/admin/company',
            label: 'Company',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/company/branches',
            label: 'Branches',
            icon: 'fas fa-tachometer-alt',
          },
        ]
      },
      {
        label: 'Vendors',
        icon: 'fas fa-shopping-bag',
        child: [
          {
            link: '/admin/vendors/',
            label: 'Vendors',
            icon: 'fas fa-user',
          },
          // {
          //   link: '/admin/vendors/vendors-list',
          //   label: 'vendors list',
          //   icon: 'fas fa-user',
          // },
          {
            link: '/admin/vendors/vendor-category',
            label: 'Vendor Category',
            icon: 'fas fa-user',
          },
          {
            link: '/admin/vendors/vendor-payment-terms',
            label: 'Vendor Payment Terms',
            icon: 'fas fa-user',
          },
          {
            link: '/admin/vendors/vendor-agent',
            label: 'Vendor Agent',
            icon: 'fas fa-user',
          },
          {
            link: '/admin/vendors/firm-statuses',
            label: 'Firm Statuses',
            icon: 'fas fa-user',
          },
          {
            link: '/admin/vendors/gst-categories',
            label: 'Gst Categories',
            icon: 'fas fa-user',
          },
          {
            link: '/admin/vendors/price-categories',
            label: 'Price Categories',
            icon: 'fas fa-user',
          },
        ]
      },
      // {
      //   label: 'Quick Packs',
      //   icon: 'fas fa-shopping-cart',
      //   child: [
      //     {
      //       link: '/admin/quickpacks',
      //       label: 'Quick Packs',
      //       icon: 'fas fa-user',
      //     },
      //   ]
      // }
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
