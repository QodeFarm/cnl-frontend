import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sale-returns-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './sale-returns-list.component.html',
  styleUrls: ['./sale-returns-list.component.scss']
})
export class SaleReturnsListComponent {
  //['sale_return_id', 'return_no', 'return_date', 'tax', 'return_reason', 'total_amount', 'due_date', 'tax_amount', 'customer_id', 'order_status_id', 'remarks']
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  };

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

  //-----------email sending links----------
  onSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'email') {
      this.showFormatDialog('email');
    } else if (selectedValue === 'whatsapp') {
      // Add WhatsApp logic if needed
    }

    selectElement.value = '';

    // switch (selectedValue) {
    //   case 'email':
    //     this.onMailLinkClick();
    //     break;
    //   case 'whatsapp':
    //     break;
    //   default:
    //     // Handle default case (e.g., "Mail" selected)
    //     break;
    // }

    // // Reset the dropdown to the default option
    // selectElement.value = '';
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

    const saleReturnId = selectedIds[0]; // Assuming only one row can be selected
    const payload = { flag: "email" };
    const url = `masters/document_generator/${saleReturnId}/sale_return/`;
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
  //-----------email sending links - end ----------
  //----------print & preview ------------------------
  onPrintSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'preview') {
      this.showFormatDialog('preview');
    } else if (selectedValue === 'print') {
      this.showFormatDialog('print');
    }

    selectElement.value = '';

    // switch (selectedValue) {
    //     case 'preview':
    //         this.onPreviewClick();
    //         break;
    //     case 'print':
    //         this.onPrintClick();
    //         break;
    //     default:
    //         // Handle default case
    //         break;
    // }

    // // Reset the dropdown to the default option
    // selectElement.value = '';
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

  const saleReturnId = selectedIds[0];
  const url = `masters/document_generator/${saleReturnId}/sale_return/`;
  
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
              this.refreshTable();
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

  const saleReturnId = selectedIds[0];
  const url = `masters/document_generator/${saleReturnId}/sale_return/`;
  
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
//---------------print & Preview - end --------------------------
  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_return_order/?summary=true',
    showCheckbox: true,
    pkId: "sale_return_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    "globalSearch": {
      keys: ['return_date','customer','return_no','status_name','tax','return_reason','due_date','tax_amount','total_amount','remarks']
    },
    export: {downloadName: 'SaleReturnsList'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'return_date',
        name: 'Return Date',
        sort: true
      },
      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.customer.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'return_no',
        name: 'Return No',
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
      // {
      //   fieldKey: 'tax',
      //   name: 'Tax',
      //   sort: true
      // },
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
        fieldKey: 'return_reason',
        name: 'Return Reason',
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
            apiUrl: 'sales/sale_return_order'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.sale_return_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router, private http: HttpClient) {}
  }