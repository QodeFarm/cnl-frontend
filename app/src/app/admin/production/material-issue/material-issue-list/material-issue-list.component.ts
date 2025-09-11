import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@ta/ta-core';

@Component({
  selector: 'app-material-issue-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './material-issue-list.component.html',
  styleUrls: ['./material-issue-list.component.scss']
})
export class MaterialIssueListComponent {
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  selectedFormat: string;
  pendingAction: 'email' | 'preview' | 'print' | null = null;
  showLoading = false;
  showSuccessToast = false;
  toastMessage = '';

  tableConfig: TaTableConfig = {
    apiUrl: 'production/material-issues/?summary=true',
    showCheckbox: true,
    pkId: "material_issue_id",
    export: {
      downloadName: 'MaterialIssueList'
    },
    pageSize: 10,
    globalSearch: {
      keys: ['issue_no', 'issue_date', 'production_floor', 'reference_no', 'remarks', 'order_status', 'flow_status']
    },
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'issue_date',
        name: 'Issue Date',
        sort: true
      },
      {
        fieldKey: 'issue_no',
        name: 'Issue No',
        sort: true
      },
      // {
      //   fieldKey: 'product_name',
      //   name: 'Product Name',
      //   sort: true
      // },
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
      // {
      //   fieldKey: 'order_status',
      //   name: 'Order Status',
      //   displayType: "map",
      //   mapFn: (currentValue: any, row: any, col: any) => {
      //     return row.order_status?.status_name || row.order_status_id || '';
      //   },
      //   sort: true
      // },
      // {
      //   fieldKey: 'flow_status',
      //   name: 'Flow Status',
      //   displayType: "map",
      //   mapFn: (currentValue: any, row: any, col: any) => {
      //     return row.flow_status?.flow_status_name || row.flow_status_id || '';
      //   },
      //   sort: true
      // },
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
            apiUrl: 'production/material-issues'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              this.edit.emit(row.material_issue_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router, private http: HttpClient, private localStorage: LocalStorageService) {
  }

  refreshTable() {
    this.taTableComponent?.refresh();
  }

  // private setApiUrlBasedOnUser() {
  //   const user = this.localStorage.getItem('user');
  //   const isSuperUser = user?.is_sp_user === true;
  //   this.tableConfig.apiUrl = isSuperUser
  //     ? 'production/material-issues/?records_all=true'
  //     : 'production/material-issues/?summary=true';
  //   this.tableConfig.fixedFilters = isSuperUser
  //     ? [{ key: 'records_all', value: 'true' }]
  //     : [{ key: 'summary', value: 'true' }];
  // }

  // Format dialog logic
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
    const materialIssueId = selectedIds[0];
    const payload = { flag: "email" };
    const url = `masters/document_generator/${materialIssueId}/material_issue/`;
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
    const materialIssueId = selectedIds[0];
    const url = `masters/document_generator/${materialIssueId}/material_issue/`;
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
    const materialIssueId = selectedIds[0];
    const url = `masters/document_generator/${materialIssueId}/material_issue/`;
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