import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { PaymentTransactionComponent } from './payment-transaction/payment-transaction.component';
import { TaxConfigurationComponent } from './tax-configuration/tax-configuration.component';
import { BudgetComponent } from './budget/budget.component';
import { ExpenseClaimComponent } from './expense-claim/expense-claim.component';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { JournalEntryComponent } from './journal-entry/journal-entry.component';
import { GstDetailsComponent } from './gst-details/gst-details.component';

const routes: Routes = [
  {
    path: 'bank-account',
    component: BankAccountComponent,
  },
  {
    path: 'chart-of-accounts',
    component: ChartOfAccountsComponent,
  },
  {
    path: 'payment-transaction',
    component: PaymentTransactionComponent,
  },
  {
    path: 'tax-configuration',
    component: TaxConfigurationComponent,
  },
  {
    path: 'budget',
    component: BudgetComponent,
  },
  {
    path: 'expense-claim',
    component: ExpenseClaimComponent,
  },
  {
    path: 'financial-report',
    component: FinancialReportComponent,
  },
  {
    path: 'journal-entry',
    component: JournalEntryComponent,
  },
  {
    path: 'gst',
    component: GstDetailsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
