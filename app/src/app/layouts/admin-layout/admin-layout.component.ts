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
          {
            link: '/admin/employee',
            label: 'Customer',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/employee',
            label: 'Sales Price List',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/employee',
            label: 'Estimate',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/employee',
            label: 'Sales Order',
            icon: 'fas fa-tachometer-alt',
          }
        ]
      },
      {
        link: '/admin/dashboard',
        label: 'Purchase',
        icon: 'fas fa-hand-holding-usd',
      },
      {
        link: '/admin/dashboard',
        label: 'Finance',
        icon: 'fas fa-chart-line',
      },
      {
        link: '/admin/dashboard',
        label: 'Inventory',
        icon: 'fas fa-boxes',
      },
      {
        link: '/admin/master',
        label: 'Master',
        icon: 'fas fa-cog',
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
        label: 'HRMS',
        icon: 'fas fa-file-invoice-dollar',
        child: [
          {
            link: '/admin/hrms/designations',
            label: 'designations',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/hrms/departments',
            label: 'departments',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/hrms/employees ',
            label: 'employees',
            icon: 'fas fa-tachometer-alt',
          },
        ]
      },
      {
        label: 'LEADS',
        icon: 'fas fa-file-invoice-dollar',
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
          },
          {
            link: '/admin/leads/lead_assignments',
            label: 'Lead assignments',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/leads/lead_interactions',
            label: 'Lead interactions',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/leads/lead_assignment_history',
            label: 'Lead assignment history',
            icon: 'fas fa-tachometer-alt',
          },
        ]
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
