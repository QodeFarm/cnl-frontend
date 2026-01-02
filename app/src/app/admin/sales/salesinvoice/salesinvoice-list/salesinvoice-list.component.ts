import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@ta/ta-core';

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
    
  }
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };


  selectedFormat: string = "CNL_Standard_Excl" //CNL_Standard_Excl
  pendingAction: 'email' | 'preview' | 'print' | 'whatsapp' | null = null;

  // Show format selection popup
  private showFormatDialog(action: 'email' | 'preview' | 'print' | 'whatsapp'): void {
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

    const saleInvoiceId = selectedIds[0];
    const url = `masters/document_generator/${saleInvoiceId}/sale_invoice/`; 

    const payload = {
      flag: 'whatsapp',
      format: this.selectedFormat
    };

    this.showLoading = true;

    this.http.post<any>(url, payload).subscribe(
      (response) => {
        this.showLoading = false;
        this.refreshTable();

        //  CASE 1: WATI (server sends directly)
        if (response.mode === 'wati') {
          this.showSuccessToast = true;
          this.toastMessage = 'WhatsApp message sent successfully';
          setTimeout(() => this.showSuccessToast = false, 2000);
        }

        //  CASE 2: Click-to-chat (local / dev)
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
  // In your component (e.g., SalesListComponent)
  onSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'email') {
      this.showFormatDialog('email');
    } else if (selectedValue === 'whatsapp') {
      // Add WhatsApp logic if needed
      this.showFormatDialog('whatsapp');
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

    const saleInvoiceId = selectedIds[0]; // Assuming only one row can be selected
    const payload = { flag: "email", format: this.selectedFormat };
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

  const saleInvoiceId = selectedIds[0];
  const url = `masters/document_generator/${saleInvoiceId}/sale_invoice/`;
  
  // Show loading indicator
  this.showLoading = true;
  
  // Send request with preview flag
  this.http.post(url, { flag: 'preview', format: this.selectedFormat }, { responseType: 'blob' }).subscribe(
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

  const saleInvoiceId = selectedIds[0];
  const url = `masters/document_generator/${saleInvoiceId}/sale_invoice/`;
  
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
    apiUrl: '',//'sales/sale_invoice_order/?records_all=true',
    showCheckbox: true,
    pkId: "sale_invoice_id",
    fixedFilters: [
      // {
      //   key: 'summary',
      //   value: 'true'
      // }
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
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          // return `${row.customer.name}`;
          return row.customer?.name || row.customer_id || '';
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
      // {
      //   fieldKey: 'status_name',
      //   name: 'Status',
      //   displayType: "map",
      //   mapFn: (currentValue: any, row: any, col: any) => {
      //     return `${row?.order_status?.status_name}`;
      //   },
      //   sort: true
      // },
      {
        fieldKey: 'order_status',
        name: 'Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          // return `${row.order_status.status_name}`;
          return row.order_status?.status_name || row.order_status_id || '';
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
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'sales/sale_invoice_order'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.sale_invoice_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router, private http: HttpClient, private localStorage: LocalStorageService) {
    this.setApiUrlBasedOnUser()
  }

  private setApiUrlBasedOnUser() {
    const user = this.localStorage.getItem('user');
    const isSuperUser = user?.is_sp_user === true;

    // Set the API URL conditionally
    this.tableConfig.apiUrl = isSuperUser
      ? 'sales/sale_invoice_order/?records_all=true'
      : 'sales/sale_invoice_order/?summary=true';

    // Also set fixed filters accordingly (optional)
    this.tableConfig.fixedFilters = isSuperUser
      ? [{ key: 'records_all', value: 'true' }]
      : [{ key: 'summary', value: 'true' }];
  }

}
