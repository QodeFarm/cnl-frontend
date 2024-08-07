import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent {
  @ViewChild('purchaseForm', { static: false }) purchaseForm: TaFormComponent | undefined;
  orderNumber: any;
  showPurchaseOrderList: boolean = false;
  showForm: boolean = false;
  PurchaseOrderEditID: any;
  productOptions: any;

  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.showPurchaseOrderList = false;
    this.showForm = false;
    this.PurchaseOrderEditID = null;
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
        resetFn: () => {
            this.ngOnInit();
          }

      },
      model: {
        purchase_order_data: {},
        purchase_order_items: [{}],
        order_attachments: [],
        order_shipments: {}
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'purchase_order_data',
          fieldGroup: [
            {
              key: 'purchase_type',
              type: 'select',
              className: 'col-2',
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
              className: 'col-2',
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
              key: 'vendor_agent',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Vendor agent',
                dataKey: 'vendor_agent_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'vendors/vendor_agent',
                  lazyOneTime: true
                },
                // required: true,

              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    // console.log("vendors", data);
                    if (data && data.vendor_agent_id) {
                      this.formConfig.model['purchase_order_data']['vendor_agent_id'] = data.vendor_agent_id;
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
              key: 'order_no',
              type: 'input',
              className: 'col-2',
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
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
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
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
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
              defaultValue: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Ref date',
                placeholder: 'Select Ref date',
                readonly: true,
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
            },
            {
              key: 'remarks',
              type: 'textarea',
              // defaultValue: "testing@example.com",
              className: 'col-3',
              templateOptions: {
                type: 'input',
                label: 'Remarks',
                placeholder: 'Enter Remarks',
                // required: true
              },
              hooks: {
                onInit: (field: any) => { }
              }
            }
          ]
        },
        // end of purchase_order

        {
          key: 'purchase_order_items',
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
                  disabled:true
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
        // end of purchase_order keys

        // start of order_shipments keys
        
        {
          fieldGroupClassName: "row col-12 m-0 custom-form-card",
          fieldGroup: [
            {
              className: 'col-6 custom-form-card-block',
              fieldGroup:[
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
                      type: 'select',
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
                          // start of purchase_order_data keys
                          {
                            template: '<div class="custom-form-card-title"> Billing Details </div>',
                            fieldGroupClassName: "ant-row",
                          },
                          {
                            fieldGroupClassName: "ant-row",
                            key: 'purchase_order_data',
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
                              this.formConfig.model['purchase_order_data']['gst_type_id'] = data.gst_type_id;
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
                          url: 'vendors/vendor_payment_terms/',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe(data => {
                            console.log("payment_term", data);
                            if (data && data.payment_term_id) {
                              this.formConfig.model['purchase_order_data']['payment_term_id'] = data.payment_term_id;
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
                              this.formConfig.model['purchase_order_data']['ledger_account_id'] = data.ledger_account_id;
                            }
                          });
                        }
                      },
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
                      className: 'col-4',
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
                          // field.parent.form.get('purchase_order_items').valueChanges.pipe(
                          //   distinctUntilChanged()
                          // ).subscribe((data: any) => {
                          //   let sum = 0;
                          //   data.forEach( d => {
                          //     if (d.totalAmount){
                          //       sum += parseInt(d.totalAmount);
                          //     }
                          //   });
                          //   // console.log('sum - ',sum);
                          //   field.formControl.setValue(sum);
                          // }); 
                        }
                      }
                    },
                    {
                      key: 'discount',
                      type: 'input',
                      // defaultValue: "777770",
                      className: 'col-4',
                      templateOptions: {
                        type: 'input',
                        label: 'Discount',
                        placeholder: 'Enter Discount',
                        // required: true
                      }
                    },
                    {
                      key: 'dis_amt',
                      type: 'input',
                      // defaultValue: "777770",
                      className: 'col-4',
                      templateOptions: {
                        type: 'input',
                        label: 'Disc Amt',
                        readonly: true,
                        placeholder: 'Enter Discount Amt',
                        // required: true
                      },
                      hooks: {
                        onInit: (field: any) => {
                          // field.parent.form.get('purchase_order_items').valueChanges.pipe(
                          //   distinctUntilChanged()
                          // ).subscribe((data: any) => {
                          //   let totalDiscount = 0;
                          //   data.forEach( d => {
                          //     if (d.discount){
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
                    {
                      key: 'round_off',
                      type: 'input',
                      className: 'col-4',
                      templateOptions: {
                        type: 'input',
                        label: 'Round Off',
                        placeholder: 'Enter Round Off',
                      }
                    }
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
const products = data.purchase_order_items || [];
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


if (this.purchaseForm && this.purchaseForm.form && this.purchaseForm.form.controls) {
const controls: any = this.purchaseForm.form.controls;
controls.purchase_order_data.controls.item_value.setValue(totalAmount);
controls.purchase_order_data.controls.dis_amt.setValue(totalDiscount);
const doc_amount = (totalAmount + parseFloat(data.purchase_order_data.cess_amount || 0) + parseFloat(data.purchase_order_data.tax_amount || 0)) - totalDiscount;
controls.purchase_order_data.controls.doc_amount.setValue(doc_amount);

}
//const 

// const cess_amount = data;
// if (cess_amount && doc_amount) {
//   field.form.controls.doc_amount.setValue(parseInt(doc_amount) - parseInt(cess_amount));
// }
}
}

}
