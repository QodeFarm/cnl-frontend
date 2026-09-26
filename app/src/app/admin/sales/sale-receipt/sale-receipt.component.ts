import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@ta/ta-core';
import { NzNotificationService, NzNotificationModule } from 'ng-zorro-antd/notification';
import { TaCurdModalComponent } from 'projects/ta-curd/src/lib/ta-curd-modal/ta-curd-modal.component';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, NzNotificationModule],
  selector: 'app-sale-receipt',
  templateUrl: './sale-receipt.component.html',
  styleUrls: ['./sale-receipt.component.scss']
})
export class SaleReceiptComponent implements OnInit {
  isLoading = true;
  showModal = false;
  selectedOrder: any = null;
  selectedReceipt: any = null;
  // Post-confirm context for notification action button
  confirmedOrderNo: string = '';
  confirmedParentOrderNo: string = '';
  parentNewStatus: string = '';
  @ViewChild('postConfirmTpl', { static: true }) postConfirmTpl!: TemplateRef<{}>;
  @ViewChild(TaCurdModalComponent) curdModalComponent?: TaCurdModalComponent;
  // Initial curdConfig setup for sale receipt
  curdConfig: TaCurdConfig = this.getCurdConfig();

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private router: Router,
    private notification: NzNotificationService
  ) {
    this.curdConfig = this.getCurdConfig();
  }

  ngOnInit() {
    this.isLoading = false;
  }
  // Helper function to initialize curdConfig for sale receipt
  getCurdConfig(): TaCurdConfig {
    const user = this.localStorage.getItem('user');
    const isSuperUser = user?.is_sp_user === true;
    console.log("isSuperUser : ", isSuperUser);
    const apiUrl = isSuperUser
      ? 'sales/sale_order/?records_all=true&flow_status_name=Completed,Delivery In progress'
      : 'sales/sale_order/?summary=true&flow_status_name=Completed,Delivery In progress';

    const fixedFilters = isSuperUser
      ? [{ key: 'records_all', value: 'true' }, { key: 'flow_status_name', value: 'Completed,Delivery In progress' }]
      : [{ key: 'summary', value: 'true' }, { key: 'flow_status_name', value: 'Completed,Delivery In progress' }];

    return {
      drawerSize: 500,
      drawerPlacement: 'right',
      hideAddBtn: true,
      tableConfig: {
        apiUrl: apiUrl, //'sales/sale_order/?summary=true&flow_status=Delivery In progress',
        title: 'Delivery Acknowledgement List',
        pkId: "sale_order_id",
        pageSize: 10,
        globalSearch: {
          keys: ['customer','order_no','invoice_no','products']
        },
        fixedFilters: fixedFilters,
        export: {downloadName: 'SaleReceiptList'},
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'customer',
            name: 'Customer',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => `${row.customer.name}`,
            sort: true
          },
          {
            fieldKey: 'order_no',
            name: 'Order No',
            sort: true
          },
          {
            fieldKey: 'invoice_no',
            name: 'Invoice No',
            // sort: true
          },
          {
            fieldKey: 'products',
            name: 'Products',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => {
              if (row.products && typeof row.products === 'object') {
                return Object.values(row.products).map((product: any) => `${product.product_name} (Qty: ${product.quantity})`).join(', ');
              }
              return 'No products';
            }
          },
          {
            fieldKey: 'total_amount',
            name: 'Total Amount',
            // sort: true
          },
          {
            fieldKey: 'flow_status',
            name: 'Status',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => {
              const statusName = row.flow_status?.flow_status_name || 'Unknown';
              const colorMap: any = {
                'Completed': '#16a34a',
                'Delivery In progress': '#0ea5e9',
                'Partially Delivered': '#a855f7'
              };
              const color = colorMap[statusName] || '#555';
              return `<span style="color:${color};font-weight:600">${statusName}</span>`;
            },
            sort: true
          },
          {
            fieldKey: 'file_upload',
            name: 'Upload File',
            displayType: 'file',
            actions: [
              {
                type: 'callBackFn',
                label: 'Upload',
                callBackFn: (row: any) => this.uploadFile(row)
              }
            ]
          },    
          {
            fieldKey: 'actions',
            name: 'Actions',
            type: 'action',
            actions: [
              {
                type: 'callBackFn',
                label: 'Confirm Delivery',
                conditionFn: (row: any) => row?.flow_status?.flow_status_name !== 'Completed',
                callBackFn: (row: any) => this.openModal(row),
              },
              {
                type: 'callBackFn',
                label: 'Delivered',
                cssClass: 'action-delivered',
                conditionFn: (row: any) => row?.flow_status?.flow_status_name === 'Completed',
                callBackFn: () => {},
              }
            ]
          }                                                       
        ]
        
      },
      formConfig: {
        url: 'sales/SaleOrder/{saleOrderId}/move_to_next/',
        title: 'Sales Receipt Confirmation',
        pkId: "sale_order_id",
        exParams: [],
        fields: [
          {
            key: 'sale_order_id',
            type: 'text',
          },
          {
            key: 'confirmation',
            type: 'select',
            defaultValue: 'yes'
          }
        ]
      }
    };
  }

  // Open modal for receipt confirmation
  openModal(order: any) {
    this.selectedOrder = order;
    this.showModal = true;
  }

  // Close modal without confirmation
  closeModal() {
    this.showModal = false;
    this.selectedOrder = null;
  }


  // Refresh the curdConfig object to reload the data in ta-curd-modal

  refreshCurdConfig() {
    this.curdModalComponent?.table?.refresh();
  }

  // Callback method for handling the "Upload File" action
  // Function to upload file to backend and store it under the specific record
  // Uploads file by reading it as Base64 and including it in the request payload
  uploadFile(row: any) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
  
    fileInput.onchange = () => {
      const file = fileInput.files ? fileInput.files[0] : null;
      if (file) {
        // console.log(`File selected: ${file.name} for sale_receipt_id: ${row.sale_receipt_id}`);
  
        // Store the selected file in the order row for later use in confirmReceipt
        row.selectedFile = file;
        row.selectedFileName = file.name; // Optional: display file name in the UI
        // alert(`File "${file.name}" selected for order: ${row.order_no}`);
      }
    };
  
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }
  
fetchSaleInvoiceId(saleOrderId: string): Promise<string | null> {
  const apiUrl = `sales/sale_invoice_order_get/?sale_order_id=${saleOrderId}`;

  return this.http.get<any>(apiUrl).toPromise()
    .then(response => {
      console.log("Response from API:", response);

      if (response && Array.isArray(response.data) && response.data.length > 0 && response.data[0].sale_invoice_id) {
        console.log("Sale Invoice ID:", response.data[0].sale_invoice_id);
        return response.data[0].sale_invoice_id;
      } else {
        console.error("Sale invoice ID not found in response.");
        this.showCustomAlert("Could not retrieve sale invoice ID, you have to create a sale invocie for this order first", 'error');
        return null;
      }
    })
    .catch(error => {
      console.error("Error fetching sale invoice ID:", error);
      this.showCustomAlert("Failed to fetch sale invoice ID. Please try again.", 'error');
      return null;
    });
}
  
// Helper method to generate a unique identifier for file metadata
generateUID(): string {
  return Math.random().toString(36).substr(2, 9);  // Generates a random string as UID
}

// Method to prepare the file metadata in the required structure for receipt_path
prepareFileMetadata(selectedFile: File): any {
  const fileUID = this.generateUID(); // Generate unique identifier for the file

  return {
    uid: fileUID,                       // Unique identifier for the file
    name: selectedFile.name,             // Original file name
    file_size: selectedFile.size,        // File size in bytes
    attachment_name: selectedFile.name,  // Use the same name here, or customize if needed
    attachment_path: `${fileUID}_${selectedFile.name}`, // Hypothetical saved file path
  };
}

// Add these properties near your other properties
customAlertVisible = false;
customAlertTitle = '';
customAlertMessage = '';
customAlertType: 'success' | 'error' | 'warning' | 'info' = 'info';
private pendingAlertResolve: (() => void) | null = null;

// Add this method to show custom alert
showCustomAlert(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info',
  title?: string
): Promise<void> {
  return new Promise((resolve) => {
    this.customAlertType = type;
    this.customAlertTitle = title || this.getDefaultAlertTitle(type);
    this.customAlertMessage = message;
    this.customAlertVisible = true;
    this.pendingAlertResolve = resolve;
  });
}

private getDefaultAlertTitle(type: string): string {
  switch (type) {
    case 'success': return 'Success';
    case 'error': return 'Error';
    case 'warning': return 'Warning';
    default: return 'Information';
  }
}

closeCustomAlert() {
  this.customAlertVisible = false;
  if (this.pendingAlertResolve) {
    this.pendingAlertResolve();
    this.pendingAlertResolve = null;
  }
}

private fetchChildOrdersWithRetry(
  parentOrderNo: string,
  childSaleOrderId: number,
  maxRetries = 3,
  delayMs = 800
): Promise<any> {
  const url = `sales/sale_order/?parent_order_no=${parentOrderNo}`;

  return new Promise((resolve, reject) => {
    const attempt = (n: number) => {
      this.http.get<any>(url).subscribe(
        (res) => {
          // Verify the just-updated child reflects 'Completed' in the response
          const updatedChild = res?.data?.find(
            (o: any) => o.sale_order_id === childSaleOrderId
          );

          const childIsFresh =
            updatedChild &&
            updatedChild.flow_status?.flow_status_name === 'Completed';

          if (childIsFresh || n >= maxRetries) {
            resolve(res);
          } else {
            console.warn(
              `[Retry ${n}/${maxRetries}] Child ${childSaleOrderId} not yet Completed in response. Retrying in ${delayMs}ms...`
            );
            setTimeout(() => attempt(n + 1), delayMs);
          }
        },
        (err) => {
          if (n >= maxRetries) reject(err);
          else setTimeout(() => attempt(n + 1), delayMs);
        }
      );
    };
    attempt(1);
  });
}

async confirmReceipt() {
  if (this.selectedOrder) {
    const childSaleOrderId = this.selectedOrder.sale_order_id;
    const parentOrderNo = this.selectedOrder.order_no.split('-').slice(0, 3).join('-');

    console.log("Processing child sale order:", childSaleOrderId);
    console.log("Parent Order No:", parentOrderNo);

    const saleInvoiceId = await this.fetchSaleInvoiceId(childSaleOrderId);
    if (!saleInvoiceId) {
      console.error("Sale invoice ID is missing or couldn't be fetched.");
      return;
    }

    const saleReceiptUrl = 'sales/sale_receipts/';
    let receiptPath = [];

    if (this.selectedOrder.selectedFile) {
      const selectedFile = this.selectedOrder.selectedFile;
      receiptPath = [this.prepareFileMetadata(selectedFile)];
    }

    const payload = {
      sale_invoice_id: saleInvoiceId,
      receipt_name: `Receipt for Order ${childSaleOrderId}`,
      description: 'Uploaded receipt for order confirmation',
      receipt_path: receiptPath
    };

    this.http.post(saleReceiptUrl, payload).subscribe(
      (response: any) => {
        console.log(' Sale receipt created successfully:', response);

        const updateChildStatusUrl = `sales/sale_order/${childSaleOrderId}/`;

        this.http.get('masters/flow_status/?flow_status_name=Completed').subscribe((flowRes: any) => {
          const flow_status_id = flowRes?.data?.[0]?.flow_status_id;

          this.http.get('masters/order_status/?status_name=Completed').subscribe((orderRes: any) => {
            const order_status_id = orderRes?.data?.[0]?.order_status_id;

            const updateChildPayload = { flow_status_id, order_status_id };

            this.http.patch(updateChildStatusUrl, updateChildPayload).subscribe(
              () => {
                console.log(` Child Sale Order ${childSaleOrderId} updated to Completed.`);
                console.log("this.selectedOrder : ", this.selectedOrder);

                console.log("Fetching child orders with retry for parent:", parentOrderNo);
                this.fetchChildOrdersWithRetry(parentOrderNo, childSaleOrderId).then(
                  (childOrdersResponse: any) => {
                    console.log(" Fetched child sale orders:", childOrdersResponse);

                    // Extra safety: filter out the parent and any rows that are not children
                    const children = childOrdersResponse.data.filter(
                      (order: any) => order.order_no !== parentOrderNo
                    );

                    console.log(" Child count:", children.length);
                    children.forEach((childOrder: any) => {
                      console.log(
                        `   → ${childOrder.order_no}: ${childOrder.flow_status?.flow_status_name}`
                      );
                    });

                    // 🛡️ Guard: if no children found at all, treat as Completed (this is a single-order parent)
                    const allCompleted =
                      children.length === 0 ||
                      children.every(
                        (childOrder: any) =>
                          childOrder.flow_status?.flow_status_name === 'Completed'
                      );

                    console.log("allCompleted:", allCompleted);

                    const parentSaleOrder = childOrdersResponse.data.find(
                      (order: any) => order.order_no === parentOrderNo
                    );

                    if (!parentSaleOrder) {
                      console.error(` Parent Sale Order ${parentOrderNo} not found.`);
                      this.closeModal();
                      this.refreshCurdConfig();
                      return;
                    }

                    const parentSaleOrderId = parentSaleOrder.sale_order_id;
                    const updateParentStatusUrl = `sales/sale_order/${parentSaleOrderId}/`;

                    // 🛡️ Short-circuit: if parent is already in the correct target status, skip PATCH
                    const targetStatus = allCompleted ? 'Completed' : 'Partially Delivered';
                    const currentParentStatus = parentSaleOrder.flow_status?.flow_status_name;

                    if (currentParentStatus === targetStatus && targetStatus === 'Completed') {
                      console.log(`Parent already Completed — no update needed.`);
                      this.closeModal();
                      this.refreshCurdConfig();
                      this.showPostConfirmNotification(parentOrderNo, 'Completed');
                      return;
                    }

                    const statusToFetch = targetStatus;

                    this.http
                      .get(`masters/flow_status/?flow_status_name=${encodeURIComponent(statusToFetch)}`)
                      .subscribe((flowRes: any) => {
                        const flow_status_id = flowRes?.data?.[0]?.flow_status_id;

                        this.http
                          .get(`masters/order_status/?status_name=${encodeURIComponent(statusToFetch)}`)
                          .subscribe((orderRes: any) => {
                            const order_status_id = orderRes?.data?.[0]?.order_status_id;

                            const updateParentPayload = { flow_status_id, order_status_id };

                            this.http.patch(updateParentStatusUrl, updateParentPayload).subscribe(
                              () => {
                                console.log(
                                  ` Parent Sale Order ${parentOrderNo} updated to ${statusToFetch}.`
                                );
                                this.closeModal();
                                this.refreshCurdConfig();
                                this.showPostConfirmNotification(parentOrderNo, statusToFetch);
                              },
                              (error) => {
                                console.error(" Error updating parent sale order status:", error);
                                this.closeModal();
                                this.refreshCurdConfig();
                                this.showCustomAlert(
                                  'Failed to update parent sale order status. Please try again.',
                                  'error'
                                );
                              }
                            );
                          });
                      });
                  },
                  (error) => {
                    console.error(" Error fetching child sale orders after retries:", error);
                    this.closeModal();
                    this.refreshCurdConfig();
                    this.showCustomAlert(
                      'Failed to fetch child sale orders. Please try again.',
                      'error'
                    );
                  }
                );

                // const childOrdersUrl = `sales/sale_order/?parent_order_no=${parentOrderNo}`;
                // console.log("Fetching child orders with URL:", childOrdersUrl);
                // this.http.get<any>(childOrdersUrl).subscribe(
                //   (childOrdersResponse) => {
                //     console.log(" Fetched child sale orders:", childOrdersResponse);

                //     console.log(" Checking all child orders' statuses:");
                //     childOrdersResponse.data.forEach((childOrder: any) => {
                //       console.log(`Order No: ${childOrder.order_no}, Flow Status: ${childOrder.flow_status.flow_status_name}`);
                //     });

                //     const allCompleted = childOrdersResponse.data
                //       .filter((order: any) => order.order_no !== parentOrderNo)
                //       .every((childOrder: any) => childOrder.flow_status.flow_status_name === 'Completed');

                //     console.log("allCompleted:", allCompleted);

                //     const parentSaleOrder = childOrdersResponse.data.find(
                //       (order: any) => order.order_no === parentOrderNo
                //     );

                //     if (parentSaleOrder) {
                //       const parentSaleOrderId = parentSaleOrder.sale_order_id;
                //       console.log(" Parent Sale Order ID:", parentSaleOrderId);
                //       const updateParentStatusUrl = `sales/sale_order/${parentSaleOrderId}/`;
                //       console.log(" updateParentStatusUrl:", updateParentStatusUrl);

                //       if (allCompleted) {
                //         this.http.get('masters/flow_status/?flow_status_name=Completed').subscribe((flowRes: any) => {
                //           const flow_status_id = flowRes?.data?.[0]?.flow_status_id;

                //           this.http.get('masters/order_status/?status_name=Completed').subscribe((orderRes: any) => {
                //             const order_status_id = orderRes?.data?.[0]?.order_status_id;

                //             const updateParentPayload = { flow_status_id, order_status_id };

                //             this.http.patch(updateParentStatusUrl, updateParentPayload).subscribe(
                //               () => {
                //                 console.log(` Parent Sale Order ${parentOrderNo} updated to Completed.`);
                //                 this.closeModal();
                //                 this.refreshCurdConfig();
                //                 this.showPostConfirmNotification(parentOrderNo, 'Completed');
                //               },
                //               error => {
                //                 console.error(" Error updating parent sale order status:", error);
                //                 this.closeModal();
                //                 this.refreshCurdConfig();
                //                 this.showCustomAlert(
                //                   'Failed to update parent sale order status. Please try again.',
                //                   'error'
                //                 );
                //               }
                //             );
                //           });
                //         });
                //       } else {
                //         this.http.get('masters/flow_status/?flow_status_name=Partially Delivered').subscribe((flowRes: any) => {
                //           const flow_status_id = flowRes?.data?.[0]?.flow_status_id;

                //           this.http.get('masters/order_status/?status_name=Partially Delivered').subscribe((orderRes: any) => {
                //             const order_status_id = orderRes?.data?.[0]?.order_status_id;

                //             const updateParentPayload = { flow_status_id, order_status_id };

                //             this.http.patch(updateParentStatusUrl, updateParentPayload).subscribe(
                //               () => {
                //                 console.log(` Parent Sale Order ${parentOrderNo} updated to Partially Delivered.`);
                //                 this.closeModal();
                //                 this.refreshCurdConfig();
                //                 this.showPostConfirmNotification(parentOrderNo, 'Partially Delivered');
                //               },
                //               error => {
                //                 console.error(" Error updating parent sale order status:", error);
                //                 this.closeModal();
                //                 this.refreshCurdConfig();
                //                 this.showCustomAlert(
                //                   'Failed to update parent sale order status. Please try again.',
                //                   'error'
                //                 );
                //               }
                //             );
                //           });
                //         });
                //       }
                //     } else {
                //       console.error(` Parent Sale Order ${parentOrderNo} not found.`);
                //       this.closeModal();
                //       this.refreshCurdConfig();
                //     }
                //   },
                //   (error) => {
                //     console.error(" Error fetching child sale orders:", error);
                //     this.closeModal();
                //     this.refreshCurdConfig();
                //     this.showCustomAlert(
                //       'Failed to fetch child sale orders. Please try again.',
                //       'error'
                //     );
                //   }
                // );
              },
              error => {
                console.error(" Error updating child sale order status:", error);
                this.showCustomAlert(
                  'Failed to update child sale order status. Please try again.',
                  'error'
                );
              }
            );
          });
        });
      },
      error => {
        console.error(' Error in creating sale receipt:', error);
        this.showCustomAlert(
          'Failed to create sale receipt. Please try again.',
          'error'
        );
      }
    );
  } else {
    console.warn(" No order selected for confirmation.");
  }
  this.ngOnInit();
}


  // ========== POST-CONFIRM NOTIFICATION ==========
  showPostConfirmNotification(parentOrderNo: string, parentStatus: string) {
    this.confirmedOrderNo = this.selectedOrder?.order_no || '';
    this.confirmedParentOrderNo = parentOrderNo;
    this.parentNewStatus = parentStatus;
    this.notification.template(this.postConfirmTpl, {
      nzDuration: 10000,
      nzPlacement: 'topRight'
    });
  }

  viewParentSaleOrder() {
    this.notification.remove();
    // Navigate to Sales page and open the sale order list so user can find the parent
    this.router.navigate(['/admin/sales'], {
      queryParams: { showList: 'true' }
    });
  }

  // Angular / JavaScript pseudo-code
  isConfirmReceiptDisabled(order): boolean {
    return order.flow_status_name?.toLowerCase() === 'completed';
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
  
}
