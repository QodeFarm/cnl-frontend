import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@ta/ta-core';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  selector: 'app-sale-receipt',
  templateUrl: './sale-receipt.component.html',
  styleUrls: ['./sale-receipt.component.scss']
})
export class SaleReceiptComponent implements OnInit {
  isLoading = true;
  showModal = false;
  selectedOrder: any = null;
  selectedReceipt: any = null;
  // Initial curdConfig setup for sale receipt
  curdConfig: TaCurdConfig = this.getCurdConfig();

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
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
      ? 'sales/sale_order/?records_all=true&flow_status_name=Completed,Delivery in Progress'
      : 'sales/sale_order/?summary=true&flow_status_name=Completed,Delivery in Progress';

    const fixedFilters = isSuperUser
      ? [{ key: 'records_all', value: 'true' }, { key: 'flow_status_name', value: 'Delivery In progress' }]
      : [{ key: 'summary', value: 'true' }, { key: 'flow_status_name', value: 'Delivery In progress' }];

    return {
      drawerSize: 500,
      drawerPlacement: 'right',
      hideAddBtn: true,
      tableConfig: {
        apiUrl: apiUrl, //'sales/sale_order/?summary=true&flow_status=Delivery In progress',
        title: 'Sales Receipt',
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
                label: 'Confirm Receipt',  // Static label required by table
                callBackFn: (row: any) => {
                  if (row?.flow_status?.flow_status_name === 'Completed') {
                    // alert('Already Completed');  // Or disable the button if needed
                    this.showDialog();
                  } else {
                    this.openModal(row);
                  }
                },
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
    this.curdConfig = this.getCurdConfig(); // Reset the curdConfig with a fresh configuration
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
          alert("Could not retrieve sale invoice ID.");
          return null;
        }
      })
      .catch(error => {
        console.error("Error fetching sale invoice ID:", error);
        alert("Failed to fetch sale invoice ID. Please try again.");
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
                this.closeModal();
                this.refreshCurdConfig();

                const childOrdersUrl = `sales/sale_order/?parent_order_no=${parentOrderNo}`;
                console.log("Fetching child orders with URL:", childOrdersUrl);
                this.http.get<any>(childOrdersUrl).subscribe(
                  (childOrdersResponse) => {
                    console.log(" Fetched child sale orders:", childOrdersResponse);

                    console.log(" Checking all child orders' statuses:");
                    childOrdersResponse.data.forEach((childOrder: any) => {
                      console.log(`Order No: ${childOrder.order_no}, Flow Status: ${childOrder.flow_status.flow_status_name}`);
                    });

                    const allCompleted = childOrdersResponse.data
                      .filter((order: any) => order.order_no !== parentOrderNo)
                      .every((childOrder: any) => childOrder.flow_status.flow_status_name === 'Completed');

                    console.log(" allCompleted:", allCompleted);

                    const parentSaleOrder = childOrdersResponse.data.find(
                      (order: any) => order.order_no === parentOrderNo
                    );

                    if (parentSaleOrder) {
                      const parentSaleOrderId = parentSaleOrder.sale_order_id;
                      console.log(" Parent Sale Order ID:", parentSaleOrderId);
                      const updateParentStatusUrl = `sales/sale_order/${parentSaleOrderId}/`;
                      console.log(" updateParentStatusUrl:", updateParentStatusUrl);

                      if (allCompleted) {
                        this.http.get('masters/flow_status/?flow_status_name=Completed').subscribe((flowRes: any) => {
                          const flow_status_id = flowRes?.data?.[0]?.flow_status_id;

                          this.http.get('masters/order_status/?status_name=Completed').subscribe((orderRes: any) => {
                            const order_status_id = orderRes?.data?.[0]?.order_status_id;

                            const updateParentPayload = { flow_status_id, order_status_id };

                            this.http.patch(updateParentStatusUrl, updateParentPayload).subscribe(
                              () => {
                                console.log(` Parent Sale Order ${parentOrderNo} updated to Completed.`);
                                this.closeModal();
                                this.refreshCurdConfig();
                              },
                              error => {
                                console.error(" Error updating parent sale order status:", error);
                                alert("Failed to update parent sale order status. Please try again.");
                              }
                            );
                          });
                        });
                      } else {
                        this.http.get('masters/flow_status/?flow_status_name=Partially Delivered').subscribe((flowRes: any) => {
                          const flow_status_id = flowRes?.data?.[0]?.flow_status_id;

                          this.http.get('masters/order_status/?status_name=Partially Delivered').subscribe((orderRes: any) => {
                            const order_status_id = orderRes?.data?.[0]?.order_status_id;

                            const updateParentPayload = { flow_status_id, order_status_id };

                            this.http.patch(updateParentStatusUrl, updateParentPayload).subscribe(
                              () => {
                                console.log(` Parent Sale Order ${parentOrderNo} updated to Partially Delivered.`);
                                this.closeModal();
                                this.refreshCurdConfig();
                              },
                              error => {
                                console.error(" Error updating parent sale order status:", error);
                                alert("Failed to update parent sale order status. Please try again.");
                              }
                            );
                          });
                        });
                      }
                    } else {
                      console.error(` Parent Sale Order ${parentOrderNo} not found.`);
                    }
                  },
                  (error) => {
                    console.error(" Error fetching child sale orders:", error);
                    alert("Failed to fetch child sale orders. Please try again.");
                  }
                );
              },
              error => {
                console.error(" Error updating child sale order status:", error);
                alert("Failed to update child sale order status. Please try again.");
              }
            );
          });
        });
      },
      error => {
        console.error(' Error in creating sale receipt:', error);
        alert('Failed to create sale receipt. Please try again.');
      }
    );
  } else {
    console.warn(" No order selected for confirmation.");
  }
  this.ngOnInit();
}


  private updateChildAndParent(childSaleOrderId: string, parentOrderNo: string) {
    const updateChildStatusUrl = `sales/sale_order/${childSaleOrderId}/`;
    const updateChildPayload = {
      flow_status_id: '595ae9ff-8806-4ca5-ba04-bcb572ee0194',
      order_status_id: '717c922f-c092-4d40-94e7-6a12d7095600'
    };
  
    this.http.patch(updateChildStatusUrl, updateChildPayload).subscribe(
      () => {
        console.log(` Child Sale Order ${childSaleOrderId} updated to Completed.`);
        this.closeModal();
        this.refreshCurdConfig();
  
        const childOrdersUrl = `sales/sale_order/?parent_order_no=${parentOrderNo}`;
        console.log("Fetching child orders with URL:", childOrdersUrl);
        this.http.get<any>(childOrdersUrl).subscribe(
          (childOrdersResponse) => {
            console.log(" Fetched child sale orders:", childOrdersResponse);
            console.log(" Checking all child orders' statuses:");
            childOrdersResponse.data.forEach((childOrder: any) => {
              console.log(`Order No: ${childOrder.order_no}, Flow Status: ${childOrder.flow_status.flow_status_name}`);
            });
  
            const allCompleted = childOrdersResponse.data
              .filter((order: any) => order.order_no !== parentOrderNo)
              .every((childOrder: any) => childOrder.flow_status.flow_status_name === 'Completed');
  
            console.log(" allCompleted:", allCompleted);
  
            const parentSaleOrder = childOrdersResponse.data.find(
              (order: any) => order.order_no === parentOrderNo
            );
  
            if (parentSaleOrder) {
              const parentSaleOrderId = parentSaleOrder.sale_order_id;
              const updateParentStatusUrl = `sales/sale_order/${parentSaleOrderId}/`;
  
              if (allCompleted) {
                console.log(` All child sale orders for ${parentOrderNo} are completed. Updating parent order.`);
                const updateParentPayload = {
                  flow_status_id: '595ae9ff-8806-4ca5-ba04-bcb572ee0194',
                  order_status_id: '717c922f-c092-4d40-94e7-6a12d7095600'
                };
  
                this.http.patch(updateParentStatusUrl, updateParentPayload).subscribe(
                  () => {
                    console.log(` Parent Sale Order ${parentOrderNo} updated to Completed.`);
                    this.closeModal();
                    this.refreshCurdConfig();
                  },
                  error => {
                    console.error(" Error updating parent sale order status:", error);
                    alert("Failed to update parent sale order status. Please try again.");
                  }
                );
              } else {
                console.log(`Some child sale orders are still pending. Updating parent order to 'Partially Delivered'.`);
                const updateParentPayload = {
                  flow_status_id: '35ba9d92-dd2b-4adf-94ec-1391e50cfb30',
                  order_status_id: 'e2079d63-2e5f-4f8e-9d8b-817cefa87398'
                };
  
                this.http.patch(updateParentStatusUrl, updateParentPayload).subscribe(
                  () => {
                    console.log(` Parent Sale Order ${parentOrderNo} updated to Partially Delivered.`);
                    this.closeModal();
                    this.refreshCurdConfig();
                  },
                  error => {
                    console.error(" Error updating parent sale order status:", error);
                    alert("Failed to update parent sale order status. Please try again.");
                  }
                );
              }
            } else {
              console.error(` Parent Sale Order ${parentOrderNo} not found.`);
            }
          },
          (error) => {
            console.error(" Error fetching child sale orders:", error);
            alert("Failed to fetch child sale orders. Please try again.");
          }
        );
      },
      error => {
        console.error(" Error updating child sale order status:", error);
        alert("Failed to update child sale order status. Please try again.");
      }
    );
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
