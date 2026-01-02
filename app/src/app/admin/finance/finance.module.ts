import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { PaymentTransactionComponent } from './payment-transaction/payment-transaction.component';
import { TaxConfigurationComponent } from './tax-configuration/tax-configuration.component';
import { BudgetComponent } from './budget/budget.component';
import { ExpenseClaimComponent } from './expense-claim/expense-claim.component';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { BankAccountListComponent } from './bank-account/bank-account-list/bank-account-list.component';
import { ChartOfAccountsListComponent } from './chart-of-accounts/chart-of-accounts-list/chart-of-accounts-list.component';
import { TaxConfigurationListComponent } from './tax-configuration/tax-configuration-list/tax-configuration-list.component';
import { FinancialReportListComponent } from './financial-report/financial-report-list/financial-report-list.component';
import { ExpenseClaimListComponent } from './expense-claim/expense-claim-list/expense-claim-list.component';
import { BudgetListComponent } from './budget/budget-list/budget-list.component';
import { JournalEntryListComponent } from './journal-entry/journal-entry-list/journal-entry-list.component';
import { JournalEntryComponent } from './journal-entry/journal-entry.component';
import { JournalVoucherListComponent } from './journal-voucher/journal-voucher-list/journal-voucher-list.component';
import { JournalVoucherComponent } from './journal-voucher/journal-voucher.component';
import { PaymentTransactionListComponent } from './payment-transaction/payment-transaction-list/payment-transaction-list.component';
import { GstDetailsComponent } from './gst-details/gst-details.component';
import { AccountLedgerComponent } from './account-ledger/account-ledger.component';
import { AccountLedgerModule } from './account-ledger/account-ledger.module';
import { LedgerAccountsComponent } from '../customers/ledger-accounts/ledger-accounts.component';


@NgModule({
  declarations: [
    // BankAccountComponent,
    // ChartOfAccountsComponent,
    // PaymentTransactionComponent,
    // TaxConfigurationComponent,
    // BudgetComponent,
    // ExpenseClaimComponent,
    // FinancialReportComponent,
    // JournalEntryComponent,
    // AccountLedgerComponent

  ],  imports: [
    CommonModule,
    AdminCommmonModule,
    FinanceRoutingModule,
    BankAccountListComponent,
    ChartOfAccountsListComponent,
    TaxConfigurationListComponent,
    FinancialReportListComponent,
    ExpenseClaimListComponent,
    BudgetListComponent,
    JournalEntryListComponent,
    JournalVoucherListComponent,
    PaymentTransactionListComponent,
    AccountLedgerComponent,
    GstDetailsComponent,
    AccountLedgerModule,
    LedgerAccountsComponent
    
  ]
})
export class FinanceModule { }
