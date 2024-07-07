import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
  orderNumber: any;
  showSaleOrderList: boolean = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getOrderNo()
  }

  formConfig: TaFormConfig = {
    url: "sales/sale_order/",
    title: '',
    formState: {
      viewMode: false
    },
    exParams: [
      {
        key: 'sale_order_items',
        type: 'script',
        value: 'data.sale_order_items.map(m=> {m.product_id = m.product.product_id; return m ;})'
      }
    ],
    submit: {
    },
    model: {
      sale_order: {},
      sale_order_items: [{}],
      order_attachments: [],
      order_shipments: {}
    },
    fields: [
      {
        fieldGroupClassName: "ant-row",
        key: 'sale_order',
        fieldGroup: [
          {
            key: 'order_no',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Order no',
              placeholder: 'Enter Order No',
              required: true,
            },
            hooks: {
              onInit: (field: any) => {
                // field.form.controls.order_no.setValue(this.orderNumber)
                // field.form.controls.order_no.value = this.orderNumber;
              }
            }
          },
          {
            key: 'sale_type',
            type: 'select',
            className: 'ant-col-4 pr-md m-3',
            // defaultValue: "d4d85a98-a703-4772-8b3c-736fc4cbf849",
            templateOptions: {
              label: 'Sale type',
              dataKey: 'name',
              dataLabel: "name",
              options: [],
              required: true,
              lazy: {
                url: 'masters/sale_types/',
                lazyOneTime: true
              }
            },
            hooks: {
              onChanges: (field: any) => {
                field.formControl.valueChanges.subscribe(data => {
                  console.log("sale_type", data);
                  if (data.sale_type_id) {
                    this.formConfig.model['sale_order']['sale_type_id'] = data.sale_type_id;
                  }
                });
              }
            }
          },
          {
            key: 'customer',
            type: 'select',
            className: 'ant-col-4 pr-md m-3',
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
                  if (data.customer_id) {
                    this.formConfig.model['sale_order']['customer_id'] = data.customer_id;
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
              required: true
            },
            hooks: {
              onInit: (field: any) => { }
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
              required: true
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
              required: true
            }
          },
          {
            key: 'tax_type',
            type: 'select',
            // defaultValue: 'Exclusive',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Tax',
              options: [
                { 'label': "Inclusive", value: 'Inclusive' },
                { 'label': "Exclusive", value: 'Exclusive' }
              ],
              required: true
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
              required: true,
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
              required: true,
            }
          }
        ]
      },
      // end of sale_order

      {
        key: 'sale_order_items',
        type: 'table',
        // defaultValue: [],
        // fieldGroupClassName: 'table-field pr-md',
        templateOptions: {
          // title: 'Items',
          addText: 'Add Product',
        },
        fieldArray: {
          fieldGroup: [
            {
              fieldGroupClassName: "ant-row",
              fieldGroup: [
                {
                  key: 'product',
                  type: 'select',
                  className: 'ant-col-6 pr-md',
                  templateOptions: {
                    label: 'Select Product',
                    dataKey: 'product_id',
                    dataLabel: 'name',
                    options: [],
                    required: true,
                    lazy: {
                      url: 'products/products/?summary=true',
                      lazyOneTime: true
                    }
                  },
                  hooks: {
                    onChanges: (field: any) => {
                      field.formControl.valueChanges.subscribe(data => {
                        console.log("products data", data)

                        if (field.form && field.form.controls && field.form.controls.description && data.sales_description) {
                          field.form.controls.description.setValue(data.sales_description)
                        }
                        if (field.form && field.form.controls && field.form.controls.mrp && data.mrp) {
                          field.form.controls.mrp.setValue(data.mrp)
                        }
                        if (field.form && field.form.controls && field.form.controls.discount && data.dis_amount) {
                          field.form.controls.discount.setValue(data.dis_amount)
                        }
                        if (field.form && field.form.controls && field.form.controls.unit && data.unit_options && data.unit_options.unit_name) {
                          if (data.unit_options && data.unit_options.unit_name) {
                            field.form.controls.unit.setValue(data.unit_options.unit_name)
                          }
                        }
                      });
                      // field.templateOptions.options = this.cs.getRole();
                    }
                  }
                  // hooks: {
                  //   onInit: (field: any) => {
                  //     let allItems: any = [];
                  //     this.cs.getItems().subscribe(res => {
                  //       allItems = res;
                  //       field.templateOptions.options = allItems;
                  //     });
                  //     const categoryC = field.form.parent.parent.get('category'); //controls[]

                  //     this.cs.getItems().subscribe(res => {
                  //       allItems = res;
                  //       if (allItems) {
                  //         field.templateOptions.options = allItems.filter((item: any) => {
                  //           if (categoryC && categoryC.value && item.value.category.code == categoryC.value.code)
                  //             return item;
                  //         });
                  //       }
                  //     });
                  //     const warehouseC = field.form.parent.parent.get('warehouse');
                  //     warehouseC.valueChanges.pipe(
                  //       distinctUntilChanged()
                  //     ).subscribe((data: any) => {
                  //       field.formControl.setValue(null);
                  //     });
                  //     const lcoC = field.form.parent.parent.get('lco');
                  //     lcoC.valueChanges.pipe(
                  //       distinctUntilChanged()
                  //     ).subscribe((data: any) => {
                  //       field.formControl.setValue(null);
                  //     });
                  //     categoryC.valueChanges.pipe(
                  //       distinctUntilChanged()
                  //     ).subscribe((data: any) => {
                  //       field.formControl.setValue(null);
                  //       if (allItems) {
                  //         field.templateOptions.options = allItems.filter((item: any) => {
                  //           if (item.value && data && item.value.category.code == data.code) {
                  //             return item;
                  //           }
                  //         });
                  //       }
                  //     });

                  //   }
                  // }
                },
                {
                  type: 'input',
                  key: 'description',
                  className: 'ant-col-6 pr-md',
                  // defaultValue: 0,
                  templateOptions: {
                    label: 'Description',
                    placeholder: 'Enter Description',
                    // required: true
                  },
                  expressionProperties: {
                    // 'templateOptions.disabled': (model) => (model.item && model.item.sale_price) ? false : true
                  }
                },
                {
                  type: 'number',
                  key: 'rate',
                  className: 'ant-col-3 pr-md',
                  // defaultValue: 1000,
                  templateOptions: {
                    label: 'Price',
                    placeholder: 'Enter Price',
                    type: 'number',
                    // required: true
                  },
                },
                {
                  type: 'input',
                  key: 'discount',
                  className: 'ant-col-3 pr-md',
                  // defaultValue: 90,
                  templateOptions: {
                    placeholder: 'Enter Discount',
                    type: 'number',
                    label: 'Discount',
                  },
                  expressionProperties: {
                    // 'templateOption6s.disabled': (model) => (model.item && model.item.sale_price) ? false : true
                  }
                },
                {
                  type: 'input',
                  key: 'unit',
                  className: 'ant-col-3 pr-md',
                  templateOptions: {
                    label: 'Unit',
                    placeholder: 'Enter Unit',
                  }
                },
                {
                  type: 'input',
                  key: 'total',
                  className: 'ant-col-3 pr-md',
                  // defaultValue: 23,
                  templateOptions: {
                    type: 'number',
                    label: 'Quantity',
                    placeholder: 'Enter Quantity',
                    // required: true
                  }
                }
              ]
            }
          ],
        },
      },

      // start of sale_order keys

      {
        fieldGroupClassName: "ant-row",
        key: 'sale_order',
        fieldGroup: [

          {
            key: 'remarks',
            type: 'textarea',
            // defaultValue: 'This is a remark',
            className: 'ant-col-16 pr-md m-3',
            templateOptions: {
              label: 'Remarks',
              placeholder: 'Enter Remarks',
              required: true,
            }
          },
          {
            key: 'item_value',
            type: 'input',
            // defaultValue: "777770.00",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Item value',
              placeholder: 'Enter Item value',
              required: true
            }
          },
          {
            key: 'vehicle_name',
            type: 'input',
            // defaultValue: "bike",
            className: 'ant-col-16 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Vehicle name',
              placeholder: 'Enter Vehicle name',
              required: true
            }
          },
          {
            key: 'dis_amt',
            type: 'input',
            // defaultValue: "777770",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Discount amt',
              placeholder: 'Enter Discount amt',
              required: true
            }
          },
          {
            key: 'total_boxes',
            type: 'input',
            // defaultValue: 77777,
            className: 'ant-col-16 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Total boxes',
              placeholder: 'Enter Total boxes',
              required: true
            }
          },
          {
            key: 'cess_amount',
            type: 'input',
            // defaultValue: "7777700",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Cess amount',
              placeholder: 'Enter Cess amount',
              required: true
            }
          },
          {
            key: 'advance_amount',
            type: 'input',
            // defaultValue: "77777.00",
            className: 'ant-col-16 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Advance amount',
              placeholder: 'Enter Advance amount',
              required: true
            }
          },
          {
            key: 'discount',
            type: 'input',
            // defaultValue: "77777",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Discount',
              placeholder: 'Enter Discount',
              required: true
            }
          },
          {
            key: 'taxable',
            type: 'input',
            // defaultValue: "777770",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Taxable',
              placeholder: 'Enter Taxable',
              required: true
            }
          },
          {
            key: 'tax_amount',
            type: 'input',
            // defaultValue: "777770",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Tax amount',
              placeholder: 'Enter Tax amount',
              required: true
            }
          },
          {
            key: 'round_off',
            type: 'input',
            // defaultValue: "7777700",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Round off',
              placeholder: 'Enter Round off',
              required: true
            }
          },
          {
            key: 'doc_amount',
            type: 'input',
            // defaultValue: "12",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Doc amount',
              placeholder: 'Enter Doc amount',
              required: true
            }
          },
          {
            key: 'gst_type',
            type: 'select',
            // defaultValue: "888ddb1b-5d74-4051-903f-171e2b4f9aab",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Gst type',
              placeholder: 'Select Gst type',
              required: true,
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
                  if (data.gst_type_id) {
                    this.formConfig.model['sale_order']['gst_type_id'] = data.gst_type_id;
                  }
                });
              }
            }
          },
          {
            key: 'payment_term',
            type: 'select',
            className: 'ant-col-4 pr-md m-3',
            // defaultValue: '3b4cc23d-6dc3-42e9-9894-02624fdf9934',
            templateOptions: {
              label: 'Payment term',
              placeholder: 'Select Payment term',
              required: true,
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
                  if (data.payment_term_id) {
                    this.formConfig.model['sale_order']['payment_term_id'] = data.payment_term_id;
                  }
                });
              }
            }
          },
          {
            key: 'ledger_account',
            type: 'select',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              dataKey: 'name',
              dataLabel: "name",
              label: 'Ledger account',
              placeholder: 'Select Ledger account',
              required: true,
              lazy: {
                url: 'masters/ledger_groups/',
                lazyOneTime: true
              }
            },
            hooks: {
              onChanges: (field: any) => {
                field.formControl.valueChanges.subscribe(data => {
                  console.log("ledger_account", data);
                  if (data.ledger_account_id) {
                    this.formConfig.model['sale_order']['ledger_account_id'] = data.ledger_account_id;
                  }
                });
              }
            }
          },
          {
            key: 'order_Type',
            type: 'select',
            // defaultValue: '0d790583-50b3-4bb7-930c-c99f2d2fe526',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Order Type',
              dataKey: 'name',
              dataLabel: "name",
              placeholder: 'Select Order type',
              required: true,
              lazy: {
                url: 'masters/order_types/',
                lazyOneTime: true
              }
            },
            hooks: {
              onChanges: (field: any) => {
                field.formControl.valueChanges.subscribe(data => {
                  console.log("order_type", data);
                  if (data.name) {
                    this.formConfig.model['sale_order']['order_type'] = data.name;
                  }
                });
              }
            }
          },
          {
            key: 'order_status',
            type: 'select',
            // defaultValue: '0d790583-50b3-4bb7-930c-c99f2d2fe526',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Order status Type',
              dataKey: 'status_name',
              dataLabel: "status_name",
              placeholder: 'Select Order status type',
              required: true,
              lazy: {
                url: 'masters/order_status/',
                lazyOneTime: true
              }
            },
            hooks: {
              onChanges: (field: any) => {
                field.formControl.valueChanges.subscribe(data => {
                  console.log("order_status", data);
                  if (data.order_status_id) {
                    this.formConfig.model['sale_order']['order_status_id'] = data.order_status_id;
                  }
                });
              }
            }
          }
        ]
      },

      {
        fieldGroupClassName: "ant-row",
        fieldGroup: [
          {
            key: 'order_attachments',
            type: 'file',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Order Attachments',
              // required: true
            }
          },
          {
            key: 'order_shipments',
            type: 'file',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Order Shipments',
              // required: true
            }
          },
        ]
      }
    ]
  } ;

  getOrderNo() {
    this.http.get('masters/generate_order_no/?type=SO').subscribe((res: any) => {
      console.log(res);
      if (res && res.data && res.data.order_number) {
        this.formConfig.model['sale_order']['order_no'] = res.data.order_number;
        this.orderNumber = res.data.order_number;
      }
    })
  }

  showSaleOrderListFn(){
    this.showSaleOrderList = true;
  }

}
