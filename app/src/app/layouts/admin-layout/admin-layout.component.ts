import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AdminLayoutComponent {
  menulList = <any>[];
  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

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
            link: '/admin/roles',
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
        link: '/admin/dashboard',
        label: 'Inventory',
        icon: 'fas fa-boxes',
      }
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

}
