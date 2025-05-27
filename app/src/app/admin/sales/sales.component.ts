import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { Observable, forkJoin } from 'rxjs';
import { tap, switchMap, map, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { OrderslistComponent } from './orderslist/orderslist.component';
import { CommonModule } from '@angular/common';
import { SalesListComponent } from './sales-list/sales-list.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';
import { BindingType } from '@angular/compiler';
import { FormlyField, FormlyFieldConfig } from '@ngx-formly/core';
import { calculateTotalAmount } from 'src/app/utils/display.utils';
import { CustomFieldHelper } from '../utils/custom_field_fetch';
declare var bootstrap;
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
  invoiceNumber: string = '';
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
  showModal = false;
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
  // sizeOptions: any[] = [];

  // Initialize the copy modal options dynamically
  openCopyModal() {
    this.availableTables = this.tables.filter(table => table !== this.currentTable);
  }

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


  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  dataToPopulate: any;
  saleForm: FormGroup;

  hasDataPopulated: boolean = false;
  customFieldMetadata: any = {}; 
  entitiesList: any[] = [];
  ngOnInit() {
    this.showSaleOrderList = false;
    this.showForm = false;
    this.SaleOrderEditID = null;
    // set form config
    this.checkAndPopulateData();
    this.setFormConfig();
    
    this.loadQuickpackOptions(); // Fetch Quickpack options
    console.log("data in load : ", this.loadQuickpackOptions())

    this.http.get('masters/entities/')
      .subscribe((res: any) => {
        this.entitiesList = res.data || []; // Adjust if the response format differs
      });
    CustomFieldHelper.fetchCustomFields(this.http, 'sale_order', (customFields: any, customFieldMetadata: any) => {
      CustomFieldHelper.addCustomFieldsToFormConfig_2(customFields, customFieldMetadata, this.formConfig);
    });
    // set sale_order default value
    this.formConfig.model['sale_order']['order_type'] = 'sale_order';

    // to get SaleOrder number for save 
    this.getOrderNo();
    this.formConfig.fields[0].fieldGroup[0].fieldGroup[8].hide = true; //flow_status hiding in create page 
    this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[7].hide = true;
    this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[8].hide = true;

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

          if (!this.formConfig.model) {
            this.formConfig.model = {}
          }

          // Clear existing items to avoid duplicates
          this.formConfig.model.sale_order_items = [];
          console.log("checking data status : ", this.formConfig.model.sale_order_items);

          saleOrderItems.forEach((item, index) => {
            this.formConfig.model.sale_order_items.push({
              product_id: item.product.product_id,
              size: item.size.size_name,
              color: item.color.color_name,
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
    console.log("Invoice confirmation started");
    this.isConfirmationInvoiceOpen = false; // Close the modal
    console.log("Triggering point ...");
    this.invoiceCreationHandler(); // Proceed with the invoice creation logic
    console.log("After Triggering ...");
  }


  invoiceCreationHandler() {
    console.log("Invoice Data at handler start:", this.invoiceData);

    // Filter selected items
    const selectedItems = this.invoiceData.sale_invoice_items.filter(item => item.selectItem);

    // If at least one item is selected, use those; otherwise, use all
    const itemsToInvoice = selectedItems.length > 0 ? selectedItems : this.invoiceData.sale_invoice_items;

    let items_value = 0;
    let tax_amount = 0;
    let discount = 0;
    let total_amount = 0;

    itemsToInvoice.forEach(item => {
        const itemValue = parseFloat(item.quantity) * parseFloat(item.rate);
        const discountValue = itemValue * parseFloat(item.discount) / 100;
        const Amount = itemValue - discountValue;
        const taxAmount = parseFloat(item.cgst) + parseFloat(item.sgst) + parseFloat(item.igst);
        const totalAmount = (Amount + taxAmount);

        items_value += itemValue;
        tax_amount += taxAmount;
        // discount += discountValue;
        total_amount += totalAmount;

        // Update each item with calculated values
        item.item_value = itemValue;
        item.tax_amount = taxAmount;
        // item.discount = discountValue;
        item.total_amount = totalAmount;
    });

    console.log("This.Invoice data before : ", this.invoiceData);
    // const saleOrderId = this.invoiceData.sale_invoice_order?.sale_order_id;
    // const customerId = this.invoiceData.sale_invoice_order?.customer?.customer_id;

    // console.log("sale order id : ", saleOrderId);
    // console.log("Customer id : ", customerId);
    // Override calculated fields in invoice data
    const invoiceData = {
        ...this.invoiceData,
        sale_invoice_order: {
            ...this.invoiceData.sale_invoice_order,
            // sale_order_id: this.invoiceData.sale_invoice_order.sale_order_id, // ✅ correct
            // customer_id: this.invoiceData.sale_invoice_order.customer.customer_id, // ✅ correct
            item_value: items_value,
            tax_amount: tax_amount,
            discount: discount,
            total_amount: total_amount
        },
        sale_invoice_items: itemsToInvoice
    };

    console.log("Invoice Data with selected items:", invoiceData);

    if (itemsToInvoice.length > 0) {
        this.createSaleInvoice(invoiceData).subscribe(
            response => {
                console.log('Sale invoice created successfully', response);
                this.showInvoiceCreatedMessage();

                itemsToInvoice.forEach(item => {
                    if (item.invoiced === 'NO') {
                        item.invoiced = 'YES';
                        this.updateInvoicedStatusDirectly(item.sale_order_item_id, 'YES');
                    }
                });

                const saleOrderId = this.invoiceData.sale_invoice_order.sale_order_id;
                const allInvoiced = this.invoiceData.sale_invoice_items.every(item => item.invoiced === 'YES');
                if (allInvoiced) {
                    this.triggerWorkflowPipeline(saleOrderId);
                }
            },
            error => {
                console.error('Error creating sale invoice', error);
            }
        );
    } else {
        console.warn('No items selected for invoicing');
    }

    this.ngOnInit();  // Re-initialize the form if needed
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

  // // This function triggers the workflow pipeline API call using POST method
  // private triggerWorkflowPipeline(saleOrderId: string, saleType: string) {

  //   // Don't trigger workflow if saleType is "Others"
  //   if (saleType === 'Others') {
  //     console.log('Workflow trigger skipped: saleType is "Others"');
  //     return;
  //   }
  //   const apiUrl = 'sales/SaleOrder/{saleOrderId}/move_next_stage/'; //correct url
  //   const url = apiUrl.replace('{saleOrderId}', saleOrderId); // Replace placeholder with saleOrderId

  //   // POST request without any additional payload
  //   this.http.post(url, {}).subscribe(
  //     response => {
  //       console.log('POST request successful:', response);
  //     },
  //     error => {
  //       console.error('Error triggering workflow pipeline:', error);
  //     }
  //   );
  // }

  private triggerWorkflowPipeline(saleOrderId: string) {
    // if (!saleOrderId) {
    //   console.warn('Sale Order ID is undefined. Skipping workflow trigger.');
    //   return;
    // }
  
    const apiUrl = `sales/SaleOrder/${saleOrderId}/move_next_stage/`;
  
    this.http.post(apiUrl, {}).subscribe(
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
    this.showForm = false;
    this.http.get('sales/sale_order/' + event).subscribe((res: any) => {
      if (res && res.data) {

        this.formConfig.model = res.data;
        // set sale_order default value
        this.formConfig.model['sale_order']['order_type'] = 'sale_order';
        // set labels for update
        // show form after setting form values
        this.formConfig.pkId = 'sale_order_id';
        this.formConfig.model['flow_status'] = res.data.sale_order.flow_status;
        this.formConfig.model['tax_amount'] = res.data.sale_order.tax_amount;
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['sale_order_id'] = this.SaleOrderEditID;
        this.showForm = true;
        this.formConfig.fields[0].fieldGroup[0].fieldGroup[8].hide = false;
        this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[7].hide = false;
        this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[8].hide = true;

        // Ensure custom_field_values are correctly populated in the model
        if (res.data.custom_field_values) {
          this.formConfig.model['custom_field_values'] = res.data.custom_field_values.reduce((acc: any, fieldValue: any) => {
            acc[fieldValue.custom_field_id] = fieldValue.field_value; // Map custom_field_id to the corresponding value
            return acc;
          }, {});
        }
      }

      this.totalAmountCal();
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


  ordersListModal: any;
  openModal() {

    this.ordersListModal = new bootstrap.Modal(document.getElementById("ordersListModal"));
    this.ordersListModal.show();

    // // Remove aria-hidden from the modal when opening
    // this.ordersModal.nativeElement.setAttribute('aria-hidden', 'false');

    // // Ensure any existing backdrops are removed
    // this.removeModalBackdrop();

    // // Add 'show' class and display the modal
    // this.ordersModal.nativeElement.classList.add('show');
    // this.ordersModal.nativeElement.style.display = 'block';

    // // Add backdrop and prevent body scroll
    // const backdrop = document.createElement('div');
    // backdrop.className = 'modal-backdrop fade show';
    // document.body.appendChild(backdrop);
    // document.body.classList.add('modal-open');
    // document.body.style.overflow = 'hidden';
  }

  hideModal() {
    // var myModal = new bootstrap.Modal(document.getElementById("ordersListModal"));
    this.ordersListModal.hide();
    // console.log('hideModal called');

    // Set aria-hidden to true when the modal is hidden
    // this.ordersModal.nativeElement.setAttribute('aria-hidden', 'true');

    // // Hide the modal itself
    // this.ordersModal.nativeElement.classList.remove('show');
    // this.ordersModal.nativeElement.style.display = 'none';

    // // console.log('Modal visibility set to none');

    // // Remove the modal backdrop and body styling
    // this.removeModalBackdrop();

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
  quickpackOptions: any[] = []; // To store available Quickpack options
  selectedQuickpack: string = ''; // Selected Quickpack value

  loadQuickpackOptions() {
    this.http.get('sales/quick_pack/') // Replace with your API endpoint
      .subscribe((response: any) => {
        this.quickpackOptions = response.data || []; // Adjust based on API response
        console.log("quickpackOptions : ", this.quickpackOptions);
      });
  }


  loadQuickpackProducts() {
    console.log("quick pack id : ", this.selectedQuickpack)
    if (!this.selectedQuickpack) {
      console.log('Please select a Quickpack!');
      return;
    }

    this.http.get(`sales/quick_pack/${this.selectedQuickpack}`)
      .subscribe((response: any) => {
        console.log("response : ", response.data.quick_pack_data_items);
        const quickPackDataItems = response.data.quick_pack_data_items || [];

        if (quickPackDataItems.length === 0) {
          console.log('No items found in the selected Quickpack!');
          return;
        }
        // Populate `sale_order_items` with Quickpack data
        this.formConfig.model.sale_order_items = quickPackDataItems.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          print_name: item.product.print_name,
          rate: item.product.mrp,
          discount: item.product.dis_amount,
          unit_options_id: item.product.unit_options

        }));

        // Trigger form change detection (if needed)
        if (this.salesForm) {
          console.log("we are inside : ", this.salesForm.form);
          this.salesForm.form.controls.sale_order_items.patchValue(this.formConfig.model.sale_order_items);
          console.log("After method ...")
        }

        console.log('Sale Order Items populated:', this.formConfig.model.sale_order_items);
      });
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

  createSaleOrder() {
    const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields
  
    // Determine the entity type and ID dynamically
    const entityName = 'sale_order'; // Since we're in the Sale Order form
    const customId = this.formConfig.model.sale_order?.sale_order_id || null; // Ensure correct sale_order_id
  
    // Find entity record from list
    const entity = this.entitiesList.find(e => e.entity_name === entityName);

    if (!entity) {
      console.error(`Entity not found for: ${entityName}`);
      return;
    }

    const entityId = entity.entity_id;
    // Inject entity_id into metadata temporarily
    Object.keys(this.customFieldMetadata).forEach((key) => {
      this.customFieldMetadata[key].entity_id = entityId;
    });
    // Construct payload for custom fields
    const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityName, customId);
  
    if (!customFieldsPayload) {
      this.showDialog(); // Stop execution if required fields are missing
    }
  
    // Construct the final payload
    const payload = {
      ...this.formConfig.model,
      // custom_field: customFieldsPayload.custom_field, // Dictionary of custom fields
      custom_field_values: customFieldsPayload.custom_field_values // Array of custom field values
    };
  
    this.http.post('sales/sale_order/', payload)
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

  showDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'flex'; // Show the dialog
    }
  }

  // Function to close the custom dialog
  closeDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'none'; // Hide the dialog
    }
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
    const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields

    // Determine the entity type and ID dynamically
    const entityName = 'sale_order'; // Since we're in the Sale Order form
    const customId = this.formConfig.model.sale_order?.sale_order_id || null; // Ensure correct sale_order_id

    // Find entity record from list
    const entity = this.entitiesList.find(e => e.entity_name === entityName);

    if (!entity) {
      console.error(`Entity not found for: ${entityName}`);
      return;
    }

    const entityId = entity.entity_id;
    // Inject entity_id into metadata temporarily
    Object.keys(this.customFieldMetadata).forEach((key) => {
      this.customFieldMetadata[key].entity_id = entityId;
    });
    // Construct payload for custom fields
    const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityName, customId);

    
    // Construct the final payload for update
    const payload = {
      ...this.formConfig.model,
      custom_field_values: customFieldsPayload.custom_field_values // Array of dictionaries
    };

    // Define logic here for updating the sale order without modal pop-up
    console.log("Updating sale order:", this.formConfig.model);
    this.http.put(`sales/sale_order/${this.SaleOrderEditID}/`, payload)
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
  loadProductVariations(field: FormlyFieldConfig, productValuechange: boolean = false) {
    const parentArray = field.parent;

    const product = field.formControl.value; //this.formConfig.model.sale_order_items[currentRowIndex]?.product;
    // Ensure the product exists before making an HTTP request

    if (product?.product_id) {
      const sizeField: any = parentArray.fieldGroup.find((f: any) => f.key === 'size');
      const colorField: any = parentArray.fieldGroup.find((f: any) => f.key === 'color');
      if (productValuechange) {
        sizeField.formControl.setValue(null);
        colorField.formControl.setValue(null);
      }
      // Clear previous options for both size and color fields before adding new ones
      if (sizeField) sizeField.templateOptions.options = [];
      if (colorField) colorField.templateOptions.options = [];
      this.http.get(`products/product_variations/?product_id=${product.product_id}`).subscribe((response: any) => {
        if (response.data.length > 0) {

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
        }
      });
    } else {
      console.error('Product not selected or invalid.');
    }
  };

  async autoFillProductDetails(field, data) {
    this.productOptions = data;
    console.log("Autofill data : ", this.productOptions)
    if (!field.form?.controls || !data) return;
    const fieldMappings = {
      code: data.code,
      rate: data.sales_rate || field.form.controls.rate.value,
      discount: parseFloat(data.discount) || 0,
      unit_options_id: data.unit_options?.unit_options_id,
      print_name: data.print_name,
      mrp: data.mrp
    };
  
    Object.entries(fieldMappings).forEach(([key, value]) => {
      if (value !== undefined) field.form.controls[key]?.setValue(value);
    });
    this.totalAmountCal();
  }

  createWorkOrder() {
    if (this.SaleOrderEditID) {
        // 1. Check for selected items
        let selectedProducts = this.formConfig.model.sale_order_items.filter(item => item.selectItem);

        // 2. If no products are selected, select all products by default
        if (selectedProducts.length === 0) {
            selectedProducts = [...this.formConfig.model.sale_order_items]; // Select all products
            console.log("No product selected. Defaulting to all products:", selectedProducts);
        }

        // 3. Get sale order details
        const saleOrderDetails = this.formConfig.model.sale_order;
        const orderAttachmentsDetails = this.formConfig.model.order_attachments;
        const orderShipmentsDetails = this.formConfig.model.order_shipments;

        // 4. Proceed only if sale order details exist
        if (saleOrderDetails && orderAttachmentsDetails && orderShipmentsDetails) {
            this.selectedOrder = {
                productDetails: selectedProducts,
                saleOrderDetails: saleOrderDetails,
                orderAttachments: orderAttachmentsDetails,
                orderShipments: orderShipmentsDetails
            };

            // 5. Open the modal
            this.showModal = true;
        } else {
            console.warn('Sale order details or attachments/shipments are missing.');
        }
    } else {
        console.warn('SaleOrderEditID is not set. Unable to create work order.');
    }
}


  closeModalworkorder() {
    this.showModal = false;
    this.selectedOrder = null;
  }

  confirmWorkOrder() {
    console.log("data1", this.selectedOrder);
    if (this.selectedOrder) {
        let { productDetails, saleOrderDetails, orderAttachments, orderShipments } = this.selectedOrder;

        // 1. Check if all products are selected (auto-selection case)
        const allProducts = this.formConfig.model.sale_order_items;
        const isAllProductsSelected = productDetails.length === allProducts.length;

        if (isAllProductsSelected) {
            console.log("All products selected. Creating only work orders...");

            this.http.post(`sales/SaleOrder/${saleOrderDetails.sale_order_id}/move_next_stage/`, {}).subscribe({
                next: (updateResponse) => {
                    console.log('Parent Sale Order updated to Production:', updateResponse);

                    // Create Work Orders for all products (No child sale order)
                    const processWorkOrders = productDetails.map((product) => {
                        const workOrderPayload = {
                            work_order: {
                                product_id: product.product_id,
                                quantity: product.quantity || 0,
                                completed_qty: 0,
                                pending_qty: product.quantity || 0,
                                start_date: saleOrderDetails.order_date || new Date().toISOString().split('T')[0],
                                sync_qty: true,
                                size_id: product.size?.size_id || null,
                                color_id: product.color?.color_id || null,
                                status_id: '',
                                sale_order_id: saleOrderDetails.sale_order_id // Link to parent sale order
                            },
                            bom: [
                              {
                                product_id: product.product_id,
                                size_id: product.size?.size_id || null,
                                color_id: product.color?.color_id || null,
                              }
                            ],
                            work_order_machines: [],
                            workers: [],
                            work_order_stages: []
                        };

                        console.log('Work Order Payload:', workOrderPayload);

                        return this.http.post('production/work_order/', workOrderPayload)
                        
                    });

                    forkJoin(processWorkOrders).subscribe({
                        next: () => {
                            this.closeModalworkorder();
                            console.log('Work Orders created successfully (without child sale orders)!');
                        },
                        error: (err) => {
                            console.error('Error creating Work Orders:', err);
                            alert('Failed to create Work Orders. Please try again.');
                        }
                    });
                },
                error: (err) => {
                    console.error('Error updating Parent Sale Order:', err);
                }
            });
        } else {
            console.log("Partial products selected. Creating child sale orders & work orders...");

            // If only some products are selected, create Child Sale Orders & Work Orders
            const parentOrderNo = saleOrderDetails.order_no; // Parent order number
            let childOrderCounter = 1;

            const processProductRequests = productDetails.map((product) => {
                const childOrderNo = `${parentOrderNo}-${childOrderCounter++}`;

                // Create Child Sale Order
                const childSaleOrderPayload = {
                    sale_order: {
                        order_no: childOrderNo,
                        ref_no: saleOrderDetails.ref_no,
                        sale_type_id: saleOrderDetails.sale_type_id,
                        tax: saleOrderDetails.tax,
                        cess_amount: saleOrderDetails.cess_amount,
                        tax_amount: saleOrderDetails.tax_amount,
                        advance_amount: saleOrderDetails.advance_amount,
                        ledger_account_id: saleOrderDetails.ledger_account_id,
                        order_status_id: saleOrderDetails.order_status_id,
                        customer_id: saleOrderDetails.customer.customer_id,
                        order_date: saleOrderDetails.order_date,
                        ref_date: saleOrderDetails.ref_date,
                        delivery_date: saleOrderDetails.delivery_date,
                        order_type: 'sale_order',
                        sale_estimate: saleOrderDetails.sale_estimate || 'No',
                        flow_status: { flow_status_name: 'Production' }, // Set flow_status to 'Production'
                        billing_address: saleOrderDetails.billing_address,
                        shipping_address: saleOrderDetails.shipping_address,
                        email: saleOrderDetails.email,
                        remarks: saleOrderDetails.remarks || null
                    },
                    sale_order_items: [product], // Only selected product
                    order_attachments: orderAttachments,
                    order_shipments: orderShipments
                };

                console.log('Payload for child sale order:', childSaleOrderPayload);

                return this.http.post('sales/sale_order/', childSaleOrderPayload).pipe(
                    tap((childSaleOrderResponse: any) => {
                        console.log(`Child Sale Order ${childOrderNo} created:`, childSaleOrderResponse);

                        this.http.patch(`sales/sale_order_items/${product.sale_order_item_id}/`, { work_order_created: 'YES' })
                            .subscribe({
                                next: () => console.log(`Product ${product.product_id} marked as Work Order Created in Parent Sale Order`),
                                error: (err) => console.error('Error updating work order status:', err)
                            });

                        // Create Work Order linked to Child Sale Order
                        const workOrderPayload = {
                            work_order: {
                                product_id: product.product_id,
                                quantity: product.quantity || 0,
                                completed_qty: 0,
                                pending_qty: product.quantity || 0,
                                start_date: saleOrderDetails.order_date || new Date().toISOString().split('T')[0],
                                sync_qty: true,
                                size_id: product.size?.size_id || null,
                                color_id: product.color?.color_id || null,
                                status_id: '',
                                sale_order_id: childSaleOrderResponse.data.sale_order.sale_order_id // Link to child sale order
                            },
                            bom: [
                              {
                                product_id: product.product_id,
                                size_id: product.size?.size_id || null,
                                color_id: product.color?.color_id || null,
                              }
                            ],
                            work_order_machines: [],
                            workers: [],
                            work_order_stages: []
                        };

                        console.log('Work Order Payload:', workOrderPayload);

                        this.http.post('production/work_order/', workOrderPayload).subscribe({
                            next: (workOrderResponse) => {
                                console.log('Work Order created:', workOrderResponse);
                                this.showSuccessToast = true;
                                this.toastMessage = "WorkOrder & Child Sale Order created"; // Set the toast message for update
                                setTimeout(() => {
                                  this.showSuccessToast = false;
                                }, 3000);
                            },
                            error: (err) => {
                                console.error('Error creating Work Order:', err);
                            }
                        });
                    })
                );
            });

            // 5. Process all child sale orders & work orders
            forkJoin(processProductRequests).subscribe({
                next: () => {
                    this.closeModalworkorder();
                    console.log('Child Sale Orders and Work Orders created successfully!');
                },
                error: (err) => {
                    console.error('Error processing products:', err);
                    alert('Failed to create Child Sale Orders or Work Orders. Please try again.');
                }
            });
        }
    }
    this.ngOnInit();
  };

  getUnitData(unitInfo) {
    const unitOption = unitInfo.unit_options?.unit_name ?? 'NA';
    const stockUnit = unitInfo.stock_unit?.stock_unit_name ?? 'NA';
    const packUnit = unitInfo.pack_unit?.unit_name ?? 'NA';
    const gPackUnit = unitInfo.g_pack_unit?.unit_name ?? 'NA';
    const packVsStock = unitInfo.pack_vs_stock ?? 0;
    const gPackVsPack = unitInfo.g_pack_vs_pack ?? 0;
  
    const stockUnitReg = /\b[sS][tT][oO][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
    const GpackReg = /\b(?:[sS]tock[_ ]?[pP]ack[_ ]?)?[gG][pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
    const stockPackReg = /\b[sS][tT][oO][cC][kK][_ ]?[pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
  
    if (stockUnitReg.test(unitOption)) {
      return `<span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> | &nbsp;`;
    } else if (GpackReg.test(unitOption)) {
      return `
        <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> |
        <span style="color: red;">Pck Unit:</span> <span style="color: blue;">${packUnit}</span> |
        <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${packVsStock}</span> |
        <span style="color: red;">GPackUnit:</span> <span style="color: blue;">${gPackUnit}</span> |
        <span style="color: red;">GPackVsStock:</span> <span style="color: blue;">${gPackVsPack}</span> | &nbsp;`;
    } else if (stockPackReg.test(unitOption)) {
      return `
        <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> |
        <span style="color: red;">Pack Unit:</span> <span style="color: blue;">${packUnit}</span> |
        <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${packVsStock}</span> | &nbsp;`;
    } else {
      console.log('No Unit Option match found');
      return "";
    }
  }

// product info text when size is selected
  sumQuantities(dataObject: any): number {
  // First, check if the data object contains the array in the 'data' field
  if (dataObject && Array.isArray(dataObject.data)) {
    // Now we can safely use reduce on dataObject.data
    return dataObject.data.reduce((sum, item) => sum + (item.quantity || 0), 0);
  } else {
    console.error("Data is not an array:", dataObject);
    return 0;
  }
}

  displayInformation(product: any, size: any, color: any, unitData : any, sizeBalance: any, colorBalance: any) {
    const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
    let data = '';

    if (product) {
      data = `
        <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> |                            
        <span style="color: red;">Balance:</span> <span style="color: blue;">${product?.balance || 0}</span>`;
    }

    if (size) {
      data = `
        <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> |                            
        <span style="color: red;">Size:</span> <span style="color: blue;">${size.size_name}</span> |
        <span style="color: red;">Balance:</span> <span style="color: blue;">${sizeBalance || 0}</span>
        `;
    }

    if (color) {
      data = `
        <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> |                            
        <span style="color: red;">Size:</span> <span style="color: blue;">${size.size_name}</span> |
        <span style="color: red;">Color:</span> <span style="color: blue;">${color.color_name}</span> |
        <span style="color: red;">Balance:</span> <span style="color: blue;">${colorBalance || 0}</span>
        `;
    }

    data += ` | ${unitData}`;

    cardWrapper.querySelector('.center-message')?.remove();
    const productInfoDiv = document.createElement('div');
    productInfoDiv.classList.add('center-message');
    productInfoDiv.innerHTML = data;
    cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
  };

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
          console.log("Customer in formconfig : ", customer);
          console.log("Customer.credit_limit : ", customer.credit_limit);

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
        order_shipments: {},
        custom_field_values: []
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block row ms-0",
          key: 'sale_order',
          fieldGroup: [
            {
              className: 'col-lg-9 col-md-8 col-12 p-0',
              fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
              fieldGroup: [
                {
                  key: 'sale_type',
                  type: 'select',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Sale type',
                    dataKey: 'sale_type_id',
                    dataLabel: 'name',
                    required: true,
                    options: [],
                    lazy: {
                      url: 'masters/sale_types/',
                      lazyOneTime: true
                    }
                  },
                  hooks: {
                    onInit: (field: any) => {
                      const lazyUrl = field.templateOptions.lazy.url;
                      this.http.get(lazyUrl).subscribe((response: any) => {
                        const saleTypes = response.data;
                        field.templateOptions.options = saleTypes;
                
                        // Set default value if needed
                        if (!field.formControl.value) {
                          const defaultOption = saleTypes.find((option: any) => option.name === 'Advance Order');
                          if (defaultOption) {
                            field.formControl.setValue(defaultOption);
                          }
                        }
                      });
                
                      // Handle changes
                      field.formControl.valueChanges.subscribe((data: any) => {
                        if (data && data.name && data.sale_type_id) {
                          const saleTypeName = data.name;
                          const saleTypeId = data.sale_type_id;
                
                          // Set sale_type_id in model
                          this.formConfig.model['sale_order']['sale_type_id'] = saleTypeId;
                
                          // Generate order number
                          const prefix = saleTypeName === 'Other' ? 'SOO' : 'SO';
                          this.http.get(`masters/generate_order_no/?type=${prefix}`).subscribe((res: any) => {
                            if (res?.data?.order_number) {
                              this.orderNumber = res.data.order_number;
                              this.formConfig.model['sale_order']['order_no'] = this.orderNumber;
                              field.form.controls.order_no.setValue(this.orderNumber);
                              this.cdRef.detectChanges();
                            }
                          });
                
                          // Update and refresh customer field
                          const customerField = field.parent?.fieldGroup?.find(f => f.key === 'customer');
                          if (customerField?.props?.lazy) {
                            const baseUrl = 'customers/customers/?summary=true';
                            const customerUrl = saleTypeName === 'Other' ? `${baseUrl}&sale_type=Other` : baseUrl;
                
                            customerField.props.lazy.url = customerUrl;
                            customerField.props.lazy.lazyOneTime = false;
                            customerField.props.options = [];
                            customerField.formControl.setValue(null);
                
                            // Force refresh
                            const customerKey = customerField.key;
                            const parentGroup = field.parent?.fieldGroup;
                            const index = parentGroup.findIndex(f => f.key === customerKey);
                            if (index !== -1) {
                              const removed = parentGroup.splice(index, 1)[0];
                              setTimeout(() => {
                                parentGroup.splice(index, 0, removed);
                                this.cdRef.detectChanges();
                              });
                            }
                          }
                        }
                      });
                    }
                  }
                },                                                                            
                {
                  key: 'customer',
                  type: 'select',
                  className: 'col-md-4 col-sm-6 col-12',
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
                  key: 'order_no',
                  type: 'input',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Order no',
                    placeholder: 'Enter Order No',
                    required: true,
                    // readonly: true
                    disabled: true
                  }
                },
                {
                  key: 'delivery_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-md-4 col-sm-6 col-12',
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
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'date',
                    label: 'Order date',
                    readonly: true,
                    required: true
                  }
                },
                {
                  key: 'ref_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'date',
                    label: 'Ref date',
                    placeholder: 'Select Ref date',
                    readonly: true,
                    required: true,
                  }
                },
                {
                  key: 'ref_no',
                  type: 'input',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'input',
                    label: 'Ref No',
                    placeholder: 'Enter Ref No',
                    required: true,
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
                  key: 'tax',
                  type: 'select',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Tax',
                    required: true,
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
                  key: 'flow_status',
                  type: 'select',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Flow status',
                    dataKey: 'flow_status_id',
                    dataLabel: 'flow_status_name',
                    lazy: {
                      url: 'masters/flow_status/',
                      lazyOneTime: true
                    }
                  },
                  hooks: {
                    onChanges: (field: any) => {
                      field.formControl.valueChanges.subscribe(data => {
                        if (data && data.flow_status_id) {
                          this.formConfig.model['sale_order']['flow_status_id'] = data.flow_status_id;
                        }
                      });
                
                      const valueChangesSubscription = field.formControl.valueChanges.subscribe(data => {
                        const saleOrder = this.formConfig.model['sale_order'];
                        const saleOrderItems = this.formConfig.model['sale_order_items'];
                        const orderAttachments = this.formConfig.model['order_attachments'];
                        const orderShipments = this.formConfig.model['order_shipments'];
                
                        const saleTypeObj = saleOrder.sale_type;
                        const saleTypeName = saleTypeObj?.name || '';
                        const billType = (saleTypeName === 'Other') ? 'OTHERS' : 'CASH';
                        const invoicePrefix = (saleTypeName === 'Other') ? 'SOO-INV' : 'SO-INV';
                
                        this.http.get(`masters/generate_order_no/?type=${invoicePrefix}`).subscribe((res: any) => {
                          if (res?.data?.order_number) {
                            this.invoiceNumber = res.data.order_number;
                
                            // ✅ Fetch order_status_id by status_name = "Completed"
                            this.http.get('masters/order_status/?status_name=Completed').subscribe((statusRes: any) => {
                              const completedStatus = statusRes?.data?.[0];
                              const completedStatusId = completedStatus?.order_status_id;
                
                              const totalAmount = () => {
                                if (!Array.isArray(saleOrderItems) || saleOrderItems.length === 0) return 0;
                                return saleOrderItems.reduce((sum, item) => {
                                  const quantity = Number(item.quantity) || 0;
                                  const rate = Number(item.rate) || 0;
                                  return sum + (quantity * rate);
                                }, 0);
                              };
                
                              this.invoiceData = {
                                sale_invoice_order: {
                                  invoice_no: this.invoiceNumber,
                                  bill_type: billType,
                                  invoice_date: this.nowDate(),
                                  email: saleOrder.email,
                                  ref_no: saleOrder.ref_no,
                                  ref_date: this.nowDate(),
                                  tax: saleOrder.tax || 'Inclusive',
                                  remarks: saleOrder.remarks,
                                  advance_amount: saleOrder.advance_amount || '0',
                                  item_value: totalAmount(),
                                  discount: saleOrder.discount,
                                  dis_amt: saleOrder.dis_amt,
                                  taxable: saleOrder.taxable,
                                  cess_amount: saleOrder.cess_amount,
                                  transport_charges: saleOrder.transport_charges,
                                  round_off: saleOrder.round_off,
                                  total_amount: totalAmount(),
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
                                  flow_status: saleOrder.flow_status,
                                  order_status_id: completedStatusId,
                                  ...(saleTypeName !== 'Other' && { sale_order_id: saleOrder.sale_order_id })
                                },
                                sale_invoice_items: saleOrderItems,
                                order_attachments: orderAttachments,
                                order_shipments: orderShipments
                              };
                
                              console.log('invoiceData:', this.invoiceData);
                            });
                          }
                        });
                      });
                    }
                  }
                },      
                // {
                //   key: 'flow_status',
                //   type: 'select',
                //   className: 'col-md-4 col-sm-6 col-12',
                //   templateOptions: {
                //     label: 'Flow status',
                //     dataKey: 'flow_status_id',
                //     dataLabel: 'flow_status_name',
                //     lazy: {
                //       url: 'masters/flow_status/',
                //       lazyOneTime: true
                //     }
                //   },
                //   hooks: {
                //     onChanges: (field: any) => {
                //       field.formControl.valueChanges.subscribe(data => {
                //         if (data && data.flow_status_id) {
                //           this.formConfig.model['sale_order']['flow_status_id'] = data.flow_status_id;
                //         }
                //       });
                
                //       const valueChangesSubscription = field.formControl.valueChanges.subscribe(data => {
                //         const saleOrder = this.formConfig.model['sale_order'];
                //         console.log("saleOrder : ", saleOrder);
                //         const saleOrderItems = this.formConfig.model['sale_order_items'];
                //         const orderAttachments = this.formConfig.model['order_attachments'];
                //         const orderShipments = this.formConfig.model['order_shipments'];
                
                //         const saleTypeObj = saleOrder.sale_type;
                //         const saleTypeName = saleTypeObj?.name || '';
                //         const billType = (saleTypeName === 'Other') ? 'OTHERS' : 'CASH';
                //         const invoicePrefix = (saleTypeName === 'Other') ? 'SOO-INV' : 'SO-INV';
                
                //         this.http.get(`masters/generate_order_no/?type=${invoicePrefix}`).subscribe((res: any) => {
                //           if (res?.data?.order_number) {
                //             this.invoiceNumber = res.data.order_number;
                
                //             // Fetch order_status_id by status_name = "Completed"
                //             this.http.get('masters/order_status/?status_name=Completed').subscribe((statusRes: any) => {
                //               const completedStatus = statusRes?.data?.[0];
                //               const completedStatusId = completedStatus?.order_status_id;
                
                //               const totalAmount = () => {
                //                 if (!Array.isArray(saleOrderItems) || saleOrderItems.length === 0) return 0;
                //                 return saleOrderItems.reduce((sum, item) => {
                //                   const quantity = Number(item.quantity) || 0;
                //                   const rate = Number(item.rate) || 0;
                //                   return sum + (quantity * rate);
                //                 }, 0);
                //               };
                
                //               this.invoiceData = {
                //                 sale_invoice_order: {
                //                   ...(saleTypeName === 'Other' && { invoice_no: this.invoiceNumber }),
                //                   bill_type: billType,
                //                   invoice_date: this.nowDate(),
                //                   email: saleOrder.email,
                //                   customer: saleOrder.customer,
                //                   ref_no: saleOrder.ref_no,
                //                   ref_date: this.nowDate(),
                //                   tax: saleOrder.tax || 'Inclusive',
                //                   remarks: saleOrder.remarks,
                //                   advance_amount: saleOrder.advance_amount || '0',
                //                   item_value: totalAmount(),
                //                   discount: saleOrder.discount,
                //                   dis_amt: saleOrder.dis_amt,
                //                   taxable: saleOrder.taxable,
                //                   cess_amount: saleOrder.cess_amount,
                //                   transport_charges: saleOrder.transport_charges,
                //                   round_off: saleOrder.round_off,
                //                   total_amount: totalAmount(),
                //                   vehicle_name: saleOrder.vehicle_name,
                //                   total_boxes: saleOrder.total_boxes,
                //                   shipping_address: saleOrder.shipping_address,
                //                   billing_address: saleOrder.billing_address,
                //                   customer_id: saleOrder.customer?.customer_id,
                //                   gst_type_id: saleOrder.gst_type_id,
                //                   order_type: saleOrder.order_type || 'sale_invoice',
                //                   order_salesman_id: saleOrder.order_salesman_id,
                //                   customer_address_id: saleOrder.customer_address_id,
                //                   payment_term_id: saleOrder.payment_term_id,
                //                   payment_link_type_id: saleOrder.payment_link_type_id,
                //                   ledger_account_id: saleOrder.ledger_account_id,
                //                   flow_status: saleOrder.flow_status,
                //                   order_status_id: completedStatusId,
                //                   sale_order_id:saleOrder.sale_order_id,
                //                   ...(saleTypeName !== 'Other' && { sale_order_id: saleOrder.sale_order_id }),
                                  
                //                   // ✅ Tell backend to create in mstcnl DB
                //                   ...(saleTypeName === 'Other' && { db: 'mstcnl' })
                //                 },
                //                 sale_invoice_items: saleOrderItems,
                //                 order_attachments: orderAttachments,
                //                 order_shipments: orderShipments
                //               };
                
                //               console.log('invoiceData:', this.invoiceData);
                //             });
                //           }
                //         });
                //       });
                //     }
                //   }
                // },    
                // {
                //   key: 'flow_status',
                //   type: 'select',
                //   className: 'col-md-4 col-sm-6 col-12',
                //   templateOptions: {
                //     label: 'Flow status',
                //     dataKey: 'flow_status_id',
                //     dataLabel: 'flow_status_name',
                //     // placeholder: 'Select Order status type',
                //     lazy: {
                //       url: 'masters/flow_status/',
                //       lazyOneTime: true
                //     },
                //     // expressions: {
                //     //   hide: '!model.sale_order_id',
                //     // },
                //   },
                //   hooks: {
                //     onChanges: (field: any) => {
                //       field.formControl.valueChanges.subscribe(data => {
                //         //console.log("ledger_account", data);
                //         if (data && data.flow_status_id) {
                //           this.formConfig.model['sale_order']['flow_status_id'] = data.flow_status_id;
                //         }
                //       });
                //       const valueChangesSubscription = field.formControl.valueChanges.subscribe(data => {
                //         const saleOrder = this.formConfig.model['sale_order'];
                //         console.log("Sale order: ", saleOrder);

                //         // Prepare invoice data
                //         const saleOrderItems = this.formConfig.model['sale_order_items'];
                //         const orderAttachments = this.formConfig.model['order_attachments'];
                //         const orderShipments = this.formConfig.model['order_shipments'];
                //         // const CustomFields = this.formConfig.model['custom_field_values'];
                //         // console.log("CustomFields : ", CustomFields)

                //         const totalAmount = () => {
                //           if (!Array.isArray(saleOrderItems) || saleOrderItems.length === 0) {
                //             console.log("No items found, returning 0");
                //             return 0;
                //           }
                        
                //           return saleOrderItems.reduce((sum, item) => {
                //             const quantity = Number(item.quantity) || 0;
                //             const rate = Number(item.rate) || 0; // Convert rate to a number
                        
                //             // console.log(`Calculating: ${quantity} * ${rate} = ${quantity * rate}`);
                //             return sum + (quantity * rate);
                //           }, 0);
                //         };
                        
                //         this.invoiceData = {
                //           sale_invoice_order: {
                //             bill_type: saleOrder.bill_type || 'CASH',
                //             sale_order_id: saleOrder.sale_order_id,
                //             invoice_date: this.nowDate(),
                //             email: saleOrder.email,
                //             ref_no: saleOrder.ref_no,
                //             ref_date: this.nowDate(),
                //             tax: saleOrder.tax || 'Inclusive',
                //             remarks: saleOrder.remarks,
                //             advance_amount: saleOrder.advance_amount || '0',
                //             item_value: totalAmount(),
                //             discount: saleOrder.discount,
                //             dis_amt: saleOrder.dis_amt,
                //             taxable: saleOrder.taxable,
                //             // tax_amount: saleOrder.tax_amount,
                //             cess_amount: saleOrder.cess_amount,
                //             transport_charges: saleOrder.transport_charges,
                //             round_off: saleOrder.round_off,
                //             total_amount: totalAmount(),
                //             vehicle_name: saleOrder.vehicle_name,
                //             total_boxes: saleOrder.total_boxes,
                //             shipping_address: saleOrder.shipping_address,
                //             billing_address: saleOrder.billing_address,
                //             customer: saleOrder.customer,
                //             customer_id: saleOrder.customer.customer_id,
                //             gst_type_id: saleOrder.gst_type_id,
                //             order_type: saleOrder.order_type || 'sale_invoice',
                //             order_salesman_id: saleOrder.order_salesman_id,
                //             customer_address_id: saleOrder.customer_address_id,
                //             payment_term_id: saleOrder.payment_term_id,
                //             payment_link_type_id: saleOrder.payment_link_type_id,
                //             ledger_account_id: saleOrder.ledger_account_id,
                //             flow_status: saleOrder.flow_status,
                //             order_status_id: '717c922f-c092-4d40-94e7-6a12d7095600'
                //           },
                //           sale_invoice_items: saleOrderItems,
                //           order_attachments: orderAttachments,
                //           order_shipments: orderShipments
                //         };

                //         console.log('invoiceData:', this.invoiceData);
                //       });
                //     }
                //   }
                // },                                     
                {
                  key: 'use_workflow',
                  type: 'checkbox',
                  className: 'col-md-4 col-sm-6 col-12',
                  defaultValue: true,
                  templateOptions: {
                    label: 'Use Workflow',
                    placeholder: 'Enable Workflow',
                  },
                },                                
                {
                  key: 'remarks',
                  type: 'textarea',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Remarks',
                    placeholder: 'Enter Remarks',
                    // required: true,
                  },
                  hooks: {
                    onInit: (field: any) => {
                      if (this.dataToPopulate && this.dataToPopulate.sale_order.remarks && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.sale_order.remarks);
                      }
                    }
                  }
                },
              ]
            },
            {
              className: 'col-lg-3 col-md-4 col-12 p-md-0 inline-form-fields',
              fieldGroupClassName: "ant-row row mx-0 mt-2",
              fieldGroup: [
                {
                  key: 'item_value',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Items Total',
                    disabled: true,
                  },
                  defaultValue: '0.00'
                },
                {
                  key: 'discount',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Product disocunt',
                    required: false
                  },
                  defaultValue: '0.00'
                },
                {
                  key: 'cess_amount',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Cess Amount',
                    required: false
                  },
                  defaultValue: '0.00',
                },
                {
                  key: 'dis_amt',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Discount Amount',
                    required: false
                  },
                  defaultValue: '0.00'

                },              
                {
                  key: 'cgst',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Output CGST',
                    required: false
                  },
                  defaultValue: '0.00',
                  expressionProperties: {
                    'model.cgst': (model, field) => {
                      if (!field._lastValue || field._lastValue !== model.tax_amount) {
                        const isTamilnadu = model.billing_address?.includes('Andhra Pradesh');
                        field._lastValue = model.tax_amount; // Store last value to avoid infinite logs
                      }
                      return model.billing_address?.includes('Andhra Pradesh') 
                        ? (parseFloat(model.tax_amount) / 2).toFixed(2) 
                        : '0.00';
                    },
                    'templateOptions.disabled': 'true' // Make it read-only
                  },
                  hideExpression: (model) => !model.billing_address || !model.billing_address?.includes('Andhra Pradesh') // Hide CGST for inter-state
                },
                {
                  key: 'sgst',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Output SGST',
                    required: false
                  },
                  defaultValue: '0.00',
                  expressionProperties: {
                    'model.sgst': (model, field) => {
                      if (!field._lastValue || field._lastValue !== model.tax_amount) {
                        const isTamilnadu = model.billing_address?.includes('Andhra Pradesh');
                        field._lastValue = model.tax_amount;
                      }
                      return model.billing_address?.includes('Andhra Pradesh') 
                        ? (parseFloat(model.tax_amount) / 2).toFixed(2) 
                        : '0.00';
                    },
                    'templateOptions.disabled': 'true' // Make it read-only
                  },
                  hideExpression: (model) => !model.billing_address || !model.billing_address?.includes('Andhra Pradesh') // Hide CGST for inter-state
                },
                {
                  key: 'igst',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Output IGST',
                    required: false
                  },
                  defaultValue: '0.00',
                  expressionProperties: {
                    'model.igst': (model, field) => {
                      if (!field._lastValue || field._lastValue !== model.tax_amount) {
                        const isTamilnadu = model.billing_address?.includes('Andhra Pradesh');
                        field._lastValue = model.tax_amount;
                      }
                      return !model.billing_address?.includes('Andhra Pradesh') 
                        ? parseFloat(model.tax_amount).toFixed(2) 
                        : '0.00';
                    },
                    'templateOptions.disabled': 'true' // Make it read-only
                  },
                  hideExpression: (model) => !model.billing_address || model.billing_address?.includes('Andhra Pradesh') // Hide if intra-state
                },                                                                                         
                {
                  key: 'advance_amount',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: {
                    label: 'Advance Amount',
                    required: false
                  },
                  defaultValue: '0.00'
                },
                {
                  key: 'total_amount',
                  type: 'text',
                  className: 'col-12 product-total',
                  templateOptions: {
                    label: ' ',
                    required: false,
                    placeholder: 'Total Amount',
                    disabled: true,
                  },
                  defaultValue: '0.00'
                },
              ]
            },
          ]
        },
        {
          key: 'sale_order_items',
          type: 'repeat',
          className: 'custom-form-list product-table',
          templateOptions: {
            // title: 'Products',
            addText: 'Add Product',
            tableCols: [
              {
                name: 'selectItem',
                label: '',
                type: 'checkbox',
                width: '50px'
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
                    'templateOptions.disabled': (model) => model.invoiced === 'YES' ||  model.work_order_created === 'YES' || !this.SaleOrderEditID
                  }
              },                                     
              {
                key: 'product',
                type: 'select',
                templateOptions: {
                  label: 'Product',
                  dataKey: 'product_id',
                  hideLabel: true,
                  dataLabel: 'name',
                  placeholder: 'product',
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
                    if (!parentArray) {
                      console.error('Parent array is undefined or not accessible');
                      return;
                    }
              
                    const currentRowIndex = +parentArray.key;
              
                    // Populate product if data exists
                    const existingProduct = this.dataToPopulate?.sale_order_items?.[currentRowIndex]?.product;
                    console.log("existingProduct : ", existingProduct);
                    if (existingProduct) {
                      field.formControl.setValue(existingProduct);
                    }
              
                    this.loadProductVariations(field);
              
                    // Subscribe to value changes (to update sizes dynamically)
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (!this.formConfig.model['sale_order_items'][currentRowIndex]) {
                        console.error(`Products at index ${currentRowIndex} is not defined. Initializing...`);
                        this.formConfig.model['sale_order_items'][currentRowIndex] = {};
                      }
                      this.formConfig.model['sale_order_items'][currentRowIndex]['product_id'] = data?.product_id;
                      this.loadProductVariations(field);
                      this.autoFillProductDetails(field, data); // to fill the remaining fields when product is selected.
                    });

                    // Product Info Text code
                    field.formControl.valueChanges.subscribe( async selectedProductId => {
                      const unit = this.getUnitData(selectedProductId);
                      const row = this.formConfig.model.sale_order_items[currentRowIndex];
                      this.displayInformation(row.product, null , null, unit, '', ''); 
                      console.log('executed from product info text code');                         
                    }); // end of product info text code
                  }
                }
              },          
              {
                key: 'size',
                type: 'select',
                templateOptions: {
                  label: 'Size',
                  dataKey: 'size_id',
                  hideLabel: true,
                  dataLabel: 'size_name',
                  placeholder: 'size',
                  options: [],
                  required: false,
                  lazy: {
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (!parentArray) {
                      console.error('Parent array is undefined or not accessible');
                      return;
                    }
              
                    const currentRowIndex = +parentArray.key;
                    const saleOrderItems = this.dataToPopulate?.sale_order_items?.[currentRowIndex];
                    
                    // Populate existing size if available
                    const existingSize = saleOrderItems?.size;
                    if (existingSize?.size_id) {
                      field.formControl.setValue(existingSize);
                    }

                    // Subscribe to value changes (Merged from onInit & onChanges)
                    field.formControl.valueChanges.subscribe((selectedSize: any) => {
                      const product = this.formConfig.model.sale_order_items[currentRowIndex]?.product;
                      if (!product?.product_id) {
                        console.warn(`Product missing for row ${currentRowIndex}, skipping color fetch.`);
                        return;
                      }
                      this.formConfig.model['sale_order_items'][currentRowIndex]['size_id'] = selectedSize?.size_id;
              
                      const size_id = selectedSize?.size_id || null;
                      const url = size_id
                        ? `products/product_variations/?product_id=${product.product_id}&size_id=${size_id}`
                        : `products/product_variations/?product_id=${product.product_id}&size_isnull=True`;
              
                      // Fetch available colors based on the selected size
                      this.http.get(url).subscribe((response: any) => {
                        if (response.data.length > 0) {
                          const sizeCount = this.sumQuantities(response);
                          const unit = this.getUnitData(product);
                          this.displayInformation(product, selectedSize, null, unit, sizeCount, '');
                        }
                        const uniqueColors = response.data.map((variation: any) => ({
                          label: variation.color?.color_name || '----',
                          value: {
                            color_id: variation.color?.color_id || null,
                            color_name: variation.color?.color_name || '----'
                          }
                        })).filter((item, index, self) =>
                          index === self.findIndex((t) => t.value.color_id === item.value.color_id)
                        );
              
                        // Update color field options
                        const colorField = parentArray.fieldGroup.find((f: any) => f.key === 'color');
                        if (colorField) {
                          colorField.templateOptions.options = uniqueColors;
                        }
                      });
                    });
                  }
                }
              },
              {
                key: 'color',
                type: 'select',
                templateOptions: {
                  label: 'Color',
                  dataKey: 'color_id',
                  hideLabel: true,
                  dataLabel: 'color_name',
                  placeholder: 'color',
                  options: [],
                  required: false,
                  lazy: { lazyOneTime: true }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (!parentArray?.key) {
                      console.error('Parent array key is missing or inaccessible');
                      return;
                    }
              
                    const currentRowIndex = Number(parentArray.key);
                    const saleOrderItems = this.dataToPopulate?.sale_order_items?.[currentRowIndex];
                    const row = this.formConfig.model.sale_order_items[currentRowIndex];
              
                    if (!row) {
                      console.error(`Row not found for index ${currentRowIndex}`);
                      return;
                    }
              
                    // Populate existing color if available
                    if (saleOrderItems?.color) {
                      field.formControl.setValue(saleOrderItems.color);
                    }
              
                    // Subscribe to value changes & avoid unnecessary API calls
                    field.formControl.valueChanges.subscribe((selectedColor: any) => {
                      if (!row.product?.product_id) {
                        console.warn(`Product missing for row ${currentRowIndex}, skipping color update.`);
                        return;
                      }

                      this.formConfig.model['sale_order_items'][currentRowIndex]['color_id'] = selectedColor?.color_id;
              
                      const color_id = selectedColor?.color_id || null;
                      console.log('color_id :', color_id)
              
                      const url = `products/product_variations/?product_id=${row.product.product_id}`
                        + (color_id ? `&color_id=${color_id}` : `&color_isnull=True`);
              
                      // Update selected color
                      row.color_id = color_id;

                      console.log('url:', url)
              
                      this.http.get(url).subscribe(
                        (response: any) => {
                          if (response?.data) {
                            const colorCount = this.sumQuantities(response);
                            console.log('Color count:', colorCount);
                            this.displayInformation(row.product, row.size, selectedColor, '', '', colorCount);
                          } else {
                            console.log(`No data found for product_id ${row.product.product_id} and color_id ${color_id}`);
                          }
                        },
                        (error) => console.error("API Error:", error)
                      );
                    });
                  }
                }
              },                       
              {
                type: 'input',
                key: 'code',
                templateOptions: {
                  label: 'Code',
                  placeholder: 'code',
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
                key: 'quantity',
                // defaultValue: 1,
                templateOptions: {
                  type: 'number',
                  label: 'Qty',
                  placeholder: 'Qty',
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
                      // this.totalAmountCal();
                      if (field.form && field.form.controls && field.form.controls.rate && data) {
                        const rate = field.form.controls.rate.value;
                        const discount = field.form.controls.discount.value;
                        const quantity = data;
                        const productDiscount = parseInt(rate) * parseInt(quantity) * parseInt(discount)/ 100
                        if (rate && quantity) {
                          field.form.controls.amount.setValue(parseInt(rate) * parseInt(quantity) - productDiscount);
                        }
                      }
                    });
                  },
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
                  label: 'Discount (%)',
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
                    // Subscribe to discount value changes
                    field.formControl.valueChanges.subscribe(discount => {
                      this.totalAmountCal();
                      // if (field.form && field.form.controls) {
                      //   const quantity = field.form.controls.quantity?.value || 0;
                      //   const rate = field.form.controls.rate?.value || 0;
                      //   const discountValue = discount || 0;

                      //   if (quantity && rate) {
                      //     field.form.controls.amount.setValue((parseFloat(rate) * parseFloat(quantity)) - parseFloat(discountValue));
                      //   }
                      // }
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'amount',
                templateOptions: {
                  type: 'number',
                  label: 'Amount',
                  placeholder: 'Amount',
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
                key: 'print_name',
                templateOptions: {
                  label: 'Print name',
                  placeholder: 'name',
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
                type: 'select',
                key: 'unit_options_id',
                templateOptions: {
                  label: 'Unit',
                  placeholder: 'Unit',
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
                key: 'total_boxes',
                templateOptions: {
                  type: 'number',
                  label: 'Total Boxes',
                  placeholder: 'Boxes',
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
                key: 'cgst',
                templateOptions: {
                  type: "number",
                  label: 'CGST',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field) => {
                    // if (field.formControl && field.model) {
                    //   field.formControl.setValue(
                    //     field.model.billing_address?.includes('Andhra Pradesh') 
                    //       ? (parseFloat(field.model.tax_amount) / 2).toFixed(2) 
                    //       : '0.00'
                    //   );
                    // }
                  }
                },
                expressionProperties: {
                  'templateOptions.disabled': 'true' // Make it read-only
                }
              },              
              {
                type: 'input',
                key: 'sgst',
                templateOptions: {
                  type: "number",
                  label: 'SGST',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field) => {
                    // if (field.formControl && field.model) {
                    //   field.formControl.setValue(
                    //     field.model.billing_address?.includes('Andhra Pradesh') 
                    //       ? (parseFloat(field.model.tax_amount) / 2).toFixed(2) 
                    //       : '0.00'
                    //   );
                    // }
                  }
                },
                expressionProperties: {
                  'templateOptions.disabled': 'true' // Make it read-only
                }
              },              
              {
                type: 'input',
                key: 'igst',
                templateOptions: {
                  type: "number",
                  label: 'IGST',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field) => {
                    // if (field.formControl && field.model) {
                    //   field.formControl.setValue(
                    //     field.model.billing_address?.includes('Andhra Pradesh') 
                    //       ? (parseFloat(field.model.tax_amount) / 2).toFixed(2) 
                    //       : '0.00'
                    //   );
                    // }
                  }
                },
                expressionProperties: {
                  'templateOptions.disabled': 'true' // Make it read-only
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
          className: 'tab-form-list px-3',
          type: 'tabs',
          fieldGroup: [
            {
              className: 'col-12 p-0',
              props: {
                label: 'Billing Details'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 p-0 custom-form-card-block w-100',
                      fieldGroup: [
                        // {
                        //   template: '<div class="custom-form-card-title">  </div>',
                        //   fieldGroupClassName: "ant-row",
                        // },
                        {
                          fieldGroupClassName: "ant-row",
                          key: 'sale_order',
                          fieldGroup: [
                            {
                              key: 'tax_amount',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                              templateOptions: {
                                type: 'number',
                                label: 'Tax amount',
                                placeholder: 'Enter Tax amount'
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Initialize with existing tax_amount if available
                                  if (
                                    this.dataToPopulate &&
                                    this.dataToPopulate.sale_order &&
                                    this.dataToPopulate.sale_order.tax_amount &&
                                    field.formControl
                                  ) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.tax_amount);
                                  }
                            
                                  // Store initial tax_amount as a float value
                                  let previousTaxAmount = parseFloat(this.dataToPopulate?.sale_order?.tax_amount || "0");
                            
                                  // Subscribe to value changes on the tax_amount field
                                  field.formControl.valueChanges.subscribe(newTaxAmount => {
                                    if (field.form && field.form.controls && field.form.controls.total_amount) {
                                      // Parse the current total amount as a float
                                      const totalAmount = parseFloat(field.form.controls.total_amount.value || "0");
                                      // Parse the new tax amount as a float
                                      const currentNewTaxAmount = parseFloat(newTaxAmount || "0");
                                      // Calculate the updated total by subtracting the previous tax value and adding the new one
                                      const updatedTotal = totalAmount - previousTaxAmount + currentNewTaxAmount;
                                      // Update the total_amount field with the new total, fixed to two decimals
                                      field.form.controls.total_amount.setValue(parseFloat(updatedTotal.toFixed(2)));
                                      // Update previousTaxAmount for future changes
                                      previousTaxAmount = currentNewTaxAmount;
                                      console.log("Updated total_amount:", updatedTotal);
                                    }
                                  });
                                }
                              }
                            },                            
                            // {
                            //   key: 'tax_amount',
                            //   type: 'input',
                            //   defaultValue: "0",
                            //   className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                            //   templateOptions: {
                            //     type: 'number',
                            //     label: 'Tax amount',
                            //     placeholder: 'Enter Tax amount'
                            //   },
                            //   hooks: {
                            //     onInit: (field: any) => {
                            //       if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.tax_amount && field.formControl) {
                            //         field.formControl.setValue(this.dataToPopulate.sale_order.tax_amount);
                            //         // this.totalAmountCal();
                            //       } 
                                  
                            //       // Subscribe to value changes
                            //       field.formControl.valueChanges.subscribe(data => {
                            //         console.log("we are in method...")
                            //         if (field.form && field.form.controls && field.form.controls.total_amount && data) {
                            //           console.log("checking controles : ", field.form.controls);
                            //           const total_amount = field.form.controls.total_amount.value;
                            //           // const discount = field.form.controls.discount.value;
                            //           const tax_amount = data;
                            //           // const productDiscount = parseInt(tax_amount) + parseInt(total_amount)
                            //           if (tax_amount && total_amount) {
                            //             field.form.controls.total_amount.setValue(parseInt(tax_amount) + parseInt(total_amount));
                            //           }
                            //         }
                            //       });
                            //     }
                            //   }
                            // },                                                      
                            {
                              key: 'cess_amount',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                              key: 'gst_type',
                              type: 'select',
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                              templateOptions: {
                                type: 'input',
                                label: 'Items value',
                                placeholder: 'Enter Item value',
                                readonly: true,
                                expressions: {
                                  hide: '!model.sale_order_id',
                                },
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
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                              templateOptions: {
                                type: 'input',
                                label: 'Overall Discount',
                                placeholder: 'Enter Discount amount',
                                // required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.dis_amt && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.dis_amt);
                                  }

                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();
                                  });
                                }
                                
                              }
                            },
                            {
                              key: 'total_amount',
                              type: 'input',
                              defaultValue: "0",
                              className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                              templateOptions: {
                                type: 'number',
                                label: 'Total amount',
                                placeholder: 'Enter Total amount',
                                readonly: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.total_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_order.total_amount);
                                    // this.totalAmountCal();
                                  }

                                  field.formControl.valueChanges.subscribe(data => {
                                    // this.totalAmountCal();
                                  });
                                }
                              }
                            }
                          ]
                        },
                      ]
                    }
                  ]
                }
              ]
            },
            {
              className: 'col-12 custom-form-card-block p-0',
              props: {
                label: 'Shipping Details'
              },
              fieldGroup: [
                // {
                //   template: '<div class="custom-form-card-title">   </div>',
                //   fieldGroupClassName: "ant-row",
                // },
                {
                  fieldGroupClassName: "ant-row",
                  key: 'order_shipments',
                  fieldGroup: [
                    {
                      key: 'destination',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
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
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: {
                        type: 'date',
                        label: 'Shipping Date',
                        // required: true
                      }
                    },
                    {
                      key: 'shipping_charges',
                      type: 'input',
                      className: 'col-lg-3 col-md-4 col-sm-6 col-12',
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
              className: 'col-12 p-0',
              props: {
                label: 'Order Attachments'
              },
              fieldGroup: [
                {
                  fieldGroupClassName: "",
                  fieldGroup: [
                    {
                      className: 'col-12 custom-form-card-block w-100 p-0',
                      fieldGroup: [
                        // {
                        //   template: '<div class="custom-form-card-title"> Order Attachments </div>',
                        //   fieldGroupClassName: "ant-row",
                        // },
                        {
                          key: 'order_attachments',
                          type: 'file',
                          className: 'ta-cell col-12 col-md-6 custom-file-attachement',
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
            },
            {
              className: 'col-12 custom-form-card-block p-0',
              props: {
                label: 'Customer Details'
              },
              fieldGroup: [
                // {
                //   template: '<div class="custom-form-card-title">   </div>',
                //   fieldGroupClassName: "ant-row",
                // },
                {
                  fieldGroupClassName: "ant-row",
                  key: 'sale_order',
                  fieldGroup: [
                    {
                      key: 'email',
                      type: 'input',
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        type: 'input',
                        label: 'Email',
                        placeholder: 'Enter Email'
                      },
                    },
                    {
                      key: 'billing_address',
                      type: 'textarea',
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        label: 'Billing address',
                        placeholder: 'Enter Billing address'
                      },
                    },
                    {
                      key: 'shipping_address',
                      type: 'textarea',
                      className: 'col-md-4 col-sm-6 col-12',
                      templateOptions: {
                        label: 'Shipping address',
                        placeholder: 'Enter Shipping address'
                      },
                    },
                  ]
                },
              ]
            },
          ]
        }
      ]
    }
  }


  totalAmountCal() {
    calculateTotalAmount(this.formConfig.model, 'sale_order_items', this.salesForm?.form);
  }
  
  
}
