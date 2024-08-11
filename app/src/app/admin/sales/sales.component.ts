import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { distinctUntilChanged } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
  @ViewChild('salesForm', { static: false }) salesForm: TaFormComponent | undefined;
  @ViewChild('ordersModal', { static: true }) ordersModal: ElementRef;
  orderNumber: any;
  showSaleOrderList: boolean = false;
  showForm: boolean = false;
  SaleOrderEditID: any;
  productOptions: any;
  customerDetails: Object;
  customerOrders: any[] = []; 
  showOrderListModal = false;
  selectedOrder: any;
  noOrdersMessage: string;
  
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
    this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[8].hide = true;
    // console.log("---------",this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1])
  }


  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  editSaleOrder(event) {
    this.SaleOrderEditID = event;
    this.http.get('sales/sale_order/' + event).subscribe((res: any) => {
      if (res && res.data) {

        this.formConfig.model = res.data;
        // set sale_order default value
        this.formConfig.model['sale_order']['order_type'] = 'sale_order';
        // set labels for update
        // show form after setting form values
        this.formConfig.pkId = 'sale_order_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['sale_order_id'] = this.SaleOrderEditID;
        this.showForm = true;
        this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[8].hide = false;
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

  showOrdersList() {
    const selectedCustomerId = this.formConfig.model.sale_order.customer_id;
    this.noOrdersMessage = 'Please select a customer.';
  
    if (!selectedCustomerId) {
      // alert('Please select a customer first.');
      this.showOrderListModal = true;
      return;
    }
  
    this.customerOrders = [];
    this.noOrdersMessage = '';
  
    this.getOrdersByCustomer(selectedCustomerId).pipe(
      switchMap(orders => {
        if (orders.count === 0) {
          this.noOrdersMessage = 'No Past orders for the selected customer.';
          this.showOrderListModal = true; // Set to true to show the message in the modal
          return [];
        }
  
        const detailedOrderRequests = orders.data.map(order =>
          this.getOrderDetails(order.sale_order_id).pipe(
            tap(orderDetails => {
              order.productsList = orderDetails.data.sale_order_items.map(item => ({
                product_name: item.product?.name ?? 'Unknown Product',
                quantity: item.quantity
              }));
            })
          )
        );
  
        return forkJoin(detailedOrderRequests).pipe(
          tap(() => {
            this.customerOrders = orders.data;
            this.showOrderListModal = true;
          })
        );
      })
    ).subscribe();
  }
  
  

  getOrdersByCustomer(customerId: string): Observable<any> {
    const url = `http://195.35.20.172:8000/api/v1/sales/sale_order_search/?customer_id=${customerId}`;
    return this.http.get<any>(url);
  }

  getOrderDetails(orderId: string): Observable<any> {
    const url = `http://195.35.20.172:8000/api/v1/sales/sale_order/${orderId}/`;
    return this.http.get<any>(url);
  }

  selectOrder(order: any) {
    console.log('Selected Order:', order);
    this.handleOrderSelected(order); // Handle order selection
  }

  handleOrderSelected(order: any) {
    this.selectedOrder = order;
    this.editSaleOrder(order.sale_order_id); // Navigate to edit view
    this.hideModal(); // Close modal
  }

  loadOrderDetails(orderId: string) {
    this.getOrderDetails(orderId).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.formConfig.model = res.data;
          this.formConfig.model['sale_order']['order_type'] = 'sale_order';
          this.formConfig.pkId = 'sale_order_id';
          this.formConfig.model['sale_order_id'] = orderId;
          console.log('Order details loaded:', this.formConfig.model);
        }
      },
      (error) => {
        console.error('Error fetching order details:', error);
      }
    );
  }

  closeModal() {
    this.hideModal(); // Use the hideModal method to remove the modal elements
  }

  hideModal() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
    this.ordersModal.nativeElement.classList.remove('show');
    this.ordersModal.nativeElement.style.display = 'none';
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  ngOnDestroy() {
    // Ensure modals are disposed of correctly
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
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
          value: 'data.sale_order_items.map(m=> {m.product_id = m.product.product_id;  return m ;})'
        }
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
        sale_order: {},
        sale_order_items: [{}, {}, {}, {}, {}],
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
              }
            },
            {
              key: 'sale_type',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Sale type',
                dataKey: 'name',
                dataLabel: "name",
                options: [],
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
              props: {
                label: 'Customer',
                dataKey: 'customer_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'customers/customers/?summary=true',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    console.log("customer", data);
                    if (data && data.customer_id) {
                      this.formConfig.model['sale_order']['customer_id'] = data.customer_id;
                    }
                    if (data.customer_addresses && data.customer_addresses.billing_address) {
                      field.form.controls.billing_address.setValue(data.customer_addresses.billing_address)
                    }
                    if (data.customer_addresses && data.customer_addresses.shipping_address) {
                      field.form.controls.shipping_address.setValue(data.customer_addresses.shipping_address)
                    }
                    if (data.email) {
                      field.form.controls.email.setValue(data.email)
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
                placeholder: 'Enter Email'
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
                placeholder: 'Enter Ref No'
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
                ]
              },
              hooks: {
                onInit: (field: any) => {
                }
              }
            },
            {
              key: 'billing_address',
              type: 'textarea',
              className: 'col-3',
              templateOptions: {
                label: 'Billing address',
                placeholder: 'Enter Billing address'
              }
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'col-3',
              templateOptions: {
                label: 'Shipping address',
                placeholder: 'Enter Shipping address'
              }
            }
          ]
        },
        {
          key: 'sale_order_items',
          type: 'table',
          className: 'custom-form-list',
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
                  options: [],
                  required: false,
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
                      if (field.form && field.form.controls && field.form.controls.code && data && data.code) {
                        field.form.controls.code.setValue(data.code)
                      }
                      if (field.form && field.form.controls && field.form.controls.rate && data && data.mrp) {
                        field.form.controls.rate.setValue(field.form.controls.rate.value || data.sales_rate)
                      }
                      if (field.form && field.form.controls && field.form.controls.discount && data && data.dis_amount) {
                        field.form.controls.discount.setValue(parseFloat(data.dis_amount))
                      }
                      if (field.form && field.form.controls && field.form.controls.unit_options_id && data && data.unit_options && data.unit_options.unit_name) {
                        field.form.controls.unit_options_id.setValue(data.unit_options.unit_options_id)
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
                  }
                }
              },
              {
                type: 'input',
                key: 'code',
                templateOptions: {
                  label: 'Code',
                  placeholder: 'Enter code',
                  hideLabel: true,
                }
              },
              {
                type: 'input',
                key: 'total_boxes',
                templateOptions: {
                  type: 'number',
                  label: 'Total Boxes',
                  placeholder: 'Enter Total Boxes',
                  hideLabel: true
                },
              },
              {
                type: 'select',
                key: 'unit_options_id',
                templateOptions: {
                  label: 'Unit',
                  placeholder: 'Select Unit',
                  hideLabel: true,
                  dataLabel: 'unit_name',
                  dataKey: 'unit_options_id',
                  bindId: true,
                  lazy: {
                    url: 'masters/unit_options',
                    lazyOneTime: true
                  }
                },
              },
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
                templateOptions: {
                  type: 'number',
                  label: 'Rate',
                  placeholder: 'Enter Rate',
                  hideLabel: true,
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {

                      if (field.form && field.form.controls && field.form.controls.quantity && data) {
                        const quantity = field.form.controls.quantity.value;
                        const rate = data;
                        if (rate && quantity) {
                          field.form.controls.amount.setValue(parseInt(rate) * parseInt(quantity));
                        }
                      }
                    })
                  }
                }
              },
              {
                type: 'input',
                key: 'discount',
                templateOptions: {
                  type: 'number',
                  placeholder: 'Enter Disc',
                  label: 'Disc',
                  hideLabel: true,
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                    })
                  }
                },
                expressionProperties: {
                }
              },
              {
                type: 'input',
                key: 'print_name',
                templateOptions: {
                  label: 'Print name',
                  placeholder: 'Enter Product Print name',
                  hideLabel: true
                },
              },
              {
                type: 'input',
                key: 'mrp',
                templateOptions: {
                  label: 'Mrp',
                  placeholder: 'Mrp',
                  hideLabel: true,
                  disabled: true
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
                },
                hooks: {
                  onInit: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      this.totalAmountCal();
                    })
                  }
                }
              },
              {
                type: 'input',
                key: 'tax',
                templateOptions: {
                  type: "number",
                  label: 'Tax',
                  placeholder: 'Tax',
                  hideLabel: true
                },
              },
              {
                type: 'input',
                key: 'remarks',
                templateOptions: {
                  label: 'Remarks',
                  placeholder: 'Enter Remarks',
                  hideLabel: true
                },
              },

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
                    }
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
                        {
                          template: '<div class="custom-form-card-title"> Billing Details </div>',
                          fieldGroupClassName: "ant-row",
                        },
                        {
                          fieldGroupClassName: "ant-row",
                          key: 'sale_order',
                          fieldGroup: [


                            {
                              key: 'total_boxes',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                type: 'number',
                                label: 'Total boxes',
                                placeholder: 'Enter Total boxes'
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
                                placeholder: 'Enter Cess amount'
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();

                                  })
                                }
                              }
                            },
                            {
                              key: 'advance_amount',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                type: 'number',
                                label: 'Advance amount',
                                placeholder: 'Enter Advance amount'
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();
                                  })
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
                                placeholder: 'Enter Taxable'
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
                                placeholder: 'Enter Tax amount'
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();
                                  })
                                }
                              }
                            },

                            {
                              key: 'gst_type',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Gst type',
                                placeholder: 'Select Gst type',
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
                              templateOptions: {
                                label: 'Payment term',
                                placeholder: 'Select Payment term',
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
                                      if (saleOrder.order_status && saleOrder.order_status.status_name === 'Approved') {
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
                                            total_amount: saleOrder.total_amount,
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
                                readonly: true
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
                          }
                        }
                      ]
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

  totalAmountCal() {
    const data = this.formConfig.model;
    if (data) {
      const products = data.sale_order_items || [];
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


      if (this.salesForm && this.salesForm.form && this.salesForm.form.controls) {
        const controls: any = this.salesForm.form.controls;
        controls.sale_order.controls.item_value.setValue(totalAmount);
        controls.sale_order.controls.dis_amt.setValue(totalDiscount);
        // const doc_amount = (totalAmount + parseFloat(data.sale_order.cess_amount || 0) + parseFloat(data.sale_order.tax_amount || 0)) - totalDiscount;
        // controls.sale_order.controls.doc_amount.setValue(doc_amount);
        const cessAmount = parseFloat(data.sale_order.cess_amount || 0);
        const taxAmount = parseFloat(data.sale_order.tax_amount || 0);
        const advanceAmount = parseFloat(data.sale_order.advance_amount || 0);

        const total_amount = (totalAmount + cessAmount + taxAmount) - totalDiscount - advanceAmount;
        controls.sale_order.controls.total_amount.setValue(total_amount);

      }
      //const 

      // const cess_amount = data;
      // if (cess_amount && doc_amount) {
      //   field.form.controls.doc_amount.setValue(parseInt(doc_amount) - parseInt(cess_amount));
      // }
    }
  }

}
