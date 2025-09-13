import { TaCurdConfig } from "@ta/ta-curd";

export const customerCudConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'customers/customers/?summary=true',
        showCheckbox: false,
        pkId: "customer_id",
        hideFilters: true,
        export: {
            downloadName: 'customers'
        },
        fixedFilters: [
            {
                key: 'summary',
                value: 'true'
            },
        ],
        pageSize: 10,
        "globalSearch": {
            keys: ['created_at', 'name', 'email', 'phone', 'gst', 'city_id', 'ledger_account_id']
        },
        // // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'name',
                name: 'Name',
                sort: true
            },
            // {
            //     fieldKey: 'email',
            //     name: 'Email',
            //     sort: false,
            // },
            {
                fieldKey: 'phone',
                name: 'Phone',
                sort: false,
            },
            // {
            //     fieldKey: 'gst',
            //     name: 'GST',
            //     sort: true,
            // },
            {
                fieldKey: 'city_id',
                name: 'City Name',
                sort: false,
                displayType: 'map',
                mapFn: (currentValue: any, row: any, col: any) => {
                    return row.city.city_name;
                },
            },
            {
              fieldKey: "code",
              name: "Action",
              type: 'action',
              actions: [
                {
                  type: 'delete',
                  label: 'Delete',
                  confirm: true,
                  confirmMsg: "Sure to delete?",
                  apiUrl: 'customers/customers'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'customers/customers'
                },
                {
                  type: 'edit',
                  label: 'Edit'
                }
              ]
            },
            // {
            //     fieldKey: 'ledger_account_id',
            //     name: 'Ledger Account',
            //     sort: true,
            //     displayType: 'map',
            //     mapFn: (currentValue: any, row: any, col: any) => {
            //         return row.ledger_account.name;
            //     },
            // },
            // {
            //     fieldKey: 'pin_code',
            //     name: 'Pin Code',
            //     sort: true,
            // }
        ]
    },
    formConfig: {
        // url: "customers/customers/",
        title: 'Customer',
        formState: {
            viewMode: false
        },
        showActionBtn: true,
        exParams: [],
        submit: {
            label: 'Submit',
            submittedFn: () => {
                // if (!this.CustomerEditID) {
                //     this.submitCustomerForm();
                // } else {
                //     this.updateCustomer();
                //     // Otherwise, create a new record
                // }
            }
        },
        reset: {
            resetFn: () => {
                // this.ngOnInit();
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
                                            required: false,
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
                                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                                    //     this.formConfig.model['customer_data']['customer_category_id'] = data.customer_category_id;
                                                    // } else {
                                                    //     console.error('Form config or Customer data model is not defined.');
                                                    // }
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
                                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                                    //     this.formConfig.model['customer_data']['ledger_account_id'] = data.ledger_account_id;
                                                    // } else {
                                                    //     console.error('Form config or Customer data model is not defined.');
                                                    // }
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
                                                    type: 'select',
                                                    templateOptions: {
                                                        dataKey: 'city_id',
                                                        dataLabel: 'city_name',
                                                        label: 'City',
                                                        placeholder: 'city',
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
                                                                // const index = field.parent.parent.model.indexOf(field.parent.model);
                                                                const index = field.parent.key;
                                                                // if (this.formConfig && this.formConfig.model) {
                                                                //     this.formConfig.model['customer_addresses'][index]['city_id'] = data.city_id;
                                                                // } else {
                                                                //     console.error('Form config or Customer addresses model is not defined.');
                                                                // }
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
                                                                // const index = field.parent.parent.model.indexOf(field.parent.model);
                                                                const index = field.parent.key;
                                                                // if (this.formConfig && this.formConfig.model) {
                                                                //     this.formConfig.model['customer_addresses'][index]['state_id'] = data.state_id;
                                                                // } else {
                                                                //     console.error('Form config or Customer addresses model is not defined.');
                                                                // }
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
                                                        required: false,
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
                                                                // if (this.formConfig && this.formConfig.model) {
                                                                //     this.formConfig.model['customer_addresses'][index]['country_id'] = data.country_id;
                                                                // } else {
                                                                //     console.error('Form config or Customer addresses model is not defined.');
                                                                // }
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
                                                            // if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                                            //     this.formConfig.model['customer_data']['payment_term_id'] = data.payment_term_id;
                                                            // } else {
                                                            //     console.error('Form config or Customer data model is not defined.');
                                                            // }
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
                                                            // if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                                            //     this.formConfig.model['customer_data']['price_category_id'] = data.price_category_id;
                                                            // } else {
                                                            //     console.error('Form config or Customer data model is not defined.');
                                                            // }
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
                                                            // if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                                            //     this.formConfig.model['customer_data']['gst_category_id'] = data.gst_category_id;
                                                            // } else {
                                                            //     console.error('Form config or Customer data model is not defined.');
                                                            // }
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
                                                            // if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                                            //     this.formConfig.model['customer_data']['transporter_id'] = data.transporter_id;
                                                            // } else {
                                                            //     console.error('Form config or Customer data model is not defined.');
                                                            // }
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
                                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                                    //     this.formConfig.model['customer_data']['firm_status_id'] = data.firm_status_id;
                                                    // } else {
                                                    //     console.error('Form config or Customer data model is not defined.');
                                                    // }
                                                });
                                            }
                                        }
                                    },
                                    {
                                        className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                                        key: 'registration_date',
                                        type: 'date',
                                        defaultValue: null,
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
                                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['customer_data']) {
                                                    //     this.formConfig.model['customer_data']['territory_id'] = data.territory_id;
                                                    // } else {
                                                    //     console.error('Form config or Customer data model is not defined.');
                                                    // }
                                                });
                                            }
                                        }
                                    },
                                ]
                            },
                        ]
                    },
                ]
            }
        ]
    }
};

export const customerCategoryConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'masters/customer_categories/',
        // title: 'Customer Categories',
        pkId: "customer_category_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['customer_category_id', 'name', 'code']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'name',
                name: 'Name',
                sort: true
            },
            {
                fieldKey: 'code',
                name: 'Code',
                sort: true
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [
                    {
                        type: 'delete',
                        label: 'Delete',
                        confirm: true,
                        confirmMsg: "Sure to delete?",
                        apiUrl: 'masters/customer_categories'
                    },
                    {
                      type: 'restore',
                      label: 'Restore',
                      confirm: true,
                      confirmMsg: "Sure to restore?",
                      apiUrl: 'masters/customer_categories'
                    },
                    {
                        type: 'edit',
                        label: 'Edit'
                    }
                ]
            }
        ]
    },
    formConfig: {
        url: 'masters/customer_categories/',
        title: 'Customer  Categories',
        pkId: "customer_category_id",
        fields: [
            {
                className: 'col-12 p-0',
                fieldGroupClassName: "ant-row",
                fieldGroup: [
                    {
                        key: 'name',
                        type: 'input',
                        className: 'col-md-6 col-12 pb-3 px-1',
                        templateOptions: {
                            label: 'Name',
                            placeholder: 'Enter Name',
                            required: true,
                        }
                    },
                    {
                        key: 'code',
                        type: 'input',
                        className: 'col-md-6 col-12 pb-3 px-1',
                        templateOptions: {
                            label: 'Code',
                            placeholder: 'Enter Code'
                        }
                    },
                ]
            }
        ]
    }

}

export const ledgerAccountsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'customers/ledger_accounts/',
    //   title: 'Ledger Accounts',
      pkId: "ledger_account_id",
      hideFilters: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['ledger_account_id', 'name','code','inactive','type','account_no','is_loan_account', 'address','pan','ledger_group_id']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        // {
        //   fieldKey: 'inactive',
        //   name: 'Inactive',
        //   sort: true,
        //   type: 'boolean'
        // },
        // {
        //   fieldKey: 'type', 
        //   name: 'Type',
        //   sort: true
        // },
        {
          fieldKey: 'ledger_group_id',
          name: 'Ledger Group',
          // sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.ledger_group.name}`;
          },
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'customers/ledger_accounts'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'customers/ledger_accounts'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'customers/ledger_accounts/',
      title: 'Ledger Accounts',
      pkId: "ledger_account_id",
      exParams: [
        {
          key: 'ledger_group_id',
          type: 'script',
          value: 'data.ledger_group.ledger_group_id'
        },
      ],
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: true,
              }
            },
            {
              key: 'type',
              type: 'select',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Type',
                options: [
                  { value: 'Customer', label: 'Customer' },
                  { value: 'Bank', label: 'Bank' },
                  { value: 'Cash', label: 'cash' },
                  { value: 'Vendor', label: 'Vendor'}
                ],
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'account_no',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Account No',
                type: 'password'
              }
            },
            {
              key: 'rtgs_ifsc_code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'RTGS IFSC Code',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'classification',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Classification',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
        {
              key: 'address',
              type: 'text',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Address',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
        {
              key: 'pan',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'PAN',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'ledger_group',
              type: 'ledger-group-dropdown',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Ledger Group',
                dataKey: 'ledger_group_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'masters/ledger_groups/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'tds_applicable',
              type: 'checkbox',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'TDS Applicable'
              }
            },
            {
              key: 'is_subledger',
              type: 'checkbox',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Is Subledger'
              }
            },
            {
              key: 'inactive',
              type: 'checkbox',
              className: 'col-md-6 col-12 pb-md-0 pb-3 px-1',
              templateOptions: {
                label: 'Inactive'
              }
            },
            {
              key: 'is_loan_account',
              type: 'checkbox',
              className: 'col-md-6 col-12  px-1',
              templateOptions: {
                label: 'Is Loan Account'
              }
            },
          ]
        }
      ]
    }

  }

export const cityConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/city/',
    //   title: 'City List',
      pkId: 'city_id',
      pageSize: 10,
      hideFilters: true,
      "globalSearch": {
        keys: ['state_name', 'city_name', 'city_code']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        // {
        //   fieldKey: 'state_name',
        //   name: 'State',
        //   sort: false,
        //   displayType: 'map',
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return row.state.state_name;
        //   },
        // },
        {
          fieldKey: 'city_name',
          name: 'City Name',
          sort: true,
        },
        // {
        //   fieldKey: 'city_code',
        //   name: 'City Code',
        //   sort: true,
        // },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/city'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/city'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/city/',
      pkId: 'city_id',
      title: 'City',
        exParams: [
        {
          key: 'state_id',
          type: 'script',
          value: 'data.state.state_id'
        },
      ],
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'state',
              type: 'select',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'State',
                required: true,
                dataKey: 'state_id',
                dataLabel: 'state_name',
                lazy: {
                  url: 'masters/state/',
                  lazyOneTime: true
                }
              },
            },
            {
              key: 'city_name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'City Name',
                required: true,
              },

            },
            {
              key: 'city_code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'City Code',
                placeholder: 'Enter City Code'
              }
            },
          ]
        }
      ]
    }

}

export const StateConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/state/',
    //   title: 'State List',
      hideFilters: true,
      pkId: 'state_id',
      pageSize: 10,
      "globalSearch": {
        keys: ['country_name', 'state_name', 'state_code']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        // {
        //   fieldKey: 'country_name',
        //   name: 'Country',
        //   sort: false,
        //   displayType: 'map',
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return row.country.country_name;
        //   },
        // },
        {
          fieldKey: 'state_name',
          name: 'State Name',
          sort: true,
        },
        // {
        //   fieldKey: 'state_code',
        //   name: 'State Code',
        //   sort: true,
        // },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/state'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/state'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/state/',
      pkId: 'state_id',
      title: 'State',
      exParams: [
        {
          key: 'country_id',
          type: 'script',
          value: 'data.country.country_id'
        },
      ],
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'country',
              type: 'select',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Country',
                required: true,
                dataKey: 'country_id',
                dataLabel: 'country_name',
                lazy: {
                  url: 'masters/country/',
                  lazyOneTime: true
                }
              },
            },
            {
              key: 'state_name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'State Name',
                required: true,
              },
            },
            {
              key: 'state_code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'State Code',
                required: true,
                maxLength: 10,
                description: 'e.g., KL, TN, MH'
              },
              validation: {
                messages: {
                  required: 'State Code is required',
                }
              }
            }
          ]
        }
      ]
    }

  }

export const CountryConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/country/',
    //   title: 'Country List',
      pkId: 'country_id',
      hideFilters: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['country_name', 'country_code']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'country_name',
          name: 'Country Name',
          sort: true,
        },
        // {
        //   fieldKey: 'country_code',
        //   name: 'Country Code',
        //   sort: true,
        // },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/country'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/country'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/country/',
      pkId: 'country_id',
      title: 'Country',
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'country_name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',

              templateOptions: {
                label: 'Country Name',
                placeholder: 'Enter Country Name',
                required: true,
              },
            },
            {
              key: 'country_code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Country Code',
                required: true,
                placeholder: 'Enter Country Code',
                description: 'e.g., IND, USA, AUS'
              },
            }
          ]
        }
      ]
    }

  }

export const vendorCategeoryConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'vendors/vendor_category/',
    //   title: 'Vendor Category List',
      hideFilters: true,
      pkId: "vendor_category_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['vendor_category_id', 'code', 'name']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'code',
          name: 'code',
          sort: true
        },
		    {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'vendors/vendor_category'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'vendors/vendor_category'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'vendors/vendor_category/',
      title: 'Vendor Category List',
      pkId: "vendor_category_id",
      exParams: [
      ],
      fields: [
        {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [
        {
          key: 'code',
          type: 'input',
          className: 'col-md-6 col-12 pb-md-0 pb-3 px-1',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Code',
            required: true,
          }
        },
		    {
          key: 'name',
          type: 'input',
          className: 'col-md-6 col-12 px-1',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter Name',
            required: true,
          }
        },
      ]
    }
      ]
   
    }

  }

export const statusConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/statuses/',
    //   title: 'Statuses',
      
      pkId: "status_id",
      hideFilters: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['status_id', 'status_name']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'status_name',
          name: 'Status name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/statuses'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/statuses'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/statuses/',
      title: 'Statuses',
      pkId: "status_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'status_name',
          type: 'input',
          className: 'col-md-6 col-12 p-0',
          templateOptions: {
            label: 'Status name',
            placeholder: 'Enter status name',
            required: true,
          }
        },
      ]
    }
      ]
    }

  }

export const TransportConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/transporters/',
    //   title: 'Transporters',
      
      pkId: "transporter_id",
      hideFilters: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['transporter_id', 'name', 'code','gst_no','website_url']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        {
          fieldKey: 'code', 
          name: 'Code',
          // sort: true
        },
        {
          fieldKey: 'gst_no', 
          name: 'GST',
          sort: true
        },
        {
          fieldKey: 'website_url', 
          name: 'Web URL',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/transporters'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/transporters'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/transporters/',
      title: 'Transporter',
      pkId: "transporter_id",
      exParams: [
      ],
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: true,
              }
            },
            {
              key: 'gst_no',
              type: 'input',
              className: 'col-md-6 col-12 pb-md-0 pb-3 px-1',
              templateOptions: {
                label: 'GST',
                placeholder: 'Enter GST',
              }
            },
            {
              key: 'website_url',
              type: 'input',
              className: 'col-md-6 col-12  px-1',
              templateOptions: {
                label: 'Website url',
                placeholder: 'Enter website url',
              }
            },
          ]
        }
      ]
    }

  }

export const FirmStatusConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/firm_statuses/',
    //   title: 'Firm Statuses',
      
      pkId: "firm_status_id",
      hideFilters: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['firm_status_id', 'name']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
		    {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/firm_statuses'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/firm_statuses'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/firm_statuses/',
      title: 'Firm Statuses',
      pkId: "firm_status_id",
      exParams: [
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
		{
          key: 'name',
          type: 'input',
          className: 'col-md-6 col-12 p-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
      ]
    }
      ]
    }

  }

export const GstCatConfig: TaCurdConfig = {
      drawerSize: 500,
      drawerPlacement: 'top',
      tableConfig: {
        apiUrl: 'masters/gst_categories/',
        // title: 'Gst Categories',
        
        pkId: "gst_category_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
          keys: ['gst_category_id', 'name']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
      {
            fieldKey: 'name',
            name: 'Name',
            sort: true
          },
          {
            fieldKey: "code",
            name: "Action",
            type: 'action',
            actions: [
              {
                type: 'delete',
                label: 'Delete',
                confirm: true,
                confirmMsg: "Sure to delete?",
                apiUrl: 'masters/gst_categories'
              },
              {
                type: 'restore',
                label: 'Restore',
                confirm: true,
                confirmMsg: "Sure to restore?",
                apiUrl: 'masters/gst_categories'
              },
              {
                type: 'edit',
                label: 'Edit'
              },
              // {
              //   type: 'callBackFn',
              //   label: 'Edit',
              //   // callBackFn: (row, action) => {
              //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
              //   // }
              // }
            ]
          }
        ]
      },
      formConfig: {
        url: 'masters/gst_categories/',
        title: 'Gst Categories',
        pkId: "gst_category_id",
        exParams: [
        ],
        fields: [
          {
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [
          {
            key: 'name',
            type: 'input',
            className: 'col-md-6 col-12 p-0',
            templateOptions: {
              label: 'Name',
              placeholder: 'Enter name',
              required: true,
            }
          },
        ]
      }
        ]
    }
  
}

export const PriceCatConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/price_categories/',
      // title: 'Price Categories',
      
      pkId: "price_category_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['price_category_id', 'name', 'code']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
		    {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
		    {
          fieldKey: 'code',
          name: 'Code',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/price_categories'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/price_categories'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/price_categories/',
      title: 'Price Categories',
      pkId: "price_category_id",
      exParams: [
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
		    {
          key: 'name',
          type: 'input',
          className: 'col-md-6 col-12 px-1 pb-3 pb-md-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
		    {
          key: 'code',
          type: 'input',
          className: 'col-md-6 col-12 px-1',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter code',
            required: true,
          }
        }
      ]
    }
      ]
    }

}

export const VendorAgentConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'vendors/vendor_agent/',
      // title: 'Vendor Agent List',
      
      pkId: "vendor_agent_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['vendor_agent_id', 'name','code','commission_rate','rate_on','amount_type']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'code',
          name: 'code',
          sort: true
        },
		    // {
        //   fieldKey: 'commission_rate',
        //   name: 'Commission Rate',
        //   sort: true
        // },
		    // {
        //   fieldKey: 'rate_on',
        //   name: 'Rate On',
        //   sort: true
        // },
		    // {
        //   fieldKey: 'amount_type',
        //   name: 'Amount Type',
        //   sort: true
        // },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'vendors/vendor_agent'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'vendors/vendor_agent'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'vendors/vendor_agent/',
      title: 'Vendor Agent List',
      pkId: "vendor_agent_id",
      exParams: [
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
        {
          key: 'code',
          type: 'input',
          className: 'col-md-6 col-12 pb-3 px-1',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter code',
            required: true,
          }
        },
		    {
          key: 'name',
          type: 'input',
          className: 'col-md-6 col-12 pb-3 px-1',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
		    {
          key: 'commission_rate',
          type: 'input',
          className: 'col-md-6 col-12 pb-3 px-1',
          templateOptions: {
            label: 'Commission rate',
            placeholder: 'Enter commission rate',
            required: true,
          }        
        },
        {
          key: 'rate_on',
          type: 'select',
          className: 'col-md-6 col-12 pb-3 pb-md-0 px-1',
          templateOptions: {
            label: 'Rate On',
            placeholder: 'Enter rate on',
            required: true,
            options: [
              { 'label': "Qty", value: 'Qty' },
              { 'label': "Amount", value: 'Amount' }
            ]
          }
        },
        {
          key: 'amount_type',
          type: 'select',
          className: 'col-md-6 col-12 px-1',
          templateOptions: {
            label: 'Amount Type',
            placeholder: 'Enter amount type',
            required: true,
            options: [
              { 'label': "Taxable", value: 'Taxable' },
              { 'label': "BillAmount", value: 'BillAmount' }
            ]
          }
        },]
      }
      ]
    }

}

export const VendorPaymentTermsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'vendors/vendor_payment_terms/',
      // title: 'Vendor Payment Terms List',
      hideFilters: true,
      pkId: "payment_term_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['payment_term_id', 'name', 'code','fixed_days','no_of_fixed_days','payment_cycle','run_on']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
	      {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'code',
          name: 'code',
          sort: true
        },
		    // {
        //   fieldKey: 'fixed_days',
        //   name: 'Fixed Days',
        //   sort: true
        // },
		    // {
        //   fieldKey: 'no_of_fixed_days',
        //   name: 'No of fixed days',
        //   sort: true
        // },
        {
          fieldKey: 'payment_cycle',
          name: 'Payment Cycle',
          sort: true
        },
		    // {
        //   fieldKey: 'run_on',
        //   name: 'Run On',
        //   sort: true
        // },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'vendors/vendor_payment_terms'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'vendors/vendor_payment_terms'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'vendors/vendor_payment_terms/',
      title: 'Vendor Payment Terms List',
      pkId: "payment_term_id",
      exParams: [
      ],
      fields: [ 
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
	     {
          key: 'name',
          type: 'input',
          className: 'col-md-6 col-12 pb-3 px-1',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter Name',
            required: true,
          }
        },
        {
          key: 'code',
          type: 'input',
          className: 'col-md-6 col-12 pb-3 px-1',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Code',
            required: true,
          }
        },
		    {
          key: 'fixed_days',
          type: 'input',
          className: 'col-md-6 col-12 pb-3 px-1',
          templateOptions: {
            label: 'Fixed Days',
            placeholder: 'Enter fixed days',
            required: true,
          }
        },
		    {
          key: 'no_of_fixed_days',
          type: 'input',
          className: 'col-md-6 col-12 pb-3 px-1',
          templateOptions: {
            label: 'No of fixed days',
            placeholder: 'Enter no of fixed days',
            required: true,
          }
        },
		    {
          key: 'payment_cycle',
          type: 'input',
          className: 'col-md-6 col-12 pb-md-0 pb-3 px-1',
          templateOptions: {
            label: 'Payment Cycle',
            placeholder: 'Enter payment cycle',
            required: true,
          }
        },
		    {
          key: 'run_on',
          type: 'input',
          className: 'col-md-6 col-12  px-1',
          templateOptions: {
            label: 'Run on',
            placeholder: 'Enter run on',
            required: true,
          }
        }
      ]
    }
      ]
    }

  }

export const CustomerPaymentConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/customer_payment_terms/',
      // title: 'Customer Payment Terms',
      // 
      pkId: "payment_term_id",
      hideFilters: true,
      pageSize: 10,
      // "globalSearch": {
      //   keys: ['payment_term_id', 'name','code','fixed_days','no_of_fixed_days','payment_cycle', 'run_on']
      // },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        // {
        //   fieldKey: 'code', 
        //   name: 'Code',
        //   // sort: true
        // },
        // {
        //   fieldKey: 'fixed_days', 
        //   name: 'Fixed days',
        //   type: 'number',
        //   sort: true
        // },
        // {
        //   fieldKey: 'no_of_fixed_days', 
        //   name: 'No.of.fixed days',
        //   sort: true
        // },
        {
          fieldKey: 'payment_cycle', 
          name: 'Payment Cycle',
          sort: true
        },
        // {
        //   fieldKey: 'run_on', 
        //   name: 'Run on',
        //   sort: true
        // },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/customer_payment_terms'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/customer_payment_terms'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/customer_payment_terms/',
      title: 'Customer Payment Terms',
      pkId: "payment_term_id",
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: true,
              }
            },
            {
              key: 'fixed_days',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Fixed days',
                type: 'number',
                placeholder: 'Enter Fixed days',
                required: false,
              }
            },
            {
              key: 'no_of_fixed_days',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'no.of.Fixed days',
                type: 'number',
                placeholder: 'Enter no.of.Fixed days',
                required: false,
              }
            },
            {
              className: 'col-md-6 col-12 pb-3 pb-md-0 px-1',
              key: 'payment_cycle',
              type: 'input',
              templateOptions: {
                label: 'Payment cycle',
                placeholder: 'Enter payment cycle',
              }
            },
            {
              className: 'col-md-6 col-12 px-1',
              key: 'run_on',
              type: 'input',
              templateOptions: {
                label: 'Run on',
                placeholder: 'Enter Run on',
              }
            },
          ]
        }
      ]
    }

  }

export const LedgerGroupsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/ledger_groups/',
      // title: 'Ledger Groups',
      pkId: "ledger_group_id",
      hideFilters: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['ledger_group_id', 'name','code','inactive','under_group','nature']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        // {
        //   fieldKey: 'code', 
        //   name: 'Code',
        //   sort: true
        // },
        // {
        //   fieldKey: 'inactive',
        //   name: 'Inactive',
        //   sort: true,
        //   type: 'boolean'
        // },
        {
          fieldKey: 'under_group', 
          name: 'Under Group',
          sort: true
        },
        // {
        //   fieldKey: 'nature',
        //   name: 'Nature',
        //   sort: true
        // },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/ledger_groups'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/ledger_groups'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/ledger_groups/',
      title: 'Ledger Groups',
      pkId: "ledger_group_id",
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code'
              }
            },
            {
              key: 'under_group',
              type: 'text',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Under Group',
                placeholder: 'Enter Under Group',
              }
            },
            {
              key: 'nature',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 pb-md-0 px-1',
              templateOptions: {
                label: 'Nature',
                placeholder: 'Enter Nature'
              }
            },
            {
              key: 'inactive',
              type: 'checkbox',
              className: 'col-md-6 col-12 px-1',
              templateOptions: {
                label: 'Inactive'
              }
            },
          ]
        }
      ]
    }

}

export const TerritoryConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/territory/',
      hideFilters: true,
      // title: 'Territory',
      
      pkId: "territory_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['territory_id', 'name','code']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        {
          fieldKey: 'code', 
          name: 'Code',
          // sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/territory'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/territory'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/territory/',
      title: 'Territory',
      pkId: "territory_id",
      fields: [
        {
          // className: 'col-9 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-md-0 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code',
                required: true,
              }
            },
          ]
        }
      ]
    }

}

export const MachineConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'production/machines/',
    //   title: 'Machines',
      pkId: "machine_id",
      hideFilters: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['machine_id', 'machine_name', 'description', 'status']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'machine_name',
          name: 'Machine Name',
          sort: true
        },
        // {
        //   fieldKey: 'description',
        //   name: 'Description',
        //   sort: true
        // },
        {
          fieldKey: 'status',
          name: 'status',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [{
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'production/machines'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'production/machines'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'production/machines/',
      title: 'Machine',
      pkId: "machine_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'machine_name',
              type: 'input',
              className: 'col-md-6 col-12 px-1 mb-3',
              templateOptions: {
                label: 'Machine Name',
                placeholder: 'Enter Machine Name',
                required: true,
              }
            },
            {
              key: 'status',
              type: 'select',
              className: 'col-md-6 col-12 px-1 mb-3',
              templateOptions: {
                label: 'Status',
                placeholder: 'Enter Status',
                required: false,
                options : [
                  { value: 'Operational', label: 'Operational' },
                  { value: 'Under Maintenance', label: 'Under Maintenance' },
                  { value: 'Out of Service', label: 'Out of Service' }
                ]
              }
            },
            {
              key: 'description',
              type: 'textarea',
              className: 'col-md-6 col-12 px-1',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description',
                required: false,
              }
            }
          ]
        }
      ]
    }
}

export const ProductionStatusesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'production/production_statuses/',
    //   title: 'Production Statuses',
      pkId: "status_id",
      hideFilters: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['status_id', 'status_name']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'status_name',
          name: 'Status Name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [{
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'production/production_statuses'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'production/production_statuses'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'production/production_statuses/',
      title: 'Production Statuses',
      pkId: "status_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'status_name',
              type: 'input',
              className: 'col-md-6 p-0 col-12',
              templateOptions: {
                label: 'Status Name',
                placeholder: 'Enter Status Name',
                required: true,
              }
            }
          ]
        }
      ]
    }
}

export const OrderStatusConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/order_status/',
      // title: 'Order Statuses',
      hideFilters: true,
      pkId: "order_status_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['order_status_id', 'status_name','description']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'status_name',
          name: 'Status name',
          sort: true
        },
		    {
          fieldKey: 'description',
          name: 'Description',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/order_status'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/order_status'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/order_status/',
      title: 'Order statuses',
      pkId: "order_status_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'status_name',
          type: 'input',
          className: 'col-md-6 col-12 px-1 mb-3 mb-md-0',
          templateOptions: {
            label: 'Status name',
            placeholder: 'Enter status name',
            required: true,
          }
        },
        {
          key: 'description',
          type: 'textarea',
          className: 'col-md-6 col-12 px-1',
          templateOptions: {
            label: 'Description',
            placeholder: 'Enter Description',
            required: true,
          }
        }
      ]
    }
      ]
    }

}

export const GstTypesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/gst_types/',
      // title: 'Gst Types',
      hideFilters: true,
      pkId: "gst_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['gst_type_id', 'name']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/gst_types'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/gst_types'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/gst_types/',
      title: 'Gst Types',
      pkId: "gst_type_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'name',
          type: 'input',
          className: 'col-md-6 col-12 p-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
      ]
    }
      ]
    }

}

export const OrderTypesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/order_types/',
    //   title: 'Order Types',
      hideFilters: true,
      pkId: "order_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['order_type_id', 'name']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/order_types'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/order_types'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/order_types/',
      title: 'Order Types',
      pkId: "order_type_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'name',
          type: 'input',
          className: 'col-md-6 col-12 p-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
      ]
    }
      ]
    }

}

export const PurchaseTypesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/purchase_types/',
    //   title: 'Purchase types',
      hideFilters: true,
      pkId: "purchase_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['purchase_type_id', 'name']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/purchase_types'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/purchase_types'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/purchase_types/',
      title: 'Purchase types',
      pkId: "purchase_type_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'name',
          type: 'input',
          className: 'col-md-6 col-12 p-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
      ]
    }
      ]
    }

}

export const SaleTypesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/sale_types/',
    //   title: 'Sale types',
      hideFilters: true,
      pkId: "sale_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['sale_type_id', 'name']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/sale_types'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/sale_types'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/sale_types/',
      title: 'Sale types',
      pkId: "sale_type_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'name',
          type: 'input',
          className: 'col-md-6 col-12 p-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
      ]
    }
      ]
    }

}

export const UserGroupsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/user_groups/',
    //   title: 'User Groups',
     hideFilters: true,
      pkId: "group_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['group_id', 'group_name', 'description']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'group_name',
          name: 'Group Name',
          sort: true
        },
		    {
        fieldKey: 'description', 
        name: 'Description',
        sort: true
        }, 
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [{
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/user_groups'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/user_groups'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/user_groups/',
      title: 'User Groups',
      pkId: "group_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'group_name',
              type: 'input',
              className: 'col-md-6 col-12 px-1 pb-3 pb-md-0',
              templateOptions: {
                label: 'Group Name',
                placeholder: 'Enter Group Name',
                required: true,
              }
            },
			      {
              key: 'description',
              type: 'textarea',
              className: 'col-md-6 col-12 px-1',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description',
                required: true,
              }
            },
          ]
        }
      ]
    }
}

export const ReminderTypesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'reminders/reminder_types/',
    //   title: 'Reminder Types',
      pkId: "reminder_type_id",
      pageSize: 10,
      hideFilters: true,
      "globalSearch": {
        keys: ['reminder_type_id', 'type_name']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'type_name',
          name: 'Type Name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [{
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'reminders/reminder_types'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'reminders/reminder_types'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'reminders/reminder_types/',
      title: 'Reminder Types',
      pkId: "reminder_type_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'type_name',
              type: 'input',
              className: 'col-md-6 col-12 p-0',
              templateOptions: {
                label: 'Type Name',
                placeholder: 'Enter Type Name',
                required: true,
              }
            },
          ]
        }
      ]
    }
}

export const PaymentLinkConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/payment_link_type/',
      // title: 'Payment link type',
      pkId: "payment_link_type_id",
      pageSize: 10,
      hideFilters: true,
      "globalSearch": {
        keys: ['payment_link_type_id', 'name', 'description']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
		    {
          fieldKey: 'description',
          name: 'Description',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/payment_link_type'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/payment_link_type'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/payment_link_type/',
      title: 'Payment link type',
      pkId: "payment_link_type_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'name',
          type: 'input',
          className: 'col-md-6 col-12 px-1 mb-3 mb-md-0',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          }
        },
        {
          key: 'description',
          type: 'textarea',
          className: 'col-md-6 col-12 px-1',
          templateOptions: {
            label: 'Description',
            placeholder: 'Enter Description',
            required: true,
          }
        }
      ]
    }
      ]
    }

}


export const productModesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'products/item-master/', // relative to base API
    //   title: 'Product Modes',
      pkId: "item_master_id",
      pageSize: 10,
      hideFilters: true, // Hide all filters for this table
      globalSearch: {
        keys: ['item_master_id', 'mode_name', 'description']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'mode_name',
          name: 'Mode Name',
          sort: true
        },
        // {
        //   fieldKey: 'description',
        //   name: 'Description',
        //   sort: false
        // },
        // {
        //   fieldKey: 'created_at',
        //   name: 'Created At',
        //   type: 'date',
        //   sort: true
        // },
        {
          fieldKey: "item_master_id",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete this Item Master?",
              apiUrl: 'products/item-master'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'products/item-master'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'products/item-master/',
      title: 'Product Modes',
      pkId: "item_master_id",
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'mode_name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Mode Name',
                placeholder: 'Enter Mode Name',
                required: true,
              }
            },
            {
              key: 'description',
              type: 'textarea',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description'
              }
            },
            // {
            //   key: 'is_deleted',
            //   type: 'checkbox',
            //   className: 'col-md-6 col-12 pb-3 px-1',
            //   templateOptions: {
            //     label: 'Is Deleted'
            //   }
            // }
          ]
        }
      ]
    }
  };

export const productSalesGLConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/product_sales_gl/',
        //   title: 'Product Sales GL',      
        pkId: "sales_gl_id",
        pageSize: 10,
        hideFilters: true, // Hide all filters for this table
        "globalSearch": {
            keys: ['name', 'sales_accounts', 'code', 'inactive', 'type', 'account_no', 'is_loan_account', 'address', 'employee', 'pan']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'name',
                name: 'Name',
                // sort: true
            },
            // {
            //   fieldKey: 'sales_accounts',
            //   name: 'Sales Accounts',
            //   sort: true,
            // },
            // {
            //   fieldKey: 'code',
            //   name: 'Code',
            //   sort: true,
            // },
            // // {
            // //   fieldKey: 'is_subledger',
            // //   name: 'Is Subledger',
            // //   sort: false,
            // //   type: 'boolean'
            // // },
            // {
            //   fieldKey: 'inactive',
            //   name: 'Inactive',
            //   sort: true,
            //   type: 'boolean'
            // },
            // {
            //   fieldKey: 'type', 
            //   name: 'Type',
            //   sort: true
            // },
            // {
            //   fieldKey: 'account_no',
            //   name: 'Account No',
            //   sort: true,
            //   isEncrypted: true
            // },
            // {
            //   fieldKey: 'rtgs_ifsc_code', 
            //   name: 'RTGS IFSC Code',
            //   sort: false
            // },
            // {
            //   fieldKey: 'classification', 
            //   name: 'Classification',
            //   sort: false
            // },
            // {
            //     fieldKey: 'is_loan_account',
            //     name: 'Is Loan Account',
            //     sort: true,
            //     type: 'boolean'
            // },
            // {
            //   fieldKey: 'tds_applicable', 
            //   name: 'TDS Applicable',
            //   sort: false,
            //   type: 'boolean'
            // },
            // {
            //     fieldKey: 'address',
            //     name: 'Address',
            //     sort: true
            // },
            // {
            //     fieldKey: 'employee',
            //     name: 'Employee',
            //     sort: true,
            //     type: 'boolean'
            // },
            // {
            //     fieldKey: 'pan',
            //     name: 'PAN',
            //     sort: true
            // },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [
                    {
                        type: 'delete',
                        label: 'Delete',
                        confirm: true,
                        confirmMsg: "Sure to delete?",
                        apiUrl: 'products/product_sales_gl'
                    },
                    {
                      type: 'restore',
                      label: 'Restore',
                      confirm: true,
                      confirmMsg: "Sure to restore?",
                      apiUrl: 'products/product_sales_gl'
                    },
                    {
                        type: 'edit',
                        label: 'Edit'
                    }
                ]
            }
        ]
    },
    formConfig: {
        url: 'products/product_sales_gl/',
        title: 'Product Sales GL',
        pkId: "sales_gl_id",
        exParams: [],
        fields:
            [
                {
                    fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                    fieldGroup:
                        [
                            {

                                key: 'name',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Name',
                                    required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'sales_accounts',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Sales Accounts',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'code',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Code',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'type',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Type',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'is_subledger',
                                type: 'checkbox',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Is Subledger'
                                }
                            },
                            {
                                key: 'inactive',
                                type: 'checkbox',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Inactive'
                                }
                            },
                            {
                                key: 'account_no',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Account No',
                                    type: 'password'
                                }
                            },
                            {
                                key: 'rtgs_ifsc_code',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'RTGS IFSC Code',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'classification',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Classification',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'pan',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'PAN',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'is_loan_account',
                                type: 'checkbox',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Is Loan Account'
                                }
                            },
                            {
                                key: 'tds_applicable',
                                type: 'checkbox',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'TDS Applicable'
                                }
                            },
                            {
                                key: 'employee',
                                type: 'checkbox',
                                className: 'col-md-6 col-12 px-1 pb-3 pb-md-0',
                                templateOptions: {
                                    label: 'Employee'
                                }
                            },
                            {
                                key: 'address',
                                type: 'textarea',
                                className: 'col-md-6 col-12 px-1 pb-0',
                                templateOptions: {
                                    label: 'Address',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            }
                        ]
                }
            ]
    }
}

export const productTypesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/product_types/',
      // title: 'Product Types',
      pkId: "type_id",
      pageSize: 10,
      hideFilters: true, // Hide all filters for this table
      globalSearch: {
        keys: ['type_id', 'type_name', 'mode_type']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'type_name',
          name: 'Type Name',
          sort: true
        },
        {
          fieldKey: 'mode_type',
          name: 'Mode Type',
          sort: true
        },
        // {
        //   fieldKey: 'created_at',
        //   name: 'Created At',
        //   type: 'date',
        //   sort: true
        // },
        {
          fieldKey: 'type_id', // fixed: use pkId here
          name: 'Action',
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/product_types'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/product_types'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/product_types/',
      title: 'Product Types',
      pkId: "type_id",
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'type_name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Type Name',
                placeholder: 'Enter Type Name',
                required: true,
              }
            },
            {
              key: 'mode_type',
              type: 'select',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Mode Type',
                placeholder: 'Select Mode Type',
                required: true,
                options: [
                  { label: 'Inventory', value: 'Inventory' },
                  { label: 'Non Inventory', value: 'Non Inventory' },
                  { label: 'Service', value: 'Service' },
                  { label: 'All', value: 'all' }
                ]
              }
            },
          ]
        }
      ]
    }
  };



export const productBrandsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'masters/product_brands/',
        // title: 'Product Brands',

        pkId: "brand_id",
        pageSize: 10,
        hideFilters: true, // Hide all filters for this table
        "globalSearch": {
            keys: ['brand_id', 'brand_name', 'code', 'brand_salesman']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'brand_name',
                name: 'Brand Name',
                sort: true
            },
            {
                fieldKey: 'code',
                name: 'Code',
                sort: true
            },
            // {
            //   fieldKey: 'picture',
            //   name: 'Picture',
            //   sort: true
            // },
            {
                fieldKey: 'brand_salesman_name',
                name: 'Brand Salesman',
                sort: true,
                displayType: "map",
                mapFn: (currentValue: any, row: any, col: any) => {
                    return `${row.brand_salesman.name}`;
                },
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [
                    {
                        type: 'delete',
                        label: 'Delete',
                        confirm: true,
                        confirmMsg: "Sure to delete?",
                        apiUrl: 'masters/product_brands'
                    },
                    {
                      type: 'restore',
                      label: 'Restore',
                      confirm: true,
                      confirmMsg: "Sure to restore?",
                      apiUrl: 'masters/product_brands'
                    },
                    {
                        type: 'edit',
                        label: 'Edit'
                    }
                ]
            }
        ]
    },
    formConfig: {
        url: 'masters/product_brands/',
        title: 'Product Brands',
        pkId: "brand_id",
        exParams: [
            {
                key: 'brand_salesman_id',
                type: 'script',
                value: 'data.brand_salesman.brand_salesman_id'
            },
        ],
        fields:
            [
                {
                    fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                    fieldGroup:
                        [
                            {
                                key: 'brand_name',
                                type: 'text',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Brand Name',
                                    placeholder: 'Enter Brand Name',
                                    required: true,
                                }
                            },
                            {
                                key: 'code',
                                type: 'text',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Code',
                                    placeholder: 'Enter Code',
                                    required: true,
                                }
                            },
                            // {
                            //   key: 'picture',
                            //   type: 'file',
                            //   className: 'ta-cell pr-md col-md-6',
                            //   templateOptions: {
                            //     label: 'Upload picture',
                            //     placeholder: 'Choose picture',
                            //     required: true,
                            //   }
                            // },
                            {
                                key: 'brand_salesman',
                                type: 'select',
                                className: 'col-md-6 col-12 px-1',
                                templateOptions: {
                                    label: 'Brand Salesman Id',
                                    dataKey: 'name',
                                    dataLabel: "name",
                                    options: [],
                                    lazy: {
                                        url: 'masters/brand_salesman/',
                                        lazyOneTime: true
                                    },
                                    required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                        ]
                }
            ]
    }

}

export const productGroupsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/product_groups/',
        // title: 'Product Groups',

        pkId: "product_group_id",
        pageSize: 10,
        hideFilters: true, // Hide all filters for this table
        "globalSearch": {
            keys: ['group_name', 'description']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'group_name',
                name: 'Name',
                sort: true
            },
            // {
            //     fieldKey: 'description',
            //     name: 'Description',
            //     sort: true
            // },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [
                    {
                        type: 'delete',
                        label: 'Delete',
                        confirm: true,
                        confirmMsg: "Sure to delete?",
                        apiUrl: 'products/product_groups'
                    },
                    {
                      type: 'restore',
                      label: 'Restore',
                      confirm: true,
                      confirmMsg: "Sure to restore?",
                      apiUrl: 'products/product_groups'
                    },
                    {
                        type: 'edit',
                        label: 'Edit'
                    }
                ]
            }
        ]
    },
    formConfig: {
        url: 'products/product_groups/',
        title: 'Product Groups',
        pkId: "product_group_id",
        exParams: [],
        fields:
            [
                {
                    fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                    fieldGroup:
                        [
                            {
                                key: 'group_name',
                                type: 'text',
                                className: 'col-md-6 col-12 px-1 pb-md-0 pb-3',
                                templateOptions: {
                                    label: 'Group Name',
                                    required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'description',
                                type: 'textarea',
                                className: 'col-md-6 col-12 px-1',
                                templateOptions: {
                                    label: 'Description',
                                    required: false
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                        ]
                }
            ]
    }
}

export const productStockUnitsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    // drawerSize: '500',
    // drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/product_stock_units/',
        //   title: 'Product Stock Units',

        pkId: "stock_unit_id",
        pageSize: 10,
        hideFilters: true, // Hide all filters for this table
        "globalSearch": {
            keys: ['stock_unit_name', 'quantity_code_id', 'description']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'stock_unit_name',
                name: 'Name',
                sort: true
            },
            {
                fieldKey: 'quantity_code_id',
                name: 'Quantity Code',
                sort: true,
                displayType: "map",
                mapFn: (currentValue: any, row: any, col: any) => {
                    return `${row.quantity_code.quantity_code_name}`;
                },
            },
            // {
            //     fieldKey: 'description',
            //     name: 'Description',
            //     sort: true
            // },

            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [
                    {
                        type: 'delete',
                        label: 'Delete',
                        confirm: true,
                        confirmMsg: "Sure to delete?",
                        apiUrl: 'products/product_stock_units'
                    },
                    {
                      type: 'restore',
                      label: 'Restore',
                      confirm: true,
                      confirmMsg: "Sure to restore?",
                      apiUrl: 'products/product_stock_units'
                    },
                    {
                        type: 'edit',
                        label: 'Edit'
                    }
                ]
            }
        ]
    },
    formConfig: {
        url: 'products/product_stock_units/',
        title: 'Product Stock Units',
        pkId: "stock_unit_id",
        exParams: [
            {
                key: 'quantity_code_id',
                type: 'script',
                value: 'data.quantity_code.quantity_code_id'
            },
        ],
        fields:
            [
                {
                    fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                    fieldGroup:
                        [
                            {
                                key: 'stock_unit_name',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Stock Unit Name',
                                    required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'quantity_code',
                                type: 'select',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Quantity Code',
                                    dataKey: 'quantity_code_id',
                                    dataLabel: "quantity_code_name",
                                    options: [],
                                    lazy: {
                                        url: 'masters/product_unique_quantity_codes/',
                                        lazyOneTime: true
                                    },
                                    // required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'description',
                                type: 'textarea',
                                className: 'col-md-6 col-12 px-1',
                                templateOptions: {
                                    label: 'Description',
                                    required: false
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                        ]
                }
            ]
    }
}

export const productCategoriesConfig: TaCurdConfig = {
     drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/product_categories/',
        // title: 'Product Categories',

        pkId: "category_id",
        pageSize: 10,
        hideFilters: true, // Hide all filters for this table
        "globalSearch": {
            keys: ['category_name', 'code']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'category_name',
                name: 'Name',
                sort: true
            },
            {
                fieldKey: 'code',
                name: 'Code',
                sort: true
            },

            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [
                    {
                        type: 'delete',
                        label: 'Delete',
                        confirm: true,
                        confirmMsg: "Sure to delete?",
                        apiUrl: 'products/product_categories'
                    },
                    {
                      type: 'restore',
                      label: 'Restore',
                      confirm: true,
                      confirmMsg: "Sure to restore?",
                      apiUrl: 'products/product_categories'
                    },
                    {
                        type: 'edit',
                        label: 'Edit'
                    }
                ]
            }
        ]
    },
    formConfig: {
        url: 'products/product_categories/',
        title: 'Product Categories',
        pkId: "category_id",
        exParams: [],
        fields:
            [
                {
                    fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                    fieldGroup:
                        [
                            {
                                key: 'category_name',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-md-0 pb-3',
                                templateOptions: {
                                    label: 'Category Name',
                                    required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'code',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1',
                                templateOptions: {
                                    label: 'Code',
                                    required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                        ]
                }
            ]
    }
}

export const productGstClassificationsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/product_gst_classifications/',
        //   title: 'Product GST Classifications',

        pkId: "gst_classification_id",
        pageSize: 10,
        hideFilters: true, // Hide all filters for this table
        "globalSearch": {
            keys: ['id', 'type', 'code', 'hsn_or_sac_code', 'hsn_description']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'type',
                name: 'Type',
                sort: true
            },
            {
                fieldKey: 'code',
                name: 'Code',
                sort: true,
            },
            {
                fieldKey: 'hsn_or_sac_code',
                name: 'hsn or sac Code',
                sort: true
            },
            {
                fieldKey: 'hsn_description',
                name: 'hsn Description',
                sort: true
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [
                    {
                        type: 'delete',
                        label: 'Delete',
                        confirm: true,
                        confirmMsg: "Sure to delete?",
                        apiUrl: 'products/product_gst_classifications'
                    },
                    {
                      type: 'restore',
                      label: 'Restore',
                      confirm: true,
                      confirmMsg: "Sure to restore?",
                      apiUrl: 'products/product_gst_classifications'
                    },
                    {
                        type: 'edit',
                        label: 'Edit'
                    }
                ]
            }
        ]
    },
    formConfig: {
        url: 'products/product_gst_classifications/',
        title: 'Product GST Classifications',
        pkId: "gst_classification_id",
        exParams: [],
        fields:
            [
                {
                    fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                    fieldGroup:
                        [
                            {
                                key: 'type',
                                type: 'select',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Type',
                                    required: true,
                                    options: [
                                        { value: 'HSN', label: 'HSN' },
                                        { value: 'SAC', label: 'SAC' },
                                        { value: 'Both', label: 'Both' }
                                    ]
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'code',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-3',
                                templateOptions: {
                                    label: 'Code',
                                    required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'hsn_or_sac_code',
                                type: 'input',
                                className: 'col-md-6 col-12 px-1 pb-md-0 pb-3',
                                templateOptions: {
                                    label: 'Hsn Or Sac Code',
                                    required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'hsn_description',
                                type: 'textarea',
                                className: 'col-md-6 col-12 px-1',
                                templateOptions: {
                                    label: 'Hsn Description',
                                    required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                        ]
                }
            ]
    }
}

export const productItemTypeConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'masters/product_item_type/',
        //   title: 'Product Item Type',

        pkId: "item_type_id",
        pageSize: 10,
        hideFilters: true, // Hide all filters for this table
        "globalSearch": {
            keys: ['item_type_id', 'item_name']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'item_name',
                name: 'Name',
                sort: true
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [
                    {
                        type: 'delete',
                        label: 'Delete',
                        confirm: true,
                        confirmMsg: "Sure to delete?",
                        apiUrl: 'masters/product_item_type'
                    },
                    {
                      type: 'restore',
                      label: 'Restore',
                      confirm: true,
                      confirmMsg: "Sure to restore?",
                      apiUrl: 'masters/product_item_type'
                    },
                    {
                        type: 'edit',
                        label: 'Edit'
                    },
                    // {
                    //   type: 'callBackFn',
                    //   label: 'Edit',
                    //   // callBackFn: (row, action) => {
                    //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
                    //   // }
                    // }
                ]
            }
        ]
    },
    formConfig: {
        url: 'masters/product_item_type/',
        title: 'Product Item Type',
        pkId: "item_type_id",
        exParams: [
        ],
        fields:
            [
                {
                    fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                    fieldGroup:
                        [
                            {
                                key: 'item_name',
                                type: 'text',
                                className: 'col-md-6 col-12 p-0',
                                templateOptions: {
                                    label: 'Item Name',
                                    placeholder: 'Enter Item Name',
                                    required: true,
                                }
                            },
                        ]
                }
            ]
    }

}

export const productPurchaseGLConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/product_purchase_gl/',
        //   title: 'Product Purchase GL',

        pkId: "purchase_gl_id",
        pageSize: 10,
        hideFilters: true, // Hide all filters for this table
        "globalSearch": {
            keys: ['name', 'purchase_accounts', 'code', 'inactive', 'type', 'account_no', 'is_loan_account', 'address', 'employee', 'pan']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'name',
                name: 'Name',
                sort: true
            },
            // {
            //     fieldKey: 'purchase_accounts',
            //     name: 'Purchase Accounts',
            //     sort: true,
            // },
            // {
            //     fieldKey: 'code',
            //     name: 'Code',
            //     sort: true,
            // },
            // {
            //   fieldKey: 'is_subledger',
            //   name: 'Is Subledger',
            //   sort: false,
            //   type: 'boolean'
            // },
            // {
            //     fieldKey: 'inactive',
            //     name: 'Inactive',
            //     sort: true,
            //     type: 'boolean'
            // },
            // {
            //     fieldKey: 'type',
            //     name: 'Type',
            //     sort: true
            // },
            // {
            //     fieldKey: 'account_no',
            //     name: 'Account No',
            //     sort: true,
            //     isEncrypted: true
            // },
            // {
            //   fieldKey: 'rtgs_ifsc_code', 
            //   name: 'RTGS IFSC Code',
            //   sort: false
            // },
            // {
            //   fieldKey: 'classification', 
            //   name: 'Classification',
            //   sort: false
            // },
            // {
            //     fieldKey: 'is_loan_account',
            //     name: 'Is Loan Account',
            //     sort: true,
            //     type: 'boolean'
            // },
            // {
            //   fieldKey: 'tds_applicable', 
            //   name: 'TDS Applicable',
            //   sort: false,
            //   type: 'boolean'
            // },
            // {
            //     fieldKey: 'address',
            //     name: 'Address',
            //     sort: true
            // },
            // {
            //     fieldKey: 'employee',
            //     name: 'Employee',
            //     sort: true,
            //     type: 'boolean'
            // },
            // {
            //     fieldKey: 'pan',
            //     name: 'PAN',
            //     sort: true
            // },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [
                    {
                        type: 'delete',
                        label: 'Delete',
                        confirm: true,
                        confirmMsg: "Sure to delete?",
                        apiUrl: 'products/product_purchase_gl'
                    },
                    {
                      type: 'restore',
                      label: 'Restore',
                      confirm: true,
                      confirmMsg: "Sure to restore?",
                      apiUrl: 'products/product_purchase_gl'
                    },
                    {
                        type: 'edit',
                        label: 'Edit'
                    }
                ]
            }
        ]
    },
    formConfig: {
        url: 'products/product_purchase_gl/',
        title: 'Product Purchase GL',
        pkId: "purchase_gl_id",
        exParams: [],
        fields:
            [
                {
                    fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                    fieldGroup:
                        [
                            {
                                key: 'name',
                                type: 'input',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'Name',
                                    required: true
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'purchase_accounts',
                                type: 'input',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'Purchase Accounts',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'code',
                                type: 'input',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'Code',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'type',
                                type: 'input',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'Type',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'inactive',
                                type: 'checkbox',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'Inactive'
                                }
                            },
                            {
                                key: 'is_subledger',
                                type: 'checkbox',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'Is Subledger'
                                }
                            },
                            {
                                key: 'account_no',
                                type: 'input',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'Account No',
                                    type: 'password'
                                }
                            },
                            {
                                key: 'rtgs_ifsc_code',
                                type: 'input',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'RTGS IFSC Code',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'tds_applicable',
                                type: 'checkbox',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'TDS Applicable'
                                }
                            },
                            {
                                key: 'is_loan_account',
                                type: 'checkbox',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'Is Loan Account'
                                }
                            },
                            {
                                key: 'classification',
                                type: 'input',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'Classification',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'pan',
                                type: 'input',
                                className: 'col-md-6 col-12 pb-3 px-1',
                                templateOptions: {
                                    label: 'PAN',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                            {
                                key: 'employee',
                                type: 'checkbox',
                                className: 'col-md-6 col-12 pb-3 pb-md-0 px-1',
                                templateOptions: {
                                    label: 'Employee'
                                }
                            },
                            {
                                key: 'address',
                                type: 'textarea',
                                className: 'col-md-6 col-12  px-1',
                                templateOptions: {
                                    label: 'Address',
                                },
                                hooks: {
                                    onInit: (field: any) => {
                                        //field.templateOptions.options = this.cs.getRole();
                                    }
                                }
                            },
                        ]
                }
            ]
    }
}


export const unitOptionsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'masters/unit_options/',
        // title: 'Unit Options',
        hideFilters: true,

        pkId: "unit_options_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['unit_options_id', 'unit_name']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'unit_name',
                name: 'Name',
                sort: true
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [
                    {
                        type: 'delete',
                        label: 'Delete',
                        confirm: true,
                        confirmMsg: "Sure to delete?",
                        apiUrl: 'masters/unit_options'
                    },
                    {
                      type: 'restore',
                      label: 'Restore',
                      confirm: true,
                      confirmMsg: "Sure to restore?",
                      apiUrl: 'masters/unit_options'
                    },
                    {
                        type: 'edit',
                        label: 'Edit'
                    },
                    // {
                    //   type: 'callBackFn',
                    //   label: 'Edit',
                    //   // callBackFn: (row, action) => {
                    //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
                    //   // }
                    // }
                ]
            }
        ]
    },
    formConfig: {
        url: 'masters/unit_options/',
        title: 'Unit Options',
        pkId: "unit_options_id",
        exParams: [
        ],
        fields:
            [
                {
                    fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                    fieldGroup:
                        [
                            {
                                key: 'unit_name',
                                type: 'text',
                                className: 'col-md-6 col-12 p-0',
                                templateOptions: {
                                    label: 'Unit Name',
                                    placeholder: 'Enter Unit Name',
                                    required: true,
                                }
                            },
                        ]
                }
            ]
    }

}
export const productSizesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/sizes/',
        //   title: 'Size',
        pkId: "size_id",
        pageSize: 10,
        hideFilters: true, // Hide all filters for this table
        "globalSearch": {
            keys: ['size_id', 'size_name', 'size_category', 'size_system', 'length', 'height', 'width', 'size_unit', 'description']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'size_name',
                name: 'Size Name',
                sort: true
            },
            {
                fieldKey: 'size_category',
                name: 'Size Category',
                sort: true
            },
            // {
            //     fieldKey: 'size_system',
            //     name: 'Size System',
            //     sort: true
            // },
            // {
            //     fieldKey: 'length',
            //     name: 'Length',
            //     sort: true
            // },
            // {
            //     fieldKey: 'height',
            //     name: 'Height',
            //     sort: true
            // },
            // {
            //     fieldKey: 'width',
            //     name: 'Width',
            //     sort: true
            // },
            // {
            //     fieldKey: 'size_unit',
            //     name: 'Size Unit',
            //     sort: true
            // },
            // {
            //     fieldKey: 'description',
            //     name: 'Description',
            //     sort: true
            // },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [{
                    type: 'delete',
                    label: 'Delete',
                    confirm: true,
                    confirmMsg: "Sure to delete?",
                    apiUrl: 'products/sizes'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'products/sizes'
                },
                {
                    type: 'edit',
                    label: 'Edit'
                }
                ]
            }
        ]
    },
    formConfig: {
        url: 'products/sizes/',
        title: 'Sizes',
        pkId: "size_id",
        exParams: [],
        fields: [{
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [
                {
                    key: 'size_name',
                    type: 'input',
                    className: 'col-md-6 col-12 pb-3 px-1',
                    templateOptions: {
                        label: 'Size Name',
                        placeholder: 'Enter Size Name',
                        required: true,
                    }
                },
                {
                    key: 'size_category',
                    type: 'input',
                    className: 'col-md-6 col-12 pb-3 px-1',
                    templateOptions: {
                        label: 'Size Category',
                        placeholder: 'Enter Size Category',
                        required: true,
                    }
                },
                {
                    key: 'size_system',
                    type: 'input',
                    className: 'col-md-6 col-12 pb-3 px-1',
                    templateOptions: {
                        label: 'Size System',
                        placeholder: 'Enter Size System',
                        required: false,
                    }
                },
                {
                    key: 'length',
                    type: 'input',
                    className: 'col-md-6 col-12 pb-3 px-1',
                    templateOptions: {
                        label: 'Length',
                        placeholder: 'Enter Length',
                        required: false,
                    }
                },
                {
                    key: 'height',
                    type: 'input',
                    className: 'col-md-6 col-12 pb-3 px-1',
                    templateOptions: {
                        label: 'Height',
                        placeholder: 'Enter Height',
                        required: false,
                    }
                },
                {
                    key: 'width',
                    type: 'input',
                    className: 'col-md-6 col-12 pb-3 px-1',
                    templateOptions: {
                        label: 'Width',
                        placeholder: 'Enter Width',
                        required: false,
                    }
                },
                {
                    key: 'size_unit',
                    type: 'input',
                    className: 'col-md-6 col-12 mb-md-0 mb-3 px-1',
                    templateOptions: {
                        label: 'Designation Size Unit',
                        placeholder: 'Enter Size Unit',
                        required: false,
                    }
                },
                {
                    key: 'description',
                    type: 'input',
                    className: 'col-md-6 col-12 px-1',
                    templateOptions: {
                        label: 'Description',
                        placeholder: 'Enter Description',
                        required: false,
                    }
                }
            ]
        }]
    }
}

export const productColorsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/colors/',
        // title: 'Color',
        pkId: "color_id",
        pageSize: 10,
        hideFilters: true, // Hide all filters for this table
        "globalSearch": {
            keys: ['color_id', 'color_name']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'color_name',
                name: 'Color Name',
                sort: true
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [{
                    type: 'delete',
                    label: 'Delete',
                    confirm: true,
                    confirmMsg: "Sure to delete?",
                    apiUrl: 'products/colors'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'products/colors'
                },
                {
                    type: 'edit',
                    label: 'Edit'
                }
                ]
            }
        ]
    },
    formConfig: {
        url: 'products/colors/',
        title: 'Color',
        pkId: "color_id",
        exParams: [],
        fields: [{
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [
                {
                    key: 'color_name',
                    type: 'input',
                    className: 'col-md-6 col-12 p-0',
                    templateOptions: {
                        label: 'Color Name',
                        placeholder: 'Enter Color Name',
                        required: true,
                    }
                }
            ]
        }]
    }
}

export const warehouseLocationsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'inventory/warehouse_locations/',
        // title: 'Warehouse Locations',
        pkId: "location_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['location_id', 'location_name', 'description', 'warehouse']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'location_name',
                name: 'Location Name',
                sort: true
            },
            // {
            //     fieldKey: 'description',
            //     name: 'Description',
            //     sort: true
            // },
            {
                fieldKey: 'warehouse',
                name: 'Ware house',
                sort: true,
                displayType: "map",
                mapFn: (currentValue: any, row: any, col: any) => {
                    return `${row.warehouse.name}`;
                },
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [{
                    type: 'delete',
                    label: 'Delete',
                    confirm: true,
                    confirmMsg: "Sure to delete?",
                    apiUrl: 'inventory/warehouse_locations'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'inventory/warehouse_locations'
                },
                {
                    type: 'edit',
                    label: 'Edit'
                }
                ]
            }
        ]
    },
    formConfig: {
        url: 'inventory/warehouse_locations/',
        title: 'Warehouse Locations',
        pkId: "location_id",
        exParams: [
            {
                key: 'warehouse_id',
                type: 'script',
                value: 'data.warehouse.warehouse_id'
            },
        ],
        fields: [{
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [
                {
                    key: 'location_name',
                    type: 'input',
                    className: 'col-md-6 col-12 px-1 mb-3',
                    templateOptions: {
                        label: 'Location Name',
                        placeholder: 'Enter Location Name',
                        required: true,
                    }
                },
                {
                    key: 'description',
                    type: 'input',
                    className: 'col-md-6 col-12 px-1 mb-3',
                    templateOptions: {
                        label: 'Description',
                        placeholder: 'Enter Location Description',
                        required: false,
                    }
                },
                {
                    key: 'warehouse',
                    type: 'select',
                    className: 'col-md-6 col-12 px-1',
                    templateOptions: {
                        label: 'Warehouse',
                        dataKey: 'warehouse_id',
                        dataLabel: "name",
                        options: [],
                        lazy: {
                            url: 'inventory/warehouses/',
                            lazyOneTime: true
                        },
                        required: true
                    },
                    hooks: {
                        onInit: (field: any) => {
                            //field.templateOptions.options = this.cs.getRole();
                        }
                    }
                },
            ]
        }]
    }
}

export const packUnitConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'masters/package_units/',
        // title: 'Pack Unit',
        pkId: "pack_unit_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['pack_unit_id', 'unit_name']
        },
        defaultSort: { key: 'unit_name', value: 'descend' },
        cols: [
            {
                fieldKey: 'unit_name',
                name: 'Unit Name',
                sort: true
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [{
                    type: 'delete',
                    label: 'Delete',
                    confirm: true,
                    confirmMsg: "Sure to delete?",
                    apiUrl: 'masters/package_units'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'masters/package_units'
                },
                {
                    type: 'edit',
                    label: 'Edit'
                }
                ]
            }
        ]
    },
    formConfig: {
        url: 'masters/package_units/',
        title: 'Pack Unit',
        pkId: "pack_unit_id",
        exParams: [],
        fields: [{
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [
                {
                    key: 'unit_name',
                    type: 'input',
                    className: 'col-md-6 col-12 p-0',
                    templateOptions: {
                        label: 'Unit Name',
                        placeholder: 'Enter Unit Name',
                        required: true,
                    }
                }
            ]
        }]
    }
}

export const gPackageUnitsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'masters/g_package_units/',
        // title: 'GPack Unit',
        pkId: "g_pack_unit_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['g_pack_unit_id', 'unit_name']
        },
        defaultSort: { key: 'unit_name', value: 'descend' },
        cols: [
            {
                fieldKey: 'unit_name',
                name: 'Unit Name',
                sort: true
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [{
                    type: 'delete',
                    label: 'Delete',
                    confirm: true,
                    confirmMsg: "Sure to delete?",
                    apiUrl: 'masters/g_package_units'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'masters/g_package_units'
                },
                {
                    type: 'edit',
                    label: 'Edit'
                }
                ]
            }
        ]
    },
    formConfig: {
        url: 'masters/g_package_units/',
        title: 'GPack Unit',
        pkId: "g_pack_unit_id",
        exParams: [],
        fields: [{
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [
                {
                    key: 'unit_name',
                    type: 'input',
                    className: 'col-md-6 col-12 p-0',
                    templateOptions: {
                        label: 'Unit Name',
                        placeholder: 'Enter Unit Name',
                        required: true,
                    }
                }
            ]
        }]
    }
}

export const jobTypesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'hrms/job_types/',
        //   title: 'Job Types',
        pkId: "job_type_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['job_type_id', 'job_type_name']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [{
            fieldKey: 'job_type_name',
            name: 'Job Type Name',
            sort: true
        },
        {
            fieldKey: "code",
            name: "Action",
            type: 'action',
            actions: [{
                type: 'delete',
                label: 'Delete',
                confirm: true,
                confirmMsg: "Sure to delete?",
                apiUrl: 'hrms/job_types'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'hrms/job_types'
            },
            {
                type: 'edit',
                label: 'Edit'
            }
            ]
        }
        ]
    },
    formConfig: {
        url: 'hrms/job_types/',
        title: 'Job Types',
        pkId: "job_type_id",
        exParams: [],
        fields: [{
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [{
                key: 'job_type_name',
                type: 'input',
                className: 'col-md-6 col-12 p-0',
                templateOptions: {
                    label: 'Job Type Name',
                    placeholder: 'Enter Job Type Name',
                    required: true,
                }
            },]
        }]
    }
}

export const designationsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'hrms/designations/',
        //   title: 'Designation',
        pkId: "designation_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['designation_id', 'designation_name', 'responsibilities']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'designation_name',
                name: 'Designation Name',
                sort: true
            },
            // {
            //     fieldKey: 'responsibilities',
            //     name: 'Responsibilities',
            //     sort: true
            // },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [{
                    type: 'delete',
                    label: 'Delete',
                    confirm: true,
                    confirmMsg: "Sure to delete?",
                    apiUrl: 'hrms/designations'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'hrms/designations'
                },
                {
                    type: 'edit',
                    label: 'Edit'
                }
                ]
            }
        ]
    },
    formConfig: {
        url: 'hrms/designations/',
        title: 'Designation',
        pkId: "designation_id",
        exParams: [],
        fields: [
            {
                fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                fieldGroup: [
                    {
                        key: 'designation_name',
                        type: 'input',
                        className: 'col-md-6 col-12 mb-3 mb-md-0 px-1',
                        templateOptions: {
                            label: 'Designation Name',
                            placeholder: 'Enter Designation Name',
                            required: true,
                        }
                    },
                    {
                        key: 'responsibilities',
                        type: 'input',
                        className: 'col-md-6 col-12  px-1',
                        templateOptions: {
                            label: 'Responsibilities',
                            placeholder: 'Enter Responsibilities',
                            required: true,
                        }
                    },
                ]
            }
        ]
    }
}

export const jobCodesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'hrms/job_codes/',
        // title: 'Job Codes',
        pkId: "job_code_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['job_code_id', 'job_code']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [{
            fieldKey: 'job_code',
            name: 'Job Code',
            sort: true
        },
        {
            fieldKey: "code",
            name: "Action",
            type: 'action',
            actions: [{
                type: 'delete',
                label: 'Delete',
                confirm: true,
                confirmMsg: "Sure to delete?",
                apiUrl: 'hrms/job_codes'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'hrms/job_codes'
            },
            {
                type: 'edit',
                label: 'Edit'
            }
            ]
        }
        ]
    },
    formConfig: {
        url: 'hrms/job_codes/',
        title: 'Job Codes',
        pkId: "job_code_id",
        exParams: [],
        fields: [{
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [{
                key: 'job_code',
                type: 'input',
                className: 'col-md-6 col-12 p-0',
                templateOptions: {
                    label: 'Job Code',
                    placeholder: 'Enter Job Code',
                    required: true,
                }
            },]
        }]
    }
}


export const departmentsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'hrms/departments/',
        //   title: 'Departments',
        pkId: "department_id",
        pageSize: 10,
        hideFilters: true,
        "globalSearch": {
            keys: ['department_id', 'department_name', 'designation_name']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'department_name',
                name: 'Department Name',
                sort: true
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [{
                    type: 'delete',
                    label: 'Delete',
                    confirm: true,
                    confirmMsg: "Sure to delete?",
                    apiUrl: 'hrms/departments'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'hrms/departments'
                },
                {
                    type: 'edit',
                    label: 'Edit'
                }
                ]
            }
        ]
    },
    formConfig: {
        url: 'hrms/departments/',
        title: 'Department',
        pkId: "department_id",
        exParams: [],
        fields: [{
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [{
                key: 'department_name',
                type: 'input',
                className: 'col-md-6 col-12 p-0',
                templateOptions: {
                    label: 'Department Name',
                    placeholder: 'Enter Department Name',
                    required: true,
                }
            },]
        }]
    }
}

export const shiftsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'hrms/shifts/',
        // title: 'Shifts',
        pkId: "shift_id",
        pageSize: 10,
        hideFilters: true,
        "globalSearch": {
            keys: ['shift_id', 'shift_name', 'start_time', 'end_time']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'shift_name',
                name: 'Shift Name',
                sort: true
            },
            {
                fieldKey: 'start_time',
                name: 'Start Time',
                sort: true
            },
            {
                fieldKey: 'end_time',
                name: 'End Time',
                sort: true
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [{
                    type: 'delete',
                    label: 'Delete',
                    confirm: true,
                    confirmMsg: "Sure to delete?",
                    apiUrl: 'hrms/shifts'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'hrms/shifts'
                },
                {
                    type: 'edit',
                    label: 'Edit'
                }
                ]
            }
        ]
    },
    formConfig: {
        url: 'hrms/shifts/',
        title: 'Shifts',
        pkId: "shift_id",
        exParams: [],
        fields: [
            {
                fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                fieldGroup: [
                    {
                        key: 'shift_name',
                        type: 'input',
                        className: 'col-md-6 col-12 px-1 mb-3',
                        templateOptions: {
                            label: 'Shift Name',
                            placeholder: 'Enter Shift Name',
                            required: true,
                        }
                    },
                    {
                        key: 'start_time',
                        type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
                        className: 'col-md-6 col-12 px-1 mb-3',
                        templateOptions: {
                            label: 'Start Time',
                            type: 'datetime-local',  // Use datetime-local for both date and time input
                            placeholder: 'Select Date and Time',
                            required: true,
                        }
                    },
                    {
                        key: 'end_time',
                        type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
                        className: 'col-md-6 col-12 px-1',
                        templateOptions: {
                            label: 'End Time',
                            type: 'datetime-local',  // Use datetime-local for both date and time input
                            placeholder: 'Select Date and Time',
                            required: true,
                        }
                    },
                ]
            }
        ]
    }
}


export const salaryComponentsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'hrms/salary_components/',
        //   title: 'Salary Components',
        pkId: "component_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['component_id', 'component_name']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [{
            fieldKey: 'component_name',
            name: 'Component Name',
            sort: true
        },
        {
            fieldKey: "code",
            name: "Action",
            type: 'action',
            actions: [{
                type: 'delete',
                label: 'Delete',
                confirm: true,
                confirmMsg: "Sure to delete?",
                apiUrl: 'hrms/salary_components'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'hrms/salary_components'
            },
            {
                type: 'edit',
                label: 'Edit'
            }
            ]
        }
        ]
    },
    formConfig: {
        url: 'hrms/salary_components/',
        title: 'Salary Components',
        pkId: "component_id",
        exParams: [],
        fields: [{
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [{
                key: 'component_name',
                type: 'input',
                className: 'col-md-6 col-12 p-0',
                templateOptions: {
                    label: 'Component Name',
                    placeholder: 'Enter Component Name',
                    required: true,
                }
            },]
        }]
    }
}


export const employeeSalaryComponentsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'hrms/employee_salary_components/',
        // title: 'Employee Salary Components',
        pkId: "employee_component_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['employee_component_id', 'component_id', 'component_amount', 'salary_id']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'component_id',
                name: 'salary Component',
                sort: true,
                displayType: "map",
                mapFn: (currentValue: any, row: any, col: any) => {
                    return `${row.component.component_name}`;
                },
            },
            {
                fieldKey: 'component_amount',
                name: 'Component Amount',
                sort: true
            },
            {
                fieldKey: 'salary_id',
                name: 'Salary',
                sort: true,
                displayType: "map",
                mapFn: (currentValue: any, row: any, col: any) => {
                    return `${row.salary.salary_amount}`;
                },
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [{
                    type: 'delete',
                    label: 'Delete',
                    confirm: true,
                    confirmMsg: "Sure to delete?",
                    apiUrl: 'hrms/employee_salary_components'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'hrms/employee_salary_components'
                },
                {
                    type: 'edit',
                    label: 'Edit'
                }
                ]
            }
        ]
    },
    formConfig: {
        url: 'hrms/employee_salary_components/',
        title: 'Employee Salary Components',
        pkId: "employee_component_id",
        exParams: [
            {
                key: 'component_id',
                type: 'script',
                value: 'data.component.component_id'
            },
            {
                key: 'salary_id',
                type: 'script',
                value: 'data.salary.salary_id'
            }
        ],
        fields: [{
            fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
            fieldGroup: [
                {
                    key: 'component',
                    type: 'salaryComponent-dropdown',
                    className: 'col-md-6 col-12 px-1 mb-3',
                    templateOptions: {
                        label: 'Component',
                        dataKey: 'component_id',
                        dataLabel: "component_name",
                        options: [],
                        lazy: {
                            url: 'hrms/salary_components/',
                            lazyOneTime: true
                        },
                        required: true
                    },
                    hooks: {
                        onInit: (field: any) => {
                            //field.templateOptions.options = this.cs.getRole();
                        }
                    }
                },
                {
                    key: 'component_amount',
                    type: 'input',
                    className: 'col-md-6 col-12 px-1 mb-3',
                    templateOptions: {
                        label: 'Component Amount',
                        placeholder: 'Enter Component Amount',
                        type: 'number',
                    }
                },
                {
                    key: 'salary',
                    type: 'select',
                    className: 'col-md-6 col-12 px-1',
                    templateOptions: {
                        label: 'Salary',
                        dataKey: 'salary_id',
                        dataLabel: "salary_amount",
                        options: [],
                        lazy: {
                            url: 'hrms/employee_salary/',
                            lazyOneTime: true
                        },
                        required: true
                    },
                    hooks: {
                        onInit: (field: any) => {
                            //field.templateOptions.options = this.cs.getRole();
                        }
                    }
                }
            ]
        }]
    }
}

export const leaveTypesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'hrms/leave_types/',
        //   title: 'Leave Types',
        pkId: "leave_type_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['leave_type_id', 'leave_type_name', 'description', 'max_days_allowed']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [
            {
                fieldKey: 'leave_type_name',
                name: 'Leave Type Name',
                sort: true
            },
            {
                fieldKey: 'description',
                name: 'Description',
                sort: true
            },
            {
                fieldKey: 'max_days_allowed',
                name: 'Max Days Allowed',
                sort: true
            },
            {
                fieldKey: "code",
                name: "Action",
                type: 'action',
                actions: [{
                    type: 'delete',
                    label: 'Delete',
                    confirm: true,
                    confirmMsg: "Sure to delete?",
                    apiUrl: 'hrms/leave_types'
                },
                {
                  type: 'restore',
                  label: 'Restore',
                  confirm: true,
                  confirmMsg: "Sure to restore?",
                  apiUrl: 'hrms/leave_types'
                },
                {
                    type: 'edit',
                    label: 'Edit'
                }
                ]
            }
        ]
    },
    formConfig: {
        url: 'hrms/leave_types/',
        title: 'Leave Types',
        pkId: "leave_type_id",
        exParams: [],
        fields: [
            {
                fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                fieldGroup: [
                    {
                        key: 'leave_type_name',
                        type: 'input',
                        className: 'col-md-6 col-12 px-1 mb-3',
                        templateOptions: {
                            label: 'Leave Type Name',
                            placeholder: 'Enter Leave Type Name',
                            required: true,
                        }
                    },
                    {
                        key: 'description',
                        type: 'input',
                        className: 'col-md-6 col-12 px-1 mb-3',
                        templateOptions: {
                            label: 'Description',
                            placeholder: 'Enter Description',
                            required: true,
                        }
                    },
                    {
                        key: 'max_days_allowed',
                        type: 'input',
                        className: 'col-md-6 col-12 px-1 ',
                        templateOptions: {
                            label: 'Max Days Allowed',
                            placeholder: 'Enter Max Days Allowed',
                            required: true,
                        }
                    },
                ]
            }
        ]
    }
}


export const leadStatusesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'leads/lead_statuses/',
        // title: 'Lead statuses',
        pkId: "lead_status_id",
        hideFilters: true,
        pageSize: 10,
        "globalSearch": {
            keys: ['lead_status_id', 'status_name']
        },
        // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
        cols: [{
            fieldKey: 'status_name',
            name: 'Status Name',
            sort: true
        },
        {
            fieldKey: "code",
            name: "Action",
            type: 'action',
            actions: [{
                type: 'delete',
                label: 'Delete',
                confirm: true,
                confirmMsg: "Sure to delete?",
                apiUrl: 'leads/lead_statuses'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'leads/lead_statuses'
            },
            {
                type: 'edit',
                label: 'Edit'
            }
            ]
        }
        ]
    },
    formConfig: {
        url: 'leads/lead_statuses/',
        title: 'Lead status',
        pkId: "lead_status_id",
        exParams: [],
        fields: [
            {
                fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                fieldGroup: [
                    {
                        key: 'status_name',
                        type: 'input',
                        className: 'col-md-6 col-12 px-0',
                        templateOptions: {
                            label: 'Status Name',
                            placeholder: 'Enter Status Name',
                            required: true,
                        }
                    },
                ]
            }
        ]
    }
}

export const interactionTypesConfig: TaCurdConfig = {
drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'leads/interaction_types/',
    //   title: 'Interaction type',
      pkId: "interaction_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['interaction_type_id','interaction_type']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'interaction_type',
          name: 'Interaction type',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'leads/interaction_types'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'leads/interaction_types'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'leads/interaction_types/',
      title: 'Interaction type',
      pkId: "interaction_type_id",
      exParams: [],
      fields: [{
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [{
          key: 'interaction_type',
          type: 'input',
          className: 'col-md-6 col-12 p-0',
          templateOptions: {
            label: 'Interaction type',
            placeholder: 'Enter Interaction type',
            required: true,
          }
        }]
      }]
    }
  }

export const taskPrioritiesConfig: TaCurdConfig = {  
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/task_priorities/',
      // title: 'Task Priorities',
      pkId: "priority_id",
      hideFilters: true,
      pageSize: 10,
      "globalSearch": {
        keys: ['priority_id', 'priority_name']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'priority_name',
          name: 'Priority Name',
          sort: true
        },
		{
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/task_priorities'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/task_priorities'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/task_priorities/',
      title: 'Task Priorities',
      pkId: "priority_id",
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'priority_name',
              type: 'input',
              className: 'col-md-6 col-12 p-0',
              templateOptions: {
                label: 'Priority Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }

 const baseUrl = 'https://apicore.cnlerp.com/api/v1/';
// const baseUrl = 'http://127.0.0.1:8000/api/v1/';

export const AssetCategoriesConfig:  TaCurdConfig = {
    // baseUrl: string = 'http://127.0.0.1:8000/api/v1/';
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: baseUrl + 'assets/asset_categories/',
      // title: 'Asset Categories',
      pkId: "asset_category_id",
      pageSize: 10,
      "globalSearch": {keys: ['asset_category_id', 'category_name']},
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      hideFilters: true,
      cols: [
        {
          fieldKey: 'category_name',
          name: 'Category Name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: baseUrl + 'assets/asset_categories'
            },
            {
              type: 'restore',
              label: 'Restore',
              apiUrl: baseUrl + 'assets/asset_categories',
              confirm: true,
              confirmMsg: "Sure to restore?",
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: baseUrl + 'assets/asset_categories/',
      title: 'Asset Categories',
      pkId: "asset_category_id",
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'category_name',
              type: 'input',
              className: 'col-md-6 col-12 p-0',
              templateOptions: {
                label: 'Category Name',
                placeholder: 'Enter Category Name',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }

export const productionFloorsConfig: TaCurdConfig = {
  
     drawerSize: 500,
      drawerPlacement: 'top',
      tableConfig: {
        apiUrl: 'masters/production_floors/',
        // title: 'Production Floors',
        pkId: "production_floor_id",
        pageSize: 10,
        hideFilters: true,
        globalSearch: {
          keys: ['production_floor_id', 'code', 'name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'code',
            name: 'Code',
            sort: true
          },
          {
            fieldKey: 'name',
            name: 'Floor Name',
            sort: true
          },
          // {
          //   fieldKey: 'description',
          //   name: 'Description',
          //   sort: false
          // },
          // {
          //   fieldKey: 'created_at',
          //   name: 'Created At',
          //   type: 'date',
          //   sort: true
          // },
          {
            fieldKey: 'production_floor_id',
            name: 'Action',
            type: 'action',
            actions: [
              {
                type: 'delete',
                label: 'Delete',
                confirm: true,
                confirmMsg: "Sure to delete this Production Floor?",
                apiUrl: 'masters/production_floors'
              },
              {
                type: 'edit',
                label: 'Edit'
              }
            ]
          }
        ]
      },
      formConfig: {
        url: 'masters/production_floors/',
        title: 'Production Floor',
        pkId: "production_floor_id",
        fields: [
          {
            className: 'col-12 p-0',
            fieldGroupClassName: "ant-row",
            fieldGroup: [
              {
                key: 'code',
                type: 'input',
                className: 'col-md-6 col-12 pb-3 px-1',
                templateOptions: {
                  label: 'Code',
                  placeholder: 'Enter Floor Code',
                  required: true,
                }
              },
              {
                key: 'name',
                type: 'input',
                className: 'col-md-6 col-12 pb-3 px-1',
                templateOptions: {
                  label: 'Name',
                  placeholder: 'Enter Floor Name',
                  required: true,
                }
              },
              {
                key: 'description',
                type: 'textarea',
                className: 'col-md-6 col-12 pb-3 px-1',
                templateOptions: {
                  label: 'Description',
                  placeholder: 'Enter Description (optional)'
                }
              },
              // {
              //   key: 'is_deleted',
              //   type: 'checkbox',
              //   className: 'col-md-6 col-12 pb-3 px-1',
              //   templateOptions: {
              //     label: 'Is Deleted'
              //   }
              // }
            ]
          }
        ]
      }
    };



export const AssetStatusConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: baseUrl + 'assets/asset_statuses/',
      // title: 'Asset Statuses',
      pkId: "asset_status_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['asset_status_id', 'status_name']
      },
      hideFilters: true,
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'status_name',
          name: 'Status Name',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: baseUrl + 'assets/asset_statuses'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: baseUrl + 'assets/asset_statuses'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: baseUrl + 'assets/asset_statuses/',
      title: 'Asset Statuses',
      pkId: "asset_status_id",
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'status_name',
              type: 'input',
              className: 'col-md-6 col-12 p-0',
              templateOptions: {
                label: 'Status Name',
                placeholder: 'Enter Status Name',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }

export const LocationsAssetConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: baseUrl + 'assets/locations/',
      // title: 'Locations',
      pkId: "location_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['location_id', 'location_name']
      },
      hideFilters: true,
      // defaultSort: { key: 'created_at', value: 'descend' },
              defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'location_name',
          name: 'Location Name',
          sort: true
        },
        {
          fieldKey: 'address', 
          name: 'Address',
          sort: false
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: baseUrl + 'assets/locations'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: baseUrl + 'assets/locations'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: baseUrl + 'assets/locations/',
      title: 'Locations',
      pkId: "location_id",
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'location_name',
              type: 'input',
              className: 'col-md-6 col-12 px-1 mb-md-0 mb-3',
              templateOptions: {
                label: 'Location Name',
                placeholder: 'Enter Location Name',
                required: true,
              }
            },
            {
              key: 'address',
              type: 'textarea',
              className: 'col-md-6 col-12 px-1',
              templateOptions: {
                label: 'Address',
                placeholder: 'Enter Address',
                required: false,
              },
            },
          ]
        }
      ]
    }
  }

export const productsCrudConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'products/products/?summary=true',
      showCheckbox: false,
      // title: 'Products',
      pkId: "product_id",
      hideFilters: true,
      fixedFilters: [
        {
          key: 'summary',
          value: 'true'
        }
      ],
      pageSize: 10,
      globalSearch: {
        keys: ['created_at', 'name', 'code', 'unit_options', 'balance', 'sales_rate', 'mrp', 'dis_amount', 'print_name', 'hsn_code', 'barcode']
      },
      export: { downloadName: 'ProductsList' },
      // defaultSort: { key: 'code', value: 'descend' },
      defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        // {
        //   fieldKey: 'code',
        //   name: 'Code',
        //   sort: true
        // },
        // {
        //   fieldKey: 'type',
        //   name: 'Type',
        //   sort: true,
        //   displayType: 'map',
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return row?.type?.type_name || '';
        //   },
        // },
        // {
        //   fieldKey: 'product_group',
        //   name: 'Group',
        //   sort: true,
        //   displayType: 'map',
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return row?.product_group?.group_name || '';
        //   },
        // },
        // {
        //   fieldKey: 'stock_unit',
        //   name: 'Stock Unit',
        //   sort: true,
        //   displayType: 'map',
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return row?.stock_unit?.stock_unit_name || '';
        //   },
        // },
        // {
        //   fieldKey: 'sales_rate',
        //   name: 'Sales Rate',
        //   sort: true,
        //   isEdit: true,
        //   isEditSumbmit: (row, value, col) => {
        //     console.log("isEditSumbmit", row, value, col);
        //     // Implement your logic here
        //     // For example, you can make an API call to save the edited value
        //     // this.http.put(`api/sales/${row.sale_order_id}`, { total_amount: value }).subscribe(...);
        //   },
        //   autoSave: {
        //     apiUrl: row => `products/products/${row.product_id}`,
        //     method: 'patch',
        //     body: (row: any, value: any, col: any) => {
        //       console.log('PATCH value:', value); // Add this log
        //       return {
        //         [col.fieldKey]: value,
        //         product_id: row.product_id
        //       };
        //     }

        //   }
        // },
        // {
        //   fieldKey: 'wholesale_rate',
        //   name: 'WholeSale Rate',
        //   sort: true,
        //   isEdit: true,
        //   isEditSumbmit: (row, value, col) => {
        //     console.log("isEditSumbmit", row, value, col);
        //     // Implement your logic here
        //   },
        //   autoSave: {
        //     apiUrl: row => `products/products/${row.product_id}`,
        //     method: 'patch',
        //     body: (row: any, value: any, col: any) => {
        //       console.log('PATCH value:', value); // Add this log
        //       return {
        //         [col.fieldKey]: value,
        //         product_id: row.product_id
        //       };
        //     }
        //   }

        // },
        // {
        //   fieldKey: 'dealer_rate',
        //   name: 'Dealer Rate',
        //   sort: true,
        //   isEdit: true,
        //   isEditSumbmit: (row, value, col) => {
        //     console.log("isEditSumbmit", row, value, col);
        //     // Implement your logic here
        //   },
        //   autoSave: {
        //     apiUrl: row => `products/products/${row.product_id}`,
        //     method: 'patch',
        //     body: (row: any, value: any, col: any) => {
        //       console.log('PATCH value:', value); // Add this log
        //       return {
        //         [col.fieldKey]: value,
        //         product_id: row.product_id
        //       };
        //     }
        //   }
        // },
        // {
        //   fieldKey: 'discount',
        //   name: 'Disc(%)',
        //   sort: true
        // },
        {
          fieldKey: 'balance',
          name: 'Balance',
          sort: true,
          isEdit: true,
          isEditSumbmit: (row, value, col) => {
            console.log("isEditSumbmit", row, value, col);
            // Implement your logic here
          },
          autoSave: {
            apiUrl: row => `products/products/${row.product_id}`,
            method: 'patch',
            body: (row: any, value: any, col: any) => {
              console.log('PATCH value:', value); // Add this log
              return {
                [col.fieldKey]: value,
                product_id: row.product_id
              };
            }
          }
        },
        // {
        //   fieldKey: 'print_name',
        //   name: 'Print Name',
        //   sort: true
        // },
        // {
        //   fieldKey: 'hsn_code',
        //   name: 'HSN',
        //   sort: true
        // },
        // {
        //   fieldKey: 'barcode',
        //   name: 'Barcode',
        //   sort: true
        // },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'products/products'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'products/products'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
            // {
            //     fieldKey: 'ledger_account_id',
            //     name: 'Ledger Account',
            //     sort: true,
            //     displayType: 'map',
            //     mapFn: (currentValue: any, row: any, col: any) => {
            //         return row.ledger_account.name;
            //     },
            // },
            // {
            //     fieldKey: 'pin_code',
            //     name: 'Pin Code',
            //     sort: true,
            // }
        ]
    }, 
    formConfig: {
      // url: "products/products/",
      formState: {
        viewMode: false,
        // isEdit: false,
      },
      showActionBtn: true,
      exParams: [
        // {
        //   key: 'products',
        //   type: 'script',
        //   value: 'data.products.map(m=> {m.pack_unit_id = m.pack_unit.stock_unit_id;  return m ;})'
        // },
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => {}
      },
      reset: {
        resetFn: () => {
          // this.ngOnInit();
        }
      },
      model: {
        products: {},
        product_variations: [{}],
        product_item_balance: [{}]
      },
      fields: [
        {
          fieldGroup: [
            {
              className: 'col-12 custom-form-card-block p-0',
              key: 'products',
              fieldGroupClassName: 'row m-0 pr-0 responsive-row',
              fieldGroup: [
                {
                  className: 'col-sm-9 col-12 p-0',
                  fieldGroupClassName: 'row m-0 p-0',
                  fieldGroup: [
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'product_mode_id',
                      type: 'productModes-dropdown',
                      templateOptions: {
                        label: 'Product Mode',
                        placeholder: 'Select Product Mode',
                        required: true,
                        options: []
                      },
                      
                      hooks: {
                        onInit: (field: any) => {
                        //   // Load the dropdown data from the API
                        //   this.http.get('products/item-master/').subscribe((response: any) => {
                        //     if (response && response.data) {
                        //       const options = response.data.map((item: any) => ({
                        //         value: item.item_master_id,
                        //         label: item.mode_name
                        //       }));

                        //       // Update the field's options
                        //       field.templateOptions.options = options;

                        //       // If in edit mode, select the current value
                        //       if (this.ProductEditID && this.formConfig.model.products?.product_mode_id) {
                        //         const currentId = this.formConfig.model.products.product_mode_id;
                        //         const matchedOption = options.find((opt: any) => opt.value === currentId);
                        //         if (matchedOption) {
                        //           field.formControl.setValue(matchedOption.value);
                        //         }
                        //       }
                        //     }
                        //   });
                        // },
                        // onChanges: (field: any) => {
                        //   if (field._subscription) {
                        //     field._subscription.unsubscribe();
                        //   }

                        //   field._subscription = field.formControl.valueChanges.subscribe((data: any) => {
                        //     if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                        //       // Store the selected product mode ID
                        //       this.formConfig.model['products']['product_mode_id'] = data;
                        //       console.log("Product Mode changed to:", data); // Added logging

                        //        // Get the selected mode name for use in visibility conditions
                        //             this.formConfig.model['products']['product_mode_id'] = data;
        
                        //         // Store the mode name for visibility conditions
                        //         const selectedOption = field.templateOptions.options.find((option: any) => option.value === data);
                        //         if (selectedOption) {
                        //           this.selectedProductMode = selectedOption.label;
                        //           console.log("Product Mode changed to:", selectedOption.label);
                        //         }
                            

                        //       // Find the type field using a recursive search through all form fields
                        //       const findFieldByKey = (fieldGroups: any[], key: string): any => {
                        //         for (const fieldGroup of fieldGroups) {
                        //           if (fieldGroup.key === key) return fieldGroup;

                        //           if (fieldGroup.fieldGroup) {
                        //             const found = findFieldByKey(fieldGroup.fieldGroup, key);
                        //             if (found) return found;
                        //           }

                        //           if (fieldGroup.fieldArray && fieldGroup.fieldArray.fieldGroup) {
                        //             const found = findFieldByKey(fieldGroup.fieldArray.fieldGroup, key);
                        //             if (found) return found;
                        //           }
                        //         }
                        //         return null;
                        //       };

                        //       // Find the type field in the form structure
                        //       const typeField = findFieldByKey(this.formConfig.fields[0].fieldGroup, 'type_id');

                        //       if (typeField && data) {
                        //         console.log("Found Type field:", typeField);

                        //         // Reset the Type field value
                        //         typeField.formControl.setValue(null);

                        //         // Enable the field if it was disabled
                        //         typeField.templateOptions.disabled = false;

                        //         // Find the selected Product Mode to get its name
                        //         const selectedOption = field.templateOptions.options.find((option: any) => option.value === data);
                        //         if (selectedOption) {
                        //           console.log("Selected option:", selectedOption);

                        //           const filterUrl = `masters/product_types/?mode_type=${encodeURIComponent(selectedOption.label)}`;
                        //           console.log('Fetching type data from:', filterUrl);

                        //           // Update the placeholder while loading
                        //           typeField.templateOptions.placeholder = 'Loading types...';
                        //           typeField.templateOptions = { ...typeField.templateOptions };

                        //           // Directly fetch the filtered data
                        //           this.http.get(filterUrl).subscribe(
                        //             (response: any) => {
                        //               console.log('API response for types:', response);

                        //               let typeOptions = null;

                        //               if (response && response.data && Array.isArray(response.data)) {
                        //                 typeOptions = response.data;
                        //               } else if (response && Array.isArray(response)) {
                        //                 typeOptions = response;
                        //               } else if (response && response.results && Array.isArray(response.results)) {
                        //                 typeOptions = response.results;
                        //               }

                        //               if (typeOptions && typeOptions.length > 0) {
                        //                 console.log(`Received ${typeOptions.length} type options`);

                        //                 // Format options with simple value/label pairs like GST dropdown
                        //                 const formattedOptions = typeOptions.map(item => ({
                        //                   value: item.type_id, // Use just the ID as the value
                        //                   label: item.type_name // Use the name as the label
                        //                 }));

                        //                 // Update the options
                        //                 typeField.templateOptions.options = formattedOptions;
                        //                 typeField.templateOptions.disabled = false;
                        //                 typeField.templateOptions.placeholder = 'Select Type';
                        //                 typeField.templateOptions = { ...typeField.templateOptions };
                                        
                        //                 // Find the "Finished Product" option
                        //                 const finishedProductOption = formattedOptions.find(
                        //                   (option: any) => option.label.toLowerCase() === 'finished product'
                        //                 );
                                        
                        //                 if (finishedProductOption) {
                        //                   // Set it as the default value
                        //                   typeField.formControl.setValue(finishedProductOption.value);
                                          
                        //                   // Update the model
                        //                   if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                        //                     this.formConfig.model['products']['type_id'] = finishedProductOption.value;
                        //                     console.log("Default Type set to Finished Product:", finishedProductOption.value);
                        //                   }
                        //                 }
                        //               } else {
                        //                 typeField.templateOptions.options = [];
                        //                 typeField.templateOptions.disabled = false;
                        //                 typeField.templateOptions.placeholder = 'No types available';
                        //                 typeField.templateOptions = { ...typeField.templateOptions };
                        //               }
                        //             },
                        //             error => {
                        //               console.error('Error fetching type options:', error);
                        //               typeField.templateOptions.disabled = false;
                        //               typeField.templateOptions.options = [];
                        //               typeField.templateOptions.placeholder = 'Error loading types';
                        //               typeField.templateOptions = { ...typeField.templateOptions };
                        //             }
                        //           );
                        //         }
                        //       }
                        //     } else {
                        //       console.error('Form config or product mode data model is not defined.');
                        //     }
                        //   });
                        }
                      }
                    },
                    {
                      key: 'name',
                      type: 'input',
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        label: 'Name',
                        placeholder: 'Enter Name',
                        required: true,
                        // disabled: true
                      },
                      hooks: {
                        onInit: (field: any) => { }
                      },
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
                        required: true
                      },
                      hooks: {
                        onInit: (field: any) => {
                          // this.http.get('masters/generate_order_no/?type=prd').subscribe((res: any) => {
                          //   if (res && res.data && res.data?.order_number) {
                          //     field.formControl.setValue(res.data?.order_number);
                          //   }
                          // });
                        }
                      }
                    },
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'product_group',
                      type: 'productGroups-dropdown',
                      templateOptions: {
                        label: 'Product Group',
                        dataKey: 'product_group_id',
                        dataLabel: "group_name",
                        options: [],
                        required: true,
                        lazy: {
                          url: 'products/product_groups/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            // if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                            //   this.formConfig.model['products']['product_group_id'] = data?.product_group_id;
                            // } else {
                            //   console.error('Form config or lead_status data model is not defined.');
                            // }
                          });
                        }
                      }
                    },
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'gst_input',
                      type: 'select',
                      templateOptions: {
                        label: 'GST Percentage',
                        placeholder: 'Select GST Percentage',
                        required: false,
                        options: [
                          { value: 3, label: '3%' },
                          { value: 5, label: '5%' },
                          { value: 9, label: '9%' },
                          { value: 12, label: '12%' },
                          { value: 18, label: '18%' }
                        ]
                      }
                    },   
                    {
                      key: 'stock_unit',
                      type: 'productStockUnits-dropdown',
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        label: 'Stock Unit',
                        dataKey: 'stock_unit_id',
                        dataLabel: "stock_unit_name",
                        options: [],
                        required: true,
                        lazy: {
                          url: 'products/product_stock_units/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            // if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                            //   this.formConfig.model['products']['stock_unit_id'] = data?.stock_unit_id;
                            // } else {
                            //   console.error('Form config or lead_status data model is not defined.');
                            // }
                          });
                        }
                      }
                    },
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'hsn_code',
                      type: 'select',
                      templateOptions: {
                        label: 'HSN',
                        placeholder: 'Enter or Select HSN Code',
                        required: false,
                        options: [
                          { value: '0101', label: '0101' },
                          { value: '0201', label: '0201' },
                          { value: '0301', label: '0301' },
                          { value: '0401', label: '0401' },
                          { value: '0501', label: '0501' }
                        ],
                        // allowCustomValue: true // Allow users to enter their own value
                      }
                    }, 
                    {
                      className: 'col-md-4 col-sm-6 col-12',
                      key: 'balance',
                      type: 'input',
                      defaultValue: 0.00,
                      templateOptions: {
                      label: 'Balance',
                      required: false, 
                    }
                  },
                  ]
                },
                {
                  className: 'col-sm-3 col-12 p-0',
                  // key: 'products',
                  fieldGroupClassName: "ant-row row mx-0 mt-2",
                  fieldGroup: [
                    {
                      key: 'picture',
                      type: 'file',
                      className: 'ta-cell pr-md col d-flex justify-content-md-center pr-0',
                      templateOptions: {
                        label: 'Picture',
                        required: false,
                      }
                    }
                  ]
                },
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
                    label: 'Advanced info'
                  },
                  fieldGroup: [
                    {
                      fieldGroupClassName: "",
                      fieldGroup: [
                        {
                          className: 'col-12 p-0',
                          key: 'products',
                          fieldGroupClassName: "ant-row row align-items-end mt-3",
                          fieldGroup: [
                            {
                              key: 'category',
                              type: 'productCategories-dropdown',
                              className: 'col-3',
                              templateOptions: {
                                label: 'Category',
                                dataKey: 'category_id',
                                dataLabel: "category_name",
                                options: [],
                                required: false,
                                lazy: {
                                  url: 'products/product_categories/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                    //   this.formConfig.model['products']['category_id'] = data?.category_id;
                                    // } else {
                                    //   console.error('Form config or lead_status data model is not defined.');
                                    // }
                                  });
                                }
                              }
                            },
                            // {
                            //   className: 'col-md-4 col-sm-6 col-12',
                            //   key: 'gst_input',
                            //   type: 'select',
                            //   templateOptions: {
                            //     label: 'GST Percentage',
                            //     placeholder: 'Select GST Percentage',
                            //     required: false,
                            //     options: [
                            //       { value: 3, label: '3%' },
                            //       { value: 5, label: '5%' },
                            //       { value: 9, label: '9%' },
                            //       { value: 12, label: '12%' },
                            //       { value: 18, label: '18%' }
                            //     ]
                            //   }
                            // },    
                            {
                              key: 'brand',
                              type: 'productBrands-dropdown',
                              className: 'col-3',
                              templateOptions: {
                                label: 'Brand',
                                dataKey: 'brand_id',
                                dataLabel: "brand_name",
                                options: [],
                                required: false,
                                lazy: {
                                  url: 'masters/product_brands/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                    //   this.formConfig.model['products']['brand_id'] = data?.brand_id;
                                    // } else {
                                    //   console.error('Form config or brand_id data model is not defined.');
                                    // }
                                  });
                                }
                              }
                            },
                            // {
                            //   key: 'item_type',
                            //   type: 'select',
                            //   className: 'col-3',
                            //   templateOptions: {
                            //     label: 'Item Type',
                            //     dataKey: 'item_type_id',
                            //     dataLabel: "item_name",
                            //     options: [],
                            //     required: false,
                            //     lazy: {
                            //       url: 'masters/product_item_type/',
                            //       lazyOneTime: true
                            //     }
                            //   },
                            //   hooks: {
                            //     onChanges: (field: any) => {
                            //       field.formControl.valueChanges.subscribe((data: any) => {
                            //         if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                            //           this.formConfig.model['products']['item_type_id'] = data?.item_type_id;
                            //         } else {
                            //           console.error('Form config or lead_status data model is not defined.');
                            //         }
                            //       });
                            //     }
                            //   }
                            // },
                            {
                              key: 'type_id',
                              type: 'productType-dropdown',
                              className: 'col-3',
                              templateOptions: {
                                label: 'Type',
                                dataKey: 'type_id',
                                dataLabel: "type_name",
                                placeholder: 'Select Product Mode first',
                                options: [],
                                required: false,
                                disabled: true
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                    //   // Store just the ID value
                                    //   this.formConfig.model['products']['type_id'] = data;
                                    //   console.log("Type changed to:", data);
                                    // } else {
                                    //   console.error('Form config or type_id data model is not defined.');
                                    // }
                                  });
                                },
                                onInit: (field: any) => {
                                  // We need to wait for the Product Mode to load type options first
                                  // const checkForOptions = setInterval(() => {
                                  //   if (field.templateOptions.options && field.templateOptions.options.length > 0) {
                                  //     clearInterval(checkForOptions);
                                      
                                  //     // Find the "Finished Product" option
                                  //     const finishedProductOption = field.templateOptions.options.find(
                                  //       (option: any) => option.label.toLowerCase() === 'finished product'
                                  //     );
                                      
                                  //     if (finishedProductOption) {
                                  //       // Set the default value
                                  //       field.formControl.setValue(finishedProductOption.value);
                                        
                                  //       // Update the model
                                  //       if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                  //         this.formConfig.model['products']['type_id'] = finishedProductOption.value;
                                  //         console.log("Default Type set to Finished Product:", finishedProductOption.value);
                                  //       }
                                  //     }
                                  //   }
                                  // }, 500); // Check every 500ms
                                  
                                  // // Clear the interval after 10 seconds to prevent infinite checking
                                  // setTimeout(() => clearInterval(checkForOptions), 10000);
                                }
                              }
                            },
                            {
                              key: 'unit_options',
                              type: 'productUnitOptions-dropdown',
                              className: 'col-3',
                              templateOptions: {
                                label: 'Unit Options',
                                dataKey: 'unit_options_id',
                                dataLabel: "unit_name",
                                options: [],
                                required: false,
                                lazy: {
                                  url: 'masters/unit_options/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                    //   this.formConfig.model['products']['unit_options_id'] = data?.unit_options_id;
                                    // } else {
                                    //   console.error('Form config or unit_options_id data model is not defined.');
                                    // }
                                  });
                                },
                                onInit: (field: any) => {
                                  // const url = field.templateOptions.lazy.url;

                                  // // Fetch the data using HttpClient
                                  // this.http.get(url).subscribe(
                                  //   (data: any) => {

                                  //     // Map data to ensure each object has both label and value properties
                                  //     field.templateOptions.options = data?.data?.map((option: any) => ({
                                  //       label: option.unit_name,  // Display name in the UI
                                  //       value: {
                                  //         unit_options_id: option.unit_options_id,
                                  //         unit_name: option.unit_name,
                                  //       }
                                  //     }));

                                  //     // Find the default option where unit_name is 'Stock Unit'
                                  //     const regex = /^stock\s*unit$/i; // Matches "stock unit" with optional whitespace, case insensitive
                                  //     const defaultOption = field.templateOptions.options.find(option => regex.test(option.label));

                                  //     if (defaultOption) {
                                  //       // Set the default value to the unit_options_id of 'Stock Unit'
                                  //       field.formControl.setValue(defaultOption.value);

                                  //       // Update the model if necessary
                                  //       if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                  //         this.formConfig.model['products']['unit_options_id'] = defaultOption.value.unit_options_id;
                                  //       }
                                  //     } else {
                                  //       console.warn('Default "Unit Option" option not found in options.');
                                  //     }
                                  //   },
                                  //   (error) => {
                                  //     console.error('Error fetching unit options:', error);
                                  //   }
                                  // );
                                }
                              }
                            },
                            {
                              key: 'pack_unit',
                              type: 'packUnits-dropdown',
                              className: 'col-3',
                              templateOptions: {
                                label: 'Pack Unit',
                                dataKey: 'stock_unit_id',
                                dataLabel: 'stock_unit_name',
                                options: [],
                                required: true,
                                lazy: {
                                  url: 'products/product_stock_units/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                    //   this.formConfig.model['products']['pack_unit_id'] = data?.stock_unit_id;
                                    // } else {
                                    //   console.error('Form config or lead_status data model is not defined.');
                                    // }
                                  });
                                }
                              },
                              hideExpression: (model) => {
                                const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                                // Hide if the `unitName` is not 'Stock Pack Unit' AND not 'Stock Pack GPack Unit'
                                return unitName !== 'Stock Pack Unit' && unitName !== 'Stock Pack GPack Unit';
                              },
                            },
                            {
                              className: 'col-3',
                              key: 'pack_vs_stock',
                              type: 'input',
                              templateOptions: {
                                label: 'Pack vs Stock',
                                type: 'number',
                                required: false
                              },
                              hideExpression: (model) => {
                                // Check if `unit_options` exists, and check the value of `unit_name`
                                const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                                return unitName !== 'Stock Pack Unit' && unitName !== 'Stock Pack GPack Unit';
                              }
                            },
                            {
                              key: 'g_pack_unit',
                              type: 'GpackUnits-dropdown',
                              className: 'col-3',
                              templateOptions: {
                                label: 'GPack Unit',
                                dataKey: 'stock_unit_id',
                                dataLabel: 'stock_unit_name',
                                options: [],
                                required: true,
                                lazy: {
                                  url: 'products/product_stock_units/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                    //   this.formConfig.model['products']['g_pack_unit_id'] = data?.stock_unit_id;
                                    // } else {
                                    //   console.error('Form config or g_pack_unit data model is not defined.');
                                    // }
                                  });
                                }
                              },
                              hideExpression: (model) => {
                                // Check if `unit_options` exists, and check the value of `unit_name`
                                const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                                return unitName !== 'Stock Pack GPack Unit';  // Hide if it's not 'Stock Pack Unit'
                              }
                            },
                            {
                              className: 'col-3',
                              key: 'g_pack_vs_pack',
                              type: 'input',
                              templateOptions: {
                                label: 'GPack vs Stock',
                                type: 'number',
                                required: false
                              },
                              hideExpression: (model) => {
                                // Check if `unit_options` exists, and check the value of `unit_name`
                                const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                                return unitName !== 'Stock Pack GPack Unit';  // Hide if it's not 'Stock Pack Unit'
                              }
                            },
                            {
                              className: 'col-3',
                              key: 'packet_barcode',
                              type: 'input',
                              templateOptions: {
                                label: 'Packet Barcode',
                                required: false,
                              },
                              hideExpression: (model) => {
                                // Check if `unit_options` exists, and check the value of `unit_name`
                                const unitName = model.unit_options ? model.unit_options.unit_name : undefined;
                                return unitName !== 'Stock Pack GPack Unit';  // Hide if it's not 'Stock Pack Unit'
                              }
                            },
                            {
                              className: 'col-3',
                              key: 'barcode',
                              type: 'input',
                              templateOptions: {
                                label: 'Barcode',
                                placeholder: 'Enter Barcode',
                                required: false
                              }
                            },
                            {
                              className: 'col-3 d-flex align-items-center',
                              key: 'print_barcode',
                              type: 'checkbox',
                              templateOptions: {
                                label: 'Print Barcode'
                              }
                            }
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
                    label: 'Variations'
                  },
                  fieldGroup: [
                    {
                      fieldGroupClassName: "",
                      fieldGroup: [
                        {
                          key: 'product_variations',
                          type: 'table',
                          className: 'custom-form-list product-table',
                          templateOptions: {
                            // title: 'Product Variations',
                            addText: 'Add New Variations',
                            tableCols: [
                              { name: 'warehouse_location_id', label: 'Warehouse Location' },
                              { name: 'quantity', label: 'Quantity' },
                            ]
                          },
                          fieldArray: {
                            fieldGroup: [
                              {
                                key: 'size_id',
                                type: 'productSizes-dropdown',
                                templateOptions: {
                                  label: 'Size',
                                  placeholder: 'Select Size',
                                  dataKey: 'size_id',
                                  dataLabel: 'size_name',
                                  bindId: true,
                                  hideLabel: true,
                                  lazy: {
                                    url: 'products/sizes/',
                                    lazyOneTime: true
                                  }
                                },
                              },
                              {
                                key: 'color_id',
                                type: 'productColors-dropdown',
                                templateOptions: {
                                  label: 'Color',
                                  placeholder: 'Select Color',
                                  dataKey: 'color_id',
                                  dataLabel: "color_name",
                                  bindId: true,
                                  hideLabel: true,
                                  lazy: {
                                    url: 'products/colors/',
                                    lazyOneTime: true
                                  }
                                }
                              },
                              {
                                key: 'sku',
                                type: 'input',
                                templateOptions: {
                                  label: 'SKU',
                                  hideLabel: true,
                                  placeholder: 'Enter SKU'
                                },
                                expressionProperties: {
                                  'templateOptions.required': (model) => !!model?.quantity  // SKU is required if quantity has a value
                                }
                              },
                              {
                                key: 'price',
                                type: 'input',
                                templateOptions: {
                                  label: 'Price',
                                  hideLabel: true,
                                  placeholder: 'Enter Price',
                                  required: false
                                }
                              },
                              {
                                key: 'quantity',
                                type: 'input',
                                templateOptions: {
                                  label: 'Quantity',
                                  hideLabel: true,
                                  placeholder: 'Enter Quantity',
                                  required: false,
                                  type: 'number'
                                },
                                hooks: {
                                  onChanges: (field: any) => {
                                    field.formControl.valueChanges.subscribe(() => {
                                      // this.updateBalanceFromVariations();
                                    });
                                  }
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
                  className: 'col-12 pb-0',
                  fieldGroupClassName: "field-no-bottom-space",
                  props: {
                    label: 'Warehouse Locations'
                  },
                  fieldGroup: [
                    {
                      fieldGroupClassName: "",
                      fieldGroup: [
                        {
                          key: 'product_item_balance',
                          type: 'table',
                          className: 'custom-form-list product-table',
                          templateOptions: {
                            addText: 'Add Warehouse Locations',
                            tableCols: [
                              { name: 'warehouse_location_id', label: 'Warehouse Location' },
                              { name: 'quantity', label: 'Quantity' },
                            ]
                          },
                          fieldArray: {
                            fieldGroup: [
                              {
                                key: 'warehouse_location',
                                type: 'warehouseLocations-dropdown',
                                templateOptions: {
                                  label: 'Location',
                                  dataKey: 'location_id',
                                  dataLabel: 'location_name',
                                  options: [], // This will be populated dynamically based on the warehouse selected
                                  hideLabel: true,
                                  required: false,
                                  lazy: {
                                    lazyOneTime: true,
                                    url: 'inventory/warehouse_locations/'
                                  }
                                },
                                hooks: {
                                  onChanges: (field: any) => {
                                    field.formControl.valueChanges.subscribe((data: any) => {
                                      // const index = field.parent.key;
                                      // if (!this.formConfig.model['product_item_balance'][index]) {
                                      //   console.error(`Task comments at index ${index} is not defined. Initializing...`);
                                      //   this.formConfig.model['product_item_balance'][index] = {};
                                      // }
                                      // this.formConfig.model['product_item_balance'][index]['warehouse_location_id'] = data?.location_id;
                                    });
                                  }
                                }
                              },
                              {
                                key: 'quantity',
                                type: 'input',
                                templateOptions: {
                                  label: 'Quantity',
                                  placeholder: 'Enter Quantity',
                                  hideLabel: true,
                                  required: false
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  className: 'col-12 pb-0',
                  fieldGroupClassName: "field-no-bottom-space",
                  props: {
                    label: 'Sale Info'
                  },
                  fieldGroup: [
                    {
                      fieldGroupClassName: "",
                      fieldGroup: [
                        {
                          className: 'col-12 p-0',
                          key: 'products',
                          fieldGroupClassName: "ant-row row align-items-end mt-3",
                          fieldGroup: [
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'sales_description',
                              type: 'input',
                              templateOptions: {
                                label: 'Sales Description',
                                placeholder: 'Enter Sales Description'
                              }
                            },
                            {
                              key: 'sales_gl',
                              type: 'productSalesGL-dropdown',
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              templateOptions: {
                                label: 'Sales GL',
                                dataKey: 'sales_gl_id',
                                dataLabel: "name",
                                options: [],
                                required: false,
                                lazy: {
                                  url: 'products/product_sales_gl/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    // if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                    //   this.formConfig.model['products']['sales_gl_id'] = data?.sales_gl_id;
                                    // } else {
                                    //   console.error('Form config or lead_status data model is not defined.');
                                    // }
                                  });
                                }
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'mrp',
                              type: 'input',
                              templateOptions: {
                                label: 'MRP',
                                placeholder: 'Enter MRP',
                                required: false
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'minimum_price',
                              type: 'input',
                              templateOptions: {
                                label: 'Min Price',
                                placeholder: 'Enter Minimum Price'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'sales_rate',
                              type: 'input',
                              templateOptions: {
                                label: 'Sales Rate',
                                placeholder: 'Enter Sales Rate',
                                required: false
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'wholesale_rate',
                              type: 'input',
                              templateOptions: {
                                label: 'Wholesale Rate',
                                placeholder: 'Enter Wholesale Rate'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'dealer_rate',
                              type: 'input',
                              templateOptions: {
                                label: 'Dealer Rate',
                                placeholder: 'Enter Dealer Rate'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'rate_factor',
                              type: 'input',
                              templateOptions: {
                                label: 'Rate Factor',
                                placeholder: 'Enter Rate Factor'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'discount',
                              type: 'input',
                              defaultValue: 0.00,
                              templateOptions: {
                                label: 'Discount',
                                placeholder: 'Enter Discount'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'dis_amount',
                              type: 'input',
                              defaultValue: 0.00,
                              templateOptions: {
                                label: 'Disc Amt',
                                placeholder: 'Enter Disc Amt',
                                required: false
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
                    label: 'Purchase Info'
                  },
                  fieldGroup: [
                    {
                      fieldGroupClassName: "",
                      fieldGroup: [
                        {
                          className: 'col-12 p-0',
                          key: 'products',
                          fieldGroupClassName: "ant-row row align-items-end mt-3",
                          fieldGroup: [

                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'purchase_description',
                              type: 'input',
                              templateOptions: {
                                label: 'Purchase Description',
                                placeholder: 'Enter Purchase Description'
                              }
                            },
                            {
                              key: 'purchase_gl',
                              type: 'productPurchaseGL-dropdown',
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              templateOptions: {
                                label: 'Purchase GL',
                                dataKey: 'purchase_gl_id',
                                dataLabel: "name",
                                options: [],
                                required: false,
                                lazy: {
                                  url: 'products/product_purchase_gl/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    // if (formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                    //   this.formConfig.model['products']['purchase_gl_id'] = data?.purchase_gl_id;
                                    // } else {
                                    //   console.error('Form config or lead_status data model is not defined.');
                                    // }
                                  });
                                }
                              }
                            },

                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'minimum_purchase_price',
                              type: 'input',
                              templateOptions: {
                                label: 'Min Purchase Price',
                                placeholder: 'Enter Minimum Purchase Price'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'purchase_rate',
                              type: 'input',
                              templateOptions: {
                                label: 'Purchase Rate',
                                placeholder: 'Enter Purchase Rate'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'purchase_rate_factor',
                              type: 'input',
                              templateOptions: {
                                label: 'Purchase Rate Factor',
                                placeholder: 'Enter Purchase Rate Factor'
                              }
                            },
                            {
                              className: 'col-lg-3 col-md-4 col-sm-6 col-12',
                              key: 'purchase_discount',
                              type: 'input',
                              templateOptions: {
                                label: 'Purchase Discount',
                                placeholder: 'Enter Purchase Discount'
                              }
                            },
                          ]
                        },
                      ]
                    }
                  ]
                },
                {
                  className: 'col-12 custom-form-card-block p-0',
                  fieldGroupClassName: 'row m-0 pr-0',
                  props: {
                    label: 'Attributes Info'
                  },
                  // hideExpression: () => {
                  //     // Only hide if selectedProductMode is explicitly set to a non-Inventory value
                  //     // return this.selectedProductMode && this.selectedProductMode !== 'Inventory';
                  //   },

                  fieldGroup: [
                    {
                      className: 'col-12 p-0',
                      key: 'products',
                      fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
                      fieldGroup: [
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'minimum_level',
                          type: 'input',
                          templateOptions: {
                            label: 'Minimum Level',
                            placeholder: 'Enter Minimum Level'
                          }
                        },
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'maximum_level',
                          type: 'input',
                          templateOptions: {
                            label: 'Maximum Level',
                            placeholder: 'Enter Maximum Level'
                          }
                        },
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'weighscale_mapping_code',
                          type: 'text',
                          templateOptions: {
                            label: 'Weighscale Mapping Code',
                            placeholder: 'Enter Weighscale Mapping Code'
                          }
                        },
                        {
                          key: 'drug_type',
                          type: 'select',
                          className: 'col-md-4 col-sm-6 col-12',
                          templateOptions: {
                            label: 'Drug Type',
                            dataKey: 'drug_type_id',
                            dataLabel: "drug_type_name",
                            options: [],
                            required: false,
                            lazy: {
                              url: 'masters/product_drug_types/',
                              lazyOneTime: true
                            }
                          },
                          hooks: {
                            onChanges: (field: any) => {
                              field.formControl.valueChanges.subscribe((data: any) => {
                                // if (this.formConfig && this.formConfig.model && this.formConfig.model['products']) {
                                //   this.formConfig.model['products']['drug_type_id'] = data?.drug_type_id;
                                // } else {
                                //   console.error('Form config or lead_status data model is not defined.');
                                // }
                              });
                            }
                          }
                        },
                        {
                          className: 'col-md-4 col-sm-6 col-12',
                          key: 'salt_composition',
                          type: 'text',
                          templateOptions: {
                            label: 'Salt Composition',
                            placeholder: 'Enter Salt Composition'
                          }
                        }
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        }
      ]
    }
  
  }