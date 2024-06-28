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
    submit: {
    },
    model: {},
    fields: [
      {

        fieldGroupClassName: "ant-row",
        fieldGroup: [
          {
            key: 'order_no',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Order no',
              placeholder: 'Enter Order No',
              // required: true,
            },
            hooks: {
              onInit: (field: any) => {
                // field.form.controls.order_no.setValue(this.orderNumber)
                // field.form.controls.order_no.value = this.orderNumber;
              }
            }
          },
          {
            key: 'sale_type_id',
            type: 'select',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Sale type',
              options: [],
              // required: true
            }
          },
          {
            key: 'customer',
            type: 'select',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Customer',
              dataKey: 'name',
              dataLabel: "name",
              options: [],
              lazy: {
                url: 'customers/customers/?summary=true',
                lazyOneTime: true
              },
              // required: true,

            },
            hooks: {
              onChanges: (field: any) => {
                field.formControl.valueChanges.subscribe(data => {
                  console.log("data", data)

                  if (field.form && field.form.controls && field.form.controls.customer_id) {
                    field.form.controls.customer_id.setValue(data.customer_id)
                  }
                  if (field.form && field.form.controls && field.form.controls.customer_address_id) {
                    field.form.controls.customer_address_id.setValue(data.customer_category_id)
                  }
                  if (field.form && field.form.controls && field.form.controls.email) {
                    field.form.controls.email.setValue(data.email)
                  }
                });
                // field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'email',
            type: 'input',
            defaultValue: "",
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
            key: 'delivery_date',
            type: 'date',
            defaultValue: new Date(),
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'date',
              label: 'Delivery date',
              // placeholder: 'Select Oder Date',
              // required: true
            }
          },
          {
            key: 'order_date',
            type: 'date',
            defaultValue: new Date(),
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'date',
              label: 'Order date',
              // placeholder: 'Select Order Date',
              // required: true
            }
          },
          {
            key: 'ref_no',
            type: 'input',
            defaultValue: "",
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
            defaultValue: new Date(),
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'date',
              label: 'Ref date',
              placeholder: 'Select Ref date',
              // required: true
            }
          },
          {
            key: 'tax_type',
            type: 'select',
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
            className: 'ant-col-11 pr-md m-3',
            templateOptions: {
              label: 'Billing address',
              placeholder: 'Enter Billing address',
              // required: true,
            }
          },
          {
            key: 'invoice_address',
            type: 'textarea',
            className: 'ant-col-11 pr-md m-3',
            templateOptions: {
              label: 'Invoice address',
              placeholder: 'Enter Invoice address',
              // required: true,
            }
          },
          {
            key: 'items',
            type: 'table',
            defaultValue: [{}],
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
                        dataKey: 'name',
                        dataLabel: 'name',
                        options: [],
                        // required: true,
                        lazy: {
                          url: 'products/products/?summary=true',
                          lazyOneTime: true
                        }
                      },
                      hooks: {
                        onChanges: (field: any) => {
                          field.formControl.valueChanges.subscribe(data => {
                            console.log("products data", data)

                            if (field.form && field.form.controls && field.form.controls.description) {
                              field.form.controls.description.setValue(data.sales_description)
                            }
                            if (field.form && field.form.controls && field.form.controls.mrp) {
                              field.form.controls.mrp.setValue(data.mrp)
                            }
                            if (field.form && field.form.controls && field.form.controls.discount) {
                              field.form.controls.discount.setValue(data.dis_amount)
                            }
                            if (field.form && field.form.controls && field.form.controls.unit) {
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
                      },
                      // hooks: {
                      //   onInit: (field: any) => {
                      //     // const quntityControl = field.parent.formControl.controls.quantity;
                      //     field.form.get('item').valueChanges.pipe(
                      //       distinctUntilChanged()
                      //     ).subscribe((data: any) => {
                      //       if (data && data.sale_price)
                      //         field.formControl.setValue(data.sale_price);

                      //     });

                      //   }
                      // }
                    },
                    {
                      type: 'number',
                      key: 'mrp',
                      className: 'ant-col-3 pr-md',
                      defaultValue: 0,
                      templateOptions: {
                        label: 'Price',
                        placeholder: 'Enter Price',
                        // min: 1,
                        // required: true
                      },
                    },
                    {
                      type: 'input',
                      key: 'discount',
                      className: 'ant-col-3 pr-md',
                      // defaultValue: 0,
                      templateOptions: {
                        placeholder: 'Enter Discount',
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
                      },
                      // hooks: {
                      //   onInit: (field: any) => {
                      //     // const quntityControl = field.parent.formControl.controls.quantity;
                      //     const pModel = field.parent.parent.parent.parent.model;
                      //     field.form.get('price').valueChanges.pipe(
                      //       distinctUntilChanged()
                      //     ).subscribe((data: any) => {
                      //       if (pModel.lco && pModel.warehouse && pModel.lco && pModel.lco.state && pModel.lco.state.code !== pModel.warehouse.state.code) {
                      //         const m = field.model;
                      //         const v = ((m.price * m.quantity) / 100) * 18;
                      //         field.formControl.setValue(v);
                      //       } else {
                      //         field.formControl.setValue(0);
                      //       }
                      //     });
                      //     field.form.get('quantity').valueChanges.pipe(
                      //       distinctUntilChanged()
                      //     ).subscribe((data: any) => {
                      //       if (pModel.lco && pModel.warehouse && pModel.lco && pModel.lco.state && pModel.lco.state.code !== pModel.warehouse.state.code) {
                      //         const m = field.model;
                      //         const v: number = ((m.price * m.quantity) / 100) * 18;
                      //         field.formControl.setValue(v);
                      //       } else {
                      //         field.formControl.setValue(0);
                      //       }
                      //     });

                      //   }
                      // }
                    },
                    {
                      type: 'input',
                      key: 'total',
                      className: 'ant-col-3 pr-md',
                      defaultValue: 1,
                      templateOptions: {
                        type: 'number',
                        label: 'Quantity',
                        placeholder: 'Enter Quantity',
                        // required: true
                      },
                      // hooks: {
                      //   onInit: (field: any) => {
                      //     // const quntityControl = field.parent.formControl.controls.quantity;
                      //     field.form.get('price').valueChanges.pipe(
                      //       distinctUntilChanged()
                      //     ).subscribe((data: any) => {
                      //       const m = field.model;
                      //       const v: number = (m.price * m.quantity) + m.cgst + m.cgst;
                      //       field.formControl.setValue(v);
                      //     });
                      //     field.form.get('quantity').valueChanges.pipe(
                      //       distinctUntilChanged()
                      //     ).subscribe((data: any) => {
                      //       const m = field.model;
                      //       const v = (m.price * m.quantity) + m.cgst + m.cgst;
                      //       field.formControl.setValue(v);
                      //     });

                      //   }
                      // }
                    }
                  ]
                }
              ],
            },
          },
          {
            key: 'remarks',
            type: 'textarea',
            className: 'ant-col-16 pr-md m-3',
            templateOptions: {
              label: 'Remarks',
              placeholder: 'Enter Remarks',
              // required: true,
            }
          },
          {
            key: 'item_value',
            type: 'input',
            defaultValue: "",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Item value',
              placeholder: 'Enter Item value',
              // required: true
            }
          },
          {
            key: 'vehicle_name',
            type: 'input',
            defaultValue: "",
            className: 'ant-col-16 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Vehicle name',
              placeholder: 'Enter Vehicle name',
              // required: true
            }
          },
          {
            key: 'dis_amt',
            type: 'input',
            defaultValue: "",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Discount amt',
              placeholder: 'Enter Discount amt',
              // required: true
            }
          },
          {
            key: 'total_boxes',
            type: 'input',
            defaultValue: "",
            className: 'ant-col-16 pr-md m-3',
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
            defaultValue: "",
            className: 'ant-col-4 pr-md m-3',
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
            defaultValue: "",
            className: 'ant-col-16 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Advance amount',
              placeholder: 'Enter Advance amount',
              // required: true
            }
          },
          {
            key: 'discount',
            type: 'input',
            defaultValue: "",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Discount',
              placeholder: 'Enter Discount',
              // required: true
            }
          },
          {
            key: 'taxable',
            type: 'input',
            defaultValue: "",
            className: 'ant-col-4 pr-md m-3',
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
            defaultValue: "",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Tax amount',
              placeholder: 'Enter Tax amount',
              // required: true
            }
          },
          {
            key: 'round_off',
            type: 'input',
            defaultValue: "",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Round off',
              placeholder: 'Enter Round off',
              // required: true
            }
          },
          {
            key: 'doc_amount',
            type: 'input',
            defaultValue: "",
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              type: 'input',
              label: 'Doc amount',
              placeholder: 'Enter Doc amount',
              // required: true
            }
          },
          {
            key: 'gst_type_id',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Gst type id',
              placeholder: 'Enter Gst type id',
              // required: true
            }
          },
          {
            key: 'payment_term_id',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Payment term id',
              placeholder: 'Enter Payment term id',
              // required: true
            }
          },
          {
            key: 'ledger_account_id',
            type: 'select',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              dataKey: 'name',
              dataLabel: "name",
              label: 'Ledger account id',
              placeholder: 'Enter Ledger account id',
              // required: true,
              lazy: {
                url: 'masters/ledger_groups/',
                lazyOneTime: true
              }
            },
            hooks: {
            }
          },
          {
            key: 'order_status_id',
            type: 'input',
            className: 'ant-col-4 pr-md m-3',
            templateOptions: {
              label: 'Order status id',
              placeholder: 'Enter Order status id',
              // required: true
            }
          },
        ]
      }
    ]

  };

  getOrderNo() {
    this.http.get('masters/generate_order_no/?type=SO').subscribe((res: any) => {
      console.log(res);
      if (res && res.data && res.data.order_number) {
        this.formConfig.model.order_no = res.data.order_number;
        this.orderNumber = res.data.order_number;
        this.formConfig.model = this.sampleDataForSaleOrder;
      }
    })
  }

  sampleDataForSaleOrder = {
    "sale_order": {
      "email": "testing@example.com",
      "delivery_date": "2024-02-02",
      "order_date": "2024-02-02",
      "order_no": "SO-2406-000905",
      "ref_no": "7777700",
      "ref_date": "2024-02-02",
      "tax": "Exclusive",
      "remarks": "This is a remark",
      "advance_amount": "77777.00",
      "item_value": "777770.00",
      "discount": "77777.00",
      "dis_amt": "777770.00",
      "taxable": "777770.00",
      "tax_amount": "777770.00",
      "cess_amount": "77777.00",
      "round_off": "7777700.25",
      "doc_amount": "7777700.25",
      "vehicle_name": "bike",
      "total_boxes": 77777,
      "shipping_address": "777770 Shipping St, Shipping City, SC, USA",
      "billing_address": "777770 Billing St, Billing City, BC, USA",
      "order_type": "sale_order",
      "gst_type_id": "888ddb1b-5d74-4051-903f-171e2b4f9aab",
      "customer_id": "39534bd5-2062-491f-bc24-9f2393b7fd4b",
      "customer_address_id": null,
      "payment_term_id": "3b4cc23d-6dc3-42e9-9894-02624fdf9934",
      "sale_type_id": "d4d85a98-a703-4772-8b3c-736fc4cbf849",
      "ledger_account_id": null,
      "order_status_id": "0d790583-50b3-4bb7-930c-c99f2d2fe526"
    },
    "sale_order_items": [
      {
        "quantity": "777770.00",
        "unit_price": "77777.00",
        "rate": "77777.00",
        "amount": "77777.00",
        "discount_percentage": "100.00",
        "discount": "100.00",
        "dis_amt": "100.00",
        "tax_code": "77777",
        "tax_rate": "777770.22",
        "product_id": "1963ecfb-c647-41b7-81bc-86769a2b1d4b"
      },
      {
        "quantity": "777770.00",
        "unit_price": "77777.00",
        "rate": "77777.00",
        "amount": "77777.00",
        "discount_percentage": "100.00",
        "discount": "100.00",
        "dis_amt": "100.00",
        "tax_code": "77777",
        "tax_rate": "777770.22",
        "product_id": "04720e1d-bb3a-4668-9fb8-017d5a2fc63d"
      }
    ],
    "order_attachments": [
      {
        "attachment_name": "image",
        "attachment_path": "/folder/folder/image.png"
      },
      {
        "attachment_name": "photo",
        "attachment_path": "/folder/folder/photo.jpg"
      }
    ],
    "order_shipments": {
      "destination": "ndd",
      "shipping_tracking_no": "Trc11903",
      "shipping_date": "2024-06-22",
      "shipping_charges": "120.00",
      "vehicle_vessel": "not hhhh",
      "charge_type": "best",
      "document_through": "mail",
      "port_of_landing": "hh",
      "port_of_discharge": "hh",
      "no_of_packets": 2,
      "weight": "200.00",
      "shipping_mode_id": "4d6345b2-d388-4a48-a01b-80cde0a9afa1",
      "shipping_company_id": "3c334a08-d854-4a00-9b99-fa3ab6b80d6b"
    }
  };

}
