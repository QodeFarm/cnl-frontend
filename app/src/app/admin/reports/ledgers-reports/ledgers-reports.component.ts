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
      apiUrl: 'customers/ledger_accounts/',
      // title: 'Ledger Accounts',
      pkId: "ledger_account_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['order_date', 'purchase_type_id', 'order_no', 'tax', 'tax_amount', 'total_amount', 'vendor', 'status_name', 'remarks']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        {
          fieldKey: 'code', 
          name: 'Code',
          // sort: true
        },
        // {
        //   fieldKey: 'is_subledger',
        //   name: 'Is Subledger',
        //   sort: false,
        //   type: 'boolean'
        // },
        {
          fieldKey: 'inactive',
          name: 'Inactive',
          sort: true,
          type: 'boolean'
        },
        {
          fieldKey: 'type', 
          name: 'Type',
          sort: true
        },
        {
          fieldKey: 'account_no',
          name: 'Account No',
          sort: true,
          isEncrypted: true
        },
        // {
        //   fieldKey: 'rtgs_ifsc_code', 
        //   name: 'RTGS-IFSC',
        //   sort: false
        // },
        // {
        //   fieldKey: 'classification',
        //   name: 'Classification',
        //   sort: false,
        // },
        {
          fieldKey: 'is_loan_account',
          name: 'Loan Account',
          sort: true,
          type: 'boolean'
        },
        // {
        //   fieldKey: 'tds_applicable',
        //   name: 'TDS',
        //   sort: false,
        //   type: 'boolean'
        // },
        {
          fieldKey: 'address', 
          name: 'Address',
          sort: true
        },
        {
          fieldKey: 'pan',
          name: 'PAN',
          sort: true,
        },
        {
          fieldKey: 'ledger_group_id',
          name: 'Ledger Group',
          // sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.ledger_group.name}`;
          },
        },
      ]
    },
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
