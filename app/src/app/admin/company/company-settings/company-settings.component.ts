import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';

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
    { key: 'sales',     label: 'Sales',     icon: 'shopping-cart', available: false },
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

  constructor(private http: HttpClient, private message: NzMessageService) {}

  ngOnInit(): void {
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

  onSave(): void {
    if (!this.companyId) {
      this.message.error('Company not found. Please set up the company profile first.');
      return;
    }
    this.saving = true;
    const payload: Partial<FinanceSettings> = {
      sales_ledger_account:    this.settings.sales_ledger_account    || null,
      purchase_ledger_account: this.settings.purchase_ledger_account || null,
      receivables_account:     this.settings.receivables_account     || null,
      payables_account:        this.settings.payables_account        || null,
      cash_account:            this.settings.cash_account            || null,
      bank_account:            this.settings.bank_account            || null,
      discount_account:        this.settings.discount_account        || null,
      round_off_account:       this.settings.round_off_account       || null,
    };

    this.http
      .patch<any>(`company/company-settings/${this.companyId}/`, payload)
      .pipe(
        catchError((err) => {
          this.message.error(err?.error?.message || 'Failed to save. Please try again.');
          this.saving = false;
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.saving = false;
        if (res) {
          this.message.success('Settings saved successfully.');
          if (res.data) this.settings = res.data;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
