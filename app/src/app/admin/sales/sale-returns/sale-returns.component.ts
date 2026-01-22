import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { forkJoin, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { tap, switchMap } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { OrderslistComponent } from '../orderslist/orderslist.component';
import { SaleinvoiceorderlistComponent } from '../saleinvoiceorderlist/saleinvoiceorderlist.component';
import { SaleReturnsListComponent } from './sale-returns-list/sale-returns-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { calculateTotalAmount, displayInformation, getUnitData, sumQuantities } from 'src/app/utils/display.utils';
import { CustomFieldHelper } from '../../utils/custom_field_fetch';
import { FormlyFieldConfig } from '@ngx-formly/core';
declare var bootstrap;


@Component({
  selector: 'app-sale-returns',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, SaleReturnsListComponent, SaleinvoiceorderlistComponent],
  templateUrl: './sale-returns.component.html',
  styleUrls: ['./sale-returns.component.scss']
})
export class SaleReturnsComponent {
  @ViewChild('salereturnForm', { static: false }) salereturnForm: TaFormComponent | undefined;
  @ViewChild('saleinvoiceordersModal', { static: true }) ordersModal: ElementRef;
  @ViewChild(SaleReturnsListComponent) SaleReturnsListComponent!: SaleReturnsListComponent;
  returnNumber: any;
  showSaleReturnOrderList: boolean = false;
  showForm: boolean = false;
  SaleReturnOrderEditID: any;
  SaleInvoiceEditID: any;
  productOptions: any;
  invoiceNumber: any;
  shippingTrackingNumber: any;
  customerDetails: Object;
  customerOrders: any[] = [];
  unitOptionOfProduct: any[] | string = []; // Initialize as an array by default
  showOrderListModal = false;
  selectedOrder: any;
  noOrdersMessage: string;
  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  //COPY -------------------------------------------------
  tables: string[] = ['Sale Order', 'Sale Invoice', 'Sale Return', 'Purchase Order', 'Purchase Invoice', 'Purchase Return'];

  // This will store available tables excluding the current one
  availableTables: string[] = [];

  // Selected table from dropdown
  selectedTable: string;

  // Variable to store current table name (example for 'Sale Order')
  currentTable: string = 'Sale Return'; // Dynamically change this based on your current module

  // Field mapping for auto population
  fieldMapping = {
    'Sale Invoice': {
      sourceModel: 'sale_return_order',  // Specify the source model
      targetModel: 'sale_invoice_order', // Specify the target model
      // Indicate nested fields with model mappings
      nestedModels: {
        sale_return_items: 'sale_invoice_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Sale Order': {
      sourceModel: 'sale_return_order',  // Specify the source model
      targetModel: 'sale_order',  // Specify the target model
      // Nested mappings
      nestedModels: {
        sale_return_items: 'sale_order_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Purchase Order': {
      sourceModel: 'sale_return_order',
      targetModel: 'purchase_order_data',
      nestedModels: {
        sale_return_items: 'purchase_order_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Purchase Invoice': {
      sourceModel: 'sale_return_order',
      targetModel: 'purchase_invoice_orders',
      nestedModels: {
        sale_return_items: 'purchase_invoice_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    },
    'Purchase Return': {
      sourceModel: 'sale_return_order',
      targetModel: 'purchase_return_orders',
      nestedModels: {
        sale_return_items: 'purchase_return_items',
        order_attachments: 'order_attachments',
        order_shipments: 'order_shipments'
      }
    }
  };

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
        this.selectedTable === 'Sale Order' ? 'sales' :
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
  ) { }

  dataToPopulate: any;
  salesReturnForm: FormGroup;
  entitiesList: any[] = [];
  ngOnInit() {

    this.showSaleReturnOrderList = false;
    this.showForm = false;
    this.SaleReturnOrderEditID = null;
    this.setFormConfig();
    this.checkAndPopulateData();
    //custom fields logic...
    this.http.get('masters/entities/')
      .subscribe((res: any) => {
        this.entitiesList = res.data || []; // Adjust if the response format differs
      });

    CustomFieldHelper.fetchCustomFields(this.http, 'sale_return', (customFields: any, customFieldMetadata: any) => {
      CustomFieldHelper.addCustomFieldsToFormConfig_2(customFields, customFieldMetadata, this.formConfig);
    });

    this.formConfig.model['sale_return_order']['order_type'] = 'sale_return';

    this.getReturnNo();
    this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[5].hide = true;
    this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[6].hide = true;
    // console.log("---------",this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1])  }
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
          // Ensure we are handling sale_return_items correctly
          const saleReturnItems = this.dataToPopulate.sale_return_items || [];

          // Clear existing sale_return_items to avoid duplicates
          this.formConfig.model.sale_return_items = [];

          // Populate form with data, ensuring unique entries
          saleReturnItems.forEach(item => {
            const populatedItem = {
              product_id: item.product.product_id,
              size: item.size,
              color: item.color,
              code: item.code,
              unit: item.unit,
              total_boxes: item.total_boxes,
              quantity: item.quantity,
              amount: item.amount,
              rate: item.rate,
              print_name: item.print_name,
              discount: item.discount
            };
            this.formConfig.model.sale_return_items.push(populatedItem);
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
        //         sizeField.templateOptions.options = [];
        //       }
        //       if (colorField) {
        //         colorField.templateOptions.options = [];
        //       }
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
            const row = this.formConfig.model.sale_return_items[+parentArray.key];
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

async autoFillProductDetails(field, data) {
  this.productOptions = data;
  console.log("Autofill data : ", this.productOptions);
  if (!field.form?.controls || !data) return;

  const customerCategory = this.formConfig.model?.sale_return_order?.customer?.customer_category?.name?.toLowerCase();

  //  Figure out the current row index safely
  const parentArray = field.parent;
  const currentRowIndex = +parentArray?.key;

  //  Get the rate on that row if it exists
  const currentRowRate = this.formConfig.model?.sale_return_items?.[currentRowIndex]?.rate;

  console.log("Current row rate value : ", currentRowRate);

  let selectedRate = data.sales_rate; // default fallback

  //  Only override if current rate is 0 or empty
  if (!currentRowRate || currentRowRate === 0) {
    if (customerCategory === 'wholesalers') {
      selectedRate = data.wholesale_rate ?? data.sales_rate;
    } else if (customerCategory === 'retail') {
      selectedRate = data.sales_rate;
    } else if (customerCategory === 'e-commerce partners' || customerCategory === 'distributors' || customerCategory === 'e-commerce partners') {
      selectedRate = data.dealer_rate ?? data.sales_rate;
    }
  } else {
    //  Keep the manually entered rate
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

  //--------------------------------------------------------
  getWorkflowId() {
    return this.http.get('sales/workflows/');
  }


  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }


  // Method to handle updating the Sale Return Order
  updateSaleReturnOrder() {
    const customFieldValues = this.formConfig.model['custom_field_values']; // User-entered custom fields

    // Determine the entity type and ID dynamically
    const entityName = 'sale_return'; // Since we're in the Sale Order form
    const customId = this.formConfig.model.sale_return_order?.sale_return_id || null; // Ensure correct sale_order_id

    // Find entity record from list
    const entity = this.entitiesList.find(e => e.entity_name === entityName);

    // if (!entity) {
    //   console.error(`Entity not found for: ${entityName}`);
    //   return;
    // }

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

    //  FIX COLOR + SIZE ISSUE HERE
    if (payload.sale_return_items && Array.isArray(payload.sale_return_items)) {
      payload.sale_return_items = payload.sale_return_items.map(item => {

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

    // PUT request to update Sale Return Order
    this.http.put(`sales/sale_return_order/${this.SaleReturnOrderEditID}/`, payload).subscribe(
      (response) => {
        this.showSuccessToast = true;
        this.toastMessage = "Record updated successfully"; // Set the toast message for update
        this.ngOnInit();
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 3000);
      },
      (error) => {
        console.error('Error updating Sale Return Order:', error);
        // Optionally handle error
      }
    );
  }

  // Modify your edit method to set up the form for editing
  editSaleReturnOrder(event) {
    this.SaleReturnOrderEditID = event;
    this.http.get('sales/sale_return_order/' + event).subscribe((res: any) => {
      if (res && res.data) {
        this.formConfig.model = res.data;
        console.log("Editing starting here", res.data);
        this.formConfig.model['sale_return_order']['order_type'] = 'sale_return';
        this.formConfig.pkId = 'sale_return_id';
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['sale_return_id'] = this.SaleReturnOrderEditID;
        this.showForm = true; // Show form for editing
        // Show necessary fields for editing
        this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[5].hide = false;
        this.formConfig.fields[2].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[6].hide = true;

        this.totalAmountCal() //calling calculation in edit mode.
        // Ensure custom_field_values are correctly populated in the model
        if (res.data.custom_field_values) {
          this.formConfig.model['custom_field_values'] = res.data.custom_field_values.reduce((acc: any, fieldValue: any) => {
            acc[fieldValue.custom_field_id] = fieldValue.field_value; // Map custom_field_id to the corresponding value
            return acc;
          }, {});
        }

        // ---------------------------------------------------
        //  ENSURE SALE RETURN ORDER ALWAYS HAS 5 ITEM ROWS 
        // ---------------------------------------------------
        let items = res.data.sale_return_items ?? [];

        // fill existing rows first, then make sure total is 5
        while (items.length < 5) {
          items.push({
            sale_order_item_id: null,
            product_id: null,
            unit_options_id: null,
            quantity: null,
            rate: null,
            amount: null
          });
        }

        // assign back to form model
        this.formConfig.model['sale_return_items'] = items;

        // finally show form
        this.showForm = true;
      }
    });
    this.hide();
  }

  // Example for how the form submission might trigger the update
  onSubmit() {
    if (this.formConfig.submit.label === 'Update') {
      this.updateSaleReturnOrder(); // Call update on submission
    } else {
      this.submitForm(); // Otherwise, create a new record
    }
  }


  getReturnNo() {
    this.returnNumber = null;
    this.http.get('masters/generate_order_no/?type=SHIP').subscribe((res: any) => {
      if (res && res.data && res.data.order_number) {
        this.formConfig.model['order_shipments']['shipping_tracking_no'] = res.data.order_number;
        
        this.http.get('masters/generate_order_no/?type=SR').subscribe((res: any) => {
          if (res && res.data && res.data.order_number) {
            this.formConfig.model['sale_return_order']['return_no'] = res.data.order_number;
            this.returnNumber = res.data.order_number;
          }
        });;
      }
    });
  }

  showSalesReturnOrderListFn() {
    this.showSaleReturnOrderList = true;
    this.SaleReturnsListComponent?.refreshTable();
  }


  showInvoiceOrdersList() {
    const selectedCustomerId = this.formConfig.model.sale_return_order.customer_id;
    const selectedCustomerName = this.formConfig.model.sale_return_order.customer?.name; // Assuming customer name is nested

    if (!selectedCustomerId) {
      this.noOrdersMessage = 'Please select a customer.'; // Set message for missing customer
      this.customerOrders = []; // Clear any previous orders
      this.openModal(); // Open modal to display the message
      return;
    }

    this.customerOrders = [];
    this.noOrdersMessage = '';

    this.getOrdersByCustomer(selectedCustomerId).pipe(
      switchMap(orders => {
        if (orders.count === 0) {
          this.noOrdersMessage = `No Past orders for ${selectedCustomerName}.`; // Set message for no orders
          this.customerOrders = []; // Ensure orders are cleared
          this.openModal(); // Open modal to display the message
          return [];
        }

        const detailedOrderRequests = orders.data.map(order =>
          this.getOrderDetails(order.sale_invoice_id).pipe(
            tap(orderDetails => {
              order.productsList = orderDetails.data.sale_invoice_items.map(item => ({
                product_id: item.product?.product_id,
                product_name: item.product?.name ?? 'Unknown Product',
                quantity: item.quantity,
                code: item.product?.code,
                total_boxes: item.total_boxes,
                unit_options_id: item.unit_options_id,
                rate: item.rate,
                discount: item.discount,
                amount: item.amount,
                tax: item.tax,
                cgst: item.cgst || 0,
                sgst: item.sgst || 0,
                igst: item.igst || 0,
                remarks: item.remarks
              }));
            })
          )
        );

        return forkJoin(detailedOrderRequests).pipe(
          tap(() => {
            this.customerOrders = orders.data;
            this.openModal(); // Open modal with the orders list
          })
        );
      })
    ).subscribe();
  }

  saleinvoiceordersListModal: any;
  openModal() {
    this.saleinvoiceordersListModal = new bootstrap.Modal(document.getElementById("saleinvoiceordersListModal"));
    this.saleinvoiceordersListModal.show();
    // this.ordersModal.nativeElement.classList.add('show');
    // this.ordersModal.nativeElement.style.display = 'block';
    // document.body.classList.add('modal-open');
    // document.body.style.overflow = 'hidden';
  }

  getOrdersByCustomer(customerId: string): Observable<any> {
    const url = `sales/sale_invoice_order/?customer_id=${customerId}`;
    return this.http.get<any>(url);
  }

  getOrderDetails(invoiceId: string): Observable<any> {
    const url = `sales/sale_invoice_order/${invoiceId}/`;
    return this.http.get<any>(url);
  }
  selectInvoiceOrder(order: any) {
    console.log('Selected Order:', order);
    this.handleInvoiceOrderSelected(order); // Handle order selection
  }

  handleInvoiceOrderSelected(order: any) {
    const saleInvoiceId = order.sale_invoice_id;  // Extract sale_invoice_id from the emitted order
    if (!saleInvoiceId) {
      console.error('Invalid sale_invoice_id:', saleInvoiceId);
      return;
    }

    console.log('Selected Sale Invoice ID:', saleInvoiceId);

    // Fetch sale invoice details using the saleInvoiceId
    this.http.get(`sales/sale_invoice_order/${saleInvoiceId}`).subscribe((res: any) => {
      if (res && res.data) {
        const invoiceData = res.data.sale_invoice_order;
        console.log("Inovice data : ", invoiceData);
        const invoiceItems = res.data.sale_invoice_items;
        console.log("Inovice Items : ", invoiceItems);
        // const invoiceShipments = res.data.order_shipments;

        // Map sale_invoice_order fields to sale_return_order fields
        this.formConfig.model = {
          sale_return_order: {
            bill_type: invoiceData.bill_type,
            order_type: this.formConfig.model.sale_return_order.order_type || 'sale_return',
            return_date: this.nowDate(),
            return_no: this.formConfig.model.sale_return_order.return_no,
            ref_no: invoiceData.ref_no,
            ref_date: invoiceData.ref_date,
            tax: invoiceData.tax,
            remarks: invoiceData.remarks,
            item_value: invoiceData.item_value,
            discount: invoiceData.discount,
            dis_amt: invoiceData.dis_amt,
            taxable: invoiceData.taxable,
            tax_amount: invoiceData.tax_amount,
            cess_amount: invoiceData.cess_amount,
            transport_charges: invoiceData.transport_charges,
            round_off: invoiceData.round_off,
            total_amount: invoiceData.total_amount,
            vehicle_name: invoiceData.vehicle_name,
            total_boxes: invoiceData.total_boxes,
            gst_type: {
              gst_type_id: invoiceData.gst_type?.gst_type_id,
              name: invoiceData.gst_type?.name
            },
            payment_term: {
              payment_term_id: invoiceData.payment_term?.payment_term_id,
              name: invoiceData.payment_term?.name,
              code: invoiceData.payment_term?.code,
            },
            customer: {
              customer_id: invoiceData.customer?.customer_id,
              name: invoiceData.customer?.name
            },
            email: invoiceData.email,
            billing_address: invoiceData.billing_address,
            shipping_address: invoiceData.shipping_address,
          },
          customer_id: invoiceData.customer_id,
          gst_type_id: invoiceData.gst_type_id,
          payment_term_id: invoiceData.payment_term_id,
          sale_return_items: invoiceItems,
          order_attachments: res.data.order_attachments,
          order_shipments: res.data.order_shipments
        };
        // Map sale_invoice_order fields to sale_return_order fields
        this.formConfig.model = {
          sale_return_order: {
            sale_invoice_id: invoiceData.sale_invoice_id,
            bill_type: invoiceData.bill_type,
            order_type: this.formConfig.model.sale_return_order.order_type || 'sale_return',
            return_date: this.nowDate(),
            return_no: this.formConfig.model.sale_return_order.return_no,
            ref_no: invoiceData.ref_no,
            ref_date: invoiceData.ref_date,
            tax: invoiceData.tax,
            remarks: invoiceData.remarks,
            item_value: invoiceData.item_value,
            discount: invoiceData.discount,
            dis_amt: invoiceData.dis_amt,
            taxable: invoiceData.taxable,
            tax_amount: invoiceData.tax_amount,
            cess_amount: invoiceData.cess_amount,
            transport_charges: invoiceData.transport_charges,
            round_off: invoiceData.round_off,
            total_amount: invoiceData.total_amount,
            vehicle_name: invoiceData.vehicle_name,
            total_boxes: invoiceData.total_boxes,
            gst_type: {
              gst_type_id: invoiceData.gst_type?.gst_type_id,
              name: invoiceData.gst_type?.name
            },
            payment_term: {
              payment_term_id: invoiceData.payment_term?.payment_term_id,
              name: invoiceData.payment_term?.name,
              code: invoiceData.payment_term?.code,
            },
            customer: {
              customer_id: invoiceData.customer?.customer_id,
              name: invoiceData.customer?.name
            },
            customer_id: invoiceData.customer_id,
            gst_type_id: invoiceData.gst_type_id,
            payment_term_id: invoiceData.payment_term_id,
            email: invoiceData.email,
            billing_address: invoiceData.billing_address,
            shipping_address: invoiceData.shipping_address,
          },
          sale_return_items: invoiceItems,
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
    this.hideModal(); // Use the hideModal method to remove the modal elements
  }

  handleProductsPulled(products: any[]) {
    let existingProducts = this.formConfig.model['sale_return_items'] || [];

    existingProducts = existingProducts.filter((product: any) => product?.code && product.code.trim() !== "");
    console.log("Products received for pulling:", products);

    if (existingProducts.length === 0) {
      this.formConfig.model['sale_return_items'] = products.map(product => ({
        product: {
          product_id: product.product_id || null,
          name: product.name || '',
          code: product.code || '',
        },
        product_id: product.product_id || null,
        code: product.code || '',
        total_boxes: product.total_boxes || 0,
        unit_options_id: product.unit_options_id,
        quantity: product.quantity || 1,
        rate: product.rate || 0,
        discount: product.discount || 0,
        print_name: product.print_name || product.name || '',
        amount: product.amount || 0,
        tax: product.tax || 0,
        cgst: product.cgst || 0,
        sgst: product.sgst || 0,
        igst: product.igst || 0,
        remarks: product.remarks || null
      }));
    } else {
      products.forEach(newProduct => {
        const existingProductIndex = existingProducts.findIndex((product: any) => product?.code === newProduct?.code);

        if (existingProductIndex === -1) {
          existingProducts.push({
            product: {
              product_id: newProduct.product_id || null,
              name: newProduct.name || '',
              code: newProduct.code || '',
            },
            product_id: newProduct.product_id || null,
            code: newProduct.code || '',
            total_boxes: newProduct.total_boxes || 0,
            unit_options_id: newProduct.unit_options_id,
            quantity: newProduct.quantity || 1,
            rate: newProduct.rate || 0,
            discount: newProduct.discount || 0,
            print_name: newProduct.print_name || newProduct.name || '',
            amount: newProduct.amount || 0,
            tax: newProduct.tax || 0,
            cgst: newProduct.cgst || 0,
            sgst: newProduct.sgst || 0,
            igst: newProduct.igst || 0,
            remarks: newProduct.remarks || null
          });
        } else {
          existingProducts[existingProductIndex] = {
            ...existingProducts[existingProductIndex],
            ...newProduct,
            remarks:
              newProduct.remarks !== undefined
                ? newProduct.remarks
                : existingProducts[existingProductIndex].remarks ?? null,
            product: {
              product_id: newProduct.product_id || existingProducts[existingProductIndex].product.product_id,
              name: newProduct.name || existingProducts[existingProductIndex].product.name,
              code: newProduct.code || existingProducts[existingProductIndex].product.code,
            }
          };
        }
      });

      this.formConfig.model['sale_return_items'] = [...existingProducts];
    }

    this.formConfig.model = { ...this.formConfig.model };

    this.cdRef.detectChanges();

    console.log("Final Products List:", this.formConfig.model['sale_return_items']);
    this.hideModal();
  }



  hideModal() {
    this.saleinvoiceordersListModal.hide();

    // const modalBackdrop = document.querySelector('.modal-backdrop');
    // if (modalBackdrop) {
    //   modalBackdrop.remove();
    // }
    // this.ordersModal.nativeElement.classList.remove('show');
    // this.ordersModal.nativeElement.style.display = 'none';
    // document.body.classList.remove('modal-open');
    // document.body.style.overflow = '';
  }

  ngOnDestroy() {
    // Ensure modals are disposed of correctly
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }

  setFormConfig() {
    this.SaleReturnOrderEditID = null;

    this.formConfig = {
      // url: "sales/sale_return_order/",
      title: '',
      formState: {
        viewMode: false
      },
      showActionBtn: true,
      exParams: [
        {
          key: 'sale_return_items',
          type: 'script',
          value: 'data.sale_return_items.map(m=> {m.product_id = m.product.product_id;  return m ;})'
        },
        {
          key: 'sale_return_items',
          type: 'script',
          value: 'data.sale_return_items.map(m=> {m.size_id = m.size.size_id;  return m ;})'
        },
        {
          key: 'sale_return_items',
          type: 'script',
          value: 'data.sale_return_items.map(m=> {m.color_id = m.color.color_id;  return m ;})'
        }
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => this.onSubmit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model: {
        sale_return_order: {},
        sale_return_items: [{}, {}, {}, {}, {}],
        order_attachments: [],
        order_shipments: {},
        custom_field_values: []
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block row ms-0",
          key: 'sale_return_order',
          fieldGroup: [
            {
              className: 'col-lg-9 col-md-8 col-12 p-0',
              fieldGroupClassName: "ant-row mx-0 row align-items-end mt-2",
              fieldGroup: [
                {
                  key: 'bill_type',
                  type: 'select',
                  // defaultValue: 'Exclusive',
                  className: 'col-md-4 col-sm-6 col-12',
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_order.bill_type && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.sale_return_order.bill_type);
                      } else {
                        // If no data to populate, set 'CASH' as default
                        field.formControl.setValue('CASH');
                      }
                    }
                  }
                },
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
                          this.formConfig.model['sale_return_order']['customer_id'] = data.customer_id;
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_order.customer && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.sale_return_order.customer);
                      }
                    }
                  }
                },
                {
                  key: 'return_no',
                  type: 'input',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Return No',
                    placeholder: 'Enter Return No',
                    required: true,
                    readonly: true,
                    // disabled: true
                  },
                },
                {
                  key: 'return_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'date',
                    label: 'Return Date',
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
                    required: true,
                    readonly: false
                  }
                },
                {
                  key: 'against_bill_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'date',
                    label: 'Against bill date',
                    placeholder: 'Select Against bill date',
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_order.ref_no && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.sale_return_order.ref_no);
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
                //     required: false,
                //     options: [
                //       { 'label': "Inclusive", value: 'Inclusive' },
                //       { 'label': "Exclusive", value: 'Exclusive' }
                //     ]
                //   },
                //   hooks: {
                //     onInit: (field: any) => {
                //       if (this.dataToPopulate && this.dataToPopulate.sale_return_order.tax && field.formControl) {
                //         field.formControl.setValue(this.dataToPopulate.sale_return_order.tax);
                //       }
                //     }
                //   }
                // },
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_order.tax && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.sale_return_order.tax);
                      }
                      else {
                        // Set default value to 'Exclusive'
                        field.formControl.setValue('Exclusive');
                      }
                    }
                  }
                },
                {
                  key: 'against_bill',
                  type: 'input',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'input',
                    label: 'Against bill',
                    placeholder: 'Enter Against bill',
                    required: true
                  }
                },
                {
                  key: 'return_option',
                  type: 'select',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Return Option',
                    dataKey: 'return_option_id',
                    dataLabel: 'name',
                    required: true,
                    options: [],
                    lazy: {
                      url: 'masters/return_options/',
                      lazyOneTime: true
                    }
                  },
                  hooks: {
                    onChanges: (field: any) => {
                      field.formControl.valueChanges.subscribe((data: any) => {
                        if (data && data.return_option_id) {
                          this.formConfig.model['sale_return_order']['return_option_id'] = data.return_option_id;
                        }
                      });
                    }
                  }
                },
                {
                  key: 'return_reason',
                  type: 'textarea',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Return Reason',
                    placeholder: 'Enter Return Reason',
                    required: true,
                  }
                },
                // {
                //   key: 'remarks',
                //   type: 'textarea',
                //   className: 'col-4',
                //   templateOptions: {
                //     label: 'Remarks',
                //     placeholder: 'Enter Remarks',
                //   },
                //   hooks: {
                //     onInit: (field: any) => {
                //       if (this.dataToPopulate && this.dataToPopulate.sale_return_order.remarks && field.formControl) {
                //         field.formControl.setValue(this.dataToPopulate.sale_return_order.remarks);
                //       }
                //     }
                //   }
                // },
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
                    label: 'Discount Amount',
                    required: false
                  },
                  defaultValue: '0.00',
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
          key: 'sale_return_items',
          type: 'repeat',
          className: 'custom-form-list product-table',
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
                  'templateOptions.hidden': () => !(this.SaleInvoiceEditID),
                  'templateOptions.disabled': (model) => model.invoiced === 'YES' || !this.SaleInvoiceEditID
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
                  placeholder: 'product',
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
                    const existingProduct = this.dataToPopulate?.sale_return_items?.[currentRowIndex]?.product;
                    if (existingProduct) {
                      field.formControl.setValue(existingProduct);
                    }
              
                    this.loadProductVariations(field);
              
                    // Subscribe to value changes (to update sizes dynamically)
                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (!this.formConfig.model['sale_return_items'][currentRowIndex]) {
                        console.error(`Products at index ${currentRowIndex} is not defined. Initializing...`);
                        this.formConfig.model['sale_return_items'][currentRowIndex] = {};
                      }
                      this.formConfig.model['sale_return_items'][currentRowIndex]['product_id'] = data?.product_id;

                      const currentItem = this.formConfig.model['sale_return_items'][currentRowIndex];
                      currentItem['product_id'] = data?.product_id;

                      //  Store gst_input from product summary
                      currentItem['gst_input'] = data?.gst_input || 0;
                      this.loadProductVariations(field);
                      this.autoFillProductDetails(field, data); // to fill the remaining fields when product is selected.
                    });

                    // Product Info Text code
                    field.formControl.valueChanges.subscribe( async selectedProductId => {
                      const unit = getUnitData(selectedProductId);
                      const row = this.formConfig.model.sale_return_items[currentRowIndex];
                      displayInformation(row.product, null , null, unit, '', ''); 
                      console.log('executed from product info text code');                         
                    }); // end of product info text code
                  }
                }
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingName = this.dataToPopulate.sale_return_items[currentRowIndex].print_name;

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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingCode = this.dataToPopulate.sale_return_items[currentRowIndex].product?.code;

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
                    const saleOrderItems = this.dataToPopulate?.sale_return_items?.[currentRowIndex];
                    
                    // Populate existing size if available
                    const existingSize = saleOrderItems?.size;
                    if (existingSize?.size_id) {
                      field.formControl.setValue(existingSize);
                    }

                    // Subscribe to value changes (Merged from onInit & onChanges)
                    field.formControl.valueChanges.subscribe((selectedSize: any) => {
                      const product = this.formConfig.model.sale_return_items[currentRowIndex]?.product;
                      if (!product?.product_id) {
                        console.warn(`Product missing for row ${currentRowIndex}, skipping color fetch.`);
                        return;
                      }
                      this.formConfig.model['sale_return_items'][currentRowIndex]['size_id'] = selectedSize?.size_id;
              
                      const size_id = selectedSize?.size_id || null;
                      const url = size_id
                        ? `products/product_variations/?product_id=${product.product_id}&size_id=${size_id}`
                        : `products/product_variations/?product_id=${product.product_id}&size_isnull=True`;
              
                      // Fetch available colors based on the selected size
                      this.http.get(url).subscribe((response: any) => {
                        if (response.data.length > 0) {
                          const sizeCount = sumQuantities(response);
                          const unit = getUnitData(product);
                          displayInformation(product, selectedSize, null, unit, sizeCount, '');
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
                    const saleOrderItems = this.dataToPopulate?.sale_return_items?.[currentRowIndex];
                    const row = this.formConfig.model.sale_return_items[currentRowIndex];
              
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

                      this.formConfig.model['sale_return_items'][currentRowIndex]['color_id'] = selectedColor?.color_id;
              
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
                            const colorCount = sumQuantities(response);
                            console.log('Color count:', colorCount);
                            displayInformation(row.product, row.size, selectedColor, '', '', colorCount);
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingBox = this.dataToPopulate.sale_return_items[currentRowIndex].total_boxes;

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
                key: 'quantity',
                // defaultValue: 1,
                templateOptions: {
                  type: 'number',
                  label: 'Qty',
                  placeholder: 'Qty',
                  min: 1,
                  hideLabel: true,
                  required: false,
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;

                    // Check if parentArray exists and proceed
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key; // Simplified number conversion

                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingQuan = this.dataToPopulate.sale_return_items[currentRowIndex].quantity;

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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingPrice = this.dataToPopulate.sale_return_items[currentRowIndex].rate;

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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingDisc = this.dataToPopulate.sale_return_items[currentRowIndex].discount;

                        // Set the full product object instead of just the product_id
                        if (existingDisc) {
                          field.formControl.setValue(existingDisc); // Set full product object (not just product_id)
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingAmount = this.dataToPopulate.sale_return_items[currentRowIndex].amount;

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
                type: 'select',
                key: 'unit_options_id',
                templateOptions: {
                  label: 'Unit',
                  placeholder: 'Unit',
                  hideLabel: true,
                  dataLabel: 'unit_name',
                  dataKey: 'unit_options_id',
                  bindId: true,
                  required: false,
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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingUnit = this.dataToPopulate.sale_return_items[currentRowIndex].product.unit_options;

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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingtax = this.dataToPopulate.sale_return_items[currentRowIndex].tax;

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
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingRemarks = this.dataToPopulate.sale_return_items[currentRowIndex].remarks;

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
                          key: 'sale_return_order',
                          fieldGroup: [
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
                            //       if (this.dataToPopulate && this.dataToPopulate.sale_return_order && this.dataToPopulate.sale_return_order.tax_amount && field.formControl) {
                            //         field.formControl.setValue(this.dataToPopulate.sale_return_order.tax_amount);
                            //       }
                            //       field.formControl.valueChanges.subscribe(data => {
                            //         this.totalAmountCal();
                            //       })
                            //     }
                            //   }
                            // },
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
                                    this.dataToPopulate.sale_return_order &&
                                    this.dataToPopulate.sale_return_order.tax_amount &&
                                    field.formControl
                                  ) {
                                    field.formControl.setValue(this.dataToPopulate.sale_return_order.tax_amount);
                                  }
                            
                                  // Store initial tax_amount as a float value
                                  let previousTaxAmount = parseFloat(this.dataToPopulate?.sale_return_order?.tax_amount || "0");
                            
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order && this.dataToPopulate.sale_return_order.cess_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_return_order.cess_amount);
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order && this.dataToPopulate.sale_return_order.taxable && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_return_order.taxable);
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
                                      this.formConfig.model['sale_return_order']['gst_type_id'] = data.gst_type_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order.gst_type && field.formControl) {
                                    const GstFiled = this.dataToPopulate.sale_return_order.gst_type
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
                                      this.formConfig.model['sale_return_order']['payment_term_id'] = data.payment_term_id;
                                    }
                                  });
                                  // Set the default value for Ledger Account if it exists
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order.payment_term && field.formControl) {
                                    const PaymentField = this.dataToPopulate.sale_return_order.payment_term
                                    field.formControl.setValue(PaymentField);
                                  }
                                }
                              }
                            },
                            // {
                            //   key: 'ledger_account',
                            //   type: 'select',
                            //   className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                            //   templateOptions: {
                            //     label: 'Ledger account',
                            //     placeholder: 'Select Ledger account',
                            //     dataKey: 'ledger_account_id', // Assuming ledger_account_id is the key for the selected value
                            //     dataLabel: 'name',
                            //     lazy: {
                            //       url: 'customers/ledger_accounts/',
                            //       lazyOneTime: true
                            //     }
                            //   },
                            //   hooks: {
                            //     onInit: (field: any) => {
                            //       // Subscribe to value changes
                            //       field.formControl.valueChanges.subscribe(data => {
                            //         if (data && data.ledger_account_id) {
                            //           this.formConfig.model['sale_return_order']['ledger_account_id'] = data.ledger_account_id; // Update the model with the selected ledger_account_id
                            //         }
                            //       });
                            //       // Set the default value for Ledger Account if it exists
                            //       if (this.dataToPopulate && this.dataToPopulate.sale_return_order.ledger_account && field.formControl) {
                            //         const LedgerField = this.dataToPopulate.sale_return_order.ledger_account
                            //         field.formControl.setValue(LedgerField);
                            //       }
                            //     }
                            //   }
                            // },
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
                                  hide: '!model.sale_return_order_id',
                                },
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    //console.log("ledger_account", data);
                                    if (data && data.order_status_id) {
                                      this.formConfig.model['sale_return_order']['order_status_id'] = data.order_status_id;
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
                                readonly: true
                                // required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order && this.dataToPopulate.sale_return_order.item_value && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_return_order.item_value);
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
                                readonly: false
                                // required: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order && this.dataToPopulate.sale_return_order.dis_amt && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_return_order.dis_amt);
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
                                type: 'input',
                                label: 'Total amount',
                                placeholder: 'Enter Total amount',
                                readonly: true
                              },
                              hooks: {
                                onInit: (field: any) => {
                                  // Set the initial value from dataToPopulate if available
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order && this.dataToPopulate.sale_return_order.total_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_return_order.total_amount);
                                  }
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
                  key: 'sale_return_order',
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
                          if (this.dataToPopulate && this.dataToPopulate.sale_return_order.email && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.sale_return_order.email);
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
                          if (this.dataToPopulate && this.dataToPopulate.sale_return_order.billing_address && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.sale_return_order.billing_address);
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
                          if (this.dataToPopulate && this.dataToPopulate.sale_return_order.shipping_address && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.sale_return_order.shipping_address);
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
    };
  }
  //========================================
  showSuccessToast = false;
  toastMessage = '';
  showDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'flex'; // Show the dialog
    }
  }

  closeToast() {
    this.showSuccessToast = false;
  }
  customFieldMetadata: any = {};
  submitForm() {
    const customFieldValues = this.formConfig.model['custom_field_values']

    // Determine the entity type and ID dynamically
    const entityName = 'sale_return'; // Since we're in the Sale Order form
    const customId = this.formConfig.model.sale_return_order?.sale_return_id || null; // Ensure correct sale_order_id

    // Find entity record from list
    const entity = this.entitiesList.find(e => e.entity_name === entityName);

    // if (!entity) {
    //   console.error(`Entity not found for: ${entityName}`);
    //   return;
    // }

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
    // // Prepare the payload for Sale Return Order creation
    // const saleReturnPayload = {
    //   sale_return_order: this.formConfig.model.sale_return_order,
    //   sale_return_items: this.formConfig.model.sale_return_items,
    //   order_attachments: this.formConfig.model.order_attachments,  // Attachments if applicable
    //   order_shipments: this.formConfig.model.order_shipments,      // Shipment info if applicable
    // };
    // Construct the final payload
    const payload = {
      ...this.formConfig.model,
      // custom_field: customFieldsPayload.custom_field, // Dictionary of custom fields
      custom_field_values: customFieldsPayload.custom_field_values // Array of custom field values
    };
    console.log("Response of payload in returns : ", payload);
    // First, create the Sale Return record
    this.http.post('sales/sale_return_order/', payload).subscribe(
      (response: any) => {
        // this.showSuccessToast = true;
        // this.toastMessage = 'Record created successfully';
        // this.ngOnInit();
        // setTimeout(() => {
        //   this.showSuccessToast = false;
        // }, 3000);
        const sale_return_id = response?.data?.sale_return_order?.sale_return_id; // Get the sale_return_id from the response


        if (sale_return_id) {
          // console.log('Sale Return created successfully. ID:', sale_return_id);
          // this.showSuccessToast = true;
          //   this.toastMessage = 'Record created successfully';
          //   this.ngOnInit();
          //   setTimeout(() => {
          //     this.showSuccessToast = false;
          //   }, 3000);

          // Now based on the return_option, create the respective entity
          const returnOption = this.formConfig.model.sale_return_order.return_option.name;
          console.log("name of the return option : ", returnOption)

          // Create Sale Order, Credit Note, or Debit Note based on the selection
          if (returnOption === 'Credit Note') {
            this.createCreditNote(sale_return_id);
          } else if (returnOption === 'Sale Order') {
            this.createSaleOrder(sale_return_id);
          } else if (returnOption === 'Cash') {
            this.showSuccessToast = true;
            this.toastMessage = 'Record created successfully';
            this.ngOnInit();
            setTimeout(() => {
              this.showSuccessToast = false;
            }, 3000);
          } 
        }
      },
      (error) => {
        console.error('Error creating Sale Return:', error);
      }
    );
  }

  // Function to create Sale Order using the sale_return_id
  createSaleOrder(sale_return_id: string) {
    console.log("We entered into method sale order ...");
    const SaleOrderpayload = this.formConfig.model.sale_return_order;
    const SaleOrderItems = this.formConfig.model.sale_return_items;
    const OrderAttachments = this.formConfig.model.order_attachments;
    const OrderShippments = this.formConfig.model.order_shipments;

    console.log("data in sale order customer : ", this.formConfig.model.sale_return_order.customer_id);

    // Fetch sale_type_id for 'Other'
    this.http.get<any>('masters/sale_types/?name=Advance Order').subscribe((saleTypeResponse) => {
      const saleType = saleTypeResponse?.data[0];
      console.log("saleType : ", saleType)

      if (!saleType || !saleType.sale_type_id) {
        console.error('Sale type "Advance Order" not found.');
        return;
      }

      // Now fetch workflow ID
      this.getWorkflowId().subscribe((response: any) => {
        console.log("Workflow_id data : ", response);
        const workflowData = response?.data;
        let workflow_id = null;

        if (workflowData && workflowData.length > 0) {
          workflow_id = workflowData[0].workflow_id;
        }

        const saleOrderPayload = {
          sale_order: {
            sale_type_id: saleType.sale_type_id, // dynamically inserted here
            email: SaleOrderpayload.email,
            sale_return_id: sale_return_id,
            order_type: SaleOrderpayload.order_type || 'sale_order',
            delivery_date: this.nowDate(),
            order_date: this.nowDate(),
            ref_no: SaleOrderpayload.ref_no,
            ref_date: SaleOrderpayload.ref_date || this.nowDate(),
            tax: SaleOrderpayload.tax || 'Inclusive',
            remarks: SaleOrderpayload.remarks,
            item_value: SaleOrderpayload.item_value,
            discount: SaleOrderpayload.discount,
            dis_amt: SaleOrderpayload.dis_amt,
            taxable: SaleOrderpayload.taxable,
            tax_amount: SaleOrderpayload.tax_amount,
            cess_amount: SaleOrderpayload.cess_amount,
            advance_amount: 0.00,
            transport_charges: SaleOrderpayload.transport_charges,
            round_off: SaleOrderpayload.round_off,
            total_amount: SaleOrderpayload.total_amount,
            vehicle_name: SaleOrderpayload.vehicle_name,
            total_boxes: SaleOrderpayload.total_boxes,
            shipping_address: SaleOrderpayload.shipping_address,
            billing_address: SaleOrderpayload.billing_address,
            customer_id: SaleOrderpayload.customer_id,
            gst_type_id: SaleOrderpayload.gst_type_id,
            payment_term_id: SaleOrderpayload.payment_term_id,
            payment_link_type_id: SaleOrderpayload.payment_link_type_id,
            workflow_id: workflow_id,
          },
          sale_order_items: SaleOrderItems.map(item => ({
            quantity: parseInt(item.quantity),
            unit_price: item.unit_price,
            rate: item.rate,
            amount: item.rate,
            total_boxes: item.total_boxes,
            discount_percentage: item.discount_percentage,
            discount: item.discount,
            dis_amt: item.dis_amt,
            tax: item.tax || '',
            print_name: item.print_name,
            remarks: item.remarks,
            tax_rate: item.tax_rate,
            unit_options_id: item.unit_options_id,
            product_id: item.product_id,
            size_id: item.size_id,
            color_id: item.color_id
          })),
          order_attachments: OrderAttachments,
          order_shipments: OrderShippments
        };

        console.log("Sale order payload : ", saleOrderPayload);

        this.http.post('sales/sale_order/', saleOrderPayload).subscribe(
          (response) => {
            this.showSuccessToast = true;
            this.toastMessage = 'Sale-Return & Sale-Order created successfully';
            this.ngOnInit();
            setTimeout(() => {
              this.showSuccessToast = false;
            }, 3000);
          },
          (error) => {
            console.error('Error creating Sale Order:', error);
          }
        );
      });

      this.ngOnInit(); // remains as is
    });
  }

  // createSaleOrder(sale_return_id: string) {
  //   console.log("We entered into method sale order ...");
  //   const SaleOrderpayload = this.formConfig.model.sale_return_order
  //   const SaleOrderItems = this.formConfig.model.sale_return_items
  //   const OrderAttachments = this.formConfig.model.order_attachments
  //   const OrderShippments = this.formConfig.model.order_shipments
  //   console.log("data in sale order customer : ", this.formConfig.model.sale_return_order.customer_id);
  //   // Fetch workflow ID from API
  //   this.getWorkflowId().subscribe((response: any) => {
  //     console.log("Workflow_id data : ", response);
  //     const workflowData = response?.data;
  //     let workflow_id = null; // Initialize workflow_id

  //     if (workflowData && workflowData.length > 0) {
  //       workflow_id = workflowData[0].workflow_id; // Get the workflow_id
  //     }

  //     const saleOrderPayload = {
  //       sale_order: {
  //         sale_type_id: 'Other',
  //         email: SaleOrderpayload.email,
  //         sale_return_id: sale_return_id,
  //         order_type: SaleOrderpayload.order_type || 'sale_order',
  //         delivery_date: this.nowDate(),
  //         order_date: this.nowDate(),
  //         ref_no: SaleOrderpayload.ref_no,
  //         ref_date: SaleOrderpayload.ref_date || this.nowDate(),
  //         tax: SaleOrderpayload.tax || 'Inclusive',
  //         remarks: SaleOrderpayload.remarks,
  //         // advance_amount: SaleOrderpayload.advance_amount,
  //         item_value: SaleOrderpayload.item_value,
  //         discount: SaleOrderpayload.discount,
  //         dis_amt: SaleOrderpayload.dis_amt,
  //         taxable: SaleOrderpayload.taxable,
  //         tax_amount: SaleOrderpayload.tax_amount,
  //         cess_amount: SaleOrderpayload.cess_amount,
  //         advance_amount: 0.00,
  //         transport_charges: SaleOrderpayload.transport_charges,
  //         round_off: SaleOrderpayload.round_off,
  //         total_amount: SaleOrderpayload.total_amount,
  //         vehicle_name: SaleOrderpayload.vehicle_name,
  //         total_boxes: SaleOrderpayload.total_boxes,
  //         shipping_address: SaleOrderpayload.shipping_address,
  //         billing_address: SaleOrderpayload.billing_address,
  //         customer_id: SaleOrderpayload.customer_id,
  //         gst_type_id: SaleOrderpayload.gst_type_id,
  //         payment_term_id: SaleOrderpayload.payment_term_id,
  //         payment_link_type_id: SaleOrderpayload.payment_link_type_id,
  //         workflow_id: workflow_id, // Add workflow_id to payload
  //       },
  //       sale_order_items: SaleOrderItems.map(item => ({
  //         quantity: parseInt(item.quantity),
  //         unit_price: item.unit_price,
  //         rate: item.rate,
  //         amount: item.rate,
  //         total_boxes: item.total_boxes,
  //         discount_percentage: item.discount_percentage,
  //         discount: item.discount,
  //         dis_amt: item.dis_amt,
  //         tax: item.tax || '',
  //         print_name: item.print_name,
  //         remarks: item.remarks,
  //         tax_rate: item.tax_rate,
  //         unit_options_id: item.unit_options_id,
  //         product_id: item.product_id,
  //         size_id: item.size_id,
  //         color_id: item.color_id
  //       })),
  //       order_attachments: OrderAttachments,
  //       order_shipments: OrderShippments
  //     };

  //     console.log("Sale order payload : ", saleOrderPayload);

  //     // POST request to create Sale Order
  //     this.http.post('sales/sale_order/', saleOrderPayload).subscribe(
  //       (response) => {
  //         // console.log("response sale order : ", response);
  //         this.showSuccessToast = true;
  //         this.toastMessage = 'Sale-Return & Sale-Order created successfully';
  //         this.ngOnInit();
  //         setTimeout(() => {
  //           this.showSuccessToast = false;
  //         }, 3000);
  //       },
  //       (error) => {
  //         console.error('Error creating Sale Order:', error);
  //       }
  //     );
  //   });
  //   this.ngOnInit();
  // }


  // Function to create Credit Note using the sale_return_id
  createCreditNote(sale_return_id: string) {
    const creditNotePayload = {
      sale_credit_note: {
        customer_id: this.formConfig.model.sale_return_order.customer_id,
        sale_invoice_id: this.formConfig.model.sale_return_order.sale_invoice_id,
        sale_return_id: sale_return_id,
        total_amount: this.formConfig.model.sale_return_order.total_amount,
        reason: this.formConfig.model.sale_return_order.return_reason,
        order_status_id: this.formConfig.model.sale_return_order.order_status_id,
        credit_date: this.nowDate()
      },
      sale_credit_note_items: this.formConfig.model.sale_return_items.map(item => ({
        quantity: item.quantity,
        price_per_unit: item.rate,
        total_price: item.amount,
        product_id: item.product_id
      })),
    };

    // POST request to create Credit Note
    this.http.post('sales/sale_credit_notes/', creditNotePayload).subscribe(
      (response) => {
        this.showSuccessToast = true;
        this.toastMessage = 'Sale-returns & Credit-Note created successfully';
        this.ngOnInit();
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 3000);
      },
      (error) => {
        console.error('Error creating Credit Note:', error);
      }
    );

    this.ngOnInit();
  }

//===============================================

  totalAmountCal() {
    calculateTotalAmount(this.formConfig.model, 'sale_return_items', this.salereturnForm?.form);
  }

}