import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';  // Import forkJoin from rxjs
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { CustomersListComponent } from './customers-list/customers-list.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  imports: [CommonModule,
    AdminCommmonModule,
    CustomersListComponent],
  standalone: true,
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent {
  showCustomerList: boolean = false;
  showForm: boolean = false;
  CustomerEditID: any;
  @ViewChild(CustomersListComponent) CustomersListComponent!: CustomersListComponent;

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  private observer: MutationObserver;
  customFieldConfig: any;

  constructor(private http: HttpClient, private cdref:ChangeDetectorRef) {}
  customFieldFormConfig: any = {};
  ngOnInit() {
    this.showCustomerList = false;
    this.showForm = true;  //temporary change 'true'
    this.CustomerEditID = null;
    // Set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
    this.fetchCustomFields();
    
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

  // getCustomFieldConfig() {
  //   if (this.customFieldFormConfig && this.customFieldFormConfig.fields) {
  //     return this.customFieldFormConfig.fields.map((field: any) => ({
  //       key: field.key,
  //       type: field.type,
  //       className: 'col-md-12',
  //       templateOptions: {
  //         label: field.templateOptions.label,
  //         placeholder: field.templateOptions.placeholder,
  //         required: field.templateOptions.required,
  //         options: field.templateOptions.options || [] // Ensure options exist for select fields
  //       }
  //     }));
  //   }
  //   return [];  // Return an empty array if there are no custom fields
  // }

  
  
  
  customFieldMetadata: any = {}; // To store mapping of field names to metadata
  fetchCustomFields() {
    this.http.get('customfields/customfieldscreate/').subscribe(
      (response: any) => {
        console.log('Custom Fields API Response:', response);
  
        if (response?.data) {
          const customFields = response.data.filter((field: any) => field.entity.entity_name === 'customers');
  
          // Save metadata for mapping
          this.customFieldMetadata = customFields.reduce((map: any, field: any) => {
            map[field.custom_field_id.toLowerCase()] = {
              custom_field_id: field.custom_field_id,
              field_type_id: field.field_type_id,
              entity_id: field.entity.entity_id,
              is_required: field.is_required,
              validation_rules: field.validation_rules,
              options: [], // Initially empty, will be populated if options exist
            };
            return map;
          }, {});
  
          console.log('Custom Field Metadata:', this.customFieldMetadata);
  
          // Fetch options for each custom field
          this.fetchAllFieldOptions(customFields);
        } else {
          console.warn('No custom fields data found in the API response.');
        }
      },
      (error) => {
        console.error('Error fetching custom fields:', error);
      }
    );
  }
  
  // Fetch options for all custom fields in one call
  fetchAllFieldOptions(customFields: any[]) {
    this.http.get('customfields/customfieldoptions/').subscribe(
      (response: any) => {
        console.log("Custom Field Options API Response:", response);
  
        if (response?.data) {
          // Group options by custom_field_id
          const fieldOptionsMap = response.data.reduce((map: any, option: any) => {
            const fieldId = option.custom_field_id.toLowerCase();
            if (!map[fieldId]) {
              map[fieldId] = [];
            }
            if (option.option_value) {
              map[fieldId].push({ label: option.option_value, value: option.option_value });
            }
            return map;
          }, {});
  
          // Update customFieldMetadata with options
          Object.keys(fieldOptionsMap).forEach(fieldId => {
            if (this.customFieldMetadata[fieldId]) {
              this.customFieldMetadata[fieldId].options = fieldOptionsMap[fieldId];
            }
          });
  
          console.log('Updated Custom Field Metadata with Options:', this.customFieldMetadata);
  
          // Add custom fields to formConfig
          this.addCustomFieldsToFormConfig(customFields);
        } else {
          console.warn('No options found in the API response.');
          this.addCustomFieldsToFormConfig(customFields); // Proceed without options
        }
      },
      (error) => {
        console.error('Error fetching custom field options:', error);
        this.addCustomFieldsToFormConfig(customFields); // Proceed without options
      }
    );
  }
  
  // Add custom fields dynamically to the formConfig
  addCustomFieldsToFormConfig(customFields: any) {
    console.log("Custom Fields to Add:", customFields);
  
    const customFieldConfigs = customFields.map((field: any) => {
      const key = field.custom_field_id.toLowerCase(); // Normalize key
      const fieldMetadata = this.customFieldMetadata[key] || {};
  
      return {
        key: key,
        type: fieldMetadata.options.length > 0 ? 'select' : 'input', // Use select if options exist
        className: 'col-md-6',
        defaultValue: this.formConfig.model['custom_field_values'][key] || '', // Pre-fill value
        templateOptions: {
          label: field.field_name,
          placeholder: field.field_name,
          required: fieldMetadata.is_required,
          options: fieldMetadata.options, // Set options if available
        },
      };
    });
  
    console.log('Final Custom Field Config:', customFieldConfigs);

    this.formConfig.fields[1].fieldGroup = [
      ...this.formConfig.fields[1].fieldGroup, // Keep existing fields
      {
        className: 'col-12 custom-form-card-block p-0',
        fieldGroupClassName:'row m-0 pr-0',
        props: {
          label: 'Custom Fields'
        },
        fieldGroup: [
          {
            className: 'col-9 p-0',
            key: 'custom_field_values',
            fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
            fieldGroup: customFieldConfigs
          },
        ]            
      },
    ];

    this.formConfig.fields = [
      ...this.formConfig.fields,
      {
        key: 'custom_field_values',
        fieldGroup: customFieldConfigs,
        hide: true
      },
    ];

    // this.formConfig = { ...this.formConfig };
  }

  submitCustomerForm() {
    const customerData = { ...this.formConfig.model['customer_data'] }; // Main customer data
    const customerAttachments = this.formConfig.model['customer_attachments'];
    const customerAddresses = this.formConfig.model['customer_addresses'];
    const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields
  
    if (!customerData) {
      console.error('Customer data is missing.');
      return;
    }
  
    // Construct payload for one custom field at a time
    const customFieldsPayload = this.constructCustomFieldsPayload(customFieldValues);
    // Construct the final payload
    const payload = {
      customer_data: customerData, // Add all the main customer fields
      customer_addresses: customerAddresses,
      customer_attachments: customerAttachments,
      custom_field: customFieldsPayload.custom_field, // Single custom field as dictionary
      // custom_field_options: customFieldsPayload.custom_field_options, // Array or empty
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

  constructCustomFieldsPayload(customFieldValues: any) {
    if (!customFieldValues) {
      console.warn('No custom field values provided.');
      return {
        custom_field: {},
        custom_field_options: [],
        custom_field_values: []
      };
    }
  
    // Initialize custom field values as an array
    const customFieldValuesArray = [];
  
    // Track missing required fields
    const missingRequiredFields = [];
  
    // Iterate over all custom field keys and construct values
    Object.keys(customFieldValues).forEach((fieldKey) => {
      const metadata = this.customFieldMetadata[fieldKey.toLowerCase()] || {}; // Fetch metadata for each field
  
      // Check if the field is required and missing
      if (metadata.is_required && 
          (customFieldValues[fieldKey] === '' || customFieldValues[fieldKey] === null || customFieldValues[fieldKey] === undefined)) {
        missingRequiredFields.push(fieldKey);
      }
  
      // Only include fields that have a value (skip ignored fields)
      if (customFieldValues[fieldKey] !== '' && customFieldValues[fieldKey] !== null && customFieldValues[fieldKey] !== undefined) {
        customFieldValuesArray.push({
          field_value: customFieldValues[fieldKey], // Value entered by the user
          field_value_type: typeof customFieldValues[fieldKey] === "number" ? "number" : "string", // Type
          entity_id: metadata.entity_name || "e1fba6d0-23a0-4ae3-a2df-a6d563510042", // Default entity ID
          custom_field_id: fieldKey, // Field name as custom_field_id
          custom_id: this.formConfig.model.customer_data.customer_id
        });
      }
    });
  
    // If any required fields are missing, show an alert and stop submission
    if (missingRequiredFields.length > 0) {
      console.error("Required fields missing:", missingRequiredFields);
      this.showDialog();
      // alert("Please fill in all required fields before submitting.");
      return null; // Prevent submission
    }
  
    // Construct payload for multiple custom fields
    return {
      custom_field: Object.keys(customFieldValues).map((fieldKey) => ({
        field_name: fieldKey, // Use field name
        is_required: this.customFieldMetadata[fieldKey.toLowerCase()]?.is_required || false,
        validation_rules: this.customFieldMetadata[fieldKey.toLowerCase()]?.validation_rules || null,
        field_type_id: this.customFieldMetadata[fieldKey.toLowerCase()]?.field_type_id || null,
        entity_id: this.customFieldMetadata[fieldKey.toLowerCase()]?.entity_id || null,
      })),
      custom_field_values: customFieldValuesArray // Only include entered values
    };
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

  editCustomer(event: string) {
    this.CustomerEditID = event;
  
    // Fetch customer details
    this.http.get(`customers/customers/${event}`).subscribe(
      (res: any) => {
        if (res && res.data) {
          console.log("Res in edit : ", res)
          // Set customer data in the form model
          this.formConfig.model = res.data;
          this.formConfig.model['customer_id'] = this.CustomerEditID;
          
          // Ensure custom_field_values are correctly populated in the model
          if (res.data.custom_field_values) {
            this.formConfig.model['custom_field_values'] = res.data.custom_field_values.reduce((acc: any, fieldValue: any) => {
              acc[fieldValue.custom_field_id] = fieldValue.field_value; // Map custom_field_id to the corresponding value
              return acc;
            }, {});
          }

          // Update form labels for editing mode
          this.formConfig.pkId = 'customer_id';
          this.formConfig.submit.label = 'Update';
          this.showForm = true; // Display the form
        }
      },
      (error) => {
        console.error('Error fetching customer data:', error);
      }
    );
  
    // Close the customer list modal
    this.hide();
  }

  fetchAndSetCustomFieldValues(customerId: string) {
    console.log("customerId in Custom : ", customerId);
    const url = `customfields/customfieldvalues/?entity_data_id=${customerId}`;
    console.log("URL : ", url)
    this.http.get(url).subscribe(
      (response: any) => {
        if (response?.data) {
          console.log("Repsonse 2: ", response);
          const customFieldValues = response.data.reduce((acc: any, fieldValue: any) => {
            // Normalize to lowercase for consistency
            acc[fieldValue.custom_field.field_name.toLowerCase()] = fieldValue.field_value;
            return acc;
          }, {});
          console.log("customFieldValues : ", customFieldValues);
          // Populate the custom_field_values model
          this.formConfig.model['custom_field_values'] = customFieldValues;

          console.log('Mapped Custom Field Values:', this.formConfig.model['custom_field_values']);
        } else {
          console.warn('No custom field values found for the customer.');
          this.formConfig.model['custom_field_values'] = {}; // Clear custom fields if none are found
        }
      },
      (error) => {
        console.error('Error fetching custom field values:', error);
      }
    );
  }

  

  showCustomerListFn() {
    this.showCustomerList = true;
    this.CustomersListComponent?.refreshTable();
  }

  showSuccessToast = false;
  toastMessage = '';
  // Method to handle updating the Sale Return Order
  updateCustomer() {
    const customerData = { ...this.formConfig.model['customer_data'] }; // Main customer data
    const customerAttachments = this.formConfig.model['customer_attachments'];
    const customerAddresses = this.formConfig.model['customer_addresses'];
    const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields
    
    if (!customerData) {
      console.error('Customer data is missing.');
      return;
    }
  
    // Construct payload for custom fields based on updated values
    const customFieldsPayload = this.constructCustomFieldsPayload(customFieldValues);
    console.log("Testing the data in customFieldsPayload: ", customFieldsPayload);
    
    // Construct the final payload for update
    const payload = {
      customer_data: customerData, // Add all the main customer fields
      customer_addresses: customerAddresses,
      customer_attachments: customerAttachments,
      custom_field: customFieldsPayload.custom_field, // Single custom field as dictionary
      custom_field_options: customFieldsPayload.custom_field_options, // Array or empty
      custom_field_values: customFieldsPayload.custom_field_values // Array of dictionaries
    };
  
    console.log('Final Payload for Update:', payload); // Debugging to verify the payload
  
    // Send the update request with the payload
    this.http.put(`customers/customers/${customerData.customer_id}/`, payload).subscribe(
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
  
  // onSubmit() {
  //   if (!this.CustomerEditID) {
  //     this.submitCustomerForm();
  //   } else {
  //     this.updateCustomer();
  //      // Otherwise, create a new record
  //   }
  // }
  

  // onSubmit() {
  //   if (this.formConfig.submit.label === 'Update') {
  //     this.updateCustomer(); // Call update on submission
  //   } else {
  //     this.submitCustomerForm(); // Otherwise, create a new record
  //     // this.ngOnInit();
  //   }
  //   this.ngOnInit();
  //   this.cdref.detectChanges
  // }

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
      fields:[
        {
          fieldGroup: [
            {
              className: 'col-12 custom-form-card-block p-0',
              key: 'customer_data',
              fieldGroupClassName:'row m-0 pr-0 responsive-row',
              fieldGroup: [
                // Left Section (col-9 for form fields)
                {
                  className: 'col-sm-9 col-12 p-0',
                  fieldGroupClassName:'row m-0 p-0',
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
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'print_name',
                      type: 'input',
                      templateOptions: {
                        label: 'Print Name',
                        placeholder: 'Enter Print Name',
                        required: true,
                      }
                    },               
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'code',
                      type: 'input',
                      templateOptions: {
                        label: 'Code',
                        placeholder: 'Enter Code',
                        required: true,
                      }
                    },
                  
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'customer_category',
                      type: 'select',
                      templateOptions: {
                        label: 'Customer Category',
                        dataKey: 'customer_category_id',
                        dataLabel: 'name',
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
                      type: 'select',
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        dataKey: 'ledger_account_id',
                        dataLabel: 'name',
                        label: 'Ledger Account',
                        placeholder: 'Ledger Account',
                        required: true,
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
                      key: 'tax_type',
                      type: 'select',
                      templateOptions: {
                        label: 'Tax Type',
                        placeholder: 'Select Tax Type',
                        options: [
                          { value: 'Inclusive', label: 'Inclusive' },
                          { value: 'Exclusive', label: 'Exclusive' }
                        ],
                        required: true,
                      }
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
                        required: true
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
                            key: 'city',
                            type: 'select',
                            templateOptions: {
                              dataKey: 'city_id',
                              dataLabel: 'city_name',
                              label: 'City',
                              placeholder: 'city',
                              hideLabel: true,
                              required: true,
                              lazy: {
                                url: 'masters/city/',
                                lazyOneTime: true
                              }
                            },
                            hooks: {
                              onChanges: (field: any) => {
                                field.formControl.valueChanges.subscribe((data: any) => {
                                  console.log('city', data);
                                  // const index = field.parent.parent.model.indexOf(field.parent.model);
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['customer_addresses'][index]['city_id'] = data.city_id;
                                  } else {
                                    console.error('Form config or Customer addresses model is not defined.');
                                  }
                                });
                              }
                            }
                          },
                          {
                            key: 'state',
                            type: 'select',
                            templateOptions: {
                              dataKey: 'state_id',
                              dataLabel: 'state_name',
                              label: 'State',
                              placeholder: 'state',
                              hideLabel: true,
                              required: true,
                              lazy: {
                                url: 'masters/state/',
                                lazyOneTime: true
                              }
                            },
                            hooks: {
                              onChanges: (field: any) => {
                                field.formControl.valueChanges.subscribe((data: any) => {
                                  console.log('state', data);
                                  // const index = field.parent.parent.model.indexOf(field.parent.model);
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['customer_addresses'][index]['state_id'] = data.state_id;
                                  } else {
                                    console.error('Form config or Customer addresses model is not defined.');
                                  }
                                });
                              }
                            }
                          },
                          {
                            key: 'country',
                            type: 'select',
                            templateOptions: {
                              dataKey: 'country_id',
                              dataLabel: 'country_name',
                              label: 'Country',
                              hideLabel: true,
                              required: true,
                              placeholder: 'country',
                              lazy: {
                                url: 'masters/country/',
                                lazyOneTime: true
                              }
                            },
                            hooks: {
                              onChanges: (field: any) => {
                                field.formControl.valueChanges.subscribe((data: any) => {
                                  console.log('country', data);
                                  // const index = field.parent.parent.model.indexOf(field.parent.model);
                                  const index = field.parent.key;
                                  if (this.formConfig && this.formConfig.model) {
                                    this.formConfig.model['customer_addresses'][index]['country_id'] = data.country_id;
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
                            }
                          },
                          {
                            type: 'input',
                            key: 'phone',
                            templateOptions: {
                              label: 'Phone',
                              hideLabel: true,
                              placeholder: 'Phone',
                            }
                          },
                          {
                            type: 'input',
                            key: 'email',
                            templateOptions: {
                              label: 'Email',
                              hideLabel: true,
                              placeholder: 'email',
                            }
                          },
                          {
                            type: 'textarea',
                            key: 'address',
                            templateOptions: {
                              label: 'Address',
                              hideLabel: true,
                              placeholder: 'Address',
                            }
                          }
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
                              type: 'select',
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
                              type: 'select',
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
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'gst_category',
                              type: 'select',
                              templateOptions: {
                                label: 'GST Category',
                                dataKey: 'gst_category_id',
                                dataLabel: 'name',
                                options: [],
                                lazy: {
                                  url: 'masters/gst_categories/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                      this.formConfig.model['customer_data']['gst_category_id'] = data.gst_category_id;
                                    } else {
                                      console.error('Form config or Customer data model is not defined.');
                                    }
                                  });
                                }
                              }
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
                              key: 'cin',
                              type: 'input',
                              templateOptions: {
                                label: 'CIN',
                                placeholder: 'Enter CIN',
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
                              type: 'select',
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
              fieldGroupClassName:'row m-0 pr-0',
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
                      type: 'select',
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
                      key: 'territory',
                      type: 'select',
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
}
