import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';  // Import forkJoin from rxjs
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomFieldHelper } from '../utils/custom_field_fetch';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  imports: [CommonModule,
    AdminCommmonModule,
    CustomersListComponent,
    NzSpinModule,
    NzProgressModule,
    NzResultModule,
    NzAlertModule],
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
  importResults: {
    success: boolean;
    totalRecords: number;
    successCount: number;
    errorCount: number;
    errors: Array<{ row: number; error: string }>;
  } | null = null;

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
    const containerSelector = '.customers-component'; // Scoped to this component
    this.applyDomManipulations(containerSelector);

    // Use MutationObserver to monitor changes and re-apply manipulations
    const container = document.querySelector(containerSelector);
    if (container) {
      this.observer = new MutationObserver(() => {
        this.applyDomManipulations(containerSelector);
      });

      this.observer.observe(container, {
        childList: true,
        subtree: true,
      });
    }
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
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Hide Actions Column
    const actionHeaders = Array.from(container.querySelectorAll('.custom-form-list .table th'));
    actionHeaders.forEach((header: HTMLElement) => {
      if (header.innerText.trim() === 'Actions') {
        header.style.display = 'none';
        const index = Array.from(header.parentElement?.children || []).indexOf(header);
        const rows = container.querySelectorAll('.custom-form-list .table tbody tr');
        rows.forEach(row => {
          const cells = row.children;
          if (cells[index]) {
            (cells[index] as HTMLElement).style.display = 'none';
          }
        });
      }
    });

    // Remove Button
    const button = container.querySelector('.custom-form-list .ant-card-head button');
    if (button) {
      button.remove();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
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

        // ------------------ 🔥 FIX START ------------------
        const addresses = res.data.customer_addresses || [];

        const billing = addresses.find((a: any) => a.address_type === 'Billing');
        const shipping = addresses.find((a: any) => a.address_type === 'Shipping');

        this.formConfig.model.customer_addresses = [
          billing || { address_type: 'Billing' },
          shipping || { address_type: 'Shipping' }
        ];
        // ------------------ 🔥 FIX END ------------------

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
                label: 'Addresses'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      key: 'customer_addresses',
                      type: 'table',
                      className: 'custom-form-list no-ant-card',
                      templateOptions: {
                        // addText: 'Add Addresses',
                        tableCols: [
                          {
                            name: 'address_type',
                            label: 'Address Type'  // New column for Address Type
                          },
                          {
                            name: 'address',
                            label: 'Address'
                          },
                          {
                            name: 'city',
                            label: 'City'
                          },
                          {
                            name: 'state',
                            label: 'State'
                          },
                          {
                            name: 'country',
                            label: 'Country'
                          },
                          {
                            name: 'pin_code',
                            label: 'Pin Code'
                          },
                          {
                            name: 'phone',
                            label: 'Phone'
                          },
                          {
                            name: 'email',
                            label: 'Email'
                          },
                          {
                            name: 'route_map',
                            label: 'Route Map'
                          },
                          {
                            name: 'longitude',
                            label: 'Longitude'
                          },
                          {
                            name: 'latitude',
                            label: 'Latitude'
                          }
                        ]
                      },
                      fieldArray: {
                        fieldGroup: [
                          {
                            key: 'address_type',
                            type: 'input',
                            className: 'custom-select-bold',
                            templateOptions: {
                              label: 'Address Type',
                              hideLabel: true,
                              readonly: true,
                              required: true,
                              value: 'Billing',  // Set to 'Billing'
                              attributes: {
                                style: 'font-weight: bold; border: none; background-color: transparent; margin-bottom: 10px;' // Bold text, no border, transparent background
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
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'is_sub_customer',
                          type: 'checkbox',
                          templateOptions: {
                            label: 'Is Sub Customer',
                          }
                        },
                        {
                          className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                          key: 'customer_common_for_sales_purchase',
                          type: 'checkbox',
                          templateOptions: {
                            label: 'Customer common for Sales and Purchase',
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
                label: 'Tax Details'
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
                        // {
                        //   className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                        //   key: 'gst_category',
                        //   type: 'gst-cat-dropdown',
                        //   templateOptions: {
                        //     label: 'GST Category',
                        //     dataKey: 'gst_category_id',
                        //     dataLabel: 'name',
                        //     options: [],
                        //     lazy: {
                        //       url: 'masters/gst_categories/',
                        //       lazyOneTime: true
                        //     }
                        //   },
                        //   hooks: {
                        //     onChanges: (field: any) => {
                        //       field.formControl.valueChanges.subscribe((data: any) => {
                        //         if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                        //           this.formConfig.model['customer_data']['gst_category_id'] = data.gst_category_id;
                        //         } else {
                        //           console.error('Form config or Customer data model is not defined.');
                        //         }
                        //       });
                        //     }
                        //   }
                        // },
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
                              // lazy: {
                              //     url: 'masters/gst_categories/',
                              //     lazyOneTime: true
                              // }
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
                        // {
                        //   className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                        //   key: 'cin',
                        //   type: 'input',
                        //   templateOptions: {
                        //     label: 'CIN',
                        //     placeholder: 'Enter CIN',
                        //   }
                        // },
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
                      key: 'contact_person',
                      type: 'input',
                      templateOptions: {
                        label: 'Contact Person',
                        placeholder: 'Enter Contact Person',
                      }
                    },
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
    this.importStatusMessage = 'Preparing import...';

    const uploadData = new FormData();
    uploadData.append('file', rawFile);

    const headers = { 'X-Skip-Error-Interceptor': 'true' };
    const progressInterval = this.simulateProgress();

    this.http.post('customers/upload-excel/', uploadData, { headers }).subscribe({
      next: (res: any) => {
        clearInterval(progressInterval);
        this.importProgress = 100;
        this.importStatusMessage = 'Import completed!';
        this.isImporting = false;
        this.importCompleted = true;

        console.log('Upload success', res);

        const successMatch = res.message?.match(/(\d+)/);
        const successCount = successMatch ? parseInt(successMatch[1], 10) : 0;
        const errorCount = res.errors?.length || 0;
        const totalRecords = successCount + errorCount;

        this.importResults = {
          success: errorCount === 0,
          totalRecords: totalRecords,
          successCount: successCount,
          errorCount: errorCount,
          errors: res.errors?.slice(0, 10) || []
        };

        // Notifications commented out - results shown in modal instead
        // if (errorCount === 0) {
        //   this.notification.success('Success', res.message || 'Customers imported successfully', { nzDuration: 3000 });
        // } else if (successCount > 0) {
        //   this.notification.warning('Partial Import', `${successCount} customers imported, ${errorCount} failed.`, { nzDuration: 5000 });
        // } else {
        //   const missingFieldErrors = res.errors?.filter((e: any) => e.error && e.error.includes('Missing required field:')) || [];
        //   if (missingFieldErrors.length > 0) {
        //     const missingFields = missingFieldErrors.map((e: any) => {
        //       const match = e.error.match(/Missing required field: (.+)/);
        //       return match ? match[1] : '';
        //     }).filter(Boolean);
        //     this.notification.error('Import Failed', `Required fields missing: ${missingFields.join(', ')}`, { nzDuration: 6000 });
        //   }
        // }
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.isImporting = false;
        this.importCompleted = true;
        this.importProgress = 100;

        console.error('Upload error', error);

        const errorResponse = error.error || {};
        const errorMessage = errorResponse.message || 'Import failed';

        this.importResults = {
          success: false,
          totalRecords: 0,
          successCount: 0,
          errorCount: 1,
          errors: [{ row: 0, error: errorMessage }]
        };

        // Notifications commented out - results shown in modal instead
        // if (errorMessage.includes('Excel template format mismatch')) {
        //   this.notification.error('Excel Template Error', 'Excel template format mismatch. Please download the correct template.', { nzDuration: 5000 });
        // } else if (errorMessage.includes('missing required data')) {
        //   this.notification.error('Import Failed', 'Some rows are missing required data. Please check your Excel file.', { nzDuration: 5000 });
        // } else {
        //   this.notification.error('Import Failed', errorMessage, { nzDuration: 5000 });
        // }
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
