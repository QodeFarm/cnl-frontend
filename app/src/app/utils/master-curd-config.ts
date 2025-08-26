import { TaCurdConfig } from "@ta/ta-curd";

export const customerCudConfig: TaCurdConfig = {
    tableConfig: {
        apiUrl: 'customers/customers/?summary=true',
        showCheckbox: false,
        pkId: "customer_id",
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
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
            {
                fieldKey: 'name',
                name: 'Name',
                sort: true
            },
            {
                fieldKey: 'email',
                name: 'Email',
                sort: false,
            },
            {
                fieldKey: 'phone',
                name: 'Phone',
                sort: false,
            },
            {
                fieldKey: 'gst',
                name: 'GST',
                sort: true,
            },
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
                fieldKey: 'ledger_account_id',
                name: 'Ledger Account',
                sort: true,
                displayType: 'map',
                mapFn: (currentValue: any, row: any, col: any) => {
                    return row.ledger_account.name;
                },
            },
            {
                fieldKey: 'pin_code',
                name: 'Pin Code',
                sort: true,
            }
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
        pageSize: 10,
        "globalSearch": {
            keys: ['customer_category_id', 'name', 'code']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
      pageSize: 10,
      "globalSearch": {
        keys: ['ledger_account_id', 'name','code','inactive','type','account_no','is_loan_account', 'address','pan','ledger_group_id']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        {
          fieldKey: 'inactive',
          name: 'Inactive',
          sort: true,
          type: 'boolean'
        },
        {
          fieldKey: 'type', 
          name: 'Type',
          sort: true
        },
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
      "globalSearch": {
        keys: ['state_name', 'city_name', 'city_code']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      pkId: 'state_id',
      pageSize: 10,
      "globalSearch": {
        keys: ['country_name', 'state_name', 'state_code']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      pageSize: 10,
      "globalSearch": {
        keys: ['country_name', 'country_code']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      
      pkId: "vendor_category_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['vendor_category_id', 'code', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      pageSize: 10,
      "globalSearch": {
        keys: ['status_id', 'status_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      pageSize: 10,
      "globalSearch": {
        keys: ['transporter_id', 'name', 'code','gst_no','website_url']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      pageSize: 10,
      "globalSearch": {
        keys: ['firm_status_id', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
        pageSize: 10,
        "globalSearch": {
          keys: ['gst_category_id', 'name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
      title: 'Price Categories',
      
      pkId: "price_category_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['price_category_id', 'name', 'code']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      title: 'Vendor Agent List',
      
      pkId: "vendor_agent_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['vendor_agent_id', 'name','code','commission_rate','rate_on','amount_type']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
          fieldKey: 'commission_rate',
          name: 'Commission Rate',
          sort: true
        },
		    {
          fieldKey: 'rate_on',
          name: 'Rate On',
          sort: true
        },
		    {
          fieldKey: 'amount_type',
          name: 'Amount Type',
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
      title: 'Vendor Payment Terms List',
      
      pkId: "payment_term_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['payment_term_id', 'name', 'code','fixed_days','no_of_fixed_days','payment_cycle','run_on']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
		    {
          fieldKey: 'fixed_days',
          name: 'Fixed Days',
          sort: true
        },
		    {
          fieldKey: 'no_of_fixed_days',
          name: 'No of fixed days',
          sort: true
        },
        {
          fieldKey: 'payment_cycle',
          name: 'Payment Cycle',
          sort: true
        },
		    {
          fieldKey: 'run_on',
          name: 'Run On',
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
      pageSize: 10,
      // "globalSearch": {
      //   keys: ['payment_term_id', 'name','code','fixed_days','no_of_fixed_days','payment_cycle', 'run_on']
      // },
      defaultSort: { key: 'created_at', value: 'descend' },
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
          fieldKey: 'fixed_days', 
          name: 'Fixed days',
          type: 'number',
          sort: true
        },
        {
          fieldKey: 'no_of_fixed_days', 
          name: 'No.of.fixed days',
          sort: true
        },
        {
          fieldKey: 'payment_cycle', 
          name: 'Payment Cycle',
          sort: true
        },
        {
          fieldKey: 'run_on', 
          name: 'Run on',
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
      title: 'Ledger Groups',
      pkId: "ledger_group_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['ledger_group_id', 'name','code','inactive','under_group','nature']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
          fieldKey: 'inactive',
          name: 'Inactive',
          sort: true,
          type: 'boolean'
        },
        {
          fieldKey: 'under_group', 
          name: 'Under Group',
          sort: true
        },
        {
          fieldKey: 'nature',
          name: 'Nature',
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
      title: 'Territory',
      
      pkId: "territory_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['territory_id', 'name','code']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      pageSize: 10,
      "globalSearch": {
        keys: ['machine_id', 'machine_name', 'description', 'status']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'machine_name',
          name: 'Machine Name',
          sort: true
        },
        {
          fieldKey: 'description',
          name: 'Description',
          sort: true
        },
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
      pageSize: 10,
      "globalSearch": {
        keys: ['status_id', 'status_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      title: 'Order Statuses',
      
      pkId: "order_status_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['order_status_id', 'status_name','description']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      
      pkId: "gst_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['gst_type_id', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      
      pkId: "order_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['order_type_id', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      
      pkId: "purchase_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['purchase_type_id', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      
      pkId: "sale_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['sale_type_id', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      pkId: "group_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['group_id', 'group_name', 'description']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      "globalSearch": {
        keys: ['reminder_type_id', 'type_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
      "globalSearch": {
        keys: ['payment_link_type_id', 'name', 'description']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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