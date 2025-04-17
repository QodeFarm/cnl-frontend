import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-salesinvoice-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './salesinvoice-list.component.html',
  styleUrls: ['./salesinvoice-list.component.scss']
})

export class SalesInvoiceListComponent implements OnInit {

  ngOnInit() {
    console.log('Sorting table columns by "created_at"...');
    
    // this.tableConfig.cols.sort((a, b) => {
    //   // Assuming 'created_at' is a field in the objects inside 'cols'
    //   const dateA = new Date(a.created_at).getTime();
    //   const dateB = new Date(b.created_at).getTime();
      
    //   return dateB - dateA; // Ascending order
    // });
  }
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

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

    const saleInvoiceId = selectedIds[0]; // Assuming only one row can be selected
    const payload = { flag: "email" };
    const url = `masters/document_generator/${saleInvoiceId}/sale_invoice/`;
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
  const url = `masters/document_generator/${saleInvoiceId}/sale_invoice/`;
  
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
  const url = `masters/document_generator/${saleInvoiceId}/sale_invoice/`;
  
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
    apiUrl: 'sales/sale_invoice_order/?summary=true',
    showCheckbox: true,
    pkId: "sale_invoice_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    export: {
      downloadName: 'SalesInvoiceList'
    },
    pageSize: 10,
    "globalSearch": {
      keys: ['invoice_date','customer','invoice_no','created_at','total_amount','tax_amount','advance_amount','status_name','remarks']
    },
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'invoice_no',
        name: 'Invoice No',
        sort: true
      },
      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.customer.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'invoice_date',
        name: 'Invoice Date',
        sort: true
      }, 
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      {
        fieldKey: 'tax_amount',
        name: 'Tax Amount',
        sort: true
      },
      {
        fieldKey: 'advance_amount',
        name: 'Advance Amount',
        sort: true
      },
      {
        fieldKey: 'status_name',
        name: 'Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row?.order_status?.status_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'remarks',
        name: 'Remarks',
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
            apiUrl: 'sales/sale_invoice_order'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.sale_invoice_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router, private http: HttpClient) {}
}
