import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, catchError, debounceTime } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

export interface SettingsModule {
  key: string;
  label: string;
  icon: string;
  available: boolean;
}

export interface LedgerAccount {
  ledger_account_id: string;
  name: string;
  type: string;
}

export interface FinanceSettings {
  settings_id?: string;
  company_id?: string;
  sales_ledger_account?: string | null;
  purchase_ledger_account?: string | null;
  receivables_account?: string | null;
  payables_account?: string | null;
  cash_account?: string | null;
  bank_account?: string | null;
  discount_account?: string | null;
  round_off_account?: string | null;
  opening_balance_equity_account?: string | null;
  books_beginning_date?: string | null;
  // Sales notifications
  notify_sale_order_whatsapp?: boolean;
}

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzSelectModule,
    NzSpinModule,
    NzIconModule,
    NzToolTipModule,
    NzTagModule,
    NzDividerModule,
    NzSwitchModule,
  ],
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss'],
})
export class CompanySettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  activeModule = 'finance';

  modules: SettingsModule[] = [
    { key: 'finance',   label: 'Finance',   icon: 'fund',          available: true  },
    { key: 'inventory', label: 'Inventory', icon: 'inbox',         available: false },
    { key: 'sales',     label: 'Sales',     icon: 'shopping-cart', available: true  },
    { key: 'purchase',  label: 'Purchase',  icon: 'shopping',      available: false },
    { key: 'hrms',      label: 'HRMS',      icon: 'team',          available: false },
  ];

  companyId: string | null = null;
  loading = true;
  saving = false;

  allAccounts: LedgerAccount[] = [];
  generalAccounts: LedgerAccount[]  = [];
  customerAccounts: LedgerAccount[] = [];
  vendorAccounts: LedgerAccount[]   = [];
  cashAccounts: LedgerAccount[]     = [];
  bankAccounts: LedgerAccount[]     = [];

  settings: FinanceSettings = {};
  // Auto-save: no Save button. Every change persists after a short debounce.
  saveStatus: 'idle' | 'saving' | 'saved' = 'idle';
  private saveTrigger$ = new Subject<void>();

  constructor(private http: HttpClient, private message: NzMessageService) {}

  ngOnInit(): void {
    // Debounced auto-save: rapid changes collapse into a single PATCH.
    this.saveTrigger$
      .pipe(debounceTime(600), takeUntil(this.destroy$))
      .subscribe(() => this.persist());

    this.http
      .get<{ data: any[] }>('company/companies/')
      .pipe(
        switchMap((res) => {
          if (!res?.data?.length) return of(null);
          this.companyId = res.data[0].company_id;
          return this.http.get<any>(`company/company-settings/${this.companyId}/`);
        }),
        catchError(() => of(null)),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        if (res?.data) this.settings = res.data;
        this.loadLedgerAccounts();
      });
  }

  private loadLedgerAccounts(): void {
    this.http
      .get<{ data: LedgerAccount[] }>('customers/ledger_accounts/?summary=true&limit=1000')
      .pipe(
        catchError(() => of({ data: [] })),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.allAccounts      = res?.data ?? [];
        this.generalAccounts  = this.allAccounts.filter((a) => a.type === 'General');
        this.customerAccounts = this.allAccounts.filter((a) => a.type === 'Customer');
        this.vendorAccounts   = this.allAccounts.filter((a) => a.type === 'Vendor');
        this.cashAccounts     = this.allAccounts.filter((a) => a.type === 'Cash');
        this.bankAccounts     = this.allAccounts.filter((a) => a.type === 'Bank');
        this.loading = false;
      });
  }

  setActiveModule(key: string, available: boolean): void {
    if (!available) return;
    this.activeModule = key;
  }

  /** Called on every field change — queues a debounced auto-save. */
  autoSave(): void {
    if (this.loading) return; // ignore changes fired while loading the form
    this.saveStatus = 'saving';
    this.saveTrigger$.next();
  }

  /** Persists the current settings. No toast on success — the inline status shows it. */
  private persist(): void {
    if (!this.companyId) {
      this.message.error('Company not found. Please set up the company profile first.');
      this.saveStatus = 'idle';
      return;
    }
    this.saveStatus = 'saving';
    const payload: Partial<FinanceSettings> = {
      sales_ledger_account:    this.settings.sales_ledger_account    || null,
      purchase_ledger_account: this.settings.purchase_ledger_account || null,
      receivables_account:     this.settings.receivables_account     || null,
      payables_account:        this.settings.payables_account        || null,
      cash_account:            this.settings.cash_account            || null,
      bank_account:            this.settings.bank_account            || null,
      discount_account:        this.settings.discount_account        || null,
      round_off_account:       this.settings.round_off_account       || null,
      opening_balance_equity_account: this.settings.opening_balance_equity_account || null,
      books_beginning_date:    this.settings.books_beginning_date    || null,
      // Sales notifications toggle (default OFF until an admin turns it on)
      notify_sale_order_whatsapp: !!this.settings.notify_sale_order_whatsapp,
    };

    this.http
      .patch<any>(`company/company-settings/${this.companyId}/`, payload)
      .pipe(
        catchError((err) => {
          this.message.error(err?.error?.message || 'Could not save. Please try again.');
          this.saveStatus = 'idle';
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        if (res) {
          if (res.data) this.settings = res.data;
          this.saveStatus = 'saved';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
