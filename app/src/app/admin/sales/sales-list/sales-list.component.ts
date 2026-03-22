import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { ActivatedRoute, Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@ta/ta-core';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  // Add these properties
  isCustomerPortal: boolean = false;
  customerId: string | null = null;

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private localStorage: LocalStorageService,
    private route: ActivatedRoute  // Add this
  ) {
    this.setApiUrlBasedOnUser();
  }

  ngOnInit() {
    // Check if this is customer portal
    this.route.data.subscribe(data => {
      this.isCustomerPortal = data['customerView'] || false;
      
      if (this.isCustomerPortal) {
        // Get customer ID from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.customerId = user.id || null;
        
        console.log('Customer Portal Mode - Customer ID:', this.customerId);
        
        // Update the table config for customer view
        this.updateTableConfigForCustomer();
      }
    });
  }

  // New method to update table config for customer
  updateTableConfigForCustomer() {
    // Set API URL with customer filter
    this.tableConfig.apiUrl = `sales/sale_order/?customer_id=${this.customerId}`;
    
    // Remove admin-only actions
    this.tableConfig.cols = this.tableConfig.cols.map(col => {
      if (col.name === 'Action') {
        // For customer portal, only keep view action, remove delete/restore
        col.actions = [
          {
            type: 'callBackFn',
            icon: 'fa fa-eye',
            label: '',
            tooltip: "View Order",
            callBackFn: (row, action) => {
              console.log('View order:', row);
              this.edit.emit(row.sale_order_id);
            }
          }
        ];
      }
      return col;
    });

    // Remove export option for customers
    this.tableConfig.export = undefined;
    
    // Remove checkboxes for customers
    this.tableConfig.showCheckbox = false;
    
    // Add fixed filter for customer
    this.tableConfig.fixedFilters = [
      { key: 'customer_id', value: this.customerId }
    ];

    console.log('Updated table config for customer:', this.tableConfig);
  }

  onRowDoubleClick(row: any) {
    console.log('Double clicked row:', row);
    this.edit.emit(row.sale_order_id);
  }

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  selectedFormat: string = "CNL_Standard_Excl";
  pendingAction: 'email' | 'preview' | 'print' | 'whatsapp' | null = null;

  // Only show format dialog for customers if needed
  private showFormatDialog(action: 'email' | 'preview' | 'print' | 'whatsapp'): void {
    if (this.isCustomerPortal) {
      // For customers, maybe just preview is enough
      if (action === 'preview' || action === 'print') {
        this.pendingAction = action;
        const dialog = document.getElementById('formatDialog');
        if (dialog) dialog.style.display = 'flex';
      } else {
        // Disable email/whatsapp for customers if not needed
        this.showDialog();
      }
    } else {
      // Admin can do everything
      this.pendingAction = action;
      const dialog = document.getElementById('formatDialog');
      if (dialog) dialog.style.display = 'flex';
    }
  }

  closeFormatDialog(): void {
    const dialog = document.getElementById('formatDialog');
    if (dialog) dialog.style.display = 'none';
    this.pendingAction = null;
  }

  proceedWithSelectedAction(): void {
    switch (this.pendingAction) {
      case 'email':
        this.onMailLinkClick(); break;
      case 'preview':
        this.onPreviewClick(); break;
      case 'print':
        this.onPrintClick(); break;
      case 'whatsapp':
        this.onWhatsappClick();
        break;
    }

    this.pendingAction = null;
    this.closeFormatDialog();
  }

  onWhatsappClick(): void {
    const selectedIds = this.taTableComponent.options.checkedRows;

    if (selectedIds.length === 0) {
      return this.showDialog();
    }

    const saleOrderId = selectedIds[0];
    const url = `masters/document_generator/${saleOrderId}/sale_order/`;

    const payload = {
      flag: 'whatsapp',
      format: this.selectedFormat
    };

    this.showLoading = true;

    this.http.post<any>(url, payload).subscribe(
      (response) => {
        this.showLoading = false;
        this.refreshTable();

        if (response.mode === 'wati') {
          this.showSuccessToast = true;
          this.toastMessage = 'WhatsApp message sent successfully';
          setTimeout(() => this.showSuccessToast = false, 2000);
        }
        else if (response.mode === 'click_to_chat' && response.whatsapp_url) {
          window.open(response.whatsapp_url, '_blank');
          this.showSuccessToast = true;
          this.toastMessage = 'Opening WhatsApp…';
          setTimeout(() => this.showSuccessToast = false, 2000);
        }
      },
      (error) => {
        this.showLoading = false;
        console.error('Error sending WhatsApp message', error);
        this.showSuccessToast = true;
        this.toastMessage = 'Failed to send WhatsApp message';
        setTimeout(() => this.showSuccessToast = false, 2000);
      }
    );
  }

  onSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'email') {
      this.showFormatDialog('email');
    } else if (selectedValue === 'whatsapp') {
      this.showFormatDialog('whatsapp');
    }

    selectElement.value = '';
  }

  onPrintSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'preview') {
      this.showFormatDialog('preview');
    } else if (selectedValue === 'print') {
      this.showFormatDialog('print');
    }

    selectElement.value = '';
  }

  showDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'flex';
    }
  }

  closeDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'none';
    }
  }

  showSuccessToast = false;
  toastMessage = '';

  onMailLinkClick(): void {
    console.log("We are in method ...")
    const selectedIds = this.taTableComponent.options.checkedRows;
    if (selectedIds.length === 0) {
      return this.showDialog();
    }

    const saleOrderId = selectedIds[0];
    const payload = { flag: "email", format: this.selectedFormat };
    const url = `masters/document_generator/${saleOrderId}/sale_order/`;
    
    this.http.post(url, payload).subscribe(
      (response) => {
        this.showSuccessToast = true;
        this.toastMessage = "Mail Sent successfully";
        this.refreshTable();
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 2000);
      },
      (error) => {
        console.error('Error sending email', error);
      }
    );
  }

  onPreviewClick(): void {
    const selectedIds = this.taTableComponent.options.checkedRows;
    if (selectedIds.length === 0) {
      return this.showDialog();
    }

    const saleOrderId = selectedIds[0];
    const url = `masters/document_generator/${saleOrderId}/sale_order/`;

    this.showLoading = true;

    this.http.post(url, { flag: 'preview', format: this.selectedFormat }, { responseType: 'blob' }).subscribe(
      (pdfBlob: Blob) => {
        this.showLoading = false;
        this.refreshTable();

        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      },
      (error) => {
        this.showLoading = false;
        console.error('Error generating preview', error);
        this.showSuccessToast = true;
        this.toastMessage = "Error generating document preview";
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 2000);
      }
    );
  }

  showLoading = false;

  onPrintClick(): void {
    const selectedIds = this.taTableComponent.options.checkedRows;
    if (selectedIds.length === 0) {
      return this.showDialog();
    }

    const saleOrderId = selectedIds[0];
    const url = `masters/document_generator/${saleOrderId}/sale_order/`;

    this.showLoading = true;

    this.http.post(url, { flag: 'preview', format: this.selectedFormat }, { responseType: 'blob' }).subscribe(
      (pdfBlob: Blob) => {
        this.showLoading = false;
        this.openAndPrintPdf(pdfBlob);
      },
      (error) => {
        this.showLoading = false;
        console.error('Error generating print document', error);
        this.showSuccessToast = true;
        this.toastMessage = "Error generating document for printing";
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 2000);
      }
    );
  }

  private openAndPrintPdf(pdfBlob: Blob): void {
    const blobUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(blobUrl, '_blank');

    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          URL.revokeObjectURL(blobUrl);
        }, 500);
      };
    } else {
      this.fallbackPrint(pdfBlob);
    }
  }

  private fallbackPrint(pdfBlob: Blob): void {
    const blobUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.print();
        } catch (e) {
          console.error('Iframe print error:', e);
          window.open(blobUrl, '_blank');
        }
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
        }, 100);
      }, 1000);
    };
  }

  tableConfig: TaTableConfig = {
    apiUrl: '',
    showCheckbox: true,
    pkId: "sale_order_id",
    rowEvents: {
      dblclick: (row: any) => {
        console.log('Row double-clicked:', row);
        this.onRowDoubleClick(row);
      }
    },
    fixedFilters: [],
    export: {
      downloadName: 'SalesList'
    },
    pageSize: 10,
    globalSearch: {
      keys: ['order_date', 'order_no', 'sale_type', 'customer', 'sale_estimate', 'amount', 'tax', 'advance_amount', 'status_name', 'flow_status_name']
    },
    defaultSort: { key: 'created_at', value: 'descend' },
    scrollX: '1600px',
    cols: [
      {
        fieldKey: 'order_date',
        name: 'Order Date',
        sort: true
      },
      {
        fieldKey: 'order_no',
        name: 'Order No',
        sort: true
      },
      {
        fieldKey: 'sale_type',
        name: 'Sale Type',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.sale_type?.name || row.sale_type_id || '';
        },
      },
      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.customer?.name || row.customer_id || '';
        },
        sort: true
      },
      {
        fieldKey: 'sale_estimate',
        name: 'Sale Estimate',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true,
        isEdit: true,
        isEditSumbmit(row, value, col) {
          console.log("isEditSumbmit", row, value, col);
        },
        autoSave: {
          apiUrl: 'sales/sale_order',
          method: 'put',
          body: (row: any, value: any, col: any) => {
            return {
              sale_order_id: row.sale_order_id,
              total_amount: value
            };
          }
        }
      },
      {
        fieldKey: 'tax',
        name: 'Tax',
        sort: true
      },
      {
        fieldKey: 'advance_amount',
        name: 'Advance Amt',
        sort: true
      },
      {
        fieldKey: 'order_status',
        name: 'Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.order_status?.status_name || row.order_status_id || '';
        },
        sort: true
      },
      {
        fieldKey: 'flow_status',
        name: 'Flow Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          const name = row.flow_status?.flow_status_name || '';
          if (!name) return '';
          const classMap: Record<string, string> = {
            'Pending': 'fb-pending',
            'Review Inventory': 'fb-review',
            'Review for Inventory': 'fb-review',
            'Production': 'fb-production',
            'Dispatch': 'fb-dispatch',
            'Ready for Invoice': 'fb-ready-invoice',
            'Delivery In progress': 'fb-delivery',
            'Delivery in Progress': 'fb-delivery',
            'Delivery In Progress': 'fb-delivery',
            'Partially Delivered': 'fb-partial',
            'Completed': 'fb-completed'
          };
          const cls = classMap[name] || 'fb-default';
          return `<span class="flow-badge ${cls}">${name}</span>`;
        },
        sort: true,
        width: '180px',
        tdClassName: 'sticky-flow-status'
      },
      {
        fieldKey: "code",
        name: "Action",
        type: 'action',
        width: '120px',
        tdClassName: 'sticky-action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            confirm: true,
            confirmMsg: "Sure to delete?",
            apiUrl: 'sales/sale_order',
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'sales/sale_order',
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.sale_order_id);
            }
          }
        ]
      }
    ]
  };

  private setApiUrlBasedOnUser() {
    const user = this.localStorage.getItem('user');
    const isSuperUser = user?.is_sp_user === true;

    this.tableConfig.apiUrl = isSuperUser
      ? 'sales/sale_order/?records_all=true'
      : 'sales/sale_order/?summary=true';

    this.tableConfig.fixedFilters = isSuperUser
      ? [{ key: 'records_all', value: 'true' }]
      : [{ key: 'summary', value: 'true' }];
  }

  // Show the "Not ready for invoice" modal
  showOrderNotReadyModal() {
    const modal = document.getElementById('notReadyInvoiceDialog');
    if (modal) modal.style.display = 'flex';
  }

  // Close the modal
  closeNotReadyInvoiceDialog() {
    const modal = document.getElementById('notReadyInvoiceDialog');
    if (modal) modal.style.display = 'none';
  }

// Method to update invoiced status using HttpClient
  updateInvoicedStatusDirectly_1(itemId: number, status: string) {
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

createInvoiceFromList(sale_order_id: any) {

  const saleOrderId = sale_order_id;
  if (!saleOrderId) return;

  this.showLoading = true;

  this.http.get(`sales/sale_order/${saleOrderId}/`).subscribe(
    (res: any) => {

      const saleOrder = res.data;
      if (!saleOrder) {
        this.showLoading = false;
        return;
      }

      const saleOrderItems = saleOrder.sale_order_items || [];
      const orderAttachments = saleOrder.order_attachments || [];
      const orderShipments = saleOrder.order_shipments || [];

      const customerId =
        saleOrder.customer_id ||
        saleOrder.customer?.customer_id ||
        saleOrder.sale_order?.customer_id;

      /* --------------------------------------------------
         CALCULATIONS
      -------------------------------------------------- */

      let itemValueTotal = 0;
      let discountTotal = 0;
      let taxableTotal = 0;
      let taxTotal = 0;
      let amountTotal = 0;

      saleOrderItems.forEach(item => {

        const quantity = Number(item.quantity) || 0;
        const productionQty = Number(item.production_qty) || 0;
        const invoiceQty = quantity - productionQty;

        const rate = Number(item.rate) || 0;
        const discountPercent = Number(item.discount) || 0;
        const gstPercent = Number(item.product?.gst_input) || 0;

        const itemValue = invoiceQty * rate;

        const discountAmount =
          (itemValue * discountPercent) / 100;

        const taxable =
          itemValue - discountAmount;

        const taxAmount =
          (taxable * gstPercent) / 100;

        const total =
          taxable + taxAmount;

        /* Save item values */

        item.item_value = itemValue;
        item.discount_amount = discountAmount;
        item.amount = taxable;
        item.tax_amount = taxAmount;
        item.total = total;

        /* GST Split */

        const address =
          saleOrder.billing_address ||
          saleOrder.shipping_address ||
          '';

        const isIntraState =
          address.toLowerCase().includes('andhra pradesh');

        if (isIntraState) {

          item.cgst = taxAmount / 2;
          item.sgst = taxAmount / 2;
          item.igst = 0;

        } else {

          item.igst = taxAmount;
          item.cgst = 0;
          item.sgst = 0;

        }

        /* Totals */

        itemValueTotal += itemValue;
        discountTotal += discountAmount;
        taxableTotal += taxable;
        taxTotal += taxAmount;
        amountTotal += total;

      });

      /* --------------------------------------------------
         SHIPPING CALCULATION
      -------------------------------------------------- */

      const shippingCharges =
        Number(orderShipments?.shipping_charges || saleOrder.shipping_charges || 0);

      const shippingGSTPercent =
        Number(orderShipments?.shipping_gst || saleOrder.shipping_gst || 0);

      const shippingTax =
        (shippingCharges * shippingGSTPercent) / 100;

      const finalShipping =
        shippingCharges + shippingTax;

      /* --------------------------------------------------
         OTHER AMOUNTS
      -------------------------------------------------- */

      const cessAmount =
        Number(saleOrder.cess_amount) || 0;

      const disAmt =
        Number(saleOrder.dis_amt) || 0;

      const roundOff =
        Number(saleOrder.round_off) || 0;

      const advanceAmount =
        Number(saleOrder.advance_amount) || 0;

      const finalTotal =
        taxableTotal +
        taxTotal +
        finalShipping +
        cessAmount -
        disAmt -
        advanceAmount +
        roundOff;

      /* --------------------------------------------------
         BILL TYPE
      -------------------------------------------------- */

      const saleTypeName =
        saleOrder.sale_type?.name || '';

      const billType =
        (saleTypeName === 'Other') ? 'OTHERS' : 'CASH';

      const invoicePrefix =
        (saleTypeName === 'Other') ? 'SOO-INV' : 'SO-INV';

      /* --------------------------------------------------
         UPDATE INVOICED STATUS
      -------------------------------------------------- */

      saleOrderItems.forEach(item => {

        if (item.invoiced === 'NO') {

          item.invoiced = 'YES';

          this.updateInvoicedStatusDirectly_1(
            item.sale_order_item_id,
            'YES'
          );

        }

      });

      /* --------------------------------------------------
         GENERATE INVOICE NUMBER
      -------------------------------------------------- */

      this.http.get(`masters/generate_order_no/?type=${invoicePrefix}`)
        .subscribe((invRes: any) => {

          const invoiceNo =
            invRes?.data?.order_number;

          this.http.get('masters/order_status/?status_name=Pending')
            .subscribe((statusRes: any) => {

              const completedStatusId =
                statusRes?.data?.[0]?.order_status_id;

              /* --------------------------------------------------
                 FINAL PAYLOAD
              -------------------------------------------------- */

              const invoiceData = {

                sale_invoice_order: {

                  customer_id: customerId,
                  bill_type: billType,

                  invoice_date: this.nowDate(),

                  email: saleOrder.email,

                  ref_no: saleOrder.ref_no,
                  ref_date: this.nowDate(),

                  due_date: this.nowDate(),

                  tax: saleOrder.tax || 'Inclusive',

                  remarks: saleOrder.remarks,

                  advance_amount: advanceAmount,

                  tax_amount: taxTotal.toFixed(2),

                  item_value: itemValueTotal.toFixed(2),

                  discount: saleOrder.disocunt || '0',
                  dis_amt: saleOrder.dis_amt || '0',

                  taxable: taxableTotal.toFixed(2),

                  cess_amount: cessAmount,

                  transport_charges: finalShipping.toFixed(2),

                  round_off: roundOff,

                  total_amount: finalTotal.toFixed(2),

                  vehicle_name: saleOrder.vehicle_name,

                  total_boxes: saleOrder.total_boxes,

                  shipping_address: saleOrder.shipping_address,

                  billing_address: saleOrder.billing_address,

                  gst_type_id: saleOrder.gst_type_id,

                  order_type: 'sale_invoice',

                  order_salesman_id: saleOrder.order_salesman_id,

                  customer_address_id: saleOrder.customer_address_id,

                  payment_term_id: saleOrder.payment_term_id,

                  payment_link_type_id: saleOrder.payment_link_type_id,

                  ledger_account_id: saleOrder.ledger_account_id,

                  flow_status: saleOrder.flow_status,

                  order_status_id: completedStatusId,

                  sale_order_id: saleOrderId,

                  ...(billType === 'OTHERS' && {
                    invoice_no: invoiceNo
                  })

                },

                sale_invoice_items: saleOrderItems
                  .filter(item => item.product_id)
                  .map(item => ({
                    ...item,
                    quantity:
                      Number(item.quantity || 0) -
                      Number(item.production_qty || 0),
                    discount: item.discount || '0'
                  })),

                order_attachments: orderAttachments,

                order_shipments: orderShipments

              };

              console.log('Final invoiceData:', invoiceData);

              /* --------------------------------------------------
                 CREATE INVOICE
              -------------------------------------------------- */

              this.http.post(
                'sales/sale_invoice_order/',
                invoiceData
              ).subscribe(

                (resp: any) => {

                  console.log(
                    'Invoice created successfully:',
                    resp
                  );

                  this.http.post(
                    `sales/SaleOrder/${saleOrderId}/move_next_stage/`,
                    {}
                  ).subscribe(

                    nextStageRes => {

                      this.toastMessage =
                        'Invoice created & workflow moved';

                      this.showSuccessToast = true;

                      setTimeout(() =>
                        this.showSuccessToast = false,
                        3000
                      );

                      this.showLoading = false;

                    },

                    nextStageErr => {

                      console.error(
                        'Workflow move error',
                        nextStageErr
                      );

                      this.showLoading = false;

                    }

                  );

                },

                err => {

                  console.error(
                    'Invoice creation error',
                    err
                  );

                  this.showLoading = false;

                }

              );

            });

        });

    },

    err => {

      console.error(
        'Error fetching sale order',
        err
      );

      this.showLoading = false;

    }

  );

}

nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

onFlowStatusSelect(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const selectedValue = selectElement.value;

  const selectedIds = this.taTableComponent.options.checkedRows;
  const saleOrderId = selectedIds[0];

  // Handle DISPATCH action
  if (selectedValue === 'dispatch') {
    // Fetch the sale order data to validate
    this.http.get(`sales/sale_order/${saleOrderId}/`).subscribe((res: any) => {
      const row = res?.data;
      console.log('Response from sale order API:', row);
      const flowStatus = row?.sale_order.flow_status?.flow_status_name;
      const saleOrderItems = row?.sale_order_items || [];

      console.log('Checking flow status for order:', saleOrderId);
      console.log('Flow Status:', flowStatus);
      console.log('Items:', saleOrderItems);

      if (flowStatus === 'Review Inventory') {
        // Calculate pending quantities for each item
        const itemsWithPending = saleOrderItems.map((item: any) => {
          const quantity = Number(item.quantity) || 0;
          const productionQty = Number(item.production_qty) || 0;
          const pendingQty = quantity - productionQty;
          
          return {
            id: item.sale_order_item_id,
            product: item.product?.name || 'Unknown',
            quantity,
            productionQty,
            pendingQty,
            hasPending: pendingQty > 0
          };
        });

        const hasPendingItems = itemsWithPending.some((item: any) => item.hasPending);
        
        if (hasPendingItems) {
          console.log('Items pending for dispatch:', 
            itemsWithPending.filter((item: any) => item.hasPending));
          
          // ACTUALLY CALL THE DISPATCH FUNCTION HERE
          this.updateFlowStatus('Dispatch');
          
        } else {
          console.log('No pending items to dispatch');
          this.showOrderNotReadyModal();
        }
      } else {
        // Wrong flow status
        console.log(`Order is in ${flowStatus} status, not Review Inventory`);
        this.showOrderNotReadyModal();
      }
    });
  }

  // Handle CREATE INVOICE action
  if (selectedValue === 'create_invoice') {
    // Optionally add validation here too
    this.http.get(`sales/sale_order/${saleOrderId}/`).subscribe((res: any) => {
      const row = res?.data;
      const flowStatus = row?.sale_order.flow_status?.flow_status_name;
      const saleOrderItems = row?.sale_order_items || [];
      
      if (flowStatus === 'Ready for Invoice') {
        // Check if there are items to invoice
        const hasItemsToInvoice = saleOrderItems.some((item: any) => {
          const quantity = Number(item.quantity) || 0;
          const productionQty = Number(item.production_qty) || 0;
          const pendingQty = quantity - productionQty;
          return pendingQty > 0 && item.invoiced === 'NO';
        });
        
        if (hasItemsToInvoice) {
          this.createInvoiceFromList(saleOrderId);
        } else {
          console.log('No items ready for invoicing');
          this.showOrderNotReadyModal();
        }
      } else {
        this.showOrderNotReadyModal();
      }
    });
  }

  // Reset the select element
  selectElement.value = '';
}

updateFlowStatus(statusName: string): void {
  const selectedIds = this.taTableComponent.options.checkedRows;

  if (selectedIds.length === 0) {
    return this.showDialog();
  }

  const saleOrderId = selectedIds[0];

  // Step 1: Fetch flow status record
  this.http
    .get(`masters/flow_status/?flow_status_name=${statusName}`)
    .subscribe((flowRes: any) => {
      const flow_status_id = flowRes?.data?.[0]?.flow_status_id;

      if (!flow_status_id) {
        console.error('Flow status not found');
        return;
      }

      const apiUrl = `sales/sale_order/${saleOrderId}/`;

      const payload = {
        flow_status_id: flow_status_id
      };

      // Step 2: Update sale order
      this.http.patch(apiUrl, payload).subscribe(
        (response) => {
          this.showSuccessToast = true;
          this.toastMessage = `Flow Status updated to ${statusName}`;
          this.refreshTable();

          setTimeout(() => {
            this.showSuccessToast = false;
          }, 2000);
        },
        (error) => {
          console.error('Error updating flow status', error);
        }
      );
    });
}

showFlowStatusDropdown = false;
availableActions: string[] = [];

checkFlowStatusOptions() {
  const selectedIds = this.taTableComponent.options.checkedRows;

  if (selectedIds.length !== 1) {
    this.showFlowStatusDropdown = false;
    return;
  }

  const saleOrderId = selectedIds[0];

  this.http.get(`sales/sale_order/${saleOrderId}/`).subscribe((res: any) => {
    const row = res?.data;
    const flowStatus = row?.sale_order.flow_status?.flow_status_name;

    this.availableActions = [];

    if (flowStatus === 'Review Inventory') {
      this.availableActions.push('dispatch');
    }

    if (flowStatus === 'Ready for Invoice') {
      this.availableActions.push('create_invoice');
    }

    this.showFlowStatusDropdown = this.availableActions.length > 0;
  });
}

ngAfterViewInit() {
  setInterval(() => {
    this.checkFlowStatusOptions();
  }, 500);
}
}
