import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
    return new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
  }
  private observer: MutationObserver;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showCustomerList = false;
    this.showForm = true;  //temporary change 'true'
    // Set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
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

  editCustomer(event) {
    this.CustomerEditID = event;
    this.http.get('customers/customers/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        // Set labels for update
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.pkId = 'customer_id';
        this.formConfig.model['customer_id'] = this.CustomerEditID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  showCustomerListFn() {
    this.showCustomerList = true;
  }

  setFormConfig() {
    this.formConfig = {
      valueChangeFn: (res) => {
        // this.totalAmountCal();
      },
      url: "customers/customers/",
      title: 'Customers',
      formState: {
        viewMode: false
      },
      exParams: [],
      submit: {
        label: 'submit',
        submittedFn: () => this.ngOnInit()
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
                      // required: true
                    }
                  },
                ]
              },
              {
                className: 'col-2',
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
                className: 'col-2',
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
                className: 'col-2',
                key: 'cin',
                type: 'input',
                templateOptions: {
                  label: 'CIN',
                  placeholder: 'Enter CIN',
                }
              },
              {
                className: 'col-2',
                key: 'pan',
                type: 'input',
                templateOptions: {
                  label: 'PAN',
                  placeholder: 'Enter PAN',
                }
              },
              // Fifth row: website links
              {
                className: 'col-2',
                key: 'website',
                type: 'input',
                templateOptions: {
                  label: 'Website',
                  placeholder: 'Enter Website URL',
                }
              },
              {
                className: 'col-2',
                key: 'facebook',
                type: 'input',
                templateOptions: {
                  label: 'Facebook',
                  placeholder: 'Enter Facebook URL',
                }
              },
              {
                className: 'col-2',
                key: 'skype',
                type: 'input',
                templateOptions: {
                  label: 'Skype',
                  placeholder: 'Enter Skype ID',
                }
              },
              {
                className: 'col-2',
                key: 'twitter',
                type: 'input',
                templateOptions: {
                  label: 'Twitter',
                  placeholder: 'Enter Twitter URL',
                }
              },
              {
                className: 'col-2',
                key: 'linked_in',
                type: 'input',
                templateOptions: {
                  label: 'LinkedIn',
                  placeholder: 'Enter LinkedIn URL',
                }
              },
              // Sixth row: Terms and Categories
              {
                className: 'col-2',
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
                className: 'col-2',
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
              className: 'col-2',
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
                  className: 'col-2',
                  key: 'credit_limit',
                  type: 'input',
                  templateOptions: {
                    label: 'Credit Limit',
                    placeholder: 'Enter Credit Limit',
                    type: 'number',
                  }
                },
                {
                  className: 'col-2',
                  key: 'max_credit_days',
                  type: 'input',
                  templateOptions: {
                    label: 'Max Credit Days',
                    placeholder: 'Enter Max Credit Days',
                    type: 'number',
                  }
                },
                {
                  className: 'col-2',
                  key: 'interest_rate_yearly',
                  type: 'input',
                  templateOptions: {
                    label: 'Interest Rate Yearly',
                    placeholder: 'Enter Interest Rate Yearly',
                    type: 'number',
                  }
                },
                // Ninth row: Bank Information
                {
                  className: 'col-2',
                  key: 'rtgs_ifsc_code',
                  type: 'input',
                  templateOptions: {
                    label: 'RTGS IFSC Code',
                    placeholder: 'Enter RTGS IFSC Code',
                  }
                },
                {
                  className: 'col-2',
                  key: 'account_number',
                  type: 'input',
                  templateOptions: {
                    label: 'Account Number',
                    placeholder: 'Enter Account Number',
                  }
                },
                {
                  className: 'col-2',
                  key: 'bank_name',
                  type: 'input',
                  templateOptions: {
                    label: 'Bank Name',
                    placeholder: 'Enter Bank Name',
                  }
                },
                {
                  className: 'col-2',
                  key: 'branch',
                  type: 'input',
                  templateOptions: {
                    label: 'Branch',
                    placeholder: 'Enter Branch',
                  }
                },
                // Tenth row: Checkboxes
                {
                  className: 'col-2 d-flex align-items-center',
                  key: 'gst_suspend',
                  type: 'checkbox',
                  templateOptions: {
                    label: 'GST Suspend',
                  }
                },
                {
                  className: 'col-3 d-flex align-items-center',
                  key: 'tds_on_gst_applicable',
                  type: 'checkbox',
                  templateOptions: {
                    label: 'TDS on GST Applicable',
                  }
                },
                {
                  className: 'col-2 d-flex align-items-center',
                  key: 'tds_applicable',
                  type: 'checkbox',
                  templateOptions: {
                    label: 'TDS Applicable',
                  }
                },
                {
                  className: 'col-2 d-flex align-items-center',
                  key: 'is_sub_customer',
                  type: 'checkbox',
                  templateOptions: {
                    label: 'Is Sub Customer',
                  }
                },
                {
                  className: 'col-4',
                  key: 'customer_common_for_sales_purchase',
                  type: 'checkbox',
                  templateOptions: {
                    label: 'Customer common for Sales and Purchase',
                  }
                },
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
            }
          ]
        },
      ]
    }
  }
}