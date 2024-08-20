import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { tap, switchMap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-salesinvoice',
  templateUrl: './salesinvoice.component.html',
  styleUrls: ['./salesinvoice.component.scss']
})
export class SalesinvoiceComponent {
  @ViewChild('saleinvoiceForm', { static: false }) saleinvoiceForm: TaFormComponent | undefined;
  @ViewChild('ordersModal', { static: false }) ordersModal!: ElementRef;
  invoiceNumber: any;
  showSaleInvoiceList: boolean = false;
  showForm: boolean = false;
  SaleInvoiceEditID: any;
  productOptions: any;
  customerOrders: any[] = [];
  noOrdersMessage: string = '';
  selectedOrder: any;
  // noOrdersMessage: string;
  // customerOrders: any[] = []; 

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showSaleInvoiceList = false;
    this.showForm = true;
    this.SaleInvoiceEditID = null;
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

    // set sale_order default value
    this.formConfig.model['sale_invoice_order']['order_type'] = 'sale_invoice';

    // to get SaleInvoice number for save
    this.getInvoiceNo();
    this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[8].hide =true;
    // console.log("---------",this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1])
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
        this.formConfig.pkId = 'sale_invoice_id';
        this.formConfig.submit.label = 'Update';
        // show form after setting form values
        this.formConfig.model['sale_invoice_id'] = this.SaleInvoiceEditID;
        this.showForm = true;
        this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[8].hide = false;
      }
    });
    this.hide();
  }

  getInvoiceNo() {
    this.invoiceNumber = null;
    this.http.get('masters/generate_order_no/?type=SHIP').subscribe((res: any) => {
        if (res && res.data && res.data.order_number) {
            this.formConfig.model['order_shipments']['shipping_tracking_no'] = res.data.order_number;
    this.http.get('masters/generate_order_no/?type=SO-INV').subscribe((res: any) => {
      if (res && res.data && res.data.order_number) {
        this.formConfig.model['sale_invoice_order']['invoice_no'] = res.data.order_number;
        this.invoiceNumber = res.data.order_number;
        console.log("SaleInvoice NO: ", this.invoiceNumber);
        console.log("get SaleInvoice number called");
      }
    });
    }
    });
  }

  showSaleInvoiceListFn() {
    this.showSaleInvoiceList = true;
  }

  showPendingOrdersList() {
    console.log("We are selecting customer here : ");
    const selectedCustomerId = this.formConfig.model.sale_invoice_order.customer_id;
    const selectedCustomerName = this.formConfig.model.sale_invoice_order.customer?.name;

    if (!selectedCustomerId) {
      this.noOrdersMessage = 'Please select a customer.';
      this.customerOrders = [];
      this.openModal();
      return;
    }

    this.customerOrders = [];
    this.noOrdersMessage = '';

    this.getPendingOrdersByCustomer(selectedCustomerId).pipe(
      switchMap(orders => {
        if (orders.count === 0) {
          this.noOrdersMessage = `No Pending orders for ${selectedCustomerName}.`;
          this.customerOrders = [];
          this.openModal();
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
            this.openModal();
          })
        );
      })
    ).subscribe();
  }

  openModal() {
    this.ordersModal.nativeElement.classList.add('show');
    this.ordersModal.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
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

  getPendingOrdersByCustomer(customerId: string): Observable<any> {
    const url = `sales/sale_order_search/?customer_id=${customerId}&status_name=Pending`;
    return this.http.get<any>(url);
  }

  getOrderDetails(orderId: string): Observable<any> {
    const url = `sales/sale_order/${orderId}/`;
    return this.http.get<any>(url);
  }

  selectOrder(order: any) {
    console.log('Selected Order:', order);
    this.handleOrderSelected(order); // Handle order selection
  }

  handleOrderSelected(order: any) {
    this.selectedOrder = order;
    this.editSaleInvoice(order.sale_order_id); // Navigate to edit view
    this.hideModal(); // Close modal
  }

  closeModal() {
    this.hideModal();
  }

  ngOnDestroy() {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  } 



  setFormConfig() {
    this.SaleInvoiceEditID = null;
    this.formConfig = {
      url: "sales/sale_invoice_order/",
      title: '',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'sale_invoice_items',
          type: 'script',
          value: 'data.sale_invoice_items.map(m=> {m.product_id = m.product.product_id;  return m ;})'
        },
      ],
      submit: {
        label: 'Submit',
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
                    if (data && data.customer_id) {
                      this.formConfig.model['sale_invoice_order']['customer_id'] = data.customer_id;
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
                type: 'email',
                label: 'Email',
                placeholder: 'Enter Email',
              },
              hooks: {
                onInit: (field: any) => {}
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
                },
                //required: true,
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    if (data && data.order_salesman_id) {
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
                readonly: true,
                disabled: true
                
              },
              hooks: {
                onInit: (field: any) => {}
              }
            },
            {
              key: 'invoice_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Invoice Date',
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
                placeholder: 'Enter Ref No',
                required: true,
              }
            },
            {
              key: 'ref_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Ref Date',
                placeholder: 'Select Ref date',
                required: true,
                // readonly: true
              }
            },
            {
              key: 'due_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Due Date',
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
                  required: true,
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
                      defaultValue: this.nowDate(),
                      className: 'col-6',
                      templateOptions: {
                        type: 'date',
                        label: 'Shipping Date',
                        required: true
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
                        required: true
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
                          key: 'sale_invoice_order',
                          fieldGroup: [
                            {
                              key: 'total_boxes',
                              type: 'input',
                              className: 'col-4',
                              templateOptions: {
                                type: 'number',
                                label: 'Total boxes',
                                placeholder: 'Enter Total boxes',
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
                              // defaultValue: "77777.00",
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
                                label: 'Order status',
                                placeholder: 'Select Order Status Type',
                                dataKey: 'order_status_id',
                                dataLabel: 'status_name',
                                lazy: {
                                  url: 'masters/order_status/',
                                  lazyOneTime: true
                                },
                                expressions: {
                                  hide: '!model.sale_invoice_id',
                                },
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
        const cessAmount = parseFloat(data.sale_invoice_order.cess_amount || 0);
        const taxAmount = parseFloat(data.sale_invoice_order.tax_amount || 0);
        const advanceAmount = parseFloat(data.sale_invoice_order.advance_amount || 0);

        const total_amount = (totalAmount + cessAmount + taxAmount) - totalDiscount - advanceAmount;
        controls.sale_invoice_order.controls.total_amount.setValue(total_amount);

      }
    }
  }

}
