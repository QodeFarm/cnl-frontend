import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
  @ViewChild('salesForm', { static: false }) salesForm: TaFormComponent | undefined;
  orderNumber: any;
  showSaleOrderList: boolean = false;
  showForm: boolean = false;
  SaleOrderEditID: any;
  productOptions: any;
  nowDate = () => {
    return new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
  }
  // invoiceData: any;

  // private apiUrl = 'sales/sale_invoice_order_get/'

  constructor(private http: HttpClient) {
  }

  // Function to create a sale invoice
  createSaleInvoice(invoiceData: any): Observable<any> {
    console.log("Sale invoice test: ")
    return this.http.post('sales/sale_invoice_order/', invoiceData);
  }

  ngOnInit() {

    this.showSaleOrderList = false;
    this.showForm = false;
    this.SaleOrderEditID = null;

    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

    // set sale_order default value
    this.formConfig.model['sale_order']['order_type'] = 'sale_order';

    // to get SaleOrder number for save
    this.getOrderNo();
  }


  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editSaleOrder(event) {
    console.log('event', event);
    this.SaleOrderEditID = event;
    this.http.get('sales/sale_order/' + event).subscribe((res: any) => {
      if (res && res.data) {

        this.formConfig.model = res.data;
        // set sale_order default value
        this.formConfig.model['sale_order']['order_type'] = 'sale_order';
        // set labels for update
        // show form after setting form values

        // this.formConfig.url = "sales/sale_order/" + this.SaleOrderEditID;
        this.formConfig.pkId = 'sale_order_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['sale_order_id'] = this.SaleOrderEditID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  getOrderNo() {
    this.orderNumber = null;
    this.http.get('masters/generate_order_no/?type=SHIP').subscribe((res: any) => {
      if (res && res.data && res.data.order_number) {
        this.formConfig.model['order_shipments']['shipping_tracking_no'] = res.data.order_number;
        this.http.get('masters/generate_order_no/?type=SO').subscribe((res: any) => {
          if (res && res.data && res.data.order_number) {
            this.formConfig.model['sale_order']['order_no'] = res.data.order_number;
            this.orderNumber = res.data.order_number;
          }
        });;
      }
    });
  }

  showSaleOrderListFn() {
    this.showSaleOrderList = true;
  }

  setFormConfig() {
    this.formConfig = {
      valueChangeFn: (res) => {
        // this.totalAmountCal();
      },
      url: "sales/sale_order/",
      title: '',
      formState: {
        viewMode: false
      },
      exParams: [
        {
          key: 'sale_order_items',
          type: 'script',
          value: 'data.sale_order_items.map(m=> {m.product_id = m.product.product_id; if(m.product.unit_options){m.unit_options_id = m.product.unit_options.unit_options_id};  if(m.unit_options){m.unit_options_id = m.unit_options.unit_options_id};  return m ;})'
        }
        // {
        //   key: 'order_attachments',
        //   type: 'script',
        //   value: 'data.order_attachments.map(m=> {m = m.response.data[0]; return m ;})'
        // },

      ],
      submit: {
        // label:'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        sale_order: {},
        sale_order_items: [{}],
        order_attachments: [],
        order_shipments: {}
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'sale_order',
          fieldGroup: [
            {
              key: 'order_no',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Order no',
                placeholder: 'Enter Order No',
                required: true,
                readonly: true
                // disabled: true
              },
              hooks: {
                onInit: (field: FormlyFieldConfig) => {
                  // this.totalAmountCal();
                  // this.form.form.valueChanges.subscribe(res => {
                  //   this.totalAmountCal();
                  // });

                  // field.form.controls.order_no.setValue(this.orderNumber)
                  // field.form.controls.order_no.value = this.orderNumber;
                }
              },
              // expressionProperties: {
              //   'templateOptions.disabled': this.SaleOrderEditID ? 'true' : 'fa'
              // }
            },
            {
              key: 'sale_type',
              type: 'select',
              className: 'col-2',
              // defaultValue: "d4d85a98-a703-4772-8b3c-736fc4cbf849",
              templateOptions: {
                label: 'Sale type',
                dataKey: 'name',
                dataLabel: "name",
                options: [],
                // required: true,
                lazy: {
                  url: 'masters/sale_types/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    console.log("sale_type", data);
                    if (data && data.sale_type_id) {
                      this.formConfig.model['sale_order']['sale_type_id'] = data.sale_type_id;
                    }
                  });
                },
                onChanges: (field: any) => {

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
                    console.log("customer", data);
                    if (data && data.customer_id) {
                      this.formConfig.model['sale_order']['customer_id'] = data.customer_id;
                    }
                    if (field.form && field.form.controls && field.form.controls.customer_id) {
                      field.form.controls.customer_id.setValue(data.customer_id)
                    }
                    if (data.customer_addresses.billing_address) {
                      field.form.controls.billing_address.setValue(data.customer_addresses.billing_address)
                    }
                    if (data.customer_addresses.shipping_address) {
                      field.form.controls.shipping_address.setValue(data.customer_addresses.shipping_address)
                    }
                    if (field.form && field.form.controls && field.form.controls.email) {
                      field.form.controls.email.setValue(data.email)
                    }
                  });
                }
              }
            },
            {
              key: 'email',
              type: 'input',
              // defaultValue: "testing@example.com",
              className: 'col-2',
              templateOptions: {
                type: 'input',
                label: 'Email',
                placeholder: 'Enter Email',
                // required: true
              },
              hooks: {
                onInit: (field: any) => { }
              }
            },
            {
              key: 'delivery_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Delivery date',
                readonly: true,
                // placeholder: 'Select Oder Date',
                required: true
              }
            },
            {
              key: 'order_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Order date',
                readonly: true,
                // placeholder: 'Select Order Date',
                required: true
              }
            },
            {
              key: 'ref_no',
              type: 'input',
              // defaultValue: "7777700",
              className: 'col-2',
              templateOptions: {
                type: 'input',
                label: 'Ref No',
                placeholder: 'Enter Ref No',
                // required: true
              }
            },
            {
              key: 'ref_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Ref date',
                placeholder: 'Select Ref date',
                readonly: true
                // required: true
              }
            },
            {
              key: 'tax',
              type: 'select',
              // defaultValue: 'Exclusive',
              className: 'col-2',
              templateOptions: {
                label: 'Tax',
                options: [
                  { 'label': "Inclusive", value: 'Inclusive' },
                  { 'label': "Exclusive", value: 'Exclusive' }
                ],
                // required: true
              },
              hooks: {
                onInit: (field: any) => {
                }
              }
            },
            {
              key: 'billing_address',
              type: 'textarea',
              // defaultValue: '777770 Shipping St, Shipping City, SC, USA',
              className: 'col-3',
              templateOptions: {
                label: 'Billing address',
                placeholder: 'Enter Billing address',
                // required: true,
              }
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'col-3',
              // defaultValue: '88652 Shipping St, Shipping City, SC, USA',
              templateOptions: {
                label: 'Shipping address',
                placeholder: 'Enter Shipping address',
                // required: true,
              }
            }
          ]
        },
        // end of sale_order

        {
          key: 'sale_order_items',
          type: 'table',
          className: 'custom-form-list',
          // defaultValue: [],
          // fieldGroupClassName: 'table-field pr-md',
          templateOptions: {
            title: 'Products',
            addText: 'Add Product',
            tableCols: [
              {
                name: 'product',
                label: 'Product'
              },
              {
                name: 'code',
                label: 'Code'
              },
              {
                name: 'unit',
                label: 'Unit'
              },
              {
                name: 'total_boxes',
                label: 'Total Boxes'
              },
              {
                name: 'quantity',
                label: 'Quantity'
              },
              {
                name: 'amount',
                label: 'Price'
              },
              {
                name: 'rate',
                label: 'Rate'
              },
              {
                name: 'discount',
                label: 'Discount'
              }
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
                      // field.form.controls.quantity.setValue(parseFloat(field.form.controls.quantity.value) || 1);

                      // binding selected product data 
                      if (field.form && field.form.controls && field.form.controls.code && data && data.code) {
                        field.form.controls.code.setValue(data.code)
                      }
                      if (field.form && field.form.controls && field.form.controls.rate && data && data.mrp) {
                        field.form.controls.rate.setValue(field.form.controls.rate.value || data.sales_rate)
                      }
                      if (field.form && field.form.controls && field.form.controls.discount && data && data.dis_amount) {
                        field.form.controls.discount.setValue(parseFloat(data.dis_amount))
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
                      if (field.form && field.form.controls && field.form.controls.mrp && data && data.mrp) {
                        field.form.controls.mrp.setValue(data.mrp)
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
                  type: 'number',
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
                  type: 'number',
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
                  type: 'number',
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
                  type: 'number',
                  label: 'Amount',
                  placeholder: 'Enter Amount',
                  hideLabel: true,
                  disabled: true
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
                  type: "number",
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
        // end of sale_order keys

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
                        type: "number",
                        label: 'No. of Packets',
                        placeholder: 'Select No. of Packets',
                      }
                    },
                    {
                      key: 'weight',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        type: "number",
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
                        readonly: true
                      }
                    },
                    {
                      key: 'shipping_date',
                      type: 'date',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Shipping Date'
                      }
                    },
                    {
                      key: 'shipping_charges',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        type: "number",
                        label: 'Shipping Charges.',
                        placeholder: 'Enter Shipping Charges',
                      }
                    },
                    // {
                    //   key: 'shipping_company_address',
                    //   type: 'textarea',
                    //   className: 'col-6',
                    //   templateOptions: {
                    //     label: 'Shipping Company Address',
                    //     placeholder: 'Enter Shipping Company Address',
                    //   }
                    // },
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
                        // start of sale_order keys
                        {
                          template: '<div class="custom-form-card-title"> Billing Details </div>',
                          fieldGroupClassName: "ant-row",
                        },
                        {
                          fieldGroupClassName: "ant-row",
                          key: 'sale_order',
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
                                type: 'number',
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
                                type: 'number',
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
                                type: 'number',
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
                                      this.formConfig.model['sale_order']['gst_type_id'] = data.gst_type_id;
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
                                      this.formConfig.model['sale_order']['payment_term_id'] = data.payment_term_id;
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
                                      this.formConfig.model['sale_order']['ledger_account_id'] = data.ledger_account_id;
                                    }
                                  });
                                }
                              }
                            },
                            // {
                            //   key: 'order_status',
                            //   type: 'select',
                            //   className: 'col-4',
                            //   templateOptions: {
                            //     label: 'Order status Type',
                            //     dataKey: 'status_name',
                            //     dataLabel: "status_name",
                            //     placeholder: 'Select Order status type',
                            //     // required: true,
                            //     lazy: {
                            //       url: 'masters/order_status/',
                            //       lazyOneTime: true
                            //     }
                            //   },
                            //   expressions: {
                            //     hide: '!model.sale_order_id',
                            //   },
                            //   hooks: {
                            //     onInit: (field: any) => {
                            //       // field.hide = this.SaleOrderEditID ? true : false;
                            //       // field.formControl.valueChanges.subscribe(data => {
                            //       //   console.log("order_status", data);
                            //       //   if (data && data.order_status_id) {
                            //       //     field.setValue()
                            //       //   }
                            //       // });
                            //     }
                            //   }
                            // },
                            {
                              key: 'order_status',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Order status',
                                dataKey: 'order_status_id',
                                dataLabel: 'status_name',
                                placeholder: 'Select Order status type',
                                lazy: {
                                  url: 'masters/order_status/',
                                  lazyOneTime: true
                                },
                                expressions: {
                                  hide: '!model.sale_order_id',
                                },
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    console.log("order_status", data);
                                    if (data && data.order_status_id) {
                                      this.formConfig.model['sale_order']['order_status_id'] = data.order_status_id;

                                      const saleOrder = this.formConfig.model['sale_order'];
                                      if (saleOrder.order_status && saleOrder.order_status.status_name === 'Confirmed') {
                                        console.log("processing salesInvoice:");
                                        const saleOrderItems = this.formConfig.model['sale_order_items'];
                                        const orderAttachments = this.formConfig.model['order_attachments']
                                        const orderShipments = this.formConfig.model['order_shipments']

                                        const invoiceData = {
                                          sale_invoice_order: {
                                            bill_type: saleOrder.bill_type || 'CASH',
                                            sale_order_id: saleOrder.sale_order_id,
                                            invoice_date: saleOrder.invoice_date || new Date().toISOString().split('T')[0],
                                            email: saleOrder.email,
                                            ref_no: saleOrder.ref_no,
                                            ref_date: saleOrder.ref_date || new Date().toISOString().split('T')[0],
                                            tax: saleOrder.tax || 'Inclusive',
                                            due_date: saleOrder.due_date,
                                            remarks: saleOrder.remarks,
                                            advance_amount: saleOrder.advance_amount,
                                            item_value: saleOrder.item_value,
                                            discount: saleOrder.discount,
                                            dis_amt: saleOrder.dis_amt,
                                            taxable: saleOrder.taxable,
                                            tax_amount: saleOrder.tax_amount,
                                            cess_amount: saleOrder.cess_amount,
                                            transport_charges: saleOrder.transport_charges,
                                            round_off: saleOrder.round_off,
                                            total_amount: saleOrder.doc_amount,
                                            vehicle_name: saleOrder.vehicle_name,
                                            total_boxes: saleOrder.total_boxes,
                                            shipping_address: saleOrder.shipping_address,
                                            billing_address: saleOrder.billing_address,
                                            customer_id: saleOrder.customer_id,
                                            gst_type_id: saleOrder.gst_type_id,
                                            order_type: saleOrder.order_type || 'sale_invoice',
                                            order_salesman_id: saleOrder.order_salesman_id,
                                            customer_address_id: saleOrder.customer_address_id,
                                            payment_term_id: saleOrder.payment_term_id,
                                            payment_link_type_id: saleOrder.payment_link_type_id,
                                            ledger_account_id: saleOrder.ledger_account_id,
                                            order_status_id: saleOrder.order_status_id
                                          },
                                          sale_invoice_items: saleOrderItems.map(item => ({
                                            quantity: item.quantity || 1,
                                            unit_price: item.unit_price || 0,
                                            rate: item.rate || 0,
                                            amount: item.amount || 0,
                                            discount_percentage: item.discount_percentage || 0,
                                            discount: item.discount || 0,
                                            dis_amt: item.dis_amt || 0,
                                            tax_code: item.tax_code || '',
                                            tax_rate: item.tax_rate || 0,
                                            unit_options_id: item.unit_options_id || null,
                                            product_id: item.product_id || null
                                          })),
                                          order_attachments: orderAttachments.map(attachment => ({
                                            attachment_name: attachment.attachment_name,
                                            attachment_path: attachment.attachment_path
                                          })),
                                          order_shipments: {
                                            destination: orderShipments.destination,
                                            shipping_tracking_no: orderShipments.shipping_tracking_no,
                                            shipping_date: orderShipments.shipping_date,
                                            shipping_charges: orderShipments.shipping_charges,
                                            vehicle_vessel: orderShipments.vehicle_vessel,
                                            charge_type: orderShipments.charge_type,
                                            document_through: orderShipments.document_through,
                                            port_of_landing: orderShipments.port_of_landing,
                                            port_of_discharge: orderShipments.port_of_discharge,
                                            no_of_packets: orderShipments.no_of_packets,
                                            weight: orderShipments.weight,
                                            shipping_mode_id: orderShipments.shipping_mode_id,
                                            shipping_company_id: orderShipments.shipping_company_id
                                          }
                                          // order_attachments: saleOrder.order_attachments || [],
                                          // order_shipments: saleOrder.order_shipments || {}
                                        };

                                        console.log("Invoice data to be sent:", invoiceData);

                                        this.createSaleInvoice(invoiceData).subscribe(
                                          response => {
                                            console.log('Sale invoice created successfully', response);
                                          },
                                          error => {
                                            console.error('Error creating sale invoice', error);
                                          }
                                        );
                                      }
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
                                readonly: true
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
                                readonly: true
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
                              key: 'doc_amount',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-4',
                              templateOptions: {
                                type: 'input',
                                label: 'Total amount',
                                placeholder: 'Enter Total amount',
                                readonly: true
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
      const products = data.sale_order_items || [];
      let totalAmount = 0;
      let totalDiscount = 0;
      let totalRate = 0;
      let doc_amount = 0;
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


      if (this.salesForm && this.salesForm.form && this.salesForm.form.controls) {
        const controls: any = this.salesForm.form.controls;
        controls.sale_order.controls.item_value.setValue(totalAmount);
        controls.sale_order.controls.dis_amt.setValue(totalDiscount);
        const doc_amount = (totalAmount + parseFloat(data.sale_order.cess_amount || 0) + parseFloat(data.sale_order.tax_amount || 0)) - totalDiscount;
        controls.sale_order.controls.doc_amount.setValue(doc_amount);

      }
      //const 

      // const cess_amount = data;
      // if (cess_amount && doc_amount) {
      //   field.form.controls.doc_amount.setValue(parseInt(doc_amount) - parseInt(cess_amount));
      // }
    }
  }

}
