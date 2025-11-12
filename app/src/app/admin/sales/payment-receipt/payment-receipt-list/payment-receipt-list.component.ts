import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from '@ta/ta-table';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@ta/ta-core';

@Component({
  selector: 'app-payment-receipt-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './payment-receipt-list.component.html',
  styleUrls: ['./payment-receipt-list.component.scss']
})
export class PaymentReceiptListComponent {
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

   constructor(private router: Router, private http: HttpClient, private localStorage: LocalStorageService) {
    this.setApiUrlBasedOnUser();
  }

  refreshTable() {
    this.taTableComponent?.refresh();
  };

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

    const saleInvoiceId = selectedIds[0]; // Assuming only one row can be selected
    const payload = { flag: "email" };
    const url = `masters/document_generator/${saleInvoiceId}/payment_receipt/`;
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

  const saleInvoiceId = selectedIds[0];
  const url = `masters/document_generator/${saleInvoiceId}/payment_receipt/`;
  
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

  const saleInvoiceId = selectedIds[0];
  const url = `masters/document_generator/${saleInvoiceId}/payment_receipt/`;
  
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

  tableConfig: TaTableConfig = {
    apiUrl: '', //'sales/payment_transactions/',
    showCheckbox: true,
    pkId: "transaction_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['invoice_no', 'payment_receipt_no', 'payment_date', 'payment_method', 'payment_status']
    },
    export: { downloadName: 'PaymentReceiptList' },
    defaultSort: { key: 'payment_date', value: 'descend' },
    cols: [
      {
        fieldKey: 'invoice_no',
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
      {
        fieldKey: 'adjusted_now',
        name: 'Adjusted Now',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any) => {
          return currentValue ? `₹${currentValue}` : '₹0.00';
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
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          // {
          //   type: 'delete',
          //   label: 'Delete',
          //   apiUrl: 'sales/payment_transactions',
          //   confirm: true,
          //   confirmMsg: "sure to delete?"
          // },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row: any) => {
              this.edit.emit(row.transaction_id);
            }
          }
        ]
      }
    ]
  };

  private setApiUrlBasedOnUser() {
    const user = this.localStorage.getItem('user');
    const isSuperUser = user?.is_sp_user === true;

    // ✅ Correct URL for payment_transactions
    this.tableConfig.apiUrl = isSuperUser
      ? 'sales/payment_transactions/?records_all=true'
      : 'sales/payment_transactions/';

    // ✅ If you really want, you can keep this too — but it's optional now
    this.tableConfig.fixedFilters = isSuperUser
      ? [{ key: 'records_all', value: 'true' }]
      : [];
  }

}

