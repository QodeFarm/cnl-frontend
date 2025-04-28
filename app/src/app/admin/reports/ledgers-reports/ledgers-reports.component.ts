import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-ledgers-reports',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './ledgers-reports.component.html',
  styleUrls: ['./ledgers-reports.component.scss']
})
export class LedgersReportsComponent {
  isAccordionOpen = true;
  selectedReportKey: string | null = null;
  tableConfig: TaTableConfig | null = null;
  // totalRecords: number | null = null; 

  reportsConfig: { [key: string]: TaTableConfig } = {

    GeneralLedgerReport: {
      apiUrl: 'finance/financial_reports/general_ledger/', // Assuming you have a corresponding API endpoint for General Ledger
      pageSize: 10,
      globalSearch: {
        keys: ['date', 'account_name', 'description', 'debit', 'credit', 'transaction_date']
      },
      // defaultSort: { key: 'date', value: 'descend' },
      cols: [
        {
          fieldKey: 'date',
          name: 'Date',
          sort: true
        },
        {
          fieldKey: 'reference',
          name: 'Reference',
          sort: true
        },
        {
          fieldKey: 'account',
          name: 'Account Name',
          sort: true
        },
        {
          fieldKey: 'debit',
          name: 'Debit Amount',
          sort: true
        },
        {
          fieldKey: 'credit',
          name: 'Credit Amount',
          sort: true
        },
        {
          fieldKey: 'description',
          name: 'Description',
          sort: true
        },
      ]
    },

  TrialBalanceReport: {
    apiUrl: 'finance/financial_reports/trial_balance/',
    pageSize: 10,
    globalSearch: {
      keys: ['account_code', 'account_name', 'account_type']
    },
    defaultSort: { key: 'account_code', value: 'ascend' },
    cols: [
      {
        fieldKey: 'account_code',
        name: 'Account Code',
        sort: true
      },
      {
        fieldKey: 'account_name',
        name: 'Account Name',
        sort: true
      },
      {
        fieldKey: 'account_type',
        name: 'Account Type',
        sort: true
      },
      {
        fieldKey: 'total_debit',
        name: 'Total Debit',
        sort: true
      },
      {
        fieldKey: 'total_credit',
        name: 'Total Credit',
        sort: true
      },
      // {
      //   fieldKey: 'balance',
      //   name: 'Balance',
      //   sort: true
      // }
    ]
  },
  ProfitLossStatement: {
    apiUrl: 'finance/financial_reports/profit_and_loss/',
    pageSize: 10,
    globalSearch: {
      keys: ['account_code', 'account_name', 'account_type']
    },
    defaultSort: { key: 'account_code', value: 'ascend' },
    cols: [
      {
        fieldKey: 'total_revenue',
        name: 'Total Revenue',
        sort: true
      },
      {
        fieldKey: 'total_expense',
        name: 'Total Expense',
        sort: true
      },
      {
        fieldKey: 'net_profit',
        name: 'Net Profit',
        sort: true
      }, 
    ]
  },
  BalanceSheetReport: {
    apiUrl: 'finance/financial_reports/balance_sheet/',
    pageSize: 10,
    globalSearch: {
      keys: ['account_code', 'account_name', 'account_type']
    },
    defaultSort: { key: 'account_code', value: 'ascend' },
    cols: [
      {
        fieldKey: 'account_code',
        name: 'Account Code',
        sort: true
      },
      {
        fieldKey: 'account_name',
        name: 'Account Name',
        sort: true
      },
      {
        fieldKey: 'account_type',
        name: 'Account Type',
        sort: true
      }, 
      {
        fieldKey: 'balance',
        name: 'Balance',
        sort: true
      }, 
    ]
  },
  
  CashFlowStatement: {
    apiUrl: 'finance/financial_reports/cash_flow/',
    pageSize: 10,
    globalSearch: {
      keys: ['account_code', 'account_name', 'account_type']
    },
    defaultSort: { key: 'account_code', value: 'ascend' },
    cols: [
      {
        fieldKey: 'account_code',
        name: 'Account Code',
        sort: true
      },
      {
        fieldKey: 'account_name',
        name: 'Account Name',
        sort: true
      },
      {
        fieldKey: 'account_type',
        name: 'Account Type',
        sort: true
      }, 
      {
        fieldKey: 'cash_inflow',
        name: 'Cash Inflow',
        sort: true
      }, 
      {
        fieldKey: 'cash_outflow',
        name: 'Cash Outflow',
        sort: true
      }, 
    ]
  },
  AgingReport: {
    apiUrl: 'finance/financial_reports/aging_report/',
    pageSize: 10,
    globalSearch: {
      keys: ['account_code', 'account_name', 'account_type']
    },
    defaultSort: { key: 'account_code', value: 'ascend' },
    cols: [
      {
        fieldKey: 'invoice_id',
        name: 'Invoice',
        sort: true
      },
      {
        fieldKey: 'order_type',
        name: 'Order Type',
        sort: true
      },
      {
        fieldKey: 'payment_date',
        name: 'Payment Data',
        sort: true
      }, 
      {
        fieldKey: 'payment_status',
        name: 'Payment Status',
        sort: true
      }, 
      {
        fieldKey: 'due_days',
        name: 'Due Days',
        sort: true
      }, 
      {
        fieldKey: 'pending_amount',
        name: 'Pending Amount',
        sort: true
      }, 
    ]
  },
  JournalEntryReport: {
    apiUrl: 'finance/financial_reports/journal_entry_report/',
    pageSize: 10,
    globalSearch: {
      keys: ['entry_date', 'reference', 'description']
    },
    defaultSort: { key: 'entry_date', value: 'descend' },
    cols: [
      {
        fieldKey: 'entry_date',
        name: 'Entry Date',
        sort: true
      },
      {
        fieldKey: 'reference',
        name: 'Reference',
        sort: true
      },
      {
        fieldKey: 'description',
        name: 'Journal Description',
        sort: true
      },
      {
        fieldKey: 'account',
        name: 'Account',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => {
          return row.lines?.map((line: any) => line.account).join('<br>');
        },
        sort: true
      },
      {
        fieldKey: 'debit',
        name: 'Debit',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => {
          return row.lines?.map((line: any) => line.debit).join('<br>');
        },
        sort: true
      },
      {
        fieldKey: 'credit',
        name: 'Credit',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => {
          return row.lines?.map((line: any) => line.credit).join('<br>');
        },
        sort: true
      },
      {
        fieldKey: 'line_description',
        name: 'Line Description',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => {
          return row.lines?.map((line: any) => line.description).join('<br>');
        },
        sort: false
      }
    ]
  },
  BankReconciliationReport: {
    apiUrl: 'finance/financial_reports/bank_reconciliation/',
    pageSize: 10,
    globalSearch: {
      keys: ['account_name', 'account_number', 'bank_name', 'branch_name', 'ifsc_code', 'balance', 'ledger_balance', 'difference']
    },
    // defaultSort: { key: 'account_name', value: 'ascend' },
    cols: [
      {
        fieldKey: 'account_name',
        name: 'Account Name',
        sort: true
      },
      {
        fieldKey: 'account_number',
        name: 'Account Number',
        sort: true
      },
      {
        fieldKey: 'bank_name',
        name: 'Bank Name',
        sort: true
      },
      {
        fieldKey: 'branch_name',
        name: 'Branch',
        sort: true
      },
      {
        fieldKey: 'ifsc_code',
        name: 'IFSC Code',
        sort: true
      },
      {
        fieldKey: 'balance',
        name: 'Bank Balance',
        sort: true
      },
      {
        fieldKey: 'ledger_balance',
        name: 'Ledger Balance',
        sort: true
      },
      {
        fieldKey: 'difference',
        name: 'Difference',
        sort: true
      }
    ]
  }
  }
  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  loading: boolean = false;
  error: string | null = null;

  selectReport(reportKey: string) {
    this.loading = true; // Show loading state
    this.error = null; // Clear any previous errors
    this.selectedReportKey = null;
    this.tableConfig = null;
    this.isAccordionOpen = true;

    if (reportKey) {
      this.selectedReportKey = reportKey;
      this.tableConfig = this.reportsConfig[reportKey];
      this.isAccordionOpen = false;
    }

    setTimeout(() => {
      this.loading = false; // Hide loading after data loads
    },); // Adjust timeout based on API response time
  }

  onDataLoaded(data: any[]) {
    if (!data || data.length === 0) {
      this.error = 'No data available for this report.';
    }
    this.loading = false;
  }

  // // ✅ Function to get total records from the table data
  // onDataLoaded(data: any[]) {
  //   this.totalRecords = data.length; // ✅ Update total records dynamically
  // }

}
