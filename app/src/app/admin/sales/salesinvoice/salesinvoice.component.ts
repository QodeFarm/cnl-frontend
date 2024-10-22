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
        sale_order:{
          customer: 'customer',
          bill_type: 'bill_type',
          email: 'email',
          ref_no: 'ref_no',
          ref_date: 'ref_date',
          tax: 'tax',
          due_date: 'due_date',
          remarks: 'remarks',
          advance_amount: 'advance_amount',
          item_value: 'item_value',
          discount: 'discount',
          dis_amt: 'dis_amt',
          taxable: 'taxable',
          tax_amount: 'tax_amount',
          cess_amount: 'cess_amount',
          transport_charges: 'transport_charges',
          round_off: 'round_off',
          total_amount: 'total_amount',
          vehicle_name: 'vehicle_name',
          total_boxes: 'total_boxes',
          order_type: 'order_type',
          shipping_address: 'shipping_address',
          billing_address: 'billing_address',
          customer_id: 'customer_id',
          gst_type: 'gst_type',
          gst_type_id: 'gst_type_id',
          order_salesman_id: 'order_salesman_id',
          customer_address_id: 'customer_address_id',
          payment_term: 'payment_term',
          payment_term_id: 'payment_term_id',
          payment_link_type_id: 'payment_link_type_id',
          ledger_account: 'ledger_account',
          ledger_account_id: 'ledger_account_id',
          order_status_id: 'order_status_id'
        },
        sale_order_items: [
          {
            product: 'product',
            size: 'size',
            size_id: 'size_id',
            color_id: 'color_id',
            color: 'color',
            quantity: 'quantity',
            unit_price: 'unit_price',
            rate: 'rate',
            total_boxes: 'total_boxes',
            amount: 'amount',
            discount_percentage: 'discount_percentage',
            discount: 'discount',
            dis_amt: 'dis_amt',
            tax: 'tax',
            remarks: 'remarks',
          }
        ],
        order_attachments: [
          {
            attachment_name: 'attachment_name',
            attachment_path: 'attachment_path'
          }
        ],
        order_shipments: {
          destination: 'destination',
          port_of_landing: 'port_of_landing',
          port_of_discharge: 'port_of_discharge',
          shipping_tracking_no: 'shipping_tracking_no',
          shipping_date: 'shipping_date',
          shipping_charges: 'shipping_charges',
          weight: 'weight'
        }
      },
      'Sale Return': {
        sale_return_order: {
          customer: 'customer',
          bill_type: 'bill_type',
          email: 'email',
          ref_no: 'ref_no',
          tax: 'tax',
          remarks: 'remarks',
          item_value: 'item_value',
          discount: 'discount',
          dis_amt: 'dis_amt',
          taxable: 'taxable',
          tax_amount: 'tax_amount',
          cess_amount: 'cess_amount',
          transport_charges: 'transport_charges',
          round_off: 'round_off',
          total_amount: 'total_amount',
          vehicle_name: 'vehicle_name',
          total_boxes: 'total_boxes',
          order_type: 'order_type',
          shipping_address: 'shipping_address',
          billing_address: 'billing_address',
          customer_id: 'customer_id',
          gst_type: 'gst_type',
          gst_type_id: 'gst_type_id',
          orders_salesman: 'orders_salesman',
          order_salesman_id: 'order_salesman_id',
          customer_address_id: 'customer_address_id',
          payment_term: 'payment_term',
          payment_term_id: 'payment_term_id',
          order_status_id: 'order_status_id'
        },
        sale_return_items: [
          {
            product: 'product',
            size: 'size',
            size_id: 'size_id',
            color_id: 'color_id',
            color: 'color',
            quantity: 'quantity',
            unit_price: 'unit_price',
            rate: 'rate',
            total_boxes: 'total_boxes',
            amount: 'amount',
            discount_percentage: 'discount_percentage',
            discount: 'discount',
            dis_amt: 'dis_amt',
            tax: 'tax',
            remarks: 'remarks',
          }
        ],
        order_attachments: [
          {
            attachment_name: 'attachment_name',
            attachment_path: 'attachment_path'
          }
        ],
        order_shipments: {
          destination: 'destination',
          port_of_landing: 'port_of_landing',
          port_of_discharge: 'port_of_discharge',
          shipping_tracking_no: 'shipping_tracking_no',
          shipping_date: 'shipping_date',
          shipping_charges: 'shipping_charges',
          weight: 'weight'
        }
      },
      // Add mappings for 'Sale Return' or other tables as needed
    };

  // Method to open the copy modal and populate dropdown
  openCopyModal() {
      this.availableTables = this.tables.filter(table => table !== this.currentTable);
  }

  copyToTable() {
    const dataToCopy = {
      sale_invoice_order: this.formConfig.model.sale_invoice_order || {},
      sale_invoice_items: this.formConfig.model.sale_invoice_items || [],
      order_attachments: this.formConfig.model.order_attachments || {},
      order_shipments: this.formConfig.model.order_shipments || {},
    };
    const populatedData = {};
    // Extract only the matching fields based on the selected table
    if (this.selectedTable && this.fieldMapping[this.selectedTable]) {
      const tableMapping = this.fieldMapping[this.selectedTable];
  
      // Handle sale_invoice_order fields
      if (tableMapping.sale_order) {
        populatedData['sale_order'] = {};
        for (const key in tableMapping.sale_order) {
          const sourceField = tableMapping.sale_order[key];
          populatedData['sale_order'][key] = dataToCopy.sale_invoice_order[sourceField] || null;
        }
      }

      // Handle sale_return_order fields
      if (tableMapping.sale_return_order) {
        populatedData['sale_return_order'] = {};
        for (const key in tableMapping.sale_return_order) {
          const sourceField = tableMapping.sale_return_order[key];
          populatedData['sale_return_order'][key] = dataToCopy.sale_invoice_order[sourceField] || null;
        }
      }
  
      // Handle sale_invoice_items (array)
      if (tableMapping.sale_order_items) {
        populatedData['sale_order_items'] = dataToCopy.sale_invoice_items?.map(item => {
          const itemData = {};
          // Iterate through the mapping for items
          tableMapping.sale_order_items.forEach(fieldMap => {
            for (const field in fieldMap) {
              itemData[field] = item[fieldMap[field]] || null; // Ensure you access the correct fields
            }
          });
          return itemData;
        }) || [];
      }

      // Handle sale_return_items (array)
      if (tableMapping.sale_return_items) {
        populatedData['sale_return_items'] = dataToCopy.sale_invoice_items?.map(item => {
          const itemData = {};
          // Iterate through the mapping for items
          tableMapping.sale_return_items.forEach(fieldMap => {
            for (const field in fieldMap) {
              itemData[field] = item[fieldMap[field]] || null; // Ensure you access the correct fields
            }
          });
          return itemData;
        }) || [];
      }
  
      // Handle order_attachments (array)
      if (tableMapping.order_attachments) {
        populatedData['order_attachments'] = dataToCopy.order_attachments?.map(attachment => {
          const attachmentData = {};
          tableMapping.order_attachments.forEach(fieldMap => {
            for (const field in fieldMap) {
              attachmentData[field] = attachment[fieldMap[field]] || null;
            }
          });
          return attachmentData;
        }) || [];
      }
  
      // Handle order_shipments (object)
      if (tableMapping.order_shipments) {
        populatedData['order_shipments'] = {};
        for (const key in tableMapping.order_shipments) {
          const sourceField = tableMapping.order_shipments[key];
          populatedData['order_shipments'][key] = dataToCopy.order_shipments[sourceField] || null;
        }
      }
    }

    // Log the populated data for debugging
    console.log('Populated Data for Sale Invoice:', populatedData);

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
    this.checkAndPopulateData();
    
    this.showSaleInvoiceList = false;
    this.showForm = true;
    this.SaleInvoiceEditID = null;
    this.setFormConfig();
    // Set sale_order default value
    this.formConfig.model['sale_invoice_order']['order_type'] = 'sale_invoice';

    // To get SaleInvoice number for save
    this.getInvoiceNo();
    this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[8].hide = true;
  }

  checkAndPopulateData() {
    // Check if data has already been populated
    if (this.dataToPopulate === undefined) {
      console.log("Data status checking 1 : ", (this.dataToPopulate === undefined))
      // Subscribe to route params and history state data
      this.route.paramMap.subscribe(params => {
        // Retrieve data from history only if it's the first time populating
        this.dataToPopulate = history.state.data; 
        console.log('Data retrieved:', this.dataToPopulate);
        
        // Populate the form only if data exists
        if (this.dataToPopulate) {
          // Ensure we are handling sale_invoice_items correctly
          const saleInvoiceItems = this.dataToPopulate.sale_invoice_items || [];
  
          // Clear existing sale_invoice_items to avoid duplicates
          this.formConfig.model.sale_invoice_items = [];
  
          // Populate form with data, ensuring unique entries
          saleInvoiceItems.forEach(item => {
            const populatedItem = {
              product_id: item.product.product_id,
              size_id: item.size.size_id,
              color_id: item.color.color_id,
              code: item.code,
              unit: item.unit,
              total_boxes: item.total_boxes,
              quantity: item.quantity,
              amount: item.amount,
              rate: item.rate,
              print_name: item.print_name,
              discount: item.discount
            };
            this.formConfig.model.sale_invoice_items.push(populatedItem);
          });
        }
      });
    } else {
    // Detect if the page was refreshed
      const wasPageRefreshed = window.performance?.navigation?.type === window.performance?.navigation?.TYPE_RELOAD;
    
      // Clear data if the page was refreshed
      if (wasPageRefreshed) {
        this.dataToPopulate = undefined;
        console.log("Page was refreshed, clearing data.");
        
        // Ensure the history state is cleared to prevent repopulation
        history.replaceState(null, '');
        return; // Stop further execution as we don't want to repopulate the form
      }
    }
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
        this.formConfig.model['sale_invoice_order']['ledger_account_id'] = res.data.sale_invoice_order.ledger_account_id
        console.log("Ledger account id : ", res.data.ledger_account_id)
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order.bill_type && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.bill_type);
                  }
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
                      // Set customer_id in the model
                      this.formConfig.model['sale_invoice_order']['customer_id'] = data.customer_id;
                    }
            
                    // Update billing and shipping addresses
                    if (data.customer_addresses && data.customer_addresses.billing_address) {
                      field.form.controls.billing_address.setValue(data.customer_addresses.billing_address);
                    }
                    if (data.customer_addresses && data.customer_addresses.shipping_address) {
                      field.form.controls.shipping_address.setValue(data.customer_addresses.shipping_address);
                    }
            
                    // Update email field
                    if (data.email) {
                      field.form.controls.email.setValue(data.email);
                    }
                  });
            
                  // Populate customer from sale_invoice_order
                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order?.customer) {
                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.customer);
                  }
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
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order.email && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.email);
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order?.orders_salesman) {
                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.orders_salesman);
                  }
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order.ref_no && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.ref_no);
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order.tax && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.tax);
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order.remarks && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.remarks);
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order.billing_address && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.billing_address);
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order.shipping_address && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.shipping_address);
                  }
                }
              }
            },
          ]
        },
        {
          key: 'sale_invoice_items',
          type: 'repeat',
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
                key: 'product', // Change the key to 'product'
                type: 'select',
                templateOptions: {
                  label: 'Select Product',
                  dataKey: 'product_id', // Keep this as 'product_id' for internal operations like lazy loading and selection
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
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingProduct = this.dataToPopulate.sale_invoice_items[currentRowIndex].product;
                        
                        // Set the full product object instead of just the product_id
                        if (existingProduct) {
                          field.formControl.setValue(existingProduct); // Set full product object (not just product_id)
                        }
                      }
              
                      // Subscribe to value changes of the field
                      field.formControl.valueChanges.subscribe(selectedProduct => {
                        // Update model with the full product object
                        this.formConfig.model.sale_invoice_items[currentRowIndex].product = selectedProduct;
              
                        // Check if a valid product is selected
                        if (selectedProduct?.product_id) {
                          const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
              
                          if (cardWrapper) {
                            // Remove existing product info if present
                            cardWrapper.querySelector('.center-message')?.remove();
              
                            // Create and insert new product info
                            const productInfoDiv = document.createElement('div');
                            productInfoDiv.classList.add('center-message');
                            productInfoDiv.innerHTML = `
                              <span style="color: red;">Product Info:</span> 
                              <span style="color: blue;">${selectedProduct.name}</span> |                            
                              <span style="color: red;">Balance:</span> 
                              <span style="color: blue;">${selectedProduct.balance}</span> |
                              <span style="color: red;">Unit:</span> 
                              <span style="color: blue;">${selectedProduct.unit_options.unit_name}</span> | &nbsp;`;
              
                            cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                          }
                        } else {
                          console.log(`No valid product selected for Row ${currentRowIndex}.`);
                        }
                      });
              
                      // Subscribe to product selection changes to set additional fields
                      field.formControl.valueChanges.subscribe(data => {
                        this.productOptions = data;
              
                        // Assuming `data` is the selected product object
                        if (field.form && field.form.controls) {
                          const controls = field.form.controls;
              
                          if (controls.code && data.code) {
                            controls.code.setValue(data.code);
                          }
                          if (controls.rate) {
                            controls.rate.setValue(controls.rate.value || data.sales_rate);
                          }
                          if (controls.discount && data.dis_amount) {
                            controls.discount.setValue(parseFloat(data.dis_amount));
                          }
                          if (controls.unit_options_id && data.unit_options?.unit_name) {
                            controls.unit_options_id.setValue(data.unit_options.unit_options_id);
                          }
                          if (controls.print_name && data.print_name) {
                            controls.print_name.setValue(data.print_name);
                          }
                          if (controls.mrp && data.mrp) {
                            controls.mrp.setValue(data.mrp);
                          }
              
                          // Call total amount calculation if needed
                          this.totalAmountCal();
                        }
                      });
                    } else {
                      console.error('Parent array is undefined or not accessible');
                    }
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
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingSize = this.dataToPopulate.sale_invoice_items[currentRowIndex].size;
                        
                        // Set the full product object instead of just the product_id
                        if (existingSize && existingSize.size_id) {
                          field.formControl.setValue(existingSize); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
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
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingColor = this.dataToPopulate.sale_invoice_items[currentRowIndex].color;
                        
                        // Set the full product object instead of just the product_id
                        if (existingColor) {
                          field.formControl.setValue(existingColor);
                        }
                      }
                    }
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
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingCode = this.dataToPopulate.sale_invoice_items[currentRowIndex].product?.code;
                        
                        // Set the full product object instead of just the product_id
                        if (existingCode) {
                          field.formControl.setValue(existingCode); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
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
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingBox = this.dataToPopulate.sale_invoice_items[currentRowIndex].total_boxes;
                        
                        // Set the full product object instead of just the product_id
                        if (existingBox) {
                          field.formControl.setValue(existingBox); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }                
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
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingUnit = this.dataToPopulate.sale_invoice_items[currentRowIndex].product.unit_options;
                        
                        // Set the full product object instead of just the product_id
                        if (existingUnit) {
                          field.formControl.setValue(existingUnit.unit_options_id); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
                // hooks: {
                //   onInit: (field: any) => {
                //     if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > 0) {
                //       const firstItem = this.dataToPopulate.sale_invoice_items[0];
                //       // console.log("Unit option name : ", firstItem.product?.unit_options.unit_name)
                //       if (firstItem.product?.unit_options.unit_options_id) {
                //         field.formControl.setValue(firstItem.product?.unit_options.unit_options_id);
                //       }
                //     }
                //   }
                // }
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
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingQuan = this.dataToPopulate.sale_invoice_items[currentRowIndex].quantity;
                        
                        // Set the full product object instead of just the product_id
                        if (existingQuan) {
                          field.formControl.setValue(existingQuan); // Set full product object (not just product_id)
                        }
                      }
                    }
              
                    // Subscribe to value changes
                    field.formControl.valueChanges.subscribe(data => {
                      if (field.form && field.form.controls && field.form.controls.rate && data) {
                        const rate = field.form.controls.rate.value;
                        const quantity = data;
                        if (rate && quantity) {
                          field.form.controls.amount.setValue(parseInt(rate) * parseInt(quantity));
                        }
                      }
                    });
                  },
                  onChanges: (field: any) => {
                    // You can handle any changes here if needed
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
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingPrice = this.dataToPopulate.sale_invoice_items[currentRowIndex].rate;
                        
                        // Set the full product object instead of just the product_id
                        if (existingPrice) {
                          field.formControl.setValue(existingPrice); // Set full product object (not just product_id)
                        }
                      }
                    }
                    
                    // Subscribe to value changes to update amount
                    field.formControl.valueChanges.subscribe(data => {
                      if (field.form && field.form.controls && field.form.controls.quantity && data) {
                        const quantity = field.form.controls.quantity.value;
                        const rate = data;
                        if (rate && quantity) {
                          field.form.controls.amount.setValue(parseInt(rate) * parseInt(quantity));
                        }
                      }
                    });
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
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingDisc = this.dataToPopulate.sale_invoice_items[currentRowIndex].discount;
                        
                        // Set the full product object instead of just the product_id
                        if (existingDisc) {
                          field.formControl.setValue(existingDisc); // Set full product object (not just product_id)
                        }
                      }
                    }
                    field.formControl.valueChanges.subscribe(data => {
                      // Add any logic needed for when discount changes
                    });
                  }
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
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingName = this.dataToPopulate.sale_invoice_items[currentRowIndex].print_name;
                        
                        // Set the full product object instead of just the product_id
                        if (existingName) {
                          field.formControl.setValue(existingName); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
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
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingAmount = this.dataToPopulate.sale_invoice_items[currentRowIndex].amount;
                        
                        // Set the full product object instead of just the product_id
                        if (existingAmount) {
                          field.formControl.setValue(existingAmount); // Set full product object (not just product_id)
                        }
                      }
                    }
                    field.formControl.valueChanges.subscribe(data => {
                      this.totalAmountCal();
                    });
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
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingtax = this.dataToPopulate.sale_invoice_items[currentRowIndex].tax;
                        
                        // Set the full product object instead of just the product_id
                        if (existingtax) {
                          field.formControl.setValue(existingtax); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
              },
              {
                type: 'input',
                key: 'remarks',
                templateOptions: {
                  label: 'Remarks',
                  placeholder: 'Enter Remarks',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_invoice_items.length > currentRowIndex) {
                        const existingRemarks = this.dataToPopulate.sale_invoice_items[currentRowIndex].remarks;
                        
                        // Set the full product object instead of just the product_id
                        if (existingRemarks) {
                          field.formControl.setValue(existingRemarks); // Set full product object (not just product_id)
                        }
                      }
                    }
                  }
                }
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
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.destination && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.destination);
                          }
                        }
                      }
                    },
                    {
                      key: 'port_of_landing',
                      type: 'input',
                      className: 'col-6',
                      templateOptions: {
                        label: 'Port of Landing',
                        placeholder: 'Enter Port of Landing',
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.port_of_landing && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.port_of_landing);
                          }
                        }
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
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.port_of_discharge && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.port_of_discharge);
                          }
                        }
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
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.no_of_packets && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.no_of_packets);
                          }
                        }
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
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.weight && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.weight);
                          }
                        }
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
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.shipping_charges && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.shipping_charges);
                          }
                        }
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
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order && this.dataToPopulate.sale_invoice_order.total_boxes && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.total_boxes);
                                  }
                                }
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order && this.dataToPopulate.sale_invoice_order.cess_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.cess_amount);
                                  }
                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();
                                  });
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order && this.dataToPopulate.sale_invoice_order.advance_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.advance_amount);
                                  }
                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();
                                  });
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
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order && this.dataToPopulate.sale_invoice_order.taxable && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.taxable);
                                  }
                                }
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order && this.dataToPopulate.sale_invoice_order.tax_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.tax_amount);
                                  }
                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();
                                  });
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
                                dataKey: 'gst_type_id', // Assuming gst_type_id is the key you want to use
                                dataLabel: "name",
                                lazy: {
                                  url: 'masters/gst_types/',
                                  lazyOneTime: true
                                },
                                // required: true // Uncomment if required
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    if (data && data.gst_type_id) {
                                      this.formConfig.model['sale_invoice_order']['gst_type_id'] = data.gst_type_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order.gst_type && field.formControl) {
                                    const GstFiled = this.dataToPopulate.sale_invoice_order.gst_type
                                    field.formControl.setValue(GstFiled);
                                  }
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
                                dataKey: 'payment_term_id', // Assuming payment_term_id is the key for the selected value
                                dataLabel: 'name',
                                lazy: {
                                  url: 'masters/customer_payment_terms/',
                                  lazyOneTime: true
                                },
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    if (data && data.payment_term_id) {
                                      this.formConfig.model['sale_invoice_order']['payment_term_id'] = data.payment_term_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order.payment_term && field.formControl) {
                                    const PaymentField = this.dataToPopulate.sale_invoice_order.payment_term
                                    field.formControl.setValue(PaymentField);
                                  }
                                }
                              }
                            },                            
                            {
                              key: 'ledger_account',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Ledger account',
                                placeholder: 'Select Ledger account',
                                dataKey: 'ledger_account_id', // Assuming ledger_account_id is the key for the selected value
                                dataLabel: 'name',
                                lazy: {
                                  url: 'customers/ledger_accounts/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onInit: (field: any) => {                           
                                  // Subscribe to value changes
                                  field.formControl.valueChanges.subscribe(data => {
                                    if (data && data.ledger_account_id) {
                                      this.formConfig.model['sale_invoice_order']['ledger_account_id'] = data.ledger_account_id; // Update the model with the selected ledger_account_id
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order.ledger_account && field.formControl) {
                                    const LedgerField = this.dataToPopulate.sale_invoice_order.ledger_account
                                    field.formControl.setValue(LedgerField);
                                  }
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
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order && this.dataToPopulate.sale_invoice_order.item_value && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.item_value);
                                  }
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
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order && this.dataToPopulate.sale_invoice_order.dis_amt && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.dis_amt);
                                  }
                                  // Subscribe to value changes for recalculating total amount
                                  // field.formControl.valueChanges.subscribe(data => {
                                  //   this.totalAmountCal();
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
                                readonly: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.sale_invoice_order && this.dataToPopulate.sale_invoice_order.total_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_invoice_order.total_amount);
                                  }
                                  // Subscribe to value changes for recalculating total amount
                                  // field.formControl.valueChanges.subscribe(data => {
                                  //   this.totalAmountCal();
                                  // });
                                }
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
                            displayStyle: 'files',
                            multiple: true,
                          },
                          hooks: {
                            onInit: (field: any) => {
                              // Check if there's data to populate
                              if (this.dataToPopulate && this.dataToPopulate.order_attachments?.length > 0) {
                                // Map through order_attachments and return objects with file properties
                                const attachments = this.dataToPopulate.order_attachments.map(attachment => ({
                                  name: attachment.attachment_name,
                                  attachment_path: attachment.attachment_path,
                                  isUploading: false,  // Add any other required properties like 'isUploading'
                                }));
                        
                                // Set the attachments to the form control
                                field.formControl.setValue(attachments);
                        
                                // Optional: log for debugging
                                console.log("Attachments: ", attachments);
                              }
                            }
                          }
                        }                                                                      
                        // {
                        //   key: 'order_attachments',
                        //   type: 'file',
                        //   className: 'ta-cell col-12 custom-file-attachement',
                        //   props: {
                        //     "displayStyle": "files",
                        //     "multiple": true
                        //   }
                        // }
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
