import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { Observable, forkJoin } from 'rxjs';
import { tap, switchMap, map, filter} from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { OrderslistComponent } from './orderslist/orderslist.component';
import { CommonModule } from '@angular/common';
import { SalesListComponent } from './sales-list/sales-list.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';
import { BindingType } from '@angular/compiler';
@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, OrderslistComponent, SalesListComponent],
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
  @ViewChild('salesForm', { static: false }) salesForm: TaFormComponent | undefined;
  @ViewChild('ordersModal', { static: false }) ordersModal: ElementRef;
  @ViewChild(SalesListComponent) SalesListComponent!: SalesListComponent;
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
  unitOptionOfProduct: any[] | string = []; // Initialize as an array by default
  isModalOpen = false;  //Added line to fix past orders modal box correctly
  //COPY ---------------------------------
  // List of all tables
  tables: string[] = ['Sale Order', 'Sale Invoice', 'Sale Return', 'Purchase Order', 'Purchase Invoice', 'Purchase Return'];

  // This will store available tables excluding the current one
  availableTables: string[] = [];

  // Selected table from dropdown
  selectedTable: string;

  // Variable to store current table name (example for 'Sale Order')
  currentTable: string = 'Sale Order'; // Dynamically change this based on your current module

  tempSelectedProducts: any[] = []; // Temporary list for checkbox selections

  // Field mapping for auto population
  fieldMapping = {
    'Sale Invoice': {
      sourceModel: 'sale_order',  // Specify the source model
      targetModel: 'sale_invoice_order', // Specify the target model
      // Indicate nested fields with model mappings
      nestedModels: {
        sale_order_items: 'sale_invoice_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Sale Return': {
      sourceModel: 'sale_order',  // Specify the source model
      targetModel: 'sale_return_order',  // Specify the target model
      // Nested mappings
      nestedModels: {
        sale_order_items: 'sale_return_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Purchase Order': {
      sourceModel: 'sale_order',
      targetModel: 'purchase_order_data',
      nestedModels: {
        sale_order_items: 'purchase_order_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Purchase Invoice': {
      sourceModel: 'sale_order',
      targetModel: 'purchase_invoice_orders',
      nestedModels: {
        sale_order_items: 'purchase_invoice_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Purchase Return': {
      sourceModel: 'sale_order',
      targetModel: 'purchase_return_orders',
      nestedModels: {
        sale_order_items: 'purchase_return_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    }
  };
  sizeOptions: any[] = []; 

  copyToTable() {
    const selectedMapping = this.fieldMapping[this.selectedTable];
    
    if (!selectedMapping) {
      console.error('Mapping not found for selected table:', this.selectedTable);
      return;
    }
  
    const dataToCopy = this.formConfig.model[selectedMapping.sourceModel] || {};
    const populatedData = { [selectedMapping.targetModel]: {} };
  
    // Copy main fields
    Object.keys(dataToCopy).forEach(field => {
      populatedData[selectedMapping.targetModel][field] = dataToCopy[field];
    });
  
    // Copy nested models if they exist
    if (selectedMapping.nestedModels) {
      Object.keys(selectedMapping.nestedModels).forEach(sourceNestedModel => {
        const targetNestedModel = selectedMapping.nestedModels[sourceNestedModel];
        const nestedData = this.formConfig.model[sourceNestedModel] || [];
        
        populatedData[targetNestedModel] = Array.isArray(nestedData)
          ? nestedData.map(item => ({ ...item }))
          : { ...nestedData };
      });
    }

    // Log and navigate to the target module with populated data
    console.log('Populated Data:', populatedData);
    
    // Determine the target route based on the selected table
    const targetRoute = 
      this.selectedTable === 'Sale Invoice' ? 'sales/salesinvoice' :
      this.selectedTable === 'Sale Return' ? 'sales/sale-returns' :
      this.selectedTable === 'Purchase Order' ? 'purchase' :
      this.selectedTable === 'Purchase Invoice' ? 'purchase/purchase-invoice' :
      this.selectedTable === 'Purchase Return' ? 'purchase/purchasereturns' :
      null;

    if (!targetRoute) {
      console.error('No valid route for selected table:', this.selectedTable);
      return;
    }

    this.router.navigate([`admin/${targetRoute}`], { state: { data: populatedData } });
  }
  

  // Initialize the copy modal options dynamically
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
    this.showSaleOrderList = false;
    this.showForm = false;
    this.SaleOrderEditID = null;
    // set form config
    this.setFormConfig();
    this.checkAndPopulateData();
    
    // set sale_order default value
    this.formConfig.model['sale_order']['order_type'] = 'sale_order';

    // to get SaleOrder number for save 
    this.getOrderNo();
    this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[8].hide = true;
    // this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[9].hide = true;
    // //console.log("---------",this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1])
  }
  checkAndPopulateData() {
    if (this.dataToPopulate === undefined) {
      console.log("Data status checking 1 : ", (this.dataToPopulate === undefined));
      this.route.paramMap.subscribe(params => {
        this.dataToPopulate = history.state.data;
        console.log('Data retrieved:', this.dataToPopulate);
  
        if (this.dataToPopulate) {
          const saleOrderItems = this.dataToPopulate.sale_order_items || [];
          console.log("saleOrderItems : ", saleOrderItems);
  
          if(!this.formConfig.model) {
            this.formConfig.model = {}
          }
          
          // Clear existing items to avoid duplicates
          this.formConfig.model.sale_order_items = [];
          console.log("checking data status : ", this.formConfig.model.sale_order_items);
  
          saleOrderItems.forEach((item, index) => {
            this.formConfig.model.sale_order_items.push({
              product_id: item.product.product_id,
              size: item.size,
              color: item.color,
              code: item.code,
              unit: item.unit,
              total_boxes: item.total_boxes,
              quantity: item.quantity,
              amount: item.amount,
              rate: item.rate,
              discount: item.discount
            });
            console.log(`Populated row ${index + 1} in sale_order_items`);
          });
  
          // Reassign the array to trigger change detection
          this.formConfig.model.sale_order_items = [...this.formConfig.model.sale_order_items];
          console.log("After method : ", this.formConfig.model.sale_order_items)
          this.cdRef.detectChanges();
          
          console.log("Updated formConfig:", this.formConfig.model.sale_order_items);
        }
      });
    } else {
      const wasPageRefreshed = window.performance?.navigation?.type === window.performance?.navigation?.TYPE_RELOAD;
  
      if (wasPageRefreshed) {
        this.dataToPopulate = undefined;
        console.log("Page was refreshed, clearing data.");
        history.replaceState(null, '');
        return;
      }
    }
  }
//COPY-End ====================================================

//Sale-invoice ==============================================
  saleOrderItems: any[] = []; 
  isConfirmationInvoiceOpen: boolean = false;
  isInvoiceCreated: boolean = false;
  previouslyInvoicedProductIds: Set<string> = new Set();


  // Function to handle opening the confirmation modal
  openSaleInvoiceModal() {
      this.isConfirmationInvoiceOpen = true; // Show the confirmation modal
  }

  // Function to handle cancelling the invoice creation
  cancelInvoiceCreation() {
      this.isConfirmationInvoiceOpen = false; // Close the modal
  }

  // Function to handle confirmation of invoice creation
  confirmInvoiceCreation() {
      this.isConfirmationInvoiceOpen = false; // Close the modal
      this.invoiceCreationHandler(); // Proceed with the invoice creation logic
  }

  invoiceCreationHandler() {
    console.log("Invoice Data at handler start:", this.invoiceData);

    // Log each item to confirm the checkbox status
    this.invoiceData.sale_invoice_items.forEach((item, index) => {
      console.log(`Item ${index}:`, item, "Select Item:", item.selectItem);
    });

    // Filter for items where selectItem is true (checkbox selected)
    const selectedItems = this.invoiceData.sale_invoice_items.filter(item => item.selectItem);

    // If selectedItems > 0, use selected items; else use all sale_invoice_items
    const itemsToInvoice = selectedItems.length > 0 ? selectedItems : this.invoiceData.sale_invoice_items;
    
    const invoiceData = {
        ...this.invoiceData,
        sale_invoice_items: itemsToInvoice
    };
    console.log("Invoice Data with selected items:", invoiceData);

    // Check if there are items to invoice
    if (itemsToInvoice.length > 0) {
        this.createSaleInvoice(invoiceData).subscribe(
            response => {
                console.log('Sale invoice created successfully', response);
                this.showInvoiceCreatedMessage();

                // Add invoiced product IDs to `previouslyInvoicedProductIds` set
                // itemsToInvoice.forEach(item => this.previouslyInvoicedProductIds.add(item.product_id)); 

                itemsToInvoice.forEach(item => {
                  console.log("Item data:", item);
                  console.log("Invoice data:", this.invoiceData);
                
                  if (item.invoiced === 'NO') {
                    console.log("We are in log...")
                    item.invoiced = 'YES'; // Update locally
                    this.updateInvoicedStatusDirectly(item.sale_order_item_id, 'YES'); // Send the HTTP request directly
                  }
                });

                const saleOrderId = this.invoiceData.sale_invoice_order.sale_order_id;
                // this.triggerWorkflowPipeline(saleOrderId);
                // Check if all products are invoiced
                const allInvoiced = this.invoiceData.sale_invoice_items.every(item => item.invoiced === 'YES');
                if (allInvoiced) {
                  console.log("All products are invoiced, triggering workflow pipeline...");
                  this.triggerWorkflowPipeline(saleOrderId);
                } else {
                  console.log("Some products are still pending, workflow pipeline not triggered.");
                }
            },
            error => {
                console.error('Error creating sale invoice', error);
            }
        );
    } else {
        console.warn('No items selected for invoicing');
    }

    // Re-initialize the form if needed
    this.ngOnInit();
  }

  // Method to update invoiced status using HttpClient
  updateInvoicedStatusDirectly(itemId: number, status: string) {
    const apiUrl = `sales/sale_order_items/${itemId}/`;
    const payload = { invoiced: status };
    console.log("{ invoiced: status } : ", payload);
    this.http.patch(apiUrl, payload).subscribe(
      response => {
        console.log("Invoiced status updated successfully", response);
      },
      error => {
        console.error("Error updating invoiced status", error);
      }
    );
  }

  // This function triggers the workflow pipeline API call using POST method
  private triggerWorkflowPipeline(saleOrderId: string) {
    const apiUrl = 'sales/SaleOrder/{saleOrderId}/move_next_stage/'; //correct url
    const url = apiUrl.replace('{saleOrderId}', saleOrderId); // Replace placeholder with saleOrderId
    
    // POST request without any additional payload
    this.http.post(url, {}).subscribe(
        response => {
            console.log('POST request successful:', response);
        },
        error => {
            console.error('Error triggering workflow pipeline:', error);
        }
    );
  }

  createSaleInvoice(invoiceData: any): Observable<any> {
      return this.http.post('sales/sale_invoice_order/', invoiceData);
  }

  showInvoiceCreatedMessage() {
      this.isInvoiceCreated = true;
      setTimeout(() => {
          this.isInvoiceCreated = false; // Hide the message after 3 seconds
      }, 3000);
  }
//Sale-Invoice =====================================================

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }

  // // Function to create a sale invoice
  // createSaleInvoice(invoiceData: any): Observable<any> {
  //   return this.http.post('sales/sale_invoice_order/', invoiceData);
  // }

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
        // this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[9].hide = false;
        // Load sale_order_items with selected status
      //   this.saleOrderItems = res.data.sale_order.sale_order_items.map(item => ({
      //     ...item,
      //     selected: false
      // }));
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
    this.SalesListComponent?.refreshTable();
  }

  // Shows the past orders list modal and fetches orders based on the selected customer
  showOrdersList() {
    // Clear temporary selections and reset checkbox states
    this.tempSelectedProducts = [];
    
    // Reset all checkboxes for products in customerOrders
    this.customerOrders.forEach(order => {
      order.productsList?.forEach(product => {
        product.checked = false; // Add a `checked` property to manage checkbox state
      });
    });
  
    const selectedCustomerId = this.formConfig.model.sale_order.customer_id;
    const selectedCustomerName = this.formConfig.model.sale_order.customer?.name;
  
    if (!selectedCustomerId) {
      this.noOrdersMessage = 'Please select a customer.';
      this.customerOrders = [];
      this.openModal();
      return;
    }
  
    this.customerOrders = [];
    this.noOrdersMessage = '';
  
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
                product_name: item.product?.name ?? 'Unknown Product',
                quantity: item.quantity,
                code: item.product?.code,
                rate: item.rate,
                amount: item.amount,
                discount: item.discount,
                unit_name: item.unit_options?.unit_name ?? 'N/A',
                total_boxes: item.total_boxes ?? 0,
                size: item.size?.size_name ?? 'N/A', 
                color: item.color?.color_name ?? 'N/A',
                remarks: item.remarks ?? '',
                tax: item.tax ?? 0,
                print_name: item.print_name ?? item.product?.name ?? 'N/A',
                checked: false // Initialize checkbox as unchecked
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
    // Remove aria-hidden from the modal when opening
    this.ordersModal.nativeElement.setAttribute('aria-hidden', 'false');
    
    // Ensure any existing backdrops are removed
    this.removeModalBackdrop();
  
    // Add 'show' class and display the modal
    this.ordersModal.nativeElement.classList.add('show');
    this.ordersModal.nativeElement.style.display = 'block';
  
    // Add backdrop and prevent body scroll
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }
  
  hideModal() {
    // console.log('hideModal called');
  
    // Set aria-hidden to true when the modal is hidden
    this.ordersModal.nativeElement.setAttribute('aria-hidden', 'true');
  
    // Hide the modal itself
    this.ordersModal.nativeElement.classList.remove('show');
    this.ordersModal.nativeElement.style.display = 'none';
  
    // console.log('Modal visibility set to none');
  
    // Remove the modal backdrop and body styling
    this.removeModalBackdrop();
  
    // console.log('Body classes after hiding modal:', document.body.classList);
    // console.log('Body overflow style after hiding modal:', document.body.style.overflow);
  }
  
  
  removeModalBackdrop() {
    // Remove all existing backdrops to prevent leftover overlays
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
  
    // Reset body styling to ensure the page is fully interactive again
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';  // Reset overflow to allow scrolling
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
    console.log('Order selected:', order); // Output the order object for debugging

    // Extract the sale_order_id correctly
    const orderId = typeof order === 'object' && order.sale_order_id ? order.sale_order_id : null;

    if (orderId && typeof orderId === 'string') {
      console.log('Order ID:', orderId); // Output the extracted ID
      this.handleOrderSelected(orderId); // Pass the extracted ID
    } else {
      console.error('Invalid orderId, expected a string:', order);
    }
  }
  // Handles the order selection process and updates the form model with the order details
  handleOrderSelected(order: any) {
    console.log('Fetching details for Order:', order); // Log the whole order object
  
    // Extract the orderId correctly
    const orderIdStr = order?.sale_order_id || '';
  
    // Check if orderId is valid and is a string
    if (orderIdStr && typeof orderIdStr === 'string') {
      this.SaleOrderEditID = null; // Ensure this is null to stay in "create" mode.
  
      // Fetch the order details using the correct ID
      this.http.get(`sales/sale_order/${orderIdStr}`).subscribe(
        (res: any) => {
          console.log('Order details response:', res); // Added for debugging
          if (res && res.data) {
            // Load the form data but do not set the primary ID to ensure it stays in "create" mode
            const orderData = res.data;
  
            // Remove identifiers that mark it as an existing order
            // delete orderData.sale_order.sale_order_id;
            // delete orderData.sale_order.id;
  
            // Set the model with the order data
            this.formConfig.model = orderData;
  
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
  
            // Handle the shipping tracking number similarly
            if (!this.shippingTrackingNumber) {
              this.formConfig.model['order_shipments']['shipping_tracking_no'] = ''; // Ensure new order starts blank
            } else {
              this.formConfig.model['order_shipments']['shipping_tracking_no'] = this.shippingTrackingNumber; // Retain the initial tracking number
            }
  
            // Set default dates for the new order
            this.formConfig.model['sale_order']['delivery_date'] = this.nowDate();
            this.formConfig.model['sale_order']['order_date'] = this.nowDate();
            this.formConfig.model['sale_order']['ref_date'] = this.nowDate();
            // this.formConfig.model['order_shipments']['shipping_date'] = this.nowDate();
  
            // Show the form for creating a new order based on this data
            this.showForm = true;
            // this.formConfig.submit.label = 'Submit'; // Change the button label to indicate it's a creation.
            this.cdRef.detectChanges();
          }
        },
        (error) => {
          console.error('Error fetching order details:', error);
        }
      );
    } else {
      console.error('Invalid orderId, expected a string:', orderIdStr);
    }
  
    this.hideModal();
  }


  closeOrdersListModal() {
    this.hideModal(); 
}



  // Closes the modal and removes the modal backdrop
  closeModal() {
    this.hideModal(); // Use the hideModal method to remove the modal elements
  }


// Handles the selected products and updates the form model with them
handleProductPull(selectedProducts: any[]) {
  console.log('Pulled selected products in OrdersListComponent:', selectedProducts);

  // Retrieve or initialize the current sale_order_items list
  let existingProducts = this.formConfig.model['sale_order_items'] || [];

  // Filter out any empty entries from existing products
  existingProducts = existingProducts.filter(product => product && product.product_id);

  selectedProducts.forEach(newProduct => {
      if (!newProduct || !newProduct.product_id || !newProduct.code) {
          console.warn("Skipped an incomplete or undefined product:", newProduct);
          return; // Skip if data is incomplete
      }

      // Check for duplicates by comparing all key fields
      const isDuplicate = existingProducts.some(existingProduct => (
          existingProduct.product_id === newProduct.product_id &&
          existingProduct.code === newProduct.code &&
          existingProduct.total_boxes === (newProduct.total_boxes || 0) &&
          existingProduct.unit_options_id === (newProduct.unit_options_id || null) &&
          existingProduct.quantity === (newProduct.quantity || 1) &&
          existingProduct.size?.size_name === (newProduct.size?.size_name || 'Unspecified') &&
          existingProduct.color?.color_name === (newProduct.color?.color_name || 'Unspecified')
      ));

      if (!isDuplicate) {
          console.log("Adding new product:", newProduct);

          // Add valid, non-duplicate product to existingProducts list
          existingProducts.push({
              product: {
                  product_id: newProduct.product_id,
                  name: newProduct.name || '',
                  code: newProduct.code || '',
              },
              product_id: newProduct.product_id,
              code: newProduct.code || '',
              total_boxes: newProduct.total_boxes || 0,
              unit_options_id: newProduct.unit_options_id || null,
              quantity: newProduct.quantity,
              rate: parseFloat(newProduct.rate) || 0,
              discount: parseFloat(newProduct.discount) || 0,
              print_name: newProduct.print_name || newProduct.name || '',
              amount: parseFloat(newProduct.amount) || 0, // Ensure amount is a number
              tax: parseFloat(newProduct.tax) || 0,       // Ensure tax is a number
              remarks: newProduct.remarks || '',

              // Set size and color properties with defaults if not provided
              size: {
                  size_id: newProduct.size?.size_id || null,
                  size_name: newProduct.size?.size_name || 'Unspecified'
              },
              color: {
                  color_id: newProduct.color?.color_id || null,
                  color_name: newProduct.color?.color_name || 'Unspecified'
              },
              size_id: newProduct.size?.size_id || null,
              color_id: newProduct.color?.color_id || null
          });
      } else {
          console.log("Duplicate detected, skipping product:", newProduct);
      }
  });

  // Update the model with the final product list, ensuring there are no placeholder or duplicate rows
  this.formConfig.model['sale_order_items'] = [...existingProducts];

  // Trigger change detection to update the UI immediately
  this.formConfig.model = { ...this.formConfig.model }; // Refresh the formConfig model
  setTimeout(() => this.cdRef.detectChanges(), 0); // Use async change detection for smooth UI update

  // Log the final products to confirm the update
  console.log("Final Products List in sale_order_items:", this.formConfig.model['sale_order_items']);
}

  ngOnDestroy() {
    // Ensure modals are disposed of correctly
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }

  // API call to fetch available sizes and colors for a selected product
  fetchProductVariations(productID: string): Observable<any> {
    const url = `/products/product_variations/?product_name=${productID}`;
    return this.http.get(url).pipe(((res: any) => res.data));
  }
  
//=====================================================
  isConfirmationModalOpen: boolean = false;
  selectedOption: string = 'sale_order';
  saleOrderSelected = false;
  saleEstimateSelected = false;
  showSuccessToast = false;
  toastMessage = '';
  isAmountModalOpen: boolean = false; // Controls Amount modal
  totalAmount: number = 0; // Replace this with the actual total amount from your logic
  amountExceedMessage: string = ''; // Dynamic message for the modal
  updateProductInfo(currentRowIndex, product, unitData = '') {
    // Select the card wrapper element
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
            ${unitData}`;
      cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
      console.log(`Product Info Updated for ${product.name}`);
    }
  };

  //Added this logic for creating workorder from sale order and changing flow status by triggering URL
  createWorkOrder() {
    if (this.SaleOrderEditID) {
      const productDetails = this.formConfig.model.sale_order_items;
      const saleOrderDetails = this.formConfig.model.sale_order;
  
      // Check if productDetails and saleOrderDetails have valid data
      if (productDetails && saleOrderDetails) {
        const payload = {
          productDetails: productDetails,
          saleOrderDetails: saleOrderDetails,
        };
  
        console.log('Navigating to production with payload:', payload);
  
        // Navigate to the Work Order route without triggering the `move_next_stage` endpoint
        this.router.navigate(['admin/production'], { state: payload });
      } else {
        console.warn('Product details or sale order details are missing.');
      }
    } else {
      console.warn('SaleOrderEditID is not set. Unable to create work order.');
    }
  }
  
  createSaleOrder() {
      this.http.post('sales/sale_order/', this.formConfig.model)
        .subscribe(response => {
          this.showSuccessToast = true;
          this.toastMessage = 'Record created successfully';
          this.ngOnInit();
          setTimeout(() => {
            this.showSuccessToast = false;
          }, 3000); // Hide toast after 3 seconds
        }, error => {
          console.error('Error creating record:', error);
        });
    }
    closeToast() {
      this.showSuccessToast = false;
    }

  confirmSelection() {
    // Check the selected option and set sale_estimate accordingly
    if (this.selectedOption === 'sale_estimate') {
        this.formConfig.model['sale_order']['sale_estimate'] = 'Yes'; // Update model for sale_estimate
    } else {
        this.formConfig.model['sale_order']['sale_estimate'] = 'No'; // Update model for sale_order
    }

    console.log("Selected option:", this.selectedOption);
    console.log("Sale estimate:", this.formConfig.model['sale_order']['sale_estimate']);
    
    // Proceed with the next steps, like API call
    this.createSaleOrder(); // or however you're proceeding
    this.isConfirmationModalOpen = false; // Close modal after selection
  }

  // Method to open Sale Order / Sale Estimate modal
  openSaleOrderEstimateModal() {
    this.isConfirmationModalOpen = true; // Open the Sale Order / Sale Estimate modal
  }

  // Update method specifically for edit actions
  updateSaleOrder() {
    // Define logic here for updating the sale order without modal pop-up
    console.log("Updating sale order:", this.formConfig.model);
    this.http.put(`sales/sale_order/${this.SaleOrderEditID}/`, this.formConfig.model)
        .subscribe(response => {
          this.showSuccessToast = true;
          this.toastMessage = "Record updated successfully"; // Set the toast message for update
          this.ngOnInit();
          setTimeout(() => {
            this.showSuccessToast = false;
          }, 3000);
        
        }, error => {
            console.error('Error updating record:', error);
        });
  }

  // Function to open Amount Exceed modal
openAmountModal(total_amount: number, max_limit: number) {
  console.log("Opening Amount Exceed modal.");
  this.isAmountModalOpen = true;
  this.amountExceedMessage = `The total amount of ${total_amount} exceeds the credit limit of ${max_limit}. Do you want to proceed?`; // Set dynamic message
}

// Confirm action in Amount Exceed modal
proceedWithAmount() {
  console.log("User confirmed to proceed with amount exceeding credit limit.");
  this.isAmountModalOpen = false;

  if (!this.SaleOrderEditID) {
      console.log("Opening Sale Order/Estimate modal after confirmation.");
      this.openSaleOrderEstimateModal(); // Open Sale Order/Estimate modal
  } else {
      console.log("Proceeding to update existing sale order.");
      this.updateSaleOrder(); // Proceed to update existing sale order
  }
}

// Cancel action in Amount Exceed modal
closeAmountModal() {
  console.log("User canceled submission due to exceeding amount limit.");
  this.isAmountModalOpen = false;

  // Ensure the first modal (Sale Order/Estimate Modal) does not open
  this.isConfirmationModalOpen = false;
}

// Close Sale Order/Estimate modal
closeSaleOrderEstimateModal() {
  console.log("Sale Order/Estimate modal closed.");
  this.isConfirmationModalOpen = false;
}

//=======================================================
  setFormConfig() {
    this.SaleOrderEditID = null;
    this.dataToPopulate != undefined;
    this.formConfig = {
      // url: "sales/sale_order/",
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
          value: 'data.sale_order_items.map(m=> {m.size_id = m.size?.size_id || null;  return m ;})'
        },
        {
          key: 'sale_order_items',
          type: 'script',
          value: 'data.sale_order_items.map(m=> {m.color_id = m.color?.color_id || null;  return m ;})'
        }
      ],  
      submit: {
        label: 'Submit',
        submittedFn: () => {
            console.log("Submit button clicked.");
    
            const totalAmount = this.formConfig.model.sale_order.total_amount; // Get the total amount
            const customer = this.formConfig.model.sale_order.customer; // Get the customer details
    
            if (!customer || !customer.credit_limit) {
                console.error("Customer information or credit limit is missing.");
                return;
            }
    
            const maxLimit = parseFloat(customer.credit_limit); // Convert credit limit to number
            console.log(`Total Amount: ${totalAmount}, Credit Limit: ${maxLimit}`);
    
            if (totalAmount >= maxLimit) {
                // Exceeds credit limit: show the Amount Exceed modal
                this.openAmountModal(totalAmount, maxLimit);
            } else {
                // Within credit limit: check if a new sale order or existing
                if (!this.SaleOrderEditID) {
                    console.log("Within credit limit: Opening Sale Order/Estimate modal.");
                    this.openSaleOrderEstimateModal();
                } else {
                    console.log("Within credit limit: Proceeding to update existing sale order.");
                    this.updateSaleOrder();
                }
            }
        }
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
                disabled: true
              }
            },
            {
              key: 'flow_status',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Flow status',
                dataKey: 'flow_status_id',
                dataLabel: 'flow_status_name',
                // placeholder: 'Select Order status type',
                lazy: {
                  url: 'masters/flow_status/',
                  lazyOneTime: true
                },
                // expressions: {
                //   hide: '!model.sale_order_id',
                // },
              },
              hooks: {
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe(data => {
                      //console.log("ledger_account", data);
                      if (data && data.flow_status_id) {
                        this.formConfig.model['sale_order']['flow_status_id'] = data.flow_status_id;
                      }
                    });
                      const valueChangesSubscription = field.formControl.valueChanges.subscribe(data => {
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
                                  flow_status: saleOrder.flow_status
                              },
                              sale_invoice_items: saleOrderItems,
                              order_attachments: orderAttachments,
                              order_shipments: orderShipments
                          };
      
                          console.log('invoiceData:', this.invoiceData);
                      });
                  }
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
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Shipping address',
                placeholder: 'Enter Shipping address'
              },
            }
          ]
        },
        {
          key: 'sale_order_items',
          type: 'repeat',
          className: 'custom-form-list',
          templateOptions: {
            // title: 'Products',
            addText: 'Add Product',
            tableCols: [
              { 
                name: 'selectItem', 
                label: '', 
                type: 'checkbox'
              }, 
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
              },
              // { name: 'select_item', label: 'Select' }
            ]
          },
          fieldArray: {
            fieldGroup: [      
              {
                key: 'selectItem',
                type: 'checkbox',
                defaultValue: false,
                templateOptions: {
                    hideLabel: true,
                },
                expressionProperties: {
                    'templateOptions.hidden': () => !(this.SaleOrderEditID),
                    'templateOptions.disabled': (model) => model.invoiced === 'YES' || !this.SaleOrderEditID
                  }
              },                                     
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
                      // ***Size dropdown will populate with available sizes when product in selected***
                      field.formControl.valueChanges.subscribe(selectedProductId => {
                        const product = this.formConfig.model.sale_order_items[currentRowIndex]?.product;
                        // Ensure the product exists before making an HTTP request
                        if (product?.product_id) {
                          this.http.get(`products/product_variations/?product_id=${product.product_id}`).subscribe((response: any) => {
                            if (response.data.length > 0) {
                              const sizeField = parentArray.fieldGroup.find((f: any) => f.key === 'size');
                              const colorField = parentArray.fieldGroup.find((f: any) => f.key === 'color');
                              // Clear previous options for both size and color fields before adding new ones
                              if (sizeField) sizeField.templateOptions.options = [];
                              if (colorField) colorField.templateOptions.options = [];
                              let availableSizes, availableColors;
                              // Check if response data is non-empty for size
                              if (response.data && response.data.length > 0) {
                                availableSizes = response.data.map((variation: any) => ({
                                  label: variation.size?.size_name || '----',
                                  value: {
                                    size_id: variation.size?.size_id || null,
                                    size_name: variation.size?.size_name || '----'
                                  }
                                }));
                                availableColors = response.data.map((variation: any) => ({
                                  label: variation.color?.color_name || '----',
                                  value: {
                                    color_id: variation.color?.color_id || null,
                                    color_name: variation.color?.color_name || '----'
                                  }
                                }));
                                // Enable and update the size field options if sizes are available
                                if (sizeField) {
                                  sizeField.formControl.enable(); // Ensure the field is enabled
                                  sizeField.templateOptions.options = availableSizes.filter((item, index, self) => index === self.findIndex((t) => t.value.size_id === item.value.size_id)); // Ensure unique size options
                                }
                              } else {
                                // Clear options and keep the fields enabled, without any selection if no options exist
                                if (sizeField) {
                                  sizeField.templateOptions.options = [];
                                }
                                if (colorField) {
                                  colorField.templateOptions.options = [];
                                }
                              }
                            } else {
                              console.log(`For Product: ${product.name}  - No Size and Colors are available setting those to Null**`)
                              this.formConfig.model.sale_order_items[currentRowIndex]['size_id'] = null;
                              this.formConfig.model.sale_order_items[currentRowIndex]['color_id'] = null;
                            }
                          });
                        } else {
                          console.error('Product not selected or invalid.');
                        }
                      });
                      // ***Product Info Text when product is selected code***
                      field.formControl.valueChanges.subscribe(async selectedProductId => {
                        const product = this.formConfig.model.sale_order_items[currentRowIndex]?.product;
                        this.http.get(`products/products_get/?product_id=${product.product_id}`).subscribe({
                          next: (response: any) => {
                            // Handle the successful response here
                            const unitInfo = response.data[0] || {};
                            // Using optional chaining and nullish coalescing to assign values
                            const unitOption = unitInfo.unit_options?.unit_name ?? 'NA';
                            const stockUnit = unitInfo.stock_unit?.stock_unit_name ?? 'NA';
                            const packUnit = unitInfo.pack_unit?.unit_name ?? 'NA';
                            const gPackUnit = unitInfo.g_pack_unit?.unit_name ?? 'NA';
                            const packVsStock = unitInfo.pack_vs_stock ?? 0;
                            const gPackVsPack = unitInfo.g_pack_vs_pack ?? 0;
                            // Regular expression to match 'Stock Unit' 'Stock Pack Gpack Unit' & 'Stock Pack Unit'.
                            const stockUnitReg = /\b[sS][tT][oO][cC][kK][_ ]?[uU][nN][iI][tT]\b/g
                            const GpackReg = /\b(?:[sS]tock[_ ]?[pP]ack[_ ]?)?[gG][pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
                            const stockPackReg = /\b[sS][tT][oO][cC][kK][_ ]?[pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g
                            // Check which pattern matches unit_name
                            let unitData = ''
                            if (stockUnitReg.test(unitOption)) {
                              unitData = `
                                      <span style="color: red;">Stock Unit:</span> 
                                      <span style="color: blue;">${stockUnit}</span> | &nbsp;`
                            } else if (GpackReg.test(unitOption)) {
                              unitData = `
                                      <span style="color: red;">Stock Unit:</span> 
                                      <span style="color: blue;">${stockUnit}</span> |
                                      <span style="color: red;">Pck Unit:</span> 
                                      <span style="color: blue;">${packUnit}</span> |
                                      <span style="color: red;">PackVsStock:</span> 
                                      <span style="color: blue;">${packVsStock}</span> |
                                      <span style="color: red;">GPackUnit:</span> 
                                      <span style="color: blue;">${gPackUnit}</span> |
                                      <span style="color: red;">GPackVsStock:</span> 
                                      <span style="color: blue;">${gPackVsPack}</span> | &nbsp;`
                            } else if (stockPackReg.test(unitOption)) {
                              unitData = `
                                      <span style="color: red;">Stock Unit:</span> 
                                      <span style="color: blue;">${stockUnit}</span> |
                                      <span style="color: red;">Pack Unit:</span> 
                                      <span style="color: blue;">${packUnit}</span> |
                                      <span style="color: red;">PackVsStock:</span> 
                                      <span style="color: blue;">${packVsStock}</span> | &nbsp;`
                            } else {
                              console.log('No Unit Option match found');
                            }
                            // Check if a valid product is selected
                            if (product?.product_id) {
                              this.formConfig.model.sale_order_items[currentRowIndex].product_id = product.product_id;
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
                                        ${unitData}`;
                                cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                                this.unitOptionOfProduct = unitData; // save this data to use in color and size
                                console.log(`Product :  Product Info Updated for ${product.name}**`)
                              }
                            } else {
                              console.log(`No valid product selected for Row ${currentRowIndex}.`);
                            }
                          },
                          error: (err) => {
                            // Handle errors here
                          }
                        });
                      });
                    } else {
                      console.error('Parent array is undefined or not accessible');
                    };
                    // ***Product Details Auto Fill Code***
                    field.formControl.valueChanges.subscribe(data => {
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
                  required: false,
                  lazy: {
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key;

                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingSize = this.dataToPopulate.sale_order_items[currentRowIndex].size;
                        
                        // Set the full product object instead of just the product_id
                        if (existingSize && existingSize.size_id) {
                          field.formControl.setValue(existingSize); // Set full product object (not just product_id)
                        }
                      }

                      // Subscribe to value changes when the form field changes
                      //**End of Size selection part */
                      // Subscribe to value changes of the size field
                      field.formControl.valueChanges.subscribe(selectedSizeId => {
                        const product = this.formConfig.model.sale_order_items[currentRowIndex]?.product;
                        const size = this.formConfig.model.sale_order_items[currentRowIndex]?.size;
                        const size_id = size?.size_id || null
                        // Make sure size exists, if exists then assign the drop down options for 'color' filed.
                        if (size) {
                          let url = `products/product_variations/?product_id=${product.product_id}&size_id=${size.size_id}`
                          if (size_id == null) {
                            url = `products/product_variations/?product_id=${product.product_id}&size_isnull=True`
                          }
                          // Fetch available colors based on the selected size
                          this.http.get(url).subscribe((response: any) => {
                            const availableColors = response.data.map((variation: any) => {
                              return {
                                label: variation.color?.color_name || '----', // Use 'color_name' as the label
                                value: {
                                  color_id: variation.color?.color_id || null,
                                  color_name: variation.color?.color_name || '----'
                                }
                              };
                            });
                            // Filter unique colors (optional, if there's a chance of duplicate colors)
                            const uniqueColors = availableColors.filter((item, index, self) => index === self.findIndex((t) => t.value.color_id === item.value.color_id));
                            // Now, update the color field for the current row
                            const colorField = parentArray.fieldGroup.find((f: any) => f.key === 'color');
                            if (colorField) {
                              // colorField.formControl.setValue(null); // Reset color field value
                              colorField.templateOptions.options = []
                              colorField.templateOptions.options = uniqueColors; // Update the options for the 'color' field
                            }
                          });
                        } else {
                          console.log('Size not selected or invalid.');
                        };
                        // -----------------Product Info------------------------
                        if (product.product_id && selectedSizeId != undefined) {
                          let url = `products/product_variations/?product_id=${product.product_id}&size_id=${size_id}`;
                          if (size_id === null) {
                            url = `products/product_variations/?product_id=${product.product_id}&size_isnull=True`
                          }
                          // Call the API using HttpClient (this.http.get)
                          this.http.get(url).subscribe((data: any) => {
                              function sumQuantities(dataObject: any): number {
                                // First, check if the data object contains the array in the 'data' field
                                if (dataObject && Array.isArray(dataObject.data)) {
                                  // Now we can safely use reduce on dataObject.data
                                  return dataObject.data.reduce((sum, item) => sum + (item.quantity || 0), 0);
                                } else {
                                  console.error("Data is not an array:", dataObject);
                                  return 0;
                                }
                              }
                              const totalBalance = sumQuantities(data);
                              const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
                              if (cardWrapper && data.data[0]) {
                                // Remove existing product info if present
                                cardWrapper.querySelector('.center-message')?.remove();
                                // Display fetched product variation info
                                const productInfoDiv = document.createElement('div');
                                productInfoDiv.classList.add('center-message');
                                productInfoDiv.innerHTML = `
                                        <span style="color: red;">Product Info:</span>
                                        <span style="color: blue;">${data.data[0]?.product.name|| 'NA'}</span> |
                                        <span style="color: red;">Balance:</span>
                                        <span style="color: blue;">${totalBalance}</span> |
                                        ${this.unitOptionOfProduct} `;
                                cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                                console.log("Size :  Product Info Updated**")
                              }
                            },
                            (error) => {
                              console.error("Error fetching data:", error);
                            });
                        } else {
                          console.log(`No valid product or size selected for Row ${currentRowIndex}.`);
                        }
                        //----------------- End of product info-----------------
                      });
                    } else {
                      console.error('Parent array is undefined or not accessible');
                    };
                  },
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (this.formConfig && this.formConfig.model) {
                        this.formConfig.model['sale_order_items'][index]['size_id'] = data?.size_id;
                      } else {
                        console.error('Form config or color model is not defined.');
                      }
                    });
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
                  required: false,
                  lazy: {
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key;

                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingColor = this.dataToPopulate.sale_order_items[currentRowIndex].color;
                        
                        // Set the full product object instead of just the product_id
                        if (existingColor) {
                          field.formControl.setValue(existingColor);
                        }
                      }
                      
                      // Subscribe to value changes when the form field changes
                      field.formControl.valueChanges.subscribe(selectedColorId => {
                        const product = this.formConfig.model.sale_order_items[currentRowIndex]?.product;
                        const size = this.formConfig.model.sale_order_items[currentRowIndex]?.size;
                        const color = this.formConfig.model.sale_order_items[currentRowIndex]?.color;
                        const product_id = product?.product_id;
                        // Check if product_id, size_id, and color_id exist
                        if (product_id && size && color) {
                          const color_id = color?.color_id || null;
                          let url = `products/product_variations/?product_id=${product.product_id}`;
                          if (color.color_id === null) {
                            url += '&color_isnull=True';
                          } else if (color.color_id) {
                            url += `&color_id=${color.color_id}`;
                          }
                          if (size.size_id === null) {
                            url += '&size_isnull=True';
                          } else if (size.size_id) {
                            url += `&size_id=${size.size_id}`;
                          }
                          this.formConfig.model.sale_order_items[currentRowIndex].color_id = color.color_id;
                          // Call the API using HttpClient (this.http.get)
                          this.http.get(url).subscribe(
                            (data: any) => {
                              const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
                              if (cardWrapper && data.data[0]) {
                                cardWrapper.querySelector('.center-message')?.remove();
                                const productInfoDiv = document.createElement('div');
                                productInfoDiv.classList.add('center-message');
                                productInfoDiv.innerHTML = `
                                        <span style="color: red;">Product Info:</span>
                                        <span style="color: blue;">${data.data[0].product.name}</span> |
                                        <span style="color: red;">Size:</span>
                                        <span style="color: blue;">${data.data[0].size?.size_name || 'NA'}</span> |
                                        <span style="color: red;">Color:</span>
                                        <span style="color: blue;">${data.data[0].color?.color_name || 'NA'}</span> |
                                        <span style="color: red;">Balance:</span>
                                        <span style="color: blue;">${data.data[0].quantity}</span> |
                                        ${this.unitOptionOfProduct}`;
                                cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                                console.log("Color :  Product Info Updated**")
                              } else {
                                console.log('Color : Data not available.')
                              }
                            },
                            (error) => {
                              console.error("Error fetching data:", error);
                            });
                        } else {
                          console.log(`No valid Color selected for :${product.name } at Row ${currentRowIndex}.`);
                          console.log({
                            product: product?.name,
                            size: size?.size_name,
                            color: color?.color_name,
                            selectedColorId: selectedColorId
                          })
                          if (color?.color_id === undefined) {
                            this.formConfig.model.sale_order_items[currentRowIndex]['color'] = null
                          }
                        }
                      });
                    }
                  },
                  onChanges: (field: any) => {
                    field.formControl.valueChanges.subscribe((data: any) => {
                      const index = field.parent.key;
                      if (this.formConfig && this.formConfig.model) {
                        this.formConfig.model['sale_order_items'][index]['color_id'] = data?.color_id;
                      } else {
                        console.error('Form config or color model is not defined.');
                      }
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
              },
              {
                type: 'input',
                key: 'quantity',
                // defaultValue: 1,
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
              {
                type: 'select',
                key: 'invoiced',
                defaultValue: 'NO', // Default value set to 'NO'
                templateOptions: {
                    label: 'Invoiced',
                    options: [
                        { value: 'YES', label: 'Yes' },
                        { value: 'NO', label: 'No' }
                    ],
                    hideLabel: true,
                    disabled: true // Make the field read-only in the form
                },
              }
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
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.shipping_mode_id && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.shipping_mode_id);
                          }
                        }
                      }
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
                      },
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.order_shipments.shipping_company_id && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.order_shipments.shipping_company_id);
                          }
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
                      // defaultValue: this.nowDate(),
                      className: 'col-6',
                      templateOptions: {
                        type: 'date',
                        label: 'Shipping Date',
                        // required: true
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
                        // required: true
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
                          },
                          hooks: {
                            onInit: (field: any) => {
                              if (this.dataToPopulate && this.dataToPopulate.order_attachments && field.formControl) {
                                field.formControl.setValue(this.dataToPopulate.order_attachments);
                              }
                            }
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
    }
  }

}
