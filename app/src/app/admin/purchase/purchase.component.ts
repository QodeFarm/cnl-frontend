import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent {
  orderNumber: any;
  showPurchaseOrderList: boolean = false;
  showForm: boolean = false;
  PurchaseOrderEditID: any;
  productOptions: any;

  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.showPurchaseOrderList = false;
    this.showForm = true;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

    // set purchase_order default value
    this.formConfig.model['purchase_order_data']['order_type'] = 'purchase_order';

    // to get PurchaseOrder number for save
    this.getOrderNo();
  }
  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editPurchaseOrder(event) {
    console.log('event', event);
    this.PurchaseOrderEditID = event;
    this.http.get('purchase/purchase_order/' + event).subscribe((res: any) => {
      console.log('--------> res ', res);
      if (res && res.data) {

        this.formConfig.model = res.data;
        // set purchase_order default value
        this.formConfig.model['purchase_order_data']['order_type'] = 'purchase_order';
        // set labels for update
        this.formConfig.submit.label = 'Update';
        // show form after setting form values

        // this.formConfig.url= "sales/purchase_order/" + this.PurchaseOrderEditID;
        this.formConfig.pkId = 'purchase_order_id';

        this.formConfig.model['purchase_order_id'] = this.PurchaseOrderEditID;
        this.showForm = true;
      }
    })
    this.hide();
  }

  getOrderNo() {
    // this.formConfig.reset()
    this.orderNumber = null;
    this.http.get('masters/generate_order_no/?type=PO').subscribe((res: any) => {
      console.log(res);
      if (res && res.data && res.data.order_number) {
        this.formConfig.model['purchase_order_data']['order_no'] = res.data.order_number;
        this.orderNumber = res.data.order_number;
        console.log("PurchaseOrder NO: ", this.orderNumber);
        console.log("get PurchaseOrder number called");

        // set purchase_order default value
        // this.formConfig.model['purchase_order']['order_type'] = 'purchase_order';
      }
    })
  }

  showPurchaseOrderListFn() {
    this.showPurchaseOrderList = true;
  }

  setFormConfig() {
    this.formConfig = {
      url: "purchase/purchase_order/",
      title: '',
      formState: {
        viewMode: false
      },
      exParams: [
        {
          key: 'purchase_order_items',
          type: 'script',
          value: 'data.purchase_order_items.map(m=> {m.product_id = m.product.product_id; if(m.product.unit_options){m.unit_options_id = m.product.unit_options.unit_options_id};  if(m.unit_options){m.unit_options_id = m.unit_options.unit_options_id};  return m ;})'
        },
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

      },
      model: {
        purchase_order_data: {},
        purchase_order_items: [{}],
        order_attachments: [],
        order_shipments: {}
      },
      fields: [
        {
          fieldGroupClassName: "ant-row",
          key: 'purchase_order_data',
          fieldGroup: [
            {
              key: 'order_no',
              type: 'input',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Order no',
                placeholder: 'Enter Order No',
                required: true,
                // disabled: true
              },
              hooks: {
                onInit: (field: any) => {
                  // field.form.controls.order_no.setValue(this.orderNumber)
                  // field.form.controls.order_no.value = this.orderNumber;
                }
              },
              // expressionProperties: {
              //   'templateOptions.disabled': this.PurchaseOrderEditID ? 'true' : 'fa'
              // }
            },
            {
              key: 'purchase_type',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              // defaultValue: "d4d85a98-a703-4772-8b3c-736fc4cbf849",
              templateOptions: {
                label: 'Purchase type',
                dataKey: 'purchase_type_id',
                dataLabel: "name",
                options: [],
                // required: true,
                lazy: {
                  url: 'masters/purchase_types/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    console.log("purchase_type", data);
                    if (data && data.purchase_type_id) {
                      this.formConfig.model['purchase_order_data']['purchase_type_id'] = data.purchase_type_id;
                    }
                  });
                }
              }
            },
            {
              key: 'vendor',
              type: 'select',
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                label: 'Vendor',
                dataKey: 'vendor_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'vendors/vendors/?summary=true',
                  lazyOneTime: true
                },
                required: true,

              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    // console.log("vendors", data);
                    if (data && data.vendor_id) {
                      this.formConfig.model['purchase_order_data']['vendor_id'] = data.vendor_id;
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
              key: 'email',
              type: 'input',
              // defaultValue: "testing@example.com",
              className: 'ant-col-4 pr-md m-3',
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
              key: 'advance_amount',
              type: 'input',
              // defaultValue: "7777700",
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'input',
                label: 'ADV.Amount',
                placeholder: 'Enter ADV.Amount',
                // required: true
              }
            },
            {
              key: 'item_value',
              type: 'input',
              // defaultValue: "7777700",
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'input',
                label: 'Amount',
                placeholder: 'Enter Amount',
                // required: true
              }
            },
            {
              key: 'delivery_date',
              type: 'date',
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'date',
                label: 'Delivery date',
                // placeholder: 'Select Oder Date',
                required: true
              }
            },
            {
              key: 'order_date',
              type: 'date',
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'date',
                label: 'Order date',
                // placeholder: 'Select Order Date',
                required: true
              }
            },
            {
              key: 'ref_no',
              type: 'input',
              // defaultValue: "7777700",
              className: 'ant-col-4 pr-md m-3',
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
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
              className: 'ant-col-4 pr-md m-3',
              templateOptions: {
                type: 'date',
                label: 'Ref date',
                placeholder: 'Select Ref date',
                // required: true
              }
            },
            {
              key: 'tax',
              type: 'select',
              // defaultValue: 'Exclusive',
              className: 'ant-col-4 pr-md m-3',
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
              className: 'ant-col-11 pr-md m-3',
              templateOptions: {
                label: 'Billing address',
                placeholder: 'Enter Billing address',
                // required: true,
              }
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'ant-col-11 pr-md m-3',
              // defaultValue: '88652 Shipping St, Shipping City, SC, USA',
              templateOptions: {
                label: 'Shipping address',
                placeholder: 'Enter Shipping address',
                // required: true,
              }
            }
          ]
        },
        // end of purchase_order

        {
          key: 'purchase_order_items',
          type: 'table',
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
                type: 'input',
                key: 'unit',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Unit',
                  placeholder: 'Enter Unit',
                  hideLabel: true,
                  // // required: true
                },
              },
              // quantity amount rate dsc
              {
                type: 'input',
                key: 'quantity',
                // defaultValue: 1000,
                templateOptions: {
                  label: 'Quantity',
                  placeholder: 'Enter Quantity',
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
                key: 'discount',
                // defaultValue: 90,
                templateOptions: {
                  placeholder: 'Enter Discount',
                  // type: 'number',
                  label: 'Discount',
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
                  disabled:true
                  // type: 'number',
                  // // required: true mrp tax 
                },
              },
              {
                type: 'input',
                key: 'total_amount',
                templateOptions: {
                  label: 'Amount',
                  placeholder: 'Enter Amount',
                  hideLabel: true,
                  // type: 'number',
                  // // required: true
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
        // end of purchase_order keys

        // start of order_shipments keys
        
        {
          fieldGroupClassName: "row col-12",
          fieldGroup: [
            {
              className: 'col-6',
              fieldGroup:[
                {
                  template: '<div> <hr> <b> Shipping Details </b> </div>',
                  fieldGroupClassName: "ant-row",
                },
                {
                  fieldGroupClassName: "ant-row",
                  key: 'order_shipments',
                  fieldGroup: [
                    {
                      key: 'destination',
                      type: 'input',
                      className: 'ant-col-10 pr-md m-3',
                      templateOptions: {
                        label: 'Destination',
                        placeholder: 'Enter Destination',
                      }
                    },
                    {
                      key: 'port_of_landing',
                      type: 'input',
                      className: 'ant-col-10 pr-md m-3',
                      templateOptions: {
                        label: 'Port of Landing',
                        placeholder: 'Enter Port of Landing',
                      }
                    },
                    {
                      key: 'shipping_mode_id',
                      type: 'select',
                      className: 'ant-col-10 pr-md m-3',
                      templateOptions: {
                        label: 'Shipping Mode',
                        placeholder: 'Select Shipping Mode',
                      }
                    },
                    {
                      key: 'port_of_discharge',
                      type: 'select',
                      className: 'ant-col-10 pr-md m-3',
                      templateOptions: {
                        label: 'Port of Discharge',
                        placeholder: 'Select Port of Discharge',
                      }
                    },
                    {
                      key: 'shipping_company_id',
                      type: 'input',
                      className: 'ant-col-10 pr-md m-3',
                      templateOptions: {
                        label: 'Shipping Company',
                        placeholder: 'Select Shipping Company',
                      }
                    },
                    {
                      key: 'no_of_packets',
                      type: 'input',
                      className: 'ant-col-10 pr-md m-3',
                      templateOptions: {
                        label: 'No. of Packets',
                        placeholder: 'Select No. of Packets',
                      }
                    },
                    {
                      key: 'shipping_company_address',
                      type: 'textarea',
                      className: 'ant-col-10 pr-md m-3',
                      templateOptions: {
                        label: 'Shipping Company Address',
                        placeholder: 'Enter Shipping Company Address',
                      }
                    },
                    {
                      key: 'weight',
                      type: 'input',
                      className: 'ant-col-10 pr-md m-3',
                      templateOptions: {
                        label: 'Weight',
                        placeholder: 'Enter Weight',
                      }
                    },
                  ]
                },
              ]
            },
            {
              className: 'col-6',
              fieldGroup:[
                // start of purchase_order keys
                {
                  template: '<div> <hr> <b> Billing Details </b> </div>',
                  fieldGroupClassName: "ant-row",
                },
                {
                  fieldGroupClassName: "ant-row",
                  key: 'purchase_order',
                  fieldGroup: [
                    {
                      key: 'total_boxes',
                      type: 'input',
                      // defaultValue: 77777,
                      className: 'ant-col-6 pr-md m-3',
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
                      // defaultValue: "7777700",
                      className: 'ant-col-6 pr-md m-3',
                      templateOptions: {
                        type: 'input',
                        label: 'Cess amount',
                        placeholder: 'Enter Cess amount',
                        // required: true
                      }
                    },
                    {
                      key: 'advance_amount',
                      type: 'input',
                      // defaultValue: "77777.00",
                      className: 'ant-col-6 pr-md m-3',
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
                      className: 'ant-col-6 pr-md m-3',
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
                      // defaultValue: "777770",
                      className: 'ant-col-6 pr-md m-3',
                      templateOptions: {
                        type: 'input',
                        label: 'Tax amount',
                        placeholder: 'Enter Tax amount',
                        // required: true
                      }
                    },
                    // {
                    //   key: 'round_off',
                    //   type: 'input',
                    //   // defaultValue: "7777700",
                    //   className: 'ant-col-6 pr-md m-3',
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
                      className: 'ant-col-6 pr-md m-3',
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
                              this.formConfig.model['purchase_order_data']['gst_type_id'] = data.gst_type_id;
                            }
                          });
                        }
                      }
                    },
                    // {
                    //   key: 'payment_term',
                    //   type: 'select',
                    //   className: 'ant-col-6 pr-md m-3',
                    //   // defaultValue: '3b4cc23d-6dc3-42e9-9894-02624fdf9934',
                    //   templateOptions: {
                    //     label: 'Payment term',
                    //     placeholder: 'Select Payment term',
                    //     // required: true,
                    //     dataKey: 'name',
                    //     dataLabel: "name",
                    //     lazy: {
                    //       url: 'masters/customer_payment_terms/',
                    //       lazyOneTime: true
                    //     }
                    //   },
                    //   hooks: {
                    //     onChanges: (field: any) => {
                    //       field.formControl.valueChanges.subscribe(data => {
                    //         console.log("payment_term", data);
                    //         if (data && data.payment_term_id) {
                    //           this.formConfig.model['purchase_order_data']['payment_term_id'] = data.payment_term_id;
                    //         }
                    //       });
                    //     }
                    //   }
                    // },
                    {
                      key: 'ledger_account',
                      type: 'select',
                      className: 'ant-col-6 pr-md m-3',
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
                              this.formConfig.model['purchase_order_data']['ledger_account_id'] = data.ledger_account_id;
                            }
                          });
                        }
                      }
                    },
                    // {
                    //   key: 'order_type',
                    //   type: 'select',
                    //   // defaultValue: '0d790583-50b3-4bb7-930c-c99f2d2fe526',
                    //   className: 'ant-col-6 pr-md m-3',
                    //   templateOptions: {
                    //     label: 'Order Type',
                    //     dataKey: 'name',
                    //     dataLabel: "name",
                    //     placeholder: 'Select Order type',
                    //     // required: true,
                    //     defaultValue: 'purchase_order',
                    //     lazy: {
                    //       url: 'masters/order_types/',
                    //       lazyOneTime: true
                    //     }
                    //   },
                    //   hooks: {
                    //     onChanges: (field: any) => {
                    //       field.formControl.valueChanges.subscribe(data => {
                    //         console.log("order_type", data);
                    //         if (data.purchase_order) {
                    //           console.log("order_type:", data.name);
                    //           this.formConfig.model['purchase_order_data']['order_type'] = data.purchase_order;
                    //         }
                    //       });
                    //       // if (!field.formControl.value) {
                    //       //   field.formControl.setValue('purchase_order');
                    //       // }
                    //     }
                    //   }
                    // },
                    {
                      key: 'order_status',
                      type: 'select',
                      // defaultValue: '0d790583-50b3-4bb7-930c-c99f2d2fe526',
                      className: 'ant-col-6 pr-md m-3',
                      templateOptions: {
                        label: 'Order status Type',
                        dataKey: 'status_name',
                        dataLabel: "status_name",
                        placeholder: 'Select Order status type',
                        // required: true,
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
                              this.formConfig.model['purchase_order_data']['order_status_id'] = data.order_status_id;
                            }
                          });
                        }
                      }
                    },
                    {
                      key: 'item_value',
                      type: 'input',
                      // defaultValue: "0",
                      className: 'ant-col-6 pr-md m-3',
                      templateOptions: {
                        type: 'input',
                        label: 'Items value',
                        placeholder: 'Enter Item value',
                        // required: true
                      },
                      hooks: {
                        onInit: (field: any) => {
                          field.parent.form.get('purchase_order_items').valueChanges.pipe(
                            distinctUntilChanged()
                          ).subscribe((data: any) => {
                            let sum = 0;
                            data.forEach( d => {
                              if (d.totalAmount){
                                sum += parseInt(d.totalAmount);
                              }
                            });
                            // console.log('sum - ',sum);
                            field.formControl.setValue(sum);
                          });
                        }
                      }
                    },
                    {
                      key: 'dis_amt',
                      type: 'input',
                      // defaultValue: "777770",
                      className: 'ant-col-6 pr-md m-3',
                      templateOptions: {
                        type: 'input',
                        label: 'Discount amount',
                        placeholder: 'Enter Discount amount',
                        // required: true
                      },
                      hooks: {
                        onInit: (field: any) => {
                          field.parent.form.get('purchase_order_items').valueChanges.pipe(
                            distinctUntilChanged()
                          ).subscribe((data: any) => {
                            let totalDiscount = 0;
                            data.forEach( d => {
                              if (d.discount){
                                totalDiscount += parseInt(d.discount);
                              }
                            });
                            // console.log('totalDiscount - ',totalDiscount);
                            field.formControl.setValue(totalDiscount);
                          });
                        }
                      }
                    },
                    {
                      key: 'doc_amount',
                      type: 'input',
                      // defaultValue: "12",
                      className: 'ant-col-6 pr-md m-3',
                      templateOptions: {
                        type: 'input',
                        label: 'Total amount',
                        placeholder: 'Enter Total amount',
                        // required: true
                      },
                      hooks: {
                        onInit: (field: any) => {
                          field.parent.form.get('purchase_order_items').valueChanges.pipe(
                            distinctUntilChanged()
                          ).subscribe((data: any) => {
                            let totalItemsValue = field.form.controls.item_value.value;
                            let totalDiscount = 0;
                            data.forEach( d => {
                              if (d.discount){
                                totalDiscount += parseInt(d.discount);
                              }
                            });
                            // console.log('totalDiscount - ',totalDiscount);
                            // console.log('totalItemsValue - ', totalItemsValue);
                            field.formControl.setValue(totalItemsValue - totalDiscount );
                            
                          });
        
                        }
                      }
                    },
                  ]
                },
              ]
            }
          ]
        },

        {
          fieldGroupClassName: "ant-row",
          fieldGroup: [

            {
              key: 'order_shipments.shipping_tracking_no',
              type: 'input',
              className: 'ant-col-3 pr-md m-3',
              templateOptions: {
                label: 'Shipping Tracking No.',
                placeholder: 'Enter Shipping Tracking No.',
              }
            },
            {
              key: 'order_shipments.shipping_date',
              type: 'date',
              className: 'ant-col-3 pr-md m-3',
              templateOptions: {
                label: 'Shipping Date',
                // placeholder: 'Enter Shipping Tracking No.',
              }
            },
            {
              key: 'order_shipments.shipping_charges',
              type: 'input',
              className: 'ant-col-3 pr-md m-3',
              templateOptions: {
                label: 'Shipping Charges.',
                placeholder: 'Enter Shipping Charges',
              }
            },
            {
              key: 'order_attachments',
              type: 'file',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Order Attachments',
                // // required: true
                // required: true
              }
            },
          ]
        },
      ]
    }
  }

}