import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterModule, RoutesRecognized, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '@ta/ta-core';
import { AdminCommonService } from 'src/app/services/admin-common.service';
import { HttpClient } from '@angular/common/http';
import { filter, map, mergeMap } from 'rxjs/operators';

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
export interface Tab {
  name: string;
  component?: any;
  active: boolean;
  route?: Route;
  key?: string;
  url?: string;
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
  public currentHoverTabKey: string;
  public tabs: Tab[] = [];
  private recognition: SpeechRecognitionEvent | null = null;
  constructor(private activatedRoute: ActivatedRoute, private cd: ChangeDetectorRef, private elementRef: ElementRef, private http: HttpClient, private renderer: Renderer2, private router: Router, private taLoacal: LocalStorageService, private aS: AdminCommonService) {
    this.aS.action$.subscribe(res => {
      console.log(res);
    });
    let currentUrl: any;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;  // Navigate to the deepest child route
        return route;
      }),
      map(route => {
        debugger;
        currentUrl = this.router.url;  // Get the current URL
        return { data: route.snapshot.data, component: route.component };  // Get the route's data (like title)
      })
    ).subscribe(route => {
      this.checkAndAddRouteTab({ name: route.data.title, component: route.component, key: route.data.moduleName, url: this.router.url, active: true });
      console.log('data', route.data.title, this.router.url);
    });
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
      // {
      //   label: 'User Management',
      //   icon: 'fas fa-user',
      //   child: [
      //     // {
      //     //   link: '/admin/users',
      //     //   label: 'Users',
      //     //   icon: 'fas fa-user',
      //     // },
      //     {
      //       link: '/admin/users/roles',
      //       label: 'Roles',
      //       icon: 'fas fa-user',
      //     }
      //   ]
      // },
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
          {
            link: '/admin/sales/sales-dispatch',
            label: 'Sale Dispatch',
            icon: 'fas fa-tachometer-alt',
          },
          {
            link: '/admin/sale-receipt',
            label: 'Sale Receipt',
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
        child: [
          {
            link: '/admin/production/billofmaterials',
            label: 'Bill Of Materials',
          },
          {
            link: '/admin/production/workorders',
            label: 'Work Orders',
          },
          {
            link: '/admin/production/inventory',
            label: 'Inventory',
          },
          {
            link: '/admin/production/machines',
            label: 'Machines',
          },
          {
            link: '/admin/production/labor',
            label: 'Labor',
          },          {
            link: '/admin/production/productionstatuses',
            label: 'Production Statuses',
          }
        ]
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
        label: 'Tasks',
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
        label: 'Leads',
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
        label: 'HR',
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
        link: '/admin/reports',
        label: 'Reports',
        icon: 'icon icon-reports',
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

  // Method to start speech recognition
  public startSpeechRecognition(duration: number = 10000, shouldRestart: boolean = false): void { // Default duration is 10 seconds
    this.initializeSpeechRecognition(); // Initialize the recognition if not already done
    if (this.recognition) {
      this.recognition.start(); // Start speech recognition

      if (shouldRestart) {
        // Restart recognition if it ends before the timeout only for specific actions
        this.recognition.onend = () => {
          console.log('Speech recognition service ended, restarting...');
          this.recognition?.start(); // Restart speech recognition
        };
      }

      // Stop recognition after specified duration
      setTimeout(() => {
        this.recognition?.stop(); // Stop recognition
        this.recognition.onend = () => {
          console.log('Speech recognition stopped by timeout');
        };
      }, duration);
    }
  }

  // Method to initialize speech recognition
  private initializeSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
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

  // Method to process the recognized speech and navigate or perform actions based on it
  private processSpeech(speech: string): void {
    this.handleApiCommands(speech); // Handle API-related commands first
    this.handlePageNavigation(speech); // Handle page navigation
  }

  // Method to handle API-related speech commands
  private handleApiCommands(speech: string): void {
    // Regular expression to match "create new role for <role_name> and description is <role_description>"
    let roleMatch = speech.match(/create new role for (.+?) and description is (.+)/);

    if (!roleMatch) {
      // Check for "each" and replace with "is" in the role description
      speech = speech.replace(/ and description each /g, ' and description is ');
      roleMatch = speech.match(/create new role for (.+?) and description is (.+)/);
    }

    if (roleMatch && roleMatch[1]) {
      const roleName = roleMatch[1].trim(); // Capture the role name and trim any leading/trailing whitespace
      const roleDescription = roleMatch[2]?.trim() || ''; // Capture the role description or set it as an empty string if not provided
      this.createRole(roleName, roleDescription); // Call the method to create a role
      this.startSpeechRecognition(10000, false); // Mic active for 10 seconds without restart
      return;
    }

    // Regular expression to match "create new <endpoint> with name <name>"
    const oneFieldMatch = speech.match(/create new ([\w\s]+) with name (.+)/);
    if (oneFieldMatch && oneFieldMatch[1] && oneFieldMatch[2]) {
      const endpoint = oneFieldMatch[1].trim(); // Capture the endpoint and trim any leading/trailing whitespace
      const name = oneFieldMatch[2].trim(); // Capture the name and trim any leading/trailing whitespace
      this.createOneFieldData(endpoint, name); // Call the method to create the data
      this.startSpeechRecognition(10000, false); // Mic active for 10 seconds without restart
      return;
    }

    console.log('Speech not recognized for API creation commands');
  }

  private handlePageNavigation(speech: string): void {
    const pages: { [key: string]: string } = {
      'dashboard': '/admin/dashboard',
      'users': 'admin/users',
      'company': '/admin/company',

      //sales
      'sales': '/admin/sales',
      'customers': '/admin/customers',
      'sales invoice': '/admin/sales/salesinvoice',
      'sales returns': '/admin/sales/sale-returns',

      //purchase
      'purchase': '/admin/purchase',
      'vendors': 'admin/vendors',
      'purchase invoice': 'admin/purchase/invoice',
      'purchase returns': 'admin/purchase/purchasereturns',

      //inventory
      'inventory': 'admin/inventory',
      'products': 'admin/products',
      'warehouse': 'admin/warehouses',
      'quickpacks': 'admin/quickpacks',

      //tasks
      'tasks': 'admin/tasks',

      //leads
      'leads': 'admin/leads',

      //assets
      'assets': 'admin/assets/assets',
      'asset maintenance': 'admin/assets/asset_maintenance',

      //HRMS
      'employees': 'admin/employees',

      //masters
      'master': 'admin/master',
      'gst categories': '/admin/master/gst-categories',
      'shipping modes': '/admin/master/shipping-modes',
      'price categories': '/admin/master/price-categories',
      'transporters': '/admin/master/transporters',
      'orders status': '/admin/master/statuses',
      'product groups': '/admin/master/product-groups',
      'territory': 'admin/master/territory',
      'shipping companies': '/admin/master/shipping-companies',

      'departments': 'admin/master/departments',
      'designations': '/hrms/designations/',

      'firm status': '/admin/master/firm-statuses',
      'ledgeraccounts': '/admin/master/ledger-accounts',
      'ledger groups': '/admin/master/ledger-groups',
      'customer payment-terms': '/admin/master/customer-payment-terms',
      'vendor agent': '/admin/master/vendor-agent',
      'vendor category': '/admin/master/vendor-category',
      'vendor payment-terms': '/admin/master/vendor-payment-terms',
      'product sales gl': '/admin/master/product-sales-gl',
      'product types': '/admin/master/product-types',
      'product brands': '/admin/master/product-brands',
      'product categories': '/admin/master/product-categories',
      'product gst-classifications': '/admin/master/product-gst-classifications',
      'product item-type': '/admin/master/product-item-type',
      'product purchase-gl': '/admin/master/product-purchase-gl',
      'product stock-units': '/admin/master/product-stock-units',
      'product item-balance': '/admin/master/product-item-balance',
      'product unique-quantity-codes': '/admin/master/product-unique-quantity-codes',
      'unit options': '/admin/master/unit-options',
      'order statuses': '/admin/master/order-statuses',
      'order types': '/admin/master/order-types',
      'purchase types': '/admin/master/purchase-types',
      'sale types': '/admin/master/sale-types',
      'gst types': '/admin/master/gst-types',
      'payment link type': '/admin/master/payment-link-type',
      'lead statuses': '/admin/master/lead-statuses',
      'interaction-types': '/admin/master/interaction-types',
      'priorities': '/admin/master/priorities',
      'asset categories': '/admin/master/asset-categories',
      'asset statuses': '/admin/master/asset-statuses',
      'locations': '/admin/master/locations'
    };

    // Ensure the longest matches are checked first by sorting keys by length
    const sortedPages = Object.keys(pages).sort((a, b) => b.length - a.length);

    const page = sortedPages.find(page => speech.includes('go to ' + page));
    if (page) {
      this.router.navigate([pages[page]]);
      this.startSpeechRecognition(3000, false); // Mic active for 3 seconds for navigation without restart
    } else if (this.router.url.includes('admin/sales') && speech.includes('start filling form')) {
      this.startSalesOrderForm(); // Start the sales order form process if on the sales page
      this.startSpeechRecognition(60000, true); // Mic active for 60 seconds while filling the form with restart
    } else {
      console.log('Speech not recognized for navigation or form actions');
    }
  }

  // Method to create a new role by calling the API
  private createRole(roleName: string, roleDescription: string): void {
    const payload = {
      role_name: roleName, // Set the role name in the payload
      description: roleDescription // Set the role description in the payload
    };

    this.http.post('http://195.35.20.172:8000/api/v1/users/role/', payload)
      .subscribe(
        response => console.log('Role created:', response),
        error => console.error('Error creating role:', error)
      );
  }

  // Method to create a new item by calling the product group API
  private createOneFieldData(endpoint: string, name: string): void {
    endpoint = endpoint.replace(/\s+/g, '_'); // Convert endpoint name to snake_case
    const payload = { group_name: name }; // Set the name in the payload

    this.http.post(`http://195.35.20.172:8000/api/v1/products/${endpoint}/`, payload)
      .subscribe(
        response => console.log('Data Created:', response),
        error => console.error('Error creating item:', error)
      );
  }

  // Method to start filling the sales order form via speech recognition
  private startSalesOrderForm(): void {
    const formData: { [key: string]: string } = {}; // Initialize form data object

    if (this.recognition) {
      // Overriding the onresult event to process the speech as form input
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        console.log('Form result received: ' + speechResult);
        this.processFormSpeech(speechResult, formData); // Process the recognized speech and update form data
      };

      this.recognition.start(); // Start speech recognition

      // Submit the form after speech recognition is complete
      this.recognition.onend = () => {
        console.log('Submitting form with data:', formData);
        this.http.post('http://195.35.20.172:8000/api/v1/sale_order/', formData)
          .subscribe(
            response => {
              console.log('Form submitted successfully:', response);
              // Call the users/role API after form submission
              this.http.post('http://195.35.20.172:8000/api/v1/users/role/', formData)
                .subscribe(
                  roleResponse => console.log('Role API called successfully:', roleResponse),
                  roleError => console.error('Error calling Role API:', roleError)
                );
            },
            error => console.error('Error submitting form:', error)
          );
      };
    }
  }

  // Method to process the recognized speech and update the form data
  private processFormSpeech(speech: string, formData: { [key: string]: string }): void {
    const fields = speech.includes('and') ? speech.split('and') : [speech];
    fields.forEach(field => {
      const parts = field.split(' is ');
      if (parts.length < 2) return; // Skip if split result is not as expected

      const key = parts[0].trim().toLowerCase().replace(' ', '_');
      const value = parts[1].trim();

      // Update the form data if the key matches the expected fields
      if (['sale type', 'customer', 'ref_number', 'tax', 'remarks'].includes(key)) {
        formData[key] = value; // Update form data with the recognized speech
      }
    });
    console.log('Form Data:', formData);
  }
  // tabs based on routing
  disposeTab(tab: Tab) {
    if (this.tabs.length > 1) {
      this.tabs = this.tabs.filter(item => item.url !== tab.url);

      if (tab.active) {
        // deactivate all tabs
        this.deactivateTabs();
        this.router.navigateByUrl(this.tabs[this.tabs.length - 1].url);
      }
    }
  }

  mouseOverTab(tab: Tab) {
    this.currentHoverTabKey = tab ? tab.key : null;
  }

  checkAndAddRouteTab(tab: Tab) {

    this.deactivateTabs();

    // check if the tab to be activated is already existing
    if (this.tabs.find(t => t.key == tab.key) == null) {

      // if not, push it into the tab array
      // this.tabs.push({
      //   name: comp["name"],
      //   component: comp,
      //   key: comp["name"],
      //   active: true,
      //   route: val.state.root.firstChild.routeConfig
      // });
      if (!tab.name) { tab.name = 'Untitle-' + this.tabs.length + 1 }

      this.tabs.push(tab);

    } else {
      // if the tab exists, activate it
      const tabToActivate = this.tabs.find(t => t.key == tab.key);
      if (tabToActivate) {
        tabToActivate.active = true;
      }
    }

    this.cd.markForCheck();
  }

  deactivateTabs() {
    this.tabs.forEach(tab => (tab.active = false));
  }
}
