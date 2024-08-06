import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-salesinvoice',
  templateUrl: './salesinvoice.component.html',
  styleUrls: ['./salesinvoice.component.scss']
})
export class SalesinvoiceComponent {
  @ViewChild('saleinvoiceForm', { static: false }) saleinvoiceForm: TaFormComponent | undefined;
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
          value: 'data.sale_invoice_items.map(m=> {m.product_id = m.product.product_id; if(m.product.unit_options){m.unit_options_id = m.product.unit_options.unit_options_id};  if(m.unit_options){m.unit_options_id = m.unit_options.unit_options_id};  return m ;})'
        },
      ],
      submit: {
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
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
                    // if (field.form && field.form.controls && field.form.controls.email) {
                    //   field.form.controls.email.setValue(data.email)
                    // }
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
              key: 'ref_no',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Reference No',
                placeholder: 'Enter Reference No',
                required: true,
              },
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
              key: 'billing_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Billing Address',
                placeholder: 'Enter Billing Address',
                //required: true
              }
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Shipping Address',
                placeholder: 'Enter Shipping Address',
                //required: true
              }
            },
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
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      console.log("products data", data);
                      this.productOptions = data;
                      // default value for new product
                      field.form.controls.quantity.setValue(field.form.controls.quantity.value || 1);

                      // binding selected product data 
                      if (field.form && field.form.controls && field.form.controls.code && data && data.code) {
                        field.form.controls.code.setValue(data.code)
                      }
                      if (field.form && field.form.controls && field.form.controls.rate && data && data.mrp) {
                        field.form.controls.rate.setValue(field.form.controls.rate.value || data.sales_rate)
                      }
                      if (field.form && field.form.controls && field.form.controls.discount && data && data.dis_amount) {
                        field.form.controls.discount.setValue(data.dis_amount)
                      }
                      if (field.form && field.form.controls && field.form.controls.unit_options && data && data.unit_options && data.unit_options.unit_name) {
                        field.form.controls.unit_options.setValue(data.unit_options)
                      }
                      if (field.form && field.form.controls && field.form.controls.print_name && data && data.print_name) {
                        field.form.controls.print_name.setValue(data.print_name)
                      }
                      if (field.form && field.form.controls && field.form.controls.discount && data && data.dis_amount) {
                        field.form.controls.discount.setValue(data.dis_amount)
                      }
                      this.totalAmountCal();
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
                  // // required: true
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
                  // // required: true
                },
              },
              {
                type: 'select',
                key: 'unit_options',
                templateOptions: {
                  label: 'Unit',
                  placeholder: 'Select Unit',
                  hideLabel: true,
                  dataLabel: 'unit_name',
                  dataKey: 'unit_options_id',
                  lazy: {
                    url: 'masters/unit_options',
                    lazyOneTime: true
                  }
                },
              },
              // quantity amount rate dsc
              {
                type: 'input',
                key: 'quantity',
                defaultValue: 1,
                templateOptions: {
                  type: 'number',
                  label: 'Qty',
                  placeholder: 'Enter Qty',
                  min: 1,
                  hideLabel: true,
                  required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      // this.formConfig.model['productQuantity'] = data;

                      if (field.form && field.form.controls && field.form.controls.rate && data) {
                        const rate = field.form.controls.rate.value;
                        const quantity = data;
                        if (rate && quantity) {
                          field.form.controls.amount.setValue(parseInt(rate) * parseInt(quantity));
                        }

                      }
                    })
                  },
                  onChanges: (field: any) => {

                  }
                }
              },

              {
                type: 'input',
                key: 'rate',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Rate',
                  placeholder: 'Enter Rate',
                  hideLabel: true,
                  // type: 'number',
                  // // required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      // this.formConfig.model['productQuantity'] = data;

                      if (field.form && field.form.controls && field.form.controls.quantity && data) {
                        const quantity = field.form.controls.quantity.value;
                        const rate = data;
                        if (rate && quantity) {
                          field.form.controls.amount.setValue(parseInt(rate) * parseInt(quantity));
                        }
                        // this.totalAmountCal();
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
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      // this.totalAmountCal();
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
                  // // required: true mrp tax 
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
                  disabled: true
                  // type: 'number',
                  // // required: true mrp tax 
                },
              },
              {
                type: 'input',
                key: 'amount',
                templateOptions: {
                  label: 'Amount',
                  placeholder: 'Enter Amount',
                  hideLabel: true,
                  // type: 'number',
                  // // required: true
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      this.totalAmountCal();
                      // this.formConfig.model['productDiscount'] = data;
                    })
                  }
                  // onInit: (field: any) => {
                  //   field.form.get('quantity').valueChanges.pipe(
                  //     distinctUntilChanged()
                  //   ).subscribe((data: any) => {
                  //     this.totalAmountCal();
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
                  // // required: true mrp tax 
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
                  // // required: true mrp tax 
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
              //     // // required: true mrp tax 
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
              //     // // required: true mrp tax 
              //   },
              // },
            ]
          },
        },
        // end of sale_invoice_order keys

        // start of order_shipments keys

        {
          fieldGroupClassName: "row col-12 m-0 custom-form-card",
          fieldGroup: [
            {
              className: 'col-6 custom-form-card-block',
              fieldGroup: [
                {
                  template: '<div class="custom-form-card-title">  Shipping Details </div>',
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
                        // required: true,
                        dataKey: 'shipping_mode_id',
                        dataLabel: "name",
                        bindId: true,
                        lazy: {
                          url: 'masters/shipping_modes',
                          lazyOneTime: true
                        }
                      },
                    },
                    {
                      key: 'port_of_discharge',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Port of Discharge',
                        placeholder: 'Select Port of Discharge',
                      }
                    },
                    {
                      key: 'shipping_company_id',
                      type: 'select',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Company',
                        placeholder: 'Select Shipping Company',
                        // required: true,
                        dataKey: 'shipping_company_id',
                        dataLabel: "name",
                        bindId: true,
                        lazy: {
                          url: 'masters/shipping_companies',
                          lazyOneTime: true
                        }
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
                      key: 'shipping_tracking_no',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Tracking No.',
                        placeholder: 'Enter Shipping Tracking No.',
                      }
                    },
                    {
                      key: 'shipping_date',
                      type: 'date',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Date',
                        defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
                      }
                    },
                    {
                      key: 'shipping_charges',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Charges.',
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
                    },
                  ]
                },
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
                        // start of sale_invoice_order keys
                        {
                          template: '<div class="custom-form-card-title"> Billing Details </div>',
                          fieldGroupClassName: "ant-row",
                        },
                        {
                          fieldGroupClassName: "ant-row",
                          key: 'sale_invoice_order',
                          fieldGroup: [

                            // {
                            //   key: 'remarks',
                            //   type: 'textarea',
                            //   // defaultValue: 'This is a remark',
                            //   className: 'ant-col-11 pr-md m-3',
                            //   templateOptions: {
                            //     label: 'Remarks',
                            //     placeholder: 'Enter Remarks',
                            //     // required: true,
                            //   }
                            // },
                            // {
                            //   key: 'vehicle_name',
                            //   type: 'input',
                            //   // defaultValue: "bike",
                            //   className: 'ant-col-8 pr-md m-3',
                            //   templateOptions: {
                            //     type: 'input',
                            //     label: 'Vehicle name',
                            //     placeholder: 'Enter Vehicle name',
                            //     // required: true
                            //   }
                            // },
                            {
                              key: 'total_boxes',
                              type: 'input',
                              // defaultValue: 77777,
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Total boxes',
                                placeholder: 'Enter Total boxes',
                                // required: true
                              }
                            },
                            {
                              key: 'cess_amount',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Cess amount',
                                placeholder: 'Enter Cess amount',
                                // required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();
                                    // this.formConfig.model['productDiscount'] = data;
                                  })
                                },
                                onChanges: (field: any) => {
                                  // field.formControl.valueChanges.subscribe(data => {
                                  //   // this.formConfig.model['productQuantity'] = data;
                                  //   if (field.form && field.form.controls && field.form.controls.doc_amount && data) {
                                  //     const doc_amount = field.form.controls.doc_amount.value;
                                  //     const cess_amount = data;
                                  //     if (cess_amount && doc_amount) {
                                  //       field.form.controls.doc_amount.setValue(parseInt(doc_amount) - parseInt(cess_amount));
                                  //     }
                                  //   }
                                  // })
                                }
                              }
                            },
                            {
                              key: 'advance_amount',
                              type: 'input',
                              // defaultValue: "77777.00",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Advance amount',
                                placeholder: 'Enter Advance amount',
                                // required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();
                                    // this.formConfig.model['productDiscount'] = data;
                                  })
                                },
                                onChanges: (field: any) => {
                                  // field.formControl.valueChanges.subscribe(data => {
                                  //   if (field.form && field.form.controls && field.form.controls.doc_amount && data) {
                                  //     const doc_amount = field.form.controls.doc_amount.value;
                                  //     const tax_amount = data;
                                  //     if (tax_amount && doc_amount) {
                                  //       field.form.controls.doc_amount.setValue(parseInt(doc_amount) - parseInt(tax_amount));
                                  //     }
                                  //   }
                                  // })
                                }
                              }
                            },
                            {
                              key: 'taxable',
                              type: 'input',
                              // defaultValue: "777770",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Taxable',
                                placeholder: 'Enter Taxable',
                                // required: true
                              }
                            },
                            {
                              key: 'tax_amount',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Tax amount',
                                placeholder: 'Enter Tax amount',
                                // required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();
                                    // this.formConfig.model['productDiscount'] = data;
                                  })
                                },
                                onChanges: (field: any) => {
                                  // field.formControl.valueChanges.subscribe(data => {
                                  //   if (field.form && field.form.controls && field.form.controls.doc_amount && data) {
                                  //     const doc_amount = field.form.controls.doc_amount.value;
                                  //     const tax_amount = data;
                                  //     if (tax_amount && doc_amount) {
                                  //       field.form.controls.doc_amount.setValue(parseInt(doc_amount) - parseInt(tax_amount));
                                  //     }
                                  //   }
                                  // })
                                }
                              }
                            },
                            // {
                            //   key: 'round_off',
                            //   type: 'input',
                            //   // defaultValue: "7777700",
                            //   className: 'col-4',
                            //   templateOptions: {
                            //     type: 'input',
                            //     label: 'Round off',
                            //     placeholder: 'Enter Round off',
                            //     // required: true
                            //   }
                            // },
                            {
                              key: 'gst_type',
                              type: 'select',
                              // defaultValue: "888ddb1b-5d74-4051-903f-171e2b4f9aab",
                              className: 'col-4',
                              templateOptions: {
                                label: 'Gst type',
                                placeholder: 'Select Gst type',
                                // required: true,
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
                              // defaultValue: '3b4cc23d-6dc3-42e9-9894-02624fdf9934',
                              templateOptions: {
                                label: 'Payment term',
                                placeholder: 'Select Payment term',
                                // required: true,
                                dataKey: 'name',
                                dataLabel: "name",
                                lazy: {
                                  url: 'masters/customer_payment_terms/',
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
                                label: 'Ledger account',
                                placeholder: 'Select Ledger account',
                                // required: true,
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
                                placeholder: 'Select Order Status Type',
                                dataKey: 'status_name',
                                dataLabel: "status_name",
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
                              key: 'item_value',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Items value',
                                placeholder: 'Enter Item value',
                                // required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // field.parent.form.get('sale_order_items').valueChanges.pipe(
                                  //   distinctUntilChanged()
                                  // ).subscribe((data: any) => {
                                  //   let sum = 0;
                                  //   data.forEach(d => {
                                  //     if (d.amount) {
                                  //       sum += parseInt(d.amount);
                                  //     }
                                  //   });
                                  //   // console.log('sum - ',sum);
                                  //   field.formControl.setValue(sum);
                                  // });
                                }
                              }
                            },
                            {
                              key: 'dis_amt',
                              type: 'input',
                              // defaultValue: "777770",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Discount amount',
                                placeholder: 'Enter Discount amount',
                                // required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // field.parent.form.get('sale_order_items').valueChanges.pipe(
                                  //   distinctUntilChanged()
                                  // ).subscribe((data: any) => {
                                  //   let totalDiscount = 0;
                                  //   data.forEach(d => {
                                  //     if (d.discount) {
                                  //       totalDiscount += parseInt(d.discount);
                                  //     }
                                  //   });
                                  //   // console.log('totalDiscount - ',totalDiscount);
                                  //   field.formControl.setValue(totalDiscount);
                                  // });
                                }
                              }
                            },
                            {
                              key: 'total_amount',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Total amount',
                                placeholder: 'Enter Total amount',
                                // required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // field.parent.form.get('sale_order_items').valueChanges.pipe(
                                  //   distinctUntilChanged()
                                  // ).subscribe((data: any) => {
                                  //   let totalItemsValue = parseInt(field.form.controls.item_value.value);
                                  //   let totalDiscount = 0;
                                  //   data.forEach(d => {
                                  //     if (d.discount) {
                                  //       totalDiscount += parseInt(d.discount);
                                  //     }
                                  //   });
                                  //   const cess_tax_amount = parseInt(field.form.controls.cess_amount.value) + parseInt(field.form.controls.tax_amount.value);
                                  //   // console.log('totalDiscount - ',totalDiscount);
                                  //   // console.log('totalItemsValue - ', totalItemsValue);
                                  //   field.formControl.setValue(totalItemsValue - totalDiscount);
                                  //   // this.formConfig.model['total_doc_amount'] = field.formControl.value;
                                  // });

                                }
                              }
                            },
                          ]
                        },
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
                          className: 'ta-cell col-12 custom-file-attachement',
                          props: {
                            "displayStyle": "files",
                            "multiple": true
                            // label: 'Order Attachments',
                            // // required: true
                            // required: true
                          }
                        },
                      ]
                    }
                  ]
                },

              ]

            }
          ]
        },



        //   "vehicle_vessel": "Lorry",
        //   "charge_type": "best",
        //   "document_through": "mail"
      ]
    }
  }

  totalAmountCal() {
    const data = this.formConfig.model;
    console.log('data', data);
    if (data) {
      const products = data.sale_invoice_items || [];
      let totalAmount = 0;
      let totalDiscount = 0;
      let totalRate = 0;
      let total_amount = 0;
      if (products) {
        products.forEach(product => {
          if (product) {
            if (product.amount)
              totalAmount += parseFloat(product.amount || 0);
            if (product.discount)
              totalDiscount += parseFloat(product.discount || 0);
          }
          // totalRate += parseFloat(product.rate) * parseFloat(product.quantity || 0);
        });
      }


      if (this.saleinvoiceForm && this.saleinvoiceForm.form && this.saleinvoiceForm.form.controls) {
        const controls: any = this.saleinvoiceForm.form.controls;
        controls.sale_invoice_order.controls.item_value.setValue(totalAmount);
        controls.sale_invoice_order.controls.dis_amt.setValue(totalDiscount);
        // const doc_amount = (totalAmount + parseFloat(data.sale_invoice_order.cess_amount || 0) + parseFloat(data.sale_invoice_order.tax_amount || 0)) - totalDiscount;
        // controls.sale_invoice_order.controls.doc_amount.setValue(doc_amount);
        const cessAmount = parseFloat(data.sale_invoice_order.cess_amount || 0);
        const taxAmount = parseFloat(data.sale_invoice_order.tax_amount || 0);
        const advanceAmount = parseFloat(data.sale_invoice_order.advance_amount || 0);

        const total_amount = (totalAmount + cessAmount + taxAmount) - totalDiscount - advanceAmount;
        controls.sale_invoice_order.controls.total_amount.setValue(total_amount);

      }
      //const 

      // const cess_amount = data;
      // if (cess_amount && doc_amount) {
      //   field.form.controls.doc_amount.setValue(parseInt(doc_amount) - parseInt(cess_amount));
      // }
    }
  }

}
