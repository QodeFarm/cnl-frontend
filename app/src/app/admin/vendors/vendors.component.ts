import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { Router } from '@angular/router';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { VendorsListComponent } from './vendors-list/vendors-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  imports: [CommonModule, AdminCommmonModule, VendorsListComponent],
  standalone: true,
  styleUrls: ['./vendors.component.scss']
})

export class VendorsComponent {
  showVendorList: boolean = false;
  showForm: boolean = false;
  VendorEditID: any;
  @ViewChild(VendorsListComponent) VendorsListComponent!: VendorsListComponent;

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  private observer: MutationObserver;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.showVendorList = false;
    this.showForm = true;
    this.VendorEditID = null;
    // Set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);
    console.log("---------", this.formConfig)
  }

  ngAfterViewInit() {
    const containerSelector = '.vendors-component'; // Scoped to this component
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

  editVendor(event) {
    this.VendorEditID = event;
    this.http.get('vendors/vendors/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
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
    this.VendorsListComponent?.refreshTable();
  }

  setFormConfig() {
    this.VendorEditID = null;
    this.formConfig = {
      url: "vendors/vendors/",
      title: 'Vendor',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
      exParams: [
        //  {
        //   key: 'city_id',
        //   type: 'script',
        //   value: 'data.city.city_id'
        // },
        // {
        //   key: 'state_id',
        //   type: 'script',
        //   value: 'data.state.state_id'
        // },
        // {
        //   key: 'country_id',
        //   type: 'script',
        //   value: 'data.country.country_id'
        // } 
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        vendor_data: {},
        vendor_addresses: [{
          address_type: 'Billing',
        },
        {
          address_type: 'Shipping',
        }],
        vendor_attachments: [],
      },
      fields: [
        {
          fieldGroup: [
            {
              className: 'col-12 custom-form-card-block p-0',
              key: 'vendor_data',
              fieldGroupClassName: 'row m-0 pr-0',
              fieldGroup: [
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
                  key: 'code',
                  type: 'input',
                  templateOptions: {
                    label: 'Code',
                    placeholder: 'Enter Code',
                    required: true,
                  }
                },
                {
                  className: 'col-3 p-0',
                  key: 'vendor_data',
                  fieldGroupClassName: "ant-row row mx-0 mt-2",
                  fieldGroup: [
                    {
                      key: 'picture',
                      type: 'file',
                      className: 'ta-cell pr-md col d-flex justify-content-center pr-0',
                      templateOptions: {
                        label: 'Picture',
                        required: true
                      }
                    }
                  ]
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
                      field.formControl.valueChanges.subscribe((data: any) => {
                        if (this.formConfig && this.formConfig.model && this.formConfig.model['vendor_data']) {
                          this.formConfig.model['vendor_data']['vendor_category_id'] = data.vendor_category_id;
                        } else {
                          console.error('Form config or vendor data model is not defined.');
                        }
                      });
                    }
                  }
                },
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
                        if (this.formConfig && this.formConfig.model && this.formConfig.model['vendor_data']) {
                          this.formConfig.model['vendor_data']['ledger_account_id'] = data.ledger_account_id;
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
                      key: 'vendor_addresses',
                      type: 'table',
                      className: 'custom-form-list',
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
                    // {
                    //   className: 'col-12 p-0',
                    //   key: 'vendor_addresses',
                    //   fieldGroupClassName: "ant-row row align-items-end mt-3",
                    //       fieldGroup: [

                    //       ]
                    //     },
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
                      key: 'vendor_data',
                      fieldGroupClassName: "ant-row row align-items-end mt-3",
                      fieldGroup: [
                        {
                          className: 'col-3',
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
                              field.formControl.valueChanges.subscribe((data: any) => {
                                if (this.formConfig && this.formConfig.model && this.formConfig.model['vendor_data']) {
                                  this.formConfig.model['vendor_data']['payment_term_id'] = data.payment_term_id;
                                } else {
                                  console.error('Form config or Customer data model is not defined.');
                                }
                              });
                            }
                          }
                        },
                        {
                          className: 'col-3',
                          key: 'interest_rate_yearly',
                          type: 'input',
                          templateOptions: {
                            label: 'Interest Rate Yearly',
                            placeholder: 'Enter Interest Rate Yearly',
                            type: 'number',
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
                                if (this.formConfig && this.formConfig.model && this.formConfig.model['vendor_data']) {
                                  this.formConfig.model['vendor_data']['price_category_id'] = data.price_category_id;
                                } else {
                                  console.error('Form config or Customer data model is not defined.');
                                }
                              });
                            }
                          }
                        },
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
                          key: 'is_sub_vendor',
                          type: 'checkbox',
                          templateOptions: {
                            label: 'Is Sub Vendor',
                          }
                        },
                        {
                          className: 'col-3',
                          key: 'vendor_common_for_sales_purchase',
                          type: 'checkbox',
                          templateOptions: {
                            label: 'Vendor common for Sales and Purchase',
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
                      key: 'vendor_data',
                      fieldGroupClassName: "ant-row row align-items-end mt-3",
                      fieldGroup: [
                        {
                          className: 'ta-cell pr-md col-4',
                          key: 'website',
                          type: 'input',
                          templateOptions: {
                            label: 'Website',
                            placeholder: 'Enter Website URL',
                          }
                        },
                        {
                          className: 'col-4',
                          key: 'facebook',
                          type: 'input',
                          templateOptions: {
                            label: 'Facebook',
                            placeholder: 'Enter Facebook URL',
                          }
                        },
                        {
                          className: 'col-4',
                          key: 'skype',
                          type: 'input',
                          templateOptions: {
                            label: 'Skype',
                            placeholder: 'Enter Skype ID',
                          }
                        },
                        {
                          className: 'col-4',
                          key: 'twitter',
                          type: 'input',
                          templateOptions: {
                            label: 'Twitter',
                            placeholder: 'Enter Twitter URL',
                          }
                        },
                        {
                          className: 'col-4',
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
                      key: 'vendor_data',
                      fieldGroupClassName: "ant-row row align-items-end mt-3",
                      fieldGroup: [
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
                                if (this.formConfig && this.formConfig.model && this.formConfig.model['vendor_data']) {
                                  this.formConfig.model['vendor_data']['gst_category_id'] = data.gst_category_id;
                                } else {
                                  console.error('Form config or Customer data model is not defined.');
                                }
                              });
                            }
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
                      key: 'vendor_data',
                      fieldGroupClassName: "ant-row row align-items-end mt-3",
                      fieldGroup: [
                        {
                          className: 'col-4',
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
                                if (this.formConfig && this.formConfig.model && this.formConfig.model['vendor_data']) {
                                  this.formConfig.model['vendor_data']['transporter_id'] = data.transporter_id;
                                } else {
                                  console.error('Form config or Customer data model is not defined.');
                                }
                              });
                            }
                          }
                        },
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
                          key: 'vendor_attachments',
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
                  className: 'col-9 p-0',
                  key: 'vendor_data',
                  fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
                  fieldGroup: [
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'contact_person',
                      type: 'input',
                      templateOptions: {
                        label: 'Contact Person',
                        placeholder: 'Enter Contact Person',
                      }
                    },
                    {
                      className: 'col-4',
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
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['vendor_data']) {
                              this.formConfig.model['vendor_data']['firm_status_id'] = data.firm_status_id;
                            } else {
                              console.error('Form config or Customer data model is not defined.');
                            }
                          });
                        }
                      }
                    },
                    {
                      className: 'col-4',
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
                      className: 'col-4',
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
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['vendor_data']) {
                              this.formConfig.model['vendor_data']['territory_id'] = data.territory_id;
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
      ]
    }
  }
}