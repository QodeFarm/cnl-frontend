import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delivery-challan-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './delivery-challan-list.component.html',
  styleUrls: ['./delivery-challan-list.component.scss']
})
export class DeliveryChallanListComponent implements OnInit {

  @Input() isCustomerPortal: boolean = false;
  @Output('edit') edit = new EventEmitter<string>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  customerId: string | null = null;

  // Print / Preview
  selectedFormat: string = 'CNL_Standard_Excl';
  pendingAction: 'preview' | 'print' | null = null;
  showLoading = false;
  showSuccessToast = false;
  toastMessage = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.isCustomerPortal = data['customerView'] || false;
      if (this.isCustomerPortal) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.customerId = user.id || null;
        this.updateTableConfigForCustomer();
      }
    });
  }

  refreshTable(): void {
    this.taTableComponent?.refresh();
  }

  updateTableConfigForCustomer(): void {
    this.tableConfig.apiUrl = `sales/delivery_challan/?customer_id=${this.customerId}`;
    this.tableConfig.showCheckbox = false;
    this.tableConfig.export = undefined;
    this.tableConfig.fixedFilters = [
      { key: 'customer_id', value: this.customerId }
    ];
    this.tableConfig.cols = this.tableConfig.cols.map(col => {
      if (col.name === 'Action') {
        col.actions = [
          {
            type: 'callBackFn',
            icon: 'fa fa-eye',
            label: '',
            tooltip: 'View Delivery Challan',
            callBackFn: (row: any) => {
              this.edit.emit(row.delivery_challan_id);
            }
          }
        ];
      }
      return col;
    });
  }

  // ─── Format dialog ───────────────────────────────────────────────────────────
  private showFormatDialog(action: 'preview' | 'print'): void {
    this.pendingAction = action;
    const dialog = document.getElementById('dcFormatDialog');
    if (dialog) dialog.style.display = 'flex';
  }

  closeFormatDialog(): void {
    const dialog = document.getElementById('dcFormatDialog');
    if (dialog) dialog.style.display = 'none';
    this.pendingAction = null;
  }

  proceedWithSelectedAction(): void {
    if (this.pendingAction === 'preview') {
      this.onPreviewClick();
    } else if (this.pendingAction === 'print') {
      this.onPrintClick();
    }
    this.pendingAction = null;
    this.closeFormatDialog();
  }

  // ─── "No row selected" dialog ────────────────────────────────────────────────
  showNoSelectionDialog(): void {
    const dialog = document.getElementById('dcNoSelectionDialog');
    if (dialog) dialog.style.display = 'flex';
  }

  closeNoSelectionDialog(): void {
    const dialog = document.getElementById('dcNoSelectionDialog');
    if (dialog) dialog.style.display = 'none';
  }

  // ─── Print select dropdown ───────────────────────────────────────────────────
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

  // ─── Preview ─────────────────────────────────────────────────────────────────
  onPreviewClick(): void {
    const selectedIds = this.taTableComponent.options.checkedRows;
    if (selectedIds.length === 0) {
      return this.showNoSelectionDialog();
    }
    if (selectedIds.length > 1) {
      this.toastMessage = `${selectedIds.length} rows selected — previewing first record only.`;
      this.showSuccessToast = true;
      setTimeout(() => this.showSuccessToast = false, 3000);
    }

    const challanId = selectedIds[0];
    const url = `masters/document_generator/${challanId}/delivery_challan/`;

    this.showLoading = true;

    this.http.post(url, { flag: 'preview', format: this.selectedFormat }, { responseType: 'blob' }).subscribe({
      next: (pdfBlob: Blob) => {
        this.showLoading = false;
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      },
      error: (error) => {
        this.showLoading = false;
        console.error('Error generating DC preview', error);
        this.toastMessage = 'Error generating document preview';
        this.showSuccessToast = true;
        setTimeout(() => this.showSuccessToast = false, 3000);
      }
    });
  }

  // ─── Print ───────────────────────────────────────────────────────────────────
  onPrintClick(): void {
    const selectedIds = this.taTableComponent.options.checkedRows;
    if (selectedIds.length === 0) {
      return this.showNoSelectionDialog();
    }
    if (selectedIds.length > 1) {
      this.toastMessage = `${selectedIds.length} rows selected — printing first record only.`;
      this.showSuccessToast = true;
      setTimeout(() => this.showSuccessToast = false, 3000);
    }

    const challanId = selectedIds[0];
    const url = `masters/document_generator/${challanId}/delivery_challan/`;

    this.showLoading = true;

    this.http.post(url, { flag: 'preview', format: this.selectedFormat }, { responseType: 'blob' }).subscribe({
      next: (pdfBlob: Blob) => {
        this.showLoading = false;
        this.openAndPrintPdf(pdfBlob);
      },
      error: (error) => {
        this.showLoading = false;
        console.error('Error generating DC print document', error);
        this.toastMessage = 'Error generating document for printing';
        this.showSuccessToast = true;
        setTimeout(() => this.showSuccessToast = false, 3000);
      }
    });
  }

  private openAndPrintPdf(pdfBlob: Blob): void {
    const blobUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(blobUrl, '_blank');

    if (printWindow) {
      printWindow.onload = () => {
        try {
          setTimeout(() => {
            printWindow.print();
            URL.revokeObjectURL(blobUrl);
          }, 500);
        } catch (e) {
          console.error('Print error:', e);
          this.fallbackPrint(pdfBlob);
        }
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
          console.error('Iframe print error:', e);
          window.open(blobUrl, '_blank');
        }
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
        }, 100);
      }, 1000);
    };
  }

  // ─── Table config ─────────────────────────────────────────────────────────────
  tableConfig: TaTableConfig = {
    apiUrl: 'sales/delivery_challan/',
    showCheckbox: true,
    pkId: 'delivery_challan_id',
    pageSize: 10,
    globalSearch: {
      keys: ['challan_no', 'customer', 'challan_date', 'total_amount', 'status_name', 'is_converted']
    },
    export: { downloadName: 'DeliveryChallanList' },
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'challan_no',
        name: 'Challan No',
        sort: true
      },
      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: 'map',
        mapFn: (_currentValue: any, row: any) => {
          return row.customer?.name || '';
        },
        sort: true
      },
      {
        fieldKey: 'challan_date',
        name: 'Challan Date',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      {
        fieldKey: 'is_converted',
        name: 'Converted',
        displayType: 'map',
        mapFn: (_currentValue: any, row: any) => {
          return row.is_converted ? 'Yes' : 'No';
        },
        sort: false
      },
      {
        fieldKey: 'status_name',
        name: 'Status',
        displayType: 'map',
        mapFn: (_currentValue: any, row: any) => {
          return row.order_status?.status_name || '';
        },
        sort: true
      },
      {
        fieldKey: 'code',
        name: 'Action',
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            confirm: true,
            confirmMsg: 'Sure to delete?',
            apiUrl: 'sales/delivery_challan'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: 'Sure to restore?',
            apiUrl: 'sales/delivery_challan'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: 'Edit this record',
            callBackFn: (row: any) => {
              this.edit.emit(row.delivery_challan_id);
            }
          }
        ]
      }
    ]
  };
}
