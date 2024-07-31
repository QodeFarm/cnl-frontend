import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-salesinvoice',
  templateUrl: './salesinvoice.component.html',
  styleUrls: ['./salesinvoice.component.scss']
})
export class SalesinvoiceComponent {
  invoiceNumber: any;
  showSaleInvoiceList: boolean = false;
  showForm: boolean = false;
  SaleInvoiceEditID: any;
  productOptions: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showSaleInvoiceList = false;
    this.showForm = true;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

    // set sale_order default value
    this.formConfig.model['sale_invoice_order']['order_type'] = 'sale_invoice';

    // to get SaleInvoice number for save
    this.getInvoiceNo();
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editSaleInvoice(event) {
    console.log('event', event);
    this.SaleInvoiceEditID = event;
    this.http.get('sales/sale_invoice_order/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res && res.data) {

        this.formConfig.model = res.data;
        // set sale_order default value
        this.formConfig.model['sale_invoice_order']['order_type'] = 'sale_invoice';
        // set labels for update
        this.formConfig.submit.label = 'Update';
        // show form after setting form values

        this.formConfig.pkId = 'sale_invoice_id';

        this.formConfig.model['sale_invoice_id'] = this.SaleInvoiceEditID;
        this.showForm = true;
      }
    })
    this.hide();
  }

  getInvoiceNo() {
    this.invoiceNumber = null;
    this.http.get('masters/generate_order_no/?type=SO-INV').subscribe((res: any) => {
      console.log(res);
      if (res && res.data && res.data.order_number) {
        this.formConfig.model['sale_invoice_order']['invoice_no'] = res.data.order_number;
        this.invoiceNumber = res.data.order_number;
        console.log("SaleInvoice NO: ", this.invoiceNumber);
        console.log("get SaleInvoice number called");
      }
    })
  }

  showSaleInvoiceListFn() {
    this.showSaleInvoiceList = true;
  }

  setFormConfig() {
    this.formConfig = {
      url: "sales/sale_invoice_order/",
      title: '',
      formState: {
        viewMode: false
      },
      exParams: [
        {
          key: 'sale_invoice_items',
          type: 'script',
          value: 'data.sale_invoice_items.map(m=> {m.product_id = m.product.product_id; if(m.product.unit_options){m.unit_options_id = m.product.unit_options.unit_options_id}; if(m.unit_options){m.unit_options_id = m.unit_options.unit_options_id}; return m;})'
        },
      ],
      submit: {
        submittedFn: () => this.ngOnInit()
      },
      reset: {},
      model: {
        sale_invoice_order: {},
        sale_invoice_items: [{}],
        order_attachments: [],
        order_shipments: {}
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'sale_invoice_order',
          fieldGroup: [
            {
              key: 'bill_type',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Bill Type',
                dataKey: 'bill_type',
                dataLabel: "name",
                options: [
                  { label: 'Cash', value: 'CASH' },
                  { label: 'Credit', value: 'CREDIT' },
                  { label: 'Others', value: 'OTHERS' }
                ],
                required: true
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    console.log("bill_type", data);
                    if (data) {
                      this.formConfig.model['sale_invoice_order']['bill_type'] = data;
                    }
                  });
                }
              }
            },
            {
              key: 'customer',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Customer',
                dataKey: 'customer_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'customers/customers/?summary=true',
                  lazyOneTime: true
                },
                required: true,
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    if (data && data.customer_id) {
                      this.formConfig.model['sale_invoice_order']['customer_id'] = data.customer_id;
                    }
                  });
                }
              }
            },
            {
              key: 'sale_order',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Sale Order',
                dataKey: 'sale_order_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'sales/sale_order/',
                  lazyOneTime: true
                },
                required: true,
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    if (data && data.customer_id) {
                      this.formConfig.model['sale_invoice_order']['sale_order_id'] = data.sale_order_id;
                    }
                  });
                }
              }
            },
            {
              key: 'order_salesman',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Order Salesman',
                dataKey: 'order_salesman_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'masters/orders_salesman/',
                  lazyOneTime: true
                },
                //required: true,
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    if (data && data.customer_id) {
                      this.formConfig.model['sale_invoice_order']['order_salesman_id'] = data.order_salesman_id;
                    }
                  });
                }
              }
            },
            {
              key: 'invoice_no',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Invoice No',
                placeholder: 'Enter Invoice No',
                required: true,
              },
              hooks: {
                onInit: (field: any) => {}
              }
            },
            {
              key: 'email',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                type: 'email',
                label: 'Email',
                placeholder: 'Enter Email',
              },
              hooks: {
                onInit: (field: any) => {}
              }
            },
            {
              key: 'ref_no',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Reference No',
                placeholder: 'Enter Reference No',
                required: true,
              },
              hooks: {
                onInit: (field: any) => {}
              }
            },
            {
              key: 'invoice_date',
              type: 'date',
              defaultValue: new Date().toISOString().split('T')[0],
              className: 'col-2',
              templateOptions: {
                label: 'Invoice Date',
                required: true
              }
            },
            {
              key: 'ref_date',
              type: 'date',
              defaultValue: new Date().toISOString().split('T')[0],
              className: 'col-2',
              templateOptions: {
                label: 'Ref Date',
                required: true
              }
            },
            {
              key: 'due_date',
              type: 'date',
              defaultValue: new Date().toISOString().split('T')[0],
              className: 'col-2',
              templateOptions: {
                label: 'Due Date',
                //required: true
              }
            },
            {
              key: 'tax',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Tax',
                options: [
                  { label: 'Inclusive', value: 'Inclusive' },
                  { label: 'Exclusive', value: 'Exclusive' }
                ],
              },
              hooks: {
                onInit: (field: any) => {}
              }
            },
            {
              key: 'remarks',
              type: 'textarea',
              className: 'col-4',
              templateOptions: {
                label: 'Remarks',
                placeholder: 'Enter Remarks',
              }
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'col-3',
              templateOptions: {
                label: 'Shipping Address',
                placeholder: 'Enter Shipping Address',
                //required: true
              }
            },
            {
              key: 'billing_address',
              type: 'textarea',
              className: 'col-3',
              templateOptions: {
                label: 'Billing Address',
                placeholder: 'Enter Billing Address',
                //required: true
              }
            }
          ]
        },
        {
          key: 'sale_invoice_items',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            title: 'Products',
            addText: 'Add Product',
            tableCols: [
              { name: 'product', label: 'Product' },
              { name: 'code', label: 'Code' },
              { name: 'unit', label: 'Unit' },
              { name: 'total_boxes', label: 'Total Boxes' },
              { name: 'quantity', label: 'Quantity' },
              { name: 'amount', label: 'Price' },
              { name: 'rate', label: 'Rate' },
              { name: 'discount', label: 'Discount' }
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'product',
                type: 'select',
                templateOptions: {
                  label: 'Select Product',
                  dataKey: 'product_id',
                  hideLabel: true,
                  dataLabel: 'name',
                  // options: this.productOptions,
                  options: [],
                  required: true,
                  lazy: {
                    url: 'products/products/?summary=true',
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit:(field: any)=>{
                    field.formControl.valueChanges.subscribe(data => {
                      // field.templateOptions.options = data;
                    });
                    // field.templateOptions.options = this.productOptions;
                  },
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      console.log("products data", data);
                      this.productOptions = data;

                      if (field.form && field.form.controls && field.form.controls.code && data && data.code) {
                        field.form.controls.code.setValue(data.code)
                      }
                      if (field.form && field.form.controls && field.form.controls.sales_rate && data && data.mrp) {
                        field.form.controls.sales_rate.setValue(data.mrp)
                      }
                      if (field.form && field.form.controls && field.form.controls.discount && data && data.dis_amount) {
                        field.form.controls.discount.setValue(data.dis_amount)
                      }
                      if (field.form && field.form.controls && field.form.controls.unit && data && data.unit_options && data.unit_options.unit_name) {
                        if (data.unit_options && data.unit_options.unit_name) {
                          field.form.controls.unit.setValue(data.unit_options.unit_name)
                        }
                      }
                      if (field.form && field.form.controls && field.form.controls.print_name && data && data.print_name) {
                        field.form.controls.print_name.setValue(data.print_name)
                      }
                      if (field.form && field.form.controls && field.form.controls.discount && data && data.dis_amount) {
                        field.form.controls.discount.setValue(data.dis_amount)
                      }
                    });
                    // field.templateOptions.options = this.cs.getRole();
                  }
                }
              },
              {
                type: 'input',
                key: 'code',
                // defaultValue: 0,
                templateOptions: {
                  label: 'Code',
                  placeholder: 'Enter code',
                  hideLabel: true,
                  // // //required: true
                },
                expressionProperties: {
                  // 'templateOptions.disabled': (model) => (model.item && model.item.sale_price) ? false : true
                }
              },
              {
                type: 'input',
                key: 'total_boxes',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Total Boxes',
                  placeholder: 'Enter Total Boxes',
                  hideLabel: true,
                  // // //required: true
                },
              },
              {
                type: 'input',
                key: 'unit',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Unit',
                  placeholder: 'Enter Unit',
                  hideLabel: true,
                  // // //required: true
                },
              },
              // quantity amount rate dsc
              {
                type: 'input',
                key: 'quantity',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Qty',
                  placeholder: 'Enter Qty',
                  hideLabel: true,
                  required: true
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      // this.formConfig.model['productQuantity'] = data;
                      if (field.form && field.form.controls && field.form.controls.sales_rate && data) {
                        const rate = field.form.controls.sales_rate.value;
                        const quantity = data;
                        if (rate && quantity) {
                          field.form.controls.totalAmount.setValue(parseInt(rate) * parseInt(quantity));
                        } 
                      }
                    })
                  }
                }
              },

              {
                type: 'input',
                key: 'sales_rate',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Rate',
                  placeholder: 'Enter Rate',
                  hideLabel: true,
                  // type: 'number',
                  // // //required: true
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      // this.formConfig.model['productQuantity'] = data;
                      if (field.form && field.form.controls && field.form.controls.quantity && data) {
                        const quantity = field.form.controls.quantity.value;
                        const rate = data;
                        if (rate && quantity) {
                          field.form.controls.totalAmount.setValue(parseInt(rate) * parseInt(quantity));
                        }
                      }
                    })
                  }
                }
              },
              {
                type: 'input',
                key: 'discount',
                // defaultValue: 90,
                templateOptions: {
                  placeholder: 'Enter Disc',
                  // type: 'number',
                  label: 'Disc',
                  hideLabel: true,
                },
                hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      // this.formConfig.model['productDiscount'] = data;
                    })
                  }
                },
                expressionProperties: {
                  // 'templateOption6s.disabled': (model) => (model.item && model.item.sale_price) ? false : true
                }
              },
              {
                type: 'input',
                key: 'print_name',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Print name',
                  placeholder: 'Enter Product Print name',
                  hideLabel: true,
                  // type: 'number',
                  // // //required: true mrp tax 
                },
              },
              {
                type: 'input',
                key: 'mrp',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Mrp',
                  placeholder: 'Mrp',
                  hideLabel: true,
                  disabled:true
                  // type: 'number',
                  // // //required: true mrp tax 
                },
              },
              {
                type: 'input',
                key: 'totalAmount',
                templateOptions: {
                  label: 'Amount',
                  placeholder: 'Enter Amount',
                  hideLabel: true,
                  // type: 'number',
                  // // //required: true
                },
                hooks: {
                  // onInit: (field: any) => {
                  //   field.form.get('quantity').valueChanges.pipe(
                  //     distinctUntilChanged()
                  //   ).subscribe((data: any) => {
                  //     const dt = data[0];
                  //     // if (dt['quantity'] && dt['amount']) {
                  //     //   field.formControl.setValue(parseInt(dt['quantity']) * parseInt(dt['amount']));
                  //     // } else {
                  //     //   field.formControl.setValue(0);
                  //     // }
                  //   });
                  // }
                }
              },
              {
                type: 'input',
                key: 'tax',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Tax',
                  placeholder: 'Tax',
                  hideLabel: true,
                  // type: 'number',
                  // // //required: true mrp tax 
                },
              },
              {
                type: 'input',
                key: 'remarks',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Remarks',
                  placeholder: 'Enter Remarks',
                  hideLabel: true,
                  // type: 'number',
                  // // //required: true mrp tax 
                },
              },
              // {
              //   type: 'input',
              //   key: 'tax',
              //   // defaultValue: 1000,
              //   templateOptions: {
              //     label: 'HSN',
              //     placeholder: 'Tax',
              //     hideLabel: true,
              //     // type: 'number',
              //     // // //required: true mrp tax 
              //   },
              // },
              // {
              //   type: 'input',
              //   key: 'tax',
              //   // defaultValue: 1000,
              //   templateOptions: {
              //     label: 'Barcode',
              //     placeholder: 'Barcode',
              //     hideLabel: true,
              //     // type: 'number',
              //     // // //required: true mrp tax 
              //   },
              // },
            ]
          },
        },
        {
          fieldGroupClassName: "row col-12 m-0 custom-form-card",
          fieldGroup: [
            {
              className: 'col-6 custom-form-card-block',
              fieldGroup: [
                {
                  template: '<div class="custom-form-card-title"> Shipping Details </div>',
                  fieldGroupClassName: "ant-row",
                },
                {
                  fieldGroupClassName: "ant-row",
                  key: 'order_shipments',
                  fieldGroup: [
                    {
                      key: 'destination',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Destination',
                        placeholder: 'Enter Destination',
                      }
                    },
                    {
                      key: 'port_of_landing',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Port of Landing',
                        placeholder: 'Enter Port of Landing',
                      }
                    },
                    {
                      key: 'shipping_mode_id',
                      type: 'select',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Mode',
                        placeholder: 'Select Shipping Mode',
                      }
                    },
                    {
                      key: 'port_of_discharge',
                      type: 'select',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Port of Discharge',
                        placeholder: 'Select Port of Discharge',
                      }
                    },
                    {
                      key: 'shipping_company_id',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Company',
                        placeholder: 'Select Shipping Company',
                      }
                    },
                    {
                      key: 'no_of_packets',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'No. of Packets',
                        placeholder: 'Select No. of Packets',
                      }
                    },
                    {
                      key: 'weight',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Weight',
                        placeholder: 'Enter Weight',
                      }
                    },
                    {
                      key: 'order_shipments.shipping_tracking_no',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Tracking No.',
                        placeholder: 'Enter Shipping Tracking No.',
                      }
                    },
                    {
                      key: 'order_shipments.shipping_date',
                      type: 'date',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Date',
                      }
                    },
                    {
                      key: 'order_shipments.shipping_charges',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Charges',
                        placeholder: 'Enter Shipping Charges',
                      }
                    },
                    {
                      key: 'shipping_company_address',
                      type: 'textarea',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Company Address',
                        placeholder: 'Enter Shipping Company Address',
                      }
                    }
                  ]
                }
              ]
            },
            {
              className: 'col-6 pb-0',
              fieldGroupClassName: "field-no-bottom-space",
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 mb-3 custom-form-card-block w-100',
                      fieldGroup: [
                        {
                          template: '<div class="custom-form-card-title"> Billing Details </div>',
                          fieldGroupClassName: "ant-row",
                        },
                        {
                          fieldGroupClassName: "ant-row",
                          key: 'sale_invoice_order',
                          fieldGroup: [
                            {
                              key: 'total_boxes',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Total Boxes',
                                placeholder: 'Enter Total Boxes',
                              }
                            },
                            {
                              key: 'cess_amount',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Cess Amount',
                                placeholder: 'Enter Cess Amount',
                              }
                            },
                            {
                              key: 'transport_charges',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Transport Charges',
                                placeholder: 'Enter Transport Charges',
                              }
                            },
                            {
                              key: 'taxable',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Taxable',
                                placeholder: 'Enter Taxable',
                              }
                            },
                            {
                              key: 'tax_amount',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Tax Amount',
                                placeholder: 'Enter Tax Amount',
                              }
                            },
                            {
                              key: 'gst_type',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Gst Type',
                                placeholder: 'Select Gst Type',
                                dataKey: 'name',
                                dataLabel: "name",
                                lazy: {
                                  url: 'masters/gst_types/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    console.log("gst_type", data);
                                    if (data && data.gst_type_id) {
                                      this.formConfig.model['sale_invoice_order']['gst_type_id'] = data.gst_type_id;
                                    }
                                  });
                                }
                              }
                            },
                            {
                              key: 'payment_term',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Payment Term',
                                placeholder: 'Select Payment Term',
                                dataKey: 'payment_term_id',
                                dataLabel: "name",
                                lazy: {
                                  url: 'customers/customer/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    console.log("payment_term", data);
                                    if (data && data.payment_term_id) {
                                      this.formConfig.model['sale_invoice_order']['payment_term_id'] = data.payment_term_id;
                                    }
                                  });
                                }
                              }
                            },
                            {
                              key: 'ledger_account',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                dataKey: 'name',
                                dataLabel: "name",
                                label: 'Ledger Account',
                                placeholder: 'Select Ledger Account',
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
                                      this.formConfig.model['sale_invoice_order']['ledger_account_id'] = data.ledger_account_id;
                                    }
                                  });
                                }
                              }
                            },
                            {
                              key: 'order_status',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Order Status Type',
                                dataKey: 'status_name',
                                dataLabel: "status_name",
                                placeholder: 'Select Order Status Type',
                                lazy: {
                                  url: 'masters/order_status/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    console.log("order_status", data);
                                    if (data && data.order_status_id) {
                                      this.formConfig.model['sale_invoice_order']['order_status_id'] = data.order_status_id;
                                    }
                                  });
                                }
                              }
                            },
                            {
                              key: 'advance_amount',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Advance Amount',
                                placeholder: 'Enter Advance Amount',
                              },
                              hooks: {
                                onInit: (field: any) => {}
                              }
                            },
                            {
                              key: 'item_value',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Item Value',
                                placeholder: 'Enter Item Value',
                                //required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.parent.form.get('sale_invoice_items').valueChanges.pipe(
                                    distinctUntilChanged()
                                  ).subscribe((data: any) => {
                                    let sum = 0;
                                    data.forEach(d => {
                                      if (d.amount) {
                                        sum += parseFloat(d.amount);
                                      }
                                    });
                                    field.formControl.setValue(sum);
                                  });
                                }
                              }
                            },
                            {
                              key: 'discount',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Discount',
                                placeholder: 'Enter Discount',
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.parent.form.get('sale_invoice_items').valueChanges.pipe(
                                    distinctUntilChanged()
                                  ).subscribe((data: any) => {
                                    let totalDiscount = 0;
                                    data.forEach(d => {
                                      if (d.discount) {
                                        totalDiscount += parseFloat(d.discount);
                                      }
                                    });
                                    field.formControl.setValue(totalDiscount);
                                  });
                                }
                              }
                            },
                            {
                              key: 'total_amount',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Total Amount',
                                placeholder: 'Enter Total Amount',
                                //required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.parent.form.get('sale_invoice_items').valueChanges.pipe(
                                    distinctUntilChanged()
                                  ).subscribe((data: any) => {
                                    let totalItemsValue = field.form.controls.item_value.value;
                                    let totalDiscount = 0;
                                    data.forEach(d => {
                                      if (d.discount) {
                                        totalDiscount += parseFloat(d.discount);
                                      }
                                    });
                                    field.formControl.setValue(totalItemsValue - totalDiscount);
                                  });
                                }
                              }
                            },
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  className: 'col-12 custom-form-card-block w-100',
                  fieldGroup: [
                    {
                      template: '<div class="custom-form-card-title"> Order Attachments </div>',
                      fieldGroupClassName: "ant-row",
                    },
                    {
                      key: 'order_attachments',
                      type: 'file',
                      className: 'ta-cell col-12 custom-file-attachment',
                      templateOptions: {}
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
