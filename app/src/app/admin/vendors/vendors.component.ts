import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  showVendorList: boolean = false;
  showForm: boolean = false;
  VendorEditID: any;

  formConfig: TaFormConfig = {};

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.showVendorList = false;
    this.showForm = true;
    // Set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
  }

  hide() {
    const modalCloseButton = document.getElementById('modalClose');
    if (modalCloseButton) {
      modalCloseButton.click();
    }
  }

  editVendor(event: any) {
    console.log('event', event);
    this.VendorEditID = event;
    this.http.get('vendors/vendors/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res && res.data) {
        this.formConfig.model = res.data;
        console.log("vendors data",res.data)
        // Set labels for update
        this.formConfig.submit.label = 'Update';
        // Show form after setting form values
        this.formConfig.pkId = 'vendor_id';
        this.formConfig.model['vendor_id'] = this.VendorEditID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  showVendorListFn() {
    this.showVendorList = true;
  }

  setFormConfig() {
    this.formConfig = {
      url: "vendors/vendors/",
      title: 'Vendor',
      formState: {
        viewMode: false
      },
      exParams: [
        {
          key: 'city_id',
          type: 'script',
          value: 'data.city.city_id'
        },
        {
          key: 'state_id',
          type: 'script',
          value: 'data.state.state_id'
        },
        {
          key: 'country_id',
          type: 'script',
          value: 'data.country.country_id'
        }
      ],
      submit: {
        submittedFn: () => this.ngOnInit()
      },
      reset: {},
      model: {
        vendor_data: {},
        vendor_addresses: [{
          address_type: 'Billing',
        },
        {
          address_type: 'Shipping',
        }],
        vendor_attachments: [{}],
      },
      fields: 
      [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'vendor_data',
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
                dataKey: 'name',
                dataLabel: "name",
                label: 'Ledger account',
                required: true,
                // placeholder: 'Select Ledger account',
                lazy: {
                  url: 'customers/ledger_accounts/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    console.log("ledger_account", data);
                    if (data && data.ledger_account_id) {
                      this.formConfig.model['vendor_data']['ledger_account_id'] = data.ledger_account_id;
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
                  field.formControl.valueChanges.subscribe(data => {
                    console.log("firm_status", data);
                    if (data && data.firm_status_id) {
                      this.formConfig.model['vendor_data']['firm_status_id'] = data.firm_status_id;
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
                  field.formControl.valueChanges.subscribe(data => {
                    console.log("territory", data);
                    if (data && data.territory_id) {
                      this.formConfig.model['vendor_data']['territory_id'] = data.territory_id;
                    }
                  });
                }
              }
            },
            {
              className: 'col-3',
              key: 'vendor_category',
              type: 'select',
              templateOptions: {
                label: 'Vendor Category',
                dataKey: 'vendor_category_id',
                dataLabel: 'name',
                options: [],
                lazy: {
                  url: 'vendors/vendor_category/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    console.log("vendor_category", data);
                    if (data && data.territory_id) {
                      this.formConfig.model['vendor_data']['vendor_category_id'] = data.vendor_category_id;
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
                  field.formControl.valueChanges.subscribe(data => {
                    console.log("gst_category", data);
                    if (data && data.gst_category_id) {
                      this.formConfig.model['vendor_data']['gst_category_id'] = data.gst_category_id;
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
              key: 'gst_no',
              type: 'input',
              templateOptions: {
                label: 'GST No',
                placeholder: 'Enter GST No',
              }
            },
            {
              className: 'col-3',
              key: 'registration_date',
              type: 'input',
              templateOptions: {
                label: 'Registration Date',
                placeholder: 'Enter Registration Date',
                type: 'date',
              }
            },
     
           
          ]
        },
        {
          className: 'col-3 p-0',
          fieldGroup:[
            // {
            //   key: 'picture',
            //   type: 'file',
            //   className: 'ta-cell pr-md col-12',
            //   templateOptions: {
            //     label: 'Picture',
            //     required: true
            //   }
            // },
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
              field.formControl.valueChanges.subscribe(data => {
                console.log("gst_category", data);
                if (data && data.transporter_id) {
                  this.formConfig.model['vendor_data']['transporter_id'] = data.transporter_id;
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
                  {
                    className: 'col-2',
                    key: 'picture',
                    type: 'input',
                    templateOptions: {
                      label: 'Picture',
                      placeholder: 'Enter Picture URL',
                    }
                  },
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
                        url: 'vendors/vendor_payment_terms/',
                        lazyOneTime: true
                      }
                    },
                    hooks: {
                      onChanges: (field: any) => {
                        field.formControl.valueChanges.subscribe(data => {
                          console.log("gst_category", data);
                          if (data && data.payment_term_id) {
                            this.formConfig.model['vendor_data']['payment_term_id'] = data.payment_term_id;
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
                        field.formControl.valueChanges.subscribe(data => {
                          console.log("price_category", data);
                          if (data && data.price_category_id) {
                            this.formConfig.model['vendor_data']['price_category_id'] = data.price_category_id;
                          }
                        });
                      }
                    }
                  },
                  // Seventh row: Agents and Transport
                  {
                    className: 'col-2',
                    key: 'vendor_agent',
                    type: 'select',
                    templateOptions: {
                      label: 'Vendor Agent',
                      dataKey: 'vendor_agent_id',
                      dataLabel: 'name',
                      options: [],
                      lazy: {
                        url: 'vendors/vendor_agent/',
                        lazyOneTime: true
                      }
                    },
                    hooks: {
                      onChanges: (field: any) => {
                        field.formControl.valueChanges.subscribe(data => {
                          console.log("vendor_agent", data);
                          if (data && data.vendor_agent_id) {
                            this.formConfig.model['vendor_data']['vendor_agent_id'] = data.vendor_agent_id;
                          }
                        });
                      }
                    }
                  },
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
              key: 'accounts_number',
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
              className: 'col-2',
              key: 'gst',
              type: 'input',
              templateOptions: {
                label: 'GST',
                placeholder: 'Enter GST',
              }
            },
            {
              className: 'col-2 d-flex align-items-center',
              key: 'gst_suspend',
              type: 'checkbox',
              templateOptions: {
                label: 'GST Suspend',
              }
            },
            {
              className: 'col-2 d-flex align-items-center',
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
              key: 'is_sub_vendor',
              type: 'checkbox',
              templateOptions: {
                label: 'Is Sub Vendor',
              }
            },
            {
              className: 'col-2 d-flex align-items-center',
              key: 'vendor_common_for_sales_purchase',
              type: 'checkbox',
              templateOptions: {
                label: 'Vendor common for Sales and Purchase',
              }
            },
          ]
        },
        {
          className: 'row col-6 m-0 custom-form-card',
          fieldGroup: [
            {
              template: '<div class="custom-form-card-title">Vendor Attachments</div>',
              fieldGroupClassName: "ant-row",
            },
            {
              key: 'vendor_attachments',
              type: 'file',
              className: 'ta-cell col-16 custom-file-attachement',
              props: {
                "displayStyle": "files",
                "multiple": true
              }
            }
          ]
        },
            // start of order_shipments keys
        
            {
              key: 'vendor_addresses',
              type: 'table',
              className: 'custom-form-list',
              templateOptions: {
                title: 'Vendor Addresses',
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
                        this.formConfig.model['vendor_addresses'][index]['city_id'] = data.city_id;
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
                          this.formConfig.model['vendor_addresses'][index]['state_id'] = data.state_id;
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
                          this.formConfig.model['vendor_addresses'][index]['country_id'] = data.country_id;
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
                      placeholder: 'Enter',
                    }
                  },
                  {
                    type: 'input',
                    key: 'latitude',
                    templateOptions: {
                      label: 'Latitude',
                      hideLabel: true,
                      placeholder: '',
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
          ]
        }
      }
    }
    