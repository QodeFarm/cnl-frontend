import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-purchasereturnorders-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './purchasereturnorders-list.component.html',
  styleUrls: ['./purchasereturnorders-list.component.scss']
})
export class PurchasereturnordersListComponent {
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  //-----------email sending links----------
  // onSelect(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const selectedValue = selectElement.value;

  //   switch (selectedValue) {
  //     case 'email':
  //       this.onMailLinkClick();
  //       break;
  //     case 'whatsapp':
  //       break;
  //     default:
  //       // Handle default case (e.g., "Mail" selected)
  //       break;
  //   }

  //   // Reset the dropdown to the default option
  //   selectElement.value = '';
  // }
selectedFormat: string;
pendingAction: 'email' | 'preview' | 'print' | null = null;

// Show format selection popup
private showFormatDialog(action: 'email' | 'preview' | 'print'): void {
  this.pendingAction = action;
  const dialog = document.getElementById('formatDialog');
  if (dialog) dialog.style.display = 'flex';
}

closeFormatDialog(): void {
  const dialog = document.getElementById('formatDialog');
  if (dialog) dialog.style.display = 'none';
  this.pendingAction = null;
}

// Inject format and proceed with existing method
proceedWithSelectedAction(): void {
  // this.closeFormatDialog();

  // Inject format in request manually (monkey patch)
  const originalPost = this.http.post.bind(this.http);
  this.http.post = (url: string, body: any, options?: any) => {
    if (typeof body === 'object' && body !== null && this.selectedFormat) {
      body.format = this.selectedFormat;
    }
    return originalPost(url, body, options);
  };

  switch (this.pendingAction) {
    case 'email':
      this.onMailLinkClick(); break;
    case 'preview':
      this.onPreviewClick(); break;
    case 'print':
      this.onPrintClick(); break;
  }

  this.pendingAction = null;
  this.closeFormatDialog();
}

onSelect(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const selectedValue = selectElement.value;

  if (selectedValue === 'email') {
    this.showFormatDialog('email');
  } else if (selectedValue === 'whatsapp') {
    // Add WhatsApp logic if needed
  }

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

    const purchaseReturnId = selectedIds[0]; // Assuming only one row can be selected
    const payload = { flag: "email" };
    const url = `masters/document_generator/${purchaseReturnId}/purchase_return/`;
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
        // alert('Error sending email. Please try again.');
      }
    );
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

onPreviewClick(): void {
  const selectedIds = this.taTableComponent.options.checkedRows;
  if (selectedIds.length === 0) {
      return this.showDialog();
  }

  const purchaseReturnId = selectedIds[0];
  const url = `masters/document_generator/${purchaseReturnId}/purchase_return/`;
  
  // Show loading indicator
  this.showLoading = true;
  
  // Send request with preview flag
  this.http.post(url, { flag: 'preview' }, { responseType: 'blob' }).subscribe(
      (pdfBlob: Blob) => {
          this.showLoading = false;
          this.refreshTable();
          
          // Create blob URL and open in new window
          const blobUrl = URL.createObjectURL(pdfBlob);
          window.open(blobUrl, '_blank');
          
          // Clean up the blob URL after use
          setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
              // this.refreshTable();
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

onPrintClick(): void {
  const selectedIds = this.taTableComponent.options.checkedRows;
  if (selectedIds.length === 0) {
      return this.showDialog();
  }

  const purchaseReturnId = selectedIds[0];
  const url = `masters/document_generator/${purchaseReturnId}/purchase_return/`;
  
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
  //-----------email sending links - end ----------

  tableConfig: TaTableConfig = {
    apiUrl: 'purchase/purchase_return_order/?summary=true',
    showCheckbox: true,
    pkId: "purchase_return_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    globalSearch: {
      keys: ['purchase_type', 'return_no', 'return_reason', 'due_date', 'tax', 'tax_amount', 'total_amount', 'vendor', 'status_name', 'remarks']
    },
    export: {downloadName: 'PurchaseReturnList'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'purchase_type',
        name: 'Purchase Type',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.purchase_type.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'return_no',
        name: 'Return No',
        sort: true
      },
      {
        fieldKey: 'return_reason',
        name: 'Return Reason',
        sort: true
      },
      {
        fieldKey: 'due_date',
        name: 'Due Date',
        sort: true
      },
      {
        fieldKey: 'tax',
        name: 'Tax',
        sort: true
      },
      {
        fieldKey: 'tax_amount',
        name: 'Tax Amount',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      {
        fieldKey: 'vendor',
        name: 'Vendor',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.vendor.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'status_name',
        name: 'Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.order_status.status_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'remarks',
        name: 'Remarks',
        sort: true
      },
      {
        fieldKey: "actions",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            confirm: true,
            confirmMsg: "Sure to delete?",
            apiUrl: 'purchase/purchase_return_order'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'purchase/purchase_return_order'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.purchase_return_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router, private http: HttpClient) {}
}
