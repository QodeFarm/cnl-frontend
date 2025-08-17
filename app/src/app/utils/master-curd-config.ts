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
        title: 'Customer Categories',
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

export const productSalesGLConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/product_sales_gl/',
        //   title: 'Product Sales GL',      
        pkId: "sales_gl_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['name', 'sales_accounts', 'code', 'inactive', 'type', 'account_no', 'is_loan_account', 'address', 'employee', 'pan']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
            {
                fieldKey: 'is_loan_account',
                name: 'Is Loan Account',
                sort: true,
                type: 'boolean'
            },
            // {
            //   fieldKey: 'tds_applicable', 
            //   name: 'TDS Applicable',
            //   sort: false,
            //   type: 'boolean'
            // },
            {
                fieldKey: 'address',
                name: 'Address',
                sort: true
            },
            {
                fieldKey: 'employee',
                name: 'Employee',
                sort: true,
                type: 'boolean'
            },
            {
                fieldKey: 'pan',
                name: 'PAN',
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
        "globalSearch": {
            keys: ['type_id', 'type_name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
            {
                fieldKey: 'type_name',
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
                        apiUrl: 'masters/product_types'
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
        url: 'masters/product_types/',
        title: 'Product Types',
        pkId: "type_id",
        exParams: [
        ],
        fields:
            [
                {
                    fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
                    fieldGroup:
                        [
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



export const productBrandsConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'masters/product_brands/',
        // title: 'Product Brands',

        pkId: "brand_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['brand_id', 'brand_name', 'code', 'brand_salesman']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        "globalSearch": {
            keys: ['group_name', 'description']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
            {
                fieldKey: 'group_name',
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

export const productStockUnitsConfig: TaCurdConfig = {
    drawerSize: 'auto',
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/product_stock_units/',
        //   title: 'Product Stock Units',

        pkId: "stock_unit_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['stock_unit_name', 'quantity_code_id', 'description']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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

export const productCategoriesConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'products/product_categories/',
        // title: 'Product Categories',

        pkId: "category_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['category_name', 'code']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        "globalSearch": {
            keys: ['id', 'type', 'code', 'hsn_or_sac_code', 'hsn_description']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        "globalSearch": {
            keys: ['item_type_id', 'item_name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        "globalSearch": {
            keys: ['name', 'purchase_accounts', 'code', 'inactive', 'type', 'account_no', 'is_loan_account', 'address', 'employee', 'pan']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
            {
                fieldKey: 'name',
                name: 'Name',
                sort: true
            },
            {
                fieldKey: 'purchase_accounts',
                name: 'Purchase Accounts',
                sort: true,
            },
            {
                fieldKey: 'code',
                name: 'Code',
                sort: true,
            },
            // {
            //   fieldKey: 'is_subledger',
            //   name: 'Is Subledger',
            //   sort: false,
            //   type: 'boolean'
            // },
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
                fieldKey: 'account_no',
                name: 'Account No',
                sort: true,
                isEncrypted: true
            },
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
            {
                fieldKey: 'is_loan_account',
                name: 'Is Loan Account',
                sort: true,
                type: 'boolean'
            },
            // {
            //   fieldKey: 'tds_applicable', 
            //   name: 'TDS Applicable',
            //   sort: false,
            //   type: 'boolean'
            // },
            {
                fieldKey: 'address',
                name: 'Address',
                sort: true
            },
            {
                fieldKey: 'employee',
                name: 'Employee',
                sort: true,
                type: 'boolean'
            },
            {
                fieldKey: 'pan',
                name: 'PAN',
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
        title: 'Unit Options',

        pkId: "unit_options_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['unit_options_id', 'unit_name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        "globalSearch": {
            keys: ['size_id', 'size_name', 'size_category', 'size_system', 'length', 'height', 'width', 'size_unit', 'description']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
            {
                fieldKey: 'size_system',
                name: 'Size System',
                sort: true
            },
            {
                fieldKey: 'length',
                name: 'Length',
                sort: true
            },
            {
                fieldKey: 'height',
                name: 'Height',
                sort: true
            },
            {
                fieldKey: 'width',
                name: 'Width',
                sort: true
            },
            {
                fieldKey: 'size_unit',
                name: 'Size Unit',
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
                        required: true,
                    }
                },
                {
                    key: 'length',
                    type: 'input',
                    className: 'col-md-6 col-12 pb-3 px-1',
                    templateOptions: {
                        label: 'Length',
                        placeholder: 'Enter Length',
                        required: true,
                    }
                },
                {
                    key: 'height',
                    type: 'input',
                    className: 'col-md-6 col-12 pb-3 px-1',
                    templateOptions: {
                        label: 'Height',
                        placeholder: 'Enter Height',
                        required: true,
                    }
                },
                {
                    key: 'width',
                    type: 'input',
                    className: 'col-md-6 col-12 pb-3 px-1',
                    templateOptions: {
                        label: 'Width',
                        placeholder: 'Enter Width',
                        required: true,
                    }
                },
                {
                    key: 'size_unit',
                    type: 'input',
                    className: 'col-md-6 col-12 mb-md-0 mb-3 px-1',
                    templateOptions: {
                        label: 'Designation Size Unit',
                        placeholder: 'Enter Size Unit',
                        required: true,
                    }
                },
                {
                    key: 'description',
                    type: 'input',
                    className: 'col-md-6 col-12 px-1',
                    templateOptions: {
                        label: 'Description',
                        placeholder: 'Enter Description',
                        required: true,
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
        title: 'Color',
        pkId: "color_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['color_id', 'color_name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        title: 'Warehouse Locations',
        pkId: "location_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['location_id', 'location_name', 'description', 'warehouse']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
            {
                fieldKey: 'location_name',
                name: 'Location Name',
                sort: true
            },
            {
                fieldKey: 'description',
                name: 'Description',
                sort: true
            },
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
                        required: true,
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
        title: 'Pack Unit',
        pkId: "pack_unit_id",
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
        title: 'GPack Unit',
        pkId: "g_pack_unit_id",
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
        pageSize: 10,
        "globalSearch": {
            keys: ['job_type_id', 'job_type_name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
    drawerSize: 'auto',
    drawerPlacement: 'top',
    tableConfig: {
        apiUrl: 'hrms/designations/',
        //   title: 'Designation',
        pkId: "designation_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['designation_id', 'designation_name', 'responsibilities']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
            {
                fieldKey: 'designation_name',
                name: 'Designation Name',
                sort: true
            },
            {
                fieldKey: 'responsibilities',
                name: 'Responsibilities',
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
        title: 'Job Codes',
        pkId: "job_code_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['job_code_id', 'job_code']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        "globalSearch": {
            keys: ['department_id', 'department_name', 'designation_name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        "globalSearch": {
            keys: ['shift_id', 'shift_name', 'start_time', 'end_time']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        pageSize: 10,
        "globalSearch": {
            keys: ['component_id', 'component_name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        pageSize: 10,
        "globalSearch": {
            keys: ['employee_component_id', 'component_id', 'component_amount', 'salary_id']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        pageSize: 10,
        "globalSearch": {
            keys: ['leave_type_id', 'leave_type_name', 'description', 'max_days_allowed']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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
        title: 'Lead statuses',
        pkId: "lead_status_id",
        pageSize: 10,
        "globalSearch": {
            keys: ['lead_status_id', 'status_name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
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









