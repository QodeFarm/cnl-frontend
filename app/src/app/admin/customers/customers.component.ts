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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // console.log("Started customer list")
    this.showCustomerList = false;
    // console.log("showing customer list")
    this.showForm = true;  //temporary change 'true'
    // Set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editCustomer(event) {
    console.log('event', event);
    this.CustomerEditID = event;
    this.http.get('customers/customers/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res && res.data) {
        this.formConfig.model = res.data;
        // Set labels for update
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.pkId = 'customer_id';
        console.log("Edit runnnig")
        this.formConfig.model['customer_id'] = this.CustomerEditID;
        console.log("showfarm runnnig")
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
      url: "customers/customers/",
      title: '',
      formState: {
        viewMode: false
      },
      exParams: [
        // Add any additional parameters here if needed
      ],
      submit: {
        // label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {

      },
      model: {
        customer_data: {},
        customer_attachments: [],
        customer_addresses: []
      },
      fields: [
        {
          fieldGroupClassName: "ant-row",
          key: 'customer_data',
          fieldGroup: [
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'name',
              type: 'input',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'print_name',
              type: 'input',
              templateOptions: {
                label: 'Print Name',
                placeholder: 'Enter Print Name',
                required: true,
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'identification',
              type: 'input',
              templateOptions: {
                label: 'Identification',
                placeholder: 'Enter Identification',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'code',
              type: 'input',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: true,
              }
            },
            {
              key: 'ledger_account',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
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
                      console.error('Form config or customer data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'customer_common_for_sales_purchase',
              type: 'checkbox',
              templateOptions: {
                label: 'Customer Sale purchase',
                placeholder: 'Enter Customer Sale purchase',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'is_sub_customer',
              type: 'checkbox',
              templateOptions: {
                label: 'Sub Customer',
                placeholder: 'Enter Sub Customer',
              }
            },
            {
              key: 'firm_status',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                dataKey: 'firm_status_id',
                dataLabel: 'name',
                label: 'Firm Status',
                placeholder: 'Firm Status',
                required: true,
                lazy: {
                  url: 'masters/firm_statuses/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    console.log('firm_status', data);
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                      this.formConfig.model['customer_data']['firm_status_id'] = data.firm_status_id;
                    } else {
                      console.error('Form config or customer data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'territory',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                dataKey: 'territory_id',
                dataLabel: 'name',
                label: 'Territory',
                placeholder: 'Territory',
                required: true,
                lazy: {
                  url: 'masters/territory/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    console.log('territory', data);
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                      this.formConfig.model['customer_data']['territory_id'] = data.territory_id;
                    } else {
                      console.error('Form config or customer data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'customer_category',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                dataKey: 'customer_category_id',
                dataLabel: 'name',
                label: 'Category',
                placeholder: 'Category',
                required: true,
                lazy: {
                  url: 'masters/customer_categories/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    console.log('customer_category', data);
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                      this.formConfig.model['customer_data']['customer_category_id'] = data.customer_category_id;
                    } else {
                      console.error('Form config or customer data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'contact_person',
              type: 'input',
              templateOptions: {
                label: 'Contact Person',
                placeholder: 'Enter Contact Person',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'picture',
              type: 'input',
              templateOptions: {
                label: 'Picture',
                placeholder: 'Enter Picture URL',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'gst',
              type: 'input',
              templateOptions: {
                label: 'GST',
                placeholder: 'Enter GST',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'registration_date',
              type: 'input',
              templateOptions: {
                label: 'Registration Date',
                placeholder: 'Enter Registration Date',
                type: 'date',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'cin',
              type: 'input',
              templateOptions: {
                label: 'CIN',
                placeholder: 'Enter CIN',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'pan',
              type: 'input',
              templateOptions: {
                label: 'PAN',
                placeholder: 'Enter PAN',
              }
            },
            {
              key: 'gst_category',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                dataKey: 'gst_category_id',
                dataLabel: 'name',
                label: 'GST Category',
                placeholder: 'GST Category',
                required: true,
                lazy: {
                  url: 'masters/gst_categories/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    console.log('customer_category', data);
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                      this.formConfig.model['customer_data']['gst_category_id'] = data.gst_category_id;
                    } else {
                      console.error('Form config or customer data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
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
              className: 'ant-col-4 pr-md m-3',
              key: 'distance',
              type: 'input',
              templateOptions: {
                label: 'Distance',
                placeholder: 'Enter Distance',
                type: 'number',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'website',
              type: 'input',
              templateOptions: {
                label: 'Website',
                placeholder: 'Enter Website URL',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'facebook',
              type: 'input',
              templateOptions: {
                label: 'Facebook',
                placeholder: 'Enter Facebook URL',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'skype',
              type: 'input',
              templateOptions: {
                label: 'Skype',
                placeholder: 'Enter Skype ID',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'twitter',
              type: 'input',
              templateOptions: {
                label: 'Twitter',
                placeholder: 'Enter Twitter URL',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'linked_in',
              type: 'input',
              templateOptions: {
                label: 'LinkedIn',
                placeholder: 'Enter LinkedIn URL',
              }
            },
            {
              key: 'payment_term',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                dataKey: 'payment_term_id',
                dataLabel: 'name',
                label: 'Payment Term',
                placeholder: 'Payment Term',
                required: true,
                lazy: {
                  url: 'masters/customer_payment_terms/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    console.log('payment_term', data);
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                      this.formConfig.model['customer_data']['payment_term_id'] = data.payment_term_id;
                    } else {
                      console.error('Form config or customer data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'price_category',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                dataKey: 'price_category_id',
                dataLabel: 'name',
                label: 'Price Category',
                placeholder: 'Price Category',
                required: true,
                lazy: {
                  url: 'masters/price_categories/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    console.log('payment_term', data);
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                      this.formConfig.model['customer_data']['price_category_id'] = data.price_category_id;
                    } else {
                      console.error('Form config or customer data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'batch_rate_category',
              type: 'input',
              templateOptions: {
                label: 'Batch Rate Category',
                placeholder: 'Enter Batch Rate Category',
              }
            },
            {
              key: 'transporter',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                dataKey: 'transporter_id',
                dataLabel: 'name',
                label: 'Price Category',
                placeholder: 'Price Category',
                required: true,
                lazy: {
                  url: 'masters/transporters/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    console.log('transporter', data);
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                      this.formConfig.model['customer_data']['transporter_id'] = data.transporter_id;
                    } else {
                      console.error('Form config or customer data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'credit_limit',
              type: 'input',
              templateOptions: {
                label: 'Credit Limit',
                placeholder: 'Enter Credit Limit',
                type: 'number',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'max_credit_days',
              type: 'input',
              templateOptions: {
                label: 'Max Credit Days',
                placeholder: 'Enter Max Credit Days',
                type: 'number',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'interest_rate_yearly',
              type: 'input',
              templateOptions: {
                label: 'Interest Rate Yearly',
                placeholder: 'Enter Interest Rate Yearly',
                type: 'number',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'gst_suspend',
              type: 'checkbox',
              templateOptions: {
                label: 'GST Suspend',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'tds_on_gst_applicable',
              type: 'checkbox',
              templateOptions: {
                label: 'TDS on GST Applicable',
              }
            },
            {
              className: 'ant-col-4 pr-md m-3',
              key: 'tds_applicable',
              type: 'checkbox',
              templateOptions: {
                label: 'TDS Applicable',
              }
            },
          ]
      },
      {
        key: 'customer_attachments',
        type: 'repeat',
        templateOptions: {
          addText: 'Add Attachment',
        },
        fieldArray: {
          fieldGroupClassName: 'row',
          fieldGroup: [
          {
            className: 'ant-col-4 pr-md m-3',
            key: 'attachment_name',
            type: 'input',
            templateOptions: {
            label: 'Attachment Name',
            placeholder: 'Enter Attachment Name',
            required: true,
            }
          },
          {
            className: 'ant-col-4 pr-md m-3',
            key: 'attachment_path',
            type: 'input',
            templateOptions: {
            label: 'Attachment Path',
            placeholder: 'Enter Attachment Path',
            required: true,
            }
          }
          ]
        }
        },
        {
          key: 'customer_addresses',
          type: 'repeat',
          templateOptions: {
            addText: 'Add Address',
          },
          fieldArray: {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'address_type',
                type: 'input',
                templateOptions: {
                  type: 'hidden',
                },
                defaultValue: 'Billing', // Default to 'Billing' for the first address, 'Shipping' for subsequent addresses
                expressionProperties: {
                  'model.address_type': (model, formState, field) => {
                    const index = field.parent.parent.model.indexOf(model);
                    return index === 0 ? 'Billing' : 'Shipping';
                  },
                  'templateOptions.hidden': 'true'
                }
              },
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'address',
                type: 'textarea',
                templateOptions: {
                  label: 'Address',
                  placeholder: 'Enter Address',
                }
              },
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'city',
                type: 'select',
                templateOptions: {
                  dataKey: 'city_id',
                  dataLabel: 'city_name',
                  label: 'City',
                  placeholder: 'Select City',
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
                      const index = field.parent.key;
                      if (this.formConfig && this.formConfig.model) {
                        this.formConfig.model['customer_addresses'][index]['city_id'] = data.city_id;
                      } else {
                        console.error('Form config or customer addresses model is not defined.');
                      }
                    });
                  }
                }
              },
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'state',
                type: 'select',
                templateOptions: {
                  dataKey: 'state_id',
                  dataLabel: 'state_name',
                  label: 'State',
                  placeholder: 'Select State',
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
                      const index = field.parent.key;
                      if (this.formConfig && this.formConfig.model) {
                        this.formConfig.model['customer_addresses'][index]['state_id'] = data.state_id;
                      } else {
                        console.error('Form config or customer addresses model is not defined.');
                      }
                    });
                  }
                }
              },
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'country',
                type: 'select',
                templateOptions: {
                  dataKey: 'country_id',
                  dataLabel: 'country_name',
                  label: 'Country',
                  placeholder: 'Select Country',
                  required: true,
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
                        this.formConfig.model['customer_addresses'][index]['country_id'] = data.country_id;
                      } else {
                        console.error('Form config or customer addresses model is not defined.');
                      }
                    });
                  }
                }
              },
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'pin_code',
                type: 'input',
                templateOptions: {
                  label: 'Pin Code',
                  placeholder: 'Enter Pin Code',
                }
              },
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'phone',
                type: 'input',
                templateOptions: {
                  label: 'Phone',
                  placeholder: 'Enter Phone',
                }
              },
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'email',
                type: 'input',
                templateOptions: {
                  label: 'Email',
                  placeholder: 'Enter Email',
                }
              },
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'longitude',
                type: 'input',
                templateOptions: {
                  label: 'Longitude',
                  placeholder: 'Enter Longitude',
                  type: 'number',
                }
              },
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'latitude',
                type: 'input',
                templateOptions: {
                  label: 'Latitude',
                  placeholder: 'Enter Latitude',
                  type: 'number',
                }
              },
              {
                className: 'ant-col-4 pr-md m-3',
                key: 'route_map',
                type: 'input',
                templateOptions: {
                  label: 'Route Map',
                  placeholder: 'Enter Route Map URL',
                }
              }
            ]
          }
        }         
        
      ]
    }
    }
  }