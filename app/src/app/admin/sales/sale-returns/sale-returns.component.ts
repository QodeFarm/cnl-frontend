import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-sale-returns',
  templateUrl: './sale-returns.component.html',
  styleUrls: ['./sale-returns.component.scss']
})
export class SaleReturnsComponent {
  @ViewChild('salereturnForm', { static: false }) salereturnForm: TaFormComponent | undefined;
  returnNumber: any;
  showSaleReturnOrderList: boolean = false;
  showForm: boolean = false;
  SaleReturnOrderEditID: any;
  productOptions: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.showSaleReturnOrderList = false;
    console.log('list end :',this.showSaleReturnOrderList)
    this.showForm = true;
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

    this.formConfig.model['sale_return_order']['order_type'] = 'sale_return';

    this.getReturnNo();
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editSaleReturnOrder(event) {
    console.log('event', event);
    this.SaleReturnOrderEditID = event;
    this.http.get('sales/sale_return_order/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res && res.data) {
        this.formConfig.model = res.data;
        console.log("editing starting here", res.data)
        this.formConfig.model['sale_return_order']['order_type'] = 'sale_return';
        this.formConfig.submit.label = 'Update';
        this.formConfig.pkId = 'sale_return_id';
        this.formConfig.model['sale_return_id'] = this.SaleReturnOrderEditID;
        this.showForm = true;
      }
    });
    this.hide();
  }

  getReturnNo() {
    this.returnNumber = null;
    this.http.get('masters/generate_order_no/?type=SR').subscribe((res: any) => {
      console.log(res);
      if (res && res.data && res.data.order_number) {
        this.formConfig.model['sale_return_order']['return_no'] = res.data.order_number;
        this.returnNumber = res.data.order_number;
        console.log("get SaleReturnOrder number called");
      }
    });
  }

  showSalesReturnOrderListFn() {
    this.showSaleReturnOrderList = true;
    console.log('list start :',this.showSaleReturnOrderList)
  }

  setFormConfig() {
    this.formConfig = {
      url: "sales/sale_return_order/",
      title: '',
      formState: {
        viewMode: false
      },
      exParams: [
        {
          key: 'sale_return_items',
          type: 'script',
          value: 'data.sale_return_items.map(m=> {m.product_id = m.product.product_id; if(m.product.unit_options){m.unit_options_id = m.product.unit_options.unit_options_id};  if(m.unit_options){m.unit_options_id = m.unit_options.unit_options_id};  return m ;})'
        }
      ],
      submit: {
        submittedFn: () => this.ngOnInit()
      },
      reset: {},
      model: {
        sale_return_order: {},
        sale_return_items: [{}],
        order_attachments: [],
        order_shipments: {}
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'sale_return_order',
          fieldGroup: [
            {
              key: 'return_no',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Return No',
                placeholder: 'Enter Return No',
                required: true,
              },
              hooks: {
                onInit: (field: any) => {
                  // field.form.controls.order_no.setValue(this.orderNumber)
                  // field.form.controls.order_no.value = this.orderNumber;
                }
              },
              // expressionProperties: {
              //   'templateOptions.disabled': this.SaleOrderEditID ? 'true' : 'fa'
              // }
            },
            {
              key: 'bill_type',
              type: 'select',
              // defaultValue: 'Exclusive',
              className: 'col-2',
              templateOptions: {
                label: 'Bill type',
                options: [
                  { 'label': "Cash", value: 'CASH' },
                  { 'label': "Credit", value: 'CREDIT' },
                  { 'label': "Others", value: 'OTHERS' }
                ],
                required: true
              },
              hooks: {
                onInit: (field: any) => {
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
                    // console.log("vendors", data);
                    if (data && data.customer_id) {
                      this.formConfig.model['sale_return_order']['customer_id'] = data.customer_id;
                    }

                    // if (field.form && field.form.controls && field.form.controls.customer_id) {
                    //   field.form.controls.customer_id.setValue(data.customer_id)
                    // }
                    // if (field.form && field.form.controls && field.form.controls.customer_address_id) {
                    //   field.form.controls.customer_address_id.setValue(data.customer_category_id)
                    // }
                    // if (field.form && field.form.controls && field.form.controls.email) {
                    //   field.form.controls.email.setValue(data.email)
                    // }
                  });
                }
              }
            },
            {
              key: 'sale_invoice',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Sale invoice',
                dataKey: 'sale_invoice_id',
                dataLabel: "invoice_no",
                options: [],
                lazy: {
                  url: 'sales/sale_invoice_order/?summary=true',
                  lazyOneTime: true
                },
                // required: true,
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    // console.log("order_type", data);
                    if (data && data.sale_invoice_id) {
                      this.formConfig.model['sale_return_order']['sale_invoice_id'] = data.sale_invoice_id;
                    }
                  });
                }
              }
            },
            {
              key: 'orders_salesman',
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
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    // console.log("order_type", data);
                    if (data && data.order_salesman_id) {
                      this.formConfig.model['sale_return_order']['order_salesman_id'] = data.order_salesman_id;
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
                type: 'input',
                label: 'Email',
                placeholder: 'Enter Email',
              },hooks: {
                onInit: (field: any) => { }
              }
            },
            {
              key: 'return_date',
              type: 'date',
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Return Date',
                required: true
              }
            },
            {
              key: 'ref_no',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                type: 'input',
                label: 'Ref No',
                placeholder: 'Enter Ref No',
              }
            },
            {
              key: 'ref_date',
              type: 'date',
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Ref Date',
                placeholder: 'Select Ref Date',
              }
            },
            {
              key: 'against_bill',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                type: 'input',
                label: 'Against bill',
                placeholder: 'Enter Against bill',
              }
            },
            {
              key: 'against_bill_date',
              type: 'date',
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Against bill date',
                placeholder: 'Select Against bill date',
              }
            },
            {
              key: 'due_date',
              type: 'date',
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Due Date',
                placeholder: 'Select Due Date',
              }
            },
            {
              key: 'customer_address',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Customer addresses',
                dataKey: 'customer_address_id',
                dataLabel: "customer_id",
                options: [],
                lazy: {
                  url: 'customers/customers_addresses/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    // console.log("order_type", data);
                    if (data && data.customer_address_id) {
                      this.formConfig.model['sale_return_order']['customer_address_id'] = data.customer_address_id;
                    }
                  });
                }
              }
            },
            {
              key: 'payment_link_type',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Payment link type',
                dataKey: 'payment_link_type_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'masters/payment_link_type/',
                  lazyOneTime: false
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    // console.log("order_type", data);
                    if (data && data.payment_link_type_id) {
                      this.formConfig.model['sale_return_order']['payment_link_type_id'] = data.payment_link_type_id;
                    }
                  });
                }
              }
            },
            {
              key: 'tax',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Tax',
                options: [
                  { 'label': "Inclusive", value: 'Inclusive' },
                  { 'label': "Exclusive", value: 'Exclusive' }
                ],
              },
              hooks: {
                onInit: (field: any) => {
                }
              }
              
            },
            {
              key: 'remarks',
              type: 'textarea',
              className: 'col-3',
              templateOptions: {
                label: 'Remarks',
                placeholder: 'Enter Remarks',
              }
            },
            {
              key: 'return_reason',
              type: 'textarea',
              className: 'col-3',
              templateOptions: {
                label: 'Return Reason',
                placeholder: 'Enter Return Reason',
              }
            },
            {
              key: 'billing_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Billing Address',
                placeholder: 'Enter Billing Address',
              }
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Shipping Address',
                placeholder: 'Enter Shipping Address',
              }
            }
          ]
        },
        {
          key: 'sale_return_items',
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
                      fieldGroup:[
              
                {
                  template: '<div class="custom-form-card-title"> Billing Details </div>',
                  fieldGroupClassName: "ant-row",
                },
                {
                  fieldGroupClassName: "ant-row",
                  key: 'sale_return_order',
                  fieldGroup: [
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
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['sale_return_order']) {
                              this.formConfig.model['sale_return_order']['gst_type_id'] = data.gst_type_id;
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
                        dataKey: 'payment_term_id',
                        dataLabel: 'name',
                        lazy: {
                          url: 'masters/customer_payment_terms/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (this.formConfig && this.formConfig.model && this.formConfig.model['sale_return_order']) {
                              this.formConfig.model['sale_return_order']['payment_term_id'] = data.payment_term_id;
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
                        dataKey: 'order_status_id',
                        dataLabel: "status_name",
                        lazy: {
                          url: 'masters/order_status/',
                          lazyOneTime: true
                        },
                        expressions: {
                          hide: '!model.sale_return_id',
                        },
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe(data => {
                            console.log("order_status", data);
                            if (data && data.order_status_id) {
                              this.formConfig.model['sale_return_order']['order_status_id'] = data.order_status_id;
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
                    //     dataKey: 'order_status_id',
                    //     dataLabel: "status_name",
                    //     placeholder: 'Select Order status type',
                    //     // required: true,
                    //     lazy: {
                    //       url: 'masters/order_status/',
                    //       lazyOneTime: true
                    //     }
                    //   },
                    //   // expressions: {
                    //   //   hide: '!model.sale_order_id',
                    //   // },
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
                      key: 'total_boxes',
                      type: 'input',
                      className: 'col-4',
                      templateOptions: {
                        type: 'input',
                        label: 'Total Boxes',
                        placeholder: 'Enter Total Boxes',
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
                        }
                      }
                    },
                    {
                      key: 'taxable',
                      type: 'input',
                      className: 'col-4',
                      templateOptions: {
                        type: 'input',
                        label: 'Taxable',
                        placeholder: 'Enter Taxable',
                      }
                    },
                    // {
                    //   key: 'transport_charges',
                    //   type: 'input',
                    //   className: 'col-4',
                    //   templateOptions: {
                    //     type: 'input',
                    //     label: 'Transport Charges',
                    //     placeholder: 'Enter Transport Charges',
                    //   }
                    // },
                    // {
                    //   key: 'round_off',
                    //   type: 'input',
                    //   className: 'col-4',
                    //   templateOptions: {
                    //     type: 'input',
                    //     label: 'Round Off',
                    //     placeholder: 'Enter Round Off',
                    //   }
                    // },
                    // {
                    //   type: 'input',
                    //   key: 'print_name',
                    //   // defaultValue: 1000,
                    //   templateOptions: {
                    //     label: 'Print name',
                    //     placeholder: 'Enter Product Print name',
                    //     hideLabel: true,
                    //     // type: 'number',
                    //     // // required: true mrp tax 
                    //   },
                    // },
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
  ]
  }
}
totalAmountCal() {
  const data = this.formConfig.model;
  console.log('data', data);
  if (data) {
    const products = data.sale_return_items || [];
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


    if (this.salereturnForm && this.salereturnForm.form && this.salereturnForm.form.controls) {
      const controls: any = this.salereturnForm.form.controls;
      controls.sale_return_order.controls.item_value.setValue(totalAmount);
      controls.sale_return_order.controls.dis_amt.setValue(totalDiscount);
      // const doc_amount = (totalAmount + parseFloat(data.sale_invoice_order.cess_amount || 0) + parseFloat(data.sale_invoice_order.tax_amount || 0)) - totalDiscount;
      // controls.sale_invoice_order.controls.doc_amount.setValue(doc_amount);
      const cessAmount = parseFloat(data.sale_return_order.cess_amount || 0);
      const taxAmount = parseFloat(data.sale_return_order.tax_amount || 0);
      // const advanceAmount = parseFloat(data.sale_return_order.advance_amount || 0);

      const total_amount = (totalAmount + cessAmount + taxAmount) - totalDiscount;
      controls.sale_return_order.controls.total_amount.setValue(total_amount);

    }
    //const 

    // const cess_amount = data;
    // if (cess_amount && doc_amount) {
    //   field.form.controls.doc_amount.setValue(parseInt(doc_amount) - parseInt(cess_amount));
    // }
  }
}
}