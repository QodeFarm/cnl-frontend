import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';
import { TaCurdModalComponent } from 'projects/ta-curd/src/lib/ta-curd-modal/ta-curd-modal.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-account-ledger',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, NzDropDownModule, NzButtonModule, NzIconModule],
  templateUrl: './account-ledger.component.html',
  styleUrls: ['./account-ledger.component.scss']
})
export class AccountLedgerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(TaCurdModalComponent) curdModalComponent: TaCurdModalComponent;
  tableComponent: TaTableComponent;

  // ── Balance summary ───────────────────────────────────────────────────────
  openingBalance: string  = '0.00';
  totalDebit: string      = '0.00';
  totalCredit: string     = '0.00';
  finalBalance: string    = '0.00';
  showBalanceSummary: boolean = false;

  // ── Account identity (for header) ────────────────────────────────────────
  accountName: string      = '';
  accountTypeLabel: string = '';

  // ── Print / document state ────────────────────────────────────────────────
  public selectedAccountType: string | null = null;
  public selectedAccountId: string | null   = null;
  public selectedCity: string | null        = null;
  public selectedPeriod: string | null      = null;
  public fromDate: string | null            = null;
  public toDate: string | null              = null;

  get isPositiveBalance(): boolean {
    return parseFloat(this.finalBalance) > 0;
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.curdConfig.tableConfig.apiUrl = '';
    window['accountLedgerComponentInstance'] = this;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.curdModalComponent?.table) {
        this.tableComponent = this.curdModalComponent.table;
      }
    }, 500);
  }

  ngOnDestroy() {
    delete window['accountLedgerComponentInstance'];
  }

  // ── Called by ta-table when user selects an account ───────────────────────
  loadLedgerData(type: string, id: string, name: string = '') {
    this.selectedAccountType = type;
    this.selectedAccountId   = id;
    this.accountName         = name;
    this.accountTypeLabel    =
      type === 'customer' ? 'Customer' :
      type === 'vendor'   ? 'Vendor'   : 'Ledger Account';

    this.curdConfig.tableConfig.apiUrl = `finance/journal_entry_lines_list/${id}/`;
    this.tableComponent?.reload();
  }

  // ── Called by ta-table when user clears the selection ────────────────────
  clearLedgerData() {
    this.selectedAccountType = null;
    this.selectedAccountId   = null;
    this.selectedCity        = null;
    this.accountName         = '';
    this.accountTypeLabel    = '';
    this.openingBalance      = '0.00';
    this.totalDebit          = '0.00';
    this.totalCredit         = '0.00';
    this.finalBalance        = '0.00';
    this.showBalanceSummary  = false;

    this.curdConfig.tableConfig.apiUrl = '';

    if (this.tableComponent) {
      this.tableComponent.rows      = [];
      this.tableComponent.total     = 0;
      this.tableComponent.pageIndex = 1;
    }
  }

  // ── Print / Preview ───────────────────────────────────────────────────────
  private buildDocumentUrl(): string | null {
    let type = (this.selectedAccountType || '').trim().toLowerCase();
    const id = this.selectedAccountId;

    if (!type) return null;

    const keyMap: Record<string, string> = {
      customer: 'customer_id',
      vendor:   'vendor_id',
      general:  'ledger_account_id',
      ledger:   'ledger_account_id',
    };
    const backendKey = keyMap[type] || (type.includes('ledger') ? 'ledger_account_id' : null);
    if (!backendKey) return null;

    const params: string[] = [];
    if (id) params.push(`${backendKey}=${id}`);
    if (this.selectedCity && backendKey !== 'ledger_account_id') params.push(`city=${this.selectedCity}`);
    if (this.selectedPeriod) params.push(`period_name=${this.selectedPeriod}`);
    if (this.fromDate)  params.push(`created_at_after=${this.formatDate(this.fromDate)}`);
    if (this.toDate)    params.push(`created_at_before=${this.formatDate(this.toDate)}`);

    return `masters/document_generator/${backendKey}/account_ledger/?${params.join('&')}`;
  }

  private formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  onPreviewClick(): void {
    const url = this.buildDocumentUrl();
    if (!url) return;
    this.http.post(url, { flag: 'preview' }, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      },
      error: err => console.error('Preview error:', err)
    });
  }

  onPrintClick(): void {
    const url = this.buildDocumentUrl();
    if (!url) return;
    this.http.post(url, { flag: 'print' }, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const win = window.open(blobUrl, '_blank');
        if (win) {
          win.onload = () => setTimeout(() => { win.print(); URL.revokeObjectURL(blobUrl); }, 500);
        } else {
          URL.revokeObjectURL(blobUrl);
        }
      },
      error: err => console.error('Print error:', err)
    });
  }

  // ── Table configuration ───────────────────────────────────────────────────
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: '',
      title: 'Account Ledger',
      pkId: 'journal_entry_line_id',
      pageSize: 10,
      globalSearch: {
        keys: ['voucher_no', 'description', 'debit', 'credit', 'running_balance']
      },
      defaultSort: null,
      export: { downloadName: 'AccountLedger' },
      cols: [
        {
          fieldKey: 'voucher_no',
          name: 'Voucher No',
          sort: false,
        },
        {
          fieldKey: 'created_at',
          name: 'Date',
          sort: false,
          displayType: 'date'
        },
        {
          fieldKey: 'description',
          name: 'Description',
          sort: false,
          displayType: 'map',
          mapFn: (value: any) => {
            if (!value) return '';
            const lines = value.split('\n');
            lines[0] = `<strong>${lines[0]}</strong>`;
            return lines.join('<br/>');
          }
        },
        {
          fieldKey: 'debit',
          name: 'Debit',
          sort: false,
          displayType: 'map',
          mapFn: (_: any, row: any) => {
            const v = parseFloat(row.debit) || 0;
            if (v === 0) return '<span class="ledger-muted">—</span>';
            return `<span class="ledger-dr">₹${v.toFixed(2)}</span>`;
          }
        },
        {
          fieldKey: 'credit',
          name: 'Credit',
          sort: false,
          displayType: 'map',
          mapFn: (_: any, row: any) => {
            const v = parseFloat(row.credit) || 0;
            if (v === 0) return '<span class="ledger-muted">—</span>';
            return `<span class="ledger-cr">₹${v.toFixed(2)}</span>`;
          }
        },
        {
          fieldKey: 'running_balance',
          name: 'Balance',
          sort: false,
          displayType: 'map',
          mapFn: (_: any, row: any) => {
            const v   = parseFloat(row.running_balance || row.balance) || 0;
            const abs = `₹${Math.abs(v).toFixed(2)}`;
            if (v > 0) return `<span class="ledger-cr ledger-bal">${abs} Dr</span>`;
            if (v < 0) return `<span class="ledger-dr ledger-bal">${abs} Cr</span>`;
            return '<span class="ledger-muted">₹0.00</span>';
          }
        }
      ]
    },
    formConfig: {
      submit: {},
      formState: {},
      model: {},
      fields: []
    }
  };
}
