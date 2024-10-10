import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { tap, switchMap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { OrderslistComponent } from '../orderslist/orderslist.component';
import { SalesInvoiceListComponent } from './salesinvoice-list/salesinvoice-list.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-salesinvoice',
  standalone: true,
  imports: [AdminCommmonModule, OrderslistComponent,
    SalesInvoiceListComponent],
  templateUrl: './salesinvoice.component.html',
  styleUrls: ['./salesinvoice.component.scss']
})
export class SalesinvoiceComponent {
  @ViewChild('saleinvoiceForm', { static: false }) saleinvoiceForm: TaFormComponent | undefined;
  @ViewChild('ordersModal', { static: false }) ordersModal!: ElementRef;
  invoiceNumber: any;
  customerName: string = '';
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

  //COPY ---------------------------------
  // List of all tables
  tables: string[] = ['Sale Order', 'Sale Invoice', 'Sale Return'];

  // This will store available tables excluding the current one
  availableTables: string[] = [];

  // Selected table from dropdown
  selectedTable: string;

  // Variable to store current table name (example for 'Sale Order')
  currentTable: string = 'Sale Invoice'; // Dynamically change this based on your current module

  // Field mapping for auto population
  fieldMapping = {
      'Sale Order': {
          customer: 'customer',  // Add this line for customer_id
          csutomer_id: 'customer_id',
          email: 'email',
          billing_address: 'billing_address',
          shipping_address: 'shipping_address',
          ref_no: 'ref_no',
          tax: 'tax',
          remarks: 'remarks'
      },
      'Sale Return': {
          customer: 'customer', // Assuming the same field name
          customer_id: 'customer_id',  // Add this line for customer_id
          email: 'email',
          shipping_address: 'shipping_address',
          ref_no: 'ref_no',
          tax: 'tax',
          remarks: 'remarks'
      },
      // Add mappings for other tables as needed
  };

  // Method to open the copy modal and populate dropdown
  openCopyModal() {
      this.availableTables = this.tables.filter(table => table !== this.currentTable);
  }

  copyToTable() {
    const dataToCopy = this.formConfig.model.sale_invoice_order; // Get the current form data
    const populatedData = {};

    // Extract only the matching fields based on the selected table
    if (this.selectedTable && this.fieldMapping[this.selectedTable]) {
        for (const key in this.fieldMapping[this.selectedTable]) {
            const sourceField = this.fieldMapping[this.selectedTable][key];
            console.log("Source field : ", sourceField);
            // Get value from the sales form
            populatedData[key] = dataToCopy[sourceField];
        }
    }

    // Log the populated data for debugging
    console.log('Data to copy:', populatedData);

    // Navigate based on the selected table without needing breaks
    if (this.selectedTable === 'Sale Order') {
        this.router.navigate(['admin/sales'], { state: { data: populatedData } });
        console.log("populate data of customer : ", populatedData)
    } else if (this.selectedTable === 'Sale Return') {
        this.router.navigate(['admin/sales/sale-returns'], { state: { data: populatedData } });
    }
    // Add additional cases for other tables if necessary
    else {
        console.error('Unknown table selected');
    }
  }

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  dataToPopulate: any;
  salesInvoiceForm: FormGroup;

  ngOnInit() {
    this.setFormConfig();

    // Subscribe to the route parameters to get the data from the history state
    this.route.paramMap.subscribe(params => {
      this.dataToPopulate = history.state.data; // Retrieve data from history
      console.log('data retrieved:', this.dataToPopulate);

      // Check if dataToPopulate exists and populate the form
      console.log("triggering the data : ")
      if (this.dataToPopulate) {
        console.log("Custome in data : ", this.dataToPopulate.customer?.customer_id)
        // Populate the form with the data received
        this.populateForm(this.dataToPopulate);
        this.formConfig.model['sale_invoice_order']['customer_id'] = this.dataToPopulate.customer?.customer_id;
      }
    });

    this.showSaleInvoiceList = false;
    this.showForm = true;
    this.SaleInvoiceEditID = null;
    // Set sale_order default value
    this.formConfig.model['sale_invoice_order']['order_type'] = 'sale_invoice';

    // To get SaleInvoice number for save
    this.getInvoiceNo();
    this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[8].hide = true;
  }

  populateForm(data: any) {
    console.log("Data in populateform : ", data);
    this.salesInvoiceForm.patchValue({
      customer: {
        customer_id: data.customer?.csutomer_id || '',
        name: data.customer?.name || ''
      },
      customer_id: data.customer?.customer_id || '',  // Handle undefined cases
      email: data.email || '',
      ref_no: data.ref_no || '',
      tax: data.tax || '',
      remarks: data.remarks || '',
      billing_address: data.billing_address || '',
      shipping_address: data.shipping_address || '',
    });

    // Trigger change detection to update the UI if needed
    this.cdRef.detectChanges();
  }

//COPY PART END -------------------------------------------------------------

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
                product_id: item.product?.name,
                product_name: item.product?.name ?? 'Unknown Product',
                quantity: item.quantity,
                code: item.product?.code,
                total_boxes: item.total_boxes,
                unit_options_id: item.unit_options_id,
                rate: item.rate,
                discount: item.discount,
                amount: item.amount,
                tax: item.tax,
                remarks: item.remarks
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
    const saleOrderId = order;
    console.log("order : ", order);
    // if (!saleOrderId) {
    //     console.error('Invalid saleOrderId:', saleOrderId);
    //     return;
    // }
    // Fetch sale invoice details using the saleInvoiceId
    this.http.get(`sales/sale_order/${saleOrderId}`).subscribe((res: any) => {
      if (res && res.data) {
        const orderData = res.data.sale_order;
        const orderItems = res.data.sale_order_items;
        // const invoiceShipments = res.data.order_shipments;

        // Map sale_invoice_order fields to sale_return_order fields
        this.formConfig.model = {
          sale_invoice_order: {
            order_type: this.formConfig.model.sale_invoice_order.order_type || 'sale_invoice',
            invoice_date: this.nowDate(),
            invoice_no: this.formConfig.model.sale_invoice_order.invoice_no,
            ref_no: orderData.ref_no,
            ref_date: orderData.ref_date,
            tax: orderData.tax,
            remarks: orderData.remarks,
            item_value: orderData.item_value,
            discount: orderData.discount,
            dis_amt: orderData.dis_amt,
            taxable: orderData.taxable,
            tax_amount: orderData.tax_amount,
            cess_amount: orderData.cess_amount,
            transport_charges: orderData.transport_charges,
            round_off: orderData.round_off,
            total_amount: orderData.total_amount,
            total_boxes: orderData.total_boxes,
            gst_type: {
              gst_type_id: orderData.gst_type?.gst_type_id,
              name: orderData.gst_type?.name
            },
            payment_term: {
              payment_term_id: orderData.payment_term?.payment_term_id,
              name: orderData.payment_term?.name,
              code: orderData.payment_term?.code,
            },
            ledger_account: {
              ledger_account_id: orderData.ledger_account?.ledger_account_id,
              name: orderData.ledger_account?.name,
              code: orderData.ledger_account?.code,
            },
            customer: {
              customer_id: orderData.customer?.customer_id,
              name: orderData.customer?.name
            },
            email: orderData.email,
            billing_address: orderData.billing_address,
            shipping_address: orderData.shipping_address,
          },
          sale_invoice_items: orderItems,
          order_attachments: res.data.order_attachments,
          order_shipments: res.data.order_shipments
        };

        // Display the form
        this.showForm = true;

        // Trigger change detection to update the form
        this.cdRef.detectChanges();
      }
    }, (error) => {
      console.error('Error fetching order details:', error);
    });

    // Hide the modal
    this.hideModal();
  }

  closeModal() {
    this.hideModal();
  }

  handleProductPull(selectedProducts: any[]) {
    let existingProducts = this.formConfig.model['sale_invoice_items'] || [];

    // Clean up existing products by filtering out any undefined, null, or empty entries
    existingProducts = existingProducts.filter((product: any) => product?.code && product.code.trim() !== "");

    if (existingProducts.length === 0) {
      // Initialize the product list if no products exist
      this.formConfig.model['sale_invoice_items'] = selectedProducts.map(product => ({
        product: {
          product_id: product.product_id || null,
          name: product.product_name || '',  // Ensure the actual product name is set
          code: product.code || '',
        },
        product_id: product.product_id || null,
        code: product.code || '',
        total_boxes: product.total_boxes || 0,
        unit_options_id: product.unit_options_id || null,
        quantity: product.quantity || 1,
        rate: product.rate || 0,
        discount: product.discount || 0,
        print_name: product.print_name || product.product_name || '', // Use print_name only if necessary
        amount: product.amount || 0,
        tax: product.tax || 0,
        remarks: product.remarks || ''
      }));
    } else {
      // Update existing products or add new products
      selectedProducts.forEach(newProduct => {
        const existingProductIndex = existingProducts.findIndex((product: any) =>
          product.product_id === newProduct.product_id || product.code === newProduct.code
        );

        if (existingProductIndex === -1) {
          // Add the product if it doesn't exist in the list
          existingProducts.push({
            product: {
              product_id: newProduct.product_id || null,
              name: newProduct.product_name || '',  // Ensure the actual product name is set
              code: newProduct.code || '',
            },
            product_id: newProduct.product_id || null,
            code: newProduct.code || '',
            total_boxes: newProduct.total_boxes || 0,
            unit_options_id: newProduct.unit_options_id || null,
            quantity: newProduct.quantity || 1,
            rate: newProduct.rate || 0,
            discount: newProduct.discount || 0,
            print_name: newProduct.print_name || newProduct.product_name || '', // Use print_name only if necessary
            amount: newProduct.amount || 0,
            tax: newProduct.tax || 0,
            remarks: newProduct.remarks || ''
          });
        } else {
          // Update the existing product
          existingProducts[existingProductIndex] = {
            ...existingProducts[existingProductIndex],
            ...newProduct,
            product: {
              product_id: newProduct.product_id || existingProducts[existingProductIndex].product.product_id,
              name: newProduct.product_name || existingProducts[existingProductIndex].product.name, // Ensure correct name is set
              code: newProduct.code || existingProducts[existingProductIndex].product.code,
            },
            print_name: newProduct.print_name || newProduct.product_name || existingProducts[existingProductIndex].product.name, // Ensure correct name is shown
          };
        }
      });

      // Assign the updated product list back to the model
      this.formConfig.model['sale_invoice_items'] = [...existingProducts];
    }

    // Re-render the form
    this.formConfig.model = { ...this.formConfig.model };

    // Trigger UI update
    this.cdRef.detectChanges();

    //console.log("Final Products List:", this.formConfig.model['sale_order_items']);
  }

  ngOnDestroy() {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }
    
  setFormConfig() {
    this.SaleInvoiceEditID = null;

    this.salesInvoiceForm = this.fb.group({
      customer: [null], // Add the customer field
      customer_id: [null], // Ensure this is initialized
      email: [null],
      billing_address: [null],
      shipping_address: [null],
      // Add other fields as necessary
    });

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
        {
          key: 'sale_invoice_items',
          type: 'script',
          value: 'data.sale_invoice_items.map(m=> {m.size_id = m.size.size_id;  return m ;})'
        },
        {
          key: 'sale_invoice_items',
          type: 'script',
          value: 'data.sale_invoice_items.map(m=> {m.color_id = m.color.color_id;  return m ;})'
        }
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
        sale_invoice_order: {        
          // customer_id: null,
        },
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
                      this.formConfig.model['sale_invoice_order']['customer_id'] = data.customer_id; // This should be the ID now
                      // this.formConfig.model['sale_invoice_order']['customer'] = data.customer?.name; // Set name if needed
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
                  if (this.dataToPopulate && this.dataToPopulate.customer && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.customer?.customer_id);
                    
                  }
                }
              },
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
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.email && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.email);
                  }
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
                onInit: (field: any) => { }
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
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.ref_no && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.ref_no);
                  }
                }
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
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.tax && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.tax);
                  }
                }
              }
              // hooks: {
              //   onInit: (field: any) => { }
              // }
            },
            {
              key: 'remarks',
              type: 'textarea',
              className: 'col-4',
              templateOptions: {
                label: 'Remarks',
                placeholder: 'Enter Remarks',
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.remarks && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.remarks);
                  }
                }
              }
            },
            {
              key: 'billing_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Billing Address',
                placeholder: 'Enter Billing Address',

              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.billing_address && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.billing_address);
                  }
                }
              }
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Shipping Address',
                placeholder: 'Enter Shipping Address',
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.shipping_address && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.shipping_address);
                  }
                }
              }
            },
          ]
        },
        {
          key: 'sale_invoice_items',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            // title: 'Products',
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
                name: 'size',
                label: 'size'
              },
              {
                name: 'color',
                label: 'color'
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
                      const parentArray = field.parent;

                  // Check if parentArray exists and proceed
                  if (parentArray) {
                    const currentRowIndex = +parentArray.key; // Simplified number conversion
                    
                    // Subscribe to value changes of the field
                    field.formControl.valueChanges.subscribe(selectedProductId => {
                      const product = this.formConfig.model.sale_invoice_items[currentRowIndex]?.product;

                      // Check if a valid product is selected
                      if (product?.product_id) {
                        const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;

                        if (cardWrapper) {
                          // Remove existing product info if present
                          cardWrapper.querySelector('.center-message')?.remove();

                          // Create and insert new product info
                          const productInfoDiv = document.createElement('div');
                          productInfoDiv.classList.add('center-message');
                          productInfoDiv.innerHTML = `
                            <span style="color: red;">Product Info:</span> 
                            <span style="color: blue;">${product.name}</span> |                            
                            <span style="color: red;">Balance:</span> 
                            <span style="color: blue;">${product.balance}</span> |
                            <span style="color: red;">Unit:</span> 
                            <span style="color: blue;">${product.unit_options.unit_name}</span> | &nbsp;`;

                          cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);

                        }
                      } else {
                        console.log(`No valid product selected for Row ${currentRowIndex}.`);
                      }
                    });
                  } else {
                    console.error('Parent array is undefined or not accessible');
                  }
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
                key: 'size',
                type: 'select',
                templateOptions: {
                  label: 'Select Size',
                  dataKey: 'size_id',
                  hideLabel: true,
                  dataLabel: 'size_name',
                  options: [],
                  required: true,
                  lazy: {
                    url: 'products/sizes/',
                    lazyOneTime: true
                  }
                },
              },
              {
                key: 'color',
                type: 'select',
                templateOptions: {
                  label: 'Select Color',
                  dataKey: 'color_id',
                  hideLabel: true,
                  dataLabel: 'color_name',
                  options: [],
                  required: true,
                  lazy: {
                    url: 'products/colors/',
                    lazyOneTime: true
                  }
                },
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
