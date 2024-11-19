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
  ) {}

  dataToPopulate: any;
  salesReturnForm: FormGroup;

  ngOnInit() {

    this.showSaleReturnOrderList = false;
    this.showForm = false;
    this.SaleReturnOrderEditID = null;
    this.setFormConfig();
    this.checkAndPopulateData();

    this.formConfig.model['sale_return_order']['order_type'] = 'sale_return';

    this.getReturnNo();
    this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[2].hide = true;
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
  
//--------------------------------------------------------
  getWorkflowId() {
    return this.http.get('http://195.35.20.172:8000/api/v1/sales/workflows/');
  }


  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  }


  // Method to handle updating the Sale Return Order
  updateSaleReturnOrder() {
    const saleReturnId = this.formConfig.model.sale_return_order.sale_return_id;
    console.log("Sale return id in edit : ", saleReturnId);
    const saleReturnPayload = {
      sale_return_order: this.formConfig.model.sale_return_order,
      sale_return_items: this.formConfig.model.sale_return_items,
      order_attachments: this.formConfig.model.order_attachments,  // Attachments if applicable
      order_shipments: this.formConfig.model.order_shipments,      // Shipment info if applicable
    };

    // PUT request to update Sale Return Order
    this.http.put(`sales/sale_return_order/${saleReturnId}/`, saleReturnPayload).subscribe(
      (response) => {
        console.log('Sale Return Order updated successfully', response);
        // Optionally handle success, e.g., reset the form or navigate
        this.ngOnInit(); // Hide form after successful update
        // this.loadSaleReturnOrders(); // Refresh the list if necessary
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
        this.formConfig.fields[2].fieldGroup[1].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[2].hide = false;
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

  openModal() {
    this.ordersModal.nativeElement.classList.add('show');
    this.ordersModal.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
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
        remarks: product.remarks || ''
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
            remarks: newProduct.remarks || ''
          });
        } else {
          existingProducts[existingProductIndex] = {
            ...existingProducts[existingProductIndex],
            ...newProduct,
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
        sale_return_items: [{}],
        order_attachments: [],
        order_shipments: {}
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'sale_return_order',
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
                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order.bill_type && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_return_order.bill_type);
                  }
                }
              }
            },
            {
              key: 'customer',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Customer',
                dataKey: 'name',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'customers/customers/?summary=true',
                  lazyOneTime: true
                },
                required: true,

              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe(data => {
                    // console.log("vendors", data);
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
                  // Populate customer from sale_return_order
                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order?.customer) {
                    field.formControl.setValue(this.dataToPopulate.sale_return_order.customer);
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
                placeholder: 'Enter Email',
              }, 
              // hooks: {
              //   onInit: (field: any) => {
              //     if (this.dataToPopulate && this.dataToPopulate.sale_return_order.email && field.formControl) {
              //       field.formControl.setValue(this.dataToPopulate.sale_return_order.email);
              //     }
              //   }
              // }
            },
            {
              key: 'return_no',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                label: 'Return No',
                placeholder: 'Enter Return No',
                required: true,
                readonly: true,
                // disabled: true
              },
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
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    // console.log("order_type", data);
                    if (data && data.order_salesman_id) {
                      this.formConfig.model['sale_return_order']['order_salesman_id'] = data.order_salesman_id;
                    }
                  });
                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order?.orders_salesman) {
                    field.formControl.setValue(this.dataToPopulate.sale_return_order.orders_salesman);
                  }
                }
              }
            },
            {
              key: 'return_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Return Date',
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
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order.ref_no && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_return_order.ref_no);
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
                placeholder: 'Select Ref Date',
              }
            },
            {
              key: 'against_bill',
              type: 'input',
              className: 'col-2',
              templateOptions: {
                type: 'input',
                label: 'Against bill',
                placeholder: 'Enter Against bill',
                required: true
              }
            },
            {
              key: 'against_bill_date',
              type: 'date',
              defaultValue: this.nowDate(),
              className: 'col-2',
              templateOptions: {
                type: 'date',
                label: 'Against bill date',
                placeholder: 'Select Against bill date',
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
                placeholder: 'Select Due Date',
                readonly: true
              }
            },
            {
              key: 'payment_link_type',
              type: 'select',
              className: 'col-2',
              templateOptions: {
                label: 'Payment link type',
                dataKey: 'payment_link_type_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'masters/payment_link_type/',
                  lazyOneTime: false
                }
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    // console.log("order_type", data);
                    if (data && data.payment_link_type_id) {
                      this.formConfig.model['sale_return_order']['payment_link_type_id'] = data.payment_link_type_id;
                    }
                  });
                }
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
                ],
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order.tax && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_return_order.tax);
                  }
                }
              }
            },
            {
              key: 'return_option',
              type: 'select',
              className: 'col-4',
              templateOptions: {
                label: 'Return Option',
                dataKey: 'return_option_id',
                dataLabel: 'name',
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
              key: 'remarks',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Remarks',
                placeholder: 'Enter Remarks',
              },
              hooks: {
                onInit: (field: any) => {
                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order.remarks && field.formControl) {
                    field.formControl.setValue(this.dataToPopulate.sale_return_order.remarks);
                  }
                }
              }
            },
            {
              key: 'return_reason',
              type: 'textarea',
              className: 'col-12',
              templateOptions: {
                label: 'Return Reason',
                placeholder: 'Enter Return Reason',
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
              // hooks: {
              //   onInit: (field: any) => {
              //     if (this.dataToPopulate && this.dataToPopulate.sale_return_order.billing_address && field.formControl) {
              //       field.formControl.setValue(this.dataToPopulate.sale_return_order.billing_address);
              //     }
              //   }
              // }
            },
            {
              key: 'shipping_address',
              type: 'textarea',
              className: 'col-6',
              templateOptions: {
                label: 'Shipping Address',
                placeholder: 'Enter Shipping Address',
              },
              // hooks: {
              //   onInit: (field: any) => {
              //     if (this.dataToPopulate && this.dataToPopulate.sale_return_order.shipping_address && field.formControl) {
              //       field.formControl.setValue(this.dataToPopulate.sale_return_order.shipping_address);
              //     }
              //   }
              // }
            }
          ]
        },
        {
          key: 'sale_return_items',
          type: 'table',
          className: 'custom-form-list',
          templateOptions: {
            // title: 'Products',
            addText: 'Add Product',
            tableCols: [
              { name: 'product', label: 'Product' },
              { name: 'size', label: 'size' },
              { name: 'color', label: 'color' },              
              { name: 'code', label: 'Code' },
              { name: 'unit', label: 'Unit' },
              { name: 'total_boxes', label: 'Total Boxes' },
              { name: 'quantity', label: 'Quantity' },
              { name: 'amount', label: 'Price' },
              { name: 'rate', label: 'Rate' },
              { name: 'discount', label: 'Discount' }
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
                    if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                      const existingProduct = this.dataToPopulate.sale_return_items[currentRowIndex].product;
                      
                      // Set the full product object instead of just the product_id
                      if (existingProduct) {
                        field.formControl.setValue(existingProduct); // Set full product object (not just product_id)
                      }
                    }

                    // ***Size dropdown will populate with available sizes when product in selected***
                    field.formControl.valueChanges.subscribe(selectedSizeId => {
                      const product = this.formConfig.model.sale_return_items[currentRowIndex]?.product;
                      
                      // Make sure product exists before making HTTP request
                      if (product?.product_id) {
                        this.http.get(`products/product_variations/?product_id=${product.product_id}`).subscribe((response: any) => {
                          const availableSizes = response.data.map((variation: any) => {
                            return {
                              label: variation.size.size_name,  // Use 'size_name' as the label
                              value: {
                                size_id: variation.size.size_id,
                                size_name: variation.size.size_name,
                              }
                            };
                          });
            
                          // Use a Set to track seen size_ids to ensure unique sizes
                          const uniqueArray = availableSizes.filter((item, index, self) =>
                            index === self.findIndex((t) => t.value.size_id === item.value.size_id)
                          );
            
                          // Now, update the size field for the current row, not globally
                          const sizeField = parentArray.fieldGroup.find((f: any) => f.key === 'size');
                          if (sizeField) {
                            sizeField.templateOptions.options = uniqueArray; // Update the options for the 'size' field of the current row
                          }
                        });
                      } else {
                        console.error('Product not selected or invalid.');
                      }
                    });
                    
                    // Subscribe to value changes of the field
                    field.formControl.valueChanges.subscribe(selectedProductId => {
                      const product = this.formConfig.model.sale_return_items[currentRowIndex]?.product;

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
              // {
              //   key: 'size',
              //   type: 'select',
              //   templateOptions: {
              //     label: 'Select Size',
              //     dataKey: 'size_id',
              //     hideLabel: true,
              //     dataLabel: 'size_name',
              //     options: [],
              //     required: true,
              //     lazy: {
              //       url: 'products/sizes/',
              //       lazyOneTime: true
              //     }
              //   },
              // },
              // {
              //   key: 'color',
              //   type: 'select',
              //   templateOptions: {
              //     label: 'Select Color',
              //     dataKey: 'color_id',
              //     hideLabel: true,
              //     dataLabel: 'color_name',
              //     options: [],
              //     required: true,
              //     lazy: {
              //       url: 'products/colors/',
              //       lazyOneTime: true
              //     }
              //   },
              // },
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
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
              
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key;

                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingSize = this.dataToPopulate.sale_return_items[currentRowIndex].size;
                        
                        // Set the full product object instead of just the product_id
                        if (existingSize && existingSize.size_id) {
                          field.formControl.setValue(existingSize); // Set full product object (not just product_id)
                        }
                      }

                      // Subscribe to value changes when the form field changes
                      //**When Size is selected its overall  quantity will be shown in product info text area*/
                      field.formControl.valueChanges.subscribe(selectedProductId => {
                        const product = this.formConfig.model.sale_return_items[currentRowIndex]?.product;
                        const size = this.formConfig.model.sale_return_items[currentRowIndex]?.size;
            
                        const product_id = product?.product_id;
                        const size_id = size?.size_id;
            
                        // Check if product_id, size_id, and color_id exist
                        if (product_id && size_id) {
                          const url = `products/product_variations/?product_id=${product_id}&size_id=${size_id}`;
            
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
                              if (cardWrapper) {
                                // Remove existing product info if present
                                cardWrapper.querySelector('.center-message')?.remove();
            
                                // Display fetched product variation info
                                const productInfoDiv = document.createElement('div');
                                productInfoDiv.classList.add('center-message');
                                productInfoDiv.innerHTML = `
                                  <span style="color: red;">Product Info:</span>
                                  <span style="color: blue;">${data.data[0].product.name}</span> |
                                  <span style="color: red;">Balance:</span>
                                  <span style="color: blue;">${totalBalance}</span> |  
                                `;
            
                                cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                              }
                            },
                            (error) => {
                              console.error("Error fetching data:", error);
                            }
                          );
                        } else {
                          console.log(`No valid product, size, or color selected for Row ${currentRowIndex}.`);
                        }
                      }); //**End of Size selection part */
              
                      // Subscribe to value changes of the size field
                      field.formControl.valueChanges.subscribe(selectedSizeId => {
                        const product = this.formConfig.model.sale_return_items[currentRowIndex]?.product;
                        const size = this.formConfig.model.sale_return_items[currentRowIndex]?.size;
              
                        // Make sure size exists
                        if (size?.size_id) {
                          // Fetch available colors based on the selected size
                          this.http.get(`products/product_variations/?product_id=${product.product_id}&size_id=${size.size_id}`).subscribe((response: any) => {
                            const availableColors = response.data.map((variation: any) => {
                              return {
                                label: variation.color.color_name,  // Use 'color_name' as the label
                                value: {
                                  color_id: variation.color.color_id,
                                  color_name: variation.color.color_name
                                }
                              };
                            });
              
                            // Filter unique colors (optional, if there's a chance of duplicate colors)
                            const uniqueColors = availableColors.filter((item, index, self) =>
                              index === self.findIndex((t) => t.value.color_id === item.value.color_id)
                            );
              
                            // Now, update the color field for the current row
                            const colorField = parentArray.fieldGroup.find((f: any) => f.key === 'color');
                            if (colorField) {
                              colorField.templateOptions.options = uniqueColors; // Update the options for the 'color' field
                            }
                          });
                        } else {
                          console.error('Size not selected or invalid.');
                        }
                      });
                    } else {
                      console.error('Parent array is undefined or not accessible');
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
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (parentArray) {
                      const currentRowIndex = +parentArray.key;

                      // Check if there is a product already selected in this row (when data is copied)
                      if (this.dataToPopulate && this.dataToPopulate.sale_return_items.length > currentRowIndex) {
                        const existingColor = this.dataToPopulate.sale_return_items[currentRowIndex].color;
                        
                        // Set the full product object instead of just the product_id
                        if (existingColor) {
                          field.formControl.setValue(existingColor);
                        }
                      }
            
                      // Subscribe to value changes when the form field changes
                      field.formControl.valueChanges.subscribe(selectedProductId => {
                        const product = this.formConfig.model.sale_return_items[currentRowIndex]?.product;
                        const size = this.formConfig.model.sale_return_items[currentRowIndex]?.size;
                        const color = this.formConfig.model.sale_return_items[currentRowIndex]?.color;
            
                        const product_id = product?.product_id;
                        const size_id = size?.size_id;
                        const color_id = color?.color_id;
            
                        // Check if product_id, size_id, and color_id exist
                        if (product_id && size_id && color_id) {
                          const url = `products/product_variations/?product_id=${product_id}&size_id=${size_id}&color_id=${color_id}`;
            
                          // Call the API using HttpClient (this.http.get)
                          this.http.get(url).subscribe(
                            (data: any) => {
            
                              const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
                              if (cardWrapper) {
                                // Remove existing product info if present
                                cardWrapper.querySelector('.center-message')?.remove();
            
                                // Display fetched product variation info
                                const productInfoDiv = document.createElement('div');
                                productInfoDiv.classList.add('center-message');
                                productInfoDiv.innerHTML = `
                                  <span style="color: red;">Product Info:</span>
                                  <span style="color: blue;">${data.data[0].product.name}</span> |
                                  <span style="color: red;">Balance:</span>
                                  <span style="color: blue;">${data.data[0].quantity}</span> |  
                                `;
            
                                cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
                              }
                            },
                            (error) => {
                              console.error("Error fetching data:", error);
                            }
                          );
                        } else {
                          console.log(`No valid product, size, or color selected for Row ${currentRowIndex}.`);
                        }
                      });
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
            ]
          },
        },
        {
          fieldGroupClassName: "row col-12 m-0 custom-form-card",
          fieldGroup: 
          [
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
                        // required: true
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
                          key: 'sale_return_order',
                          fieldGroup: [
                            {
                              key: 'gst_type',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Gst Type',
                                placeholder: 'Select Gst Type',
                                dataKey: 'name',
                                dataLabel: "name",
                                lazy: {
                                  url: 'masters/gst_types/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    if (this.formConfig && this.formConfig.model && this.formConfig.model['sale_return_order']) {
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
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Payment Term',
                                dataKey: 'payment_term_id',
                                dataLabel: 'name',
                                lazy: {
                                  url: 'masters/customer_payment_terms/',
                                  lazyOneTime: true
                                }
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe((data: any) => {
                                    if (this.formConfig && this.formConfig.model && this.formConfig.model['sale_return_order']) {
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
                            {
                              key: 'order_status',
                              type: 'select',
                              className: 'col-4',
                              templateOptions: {
                                label: 'Order Status Type',
                                placeholder: 'Select Order Status Type',
                                dataKey: 'order_status_id',
                                dataLabel: "status_name",
                                lazy: {
                                  url: 'masters/order_status/',
                                  lazyOneTime: true
                                },
                                expressions: {
                                  hide: '!model.sale_return_id',
                                },
                              },
                              hooks: {
                                onChanges: (field: any) => {
                                  field.formControl.valueChanges.subscribe(data => {
                                    console.log("order_status", data);
                                    if (data && data.order_status_id) {
                                      this.formConfig.model['sale_return_order']['order_status_id'] = data.order_status_id;
                                    }
                                  });
                                }
                              }
                            },
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
                            // {
                            //   key: 'cess_amount',
                            //   type: 'input',
                            //   defaultValue: "0",
                            //   className: 'col-4',
                            //   templateOptions: {
                            //     type: 'input',
                            //     label: 'Cess amount',
                            //     placeholder: 'Enter Cess amount',
                            //     // required: true
                            //   },
                            //   hooks: {
                            //     onInit: (field: any) => {
                            //       field.formControl.valueChanges.subscribe(data => {
                            //         this.totalAmountCal();
                            //         // this.formConfig.model['productDiscount'] = data;
                            //       })
                            //     },
                            //     onChanges: (field: any) => {
                            //     }
                            //   }
                            // },
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order && this.dataToPopulate.sale_return_order.cess_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_return_order.cess_amount);
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
                                placeholder: 'Enter Taxable',
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order && this.dataToPopulate.sale_return_order.tax_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_return_order.tax_amount);
                                  }
                                  field.formControl.valueChanges.subscribe(data => {
                                    this.totalAmountCal();
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order && this.dataToPopulate.sale_return_order.dis_amt && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_return_order.dis_amt);
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
                                  if (this.dataToPopulate && this.dataToPopulate.sale_return_order && this.dataToPopulate.sale_return_order.total_amount && field.formControl) {
                                    field.formControl.setValue(this.dataToPopulate.sale_return_order.total_amount);
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
    };
  }
   
  totalAmountCal() {
    const data = this.formConfig.model;
    console.log('data', data);
    if (data) {
      const products = data.sale_return_items || [];
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


      if (this.salereturnForm && this.salereturnForm.form && this.salereturnForm.form.controls) {
        const controls: any = this.salereturnForm.form.controls;
        controls.sale_return_order.controls.item_value.setValue(totalAmount);
        controls.sale_return_order.controls.dis_amt.setValue(totalDiscount);
        const cessAmount = parseFloat(data.sale_return_order.cess_amount || 0);
        const taxAmount = parseFloat(data.sale_return_order.tax_amount || 0);
        // const advanceAmount = parseFloat(data.sale_return_order.advance_amount || 0);

        const total_amount = (totalAmount + cessAmount + taxAmount) - totalDiscount;
        controls.sale_return_order.controls.total_amount.setValue(total_amount);

      }
    }
  }

  //========================================

  submitForm() {
    // Prepare the payload for Sale Return Order creation
    const saleReturnPayload = {
      sale_return_order: this.formConfig.model.sale_return_order,
      sale_return_items: this.formConfig.model.sale_return_items,
      order_attachments: this.formConfig.model.order_attachments,  // Attachments if applicable
      order_shipments: this.formConfig.model.order_shipments,      // Shipment info if applicable
    };
    console.log("Response of payload in returns : ", saleReturnPayload);
    // First, create the Sale Return record
    this.http.post('sales/sale_return_order/', saleReturnPayload).subscribe(
      (response: any) => {
        console.log("response in returns : ", response);
        console.log("sale_return_id_1 in returns : ", response?.data?.sale_return_order?.sale_return_id)
        const sale_return_id = response?.data?.sale_return_order?.sale_return_id; // Get the sale_return_id from the response
        console.log("sale_return_id in returns : ", sale_return_id)
  
        if (sale_return_id) {
          console.log('Sale Return created successfully. ID:', sale_return_id);
  
          // Now based on the return_option, create the respective entity
          const returnOption = this.formConfig.model.sale_return_order.return_option.name;
          console.log("name of the return option : ", returnOption)
          
          // Create Sale Order, Credit Note, or Debit Note based on the selection
          if (returnOption === 'Credit Note') {
            this.createCreditNote(sale_return_id);
            // this.createSaleOrder(sale_return_id);
          } else if (returnOption === 'Sale Order') {
            this.createSaleOrder(sale_return_id);
          } else if (returnOption === 'Debit Note') {
            this.createDebitNote(sale_return_id);
          } else {
            console.error('Invalid return_option selected');
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
    const SaleOrderpayload = this.formConfig.model.sale_return_order
    const SaleOrderItems = this.formConfig.model.sale_return_items
    const OrderAttachments = this.formConfig.model.order_attachments
    const OrderShippments = this.formConfig.model.order_shipments
    console.log("data in sale order customer : ", this.formConfig.model.sale_return_order.customer_id);
    // Fetch workflow ID from API
    this.getWorkflowId().subscribe((response: any) => {
      console.log("Workflow_id data : ", response);
      const workflowData = response?.data;
      let workflow_id = null; // Initialize workflow_id

      if (workflowData && workflowData.length > 0) {
        workflow_id = workflowData[0].workflow_id; // Get the workflow_id
      }
      const saleOrderPayload = {
        sale_order: {
          email: SaleOrderpayload.email,
          sale_return_id: sale_return_id,
          order_type: SaleOrderpayload.order_type || 'sale_order',
          delivery_date: this.nowDate(),
          order_date: this.nowDate(),
          ref_no: SaleOrderpayload.ref_no,
          ref_date: SaleOrderpayload.ref_date || this.nowDate(),
          tax: SaleOrderpayload.tax || 'Inclusive',
          remarks: SaleOrderpayload.remarks,
          advance_amount: SaleOrderpayload.advance_amount,
          item_value: SaleOrderpayload.item_value,
          discount: SaleOrderpayload.discount,
          dis_amt: SaleOrderpayload.dis_amt,
          taxable: SaleOrderpayload.taxable,
          tax_amount: SaleOrderpayload.tax_amount,
          cess_amount: SaleOrderpayload.cess_amount,
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
          workflow_id: workflow_id, // Add workflow_id to payload
        },
        sale_order_items: SaleOrderItems.map(item => ({
          quantity: item.quantity,
          unit_price: item.unit_price0,
          rate: item.rate,
          amount: item.amount,
          total_boxes: item.total_boxes,
          discount_percentage: item.discount_percentage,
          discount: item.discount,
          dis_amt: item.dis_amt,
          tax: item.tax || '',
          print_name: item.print_name,
          remarks: item.remarks,
          tax_rate: item.tax_rate,
          unit_options_id: item.unit_options_id,
          product_id: item.product_id
        })),
        order_attachments: OrderAttachments,
        order_shipments: OrderShippments
      };

      console.log("Sale order payload : ", saleOrderPayload);

      // POST request to create Sale Order
      this.http.post('sales/sale_order/', saleOrderPayload).subscribe(
        (response) => {
          console.log('Sale Order created successfully');
        },
        (error) => {
          console.error('Error creating Sale Order:', error);
        }
      );
    });
    this.ngOnInit();
  }

  
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
        console.log('Credit Note created successfully');
      },
      (error) => {
        console.error('Error creating Credit Note:', error);
      }
    );

    this.ngOnInit();
  }
  
  // Function to create Debit Note using the sale_return_id
  createDebitNote(sale_return_id: string) {
    const debitNotePayload = {
      sale_debit_note: {
        customer_id: this.formConfig.model.sale_return_order.customer_id,
        sale_invoice_id: this.formConfig.model.sale_return_order.sale_invoice_id,
        sale_return_id: sale_return_id,
        total_amount: this.formConfig.model.sale_return_order.total_amount,
        reason: this.formConfig.model.sale_return_order.return_reason,
        order_status_id: this.formConfig.model.sale_return_order.order_status_id,
        debit_date: this.nowDate()
      },
      sale_debit_note_items: this.formConfig.model.sale_return_items.map(item => ({
        quantity: item.quantity,
        price_per_unit: item.rate,
        total_price: item.amount,
        product_id: item.product_id
      }))
    };
  
    // POST request to create Debit Note
    this.http.post('sales/sale_debit_notes/', debitNotePayload).subscribe(
      (response) => {
        console.log('Debit Note created successfully');
      },
      (error) => {
        console.error('Error creating Debit Note:', error);
      }
    );
    this.ngOnInit();
  }
  
  
}