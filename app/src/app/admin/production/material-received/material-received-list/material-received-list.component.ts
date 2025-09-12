import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@ta/ta-core';

@Component({
  selector: 'app-material-received-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './material-received-list.component.html',
  styleUrls: ['./material-received-list.component.scss']
})
export class MaterialReceivedListComponent {
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  selectedFormat: string;
  pendingAction: 'email' | 'preview' | 'print' | null = null;
  showLoading = false;
  showSuccessToast = false;
  toastMessage = '';

  tableConfig: TaTableConfig = {
    apiUrl: 'production/material-received/?summary=true',
    showCheckbox: true,
    pkId: "material_received_id",
    fixedFilters: [],
    export: {
      downloadName: 'MaterialReceivedList'
    },
    pageSize: 10,
    globalSearch: {
      keys: ['receipt_no', 'receipt_date', 'production_floor', 'reference_no', 'remarks', 'order_status', 'flow_status']
    },
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'receipt_date',
        name: 'Receipt Date',
        sort: true
      },
      {
        fieldKey: 'receipt_no',
        name: 'Receipt No',
        sort: true
      },
      {
        fieldKey: 'production_floor',
        name: 'Production Floor',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.production_floor?.name || row.production_floor_id || '';
        },
        sort: true
      },
      {
        fieldKey: 'reference_no',
        name: 'Reference No',
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
            apiUrl: 'production/material-received'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              this.edit.emit(row.material_received_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router, private http: HttpClient, private localStorage: LocalStorageService) {}

  refreshTable() {
    this.taTableComponent?.refresh();
  }

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

  proceedWithSelectedAction(): void {
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
      // WhatsApp logic if needed
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

  onMailLinkClick(): void {
    const selectedIds = this.taTableComponent.options.checkedRows;
    if (selectedIds.length === 0) {
      return this.showDialog();
    }
    const materialReceivedId = selectedIds[0];
    const payload = { flag: "email" };
    const url = `masters/document_generator/${materialReceivedId}/material_received/`;
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
    const materialReceivedId = selectedIds[0];
    const url = `masters/document_generator/${materialReceivedId}/material_received/`;
    this.showLoading = true;
    this.http.post(url, { flag: 'preview' }, { responseType: 'blob' }).subscribe(
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
        this.showSuccessToast = true;
        this.toastMessage = "Error generating document preview";
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 2000);
      }
    );
  }

  onPrintClick(): void {
    const selectedIds = this.taTableComponent.options.checkedRows;
    if (selectedIds.length === 0) {
      return this.showDialog();
    }
    const materialReceivedId = selectedIds[0];
    const url = `masters/document_generator/${materialReceivedId}/material_received/`;
    this.showLoading = true;
    this.http.post(url, { flag: 'preview' }, { responseType: 'blob' }).subscribe(
      (pdfBlob: Blob) => {
        this.showLoading = false;
        this.openAndPrintPdf(pdfBlob);
      },
      (error) => {
        this.showLoading = false;
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
          window.open(blobUrl, '_blank');
        }
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
        }, 100);
      }, 1000);
    };
  }
}