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

  showPreview: boolean = false;
  docUrl: string = '';

openDocPreview() {
  //C:\Users\Pramod Kumar\CNL_frontend\sales_workflow_new\cnl-frontend\app\src\assets\img\sale_order_management_documentation.pdf
  this.docUrl = 'assets/img/sale_order_management_documentation.pdf';

  // create modal wrapper
  const modal = document.createElement('div');
  modal.classList.add('modal-info');

  // inject styles so they apply even when modal is appended to body
  const style = document.createElement('style');
  style.textContent = `
    .modal-info {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      background: rgba(0,0,0,0.6);
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
    }
    .modal-info .modal-content {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      width: 80%;
      height: 100%;
      max-width: 900px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      animation: fadeIn .3s ease-in-out;
      font-size: 18px;
      line-height: 1.6;
      color: #222;

      /* ✅ Violet styling */
      border: 3px solid rgb(38, 4, 70);                  /* Violet border */
      box-shadow: 0 5px 25px rgb(34, 3, 63, 0.4); /* Violet glow */
    }
    .modal-info .modal-content iframe {
      flex: 1;
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 6px;
      display: block;
    }
    .modal-info .close {
      position: absolute;
      top: 12px;
      right: 15px;
      font-size: 32px;
      font-weight: bold;
      cursor: pointer;
      color: #333;
      transition: color .2s;
    }
    .modal-info .close:hover {
      color: red;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 600px) {
      .modal-info .modal-content {
        width: 95%;
        max-width: 600px;
        max-height: 80vh;
        padding: 15px;
        font-size: 16px;
      }
      .modal-info .modal-content iframe {
        height: 65vh;
      }
    }
  `;
  modal.appendChild(style);

  // modal content
  const content = document.createElement('div');
  content.classList.add('modal-content');
  content.innerHTML = `
    <span class="close">&times;</span>
    <iframe src="${this.docUrl}" title="Documentation"></iframe>
  `;

  // close logic: click X
  content.querySelector('.close')?.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // close on overlay click
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // close on ESC key
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (document.body.contains(modal)) document.body.removeChild(modal);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  modal.appendChild(content);
  document.body.appendChild(modal);
}


// openDocPreview() {
//   this.docUrl = 'assets/img/sale_order_management_documentation.pdf';

//   // create modal wrapper
//   const modal = document.createElement('div');
//   modal.classList.add('modal-info');

//   // inject styles so they apply even when modal is appended to body
//   const style = document.createElement('style');
//   style.textContent = `
//     .modal-info{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:1050;background:rgba(0,0,0,0.6);padding:20px;box-sizing:border-box;overflow-y:auto;}
//     .modal-info .modal-content{background:#fff;padding:15px;border-radius:10px;width:80%; height:100%;max-width:900px;max-height:90vh;display:flex;flex-direction:column;position:relative;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,0.3);animation:fadeIn .3s ease-in-out;}
//     .modal-info .modal-content iframe{flex:1;width:100%;height:100%;border:none;border-radius:5px;display:block;}
//     .modal-info .close{position:absolute;top:10px;right:10px;font-size:28px;font-weight:bold;cursor:pointer;color:#333;transition:color .2s;}
//     .modal-info .close:hover{color:red;}
//     @keyframes fadeIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
//     @media (max-width:600px){ .modal-info .modal-content{width:95%;max-width:600px;max-height:80vh;padding:12px;} .modal-info .modal-content iframe{height:60vh;} }
//   `;
//   modal.appendChild(style);

//   // modal content
//   const content = document.createElement('div');
//   content.classList.add('modal-content');
//   content.innerHTML = `
//     <span class="close">&times;</span>
//     <iframe src="${this.docUrl}" width="100%" height="600px" style="border:1px solid #ccc;"></iframe>
//   `;

//   // close logic: click X
//   content.querySelector('.close')?.addEventListener('click', () => {
//     document.body.removeChild(modal);
//   });

//   // close on overlay click (but not when clicking the modal content)
//   modal.addEventListener('click', (ev) => {
//     if (ev.target === modal) {
//       document.body.removeChild(modal);
//     }
//   });

//   // close on ESC key
//   const escHandler = (e: KeyboardEvent) => {
//     if (e.key === 'Escape') {
//       if (document.body.contains(modal)) document.body.removeChild(modal);
//       document.removeEventListener('keydown', escHandler);
//     }
//   };
//   document.addEventListener('keydown', escHandler);

//   modal.appendChild(content);
//   document.body.appendChild(modal);
// }

  
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

    this.getOrderNo();
    // to get SaleOrder number for save 
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
    this.isConfirmationInvoiceOpen = false; // Close the modal
    this.invoiceCreationHandler(); // Proceed with the invoice creation logic
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
    const invoiceData = {
      ...this.invoiceData,
      sale_invoice_order: {
        ...this.invoiceData.sale_invoice_order,
        // sale_order_id: this.invoiceData.sale_invoice_order.sale_order_id, // ✅ correct
        // customer_id: this.invoiceData.sale_invoice_order.customer.customer_id, // ✅ correct
        // item_value: items_value,
        tax_amount: tax_amount,
        // discount: discount,
        // total_amount: total_amount
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
          // if (!saleOrderId) {
          //   const saleOrderId = this.SaleOrderEditID
          // }
          // console.log("saleOrderId i9n method : ", saleOrderId)
          // const allInvoiced = this.invoiceData.sale_invoice_items.every(item => item.invoiced === 'YES');
          // if (allInvoiced) {
          //     this.triggerWorkflowPipeline(saleOrderId);
          // }
          const allInvoiced = this.invoiceData.sale_invoice_items.every(item => item.invoiced === 'YES');
          if (allInvoiced) {
            this.triggerWorkflowPipeline(saleOrderId);  // Delivery in Progress
          } else {
            this.http.get('masters/flow_status/?flow_status_name=Partially Delivered').subscribe(
              (res: any) => {
                console.log("We are in the method ... fetch")
                const status = res?.data?.[0];
                if (status && status.flow_status_id) {
                  const patchUrl = `sales/sale_order/${saleOrderId}/`;
                  const payload = { flow_status_id: status.flow_status_id };

                  this.http.patch(patchUrl, payload).subscribe(
                    (patchRes: any) => {
                      console.log('Sale order flow status updated to Partially Delivered:', patchRes);
                    },
                    (patchErr: any) => {
                      console.error('Error updating sale order flow status:', patchErr);
                    }
                  );
                } else {
                  console.warn('Partially Delivered status not found in response:', res);
                }
              },
              (err: any) => {
                console.error('Error fetching flow status:', err);
              }
            );

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

    console.log("saleOrderId : ", saleOrderId)
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

  // editSaleOrder(event) {
  //   this.SaleOrderEditID = event;
  //   console.log("event : ", event);
  //   this.showForm = false;
  //   this.http.get('sales/sale_order/' + event).subscribe((res: any) => {
  //     if (res && res.data) {

  //       this.formConfig.model = res.data;
  //       // set sale_order default value
  //       this.formConfig.model['sale_order']['order_type'] = 'sale_order';
  //       // set labels for update
  //       // show form after setting form values
  //       this.formConfig.pkId = 'sale_order_id';
  //       this.formConfig.model['flow_status'] = res.data.sale_order.flow_status;
  //       this.formConfig.model['tax_amount'] = res.data.sale_order.tax_amount;
  //       this.formConfig.submit.label = 'Update';
  //       this.formConfig.model['sale_order_id'] = this.SaleOrderEditID;
        
  //       this.formConfig.fields[0].fieldGroup[0].fieldGroup[8].hide = false;
  //       this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[7].hide = false;
  //       this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[8].hide = true;

  //       // Ensure custom_field_values are correctly populated in the model
  //       // --- Custom Fields Handling ---
  //       if (res.data.custom_field_values && Array.isArray(res.data.custom_field_values)) {
  //         console.log("We are in the custom field values...")
  //         console.log('Custom fields data : ', res.data.custom_field_values);
  //         // Map API array to a form-friendly object
  //         this.formConfig.model['custom_field_values'] = res.data.custom_field_values.reduce((acc: any, cf: any) => {
  //           acc[cf.custom_field_id] = cf.field_value;
  //           return acc;
  //         }, {});
  //       }

  //       this.showForm = true;
  //     }

      

  //     this.totalAmountCal();
  //   });
  //   this.hide();
  // }

editSaleOrder(event) {
  this.SaleOrderEditID = event;
  console.log("event : ", event);
  this.showForm = false;

  this.http.get('sales/sale_order/' + event).subscribe((res: any) => {
    if (res && res.data) {

      this.formConfig.model = res.data;

      // set sale_order default value
      this.formConfig.model['sale_order']['order_type'] = 'sale_order';

      // set labels for update
      this.formConfig.pkId = 'sale_order_id';
      this.formConfig.model['flow_status'] = res.data.sale_order.flow_status;
      this.formConfig.model['tax_amount'] = res.data.sale_order.tax_amount;
      this.formConfig.submit.label = 'Update';
      this.formConfig.model['sale_order_id'] = this.SaleOrderEditID;

      // Show/Hide based on update
      this.formConfig.fields[0].fieldGroup[0].fieldGroup[8].hide = false;
      this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[7].hide = false;
      this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[8].hide = true;

      // -------------------------------
      // CUSTOM FIELD VALUES HANDLING
      // -------------------------------
      if (res.data.custom_field_values && Array.isArray(res.data.custom_field_values)) {
        this.formConfig.model['custom_field_values'] =
          res.data.custom_field_values.reduce((acc: any, cf: any) => {
            acc[cf.custom_field_id] = cf.field_value;
            return acc;
          }, {});
      }

      // ---------------------------------------------------
      //  ENSURE SALE ORDER ALWAYS HAS 5 ITEM ROWS 
      // ---------------------------------------------------
      let items = res.data.sale_order_items ?? [];

      // fill existing rows first, then make sure total is 5
      while (items.length < 5) {
        items.push({
          sale_order_item_id: null,
          product_id: null,
          unit_options_id: null,
          color_id: null,
          quantity: null,
          rate: null,
          amount: null
        });
      }

      // assign back to form model
      this.formConfig.model['sale_order_items'] = items;

      // finally show form
      this.showForm = true;
    }

    this.totalAmountCal();
  });

  this.hide();
}
  getOrderNo() {
    this.orderNumber = null;
    this.shippingTrackingNumber = null;

    const saleTypeObj = this.formConfig.model['sale_order']?.sale_type_id;
    const saleTypeName = saleTypeObj?.name?.toLowerCase() || '';
    const orderPrefix = saleTypeName === 'Other' ? 'SOO' : 'SO';

    // 1. Shipping number
    this.http.get('masters/generate_order_no/?type=SHIP').subscribe((shipRes: any) => {
      if (shipRes?.data?.order_number) {
        this.shippingTrackingNumber = shipRes.data.order_number;
        this.formConfig.model['order_shipments']['shipping_tracking_no'] = this.shippingTrackingNumber;

        // 2. Sales order number
        this.http.get(`masters/generate_order_no/?type=${orderPrefix}`).subscribe((orderRes: any) => {
          if (orderRes?.data?.order_number) {
            this.orderNumber = orderRes.data.order_number;
            this.formConfig.model['sale_order']['order_no'] = this.orderNumber;
          }
        });
      }
    });
  }



  // Displays the sales order list modal
  showSaleOrderListFn() {
    this.showSaleOrderList = true;
    // Ensure filters are reset and table is refreshed when showing the sales order list
    if (this.SalesListComponent) {
      if (this.SalesListComponent.taTableComponent) {
        this.SalesListComponent.taTableComponent.resetFilterValues();
      }
      this.SalesListComponent.refreshTable();
    }
    
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
                cgst: item.cgst ?? 0,
                sgst: item.sgst ?? 0,
                igst: item.igst ?? 0,
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
        existingProduct.igst === (newProduct.igst || null) &&
        existingProduct.cgst === (newProduct.cgst || null) &&
        existingProduct.sgst === (newProduct.sgst || null) &&
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
          cgst: parseFloat(newProduct.cgst) || 0,
          sgst: parseFloat(newProduct.sgst) || 0,
          igst: parseFloat(newProduct.igst) || 0,

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

  // createSaleOrder() {
  //   const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields

  //   // Determine the entity type and ID dynamically
  //   const entityName = 'sale_order'; // Since we're in the Sale Order form
  //   const customId = this.formConfig.model.sale_order?.sale_order_id || null; // Ensure correct sale_order_id

  //   // Find entity record from list
  //   const entity = this.entitiesList.find(e => e.entity_name === entityName);

  //   // if (!entity) {
  //   //   console.error(`Entity not found for: ${entityName}`);
  //   //   return;
  //   // }

  //   const entityId = entity.entity_id;
  //   // Inject entity_id into metadata temporarily
  //   Object.keys(this.customFieldMetadata).forEach((key) => {
  //     this.customFieldMetadata[key].entity_id = entityId;
  //   });
  //   // Construct payload for custom fields
  //   const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityName, customId);

  //   if (!customFieldsPayload) {
  //     this.showDialog(); // Stop execution if required fields are missing
  //   }

  //   // Construct the final payload
  //   const payload = {
  //     ...this.formConfig.model,
  //     custom_field_values: customFieldsPayload.custom_field_values // Array of custom field values
  //   };

  //   if (!payload) {
  //     this.showDialog(); // Stop execution if required fields are missing
  //   }
  
  //   this.http.post('sales/sale_order/', payload)
  //     .subscribe(response => {
  //       this.showSuccessToast = true;
  //       this.toastMessage = 'Record created successfully';
  //       this.ngOnInit();
  //       setTimeout(() => {
  //         this.showSuccessToast = false;
  //       }, 3000); // Hide toast after 3 seconds
  //     }, error => {
  //       if (error.status === 400) { 
  //         this.showDialog();
  //       }
  //       // console.error('Error creating record:', error);
  //     });
  // }

  validatedCustomFieldsPayload: any = null;
  validateCustomFields(): boolean {
  const customFieldValues = this.formConfig.model['custom_field_values'];
  const entityName = 'sale_order';
  const customId = this.formConfig.model.sale_order?.sale_order_id || null;

  const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityName, customId);

  if (!customFieldsPayload) {
    this.showDialog(); // Show custom fields popup
    return false; // Validation failed
  }

  // Save payload for use in create
  this.validatedCustomFieldsPayload = customFieldsPayload;
  return true; // Validation passed
}

createSaleOrder() {
  // Use the already validated payload
  const customFieldsPayload = this.validatedCustomFieldsPayload;

  const payload = {
    ...this.formConfig.model,
    custom_field_values: customFieldsPayload.custom_field_values
  };

  this.http.post('sales/sale_order/', payload)
    .subscribe(response => {
      this.showSuccessToast = true;
      this.toastMessage = 'Record created successfully';
      this.ngOnInit();
      setTimeout(() => this.showSuccessToast = false, 3000);
    }, error => {
      if (error.status === 400) { 
        this.showDialog();
      }
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
  // updateSaleOrder() {
  //   const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields

  //   console.log("customFieldValues : ", customFieldValues);

  //   const saleType = this.formConfig.model.sale_order?.sale_type;
  //   const orderStatus = this.formConfig.model.sale_order?.order_status;

  //   // Determine the entity type and ID dynamically
  //   const entityName = 'sale_order'; // Since we're in the Sale Order form
  //   const customId = this.formConfig.model.sale_order?.sale_order_id || null; // Ensure correct sale_order_id
  //   console.log("customId : ", customId);

  //   // Find entity record from list
  //   const entity = this.entitiesList.find(e => e.entity_name === entityName);

  //   console.log("entity : ", entity);

  //   if (!entity) {
  //     console.error(`Entity not found for: ${entityName}`);
  //     return;
  //   }

  //   const entityId = entity.entity_id;
  //   // Inject entity_id into metadata temporarily
  //   Object.keys(this.customFieldMetadata).forEach((key) => {
  //     this.customFieldMetadata[key].entity_id = entityId;
  //   });
  //   // Construct payload for custom fields
  //   const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityName, customId);

  //   console.log("customFieldsPayload : ", customFieldsPayload);
  //   // Construct the final payload for update
  //   const payload = {
  //     ...this.formConfig.model,
  //     custom_field_values: customFieldsPayload.custom_field_values // Array of dictionaries
  //   };

  //   // if (!payload) {
  //   //   this.showDialog(); // Stop execution if required fields are missing
  //   // }

  //   // Define logic here for updating the sale order without modal pop-up
  //   console.log("Updating sale order:", this.formConfig.model);
  //   this.http.put(`sales/sale_order/${this.SaleOrderEditID}/`, payload)
  //     .subscribe(response => {
  //       this.showSuccessToast = true;
  //       this.toastMessage = "Record updated successfully"; // Set the toast message for update
  //       this.ngOnInit();
  //       setTimeout(() => {
  //         this.showSuccessToast = false;
  //       }, 3000);

  //     }, error => {
  //       console.error('Error updating record:', error);

  //       const errorMessage = error?.error?.message || '';
  //       if (errorMessage === "Update is not allowed, please contact Product team.") {
  //         // Re-run ngOnInit when this specific error occurs
  //         this.ngOnInit();
  //       }
  //     });
  // }

updateSaleOrder() {

  const customFieldValues = this.formConfig.model['custom_field_values'];
  const saleType = this.formConfig.model.sale_order?.sale_type;

  const entityName = 'sale_order';
  const customId = this.formConfig.model.sale_order?.sale_order_id || null;

  const entity = this.entitiesList.find(e => e.entity_name === entityName);
  const entityId = entity.entity_id;

  Object.keys(this.customFieldMetadata).forEach((key) => {
    this.customFieldMetadata[key].entity_id = entityId;
  });

  const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(customFieldValues, entityName, customId);

  const payload = {
    ...this.formConfig.model,
    custom_field_values: customFieldsPayload.custom_field_values
  };

  //  FIX COLOR + SIZE ISSUE HERE
  if (payload.sale_order_items && Array.isArray(payload.sale_order_items)) {
    payload.sale_order_items = payload.sale_order_items.map(item => {

      if (item.color && typeof item.color === 'object') {
        item.color_id = item.color.color_id || null;
      }

      if (item.size && typeof item.size === 'object') {
        item.size_id = item.size.size_id || null;
      }

      return item;
    });
  }

  console.log("Final Payload Before Update:", payload);

  this.http.put(`sales/sale_order/${this.SaleOrderEditID}/`, payload)
    .subscribe(response => {
      this.showSuccessToast = true;
      this.toastMessage = "Record updated successfully";
      this.ngOnInit();
      setTimeout(() => this.showSuccessToast = false, 3000);
    }, error => {
      console.error('Error updating record:', error);
      if (error?.error?.message === "Update is not allowed, please contact Product team.") {
        this.ngOnInit();
      }
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
      // this.http.get(`products/product_variations/?product_id=${product.product_id}`).subscribe((response: any) => {
      //   if (response.data.length > 0) {

      //     let availableSizes, availableColors;
      //     // Check if response data is non-empty for size
      //     if (response.data && response.data.length > 0) {
      //       availableSizes = response.data.map((variation: any) => ({
      //         label: variation.size?.size_name || '----',
      //         value: {
      //           size_id: variation.size?.size_id || null,
      //           size_name: variation.size?.size_name || '----'
      //         }
      //       }));
      //       availableColors = response.data.map((variation: any) => ({
      //         label: variation.color?.color_name || '----',
      //         value: {
      //           color_id: variation.color?.color_id || null,
      //           color_name: variation.color?.color_name || '----'
      //         }
      //       }));
      //       // Enable and update the size field options if sizes are available
      //       if (sizeField) {
      //         sizeField.formControl.enable(); // Ensure the field is enabled
      //         sizeField.templateOptions.options = availableSizes.filter((item, index, self) => index === self.findIndex((t) => t.value.size_id === item.value.size_id)); // Ensure unique size options
      //       }
      //     } else {
      //       // Clear options and keep the fields enabled, without any selection if no options exist
      //       if (sizeField) {
      //         sizeField.formControl.enable();
      //         sizeField.templateOptions.options = [];
      //       }
      //       if (colorField) {
      //         colorField.formControl.enable();
      //         colorField.templateOptions.options = [];
      //       }

      //       // 🔹 Restore selected size + color in edit mode
      //       const row = this.formConfig.model.sale_order_items[+parentArray.key];
      //       if (row?.size) sizeField.formControl.setValue(row.size, { emitEvent: false });
      //       if (row?.color) colorField.formControl.setValue(row.color, { emitEvent: false });
      //     }
      //   }
      // });
      this.http.get(`products/product_variations/?product_id=${product.product_id}`).subscribe((response: any) => {
        if (response.data.length > 0) {
          const availableSizes = response.data.map((variation: any) => ({
            label: variation.size?.size_name || '----',
            value: {
              size_id: variation.size?.size_id || null,
              size_name: variation.size?.size_name || '----'
            }
          })).filter((item, index, self) =>
            index === self.findIndex((t) => t.value.size_id === item.value.size_id)
          );

          const availableColors = response.data.map((variation: any) => ({
            label: variation.color?.color_name || '----',
            value: {
              color_id: variation.color?.color_id || null,
              color_name: variation.color?.color_name || '----'
            }
          })).filter((item, index, self) =>
            index === self.findIndex((t) => t.value.color_id === item.value.color_id)
          );

          if (sizeField) {
            sizeField.formControl.enable();
            sizeField.templateOptions.options = availableSizes;
          }

          if (colorField) {
            colorField.formControl.enable();
            colorField.templateOptions.options = availableColors;
          }

          // 🔹 Restore selected size + color in edit mode
          const row = this.formConfig.model.sale_order_items[+parentArray.key];
          if (row?.size) sizeField.formControl.setValue(row.size, { emitEvent: false });
          if (row?.color) colorField.formControl.setValue(row.color, { emitEvent: false });
        }
      });

    } else {
      console.error('Product not selected or invalid.');
    }
  };

  // async autoFillProductDetails(field, data) {
  //   this.productOptions = data;
  //   console.log("Autofill data : ", this.productOptions)
  //   if (!field.form?.controls || !data) return;
  //   const fieldMappings = {
  //     code: data.code,
  //     rate: data.sales_rate || field.form.controls.rate.value,
  //     discount: parseFloat(data.discount) || 0,
  //     unit_options_id: data.unit_options?.unit_options_id,
  //     print_name: data.print_name,
  //     mrp: data.mrp
  //   };

  //   Object.entries(fieldMappings).forEach(([key, value]) => {
  //     if (value !== undefined) field.form.controls[key]?.setValue(value);
  //   });
  //   this.totalAmountCal();
  // }
  //-------------------working---------------------------------------
  // async autoFillProductDetails(field, data) {
  //   this.productOptions = data;
  //   console.log("Autofill data : ", this.productOptions)
  //   if (!field.form?.controls || !data) return;

  //   const fieldMappings = {
  //     // code: data.code,
  //     code: data.code !== undefined
  //       ? data.code
  //       : field.form.controls.code.value,
  //     rate: data.sales_rate ?? field.form.controls.rate.value,
  //     // ✅ Key fix for discount:
  //     discount: data.discount !== undefined
  //       ? parseFloat(data.discount)
  //       : field.form.controls.discount.value,
  //     unit_options_id: data.unit_options?.unit_options_id,
  //     print_name: data.print_name,
  //     mrp: data.mrp
  //   };

  //   Object.entries(fieldMappings).forEach(([key, value]) => {
  //     if (value !== undefined) {
  //       field.form.controls[key]?.setValue(value);
  //     }
  //   });

  //   this.totalAmountCal();
  // }
  //--------------------------------------------------------
  async autoFillProductDetails(field, data) {
    this.productOptions = data;
    console.log("Autofill data : ", this.productOptions);
    if (!field.form?.controls || !data) return;

    const customerCategory = this.formConfig.model?.sale_order?.customer?.customer_category?.name?.toLowerCase();

    // ✅ Figure out the current row index safely
    const parentArray = field.parent;
    const currentRowIndex = +parentArray?.key;

    // ✅ Get the rate on that row if it exists
    const currentRowRate = this.formConfig.model?.sale_order_items?.[currentRowIndex]?.rate;

    console.log("Current row rate value : ", currentRowRate);

    let selectedRate = data.sales_rate; // default fallback

    // ✅ Only override if current rate is 0 or empty
    if (!currentRowRate || currentRowRate === 0) {
      if (customerCategory === 'wholesalers') {
        selectedRate = data.wholesale_rate ?? data.sales_rate;
      } else if (customerCategory === 'retail') {
        selectedRate = data.sales_rate;
      } else if (customerCategory === 'e-commerce partners' || customerCategory === 'distributors' || customerCategory === 'e-commerce partners') {
        selectedRate = data.dealer_rate ?? data.sales_rate;
      }
    } else {
      // ✅ Keep the manually entered rate
      selectedRate = currentRowRate;
    }

    const fieldMappings = {
      code: data.code !== undefined
        ? data.code
        : field.form.controls.code.value,
      rate: selectedRate,
      discount: data.discount !== undefined
        ? parseFloat(data.discount)
        : field.form.controls.discount.value,
      unit_options_id: data.unit_options?.unit_options_id,
      print_name: data.print_name,
      mrp: data.mrp
    };

    Object.entries(fieldMappings).forEach(([key, value]) => {
      if (value !== undefined) {
        field.form.controls[key]?.setValue(value);
      }
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
      const customFieldValues = this.formConfig.model.custom_field_values;

      // 4. Proceed only if sale order details exist
      if (saleOrderDetails && orderAttachmentsDetails && orderShipmentsDetails) {
        this.selectedOrder = {
          productDetails: selectedProducts,
          saleOrderDetails: saleOrderDetails,
          orderAttachments: orderAttachmentsDetails,
          orderShipments: orderShipmentsDetails,
          customFieldsValues: customFieldValues,
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

  //================================================================
  // confirmWorkOrder() {
  //   console.log("data1", this.selectedOrder);
  //   if (this.selectedOrder) {
  //     let { productDetails, saleOrderDetails, orderAttachments, orderShipments, customFieldsValues } = this.selectedOrder;

  //     const allProducts = this.formConfig.model.sale_order_items;
  //     const isAllProductsSelected = productDetails.length === allProducts.length;

  //     if (isAllProductsSelected) {
  //       console.log("All products selected. Creating only work orders...");

  //       this.http.post(`sales/SaleOrder/${saleOrderDetails.sale_order_id}/move_next_stage/`, {}).subscribe({
  //         next: (updateResponse) => {
  //           console.log('Parent Sale Order updated to Production:', updateResponse);

  //           const processWorkOrders = productDetails.map((product) => {
  //             const workOrderPayload = {
  //               work_order: {
  //                 product_id: product.product_id,
  //                 quantity: product.quantity || 0,
  //                 completed_qty: 0,
  //                 pending_qty: product.quantity || 0,
  //                 start_date: saleOrderDetails.order_date || new Date().toISOString().split('T')[0],
  //                 sync_qty: true,
  //                 size_id: product.size?.size_id || null,
  //                 color_id: product.color?.color_id || null,
  //                 status_id: '',
  //                 sale_order_id: saleOrderDetails.sale_order_id
  //               },
  //               bom: [
  //                 {
  //                   product_id: product.product_id,
  //                   size_id: product.size?.size_id || null,
  //                   color_id: product.color?.color_id || null,
  //                 }
  //               ],
  //               work_order_machines: [],
  //               workers: [],
  //               work_order_stages: []
  //             };

  //             console.log('Work Order Payload:', workOrderPayload);

  //             return this.http.post('production/work_order/', workOrderPayload);
  //           });

  //           forkJoin(processWorkOrders).subscribe({
  //             next: () => {
  //               this.closeModalworkorder();
  //               console.log('Work Orders created successfully (without child sale orders)!');
  //             },
  //             error: (err) => {
  //               console.error('Error creating Work Orders:', err);
  //               alert('Failed to create Work Orders. Please try again.');
  //             }
  //           });
  //         },
  //         error: (err) => {
  //           console.error('Error updating Parent Sale Order:', err);
  //         }
  //       });
  //     } else {
  //       console.log("Partial products selected. Creating child sale orders & work orders...");

  //       const parentOrderNo = saleOrderDetails.order_no;
  //       let childOrderCounter = 1;

  //       const removedItemIds = productDetails.map(p => p.sale_order_item_id);  // selected ones
  //       const parentAllItems = this.formConfig.model.sale_order_items || [];
  //       const remainingItems = parentAllItems.filter(item => !removedItemIds.includes(item.sale_order_item_id));

  //       const processProductRequests = productDetails.map((product) => {
  //         const childOrderNo = `${parentOrderNo}-${childOrderCounter++}`;
  //         // const totalTax = parseInt(product.igst) + parseInt(product.cgst) + parseInt(product.sgst);
  //         // const itemValue = parseInt(product.rate) * parseInt(product.amount)
  //         // const totalAmount = itemValue + totalTax - (itemValue * product.discount / 100);

  //         // 🧮 Updated Calculations
  //         const quantity = Number(product.quantity) || 0;
  //         const rate = Number(product.rate) || 0;
  //         const itemsValue = quantity * rate;

  //         const igst = Number(product.igst) || 0;
  //         const cgst = Number(product.cgst) || 0;
  //         const sgst = Number(product.sgst) || 0;
  //         const taxAmount = igst + cgst + sgst;

  //         const productDiscountPercent = Number(product.discount) || 0;
  //         const discountOnItems = (itemsValue * productDiscountPercent) / 100;

  //         // const orderLevelDiscount = Number(saleOrderDetails.dis_amt) || 0;
  //         // const totalCess = Number(saleOrderDetails.cess_amount || 0);
  //         // const selectedProductCount = productDetails.length;
  //         // const perOrderCess = selectedProductCount > 0 ? (totalCess / selectedProductCount) : 0;
  //         const totalCess = Number(saleOrderDetails.cess_amount) || 0;
  //         const totalDiscount = Number(saleOrderDetails.dis_amt) || 0;
  //         const selectedProductCount = productDetails.length;
  //         console.log("Length of products : ", selectedProductCount);

  //         // Equal distribution
  //         const perOrderCess = selectedProductCount > 0 ? (totalCess / selectedProductCount) : 0;
  //         const perOrderDiscount = selectedProductCount > 0 ? (totalDiscount / selectedProductCount) : 0;

  //         const totalAmount = itemsValue
  //           - perOrderDiscount
  //           + taxAmount + perOrderCess
  //           - discountOnItems;

  //         console.log(`Computed for product ${product.product_id}:`,
  //           { itemsValue, taxAmount, perOrderDiscount, discountOnItems, totalAmount });


  //         const childSaleOrderPayload = {
  //           sale_order: {
  //             order_no: childOrderNo,
  //             ref_no: saleOrderDetails.ref_no,
  //             sale_type_id: saleOrderDetails.sale_type_id,
  //             tax: saleOrderDetails.tax,
  //             cess_amount: perOrderCess.toFixed(2),
  //             tax_amount: taxAmount,
  //             advance_amount: saleOrderDetails.advance_amount,
  //             item_value: itemsValue,
  //             total_amount: totalAmount,
  //             ledger_account_id: saleOrderDetails.ledger_account_id,
  //             order_status_id: saleOrderDetails.order_status_id,
  //             customer_id: saleOrderDetails.customer.customer_id,
  //             order_date: saleOrderDetails.order_date,
  //             ref_date: saleOrderDetails.ref_date,
  //             delivery_date: saleOrderDetails.delivery_date,
  //             order_type: 'sale_order',
  //             sale_estimate: saleOrderDetails.sale_estimate || 'No',
  //             flow_status: { flow_status_name: 'Production' },
  //             billing_address: saleOrderDetails.billing_address,
  //             shipping_address: saleOrderDetails.shipping_address,
  //             email: saleOrderDetails.email,
  //             remarks: saleOrderDetails.remarks || null,
  //             dis_amt: perOrderDiscount,

  //           },
  //           sale_order_items: [product],
  //           order_attachments: orderAttachments,
  //           order_shipments: orderShipments,
  //           custom_field_values: customFieldsValues
  //         };

  //         console.log('Payload for child sale order:', childSaleOrderPayload);

  //         return this.http.post('sales/sale_order/', childSaleOrderPayload).pipe(
  //           tap((childSaleOrderResponse: any) => {
  //             console.log(`Child Sale Order ${childOrderNo} created:`, childSaleOrderResponse);

  //             this.http.patch(`sales/sale_order_items/${product.sale_order_item_id}/`, { work_order_created: 'YES' })
  //               .subscribe({
  //                 next: () => console.log(`Product ${product.product_id} marked as Work Order Created in Parent Sale Order`),
  //                 error: (err) => console.error('Error updating work order status:', err)
  //               });

  //             const workOrderPayload = {
  //               work_order: {
  //                 product_id: product.product_id,
  //                 quantity: product.quantity || 0,
  //                 completed_qty: 0,
  //                 pending_qty: product.quantity || 0,
  //                 start_date: saleOrderDetails.order_date || new Date().toISOString().split('T')[0],
  //                 sync_qty: true,
  //                 size_id: product.size?.size_id || null,
  //                 color_id: product.color?.color_id || null,
  //                 status_id: '',
  //                 sale_order_id: childSaleOrderResponse.data.sale_order.sale_order_id
  //               },
  //               bom: [
  //                 {
  //                   product_id: product.product_id,
  //                   size_id: product.size?.size_id || null,
  //                   color_id: product.color?.color_id || null,
  //                 }
  //               ],
  //               work_order_machines: [],
  //               workers: [],
  //               work_order_stages: []
  //             };

  //             console.log('Work Order Payload:', workOrderPayload);

  //             this.http.post('production/work_order/', workOrderPayload).subscribe({
  //               next: (workOrderResponse) => {
  //                 console.log('Work Order created:', workOrderResponse);
  //                 this.showSuccessToast = true;
  //                 this.toastMessage = "WorkOrder & Child Sale Order created";
  //                 setTimeout(() => {
  //                   this.showSuccessToast = false;
  //                 }, 3000);
  //               },
  //               error: (err) => {
  //                 console.error('Error creating Work Order:', err);
  //               }
  //             });
  //           })
  //         );
  //       });

  //       forkJoin(processProductRequests).subscribe({
  //         next: () => {
  //           console.log("patch started here....")
  //           console.log("saleOrderDetails : ", saleOrderDetails)
  //           console.log("remainingItems : ", remainingItems)
  //           // const putPayload = {
  //           //   sale_order: saleOrderDetails,
  //           //   sale_order_items: remainingItems,
  //           //   order_attachments: orderAttachments,
  //           //   order_shipments: orderShipments
  //           // };
  //           // For backend to delete selected items
  //           const patchPayload = {
  //             sale_order_items: productDetails.map(p => ({ sale_order_item_id: p.sale_order_item_id }))
  //           };
  //           this.http.patch(`sales/sale_order/${saleOrderDetails.sale_order_id}/`, patchPayload).subscribe({
  //             next: () => {
  //               console.log('Parent sale order updated after removing selected items');
  //               // ✅ Full refresh of parent order with all entities
  //               // this.http.put(`sales/sale_order/${saleOrderDetails.sale_order_id}/`, putPayload).subscribe({
  //               //   next: () => {
  //               //     console.log('Parent sale order fully refreshed with recalculated totals');
  //               //     this.closeModalworkorder();
  //               //   },
  //               //   error: (err) => {
  //               //     console.error('Error in full update of parent sale order:', err);
  //               //     this.closeModalworkorder();
  //               //   }
  //               // });
  //               this.closeModalworkorder();
  //             },
  //             error: (err) => {
  //               console.error('Failed to update parent sale order:', err);
  //               this.closeModalworkorder(); // still close modal to avoid blocking
  //             }
  //           });
  //         },
  //         error: (err) => {
  //           console.error('Error processing products:', err);
  //           alert('Failed to create Child Sale Orders or Work Orders. Please try again.');
  //         }
  //       });
  //     }
  //   }
  //   this.ngOnInit();
  // }

confirmWorkOrder() {
  console.log("data1", this.selectedOrder);
  if (this.selectedOrder) {
    let { productDetails, saleOrderDetails, orderAttachments, orderShipments, customFieldsValues } = this.selectedOrder;

    const allProducts = this.formConfig.model.sale_order_items;
    const isAllProductsSelected = productDetails.length === allProducts.length;

    if (isAllProductsSelected) {
      console.log("All products selected. Creating only work orders...");

      this.http.post(`sales/SaleOrder/${saleOrderDetails.sale_order_id}/move_next_stage/`, {}).subscribe({
        next: (updateResponse) => {
          console.log('Parent Sale Order updated to Production:', updateResponse);

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
                sale_order_id: saleOrderDetails.sale_order_id
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

            return this.http.post('production/work_order/', workOrderPayload);
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

      const parentOrderNo = saleOrderDetails.order_no;
      let childOrderCounter = 1;

      const removedItemIds = productDetails.map(p => p.sale_order_item_id);  // selected ones
      const parentAllItems = this.formConfig.model.sale_order_items || [];
      const remainingItems = parentAllItems.filter(item => !removedItemIds.includes(item.sale_order_item_id));

      // 🔹 Custom Fields Payload Construction (same as createSaleOrder)
      const entityName = 'sale_order';
      const customId = null; // child is new
      const entity = this.entitiesList.find(e => e.entity_name === entityName);

      if (entity) {
        const entityId = entity.entity_id;
        Object.keys(this.customFieldMetadata).forEach((key) => {
          this.customFieldMetadata[key].entity_id = entityId;
        });
      }

      const customFieldsPayload = CustomFieldHelper.constructCustomFieldsPayload(
        customFieldsValues,
        entityName,
        customId
      );

      const processProductRequests = productDetails.map((product) => {
        const childOrderNo = `${parentOrderNo}-${childOrderCounter++}`;

        const quantity = Number(product.quantity) || 0;
        const rate = Number(product.rate) || 0;
        const itemsValue = quantity * rate;

        const igst = Number(product.igst) || 0;
        const cgst = Number(product.cgst) || 0;
        const sgst = Number(product.sgst) || 0;
        const taxAmount = igst + cgst + sgst;

        const productDiscountPercent = Number(product.discount) || 0;
        const discountOnItems = (itemsValue * productDiscountPercent) / 100;

        const totalCess = Number(saleOrderDetails.cess_amount) || 0;
        const totalDiscount = Number(saleOrderDetails.dis_amt) || 0;
        const selectedProductCount = productDetails.length;

        const perOrderCess = selectedProductCount > 0 ? (totalCess / selectedProductCount) : 0;
        const perOrderDiscount = selectedProductCount > 0 ? (totalDiscount / selectedProductCount) : 0;

        const totalAmount = itemsValue
          - perOrderDiscount
          + taxAmount + perOrderCess
          - discountOnItems;

        console.log(`Computed for product ${product.product_id}:`,
          { itemsValue, taxAmount, perOrderDiscount, discountOnItems, totalAmount });

        const childSaleOrderPayload = {
          sale_order: {
            order_no: childOrderNo,
            ref_no: saleOrderDetails.ref_no,
            sale_type_id: saleOrderDetails.sale_type_id,
            tax: saleOrderDetails.tax,
            cess_amount: perOrderCess.toFixed(2),
            tax_amount: taxAmount,
            advance_amount: saleOrderDetails.advance_amount,
            item_value: itemsValue,
            total_amount: totalAmount,
            ledger_account_id: saleOrderDetails.ledger_account_id,
            order_status_id: saleOrderDetails.order_status_id,
            customer_id: saleOrderDetails.customer.customer_id,
            order_date: saleOrderDetails.order_date,
            ref_date: saleOrderDetails.ref_date,
            delivery_date: saleOrderDetails.delivery_date,
            order_type: 'sale_order',
            sale_estimate: saleOrderDetails.sale_estimate || 'No',
            flow_status: { flow_status_name: 'Production' },
            billing_address: saleOrderDetails.billing_address,
            shipping_address: saleOrderDetails.shipping_address,
            email: saleOrderDetails.email,
            remarks: saleOrderDetails.remarks || null,
            dis_amt: perOrderDiscount,
          },
          sale_order_items: [product],
          order_attachments: orderAttachments,
          order_shipments: orderShipments,
          custom_field_values: customFieldsPayload?.custom_field_values || []   // ✅ fixed
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
                sale_order_id: childSaleOrderResponse.data.sale_order.sale_order_id
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
                this.toastMessage = "WorkOrder & Child Sale Order created";
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

      forkJoin(processProductRequests).subscribe({
        next: () => {
          console.log("patch started here....")
          console.log("saleOrderDetails : ", saleOrderDetails)
          console.log("remainingItems : ", remainingItems)

          const patchPayload = {
            sale_order_items: productDetails.map(p => ({ sale_order_item_id: p.sale_order_item_id }))
          };
          this.http.patch(`sales/sale_order/${saleOrderDetails.sale_order_id}/`, patchPayload).subscribe({
            next: () => {
              console.log('Parent sale order updated after removing selected items');
              this.closeModalworkorder();
            },
            error: (err) => {
              console.error('Failed to update parent sale order:', err);
              this.closeModalworkorder();
            }
          });
        },
        error: (err) => {
          console.error('Error processing products:', err);
          alert('Failed to create Child Sale Orders or Work Orders. Please try again.');
        }
      });
    }
  }
  this.ngOnInit();
}


  // confirmWorkOrder() {
  //   console.log("data1", this.selectedOrder);
  //   if (!this.selectedOrder) return;

  //   const { productDetails, saleOrderDetails, orderAttachments, orderShipments, customFieldsValues } = this.selectedOrder;
  //   const allProducts = this.formConfig.model.sale_order_items;
  //   const isAllProductsSelected = productDetails.length === allProducts.length;

  //   if (isAllProductsSelected) {
  //     console.log("All products selected. Creating only work orders...");

  //     this.http.post(`sales/SaleOrder/${saleOrderDetails.sale_order_id}/move_next_stage/`, {}).subscribe({
  //       next: () => {
  //         const workOrders = productDetails.map(product => {
  //           const workOrderPayload = {
  //             work_order: {
  //               product_id: product.product_id,
  //               quantity: product.quantity || 0,
  //               completed_qty: 0,
  //               pending_qty: product.quantity || 0,
  //               start_date: saleOrderDetails.order_date || new Date().toISOString().split('T')[0],
  //               sync_qty: true,
  //               size_id: product.size?.size_id || null,
  //               color_id: product.color?.color_id || null,
  //               status_id: '',
  //               sale_order_id: saleOrderDetails.sale_order_id
  //             },
  //             bom: [{ product_id: product.product_id, size_id: product.size?.size_id || null, color_id: product.color?.color_id || null }],
  //             work_order_machines: [],
  //             workers: [],
  //             work_order_stages: []
  //           };
  //           return this.http.post('production/work_order/', workOrderPayload);
  //         });

  //         forkJoin(workOrders).subscribe({
  //           next: () => {
  //             this.closeModalworkorder();
  //             console.log('Work Orders created successfully!');
  //           },
  //           error: err => {
  //             console.error('Error creating Work Orders:', err);
  //             alert('Failed to create Work Orders.');
  //           }
  //         });
  //       },
  //       error: err => console.error('Error updating Parent Sale Order:', err)
  //     });

  //   } else {
  //     console.log("Partial products selected. Creating child sale orders & work orders...");

  //     const parentOrderNo = saleOrderDetails.order_no;
  //     let childOrderCounter = 1;

  //     const removedItemIds = productDetails.map(p => p.sale_order_item_id);
  //     const parentAllItems = this.formConfig.model.sale_order_items || [];
  //     const remainingItems = parentAllItems.filter(item => !removedItemIds.includes(item.sale_order_item_id));

  //     const processProductRequests = productDetails.map(product => {
  //       const childOrderNo = `${parentOrderNo}-${childOrderCounter++}`;
  //       const quantity = Number(product.quantity) || 0;
  //       const rate = Number(product.rate) || 0;
  //       const itemsValue = quantity * rate;
  //       const igst = Number(product.igst) || 0;
  //       const cgst = Number(product.cgst) || 0;
  //       const sgst = Number(product.sgst) || 0;
  //       const taxAmount = igst + cgst + sgst;
  //       const productDiscountPercent = Number(product.discount) || 0;
  //       const discountOnItems = (itemsValue * productDiscountPercent) / 100;

  //       const totalCess = 0;
  //       const totalDiscount = 0;

  //       const totalAmount = itemsValue - totalDiscount + taxAmount - discountOnItems + totalCess;

  //       const childSaleOrderPayload = {
  //         sale_order: {
  //           ...saleOrderDetails,
  //           order_no: childOrderNo,
  //           tax_amount: taxAmount,
  //           item_value: itemsValue,
  //           total_amount: totalAmount,
  //           dis_amt: totalDiscount,
  //           cess_amount: totalCess,
  //           flow_status: { flow_status_name: 'Production' }
  //         },
  //         sale_order_items: [product],
  //         order_attachments: orderAttachments,
  //         order_shipments: orderShipments,
  //         custom_field_values: customFieldsValues
  //       };

  //       return this.http.post('sales/sale_order/', childSaleOrderPayload).pipe(
  //         tap((childSaleOrderResponse: any) => {
  //           this.http.patch(`sales/sale_order_items/${product.sale_order_item_id}/`, { work_order_created: 'YES' }).subscribe();

  //           const workOrderPayload = {
  //             work_order: {
  //               product_id: product.product_id,
  //               quantity: product.quantity || 0,
  //               completed_qty: 0,
  //               pending_qty: product.quantity || 0,
  //               start_date: saleOrderDetails.order_date || new Date().toISOString().split('T')[0],
  //               sync_qty: true,
  //               size_id: product.size?.size_id || null,
  //               color_id: product.color?.color_id || null,
  //               status_id: '',
  //               sale_order_id: childSaleOrderResponse.data.sale_order.sale_order_id
  //             },
  //             bom: [{ product_id: product.product_id, size_id: product.size?.size_id || null, color_id: product.color?.color_id || null }],
  //             work_order_machines: [],
  //             workers: [],
  //             work_order_stages: []
  //           };

  //           this.http.post('production/work_order/', workOrderPayload).subscribe();
  //         })
  //       );
  //     });

  //     forkJoin(processProductRequests).subscribe({
  //       next: () => {
  //         const patchPayload = {
  //           sale_order_items: productDetails.map(p => ({ sale_order_item_id: p.sale_order_item_id }))
  //         };

  //         this.http.patch(`sales/sale_order/${saleOrderDetails.sale_order_id}/`, patchPayload).subscribe({
  //           next: () => {
  //             // ✅ Recalculate parent totals from remainingItems
  //             let updatedItemValue = 0;
  //             let updatedTaxAmount = 0;
  //             let updatedProductDiscount = 0;

  //             remainingItems.forEach(item => {
  //               const quantity = Number(item.quantity) || 0;
  //               const rate = Number(item.rate) || 0;
  //               const itemValue = quantity * rate;
  //               const igst = Number(item.igst) || 0;
  //               const cgst = Number(item.cgst) || 0;
  //               const sgst = Number(item.sgst) || 0;
  //               const taxAmount = igst + cgst + sgst;
  //               const discount = Number(item.discount) || 0;
  //               const discountAmount = (itemValue * discount) / 100;

  //               updatedItemValue += itemValue;
  //               updatedTaxAmount += taxAmount;
  //               updatedProductDiscount += discountAmount;
  //             });

  //             const totalCess = Number(saleOrderDetails.cess_amount) || 0;
  //             const totalDiscount = Number(saleOrderDetails.dis_amt) || 0;
  //             // const totalItemCount = allProducts.length;
  //             // const remainingCount = remainingItems.length;
  //             // const updatedCessAmount = (totalCess / totalItemCount) * remainingCount;
  //             // const updatedOrderLevelDiscount = (totalDiscount / totalItemCount) * remainingCount;

  //             const updatedTotalAmount = updatedItemValue - totalDiscount + updatedTaxAmount + totalCess - updatedProductDiscount;

  //             // ✅ Full PUT call to update parent sale order
  //             const finalPutPayload = {
  //               sale_order: {
  //                 ...saleOrderDetails,
  //                 item_value: updatedItemValue,
  //                 tax_amount: updatedTaxAmount,
  //                 dis_amt: totalDiscount,
  //                 cess_amount: totalCess,
  //                 total_amount: updatedTotalAmount
  //               },
  //               sale_order_items: remainingItems,
  //               order_attachments: orderAttachments,
  //               order_shipments: orderShipments,
  //               custom_field_values: customFieldsValues
  //             };

  //             this.http.put(`sales/sale_order/${saleOrderDetails.sale_order_id}/`, finalPutPayload).subscribe({
  //               next: () => {
  //                 console.log("✅ Parent sale order fully updated via PUT.");
  //                 this.closeModalworkorder();
  //               },
  //               error: err => {
  //                 console.error("❌ Failed to update parent sale order:", err);
  //                 this.closeModalworkorder();
  //               }
  //             });
  //           },
  //           error: (err) => {
  //             console.error('Failed to patch parent sale order:', err);
  //             this.closeModalworkorder();
  //           }
  //         });
  //       },
  //       error: err => {
  //         console.error('Error creating child sale orders or work orders:', err);
  //         alert('Child Sale Order creation failed.');
  //       }
  //     });
  //   }

  //   this.ngOnInit();
  // }


//   getUnitData(unitInfo) {
//     console.log("unitinfo : ", unitInfo);
//     const unitOption = unitInfo.unit_options?.unit_name ?? 'NA';
//     const stockUnit = unitInfo.stock_unit?.stock_unit_name ?? 'NA';
//     // const packUnit = unitInfo.pack_unit?.unit_name ?? 'NA';
//     // const gPackUnit = unitInfo.g_pack_unit?.unit_name ?? 'NA';
//     // const packVsStock = unitInfo.pack_vs_stock ?? 0;
//     // const gPackVsPack = unitInfo.g_pack_vs_pack ?? 0;
//     const packUnit = unitInfo.pack_unit?.unit_name ?? (unitInfo.pack_unit_id === null ? 'NA' : unitInfo.pack_unit);
//     const gPackUnit = unitInfo.g_pack_unit?.unit_name ?? (unitInfo.g_pack_unit_id === null ? 'NA' : unitInfo.g_pack_unit);

//     // ✅ Explicit check so 0 stays 0
//     const packVsStock = unitInfo.pack_vs_stock !== null && unitInfo.pack_vs_stock !== undefined
//       ? unitInfo.pack_vs_stock
//       : 'NA';

//     const gPackVsPack = unitInfo.g_pack_vs_pack !== null && unitInfo.g_pack_vs_pack !== undefined
//       ? unitInfo.g_pack_vs_pack
//       : 'NA';

  
//     const stockUnitReg = /\b[sS][tT][oO][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
//     const GpackReg = /\b(?:[sS]tock[_ ]?[pP]ack[_ ]?)?[gG][pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
//     const stockPackReg = /\b[sS][tT][oO][cC][kK][_ ]?[pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
  
//     if (stockUnitReg.test(unitOption)) {
//       return `<span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> | &nbsp;`;
//     } else if (GpackReg.test(unitOption)) {
//       return `
//         <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> |
//         <span style="color: red;">Pck Unit:</span> <span style="color: blue;">${packUnit}</span> |
//         <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${packVsStock}</span> |
//         <span style="color: red;">GPackUnit:</span> <span style="color: blue;">${gPackUnit}</span> |
//         <span style="color: red;">GPackVsStock:</span> <span style="color: blue;">${gPackVsPack}</span> | &nbsp;`;
//     } else if (stockPackReg.test(unitOption)) {
//       return `
//         <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> |
//         <span style="color: red;">Pack Unit:</span> <span style="color: blue;">${packUnit}</span> |
//         <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${packVsStock}</span> | &nbsp;`;
//     } else {
//       console.log('No Unit Option match found');
//       return "";
//     }
//   }

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

getUnitData(unitInfo) {
  console.log("unitinfo : ", unitInfo);

  const unitOption = unitInfo.unit_options?.unit_name ?? 'NA';
  const stockUnit = unitInfo.stock_unit?.stock_unit_name ?? 'NA';

  // ✅ Only null/undefined → NA, keep 0 or string
  const packUnit = unitInfo.pack_unit?.unit_name ?? (unitInfo.pack_unit_id == null ? 'NA' : unitInfo.pack_unit_id);
  const gPackUnit = unitInfo.g_pack_unit?.unit_name ?? (unitInfo.g_pack_unit_id == null ? 'NA' : unitInfo.g_pack_unit_id);

  const packVsStock = unitInfo.pack_vs_stock == null ? 'NA' : unitInfo.pack_vs_stock;
  const gPackVsPack = unitInfo.g_pack_vs_pack == null ? 'NA' : unitInfo.g_pack_vs_pack;

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
      <span style="color: red;">GPackVsPack:</span> <span style="color: blue;">${gPackVsPack}</span> | &nbsp;`;
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



  // displayInformation(product: any, size: any, color: any, unitData : any, sizeBalance: any, colorBalance: any) {
  //   const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
  //   let data = '';

  //   const stockInfo = `
  //     <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${unitData?.stock_unit_id || 'NA'}</span> |
  //     <span style="color: red;">Pack Unit:</span> <span style="color: blue;">${unitData?.pack_unit_id || 'NA'}</span> |
  //     <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${unitData?.pack_vs_stock || 'NA'}</span> |
  //     <span style="color: red;">GPack Unit:</span> <span style="color: blue;">${unitData?.g_pack_unit_id || 'NA'}</span> |
  //     <span style="color: red;">GPackVsPack:</span> <span style="color: blue;">${unitData?.g_pack_vs_pack || 'NA'}</span>
  //   `;

  //   if (product && !size && !color) {
  //     data = `
  //     <span style="font-size: 12px;">
  //       <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> |                            
  //       <span style="color: red;">Balance:</span> <span style="color: blue;">${product?.balance || 0}</span> | ${stockInfo}
  //     </span>`;

  //   }

  //   if (size && !color) {
  //     data = `
  //       <span style="font-size: 12px;">
  //         <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> | 
  //         <span style="color: red;">Size:</span> <span style="color: blue;">${size.size_name}</span> | 
  //         <span style="color: red;">Balance:</span> <span style="color: blue;">${sizeBalance || 0}</span> | 
  //         ${stockInfo}
  //       </span>`;
  //   }

  //   if (color) {
  //     data = `
  //       <span style="font-size: 12px;">
  //         <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> | 
  //         <span style="color: red;">Size:</span> <span style="color: blue;">${size.size_name}</span> | 
  //         <span style="color: red;">Color:</span> <span style="color: blue;">${color.color_name}</span> | 
  //         <span style="color: red;">Balance:</span> <span style="color: blue;">${colorBalance || 0}</span> | 
  //         ${stockInfo}
  //       </span>`;
  //   }

  //   // data += ` | ${unitData}`;

  //   cardWrapper.querySelector('.center-message')?.remove();
  //   const productInfoDiv = document.createElement('div');
  //   productInfoDiv.classList.add('center-message');
  //   productInfoDiv.innerHTML = data;
  //   cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
  // };

  displayInformation(product: any, size: any, color: any, unitData : any, sizeBalance: any, colorBalance: any) {
    const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
    let data = '';
    console.log('Product data in html : ', product)
    console.log('unitData data in html : ', unitData)

    // format unitData fields in correct order
    const stockInfo = `
      <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${product?.stock_unit.stock_unit_name || 'NA'}</span> |
      <span style="color: red;">Pack Unit:</span> <span style="color: blue;">${product?.pack_unit_id || 'NA'}</span> |
      <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${product?.pack_vs_stock || 'NA'}</span> |
      <span style="color: red;">GPack Unit:</span> <span style="color: blue;">${product?.g_pack_unit_id || 'NA'}</span> |
      <span style="color: red;">GPackVsPack:</span> <span style="color: blue;">${product?.g_pack_vs_pack || 'NA'}</span>
    `;

    if (product && !size && !color) {
      data = `
        <span style="font-size: 12px;">
          <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> | 
          <span style="color: red;">Balance:</span> <span style="color: blue;">${product?.balance || 0}</span> | 
          ${stockInfo}
        </span>`;
    }

    if (size && !color) {
      data = `
        <span style="font-size: 12px;">
          <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> | 
          <span style="color: red;">Balance:</span> <span style="color: blue;">${sizeBalance || 0}</span> | 
          <span style="color: red;">Size:</span> <span style="color: blue;">${size.size_name}</span> | 
          ${stockInfo}
        </span>`;
    }

    if (color) {
      data = `
        <span style="font-size: 12px;">
          <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> | 
          <span style="color: red;">Balance:</span> <span style="color: blue;">${colorBalance || 0}</span> | 
          <span style="color: red;">Size:</span> <span style="color: blue;">${size?.size_name || 'NA'}</span> | 
          <span style="color: red;">Color:</span> <span style="color: blue;">${color.color_name}</span> | 
          ${stockInfo}
        </span>`;
    }

    cardWrapper.querySelector('.center-message')?.remove();
    const productInfoDiv = document.createElement('div');
    productInfoDiv.classList.add('center-message');
    productInfoDiv.innerHTML = data;
    cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
  };


  hasOrderNoLoaded = false;
  

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

            // Validate custom fields BEFORE proceeding
            if (!this.validateCustomFields()) {
              console.log("Custom field validation failed. Showing dialog.");
              return; // Stop here if validation failed
            }

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
        sale_order_items: [{}, {}, {}, {}, {}],
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
                // {
                //   key: 'sale_type',
                //   type: 'select',
                //   className: 'col-md-4 col-sm-6 col-12',
                //   templateOptions: {
                //     label: 'Sale type',
                //     dataKey: 'sale_type_id',
                //     dataLabel: 'name',
                //     required: true,
                //     options: [],
                //     lazy: {
                //       url: 'masters/sale_types/',
                //       lazyOneTime: true
                //     },
                //   },
                //   hooks: {
                //     onInit: (field: any) => {
                //       const lazyUrl = field.templateOptions.lazy.url;
                //       this.http.get(lazyUrl).subscribe((response: any) => {
                //         const saleTypes = response.data;
                //         field.templateOptions.options = saleTypes;

                //         const currentSaleTypeId = this.formConfig.model?.sale_order?.sale_type_id;
                //         if (currentSaleTypeId) {
                //           const matchedOption = saleTypes.find(opt => opt.sale_type_id === currentSaleTypeId);
                //           if (matchedOption) {
                //             field.formControl.setValue(matchedOption, { emitEvent: false });
                //           }
                //         } else {
                //           const defaultOption = saleTypes.find(option => option.name === 'Advance Order');
                //           if (defaultOption) {
                //             field.formControl.setValue(defaultOption, { emitEvent: false });
                //             this.formConfig.model['sale_order']['sale_type_id'] = defaultOption.sale_type_id;
                //           }
                //         }
                //       });

                //       let orderGenerated = false; // ensures single API call

                //       field.formControl.valueChanges.subscribe((data: any) => {
                //         if (data && data.sale_type_id) {
                //           this.formConfig.model['sale_order']['sale_type_id'] = data.sale_type_id;

                //           // Generate order_no once on create
                //           if (!this.SaleOrderEditID && !orderGenerated) {
                //             orderGenerated = true;
                //             const prefix = data.name === 'Other' ? 'SOO' : 'SO';
                //             this.http.get(`masters/generate_order_no/?type=${prefix}`).subscribe((res: any) => {
                //               if (res?.data?.order_number) {
                //                 this.orderNumber = res.data.order_number;
                //                 this.formConfig.model['sale_order']['order_no'] = this.orderNumber;
                //                 field.form.controls.order_no.setValue(this.orderNumber);
                //                 this.cdRef.detectChanges();
                //               }
                //             });
                //           }
                //         }
                //       });
                //     }
                //   }
                // },  
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
                    },
                  },
                  hooks: {
                    onInit: (field: any) => {
                      const lazyUrl = field.templateOptions.lazy.url;
                      const modelSaleOrder = this.formConfig.model?.sale_order || {};
                      let orderGenerated = false;

                      this.http.get(lazyUrl).subscribe((response: any) => {
                        const saleTypes = response.data;
                        field.templateOptions.options = saleTypes;

                        const currentSaleTypeId = modelSaleOrder.sale_type_id;
                        if (currentSaleTypeId) {
                          const matchedOption = saleTypes.find(opt => opt.sale_type_id === currentSaleTypeId);
                          if (matchedOption) {
                            field.formControl.setValue(matchedOption, { emitEvent: false });
                          }
                        } else {
                          const defaultOption = saleTypes.find(option => option.name === 'Advance Order');
                          if (defaultOption) {
                            field.formControl.setValue(defaultOption, { emitEvent: false });
                            modelSaleOrder.sale_type_id = defaultOption.sale_type_id;
                          }
                        }
                      });

                      field.formControl.valueChanges.subscribe((data: any) => {
                        if (data && data.sale_type_id) {
                          modelSaleOrder.sale_type_id = data.sale_type_id;

                          if (!this.SaleOrderEditID && !orderGenerated) {
                            orderGenerated = true;
                            const prefix = data.name === 'Other' ? 'SOO' : 'SO';

                            this.http.get(`masters/generate_order_no/?type=${prefix}`).subscribe((res: any) => {
                              if (res?.data?.order_number) {
                                this.orderNumber = res.data.order_number;
                                modelSaleOrder.order_no = this.orderNumber;

                                // ✅ setValue only if field exists in form
                                const orderNoControl = field.form.get('order_no');
                                if (orderNoControl) {
                                  orderNoControl.setValue(this.orderNumber);
                                }
                              }
                            });
                          }
                        }
                      });
                    }
                  }
                },
                // {
                //   key: 'sale_type',
                //   type: 'select',
                //   className: 'col-md-4 col-sm-6 col-12',
                //   templateOptions: {
                //     label: 'Sale type',
                //     dataKey: 'sale_type_id',
                //     dataLabel: 'name',
                //     required: true,
                //     options: [], // Options will be populated dynamically
                //     lazy: {
                //       url: 'masters/sale_types/',
                //       lazyOneTime: true
                //     }
                //   },
                //   hooks: {
                //     onInit: (field: any) => {
                //       // Fetch data from the API
                //       const lazyUrl = field.templateOptions.lazy.url;
                //       this.http.get(lazyUrl).subscribe((response: any) => {
                //         const saleTypes = response.data;

                //         // Populate the options dynamically
                //         field.templateOptions.options = saleTypes;

                //         // Find the option with name "Advance Order"
                //         const defaultOption = saleTypes.find(
                //           (option: any) => option.name === 'Advance Order'
                //         );

                //         // Set the default value if "Advance Order" exists
                //         if (defaultOption) {
                //           field.formControl.setValue(defaultOption);
                //         }
                //       });

                //       // Handle value changes
                //       // field.formControl.valueChanges.subscribe((data: any) => {
                //       //   console.log('Selected sale_type:', data);
                //       //   if (data && data.sale_type_id) {
                //       //     this.formConfig.model['sale_order']['sale_type_id'] = data.sale_type_id;
                //       //   }
                //       // });
                //       field.formControl.valueChanges.subscribe((data: any) => {
                //         console.log('Selected sale_type:', data);

                //         if (data && data.sale_type_id) {
                //           this.formConfig.model['sale_order']['sale_type_id'] = data;

                //           // Prevent multiple calls to getOrderNo
                //           if (!this.hasOrderNoLoaded) {
                //             this.hasOrderNoLoaded = true;
                //             this.getOrderNo();
                //           }
                //         }
                //       });

                //     }
                //   }
                // },                                                                        
                {
                  key: 'customer',
                  type: 'customer-dropdown',
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
                // {
                //   key: 'delivery_date',
                //   type: 'date',
                //   defaultValue: this.nowDate(),
                //   className: 'col-md-4 col-sm-6 col-12',
                //   templateOptions: {
                //     type: 'date',
                //     label: 'Delivery date',
                //     readonly: false,
                //     required: true
                //   }
                // },
                {
                  key: 'order_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'date',
                    label: 'Order date',
                    readonly: false,
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
                    readonly: false,
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
                    required: false,
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
                    required: false,
                    disabled: false,
                    options: [
                      { 'label': "Inclusive", value: 'Inclusive' },
                      { 'label': "Exclusive", value: 'Exclusive' }

                    ]
                  },
                  hooks: {
                    onInit: (field: any) => {
                      if (this.dataToPopulate && this.dataToPopulate.sale_order.tax && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.sale_order.tax);
                      } else {
                        // Set default value to 'Exclusive'
                        field.formControl.setValue('Exclusive');
                      }
                    }
                  }
                },
                // {
                //   key: 'tax',
                //   type: 'select',
                //   className: 'col-md-4 col-sm-6 col-12',
                //   templateOptions: {
                //     label: 'Tax',
                //     required: true,
                //     options: [
                //       { 'label': "Inclusive", value: 'Inclusive' },
                //       { 'label': "Exclusive", value: 'Exclusive' }
                //     ]
                //   },
                //   hooks: {
                //     onInit: (field: any) => {
                //       if (this.dataToPopulate && this.dataToPopulate.sale_order.tax && field.formControl) {
                //         field.formControl.setValue(this.dataToPopulate.sale_order.tax);
                //       }
                //     }
                //   }
                // },
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
                        console.log("starting toal_amount : ", saleOrder.total_amount);
                        const saleTypeObj = saleOrder.sale_type;
                        const saleTypeName = saleTypeObj?.name || '';
                        const billType = (saleTypeName === 'Other') ? 'OTHERS' : 'CASH';
                        const invoicePrefix = (saleTypeName === 'Other') ? 'SOO-INV' : 'SO-INV';

                        this.http.get(`masters/generate_order_no/?type=${invoicePrefix}`).subscribe((res: any) => {
                          if (res?.data?.order_number) {
                            this.invoiceNumber = res.data.order_number;

                            // ✅ Fetch order_status_id by status_name = "Completed"
                            this.http.get('masters/order_status/?status_name=Pending').subscribe((statusRes: any) => {
                              const completedStatus = statusRes?.data?.[0];
                              const completedStatusId = completedStatus?.order_status_id;
                              console.log("Second time toal_amount : ", saleOrder.total_amount);

                              // ✅ Inline total calculation
                              let itemValue = 0;
                              let amountTotal = 0;

                              if (Array.isArray(saleOrderItems)) {
                                saleOrderItems.forEach(item => {
                                  const quantity = Number(item.quantity) || 0;
                                  const rate = Number(item.rate) || 0;
                                  const discountPercent = Number(item.discount) || 0;
                                  console.log("discountPercent : ", discountPercent)
                                  const itemVal = quantity * rate;
                                  const itemDiscount = (itemVal * discountPercent) / 100;
                                  const amount = itemVal - itemDiscount;
                                  console.log("amount : ", amount)

                                  item.amount = amount;

                                  itemValue += itemVal;
                                  amountTotal += amount;
                                });
                              }

                              const totalTax = saleOrderItems.reduce((sum, item) => {
                                const cgst = Number(item.cgst) || 0;
                                const igst = Number(item.igst) || 0;
                                const sgst = Number(item.sgst) || 0;
                                return sum + cgst + igst + sgst;
                              }, 0);

                              console.log("Third time toal_amount : ", saleOrder.total_amount);

                              const cessAmount = Number(saleOrder.cess_amount) || 0;
                              const disAmt = Number(saleOrder.dis_amt) || 0;
                              console.log("disAmt : ", disAmt)

                              const totalAmount = amountTotal + totalTax;
                              saleOrder.dis_amt = disAmt;

                              const dis_amt = Number(saleOrder.dis_amt) || 0;
                              const cess_amount = Number(saleOrder.cess_amount) || 0;
                              const final_total_amount = totalAmount - dis_amt + cess_amount;
                              console.log("Cess amount : ", saleOrder.cess_amount)
                              console.log("discount amount : ", saleOrder.dis_amt)
                              console.log("Total amount : ", saleOrder.total_amount)
                              saleOrder.total_amount = final_total_amount

                              this.invoiceData = {
                                sale_invoice_order: {
                                  // invoice_no: this.invoiceNumber,
                                  bill_type: billType,
                                  invoice_date: this.nowDate(),
                                  email: saleOrder.email,
                                  ref_no: saleOrder.ref_no,
                                  ref_date: this.nowDate(),
                                  due_date: this.nowDate(),
                                  tax: saleOrder.tax || 'Inclusive',
                                  remarks: saleOrder.remarks,
                                  advance_amount: saleOrder.advance_amount || '0',
                                  tax_amount: saleOrder.tax_amount || '0',
                                  item_value: saleOrder.item_value,
                                  discount: saleOrder.discount,
                                  dis_amt: saleOrder.dis_amt,
                                  taxable: saleOrder.taxable,
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
                                  flow_status: saleOrder.flow_status,
                                  order_status_id: completedStatusId,
                                  sale_order: saleOrder.sale_order,
                                  sale_order_id: saleOrder.sale_order_id,
                                  ...(billType == 'OTHERS' && { invoice_no: this.invoiceNumber })
                                },
                                // sale_invoice_items: saleOrderItems,
                                sale_invoice_items: saleOrderItems
                                  .filter(item => item.product_id)   // only keep valid rows
                                  .map(item => ({
                                    ...item,
                                    discount: item.discount
                                })),
                                order_attachments: orderAttachments,
                                order_shipments: orderShipments
                              };
                              console.log("final toal_amount : ", saleOrder.total_amount);
                              console.log('invoiceData:', this.invoiceData);
                              console.log("invoiceData toal_amount : ", this.invoiceData.sale_invoice_order.total_amount);
                            });
                          }
                        });
                      });
                    }
                  }
                },
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
                name: 'total_boxes',
                label: 'Total Boxes'
              },
              {
                name: 'unit',
                label: 'Unit'
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
                  'templateOptions.disabled': (model) => model.invoiced === 'YES' || model.work_order_created === 'YES' || !this.SaleOrderEditID
                }
              },
              {
                key: 'product',
                type: 'products-dropdown',
                templateOptions: {
                  label: 'Product',
                  dataKey: 'product_id',
                  hideLabel: true,
                  dataLabel: 'name',
                  placeholder: 'Product',
                  options: [],
                  required: false,
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
                    // console.log("existingProduct : ", existingProduct);
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
                    field.formControl.valueChanges.subscribe(async selectedProductId => {
                      const unit = this.getUnitData(selectedProductId);
                      const row = this.formConfig.model.sale_order_items[currentRowIndex];
                      this.displayInformation(row.product, null, null, unit, '', '');
                      console.log('executed from product info text code');
                    }); // end of product info text code
                  }
                }
              },
              {
                type: 'input',
                key: 'print_name',
                templateOptions: {
                  label: 'Print Name',
                  placeholder: 'Print name',
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

                    console.log("color data : ", saleOrderItems?.color )

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
              
              // {
              //   type: 'input',
              //   key: 'code',
              //   templateOptions: {
              //     label: 'Code',
              //     placeholder: 'code',
              //     hideLabel: true,
              //   },
              //   hooks: {
              //     onInit: (field: any) => {
              //       const parentArray = field.parent;
              //       if (!parentArray) return;

              //       const idx = +parentArray.key;
              //       console.log('Init code field for row', idx);

              //       // Use form model directly instead of dataToPopulate
              //       const rowData = this.formConfig.model.sale_order_items[idx];
              //       const existingCode = rowData ? rowData.product?.code : undefined;
              //       console.log(`Row ${idx} code from formConfig.model:`, existingCode);

              //       if (existingCode !== undefined && existingCode !== null) {
              //         field.formControl.setValue(existingCode);
              //       }
              //     }
              //   }
              // },
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
                key: 'quantity',
                // defaultValue: 1,
                templateOptions: {
                  type: 'number',
                  label: 'Qty',
                  placeholder: 'Qty',
                  min: 1,
                  hideLabel: true,
                  required: false
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
                        console.log("Rate in quantity : ", rate)
                        const discount = field.form.controls.discount.value;
                        const quantity = data;
                        const productDiscount = parseInt(rate) * parseInt(quantity) * parseInt(discount) / 100
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

                      if (this.dataToPopulate && this.dataToPopulate.sale_order_items.length > currentRowIndex) {
                        const existingDisc = this.dataToPopulate.sale_order_items[currentRowIndex].discount;
                        console.log("existingDisc : ", existingDisc)
                        // Just update this condition to include zeroes
                        if (existingDisc) {
                          field.formControl.setValue(existingDisc);
                        }
                      }
                    }

                    // Subscribe to discount value changes
                    field.formControl.valueChanges.subscribe(discount => {
                      this.totalAmountCal();
                      // Your original amount-calculation logic remains commented and untouched
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
                            // {
                            //   key: 'cess_amount',
                            //   type: 'input',
                            //   defaultValue: "0",
                            //   className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                            //   templateOptions: {
                            //     type: 'number',
                            //     label: 'Cess amount',
                            //     placeholder: 'Enter Cess amount'
                            //   },
                            //   hooks: {
                            //     onInit: (field: any) => {
                            //       if (this.dataToPopulate && this.dataToPopulate.sale_order && this.dataToPopulate.sale_order.cess_amount && field.formControl) {
                            //         field.formControl.setValue(this.dataToPopulate.sale_order.cess_amount);
                            //       }
                            //       field.formControl.valueChanges.subscribe(data => {
                            //         this.totalAmountCal();

                            //       })
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
                                  // Populate existing value (edit mode)
                                  const existing = this.dataToPopulate?.sale_order?.cess_amount;
                                  if (existing !== undefined && existing !== null && field.formControl) {
                                    field.formControl.setValue(existing);
                                  }

                                  // Subscribe to changes
                                  field.formControl.valueChanges.subscribe(data => {
                                    // ✅ Coerce empty, null, or invalid to 0
                                    const numeric = parseFloat(data);
                                    field.formControl.setValue(isNaN(numeric) ? 0 : numeric, { emitEvent: false });

                                    this.totalAmountCal(); // recalc totals
                                  });
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
                              type: 'gst-types-dropdown',
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
                              type: 'customer-payment-dropdown',
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
                              type: 'ledger-account-dropdown',
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
                      hooks: {
                        onInit: (field: any) => {
                          if (this.dataToPopulate && this.dataToPopulate.sale_order.email && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.sale_order.email);
                          }
                        }
                      }
                    },
                    {
                      key: 'billing_address',
                      type: 'textarea',
                      className: 'col-md-4 col-sm-6 col-12',
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
                      className: 'col-md-4 col-sm-6 col-12',
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
