import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomFieldHelper } from '../utils/custom_field_fetch';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { BulkEditModalComponent } from '../utils/bulk-edit-modal/bulk-edit-modal.component';
import { BulkField } from '../utils/bulk-operations.service';
import { LocalStorageService } from 'projects/ta-core/src/lib/services/local-storage.service';
import { ledgerAccountsConfig } from '../../utils/master-curd-config';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  imports: [CommonModule,
    FormsModule,
    AdminCommmonModule,
    CustomersListComponent,
    NzSpinModule,
    NzProgressModule,
    NzResultModule,
    NzAlertModule,
    BulkEditModalComponent],
  standalone: true,
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent {

  // Filtered curdConfig — shows only AccountsReceivable accounts (stable purpose flag, not group name)
  customerLedgerCurdConfig = {
    ...ledgerAccountsConfig,
    tableConfig: {
      ...ledgerAccountsConfig.tableConfig,
      apiUrl: 'customers/ledger_accounts/?group_purpose=AccountsReceivable'
    }
  };

  showCustomerList: boolean = false;
  showForm: boolean = false;
  CustomerEditID: any;
  isSubmitting: boolean = false;

  isCustomerPortal: boolean = false;
  isCustomerView: boolean = false;
  loggedInCustomerId: string | null = null;

  @ViewChild(CustomersListComponent) CustomersListComponent!: CustomersListComponent;

  // Import state tracking
  isImporting: boolean = false;
  importProgress: number = 0;
  importStatusMessage: string = '';
  importCompleted: boolean = false;
  importMode: 'create' | 'update' = 'create';
  isExporting: boolean = false;
  importResults: {
    success: boolean;
    totalRecords: number;
    successCount: number;
    errorCount: number;
    errors: Array<{ row: number; error: string }>;
  } | null = null;

  // ─── Bulk Edit State ─────────────────────────────────────────
  showBulkEditModal = false;
  bulkEditIds: string[] = [];

  /** Config: maps each bulk-edit field to its API & display info */
  readonly BULK_FIELDS: BulkField[] = [
    { key: 'customer_category_id', apiKey: 'customer_category_id', label: 'Customer Category', type: 'dropdown', url: 'masters/customer_categories/', dataKey: 'customer_category_id', dataLabel: 'name' },
    { key: 'territory_id', apiKey: 'territory_id', label: 'Territory', type: 'dropdown', url: 'masters/territory/', dataKey: 'territory_id', dataLabel: 'name' },
    { key: 'firm_status_id', apiKey: 'firm_status_id', label: 'Firm Status', type: 'dropdown', url: 'masters/firm_statuses/', dataKey: 'firm_status_id', dataLabel: 'name' },
    { key: 'gst_category_id', apiKey: 'gst_category_id', label: 'GST Category', type: 'dropdown', url: 'masters/gst_categories/', dataKey: 'gst_category_id', dataLabel: 'name' },
    { key: 'payment_term_id', apiKey: 'payment_term_id', label: 'Payment Terms', type: 'dropdown', url: 'masters/customer_payment_terms/', dataKey: 'payment_term_id', dataLabel: 'name' },
    { key: 'price_category_id', apiKey: 'price_category_id', label: 'Price Category', type: 'dropdown', url: 'masters/price_categories/', dataKey: 'price_category_id', dataLabel: 'name' },
    { key: 'transporter_id', apiKey: 'transporter_id', label: 'Transporter', type: 'dropdown', url: 'masters/transporters/', dataKey: 'transporter_id', dataLabel: 'name' },
    { key: 'tax_type', apiKey: 'tax_type', label: 'Tax Type', type: 'static-dropdown', options: [{ label: 'Inclusive', value: 'Inclusive' }, { label: 'Exclusive', value: 'Exclusive' }, { label: 'Both', value: 'Both' }] },
    { key: 'credit_limit', apiKey: 'credit_limit', label: 'Credit Limit', type: 'number' },
    { key: 'max_credit_days', apiKey: 'max_credit_days', label: 'Max Credit Days', type: 'number' },
    { key: 'interest_rate_yearly', apiKey: 'interest_rate_yearly', label: 'Interest Rate (%)', type: 'number' },
    { key: 'tds_applicable', apiKey: 'tds_applicable', label: 'TDS Applicable', type: 'boolean' },
    { key: 'tds_on_gst_applicable', apiKey: 'tds_on_gst_applicable', label: 'TDS on GST', type: 'boolean' },
    { key: 'gst_suspend', apiKey: 'gst_suspend', label: 'GST Suspend', type: 'boolean' },
  ];
  // ─────────────────────────────────────────────────────────────

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  private observer: MutationObserver;
  customFieldConfig: any;
  customFields: any[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private cdref: ChangeDetectorRef, private localStorage: LocalStorageService, private notification: NzNotificationService, private modal: NzModalService) { }
  customFieldFormConfig: any = {};
  entitiesList: any[] = [];
  showProfile: boolean = false;
  ngOnInit() {
    // this.showCustomerList = false;
    // this.showForm = true;  //temporary change 'true'
    // this.CustomerEditID = null;
    // Check if this is customer portal
    this.route.data.subscribe(data => {
      this.isCustomerPortal = data['customerView'] || false;
      this.isCustomerView = data['customerView'] || false;
      
      if (this.isCustomerPortal) {
        // Get logged in customer from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.loggedInCustomerId = user.id;
        
        console.log('Customer Portal - Loading profile for:', this.loggedInCustomerId);
        
        // Hide customer list and show form with customer data
        // Hide customer list and show profile view
        this.showCustomerList = false;
        this.showForm = false;
        this.showProfile = true;
        
        // Load the logged-in customer's data
        this.loadCustomerProfile();
      } else {
        // Normal admin mode
        this.showCustomerList = false;
        this.showForm = true;
        this.showProfile = false;
        this.CustomerEditID = null;
        this.setFormConfig();
      }
    });
    // Set form config
    this.setFormConfig();
    this.http.get('masters/entities/')
      .subscribe((res: any) => {
        this.entitiesList = res.data || []; // Adjust if the response format differs
      });
    CustomFieldHelper.fetchCustomFields(this.http, 'customers', (customFields: any, customFieldMetadata: any) => {
      CustomFieldHelper.addCustomFieldsToFormConfig(customFields, customFieldMetadata, this.formConfig);
    });

  }

loadCustomerProfile() {
    if (!this.loggedInCustomerId) return;
    
    this.loading = true;
    this.http.get(`customers/customers/${this.loggedInCustomerId}/`).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.data) {
          console.log("Loading customer profile:", res.data);
          this.customerProfile = res.data;
          this.extractContactInfo();
          this.extractAddresses();
          this.loadStats();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading customer profile:', err);
        this.notification.error('Error', 'Failed to load profile');
      }
    });
  }

  loadStats() {
  if (!this.loggedInCustomerId) return;
  
  // Load stats from various APIs with customer_id
  this.http.get(`sales/sale_order/?customer_id=${this.loggedInCustomerId}`).subscribe({
    next: (res: any) => {
      this.stats.totalOrders = res.data?.length || 0;
    },
    error: (err) => console.error('Error loading orders:', err)
  });

  this.http.get(`sales/sale_invoice_order/?customer_id=${this.loggedInCustomerId}`).subscribe({
    next: (res: any) => {
      this.stats.totalInvoices = res.data?.length || 0;
    },
    error: (err) => console.error('Error loading invoices:', err)
  });

  this.http.get(`sales/sale_return_order/?customer_id=${this.loggedInCustomerId}`).subscribe({
    next: (res: any) => {
      this.stats.totalReturns = res.data?.length || 0;
    },
    error: (err) => console.error('Error loading returns:', err)
  });

  this.http.get(`sales/sale_credit_notes/?customer_id=${this.loggedInCustomerId}`).subscribe({
    next: (res: any) => {
      this.stats.totalCreditNotes = res.data?.length || 0;
    },
    error: (err) => console.error('Error loading credit notes:', err)
  });
}

  // isCustomerPortal: boolean = false;
  // isCustomerView: boolean = false;
  // loggedInCustomerId: string | null = null;
  customerProfile: any = null; // Store profile data for custom view
  contactInfo: any = { email: '', phone: '' };
  billingAddress: any = null;
  shippingAddress: any = null;
  stats: any = { totalOrders: 0, totalInvoices: 0, totalReturns: 0, totalCreditNotes: 0 };
  loading: boolean = false;

  extractContactInfo() {
    if (this.customerProfile?.customer_addresses) {
      const commAddress = this.customerProfile.customer_addresses.find((a: any) => a.address_type === 'Communication');
      if (commAddress) {
        this.contactInfo.email = commAddress.email;
        this.contactInfo.phone = commAddress.phone;
      } else {
        const anyAddress = this.customerProfile.customer_addresses.find((a: any) => a.email || a.phone);
        if (anyAddress) {
          this.contactInfo.email = anyAddress.email;
          this.contactInfo.phone = anyAddress.phone;
        }
      }
    }
  }

  extractAddresses() {
    if (this.customerProfile?.customer_addresses) {
      this.billingAddress = this.customerProfile.customer_addresses.find((a: any) => a.address_type === 'Billing');
      this.shippingAddress = this.customerProfile.customer_addresses.find((a: any) => a.address_type === 'Shipping');
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }


  ngAfterViewInit() {
    // Copy buttons are now handled by the field-repeat table component (extraAction / secondAction)
  }

  customFieldMetadata: any = {}; // To store mapping of field names to metadata
  // submitCustomerForm() {
  //   if (this.isSubmitting) return; // Prevent double-click
  //   const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields

  //   // Determine the entity type and ID dynamically
  //   const entityName = 'customers'; // Since we're in the Sale Order form
  //   const customId = this.formConfig.model.customer_data?.customer_id || null; //

  //   // Find entity record from list
  //   const entity = this.entitiesList.find(e => e.entity_name === entityName);

  //   if (!entity) {
  //     console.error(`Entity not found for: ${entityName}`);
  //     return;
  //   }

  //   const entityId = entity.entity_id;
  //   // Inject entity_id into metadata temporarily
  //   Object.keys(this.customFieldMetadata).forEach((key) => {
  //     this.customFieldMetadata[key].entity_id = entityId;
  //   });
  //   // Construct payload for custom fields
  //   const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityName, customId);

  //   if (!customFieldsPayload) {
  //     this.showDialog(); // Stop execution if required fields are missing
  //     return;
  //   }
  //   // Construct the final payload
  //   let payload: any = {
  //     ...this.formConfig.model,
  //     custom_field_values: customFieldsPayload.custom_field_values // Array of dictionaries
  //   };
  //   // Merge communication address into customer_addresses
  //   payload = this.mergeCommAddressIntoPayload(payload);

  //   console.log('Final Payload:', payload); // Debugging to verify the payload

  //   // Submit the payload
  //   this.isSubmitting = true;
  //   this.http.post('customers/customers/', payload).subscribe(
  //     (response: any) => {
  //       this.isSubmitting = false;
  //       this.showSuccessToast = true;
  //       this.toastMessage = "Record Created successfully";
  //       // Fully reset form: destroy → reinit → recreate (clears validation state)
  //       this.showForm = false;
  //       this.setFormConfig();
  //       setTimeout(() => {
  //         this.showForm = true;
  //         this.cdref.detectChanges();
  //         // Re-fetch custom fields for the fresh form
  //         CustomFieldHelper.fetchCustomFields(this.http, 'customers', (customFields: any, customFieldMetadata: any) => {
  //           CustomFieldHelper.addCustomFieldsToFormConfig(customFields, customFieldMetadata, this.formConfig);
  //         });
  //       });
  //       setTimeout(() => {
  //         this.showSuccessToast = false;
  //       }, 3000);
  //     },
  //     (error) => {
  //       this.isSubmitting = false;
  //       console.error('Error creating customer and custom fields:', error);
  //     }
  //   );
  // }

submitCustomerForm() {
    if (this.isSubmitting) return; // Prevent double-click
    
    // ===== NEW: Handle portal fields before submission =====
    const customerData = this.formConfig.model.customer_data || {};
    
    // Handle portal fields
    if (customerData.is_portal_user) {
        // Ensure username is set (either from form or auto-generated)
        if (!customerData.username && customerData.name) {
            customerData.username = customerData.name.toLowerCase().replace(/\s+/g, '.');
        }
        
        // Password is already set via generate button or left blank for auto-generation
        // Remove display field as it's not needed in payload
        delete customerData.password_display;
    } else {
        // If portal access is not enabled, ensure portal fields are not sent
        delete customerData.username;
        delete customerData.password;
        delete customerData.is_portal_user;
        delete customerData.password_display;
    }
    // ===== END NEW =====

    const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields

    // Determine the entity type and ID dynamically
    const entityName = 'customers'; // Since we're in the Sale Order form
    const customId = this.formConfig.model.customer_data?.customer_id || null; //

    // Find entity record from list
    const entity = this.entitiesList.find(e => e.entity_name === entityName);

    if (!entity) {
      console.error(`Entity not found for: ${entityName}`);
      return;
    }

    const entityId = entity.entity_id;
    // Inject entity_id into metadata temporarily
    Object.keys(this.customFieldMetadata).forEach((key) => {
      this.customFieldMetadata[key].entity_id = entityId;
    });
    // Construct payload for custom fields
    const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityName, customId);

    if (!customFieldsPayload) {
      this.showDialog(); // Stop execution if required fields are missing
      return;
    }
    // Construct the final payload
    let payload: any = {
      ...this.formConfig.model,
      custom_field_values: customFieldsPayload.custom_field_values // Array of dictionaries
    };
    // Merge communication address into customer_addresses
    payload = this.mergeCommAddressIntoPayload(payload);

    console.log('Final Payload:', payload); // Debugging to verify the payload

    // Submit the payload
    this.isSubmitting = true;
    this.http.post('customers/customers/', payload).subscribe(
      (response: any) => {
        this.isSubmitting = false;
        this.showSuccessToast = true;
        this.toastMessage = "Record Created successfully";
        
        // ===== NEW: Handle portal credentials in response =====
        if (response?.data?.[0]?.customer_data?.portal_credentials) {
          const credentials = response.data[0].customer_data.portal_credentials;
          this.notification.success(
            `Portal Credentials Generated<br>Username: ${credentials.username}<br>Password: ${credentials.password}`,
            '', 
            { nzDuration: 0 } // Keep until user closes
          );
        }
        // ===== END NEW =====

        // Fully reset form: destroy → reinit → recreate (clears validation state)
        this.showForm = false;
        this.setFormConfig();
        setTimeout(() => {
          this.showForm = true;
          this.cdref.detectChanges();
          // Re-fetch custom fields for the fresh form
          CustomFieldHelper.fetchCustomFields(this.http, 'customers', (customFields: any, customFieldMetadata: any) => {
            CustomFieldHelper.addCustomFieldsToFormConfig(customFields, customFieldMetadata, this.formConfig);
          });
        });
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 3000);
      },
      (error) => {
        this.isSubmitting = false;
        console.error('Error creating customer and custom fields:', error);
      }
    );
  }


  showDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'flex'; // Show the dialog
    }
  }

  // Function to close the custom dialog
  closeDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'none'; // Hide the dialog
    }
  }

  applyDomManipulations(containerSelector: string) {
    // Kept for backward compatibility — no-op now
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // --- Copy Address Helpers (reusable for Customers & Vendors) ---
  private readonly ADDRESS_COPY_FIELDS = ['address', 'city', 'city_id', 'state', 'state_id', 'country', 'country_id', 'pin_code', 'phone', 'email'];
  private readonly COMM_ADDRESS_COPY_FIELDS = ['address', 'city', 'city_id', 'state', 'state_id', 'country', 'country_id', 'pin_code', 'phone', 'email'];

  copyBillingToShipping() {
    const addresses = this.formConfig.model['customer_addresses'];
    if (!addresses || addresses.length < 2) {
      this.notification.warning('No Address', 'Please fill billing address first.');
      return;
    }
    const billing = addresses[0];
    const hasData = this.ADDRESS_COPY_FIELDS.some(key => billing[key] != null && billing[key] !== '');
    if (!hasData) {
      this.notification.warning('Empty Address', 'Please fill billing address before copying.');
      return;
    }
    this.ADDRESS_COPY_FIELDS.forEach(key => {
      addresses[1][key] = billing[key] ?? null;
    });
    addresses[1]['address_type'] = 'Shipping';
    // Deep-clone to force Formly re-render
    this.formConfig.model = JSON.parse(JSON.stringify(this.formConfig.model));
    this.cdref.detectChanges();
    this.notification.success('Copied', 'Billing address copied to Shipping.');
  }

  copyShippingToBilling() {
    const addresses = this.formConfig.model['customer_addresses'];
    if (!addresses || addresses.length < 2) {
      this.notification.warning('No Address', 'Please fill shipping address first.');
      return;
    }
    const shipping = addresses[1];
    const hasData = this.ADDRESS_COPY_FIELDS.some(key => shipping[key] != null && shipping[key] !== '');
    if (!hasData) {
      this.notification.warning('Empty Address', 'Please fill shipping address before copying.');
      return;
    }
    this.ADDRESS_COPY_FIELDS.forEach(key => {
      addresses[0][key] = shipping[key] ?? null;
    });
    addresses[0]['address_type'] = 'Billing';
    this.formConfig.model = JSON.parse(JSON.stringify(this.formConfig.model));
    this.cdref.detectChanges();
    this.notification.success('Copied', 'Shipping address copied to Billing.');
  }

  // --- Copy Tax-tab addresses to Communication Address ---
  copyBillingToCommAddress() {
    const addresses = this.formConfig.model['customer_addresses'];
    if (!addresses || addresses.length < 1) {
      this.notification.warning('No Address', 'Please fill billing address in Tax Details tab first.');
      return;
    }
    const billing = addresses[0];
    const hasData = this.COMM_ADDRESS_COPY_FIELDS.some(key => billing[key] != null && billing[key] !== '');
    if (!hasData) {
      this.notification.warning('Empty Address', 'Please fill billing address in Tax Details tab before copying.');
      return;
    }
    const commAddresses = this.formConfig.model['communication_addresses'] || [{}];
    const commAddr = commAddresses[0] || {};
    this.COMM_ADDRESS_COPY_FIELDS.forEach(key => {
      commAddr[key] = billing[key] ?? null;
    });
    commAddresses[0] = { ...commAddr };
    this.formConfig.model['communication_addresses'] = commAddresses;
    this.formConfig.model = JSON.parse(JSON.stringify(this.formConfig.model));
    this.cdref.detectChanges();
    this.notification.success('Copied', 'Billing address copied to Communication Address.');
  }

  copyShippingToCommAddress() {
    const addresses = this.formConfig.model['customer_addresses'];
    if (!addresses || addresses.length < 2) {
      this.notification.warning('No Address', 'Please fill shipping address in Tax Details tab first.');
      return;
    }
    const shipping = addresses[1];
    const hasData = this.COMM_ADDRESS_COPY_FIELDS.some(key => shipping[key] != null && shipping[key] !== '');
    if (!hasData) {
      this.notification.warning('Empty Address', 'Please fill shipping address in Tax Details tab before copying.');
      return;
    }
    const commAddresses = this.formConfig.model['communication_addresses'] || [{}];
    const commAddr = commAddresses[0] || {};
    this.COMM_ADDRESS_COPY_FIELDS.forEach(key => {
      commAddr[key] = shipping[key] ?? null;
    });
    commAddresses[0] = { ...commAddr };
    this.formConfig.model['communication_addresses'] = commAddresses;
    this.formConfig.model = JSON.parse(JSON.stringify(this.formConfig.model));
    this.cdref.detectChanges();
    this.notification.success('Copied', 'Shipping address copied to Communication Address.');
  }

  // --- Merge communication_addresses into customer_addresses before sending to API ---
  private mergeCommAddressIntoPayload(payload: any): any {
    const commAddresses = payload['communication_addresses'];
    if (commAddresses && commAddresses.length > 0) {
      const commAddr = commAddresses[0];
      const hasData = this.COMM_ADDRESS_COPY_FIELDS.some(key => commAddr[key] != null && commAddr[key] !== '');
      if (hasData) {
        const commEntry = { ...commAddr, address_type: 'Communication' };
        // Remove any existing Communication address in the array
        payload['customer_addresses'] = (payload['customer_addresses'] || []).filter(
          (a: any) => a.address_type !== 'Communication'
        );
        payload['customer_addresses'].push(commEntry);
      }
    }
    // Remove the separate key so backend doesn't get confused
    delete payload['communication_addresses'];
    return payload;
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  // editCustomer(event: string) {
  //   this.CustomerEditID = event;

  //   // Fetch customer details
  //   this.http.get(`customers/customers/${event}`).subscribe(
  //     (res: any) => {
  //       if (res && res.data) {
  //         console.log("Res in edit : ", res)
  //         // Set customer data in the form model
  //         this.formConfig.model = res.data;
  //         this.formConfig.model['customer_id'] = this.CustomerEditID;

  //         // Ensure custom_field_values are correctly populated in the model
  //         if (res.data.custom_field_values) {
  //           this.formConfig.model['custom_field_values'] = res.data.custom_field_values.reduce((acc: any, fieldValue: any) => {
  //             acc[fieldValue.custom_field_id] = fieldValue.field_value; // Map custom_field_id to the corresponding value
  //             return acc;
  //           }, {});
  //         }

  //         // Update form labels for editing mode
  //         this.formConfig.pkId = 'customer_id';
  //         this.formConfig.submit.label = 'Update';
  //         this.showForm = true; // Display the form
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching customer data:', error);
  //     }
  //   );

  //   // Close the customer list modal
  //   this.hide();
  // }
  // editCustomer(event: string) {
  //   this.CustomerEditID = event;

  //   this.http.get(`customers/customers/${event}`).subscribe(
  //     (res: any) => {
  //       if (res && res.data) {
  //         console.log("Res in edit : ", res);

  //         // ------------------ MAIN MODEL SET ------------------
  //         this.formConfig.model = res.data;
  //         this.formConfig.model['customer_id'] = this.CustomerEditID;

  //         // ------------------ FIX START ------------------
  //         const addresses = res.data.customer_addresses || [];

  //         const billing = addresses.find((a: any) => a.address_type === 'Billing');
  //         const shippingList = addresses.filter((a: any) => a.address_type === 'Shipping');
  //         if (shippingList.length === 0) shippingList.push({ address_type: 'Shipping' });

  //         // Extract Communication address for the Communication tab
  //         const commAddress = addresses.find((a: any) => a.address_type === 'Communication');
  //         this.formConfig.model['communication_addresses'] = commAddress ? [commAddress] : [{}];

  //         this.formConfig.model.customer_addresses = [
  //           billing || { address_type: 'Billing' },
  //           ...shippingList
  //         ];
  //         // ------------------ FIX END ------------------

  //         // ------------------ CUSTOM FIELDS ------------------
  //         if (res.data.custom_field_values) {
  //           this.formConfig.model['custom_field_values'] =
  //             res.data.custom_field_values.reduce((acc: any, fieldValue: any) => {
  //               acc[fieldValue.custom_field_id] = fieldValue.field_value;
  //               return acc;
  //             }, {});
  //         }

  //         // ------------------ FORM STATE ------------------
  //         this.formConfig.pkId = 'customer_id';
  //         this.formConfig.submit.label = 'Update';
  //         this.showForm = true;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching customer data:', error);
  //     }
  //   );

  //   // hide() moved to inside subscribe success handler would be ideal,
  //   // but the form needs the modal to close for layout reasons.
  //   // Keep it here for now — the HTTP call populates model asynchronously.
  //   this.hide();
  // }

editCustomer(event: string) {
    this.CustomerEditID = event;

    this.http.get(`customers/customers/${event}`).subscribe(
      (res: any) => {
        if (res && res.data) {
          console.log("Res in edit : ", res);

          // ------------------ MAIN MODEL SET ------------------
          this.formConfig.model = res.data;
          this.formConfig.model['customer_id'] = this.CustomerEditID;

          // ===== NEW: Handle portal fields for display =====
          if (res.data.customer_data?.is_portal_user) {
            // Set masked password for display
            if (!this.formConfig.model.customer_data.password_display) {
              this.formConfig.model.customer_data.password_display = '••••••••';
            }
            
            // Show portal fields by finding and unhiding them
            setTimeout(() => {
              const portalFields = ['username', 'password_display', 'generate_credentials', 'send_credentials'];
              portalFields.forEach(fieldKey => {
                const field = this.findFieldInConfig(fieldKey);
                if (field) {
                  field.hide = false;
                  field.templateOptions.disabled = false;
                }
              });
              
              // Also show the portal section checkbox as checked
              const portalCheckbox = this.findFieldInConfig('is_portal_user');
              if (portalCheckbox) {
                portalCheckbox.hide = false;
              }
            }, 100); // Small timeout to ensure form is rendered
          }
          // ===== END NEW =====

          // ------------------ FIX START ------------------
          const addresses = res.data.customer_addresses || [];

          const billing = addresses.find((a: any) => a.address_type === 'Billing');
          const shippingList = addresses.filter((a: any) => a.address_type === 'Shipping');
          if (shippingList.length === 0) shippingList.push({ address_type: 'Shipping' });

          // Extract Communication address for the Communication tab
          const commAddress = addresses.find((a: any) => a.address_type === 'Communication');
          this.formConfig.model['communication_addresses'] = commAddress ? [commAddress] : [{}];

          this.formConfig.model.customer_addresses = [
            billing || { address_type: 'Billing' },
            ...shippingList
          ];
          // ------------------ FIX END ------------------

          // ------------------ CUSTOM FIELDS ------------------
          if (res.data.custom_field_values) {
            this.formConfig.model['custom_field_values'] =
              res.data.custom_field_values.reduce((acc: any, fieldValue: any) => {
                acc[fieldValue.custom_field_id] = fieldValue.field_value;
                return acc;
              }, {});
          }

          // ------------------ FORM STATE ------------------
          this.formConfig.pkId = 'customer_id';
          this.formConfig.submit.label = 'Update';
          this.showForm = true;
        }
      },
      (error) => {
        console.error('Error fetching customer data:', error);
      }
    );

    this.hide();
  }


  showCustomerListFn() {
    if (this.isCustomerPortal) return;  // Disable for customers
    this.showCustomerList = true;
    this.CustomersListComponent?.refreshTable();
  }

  showSuccessToast = false;
  toastMessage = '';
  // Method to handle updating the Customer
  // updateCustomer() {
  //   if (this.isSubmitting) return; // Prevent double-click
  //   const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields

  //   // Determine the entity type and ID dynamically
  //   const entityName = 'customers'; // Since we're in the Sale Order form
  //   const customId = this.formConfig.model.customer_data?.customer_id || null; //

  //   // Find entity record from list
  //   const entity = this.entitiesList.find(e => e.entity_name === entityName);

  //   if (!entity) {
  //     console.error(`Entity not found for: ${entityName}`);
  //     return;
  //   }

  //   const entityId = entity.entity_id;
  //   // Inject entity_id into metadata temporarily
  //   Object.keys(this.customFieldMetadata).forEach((key) => {
  //     this.customFieldMetadata[key].entity_id = entityId;
  //   });
  //   // Construct payload for custom fields
  //   const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityName, customId);
  //   if (!customFieldsPayload) {
  //     this.showDialog(); // Stop execution if required fields are missing
  //     return;
  //   }
  //   // Construct the final payload for update
  //   let payload: any = {
  //     ...this.formConfig.model,
  //     custom_field_values: customFieldsPayload.custom_field_values // Array of dictionaries
  //   };
  //   // Merge communication address into customer_addresses
  //   payload = this.mergeCommAddressIntoPayload(payload);

  //   console.log('Final Payload for Update:', payload); // Debugging to verify the payload

  //   // Send the update request with the payload
  //   this.isSubmitting = true;
  //   this.http.put(`customers/customers/${this.CustomerEditID}/`, payload).subscribe(
  //     (response: any) => {
  //       this.isSubmitting = false;
  //       this.showSuccessToast = true;
  //       this.toastMessage = "Record updated successfully";
  //       // Fully reset form: destroy → reinit → recreate (clears validation state)
  //       this.showForm = false;
  //       this.setFormConfig();
  //       setTimeout(() => {
  //         this.showForm = true;
  //         this.cdref.detectChanges();
  //         // Re-fetch custom fields for the fresh form
  //         CustomFieldHelper.fetchCustomFields(this.http, 'customers', (customFields: any, customFieldMetadata: any) => {
  //           CustomFieldHelper.addCustomFieldsToFormConfig(customFields, customFieldMetadata, this.formConfig);
  //         });
  //       });
  //       setTimeout(() => {
  //         this.showSuccessToast = false;
  //       }, 3000);
  //     },
  //     (error) => {
  //       this.isSubmitting = false;
  //       console.error('Error updating customer:', error);
  //     }
  //   );
  // }

updateCustomer() {
    if (this.isSubmitting) return; // Prevent double-click
    
    // ===== NEW: Handle portal fields before submission =====
    const customerData = this.formConfig.model.customer_data || {};
    
    // Handle portal fields for update
    if (customerData.is_portal_user) {
        // Ensure username is set
        if (!customerData.username && customerData.name) {
            customerData.username = customerData.name.toLowerCase().replace(/\s+/g, '.');
        }
        
        // Check if password was changed
        // If password_display is not '••••••••', it means a new password was generated
        if (customerData.password_display && customerData.password_display !== '••••••••') {
            // New password generated, send it
            customerData.password = customerData.password_display;
        } else {
            // Password not changed, don't send it
            delete customerData.password;
        }
        
        // Remove display field
        delete customerData.password_display;
    } else {
        // If portal access is being disabled, clear all portal fields
        delete customerData.username;
        delete customerData.password;
        delete customerData.is_portal_user;
        delete customerData.password_display;
    }
    // ===== END NEW =====

    const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields

    // Determine the entity type and ID dynamically
    const entityName = 'customers'; // Since we're in the Sale Order form
    const customId = this.formConfig.model.customer_data?.customer_id || null; //

    // Find entity record from list
    const entity = this.entitiesList.find(e => e.entity_name === entityName);

    if (!entity) {
      console.error(`Entity not found for: ${entityName}`);
      return;
    }

    const entityId = entity.entity_id;
    // Inject entity_id into metadata temporarily
    Object.keys(this.customFieldMetadata).forEach((key) => {
      this.customFieldMetadata[key].entity_id = entityId;
    });
    // Construct payload for custom fields
    const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityName, customId);
    if (!customFieldsPayload) {
      this.showDialog(); // Stop execution if required fields are missing
      return;
    }
    // Construct the final payload for update
    let payload: any = {
      ...this.formConfig.model,
      custom_field_values: customFieldsPayload.custom_field_values // Array of dictionaries
    };
    // Merge communication address into customer_addresses
    payload = this.mergeCommAddressIntoPayload(payload);

    console.log('Final Payload for Update:', payload); // Debugging to verify the payload

    // Send the update request with the payload
    this.isSubmitting = true;
    this.http.put(`customers/customers/${this.CustomerEditID}/`, payload).subscribe(
      (response: any) => {
        this.isSubmitting = false;
        this.showSuccessToast = true;
        this.toastMessage = "Record updated successfully";
        
        // ===== NEW: Handle portal credentials in response if any =====
        if (response?.data?.[0]?.customer_data?.portal_credentials) {
          const credentials = response.data[0].customer_data.portal_credentials;
          this.notification.success(
            `Portal Credentials Updated<br>Username: ${credentials.username}<br>Password: ${credentials.password}`,
            '',
            { nzDuration: 0 }
          );
        }
        // ===== END NEW =====

        // Fully reset form: destroy → reinit → recreate (clears validation state)
        this.showForm = false;
        this.setFormConfig();
        setTimeout(() => {
          this.showForm = true;
          this.cdref.detectChanges();
          // Re-fetch custom fields for the fresh form
          CustomFieldHelper.fetchCustomFields(this.http, 'customers', (customFields: any, customFieldMetadata: any) => {
            CustomFieldHelper.addCustomFieldsToFormConfig(customFields, customFieldMetadata, this.formConfig);
          });
        });
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 3000);
      },
      (error) => {
        this.isSubmitting = false;
        console.error('Error updating customer:', error);
      }
    );
  }

  // Helper method to find a field in formConfig
findFieldInConfig(fieldKey: string): any {
  const searchInFields = (fields: any[]): any => {
    for (const field of fields) {
      if (field.key === fieldKey) return field;
      if (field.fieldGroup) {
        const found = searchInFields(field.fieldGroup);
        if (found) return found;
      }
      if (field.fieldGroup?.forEach) {
        for (const subField of field.fieldGroup) {
          if (subField.key === fieldKey) return subField;
          if (subField.fieldGroup) {
            const found = searchInFields(subField.fieldGroup);
            if (found) return found;
          }
        }
      }
    }
    return null;
  };
  
  return searchInFields(this.formConfig.fields);
}

// Generate random password
generatePassword(field: any) {
  const length = 10;
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Set both display field and actual password field
  field.parent.formControl.get('password_display')?.setValue(password);
  field.parent.formControl.get('password')?.setValue(password);
}

// Generate credentials for existing customer (when editing)
// Generate credentials for existing customer (when editing)
generateCustomerCredentials() {
  if (!this.CustomerEditID) {
    this.notification.error('Please save the customer first', '');
    return;
  }
  
  this.http.post(`customers/generate-credentials/${this.CustomerEditID}/`, {}).subscribe(
    (res: any) => {
      if (res.success) {
        // Update form with generated credentials
        this.formConfig.model.customer_data.username = res.username;
        this.formConfig.model.customer_data.password_display = res.password;
        this.formConfig.model.customer_data.is_portal_user = true;
        
        // Show credentials in a modal for copying
        this.modal.success({
          nzTitle: 'Credentials Generated',
          nzContent: `
            <div style="padding: 16px 0;">
              <p><strong>Username:</strong> ${res.username}</p>
              <p><strong>Password:</strong> ${res.password}</p>
              <p><small class="text-muted">These credentials will be sent via WhatsApp.</small></p>
            </div>
          `,
          nzOkText: 'Copy & Close',
          nzOnOk: () => {
            const credentials = `Username: ${res.username}\nPassword: ${res.password}`;
            navigator.clipboard.writeText(credentials).then(() => {
              this.notification.success('Credentials copied to clipboard', '');
            });
          }
        });
        
        this.notification.success('Credentials generated successfully', '');
      }
    },
    (error) => {
      this.notification.error('Error generating credentials', '');
    }
  );
}

customerName = '';
hasPhoneNumber = false;
hasEmail = false;

// Add these methods to your component

showSendCredentialsPopup() {
  // Get customer name
  this.customerName = this.formConfig.model.customer_data?.name || 'Customer';
  
  // Check phone number
  const address = this.formConfig.model.customer_addresses?.find((addr: any) => addr.phone);
  const phone = address?.phone || '';
  this.hasPhoneNumber = phone && phone.trim() !== '';
  
  // Check email from addresses
  const emailAddress = this.formConfig.model.customer_addresses?.find((addr: any) => addr.email);
  this.hasEmail = emailAddress?.email && emailAddress.email.trim() !== '';
  
  if (!this.hasPhoneNumber && !this.hasEmail) {
    this.modal.warning({
      nzTitle: 'Cannot Send Credentials',
      nzContent: 'No phone number or email found. Please add contact information in customer addresses first.',
      nzOkText: 'OK'
    });
    return;
  }
  
  // If only email is missing, show warning but still allow WhatsApp
  if (!this.hasEmail) {
    this.modal.warning({
      nzTitle: 'No Email Found',
      nzContent: 'No email address found in customer addresses. Only WhatsApp option will be available.',
      nzOkText: 'OK'
    });
  }
  
  // If only phone is missing, show warning but still allow email
  if (!this.hasPhoneNumber) {
    this.modal.warning({
      nzTitle: 'No Phone Number Found',
      nzContent: 'No phone number found in customer addresses. Only Email option will be available.',
      nzOkText: 'OK'
    });
  }
  
  // Show the modal
  const modalElement = document.getElementById('sendCredentialsModal');
  if (modalElement) {
    const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
    bootstrapModal.show();
  }
}

sendViaEmail() {
  // Call your existing email API
  this.http.post(`customers/send-credentials/${this.CustomerEditID}/?method=email`, {}).subscribe(
    (res: any) => {
      if (res.success) {
        this.notification.success('Credentials sent successfully via email!', '');
      } else {
        this.notification.error(res.message, '');
      }
    },
    (error) => {
      this.notification.error('Failed to send email', '');
    }
  );
}

sendViaWhatsApp() {
  // Show message that WhatsApp is under construction
  this.modal.info({
    nzTitle: 'WhatsApp Template Under Construction',
    nzContent: 'WhatsApp template is currently under construction. Please use email to send credentials.',
    nzOkText: 'OK'
  });
}

// Show popup to send credentials
// showSendCredentialsPopup() {
//   if (!this.CustomerEditID) {
//     this.notification.error('Please save the customer first', '');
//     return;
//   }
  
//   // Check if customer has phone number
//   const hasPhone = this.formConfig.model.customer_addresses?.some(
//     (addr: any) => addr.phone && addr.phone.trim() !== ''
//   );

//   let content = 'Do you want to send the login credentials to the customer via WhatsApp?';
//   if (!hasPhone) {
//     content = 'Warning: No phone number found in customer addresses. Please add a phone number first.';
//     this.modal.warning({
//       nzTitle: 'Cannot Send',
//       nzContent: content,
//       nzOkText: 'OK'
//     });
//     return;
//   }

//   const modal = this.modal.confirm({
//     nzTitle: 'Send Credentials via WhatsApp',
//     nzContent: content,
//     nzOkText: 'Yes, Send',
//     nzOkType: 'primary',
//     nzCancelText: 'No',
//     nzOnOk: () => this.sendCredentialsToCustomer()
//   });
// }

// Send credentials to customer
// sendCredentialsToCustomer() {
//   this.http.post(`customers/send-credentials/${this.CustomerEditID}/`, {}).subscribe(
//     (res: any) => {
//       if (res.success) {
//         this.notification.success('Credentials sent successfully to customer', '');
//       } else {
//         this.notification.warning(res.message || 'Failed to send credentials', '');
//       }
//     },
//     (error) => {
//       this.notification.error('Error sending credentials', '');
//     }
//   );
// }

// Send credentials to customer
// Send credentials to customer
sendCredentialsToCustomer() {
  this.http.post(`customers/send-credentials/${this.CustomerEditID}/`, {}).subscribe(
    (res: any) => {
      if (res.success) {
        // Handle different modes
        if (res.mode === 'click_to_chat' && res.whatsapp_url) {
          // Local development - open WhatsApp in new tab
          window.open(res.whatsapp_url, '_blank');
          this.notification.success('WhatsApp opened! Send the message to customer', '');
        } else if (res.mode === 'wati') {
          // Production - message sent directly
          this.notification.success('Credentials sent via WhatsApp successfully', '');
        } else {
          this.notification.success(res.message || 'Credentials sent successfully', '');
        }
      } else {
        this.notification.warning(res.message || 'Failed to send credentials', '');
      }
    },
    (error) => {
      console.error('Send credentials error:', error);
      this.notification.error('Error sending credentials', error.error?.message || '');
    }
  );
}

  setFormConfig() {
    this.CustomerEditID = null;
    this.formConfig = {
      // url: "customers/customers/",
      title: '',
      formState: {
        viewMode: this.isCustomerPortal || false 
      },
      showActionBtn: !this.isCustomerPortal,
      exParams: [],
      submit: {
        label: 'Submit',
        submittedFn: () => {
          if (!this.CustomerEditID) {
            this.submitCustomerForm();
          } else {
            this.updateCustomer();
            // Otherwise, create a new record
          }
        }
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        customer_data: {},
        customer_attachments: [],
        customer_addresses: [{
          address_type: 'Billing',
        }, {
          address_type: 'Shipping',
        }],
        communication_addresses: [{}],
        custom_field_values: []
      },
      fields: [
        {
          fieldGroup: [
            {
              className: 'col-12 custom-form-card-block p-0',
              key: 'customer_data',
              fieldGroupClassName: 'row m-0 pr-0 responsive-row',
              fieldGroup: [
                // Left Section (col-9 for form fields)
                {
                  className: 'col-sm-9 col-12 p-0',
                  fieldGroupClassName: 'row m-0 p-0',
                  fieldGroup: [
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'name',
                      type: 'input',
                      templateOptions: {
                        label: 'Name',
                        placeholder: 'Enter Name',
                        required: true,
                      }
                    },
                    // {
                    //   className: 'col-md-4 col-sm-6 col-12',
                    //   key: 'print_name',
                    //   type: 'input',
                    //   templateOptions: {
                    //     label: 'Print Name',
                    //     placeholder: 'Enter Print Name',
                    //     required: true,
                    //   }
                    // },
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'code',
                      type: 'input',
                      templateOptions: {
                        label: 'Code',
                        placeholder: 'Enter Code',
                        required: false,
                      },
                      hooks: {
                        onInit: (field: any) => {
                          this.http.get('masters/generate_order_no/?type=cust').subscribe((res: any) => {
                            if (res && res.data && res.data?.order_number) {
                              console.log('Generated Code:', res.data.order_number);
                              field.formControl.setValue(res.data?.order_number);
                            }
                          });
                        }
                      }
                    },

                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'customer_category',
                      type: 'customer-cagtegory-dropdown',
                      templateOptions: {
                        label: 'Customer Category',
                        dataKey: 'customer_category_id',
                        dataLabel: 'name',
                        required: true,
                        options: [],
                        lazy: {
                          url: 'masters/customer_categories/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                              this.formConfig.model['customer_data']['customer_category_id'] = data.customer_category_id;
                            } else {
                              console.error('Form config or Customer data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      key: 'ledger_account',
                      type: 'ledger-account-dropdown',
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        dataKey: 'ledger_account_id',
                        dataLabel: 'name',
                        label: 'Under Ledger',
                        placeholder: 'Select Under Ledger',
                        required: true,
                        lazy: {
                          url: 'customers/ledger_accounts/?group_purpose=AccountsReceivable',
                          lazyOneTime: true
                        },
                        curdConfig: this.customerLedgerCurdConfig
                      },
                      hooks: {
                        onInit: (field: any) => {
                          // Auto-select "Sundry Debtors" for new customers
                          const isNewRecord = !field.model?.customer_data?.customer_id &&
                                             !field.formControl?.value;
                          if (isNewRecord) {
                            this.http.get('customers/ledger_accounts/?group_purpose=AccountsReceivable&search=Sundry Debtors&limit=5').subscribe({
                              next: (res: any) => {
                                const accounts = res?.data || res?.results || [];
                                const sundryDebtors = accounts.find((a: any) =>
                                  a.name?.toLowerCase().includes('sundry debtor')
                                );
                                if (sundryDebtors) {
                                  field.formControl.setValue(sundryDebtors);
                                }
                              },
                              error: () => {}
                            });
                          }
                        },
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                              this.formConfig.model['customer_data']['ledger_account_id'] = data?.ledger_account_id;
                            }
                          });
                        }
                      }
                    },
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'customer_common_for_sales_purchase',
                      type: 'checkbox',
                      templateOptions: {
                        label: 'Customer Common for Sales and Purchase',
                      }
                    },
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'is_sub_customer',
                      type: 'checkbox',
                      templateOptions: {
                        label: 'Is Sub Customer',
                      }
                    },
                    // {
                    //   className: 'col-md-4 col-sm-6 col-12',
                    //   key: 'tax_type',
                    //   type: 'select',
                    //   templateOptions: {
                    //     label: 'Tax Type',
                    //     placeholder: 'Select Tax Type',
                    //     options: [
                    //       { value: 'Inclusive', label: 'Inclusive' },
                    //       { value: 'Exclusive', label: 'Exclusive' }
                    //     ],
                    //     required: false,
                    //   }
                    // },
                    {
                      className: 'col-12 mt-3',
                      fieldGroupClassName: 'row',
                      fieldGroup: [
                        {
                          className: 'col-12',
                          key: 'is_portal_user',
                          type: 'checkbox',
                          templateOptions: {
                            label: 'Enable Customer Portal Access',
                            description: 'Allow customer to login and view their data'
                          },
                          hooks: {
                            onChanges: (field: any) => {
                              const isEnabled = field.formControl.value;
                              const portalFields = [
                                'username',
                                'password_display',
                                'generate_credentials',
                                'send_credentials'
                              ];
                              
                              // Show/hide portal fields based on checkbox
                              portalFields.forEach(fieldKey => {
                                const portalField = this.findFieldInConfig(fieldKey);
                                if (portalField) {
                                  portalField.hide = !isEnabled;
                                }
                              });
                            }
                          }
                        },
                        // Username Field
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'username',
                          type: 'input',
                          hide: true, // Initially hidden
                          templateOptions: {
                            label: 'Portal Username',
                            placeholder: 'Auto-generated from name',
                            description: 'Leave empty to auto-generate'
                          }
                        },
                        // Password Display (read-only)
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'password_display',
                          type: 'input',
                          hide: true,
                          templateOptions: {
                            label: 'Password',
                            readonly: true,
                            description: 'Password is auto-generated and hashed',
                            addonRight: {
                              text: 'Generate',
                              onClick: (field: any, $event: any) => this.generatePassword(field)
                            }
                          }
                        },
                        // Hidden actual password field
                        {
                          key: 'password',
                          type: 'input',
                          hide: true,
                          templateOptions: {
                            label: 'Password',
                            hidden: true
                          }
                        },
                        // Action Buttons Row
                        {
                          className: 'col-12 mt-2',
                          fieldGroupClassName: 'd-flex gap-2',
                          fieldGroup: [
                            {
                              className: 'col-auto',
                              type: 'button',
                              key: 'generate_credentials',
                              hide: true,
                              templateOptions: {
                                label: 'Generate Credentials',
                                btnType: 'primary',
                                onClick: (field: any, $event: any) => this.generateCustomerCredentials()
                              }
                            },
                            {
                              className: 'col-auto',
                              type: 'button',
                              key: 'send_credentials',
                              hide: true,
                              templateOptions: {
                                label: 'Send Credentials to Customer',
                                btnType: 'success',
                                onClick: (field: any, $event: any) => this.showSendCredentialsPopup()
                              }
                            }
                          ]
                        }
                      ]
                    },

                  ]
                },
                {
                  className: 'col-sm-3 col-12 p-0',
                  // key: 'customer_data',
                  fieldGroupClassName: "ant-row row mx-0 mt-2",
                  fieldGroup: [
                    {
                      key: 'picture',
                      type: 'file',
                      className: 'ta-cell pr-md col d-flex justify-content-md-center pr-0',
                      templateOptions: {
                        label: 'Picture',
                        // required: false
                      }
                    }
                  ]
                },
              ]
            }
          ]
        },
        {
          className: "tab-form-list",
          type: 'tabs',
          fieldGroup: [
            {
              className: 'col-12 pb-0',
              fieldGroupClassName: "field-no-bottom-space",
              props: {
                label: 'Tax Details'
              },
              fieldGroup: [
                // --- Tax Fields ---
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 p-0',
                      key: 'customer_data',
                      fieldGroupClassName: "ant-row row align-items-end mt-3",
                      fieldGroup: [
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'gst_category',
                          type: 'select',
                          templateOptions: {
                            label: 'GST Category',
                            dataKey: 'gst_category_id',
                            dataLabel: 'name',
                            options: [
                              { label: 'Registered', value: { gst_category_id: 'registered', name: 'Registered' } },
                              { label: 'Unregistered', value: { gst_category_id: 'unregistered', name: 'Unregistered' } }
                            ],
                          },
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'gst',
                          type: 'input',
                          templateOptions: {
                            label: 'GST No',
                            placeholder: 'Enter GST',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'pan',
                          type: 'input',
                          templateOptions: {
                            label: 'PAN',
                            placeholder: 'Enter PAN',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'gst_suspend',
                          type: 'checkbox',
                          templateOptions: {
                            label: 'GST Suspend',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'tds_on_gst_applicable',
                          type: 'checkbox',
                          templateOptions: {
                            label: 'TDS on GST Applicable',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'tds_applicable',
                          type: 'checkbox',
                          templateOptions: {
                            label: 'TDS Applicable',
                          }
                        },
                      ]
                    },
                  ]
                },
                // --- Addresses Section ---
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      key: 'customer_addresses',
                      type: 'table',
                      className: 'custom-form-list address-table-actions',
                      templateOptions: {
                        title: 'Addresses',
                        addText: 'Add Shipping Address',
                        showAddBtn: true,
                        minRows: 2,
                        extraActionText: 'Copy Billing → Shipping',
                        extraActionIcon: 'fas fa-copy',
                        onExtraAction: () => this.copyBillingToShipping(),
                        columnConfig: {
                          moduleKey: 'customer_addresses',
                          lockedColumns: ['address_type', 'state'],
                          defaultHidden: [],
                          excludeFromSettings: ['address_type'],
                          showColumnSettings: false,
                          defaultWidths: {
                            address_type: 100,
                            address: 180,
                            city: 120,
                            state: 120,
                            country: 120,
                            pin_code: 100,
                            phone: 120,
                            email: 150
                          },
                          minColumnWidth: 60
                        },
                        tableCols: [
                          { name: 'address_type', label: 'Address Type' },
                          { name: 'address', label: 'Full Address' },
                          { name: 'city', label: 'City' },
                          { name: 'state', label: 'State' },
                          { name: 'country', label: 'Country' },
                          { name: 'pin_code', label: 'Pin Code' },
                          { name: 'phone', label: 'Phone' },
                          { name: 'email', label: 'Email' }
                        ]
                      },
                      fieldArray: {
                        fieldGroup: [
                          {
                            key: 'address_type',
                            type: 'input',
                            defaultValue: 'Shipping',
                            className: 'custom-select-bold',
                            templateOptions: {
                              label: 'Address Type',
                              hideLabel: true,
                              readonly: true,
                              required: true,
                              attributes: {
                                style: 'font-weight: bold; border: none; background-color: transparent; margin-bottom: 10px;'
                              }
                            }
                          },
                          {
                            type: 'textarea',
                            key: 'address',
                            templateOptions: {
                              label: 'Full Address',
                              hideLabel: true,
                              placeholder: 'Address',
                            }
                          },
                          {
                            key: 'city',
                            type: 'city-dropdown',
                            templateOptions: {
                              dataKey: 'city_id',
                              dataLabel: 'city_name',
                              label: 'City',
                              placeholder: 'City',
                              hideLabel: true,
                              required: false,
                              lazy: {
                                url: 'masters/city/',
                                lazyOneTime: true
                              }
                            },
                            hooks: {
                              onChanges: (field: any) => {
                                field.formControl.valueChanges.subscribe((data: any) => {
                                  console.log('city', data);
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['customer_addresses'][index]['city_id'] = data?.city_id ?? null;
                                  } else {
                                    console.error('Form config or Customer addresses model is not defined.');
                                  }
                                });
                              }
                            }
                          },
                          {
                            key: 'state',
                            type: 'state-dropdown',
                            templateOptions: {
                              dataKey: 'state_id',
                              dataLabel: 'state_name',
                              label: 'State',
                              placeholder: 'State',
                              hideLabel: true,
                              required: false,
                              lazy: {
                                url: 'masters/state/',
                                lazyOneTime: true
                              }
                            },
                            hooks: {
                              onChanges: (field: any) => {
                                field.formControl.valueChanges.subscribe((data: any) => {
                                  console.log('state', data);
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['customer_addresses'][index]['state_id'] = data?.state_id ?? null;
                                  } else {
                                    console.error('Form config or Customer addresses model is not defined.');
                                  }
                                });
                              }
                            }
                          },
                          {
                            key: 'country',
                            type: 'country-dropdown',
                            templateOptions: {
                              dataKey: 'country_id',
                              dataLabel: 'country_name',
                              label: 'Country',
                              placeholder: 'Country',
                              hideLabel: true,
                              required: false,
                              lazy: {
                                url: 'masters/country/',
                                lazyOneTime: true
                              }
                            },
                            hooks: {
                              onChanges: (field: any) => {
                                field.formControl.valueChanges.subscribe((data: any) => {
                                  console.log('country', data);
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['customer_addresses'][index]['country_id'] = data?.country_id ?? null;
                                  } else {
                                    console.error('Form config or Customer addresses model is not defined.');
                                  }
                                });
                              }
                            }
                          },
                          {
                            type: 'input',
                            key: 'pin_code',
                            templateOptions: {
                              label: 'Pin Code',
                              hideLabel: true,
                              placeholder: 'Pin Code',
                            },
                            hooks: {
                              onInit: (field: any) => {
                                field.formControl.valueChanges.subscribe((value: any) => {
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['customer_addresses'][index]['pin_code'] = value === '' ? null : value;
                                  } else {
                                    console.error('Form config or Customer addresses model is not defined.');
                                  }
                                });
                              }
                            }
                          },

                          // {
                          //   type: 'input',
                          //   key: 'pin_code',
                          //   templateOptions: {
                          //     label: 'Pin Code',
                          //     hideLabel: true,
                          //     placeholder: 'Pin Code',
                          //   }
                          // },
                          {
                            type: 'input',
                            key: 'phone',
                            templateOptions: {
                              label: 'Phone',
                              hideLabel: true,
                              placeholder: 'Phone',
                            },
                            hooks: {
                              onInit: (field: any) => {
                                field.formControl.valueChanges.subscribe((value: any) => {
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['customer_addresses'][index]['phone'] = value === '' ? null : value;
                                  } else {
                                    console.error('Form config or Customer addresses model is not defined.');
                                  }
                                });
                              }
                            }
                          },
                          {
                            type: 'input',
                            key: 'email',
                            templateOptions: {
                              label: 'Email',
                              hideLabel: true,
                              placeholder: 'Email',
                            },
                            hooks: {
                              onInit: (field: any) => {
                                field.formControl.valueChanges.subscribe((value: any) => {
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['customer_addresses'][index]['email'] = value === '' ? null : value;
                                  } else {
                                    console.error('Form config or Customer addresses model is not defined.');
                                  }
                                });
                              }
                            }
                          },

                          // {
                          //   type: 'input',
                          //   key: 'phone',
                          //   templateOptions: {
                          //     label: 'Phone',
                          //     hideLabel: true,
                          //     placeholder: 'Phone',
                          //   }
                          // },
                          // {
                          //   type: 'input',
                          //   key: 'email',
                          //   templateOptions: {
                          //     label: 'Email',
                          //     hideLabel: true,
                          //     placeholder: 'email',
                          //   }
                          // },

                        ]
                      }
                    },
                  ]
                }
              ]
            },
            // ===================== COMMUNICATION TAB =====================
            {
              className: 'col-12 pb-0',
              fieldGroupClassName: "field-no-bottom-space",
              props: {
                label: 'Communication'
              },
              fieldGroup: [
                // --- Contact Person, Phone, Email ---
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 p-0',
                      key: 'customer_data',
                      fieldGroupClassName: "ant-row row align-items-end mt-3",
                      fieldGroup: [
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'contact_person',
                          type: 'input',
                          templateOptions: {
                            label: 'Contact Person',
                            placeholder: 'Enter Contact Person',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'phone',
                          type: 'input',
                          templateOptions: {
                            label: 'Phone',
                            placeholder: 'Enter Phone',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'email',
                          type: 'input',
                          templateOptions: {
                            label: 'Email',
                            placeholder: 'Enter Email',
                          }
                        },
                      ]
                    },
                  ]
                },
                // --- Communication Address Section (Table style matching Tax Details) ---
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      key: 'communication_addresses',
                      type: 'table',
                      className: 'custom-form-list comm-address-table',
                      templateOptions: {
                        title: 'Communication Address',
                        addText: '',
                        showAddBtn: false,
                        minRows: 1,
                        extraActionText: 'Copy from Billing',
                        extraActionIcon: 'fas fa-copy',
                        onExtraAction: () => this.copyBillingToCommAddress(),
                        secondActionText: 'Copy from Shipping',
                        secondActionIcon: 'fas fa-copy',
                        onSecondAction: () => this.copyShippingToCommAddress(),
                        columnConfig: {
                          moduleKey: 'communication_addresses',
                          lockedColumns: [],
                          defaultHidden: [],
                          excludeFromSettings: [],
                          showColumnSettings: false,
                          defaultWidths: {
                            address: 200,
                            city: 120,
                            state: 120,
                            country: 120,
                            pin_code: 100
                          },
                          minColumnWidth: 60
                        },
                        tableCols: [
                          { name: 'address', label: 'Full Address' },
                          { name: 'city', label: 'City' },
                          { name: 'state', label: 'State' },
                          { name: 'country', label: 'Country' },
                          { name: 'pin_code', label: 'Pin Code' },
                          // phone & email omitted — already captured in the Contact Person section above
                        ]
                      },
                      fieldArray: {
                        fieldGroup: [
                          {
                            type: 'textarea',
                            key: 'address',
                            templateOptions: {
                              label: 'Full Address',
                              hideLabel: true,
                              placeholder: 'Address',
                            }
                          },
                          {
                            key: 'city',
                            type: 'city-dropdown',
                            templateOptions: {
                              dataKey: 'city_id',
                              dataLabel: 'city_name',
                              label: 'City',
                              placeholder: 'City',
                              hideLabel: true,
                              required: false,
                              lazy: {
                                url: 'masters/city/',
                                lazyOneTime: true
                              }
                            },
                            hooks: {
                              onChanges: (field: any) => {
                                field.formControl.valueChanges.subscribe((data: any) => {
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['communication_addresses'][index]['city_id'] = data?.city_id ?? null;
                                  }
                                });
                              }
                            }
                          },
                          {
                            key: 'state',
                            type: 'state-dropdown',
                            templateOptions: {
                              dataKey: 'state_id',
                              dataLabel: 'state_name',
                              label: 'State',
                              placeholder: 'State',
                              hideLabel: true,
                              required: false,
                              lazy: {
                                url: 'masters/state/',
                                lazyOneTime: true
                              }
                            },
                            hooks: {
                              onChanges: (field: any) => {
                                field.formControl.valueChanges.subscribe((data: any) => {
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['communication_addresses'][index]['state_id'] = data?.state_id ?? null;
                                  }
                                });
                              }
                            }
                          },
                          {
                            key: 'country',
                            type: 'country-dropdown',
                            templateOptions: {
                              dataKey: 'country_id',
                              dataLabel: 'country_name',
                              label: 'Country',
                              placeholder: 'Country',
                              hideLabel: true,
                              required: false,
                              lazy: {
                                url: 'masters/country/',
                                lazyOneTime: true
                              }
                            },
                            hooks: {
                              onChanges: (field: any) => {
                                field.formControl.valueChanges.subscribe((data: any) => {
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['communication_addresses'][index]['country_id'] = data?.country_id ?? null;
                                  }
                                });
                              }
                            }
                          },
                          {
                            type: 'input',
                            key: 'pin_code',
                            templateOptions: {
                              label: 'Pin Code',
                              hideLabel: true,
                              placeholder: 'Pin Code',
                            },
                            hooks: {
                              onInit: (field: any) => {
                                field.formControl.valueChanges.subscribe((value: any) => {
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['communication_addresses'][index]['pin_code'] = value === '' ? null : value;
                                  }
                                });
                              }
                            }
                          },
                          // phone & email fields commented out — already in Contact Person section above
                          // {
                          //   type: 'input',
                          //   key: 'phone',
                          //   templateOptions: {
                          //     label: 'Phone',
                          //     hideLabel: true,
                          //     placeholder: 'Phone',
                          //   },
                          // },
                          // {
                          //   type: 'input',
                          //   key: 'email',
                          //   templateOptions: {
                          //     label: 'Email',
                          //     hideLabel: true,
                          //     placeholder: 'Email',
                          //   },
                          // },
                        ]
                      }
                    },
                  ]
                },
              ]
            },
            {
              className: 'col-12 custom-form-card-block',
              props: {
                label: 'Account Details'
              },
              fieldGroup: [
                {
                  fieldGroup: [
                    {
                      className: 'col-12 p-0',
                      key: 'customer_data',
                      fieldGroupClassName: "ant-row row align-items-end mt-3",
                      fieldGroup: [
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'payment_term',
                          type: 'customer-payment-dropdown',
                          templateOptions: {
                            label: 'Payment Term',
                            dataKey: 'payment_term_id',
                            dataLabel: 'name',
                            options: [],
                            lazy: {
                              url: 'masters/customer_payment_terms/',
                              lazyOneTime: true
                            }
                          },
                          hooks: {
                            onChanges: (field: any) => {
                              field.formControl.valueChanges.subscribe((data: any) => {
                                if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                  this.formConfig.model['customer_data']['payment_term_id'] = data.payment_term_id;
                                } else {
                                  console.error('Form config or Customer data model is not defined.');
                                }
                              });
                            }
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'interest_rate_yearly',
                          type: 'input',
                          templateOptions: {
                            label: 'Interest Rate Yearly',
                            placeholder: 'Enter Interest Rate Yearly',
                            type: 'number',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'price_category',
                          type: 'price-cat-dropdown',
                          templateOptions: {
                            label: 'Price Category',
                            dataKey: 'price_category_id',
                            dataLabel: 'name',
                            options: [],
                            lazy: {
                              url: 'masters/price_categories/',
                              lazyOneTime: true
                            }
                          },
                          hooks: {
                            onChanges: (field: any) => {
                              field.formControl.valueChanges.subscribe((data: any) => {
                                if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                  this.formConfig.model['customer_data']['price_category_id'] = data.price_category_id;
                                } else {
                                  console.error('Form config or Customer data model is not defined.');
                                }
                              });
                            }
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'credit_limit',
                          type: 'input',
                          templateOptions: {
                            label: 'Credit Limit',
                            placeholder: 'Enter Credit Limit',
                            type: 'number',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'max_credit_days',
                          type: 'input',
                          templateOptions: {
                            label: 'Max Credit Days',
                            placeholder: 'Enter Max Credit Days',
                            type: 'number',
                          }
                        },

                      ]
                    },
                  ]
                }
              ]
            },
            {
              className: 'col-12 pb-0',
              fieldGroupClassName: "field-no-bottom-space",
              props: {
                label: 'Social Accounts'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 p-0',
                      key: 'customer_data',
                      fieldGroupClassName: "ant-row row align-items-end mt-3",
                      fieldGroup: [
                        {
                          className: 'ta-cell pr-md col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'website',
                          type: 'input',
                          templateOptions: {
                            label: 'Website',
                            placeholder: 'Enter Website URL',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'facebook',
                          type: 'input',
                          templateOptions: {
                            label: 'Facebook',
                            placeholder: 'Enter Facebook URL',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'skype',
                          type: 'input',
                          templateOptions: {
                            label: 'Skype',
                            placeholder: 'Enter Skype ID',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'twitter',
                          type: 'input',
                          templateOptions: {
                            label: 'Twitter',
                            placeholder: 'Enter Twitter URL',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'linked_in',
                          type: 'input',
                          templateOptions: {
                            label: 'LinkedIn',
                            placeholder: 'Enter LinkedIn URL',
                          }
                        },
                      ]
                    },
                  ]
                }
              ]
            },
            {
              className: 'col-12 pb-0',
              fieldGroupClassName: "field-no-bottom-space",
              props: {
                label: 'Transport Details'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 p-0',
                      key: 'customer_data',
                      fieldGroupClassName: "ant-row row align-items-end mt-3",
                      fieldGroup: [
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'transporter',
                          type: 'transport-dropdown',
                          templateOptions: {
                            label: 'Transporter',
                            dataKey: 'transporter_id',
                            dataLabel: 'name',
                            options: [],
                            lazy: {
                              url: 'masters/transporters/',
                              lazyOneTime: true
                            }
                          },
                          hooks: {
                            onChanges: (field: any) => {
                              field.formControl.valueChanges.subscribe((data: any) => {
                                if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                  this.formConfig.model['customer_data']['transporter_id'] = data.transporter_id;
                                } else {
                                  console.error('Form config or Customer data model is not defined.');
                                }
                              });
                            }
                          }
                        },
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'distance',
                          type: 'input',
                          templateOptions: {
                            label: 'Distance',
                            placeholder: 'Enter Distance',
                            type: 'number',
                          }
                        },
                      ]
                    },
                  ]
                }
              ]
            },
            {
              className: 'col-12 px-0 pt-3',
              props: {
                label: 'Attachments'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 custom-form-card-block w-100 p-0',
                      fieldGroup: [
                        {
                          key: 'customer_attachments',
                          type: 'file',
                          className: 'ta-cell col-12 col-md-6 custom-file-attachement',
                          props: {
                            "displayStyle": "files",
                            "multiple": true
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              className: 'col-12 custom-form-card-block p-0',
              fieldGroupClassName: 'row m-0 pr-0',
              props: {
                label: 'Other Details'
              },
              fieldGroup: [
                {
                  className: 'col-12 p-0',
                  key: 'customer_data',
                  fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
                  fieldGroup: [
                    {
                      className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                      key: 'firm_status',
                      type: 'firm-status-dropdown',
                      templateOptions: {
                        label: 'Firm Status',
                        dataKey: 'firm_status_id',
                        dataLabel: 'name',
                        options: [],
                        lazy: {
                          url: 'masters/firm_statuses/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                              this.formConfig.model['customer_data']['firm_status_id'] = data.firm_status_id;
                            } else {
                              console.error('Form config or Customer data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                      key: 'registration_date',
                      type: 'date',
                      defaultValue: this.nowDate(),
                      templateOptions: {
                        label: 'Registration Date',
                        placeholder: 'Enter Registration Date',
                        type: 'date',
                        readonly: true
                      }
                    },
                    {
                      className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                      key: 'select',
                      type: 'territory-dropdown',
                      templateOptions: {
                        label: 'Territory',
                        dataKey: 'territory_id',
                        dataLabel: 'name',
                        options: [],
                        lazy: {
                          url: 'masters/territory/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                              this.formConfig.model['customer_data']['territory_id'] = data.territory_id;
                            } else {
                              console.error('Form config or Customer data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                  ]
                },
              ]
            },
          ]
        },
        // {
        //   className: 'row col-6 m-0 custom-form-card',//'row col-6 m-0 custom-form-card',
        //   fieldGroup: [
        //     // Custom Fields Section
        //     {
        //       template: '<div class="custom-form-card-title mt-4">Custom Fields</div>',
        //       fieldGroupClassName: "ant-row",
        //     },
        //   ]
        // },
      ]
    }
  }

  //   downloadExcelTemplate() {
  //   this.http.get('customers/import/template/', {
  //     responseType: 'blob'
  //   }).subscribe((res: Blob) => {
  //     const a = document.createElement('a');
  //     const url = window.URL.createObjectURL(res);
  //     a.href = url;
  //     a.download = 'Customer_Import_Template.xlsx';
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   });
  // }

  // ─── Bulk Edit Methods ───────────────────────────────────────

  /** Open the bulk edit modal */
  openBulkEditModal(ids: string[]) {
    this.bulkEditIds = ids;
    this.showBulkEditModal = true;
  }

  /** Handle successful bulk update */
  onBulkUpdated(event: { message: string; count: number }) {
    this.notification.success('Success', event.message);
    this.CustomersListComponent?.clearSelections();
    this.CustomersListComponent?.refreshTable();
  }

  /** Close bulk edit modal */
  onBulkEditClosed() {
    this.showBulkEditModal = false;
  }

  // ─── Export Customers ────────────────────────────────────────

  /** Export all or selected customers to Excel */
  exportCustomers(ids: string[]) {
    this.isExporting = true;
    let url = 'customers/export-customers/';
    if (ids.length > 0) {
      url += '?ids=' + ids.join(',');
    }

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        this.isExporting = false;
        const a = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = ids.length > 0
          ? `Customers_Export_${ids.length}.xlsx`
          : 'Customers_Export_All.xlsx';
        a.click();
        window.URL.revokeObjectURL(objectUrl);
        this.notification.success('Export Complete',
          ids.length > 0
            ? `${ids.length} customer(s) exported successfully`
            : 'All customers exported successfully'
        );
      },
      error: () => {
        this.isExporting = false;
        this.notification.error('Export Failed', 'Could not export customers. Please try again.');
      }
    });
  }

  // ─── Import for Update ─────────────────────────────────────

  /** Open the import modal in UPDATE mode */
  showImportUpdateModal() {
    this.importMode = 'update';
    this.showImportModal();
  }

  // ─────────────────────────────────────────────────────────────

  downloadExcelTemplate() {
    this.http.get('customers/download-template/', {
      responseType: 'blob'
    }).subscribe({
      next: (res: Blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(res);
        a.href = url;
        a.download = 'Customer_Import_Template.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.notification.success('Success', 'Template downloaded successfully');
      },
      error: (error) => {
        console.error('Download error', error);
        this.notification.error('Error', 'Failed to download template');
      }
    });
  }

  // Close modal using Bootstrap instance
  closeModal() {
    const modal = document.getElementById('importModal');
    if (modal) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  // Reset import state for new import
  resetImportState() {
    this.isImporting = false;
    this.importProgress = 0;
    this.importStatusMessage = '';
    this.importCompleted = false;
    this.importResults = null;
    // Keep importMode as-is — it's set before modal opens
  }

  // Simulate progress for better UX
  simulateProgress() {
    this.importProgress = 0;
    const progressInterval = setInterval(() => {
      if (this.importProgress < 90 && this.isImporting) {
        const increment = Math.max(1, Math.floor((90 - this.importProgress) / 10));
        this.importProgress = Math.min(90, this.importProgress + increment);

        if (this.importProgress < 30) {
          this.importStatusMessage = 'Reading Excel file...';
        } else if (this.importProgress < 60) {
          this.importStatusMessage = 'Validating data...';
        } else if (this.importProgress < 90) {
          this.importStatusMessage = 'Importing records to database...';
        }
      } else {
        clearInterval(progressInterval);
      }
    }, 500);
    return progressInterval;
  }

  showImportModal() {
    // Reset import state for fresh start
    this.resetImportState();
    // Default to create mode unless already set to update
    if (this.importMode !== 'update') {
      this.importMode = 'create';
    }

    // Reset the import form model to ensure fresh start
    this.importFormConfig.model = {};

    // Force reset the fields to clear any cached file by creating a fresh configuration
    this.importFormConfig.fields = [
      {
        key: 'file',
        type: 'file',
        label: 'Select Excel File',
        props: {
          displayStyle: 'files',
          multiple: false,
          acceptedTypes: '.xlsx,.xls'
        },
        required: true
      }
    ];

    // Show the modal after resetting
    const modal = document.getElementById('importModal');
    if (modal) {
      // Bootstrap 5 modal show
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  // Define the initial import form configuration 
  importFormConfig: any = {
    fields: [
      {
        key: 'file',
        type: 'file',
        label: 'Select Excel File',
        props: {
          displayStyle: 'files',
          multiple: false,
          acceptedTypes: '.xlsx,.xls'
        },
        required: true
      }
    ],
    submit: {
      label: 'Import',
      submittedFn: (formData: any) => {
        this.handleImport(formData);
      }
    },
    model: {}
  };

  // Handle the import process with loading states
  handleImport(formData: any) {
    const rawFile = formData.file[0]?.rawFile;
    if (!rawFile || !(rawFile instanceof File)) {
      this.notification.error('Error', 'No valid file selected!');
      return;
    }

    // Reset and start import
    this.resetImportState();
    this.isImporting = true;
    const isUpdate = this.importMode === 'update';
    this.importStatusMessage = isUpdate ? 'Preparing update...' : 'Preparing import...';

    const uploadData = new FormData();
    uploadData.append('file', rawFile);

    const headers = { 'X-Skip-Error-Interceptor': 'true' };
    const progressInterval = this.simulateProgress();
    const uploadUrl = isUpdate ? 'customers/upload-excel/?mode=update' : 'customers/upload-excel/';

    this.http.post(uploadUrl, uploadData, { headers }).subscribe({
      next: (res: any) => {
        clearInterval(progressInterval);
        this.importProgress = 100;
        this.importStatusMessage = isUpdate ? 'Update completed!' : 'Import completed!';
        this.isImporting = false;
        this.importCompleted = true;

        console.log('Upload success', res);

        // Handle both create and update response formats
        let successCount = 0;
        let errorCount = 0;
        let errors: any[] = [];

        if (isUpdate && res.data) {
          // Update mode response: { data: { success_count, failed_count, errors } }
          successCount = res.data.success_count || 0;
          errorCount = res.data.failed_count || 0;
          errors = res.data.errors || [];
        } else {
          // Create mode response
          const successMatch = res.message?.match(/(\d+)/);
          successCount = successMatch ? parseInt(successMatch[1], 10) : 0;
          errorCount = res.errors?.length || 0;
          errors = res.errors || [];
        }

        const totalRecords = successCount + errorCount;

        this.importResults = {
          success: errorCount === 0 && successCount > 0,
          totalRecords: totalRecords,
          successCount: successCount,
          errorCount: errorCount,
          errors: errors.slice(0, 10)
        };
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.isImporting = false;
        this.importCompleted = true;
        this.importProgress = 100;

        console.error('Upload error', error);

        const errorResponse = error.error || {};
        const errorMessage = errorResponse.message || (isUpdate ? 'Update failed' : 'Import failed');

        this.importResults = {
          success: false,
          totalRecords: 0,
          successCount: 0,
          errorCount: 1,
          errors: [{ row: 0, error: errorMessage }]
        };
      }
    });
  }

  // Close modal and refresh list after viewing results
  closeImportAndRefresh() {
    this.resetImportState();
    this.closeModal();
    this.showCustomerListFn();
  }

  // Start a new import
  startNewImport() {
    this.resetImportState();
    this.showImportModal();
  }
}
