import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '@ta/ta-core';
import { AdminCommonService } from 'src/app/services/admin-common.service';
import { HttpClient } from '@angular/common/http';

interface SpeechRecognitionResult {
  transcript: string; // Holds the recognized speech as text
}

interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> { }

// Extends the Event interface to add speech recognition-specific properties
interface SpeechRecognitionEvent extends Event {
  lang: string; // Language of the recognition
  interimResults: boolean; // Whether to return interim results
  maxAlternatives: number; // Maximum number of alternatives for recognition results
  onresult: (event: SpeechRecognitionEvent) => void; // Callback when recognition results are available
  onerror: (event: Event) => void; // Callback when an error occurs
  onend: () => void; // Callback when recognition ends
  start(): unknown; // Method to start recognition
  stop(): unknown; // Method to stop recognition
  results: SpeechRecognitionResultList; // Array of recognition results
}

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
  private recognition: SpeechRecognitionEvent | null = null;
  constructor(private elementRef: ElementRef,  private http: HttpClient,private renderer: Renderer2, private router: Router, private taLoacal: LocalStorageService, private aS: AdminCommonService) {
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
      // {
      //   link: '/admin/voiceassistant',
      //   label: 'voiceassistant',
      //   icon: 'fas fa-microphone',
      // },
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
  //===============================SpeechRecognition========================================
    // Method to initialize speech recognition
    private initializeSpeechRecognition(): void {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
  
        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          let speechResult = event.results[0][0].transcript.toLowerCase();
          console.log('Result received: ' + speechResult);
          this.processSpeech(speechResult); // Process the recognized speech
        };
  
        this.recognition.onerror = (event: Event) => {
          console.error('Speech recognition error detected:', (event as any).error);
        };
  
        this.recognition.onend = () => {
          console.log('Speech recognition service disconnected');
        };
      } else {
        console.warn('Speech recognition not supported in this browser.');
      }
    }
  
   // Method to start speech recognition
  public startSpeechRecognition(): void {
    this.initializeSpeechRecognition(); // Initialize the recognition if not already done
    if (this.recognition) {
      this.recognition.start(); // Start speech recognition
  
      // Restart recognition if it ends before the timeout
      this.recognition.onend = () => {
        console.log('Speech recognition service ended, restarting...');
        this.recognition?.start(); // Restart speech recognition
      };
  
      // Stop recognition after 60 seconds
      setTimeout(() => {
        this.recognition?.stop(); // Stop recognition
        this.recognition.onend = () => {
          console.log('Speech recognition stopped by timeout');
        };
      }, 10000);
    }
  }
  
  
    // Method to process the recognized speech and navigate or perform actions based on it
    private processSpeech(speech: string): void {
      this.oneFieldApi(speech); // Handle API-related commands first
  
      const pages: { [key: string]: string } = {
        'dashboard': '/admin/dashboard',
        'users': 'admin/users',
        'company': '/admin/company',
        'sales': '/admin/sales',
        'roles': 'users/roles',
        'inventory': 'admin/inventory',
        'master': 'admin/master',
        'product-groups': 'products/product-groups',
        'vendors': 'admin/vendors'
      };
  
      const page = Object.keys(pages).find(page => speech.includes('go to ' + page));
      if (page) {
        this.router.navigate([pages[page]]);
      } else {
        console.log('Speech not recognized for navigation');
      }
    }
  
    // Method to handle API-related speech commands
    private oneFieldApi(speech: string): void {
      // Regular expression to match "create new role for <role_name> and description is <role_description>"
      const roleMatch = speech.match(/create new role for (.+?) and description is (.+)/);
  
      if (roleMatch && roleMatch[1]) {
        const roleName = roleMatch[1].trim(); // Capture the role name and trim any leading/trailing whitespace
        const roleDescription = roleMatch[2]?.trim() || ''; // Capture the role description or set it as an empty string if not provided
        this.createRole(roleName, roleDescription); // Call the function to create a role
        return;
      }
  
      // Regular expression to match "create new <endpoint> with name <name>"
      const oneFieldMatch = speech.match(/create new ([\w\s]+) with name (.+)/);
      if (oneFieldMatch && oneFieldMatch[1] && oneFieldMatch[2]) {
        const endpoint = oneFieldMatch[1].trim(); // Capture the endpoint and trim any leading/trailing whitespace
        const name = oneFieldMatch[2].trim(); // Capture the name and trim any leading/trailing whitespace
        this.createOneFieldData(endpoint, name); // Call the function to create the data
        return;
      }
  
      console.log('Speech not recognized for API creation commands');
    }
  
    // Method to create a new role by calling the API
    private createRole(roleName: string, roleDescription: string): void {
      const payload = {
        role_name: roleName, // Set the role name in the payload
        description: roleDescription // Set the role description in the payload
      };
  
      this.http.post('http://127.0.0.1:8000/api/v1/users/role/', payload)
        .subscribe(
          response => console.log('Role created:', response),
          error => console.error('Error creating role:', error)
        );
    }
  
    // Method to create a new item by calling the product group API
    private createOneFieldData(endpoint: string, name: string): void {
      endpoint = endpoint.replace(/\s+/g, '_'); // Convert endpoint name to snake_case
      const payload = { name: name }; // Set the name in the payload
  
      this.http.post(`http://127.0.0.1:8000/api/v1/products/${endpoint}/`, payload)
        .subscribe(
          response => console.log('Data Created:', response),
          error => console.error('Error creating item:', error)
        );
    }
//========================================================E---N---D====================================================

}
