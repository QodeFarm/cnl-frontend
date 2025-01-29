import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';  // Import forkJoin from rxjs

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent {
  showCustomerList: boolean = false;
  showForm: boolean = false;
  CustomerEditID: any;
  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  private observer: MutationObserver;
  customFieldConfig: any;

  constructor(private http: HttpClient) {}
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

  getCustomFieldConfig() {
    if (this.customFieldFormConfig && this.customFieldFormConfig.fields) {
      return this.customFieldFormConfig.fields.map((field: any) => ({
        key: field.key,
        type: field.type,
        className: 'col-md-12',
        templateOptions: {
          label: field.templateOptions.label,
          placeholder: field.templateOptions.placeholder,
          required: field.templateOptions.required,
          options: field.templateOptions.options || [] // Ensure options exist for select fields
        }
      }));
    }
    return [];  // Return an empty array if there are no custom fields
  }

  
  
  
customFieldMetadata: any = {}; // To store mapping of field names to metadata

fetchCustomFields() {
  this.http.get('http://127.0.0.1:8000/api/v1/customfields/customfieldscreate/').subscribe(
    (response: any) => {
      console.log('Custom Fields API Response:', response);

      if (response?.data) {
        const customFields = response.data.filter((field: any) => field.entity.entity_name === 'customers');

        // Save metadata for mapping
        this.customFieldMetadata = customFields.reduce((map: any, field: any) => {
          map[field.field_name.toLowerCase()] = {
            custom_field_id: field.custom_field_id, // ID of the field
            field_type_id: field.field_type_id, // Field type ID
            entity_id: field.entity.entity_id, // Entity ID
            is_required: field.is_required, // Whether the field is required
            validation_rules: field.validation_rules, // Any validation rules
            options: field.custom_field_options || [] // Predefined options, if any
          };
          return map;
        }, {});

        console.log('Custom Field Metadata:', this.customFieldMetadata);
        this.addCustomFieldsToFormConfig(customFields); // Dynamically add fields to the form
      } else {
        console.warn('No custom fields data found in the API response.');
      }
    },
    (error) => {
      console.error('Error fetching custom fields:', error);
    }
  );
}


  
  
  
  
  // Function to fetch custom field options based on field ID
  fetchFieldOptions(customFieldId: string, fieldKey: string) {
    const url = `http://127.0.0.1:8000/api/v1/customfields/customfieldscreate/${customFieldId}/`;

    this.http.get(url).subscribe(
      (response: any) => {
        const options = response.data.custom_field_options.map((option: any) => ({
          label: option.option_value,
          value: option.option_value,
        }));

        const customField = this.formConfig.fields.find((f: any) => f.key === fieldKey);
        if (customField) {
          customField.templateOptions.options = options;
        }

        console.log('Options for field:', fieldKey, options);
      },
      (error) => {
        console.error('Error fetching field options:', error);
      }
    );
  }

  
  // Adds custom fields to the main formConfig
  addCustomFieldsToFormConfig(customFields: any) {
    console.log("customFields : ", customFields);
    const customFieldConfigs = customFields.map((field: any) => {
      const key = field.custom_field_id.toLowerCase(); // Use normalized key
      return {
        key: key,
        type: field.field_type.field_type_name.toLowerCase() === 'select' ? 'select' : 'input',
        className: 'col-md-6',
        defaultValue: this.formConfig.model['custom_field_values'][key] || '', // Pre-fill value
        templateOptions: {
          label: field.field_name,
          placeholder: field.field_name,
          required: field.is_required,
          options: Array.isArray(field.options) ? field.options : [],
        }
      };
    });
  
    console.log('Custom Field Configs:', customFieldConfigs);
  
    this.formConfig.fields = [
      ...this.formConfig.fields,
      {
        key: 'custom_field_values',
        fieldGroup: customFieldConfigs,
      },
    ];
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
    console.log("Testing the data in customFieldsPayload: ", customFieldsPayload);
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
  
    // Iterate over all custom field keys and construct values
    Object.keys(customFieldValues).forEach((fieldKey) => {
      const metadata = this.customFieldMetadata[fieldKey.toLowerCase()] || {}; // Fetch metadata for each field
      console.log("Metadata entity : ", metadata);
  
      customFieldValuesArray.push({
        field_value: customFieldValues[fieldKey], // Value entered by the user
        field_value_type: typeof customFieldValues[fieldKey] === "number" ? "number" : "string", // Type
        entity_id: metadata.entity_id || "9d87168d-5639-4ecd-8739-18c8a1a801d4", // Default entity ID
        custom_field_id: fieldKey, // Field name as custom_field_id
        entity_data_id: this.formConfig.model.customer_data.customer_id
      });
    });
  
    // Construct payload for multiple custom fields
    return {
      // Custom field metadata for all fields
      custom_field: Object.keys(customFieldValues).map((fieldKey) => ({
        field_name: fieldKey, // Use field name
        is_required: this.customFieldMetadata[fieldKey.toLowerCase()]?.is_required || false,
        validation_rules: this.customFieldMetadata[fieldKey.toLowerCase()]?.validation_rules || null,
        field_type_id: this.customFieldMetadata[fieldKey.toLowerCase()]?.field_type_id || null,
        entity_id: this.customFieldMetadata[fieldKey.toLowerCase()]?.entity_id || null,
      })),
      // Optional field options
      // custom_field_options: Object.values(this.customFieldMetadata).map((metadata) => metadata.options || []),
      // Multiple custom field values
      custom_field_values: customFieldValuesArray // Multiple field values
    };
  }
  
  // constructCustomFieldsPayload(customFieldValues: any) {
  //   if (!customFieldValues) {
  //     console.warn('No custom field values provided.');
  //     return {
  //       custom_field: {},
  //       custom_field_options: [],
  //       custom_field_values: []
  //     };
  //   }
  
  //   // Construct custom field payload
  //   const firstFieldKey = Object.keys(customFieldValues)[0]; // Handle one custom field at a time
  //   const metadata = this.customFieldMetadata[firstFieldKey.toLowerCase()] || {}; // Fetch metadata
  
  //   return {
  //     // Single custom field dictionary
  //     custom_field: {
  //       field_name: firstFieldKey, // Use the first field name
  //       is_required: metadata.is_required || false, // Metadata for required fields
  //       validation_rules: metadata.validation_rules || null, // Validation rules
  //       field_type_id: metadata.field_type_id || null, // Field type ID
  //       entity_id: metadata.entity_id || null // Entity ID
  //     },
  //     // Optional field options
  //     custom_field_options: metadata.options || [], // Predefined options if available
  //     // Single field value
  //     custom_field_values: [
  //       {
  //         field_value: customFieldValues[firstFieldKey], // Value entered by the user
  //         field_value_type: typeof customFieldValues[firstFieldKey] === "number" ? "number" : "string", // Type
  //         entity_id: metadata.entity_id || null // Link value to the entity ID
  //       }
  //     ]
  //   };
  // }
  
  // constructCustomFieldsPayload(customFieldValues: any) {
  //   if (!customFieldValues) {
  //     console.warn('No custom field values provided.');
  //     return {
  //       custom_field: {},
  //       custom_field_options: [],
  //       custom_field_values: []
  //     };
  //   }
  
  //   // Extract first custom field key
  //   const firstFieldKey = Object.keys(customFieldValues)[0]; // Handle one custom field at a time
  //   console.log("customFieldValues : ", customFieldValues);
  //   console.log("firstFieldKey : ", firstFieldKey);
  //   const metadata = this.customFieldMetadata[firstFieldKey.toLowerCase()] || {}; // Fetch metadata
  //   console.log("Metadata entity : ", metadata)
  
  //   return {
  //     // Single custom field dictionary
  //     custom_field: {
  //       field_name: firstFieldKey, // Use the first field name
  //       is_required: metadata.is_required || false, // Metadata for required fields
  //       validation_rules: metadata.validation_rules || null, // Validation rules
  //       field_type_id: metadata.field_type_id || null, // Field type ID
  //       entity_id: metadata.entity_id || null // Entity ID
  //     },
  //     // Optional field options
  //     custom_field_options: metadata.options || [], // Predefined options if available
  //     // Single field value
  //     custom_field_values: [
  //       {
  //         field_value: customFieldValues[firstFieldKey], // Value entered by the user
  //         field_value_type: typeof customFieldValues[firstFieldKey] === "number" ? "number" : "string", // Type
  //         entity_id: metadata.entity_id || "9d87168d-5639-4ecd-8739-18c8a1a801d4", // Link value to the entity ID
  //         custom_field_id: firstFieldKey, // Map field_name as custom_field_id
  //         entity_data_id: this.formConfig.model.customer_data.customer_id
  //       }
  //     ]
  //   };
  // }
  
  
  
  
  
  // // Submit custom field values
  // submitCustomFieldValues(customerId: string, customFieldValues: any) {
  //   if (!customFieldValues) {
  //     console.error('No custom field values provided.');
  //     return;
  //   }
  
  //   const requests = [];
  
  //   Object.keys(customFieldValues).forEach((fieldKey) => {
  //     const fieldValue = customFieldValues[fieldKey];
  //     const metadata = this.customFieldMetadata[fieldKey.toLowerCase()];
  
  //     if (!metadata) {
  //       console.warn(`No metadata found for custom field: ${fieldKey}`);
  //       return;
  //     }
  
  //     const payload = {
  //       custom_field: {
  //         custom_field_id: metadata.custom_field_id,
  //         field_name: fieldKey
  //       },
  //       entity: {
  //         entity_id: customerId
  //       },
  //       field_value: fieldValue,
  //       field_value_type: typeof fieldValue === 'number' ? 'number' : 'string'
  //     };
  
  //     console.log('Constructed Payload:', payload); // Log the constructed payload
  
  //     requests.push(this.http.post('http://127.0.0.1:8000/api/v1/customfields/customfieldvalues/', payload));
  //   });
  
  //   forkJoin(requests).subscribe(
  //     (responses) => {
  //       console.log('Custom field values saved successfully:', responses);
  //     },
  //     (error) => {
  //       console.error('Error saving custom field values:', error);
  //     }
  //   );
  // }
  
  
  
  
  
//    // 2️⃣ Submit custom fields separately to `/customfieldvalues/` endpoint
//    submitCustomFieldValues(customerId: string) {
//     const customFieldValues = this.formConfig.model['custom_fields'];  // Extract only custom fields

//     const requests = [];  // Store all custom field POST requests

//     if (customFieldValues) {
//       // Loop through each custom field and create a POST request
//       Object.keys(customFieldValues).forEach((fieldKey) => {
//         const fieldValue = customFieldValues[fieldKey];
//         const payload = {
//           entity_id: customerId,  // Attach the customer ID
//           field_key: fieldKey,    // Use the field key (like LPA, Income)
//           field_value: fieldValue,
//           field_value_type: typeof fieldValue === 'number' ? 'Number' : 'String'
//         };

//         // Create a POST request for each custom field
//         requests.push(
//           this.http.post('http://127.0.0.1:8000/api/v1/customfields/customfieldvalues/', payload)
//         );
//       });

//       // Execute all POST requests in parallel using forkJoin
//       forkJoin(requests).subscribe(
//         (response) => {
//           console.log('Custom field values saved successfully:', response);
//           this.showCustomerListFn();  // Navigate to the customer list view
//         },
//         (error) => {
//           console.error('Error saving custom field values:', error);
//         }
//       );
//     } else {
//       console.error('No custom fields found in the form model.');
//     }
//   }


  
  
  
//   // Utility function to fetch custom field config by key
//   getCustomFieldByKey(fieldKey: string) {
//     return this.customFieldFormConfig.fields.find((field: any) => field.key === fieldKey);
//   }
  
  
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
  
  
  

  onSubmit() {
    if (this.formConfig.submit.label === 'Update') {
      this.updateCustomer(); // Call update on submission
    } else {
      this.submitCustomerForm(); // Otherwise, create a new record
      this.ngOnInit();
    }
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
        submittedFn: () => this.onSubmit()
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
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'customer_data',
          fieldGroup: [
            // First row: Basic Information
            {
              className: 'col-9 p-0',
              fieldGroupClassName: "ant-row",
              fieldGroup:[
            {
              className: 'col-3',
              key: 'name',
              type: 'input',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              className: 'col-3',
              key: 'print_name',
              type: 'input',
              templateOptions: {
                label: 'Print Name',
                placeholder: 'Enter Print Name',
                required: true,
              }
            },
            {
              className: 'col-3',
              key: 'identification',
              type: 'input',
              templateOptions: {
                label: 'Identification',
                placeholder: 'Enter Identification',
              }
            },
            {
              className: 'col-3',
              key: 'code',
              type: 'input',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: true,
              }
            },
            // Second row: Account and Status Information
            {
              key: 'ledger_account',
              type: 'select',
              className: 'col-3',
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
              className: 'col-3',
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
              className: 'col-3',
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
            {
              className: 'col-3',
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
            // Third row: GST and Tax Information
            {
              className: 'col-3',
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
              className: 'col-3',
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
            {
              className: 'col-3',
              key: 'gst',
              type: 'input',
              templateOptions: {
                label: 'GST No',
                placeholder: 'Enter GST',
              }
            },
            {
              className: 'col-3',
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
              className: 'col-3',
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
                      // Fourth row: Contact Information
            {
              className: 'col-3',
              key: 'contact_person',
              type: 'input',
              templateOptions: {
                label: 'Contact Person',
                placeholder: 'Enter Contact Person',
              }
            },
            // {
            //   className: 'col-2',
            //   key: 'picture',
            //   type: 'input',
            //   templateOptions: {
            //     label: 'Picture',
            //     placeholder: 'Enter Picture URL',
            //   }
            // },
            {
              className: 'col-3',
              key: 'cin',
              type: 'input',
              templateOptions: {
                label: 'CIN',
                placeholder: 'Enter CIN',
              }
            },
            {
              className: 'col-3',
              key: 'pan',
              type: 'input',
              templateOptions: {
                label: 'PAN',
                placeholder: 'Enter PAN',
              }
            },
            {
              className: 'col-3',
              key: 'facebook',
              type: 'input',
              templateOptions: {
                label: 'Facebook',
                placeholder: 'Enter Facebook URL',
              }
            },
            {
              className: 'col-3',
              key: 'skype',
              type: 'input',
              templateOptions: {
                label: 'Skype',
                placeholder: 'Enter Skype ID',
              }
            },
            {
              className: 'col-3',
              key: 'twitter',
              type: 'input',
              templateOptions: {
                label: 'Twitter',
                placeholder: 'Enter Twitter URL',
              }
            },
            {
              className: 'col-3',
              key: 'linked_in',
              type: 'input',
              templateOptions: {
                label: 'LinkedIn',
                placeholder: 'Enter LinkedIn URL',
              }
            },
            {
              className: 'col-3',
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
                // Seventh row: Agents and Transport
          {
            className: 'col-3',
            key: 'distance',
            type: 'input',
            templateOptions: {
              label: 'Distance',
              placeholder: 'Enter Distance',
              type: 'number',
            }
          },
              // Eighth row: Credit
              {
                className: 'col-3',
                key: 'credit_limit',
                type: 'input',
                templateOptions: {
                  label: 'Credit Limit',
                  placeholder: 'Enter Credit Limit',
                  type: 'number',
                }
              },
              {
                className: 'col-3',
                key: 'max_credit_days',
                type: 'input',
                templateOptions: {
                  label: 'Max Credit Days',
                  placeholder: 'Enter Max Credit Days',
                  type: 'number',
                }
              },
              {
                className: 'col-3',
                key: 'gst_suspend',
                type: 'checkbox',
                templateOptions: {
                  label: 'GST Suspend',
                }
              },
              {
                className: 'col-3',
                key: 'tds_on_gst_applicable',
                type: 'checkbox',
                templateOptions: {
                  label: 'TDS on GST Applicable',
                }
              },
              {
                className: 'col-3',
                key: 'tds_applicable',
                type: 'checkbox',
                templateOptions: {
                  label: 'TDS Applicable',
                }
              },
              {
                className: 'col-3',
                key: 'is_sub_customer',
                type: 'checkbox',
                templateOptions: {
                  label: 'Is Sub Customer',
                }
              },
          ]
              },
              {
                className: 'col-3 p-0',
                fieldGroup:[
                  {
                    key: 'picture',
                    type: 'file',
                    className: 'ta-cell pr-md col-12',
                    templateOptions: {
                      label: 'Picture',
                      required: true
                    }
                  },
                  {
                    className: 'ta-cell pr-md col-12',
                    key: 'website',
                    type: 'input',
                    templateOptions: {
                      label: 'Website',
                      placeholder: 'Enter Website URL',
                    }
                  },
                  {
                    className: 'ta-cell pr-md col-12',
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
                    className: 'ta-cell pr-md col-12',
                    key: 'interest_rate_yearly',
                    type: 'input',
                    templateOptions: {
                      label: 'Interest Rate Yearly',
                      placeholder: 'Enter Interest Rate Yearly',
                      type: 'number',
                    }
                  },
                  {
                    className: 'ta-cell pr-md col-12',
                    key: 'customer_common_for_sales_purchase',
                    type: 'checkbox',
                    templateOptions: {
                      label: 'Customer common for Sales and Purchase',
                    }
                  }
                ]
              }
          ]
        },
            // start of order_shipments keys
        {
          key: 'customer_addresses',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Customer Addresses',
            addText: 'Add Addresses',
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
                  placeholder: 'select',
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
                    placeholder: 'select',
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
                    placeholder: 'select',
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
                type: 'input',
                key: 'route_map',
                templateOptions: {
                  label: 'Route Map',
                  hideLabel: true,
                  placeholder: 'Route Map'
                }
              },
              {
                type: 'input',
                key: 'longitude',
                templateOptions: {
                  label: 'Longitude',
                  hideLabel: true,
                  placeholder: 'Longitude',
                }
              },
              {
                type: 'input',
                key: 'latitude',
                templateOptions: {
                  label: 'Latitude',
                  hideLabel: true,
                  placeholder: 'Latitude',
                }
              },
              {
                type: 'textarea',
                key: 'address',
                templateOptions: {
                  label: 'Address',
                  hideLabel: true,
                  placeholder: 'Enter Address',
                }
              }
            ]
          }
        },
        {
          className: 'row col-6 m-0 custom-form-card',//'row col-6 m-0 custom-form-card',
          fieldGroup: [
            {
              template: '<div class="custom-form-card-title">Customer Attachments</div>',
              fieldGroupClassName: "ant-row",
            },
            {
              key: 'customer_attachments',
              type: 'file',
              className: 'ta-cell col-16 custom-file-attachement',
              props: {
                "displayStyle": "files",
                "multiple": true
              }
            },
            // Custom Fields Section
            // {
            //   template: '<div class="custom-form-card-title mt-4">Custom Fields</div>',
            //   fieldGroupClassName: "ant-row",
            // },
            // {
            //   key: 'custom_fields',
            //   fieldGroup: this.getCustomFieldConfig() // Append the custom fields dynamically
            // }
          ]
        },
        {
          className: 'row col-6 m-0 custom-form-card',//'row col-6 m-0 custom-form-card',
          fieldGroup: [
            // Custom Fields Section
            {
              template: '<div class="custom-form-card-title mt-4">Custom Fields</div>',
              fieldGroupClassName: "ant-row",
            },
            {
              key: 'custom_field_values',
              fieldGroup: this.getCustomFieldConfig() // Append the custom fields dynamically
            }
          ]
        },
      ]
      
    }
  }
}
