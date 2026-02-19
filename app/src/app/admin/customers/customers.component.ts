import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomFieldHelper } from '../utils/custom_field_fetch';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { BulkEditModalComponent } from '../utils/bulk-edit-modal/bulk-edit-modal.component';
import { BulkField } from '../utils/bulk-operations.service';

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
  showCustomerList: boolean = false;
  showForm: boolean = false;
  CustomerEditID: any;
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

  constructor(private http: HttpClient, private cdref: ChangeDetectorRef, private notification: NzNotificationService) { }
  customFieldFormConfig: any = {};
  entitiesList: any[] = [];
  ngOnInit() {
    this.showCustomerList = false;
    this.showForm = true;  //temporary change 'true'
    this.CustomerEditID = null;
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


  ngAfterViewInit() {
    // No DOM manipulation needed — copy buttons are in the component template
  }

  customFieldMetadata: any = {}; // To store mapping of field names to metadata
  submitCustomerForm() {
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
    }
    // Construct the final payload
    const payload = {
      ...this.formConfig.model,
      custom_field_values: customFieldsPayload.custom_field_values // Array of dictionaries
    };

    console.log('Final Payload:', payload); // Debugging to verify the payload

    // Submit the payload
    this.http.post('customers/customers/', payload).subscribe(
      (response: any) => {
        this.showSuccessToast = true;
        this.toastMessage = "Record Created successfully"; // Set the toast message for update
        this.ngOnInit();
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 3000);
      },
      (error) => {
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
  editCustomer(event: string) {
    this.CustomerEditID = event;

    this.http.get(`customers/customers/${event}`).subscribe(
      (res: any) => {
        if (res && res.data) {
          console.log("Res in edit : ", res);

          // ------------------ MAIN MODEL SET ------------------
          this.formConfig.model = res.data;
          this.formConfig.model['customer_id'] = this.CustomerEditID;

          // ------------------ FIX START ------------------
          const addresses = res.data.customer_addresses || [];

          const billing = addresses.find((a: any) => a.address_type === 'Billing');
          const shippingList = addresses.filter((a: any) => a.address_type === 'Shipping');
          if (shippingList.length === 0) shippingList.push({ address_type: 'Shipping' });

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
    this.showCustomerList = true;
    this.CustomersListComponent?.refreshTable();
  }

  showSuccessToast = false;
  toastMessage = '';
  // Method to handle updating the Sale Return Order
  updateCustomer() {
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
    const payload = {
      ...this.formConfig.model,
      custom_field_values: customFieldsPayload.custom_field_values // Array of dictionaries
    };

    console.log('Final Payload for Update:', payload); // Debugging to verify the payload

    // Send the update request with the payload
    this.http.put(`customers/customers/${this.CustomerEditID}/`, payload).subscribe(
      (response: any) => {
        this.showSuccessToast = true;
        this.toastMessage = "Record updated successfully"; // Set the toast message for update
        this.ngOnInit();
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 3000);
        // this.showCustomerListFn(); // Redirect or refresh the customer list
        // this.ngOnInit();
      },
      (error) => {
        console.error('Error updating customer:', error);
      }
    );
  }


  setFormConfig() {
    this.CustomerEditID = null;
    this.formConfig = {
      // url: "customers/customers/",
      title: '',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
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
                        label: 'Ledger Account',
                        placeholder: 'Ledger Account',
                        required: false,
                        lazy: {
                          url: 'customers/ledger_accounts/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            console.log('ledger_account', data);
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                              this.formConfig.model['customer_data']['ledger_account_id'] = data.ledger_account_id;
                            } else {
                              console.error('Form config or Customer data model is not defined.');
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
                        extraActionText: 'Copy Billing → Shipping',
                        extraActionIcon: 'fas fa-copy',
                        onExtraAction: () => this.copyBillingToShipping(),
                        tableCols: [
                          { name: 'address_type', label: 'Type' },
                          { name: 'address', label: 'Address' },
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
                // Communication tab info text
                {
                  className: 'col-12 p-0',
                  template: '<p class="text-muted mt-2 mb-0" style="font-size:12px"><i class="fas fa-info-circle" style="margin-right:4px"></i> Billing and Shipping addresses can be managed in the <strong>Tax Details</strong> tab.</p>',
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
