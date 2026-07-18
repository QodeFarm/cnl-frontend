import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { DoubleClickNavigationService } from 'src/app/services/double-click-navigation.service';
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

  get absBalance(): string {
    return Math.abs(parseFloat(this.finalBalance) || 0).toFixed(2);
  }

  constructor(private http: HttpClient, private dblClickNav: DoubleClickNavigationService) {}

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
      rowEvents: {
        dblclick: this.dblClickNav.createNavigateHandler({
          moduleName: 'Finance',
          sectionName: 'Account Ledger',
          resolveFn: (row: any) => {
            const routeMap: Record<string, string> = {
              sale_invoice:      '/admin/sales/salesinvoice',
              sale_order:        '/admin/sales',
              sale_return:       '/admin/sales/sale-returns',
              credit_note:       '/admin/sales/credit-note',
              debit_note:        '/admin/sales/debit-note',
              delivery_challan:  '/admin/sales/delivery-challan',
              payment_receipt:   '/admin/sales/payment-receipt',
              purchase_invoice:  '/admin/purchase/purchase-invoice',
              purchase_order:    '/admin/purchase',
              purchase_return:   '/admin/purchase/purchasereturns',
              bill_payment:      '/admin/purchase/bill-payments',
              journal_entry:     '/admin/finance/journal-entry',
              journal_voucher:   '/admin/finance/journal-voucher',
              opening_balance:   '/admin/finance/opening-balance',
            };
            const srcType: string = row?.source_type;
            const srcId: string   = row?.source_id;
            if (!srcType || !srcId) return null;
            const route = routeMap[srcType];
            if (!route) return null;
            return { route, editId: srcId };
          }
        }),
      },
      pageSize: 10,
      scrollY: 'calc(100vh - 430px)',
      globalSearch: {
        keys: ['voucher_no', 'description', 'debit', 'credit', 'running_balance']
      },
      defaultSort: null,
      export: { downloadName: 'AccountLedger' },
      cols: [
        {
          fieldKey: 'voucher_no',
          name: 'Voucher No',
          width: '190px',
          sort: true,
          displayType: 'map',
          mapFn: (value: any) => {
            if (!value) return '—';
            return `<span class="ledger-voucher">${value}</span>`;
          }
        },
        {
          // Accounting date (entry_date, falls back to created_at for legacy rows) —
          // NOT created_at, which is the row's creation timestamp and never reflects
          // an edited invoice/voucher date.
          fieldKey: 'date',
          name: 'Date',
          width: '110px',
          sort: true,
          displayType: 'date'
        },
        {
          // Description cell = the counter-account ("Particulars") as a highlighted heading,
          // with the transaction narration below it (Tally / AlignBooks style). counter_account
          // is computed per row by the backend = the account on the other side of the entry.
          fieldKey: 'description',
          name: 'Description',
          width: '420px',
          sort: false,
          displayType: 'map',
          mapFn: (value: any, row: any) => {
            // Escape before building HTML - counter_account and description carry account/
            // customer/vendor names, which are user-controlled and would otherwise allow
            // stored XSS when injected as innerHTML by the table.
            const esc = (s: any) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
              ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
            const acct = (row?.counter_account && row.counter_account !== '-')
              ? `<span class="ledger-acct-head">${esc(row.counter_account)}</span>`
              : '';
            const desc = value
              ? `<span class="ledger-acct-desc">${esc(value).split('\n').join('<br/>')}</span>`
              : '';
            return acct + desc;
          }
        },
        {
          fieldKey: 'debit',
          name: 'Debit',
          width: '120px',
          sort: true,
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
          width: '120px',
          sort: true,
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
          width: '150px',
          sort: false,
          displayType: 'map',
          mapFn: (_: any, row: any) => {
            const v   = parseFloat(row.running_balance || row.balance) || 0;
            const abs = `₹${Math.abs(v).toFixed(2)}`;
            if (v > 0) return `<span class="ledger-dr ledger-bal">${abs} <em class="bal-tag">Dr</em></span>`;
            if (v < 0) return `<span class="ledger-cr ledger-bal">${abs} <em class="bal-tag">Cr</em></span>`;
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
