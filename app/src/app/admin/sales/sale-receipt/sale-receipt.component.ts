import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';

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
  
  // Initial curdConfig setup for sale receipt
  curdConfig: TaCurdConfig = this.getCurdConfig();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isLoading = false;
  }

  // Helper function to initialize curdConfig for sale receipt
  getCurdConfig(): TaCurdConfig {
    return {
      drawerSize: 500,
      drawerPlacement: 'right',
      hideAddBtn: true,
      tableConfig: {
        apiUrl: 'sales/sale_order/?summary=true&flow_status=Delivery In progress',
        title: 'Sales Receipt',
        pkId: "sale_order_id",
        pageSize: 10,
        globalSearch: {
          keys: ['customer','order_no','invoice_no','products']
        },
        cols: [
          {
            fieldKey: 'customer',
            name: 'Customer',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => `${row.customer.name}`,
          },
          {
            fieldKey: 'order_no',
            name: 'Order No',
            sort: true
          },
          {
            fieldKey: 'invoice_no',
            name: 'Invoice No',
            sort: true
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
                label: 'Confirm Receipt',
                callBackFn: (row: any) => this.openModal(row),
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
  
  //fetching invoice Id
  fetchSaleInvoiceId(saleOrderId: string): Promise<string | null> {
    const apiUrl = `sales/sale_invoice_order_get/?sale_order_id=${saleOrderId}`;
  
    return this.http.get<any>(apiUrl).toPromise()
      .then(response => {
        console.log("hiiii",response.data[0].sale_invoice_id);
        if (response && response.data[0].sale_invoice_id) {
          console.log("we are in method")
          // Assuming the response is an array and we take the first item
          return response.data[0].sale_invoice_id;;
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

// Main method to confirm receipt and prepare the payload with receipt_path
async confirmReceipt() {
  if (this.selectedOrder) {
    const saleOrderId = this.selectedOrder.sale_order_id;

    // Step 1: Fetch the sale_invoice_id based on sale_order_id
    const saleInvoiceId = await this.fetchSaleInvoiceId(saleOrderId);
    if (!saleInvoiceId) {
      console.error("Sale invoice ID is missing or couldn't be fetched.");
      return;
    }

    const saleReceiptUrl = 'sales/sale_receipts/';

    // Step 2: Prepare the request payload
    let receiptPath = []; // Default to an empty array if no file is selected

    // Check if a file has been selected for upload
    if (this.selectedOrder.selectedFile) {
      const selectedFile = this.selectedOrder.selectedFile;

      // Prepare file metadata in the required structure for receipt_path
      receiptPath = [this.prepareFileMetadata(selectedFile)];
    }

    // Step 3: Prepare the payload with receipt_path
    const payload = {
      sale_invoice_id: saleInvoiceId,
      receipt_name: `Receipt for Order ${saleOrderId}`,
      description: 'Uploaded receipt for order confirmation',
      receipt_path: receiptPath  // Include the file metadata or empty array
    };

    // Step 4: Send the request to create a SaleReceipt
    this.http.post(saleReceiptUrl, payload).subscribe(
      (response: any) => {
        console.log('Sale receipt created successfully:', response);

        // Move the order to the next stage
        const nextStageUrl = `sales/SaleOrder/${saleOrderId}/move_next_stage/`;

        this.http.post(nextStageUrl, {}).subscribe(
          () => {
            console.log('Dispatch confirmed for order:', saleOrderId);
            this.closeModal(); // Close the modal after confirmation
            this.refreshCurdConfig(); // Refresh data list in curdConfig
          },
          error => {
            console.error('Error in confirming dispatch:', error);
            alert('Failed to confirm dispatch. Please try again.');
          }
        );
      },
      error => {
        console.error('Error in creating sale receipt:', error);
        alert('Failed to create sale receipt. Please try again.');
      }
    );
  } else {
    console.warn("No order selected for confirmation.");
  }
}

  
}
