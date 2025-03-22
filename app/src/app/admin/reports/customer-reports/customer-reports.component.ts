import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-customer-reports',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './customer-reports.component.html',
  styleUrls: ['./customer-reports.component.scss']
})
export class CustomerReportsComponent {
  isAccordionOpen = true;
    selectedReportKey: string | null = null;
    tableConfig: TaTableConfig | null = null;
    // totalRecords: number | null = null; 
  
    reportsConfig: { [key: string]: TaTableConfig } = {
  
      CustomerSummaryReport: {
        apiUrl: 'customers/customers/?customer_summary_report=true',
        pageSize: 10,
        globalSearch: {
          keys: ['name', 'total_sales', 'total_paid', 'outstanding_balance']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'name',
            name: 'Customer Name',
            sort: true
          },
          {
            fieldKey: 'total_sales',
            name: 'Total Sales',
            sort: true
          },
          {
            fieldKey: 'total_advance',
            name: 'Total Paid',
            sort: true,
          },
          {
            fieldKey: 'outstanding_payments',
            name: 'Balance',
            sort: true,
          },
        ]
      },
      //=============================================CustomerLedgerReport
      CustomerLedgerReport: {
        apiUrl: 'customers/customers/?customer_ledger_report=true',
        pageSize: 10,
        globalSearch: {
          keys: ['name', 'invoice_no', 'invoice_date', 'order_status']
        },
        defaultSort: { key: 'name', value: 'ascend' },
        cols: [
          {
            fieldKey: 'name',
            name: 'Customer Name',
            sort: true
          },
          {
            fieldKey: 'invoice_no',
            name: 'Invoice No',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => {
              // If there's at least one transaction, show its invoice_no; else N/A
              return row.transactions?.length ? row.transactions[0].invoice_no : '-';
            },
            sort: true
          },
          {
            fieldKey: 'invoice_date',
            name: 'Invoice Date',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => {
              return row.transactions?.length ? row.transactions[0].invoice_date : '-';
            },
            sort: true
          },
          {
            fieldKey: 'order_status',
            name: 'Status',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => {
              const status = row.transactions?.length ? row.transactions[0].order_status : null;
              return status?.status_name || '-';
            },
            sort: true
          },
          {
            fieldKey: 'total_amount',
            name: 'Total Amount',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => {
              return row.transactions?.length ? row.transactions[0].total_amount : '-';
            },
            sort: true
          }
        ]
      },
      //====================================== CustomerOrderHistoryReport ===========================
      CustomerOrderHistoryReport: {
        apiUrl: 'customers/customers/?customer_order_history=true',
        pageSize: 10,
        globalSearch: {
          keys: ['customer','invoice_no', 'invoice_date', 'total_amount', 'status_name']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'customer',
            name: 'Customer',
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              return `${row.customer.name}`;
            },
            sort: true
          },
          {
            fieldKey: 'invoice_no',
            name: 'Invoice No',
            sort: true
          },
          {
            fieldKey: 'invoice_date',
            name: 'Invoice Date',
            sort: true
          },
          {
            fieldKey: 'status_name',
            name: 'Status',
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              return `${row?.order_status?.status_name}`;
            },
            sort: true
          },
          {
            fieldKey: 'total_amount',
            name: 'Total Amount',
            sort: true
          },
        ]
      },
      //====================================== Customer Credit Limit Report ===========================
      CustomerCreditLimitReport: {
        apiUrl: 'customers/customers/?credit_limit_report=true',
        pageSize: 10,
        globalSearch: {
          keys: ['name', 'credit_limit', 'credit_usage', 'credit_usage','remaining_credit']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'name',
            name: 'Customer Name',
            sort: true
          },
          {
            fieldKey: 'credit_limit',
            name: 'Credit Limit',
            sort: true
          },
          {
            fieldKey: 'credit_usage',
            name: 'Credit Usage',
            sort: true,
          },
          // {
          //   fieldKey: 'total_paid',
          //   name: 'Total Paid',
          //   sort: false,
          // },
          {
            fieldKey: 'remaining_credit',
            name: 'Remaining Credit',
            sort: true,
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
