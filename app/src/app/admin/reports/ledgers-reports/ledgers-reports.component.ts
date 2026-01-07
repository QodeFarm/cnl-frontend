import { CommonModule } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // Grand totals for Journal Book Report
  grandTotalDebit: number = 0;
  grandTotalCredit: number = 0;
  showGrandTotals: boolean = false;

  constructor(private http: HttpClient, private elementRef: ElementRef) {} 

  reportsConfig: { [key: string]: TaTableConfig } = {

    // ...existing reports...
    BankBookReport: {
      apiUrl: 'finance/financial_reports/bank_book/',
      pageSize: 10,
      globalSearch: {
        keys: ['date', 'ledger_account.name', 'debit', 'credit', 'description']
      },
      export: { downloadName: 'BankBookReport' },
      cols: [
        {
          fieldKey: 'date',
          name: 'Date',
          sort: true
        },
        {
          fieldKey: 'ledger_account',
          name: 'Account Name',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => row.ledger_account?.name || '',
          sort: true
        },
        {
          fieldKey: 'ledger_account',
          name: 'Account Code',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => row.ledger_account?.code || '',
          sort: true
        },
        {
          fieldKey: 'description',
          name: 'Description',
          sort: true
        },
        {
          fieldKey: 'debit',
          name: 'Debit',
          sort: true
        },
        {
          fieldKey: 'credit',
          name: 'Credit',
          sort: true
        },
        {
          fieldKey: 'balance',
          name: 'Balance',
          sort: true
        }
      ]
    },

    CashBookReport: {
      apiUrl: 'finance/financial_reports/cash_book/',
      pageSize: 10,
      globalSearch: {
        keys: ['date', 'ledger_account.name', 'debit', 'credit', 'description']
      },
      export: { downloadName: 'CashBookReport' },
      cols: [
        {
          fieldKey: 'date',
          name: 'Date',
          sort: true
        },
        {
          fieldKey: 'ledger_account',
          name: 'Account Name',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => row.ledger_account?.name || '',
          sort: true
        },
        {
          fieldKey: 'ledger_account',
          name: 'Account Code',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => row.ledger_account?.code || '',
          sort: true
        },
        {
          fieldKey: 'description',
          name: 'Description',
          sort: true
        },
        {
          fieldKey: 'debit',
          name: 'Debit',
          sort: true
        },
        {
          fieldKey: 'credit',
          name: 'Credit',
          sort: true
        },
        {
          fieldKey: 'balance',
          name: 'Balance',
          sort: true
        }
      ]
    },

    GeneralLedgerReport: {
      apiUrl: 'finance/financial_reports/general_ledger/',
      pageSize: 10,
      globalSearch: {
        keys: ['date', 'ledger_account.name', 'debit', 'credit', 'description']
      },
      export: { downloadName: 'GeneralLedgerReport' },
      defaultSort: { key: 'date', value: 'descend' },
      cols: [
         {
      fieldKey: 'date',
      name: 'Date',
      sort: true
    },
    {
      fieldKey: 'ledger_account',
      name: 'Account Name',
      displayType: 'map',
      mapFn: (currentValue: any, row: any) => row.ledger_account?.name || '',
      sort: true
    },
    {
      fieldKey: 'ledger_account',
      name: 'Account Code',
      displayType: 'map',
      mapFn: (currentValue: any, row: any) => row.ledger_account?.code || '',
      sort: true
    },
    {
      fieldKey: 'description',
      name: 'Description',
      sort: true
    },
    {
      fieldKey: 'debit',
      name: 'Debit',
      sort: true
    },
    {
      fieldKey: 'credit',
      name: 'Credit',
      sort: true
    },
    {
      fieldKey: 'balance',
      name: 'Balance',
      sort: true
    }

      ]
    },

    TrialBalanceReport: {
      apiUrl: 'finance/financial_reports/trial_balance/',
      pageSize: 10,
      globalSearch: {
        keys: ['account_code', 'account_name', 'account_type']
      },
      export: { downloadName: 'TrialBalanceReport' },

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
      export: { downloadName: 'ProfitLossStatement' },
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
      export: { downloadName: 'BalanceSheetReport' },
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
      export: { downloadName: ' CashFlowStatement' },

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
      export: { downloadName: ' AgingReport' },
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
      export: { downloadName: 'JournalEntryReport' },
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
      export: { downloadName: 'BankReconciliationReport' },

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
    },
    JournalBookReport: {
      apiUrl: 'finance/journal_book_report/',
      pageSize: 10,
      globalSearch: {
        keys: ['voucher_no', 'voucher_date', 'narration', 'total_debit', 'total_credit']
      },
      export: { downloadName: 'JournalBookReport' },
      defaultSort: { key: 'voucher_date', value: 'descend' },
      cols: [
        {
          fieldKey: 'voucher_no',
          name: 'Voucher No',
          sort: true
        },
        {
          fieldKey: 'voucher_date',
          name: 'Date',
          sort: true
        },
        {
          fieldKey: 'particulars',
          name: 'Particulars',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            if (!row.particulars || !Array.isArray(row.particulars)) return '';
            
            const lines = row.particulars.map((p: any) => {
              // Ledger Group (bold) on its own line if exists
              const ledgerGroup = p.ledger_group ? `<strong>${p.ledger_group}</strong><br>` : '';
              // Ledger Name (bold) with party name below
              const ledgerName = p.ledger_name ? `<strong>${p.ledger_name}</strong>` : '';
              const partyInfo = p.party_name ? `<br>${p.party_name}` : '';
              // Narration text for each line
              const narration = p.narration_text ? `<br><small style="color: #666;">${p.narration_text}</small>` : '';
              return `${ledgerGroup}${ledgerName}${partyInfo}${narration}`;
            });
            
            return lines.join('<hr style="margin: 8px 0; border: 0; border-top: 1px solid #ddd;">');
          },
          sort: false
        },
        {
          fieldKey: 'total_debit',
          name: 'Debit(₹)',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            if (!row.lines || !Array.isArray(row.lines)) return '₹0.00';
            const lines = row.lines.map((line: any) => {
              const debit = parseFloat(line.debit) || 0;
              return `₹${debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            });
            return lines.join('<hr style="margin: 5px 0; border: 0; border-top: 1px dashed #ccc;">');
          },
          sort: true
        },
        {
          fieldKey: 'total_credit',
          name: 'Credit(₹)',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            if (!row.lines || !Array.isArray(row.lines)) return '₹0.00';
            const lines = row.lines.map((line: any) => {
              const credit = parseFloat(line.credit) || 0;
              return `₹${credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            });
            return lines.join('<hr style="margin: 5px 0; border: 0; border-top: 1px dashed #ccc;">');
          },
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
    this.showGrandTotals = false;
    this.grandTotalDebit = 0;
    this.grandTotalCredit = 0;

    // Remove existing totals row when switching reports
    this.removeTotalsRow();

    if (reportKey) {
      this.selectedReportKey = reportKey;
      this.tableConfig = this.reportsConfig[reportKey];
      this.isAccordionOpen = false;

      // Fetch grand totals for Journal Book Report
      if (reportKey === 'JournalBookReport') {
        this.fetchJournalBookTotals();
      }
    }

    setTimeout(() => {
      this.loading = false; // Hide loading after data loads
    },); // Adjust timeout based on API response time
  }

  fetchJournalBookTotals() {
    this.http.get<any>('finance/journal_book_report/').subscribe(
      (response) => {
        if (response && response.summary) {
          this.grandTotalDebit = response.summary.grand_total_debit || 0;
          this.grandTotalCredit = response.summary.grand_total_credit || 0;
          this.showGrandTotals = true;
          // Inject totals row after data loads
          setTimeout(() => {
            this.injectTotalsRow();
          }, 500);
        }
      },
      (error) => {
        console.error('Error fetching journal book totals:', error);
      }
    );
  }

  onDataLoaded(data: any[]) {
    if (!data || data.length === 0) {
      this.error = 'No data available for this report.';
    }
    this.loading = false;
  }

  removeTotalsRow() {
    const existingTotals = this.elementRef.nativeElement.querySelector('.journal-book-totals-row');
    if (existingTotals) {
      existingTotals.remove();
    }
  }

  injectTotalsRow() {
    this.removeTotalsRow();

    // Find the table body
    const tableBody = this.elementRef.nativeElement.querySelector('.ant-table-tbody');
    if (tableBody) {
      const totalsRow = document.createElement('tr');
      totalsRow.className = 'journal-book-totals-row ant-table-row';
      // totalsRow.innerHTML = `
      //   <td class="ant-table-cell" style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600;"></td>
      //   <td class="ant-table-cell" style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600;"></td>
      //   <td class="ant-table-cell" style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600; text-align: right;"></td>
      //   <td class="ant-table-cell" style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600; text-align: right;">${this.formatCurrency(this.grandTotalDebit)}</td>
      //   <td class="ant-table-cell" style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600; text-align: right;">${this.formatCurrency(this.grandTotalCredit)}</td>
      // `;
      tableBody.appendChild(totalsRow);
    }
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

}
