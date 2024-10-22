import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { Observable, forkJoin } from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { OrderslistComponent } from './orderslist/orderslist.component';
import { CommonModule } from '@angular/common';
import { SalesListComponent } from './sales-list/sales-list.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';
@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, OrderslistComponent, SalesListComponent],
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
  @ViewChild('salesForm', { static: false }) salesForm: TaFormComponent | undefined;
  @ViewChild('ordersModal', { static: true }) ordersModal: ElementRef;
  orderNumber: any;
  invoiceData: any;
  salesReceiptForm: FormGroup;
  showSaleOrderList: boolean = false;
  showForm: boolean = false;
  SaleOrderEditID: any;
  productOptions: any;
  customerDetails: Object;
  customerOrders: any[] = [];
  showOrderListModal = false;
  selectedOrder: any;
  noOrdersMessage: string;
  shippingTrackingNumber: any;

  //COPY ---------------------------------
  // List of all tables
  tables: string[] = ['Sale Order', 'Sale Invoice', 'Sale Return'];

  // This will store available tables excluding the current one
  availableTables: string[] = [];

  // Selected table from dropdown
  selectedTable: string;

  // Variable to store current table name (example for 'Sale Order')
  currentTable: string = 'Sale Order'; // Dynamically change this based on your current module

  // Field mapping for auto population
  // Field mapping for auto-population (expanded for Sale Invoice)
  fieldMapping = {
    'Sale Invoice': {
      sale_invoice_order: {
        customer: 'customer',
        bill_type: 'bill_type',
        invoice_date: 'invoice_date',
        invoice_no: 'invoice_no',
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
      sale_invoice_items: [
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

  // Method to copy data to the selected table with nested structures
  copyToTable() {
    // Consolidate all relevant data into a single object
    const dataToCopy = {
      sale_order: this.formConfig.model.sale_order || {},
      sale_order_items: this.formConfig.model.sale_order_items || [],
      order_attachments: this.formConfig.model.order_attachments || {},
      order_shipments: this.formConfig.model.order_shipments || {},
    };
  
    const populatedData = {};
  
    // Extract only the matching fields based on the selected table
    if (this.selectedTable && this.fieldMapping[this.selectedTable]) {
      const tableMapping = this.fieldMapping[this.selectedTable];
  
      // Handle sale_invoice_order fields
      if (tableMapping.sale_invoice_order) {
        populatedData['sale_invoice_order'] = {};
        for (const key in tableMapping.sale_invoice_order) {
          const sourceField = tableMapping.sale_invoice_order[key];
          populatedData['sale_invoice_order'][key] = dataToCopy.sale_order[sourceField] || null;
        }
      }

      // Handle sale_return_order fields
      if (tableMapping.sale_return_order) {
        populatedData['sale_return_order'] = {};
        for (const key in tableMapping.sale_return_order) {
          const sourceField = tableMapping.sale_return_order[key];
          populatedData['sale_return_order'][key] = dataToCopy.sale_order[sourceField] || null;
        }
      }
  
      // Handle sale_invoice_items (array)
      if (tableMapping.sale_invoice_items) {
        populatedData['sale_invoice_items'] = dataToCopy.sale_order_items?.map(item => {
          const itemData = {};
          // Iterate through the mapping for items
          tableMapping.sale_invoice_items.forEach(fieldMap => {
            for (const field in fieldMap) {
              itemData[field] = item[fieldMap[field]] || null; // Ensure you access the correct fields
            }
          });
          return itemData;
        }) || [];
      }

      // Handle sale_return_items (array)
      if (tableMapping.sale_return_items) {
        populatedData['sale_return_items'] = dataToCopy.sale_order_items?.map(item => {
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
  
    // Navigate to Sale Invoice module with the populated data
    if (this.selectedTable === 'Sale Invoice') {
      this.router.navigate(['admin/sales/salesinvoice'], { state: { data: populatedData } });
    } else if (this.selectedTable === 'Sale Return') {
      this.router.navigate(['admin/sales/sale-returns'], { state: { data: populatedData } });
    } else {
      console.error('Unknown table selected');
    }
  }
  
  // Method to open the copy modal and populate dropdown
  openCopyModal() {
      this.availableTables = this.tables.filter(table => table !== this.currentTable);
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
  saleForm: FormGroup;

  hasDataPopulated: boolean = false;

  ngOnInit() {
    this.checkAndPopulateData();

    this.showSaleOrderList = false;
    this.showForm = false;
    this.SaleOrderEditID = null;
    // set form config
    this.setFormConfig();
    
    // set sale_order default value
    this.formConfig.model['sale_order']['order_type'] = 'sale_order';
    
    // Call the method to handle sale invoice creation, this is temporary change, this will be moved to formconfig.
    
    this.handleSaleInvoiceCreation();
    console.log("here refreshing started_2 : ")
    //=================================

    // to get SaleOrder number for save 
    this.getOrderNo();
    this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[8].hide = true;
    this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[9].hide = true;
    // //console.log("---------",this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1])
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
          // Ensure we are handling sale_order_items correctly
          const saleOrderItems = this.dataToPopulate.sale_order_items || [];
  
          // Clear existing sale_order_items to avoid duplicates
          this.formConfig.model.sale_order_items = [];
  
          // Populate form with data, ensuring unique entries
          saleOrderItems.forEach(item => {
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
            this.formConfig.model.sale_order_items.push(populatedItem);
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
  

//COPY - END---------------------------------------------------

  // New method to handle sale invoice creation
  private handleSaleInvoiceCreation() {
    console.log("invoice data in edit: ", this.invoiceData);
    if (this.invoiceData !== undefined) {
      this.createSaleInvoice(this.invoiceData).subscribe(
        response => {
          console.log('Sale invoice created successfully', response);
        },
        error => {
          console.error('Error creating sale invoice', error);
        }
      );
    }
  }

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  // Function to create a sale invoice
  createSaleInvoice(invoiceData: any): Observable<any> {
    return this.http.post('sales/sale_invoice_order/', invoiceData);
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
        this.formConfig.model['flow_status'] = res.data.sale_order.flow_status;
        console.log("flow_status in edit  : ", this.formConfig.model['sale_order']['flow_status']);
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['sale_order_id'] = this.SaleOrderEditID;
        this.showForm = true;
        this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[8].hide = false;
        this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[9].hide = false;
      }
    });
    this.hide();
  }

  // Function to get a new order number and a shipping tracking number
  getOrderNo() {
    this.orderNumber = null;
    this.shippingTrackingNumber = null; // Separate variable for Shipping Tracking No.

    // Generate Shipping Tracking Number
    this.http.get('masters/generate_order_no/?type=SHIP').subscribe((res: any) => {
      if (res && res.data && res.data.order_number) {
        this.shippingTrackingNumber = res.data.order_number;
        this.formConfig.model['order_shipments']['shipping_tracking_no'] = this.shippingTrackingNumber;

        // Generate Sales Order Number
        this.http.get('masters/generate_order_no/?type=SO').subscribe((res: any) => {
          console.log("RES data in orderno : ", res)
          if (res && res.data && res.data.order_number) {
            this.orderNumber = res.data.order_number;
            this.formConfig.model['sale_order']['order_no'] = this.orderNumber;
          }
        });
      }
    });
  }
  // Displays the sales order list modal
  showSaleOrderListFn() {
    this.showSaleOrderList = true;
  }

  // Shows the past orders list modal and fetches orders based on the selected customer
  showOrdersList() {
    // Ensure customer is selected
    const selectedCustomerId = this.formConfig.model.sale_order.customer_id;
    const selectedCustomerName = this.formConfig.model.sale_order.customer?.name;
    // Debugging logs to ensure customer_id is correctly set
    //console.log("Selected Customer ID:", selectedCustomerId);
    //console.log("Selected Customer Name:", selectedCustomerName);

    if (!selectedCustomerId) {
      this.noOrdersMessage = 'Please select a customer.';
      this.customerOrders = [];
      this.openModal();
      return;
    }
    this.customerOrders = [];
    this.noOrdersMessage = '';
    // Fetch orders by customer ID and process the order details
    this.getOrdersByCustomer(selectedCustomerId).pipe(
      switchMap(orders => {
        if (orders.count === 0) {
          this.noOrdersMessage = `No past orders for ${selectedCustomerName}.`;
          this.customerOrders = [];
          this.openModal();
          return [];
        }

        const detailedOrderRequests = orders.data.map(order =>
          this.getOrderDetails(order.sale_order_id).pipe(
            tap(orderDetails => {
              order.productsList = orderDetails.data.sale_order_items.map(item => ({
                product_id: item.product.product_id,
                product_name: item.product?.name ?? 'Unknown Product',
                quantity: item.quantity,
                code: item.product.code,
                unit_options_id: item.unit_options.unit_options_id,
                total_boxes: item.total_boxes,
                rate: item.rate,
                discount: item.discount,
                print_name: item.print_name,
                amount: item.amount,
                tax: item.tax,
                remarks: item.remarks,
              }));
            })
          )
        );

        // Wait for all detailed order requests to complete before updating the UI
        return forkJoin(detailedOrderRequests).pipe(
          tap(() => {
            this.customerOrders = orders.data; // Update the customer orders list
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

  // Fetch orders by customer ID
  getOrdersByCustomer(customerId: string): Observable<any> {
    //console.log("customer id",customerId)
    const url = `sales/sale_order_search/?customer_id=${customerId}`;
    //console.log("customer ids",customerId)
    return this.http.get<any>(url);
  }

  // Fetch detailed information about an order by its ID
  getOrderDetails(orderId: string): Observable<any> {
    const url = `sales/sale_order/${orderId}/`;
    return this.http.get<any>(url);
  }

  // Handles the selection of an order from the list
  selectOrder(order: any) {
    //console.log('Selected Order:', order);
    this.handleOrderSelected(order); // Handle order selection
  }

  // Handles the order selection process and updates the form model with the order details
  handleOrderSelected(orderId: any) {
    this.SaleOrderEditID = null;
    this.http.get('sales/sale_order/' + orderId).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data; // Update the form model with the selected order details

        // Ensure the order type is always 'sale_order'
        if (!this.formConfig.model['sale_order']['order_type']) {
          this.formConfig.model['sale_order']['order_type'] = 'sale_order'; // Set default order type
        }

        // Do not override the order number if one was already generated
        // Ensure new orders start with a blank order number unless one was already generated
        if (!this.orderNumber) {
          this.formConfig.model['sale_order']['order_no'] = ''; // Ensure new order starts blank
        } else {
          this.formConfig.model['sale_order']['order_no'] = this.orderNumber; // Retain the initial order number
        }

        if (!this.shippingTrackingNumber) {
          this.formConfig.model['order_shipments']['shipping_tracking_no'] = ''; // Ensure new order starts blank
        } else {
          this.formConfig.model['order_shipments']['shipping_tracking_no'] = this.shippingTrackingNumber; // Retain the initial tracking number
        }


        // Set default dates for the new order
        this.formConfig.model['sale_order']['delivery_date'] = this.nowDate();
        this.formConfig.model['sale_order']['order_date'] = this.nowDate();
        this.formConfig.model['sale_order']['ref_date'] = this.nowDate();
        // this.formConfig.model['order_shipments']['shipping_tracking_no'] = '';
        this.formConfig.model['order_shipments']['shipping_date'] = this.nowDate();

        // Set form button label to 'Create'
        // this.formConfig.submit.label = 'Create';

        // Display the form
        this.showForm = true;

        // Trigger change detection to update the form
        this.cdRef.detectChanges();
      }
    }, (error) => {
      console.error('Error fetching order details:', error);
    });

    this.hideModal();
  }

  // Closes the modal and removes the modal backdrop
  closeModal() {
    this.hideModal(); // Use the hideModal method to remove the modal elements
  }

  // Handles the selected products and updates the form model with them
  handleProductPull(selectedProducts: any[]) {
    let existingProducts = this.formConfig.model['sale_order_items'] || [];

    // Clean up existing products by filtering out any undefined, null, or empty entries
    existingProducts = existingProducts.filter((product: any) => product?.code && product.code.trim() !== "");

    if (existingProducts.length === 0) {
      // Initialize the product list if no products exist
      this.formConfig.model['sale_order_items'] = selectedProducts.map(product => ({
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
      this.formConfig.model['sale_order_items'] = [...existingProducts];
    }

    // Re-render the form
    this.formConfig.model = { ...this.formConfig.model };

    // Trigger UI update
    this.cdRef.detectChanges();

    //console.log("Final Products List:", this.formConfig.model['sale_order_items']);
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
    this.SaleOrderEditID = null;
    this.dataToPopulate != undefined;
    this.formConfig = {
      url: "sales/sale_order/",
      title: '',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'sale_order_items',
          type: 'script',
          value: 'data.sale_order_items.map(m=> {m.product_id = m.product.product_id;  return m ;})'
        },
        {
          key: 'sale_order_items',
          type: 'script',
          value: 'data.sale_order_items.map(m=> {m.size_id = m.size.size_id;  return m ;})'
        },
        {
          key: 'sale_order_items',
          type: 'script',
          value: 'data.sale_order_items.map(m=> {m.color_id = m.color.color_id;  return m ;})'
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
                    //console.log("sale_type", data);
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
                    //console.log("customer", data);
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_order.customer && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_order.customer);
                  }
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
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.sale_order.email && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_order.email);
                  }
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
                // readonly: true
                // disabled: true
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
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.sale_order.ref_no && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_order.ref_no);
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_order.tax && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_order.tax);
                  }
                }
              }
            },
            {
              key: 'workflow',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Work flow',
                dataKey: 'workflow_id',
                dataLabel: "name",
                options: [],
                required: true,
                lazy: {
                  url: 'sales/workflows/',
                  lazyOneTime: true
                }
              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    //console.log("sale_type", data);
                    if (data && data.workflow_id) {
                      this.formConfig.model['sale_order']['workflow_id'] = data.workflow_id;
                    }
                  });
                },
                onChanges: (field: any) => {

                }
              }
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_order.remarks && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_order.remarks);
                  }
                }
              }
            },
            {
              key: 'billing_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Billing address',
                placeholder: 'Enter Billing address'
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.sale_order.billing_address && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_order.billing_address);
                  }
                }
              }
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Shipping address',
                placeholder: 'Enter Shipping address'
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.sale_order.shipping_address && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_order.shipping_address);
                  }
                }
              }
            }
          ]
        },
        {
          key: 'sale_order_items',
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
                name: 'size',
                label: 'size'
              },
              {
                name: 'color',
                label: 'color'
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
                    const parentArray = field.parent;

                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion

                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingProduct = this.dataToPopulate.sale_order_items[currentRowIndex].product;
                        
                        // Set the full product object instead of just the product_id
                        if (existingProduct) {
                          field.formControl.setValue(existingProduct); // Set full product object (not just product_id)
                        }
                      }
                      
                      // Subscribe to value changes of the field
                      field.formControl.valueChanges.subscribe(selectedProductId => {
                        const product = this.formConfig.model.sale_order_items[currentRowIndex]?.product;

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
                      //console.log("products data", data);
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
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion
              
                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingSize = this.dataToPopulate.sale_order_items[currentRowIndex].size;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingColor = this.dataToPopulate.sale_order_items[currentRowIndex].color;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingCode = this.dataToPopulate.sale_order_items[currentRowIndex].product?.code;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingBox = this.dataToPopulate.sale_order_items[currentRowIndex].total_boxes;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingUnit = this.dataToPopulate.sale_order_items[currentRowIndex].product.unit_options;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingQuan = this.dataToPopulate.sale_order_items[currentRowIndex].quantity;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingPrice = this.dataToPopulate.sale_order_items[currentRowIndex].rate;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingDisc = this.dataToPopulate.sale_order_items[currentRowIndex].discount;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingName = this.dataToPopulate.sale_order_items[currentRowIndex].print_name;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingAmount = this.dataToPopulate.sale_order_items[currentRowIndex].amount;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingtax = this.dataToPopulate.sale_order_items[currentRowIndex].tax;
                        
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingRemarks = this.dataToPopulate.sale_order_items[currentRowIndex].remarks;
                        
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
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.total_boxes && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.total_boxes);
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.cess_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.cess_amount);
                                  }
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.advance_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.advance_amount);
                                  }
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
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.taxable && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.taxable);
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.tax_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.tax_amount);
                                  }
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
                                      this.formConfig.model['sale_order']['gst_type_id'] = data.gst_type_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order.gst_type && field.formControl) {
                                    const GstFiled = this.dataToPopulate.sale_order.gst_type
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
                                      this.formConfig.model['sale_order']['payment_term_id'] = data.payment_term_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order.payment_term && field.formControl) {
                                    const PaymentField = this.dataToPopulate.sale_order.payment_term
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
                                      this.formConfig.model['sale_order']['ledger_account_id'] = data.ledger_account_id; // Update the model with the selected ledger_account_id
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order.ledger_account && field.formControl) {
                                    const LedgerField = this.dataToPopulate.sale_order.ledger_account
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
                                    //console.log("ledger_account", data);
                                    if (data && data.order_status_id) {
                                      this.formConfig.model['sale_order']['order_status_id'] = data.order_status_id;
                                    }
                                  });
                                }
                              }
                            },
                            {
                              key: 'flow_status',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Flow Status',
                                placeholder: 'Select Flow Status',
                                expressions: {
                                  hide: '!model.sale_order_id',
                                },
                                options: [
                                  { value: 'Invoiced', label: 'Invoiced' },
                                  // Add other statuses as needed
                                ],
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  // Subscribe to value changes only once
                                  const valueChangesSubscription = field.formControl.valueChanges.subscribe(data => {
                                    // Check if data is valid and if it's the first time processing 'Invoiced'
                                    if (data === 'Invoiced') {
                                      // Unsubscribe to avoid multiple triggers
                                      valueChangesSubscription.unsubscribe();
                            
                                      // Update the flow status in the model
                                      this.formConfig.model['sale_order']['flow_status'] = data;
                            
                                      const saleOrder = this.formConfig.model['sale_order'];
                                      console.log("Sale order: ", saleOrder);
                            
                                      // Prepare invoice data
                                      const saleOrderItems = this.formConfig.model['sale_order_items'];
                                      const orderAttachments = this.formConfig.model['order_attachments'];
                                      const orderShipments = this.formConfig.model['order_shipments'];
                            
                                      this.invoiceData = {
                                        sale_invoice_order: {
                                          bill_type: saleOrder.bill_type || 'CASH',
                                          sale_order_id: saleOrder.sale_order_id,
                                          invoice_date: this.nowDate(),
                                          email: saleOrder.email,
                                          ref_no: saleOrder.ref_no,
                                          ref_date: this.nowDate(),
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
                                          flow_status: saleOrder.flow_status // updated to use flow_status
                                        },
                                        sale_invoice_items: saleOrderItems,
                                        order_attachments: orderAttachments,
                                        order_shipments: orderShipments
                                      };
                            
                                      console.log('invoiceData:', this.invoiceData);
                                      // this.createSaleInvoice(invoiceData).subscribe(
                                      //   response => {
                                      //     console.log('Sale invoice created successfully', response);
                                      //   },
                                      //   error => {
                                      //     console.error('Error creating sale invoice', error);
                                      //   }
                                      // );
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.item_value && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.item_value);
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.dis_amt && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.dis_amt);
                                  }
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.total_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.total_amount);
                                  }
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
