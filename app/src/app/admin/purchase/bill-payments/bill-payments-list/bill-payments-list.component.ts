import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableComponent, TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-bill-payments-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './bill-payments-list.component.html',
  styleUrls: ['./bill-payments-list.component.scss']
})
export class BillPaymentsListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  };

//----------------- emai -------------------------------------
// In your component (e.g., SalesListComponent)
  onSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    switch (selectedValue) {
      case 'email':
        this.onMailLinkClick();
        break;
      case 'whatsapp':
        break;
      default:
        // Handle default case (e.g., "Mail" selected)
        break;
    }

    // Reset the dropdown to the default option
    selectElement.value = '';
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

  showSuccessToast = false;
  toastMessage = '';

  // Method to handle "Email Sent" button click
  onMailLinkClick(): void {
    console.log("We are in method ...")
    const selectedIds = this.taTableComponent.options.checkedRows;
    if (selectedIds.length === 0) {
      return this.showDialog();
    }

    console.log("selectedIds : ", selectedIds);

    const purchaseInvoiceId = selectedIds[0]; // Assuming only one row can be selected
    const payload = { flag: "email" };
    const url = `masters/document_generator/${purchaseInvoiceId}/bill_receipt/`;
    this.http.post(url, payload).subscribe(
      (response) => {
        this.showSuccessToast = true;
          this.toastMessage = "Mail Sent successfully"; // Set the toast message for update
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

  //----------print & preview ------------------------
  onPrintSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    switch (selectedValue) {
        case 'preview':
            this.onPreviewClick();
            break;
        case 'print':
            this.onPrintClick();
            break;
        default:
            // Handle default case
            break;
    }

    // Reset the dropdown to the default option
    selectElement.value = '';
}

// onPreviewClick(): void {
//     const selectedIds = this.taTableComponent.options.checkedRows;
//     if (selectedIds.length === 0) {
//         return this.showDialog();
//     }
    
//     // Add your preview logic here
//     console.log('Preview clicked for selected documents');
// }

onPreviewClick(): void {
  const selectedIds = this.taTableComponent.options.checkedRows;
  if (selectedIds.length === 0) {
      return this.showDialog();
  }

  const purchaseInvoiceId = selectedIds[0];
  const url = `masters/document_generator/${purchaseInvoiceId}/bill_receipt/`;
  
  // Show loading indicator
  this.showLoading = true;
  
  // Send request with preview flag
  this.http.post(url, { flag: 'preview' }, { responseType: 'blob' }).subscribe(
      (pdfBlob: Blob) => {
          this.showLoading = false;
          
          // Create blob URL and open in new window
          const blobUrl = URL.createObjectURL(pdfBlob);
          window.open(blobUrl, '_blank');
          
          // Clean up the blob URL after use
          setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
          }, 1000);
      },
      (error) => {
          this.showLoading = false;
          console.error('Error generating preview', error);
          
          // Show error toast
          this.showSuccessToast = true;
          this.toastMessage = "Error generating document preview";
          setTimeout(() => {
              this.showSuccessToast = false;
          }, 2000);
      }
  );
}

// Add this property to your component class
showLoading = false;

// onPrintClick(): void {
//     const selectedIds = this.taTableComponent.options.checkedRows;
//     if (selectedIds.length === 0) {
//         return this.showDialog();
//     }
    
//     // Add your print logic here
//     console.log('Print clicked for selected documents');
// }

onPrintClick(): void {
  const selectedIds = this.taTableComponent.options.checkedRows;
  if (selectedIds.length === 0) {
      return this.showDialog();
  }

  const purchaseInvoiceId = selectedIds[0];
  const url = `masters/document_generator/${purchaseInvoiceId}/bill_receipt/`;
  
  this.showLoading = true;
  
  this.http.post(url, { flag: 'preview' }, { responseType: 'blob' }).subscribe(
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
  // Create blob URL
  const blobUrl = URL.createObjectURL(pdfBlob);
  
  // Open in new window first
  const printWindow = window.open(blobUrl, '_blank');
  
  // Wait for window to load
  if (printWindow) {
      printWindow.onload = () => {
          try {
              // Give it a small delay to ensure PDF is rendered
              setTimeout(() => {
                  printWindow.print();
                  // Clean up after printing
                  URL.revokeObjectURL(blobUrl);
              }, 500);
          } catch (e) {
              console.error('Print error:', e);
              // Fallback to iframe if window.print() fails
              this.fallbackPrint(pdfBlob);
          }
      };
  } else {
      // If popup was blocked, fallback to iframe
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
              // Final fallback - open in new tab
              window.open(blobUrl, '_blank');
          }
          // Clean up
          setTimeout(() => {
              document.body.removeChild(iframe);
              URL.revokeObjectURL(blobUrl);
          }, 100);
      }, 1000);
  };
}

//---------------------------------------------------------------

  tableConfig: TaTableConfig = {
      apiUrl: 'purchase/bill_payments/',
      showCheckbox:true,
      pkId: "transaction_id",
      fixedFilters: [
        // {
        //   key: 'summary',
        //   value: 'true'
        // }
      ],
      pageSize: 10,
      "globalSearch": {
        keys: ['invoice_no', 'payment_receipt_no', 'payment_date', 'payment_method', 'payment_status', 'vendor_name']
      },
      export: {downloadName: 'BillPaymentList'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
        fieldKey: 'bill_no',
        name: 'Invoice No',
        sort: true
      },
      {
        fieldKey: 'payment_receipt_no',
        name: 'Receipt No',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any) => {
          return currentValue ? `₹${currentValue}` : '₹0.00';
        }
      },
      {
        fieldKey: 'outstanding_amount',
        name: 'Outstanding',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any) => {
          return currentValue ? `₹${currentValue}` : '₹0.00';
        }
      },
      // {
      //   fieldKey: 'adjusted_now',
      //   name: 'Adjusted Now',
      //   sort: true,
      //   displayType: 'map',
      //   mapFn: (currentValue: any) => {
      //     return currentValue ? `₹${currentValue}` : '₹0.00';
      //   }
      // },
      {
        fieldKey: 'adjust_now',
        name: 'Adjust Now (₹)',
        sort: true,
        isEdit: true,

        autoSave: {
          apiUrl: (row: any) => `purchase/bill_payments/${row.transaction_id}/`,
          method: 'put',

          body: (row: any, value: any, col: any) => {
            const existingAmount = Number(row.amount) || 0;
            const addValue = Number(value) || 0;
            const finalAmount = existingAmount + addValue;

            return {
              amount: finalAmount,                //  Updated amount
              payment_receipt_no: row.payment_receipt_no,
              account: row.account_id,
              vendor: row.vendor_id,
              vendor_id: row.vendor_id,
              payment_status: row.payment_status,
              voucher_no: row.voucher_no,
              invoice_no: row.invoice_no
            };
          }

          // Note: onSaveSuccess and onSaveError are injected in ngAfterViewInit to ensure `this` is correct.
        }
      },
      {
        fieldKey: 'payment_status',
        name: 'Payment Status',
        sort: true
      },
      {
        fieldKey: 'payment_date',
        name: 'Payment Date',
        sort: true
      },
        {
          fieldKey: 'vendor_name',
          name: 'Vendor',
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'purchase/purchase_invoice_order'
            },
            // {
            //   type: 'restore',
            //   label: 'Restore',
            //   confirm: true,
            //   confirmMsg: "Sure to restore?",
            //   apiUrl: 'purchase/purchase_invoice_order'
            // },
            {
              type: 'callBackFn',
              icon: 'fa fa-pen',
              label: '',
              tooltip: "Edit this record",
              callBackFn: (row, action) => {
                console.log(row);
                this.edit.emit(row.transaction_id);
              }
            }
          ]
        }
      ]
    };
  
    constructor(private router: Router, private http: HttpClient) {
  
    }

}
