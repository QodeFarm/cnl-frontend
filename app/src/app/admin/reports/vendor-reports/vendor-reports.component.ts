import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-vendor-reports',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './vendor-reports.component.html',
  styleUrls: ['./vendor-reports.component.scss']
})
export class VendorReportsComponent {
  isAccordionOpen = true;
  selectedReportKey: string | null = null;
  tableConfig: TaTableConfig | null = null;
  // totalRecords: number | null = null; 

  reportsConfig: { [key: string]: TaTableConfig } = {

    VendorSummaryReport: {
      apiUrl: 'vendors/vendors/?vendor_summary_report=true',
      pkId: "vendor_id",
      pageSize: 10,
      globalSearch: {
        keys: ['name', 'total_purchases', 'phone', 'email', 'gst']
      },
      export: {downloadName: 'VendorSummaryReport'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Vendor Name',
          sort: true
        },
        {
          fieldKey: 'total_purchases',
          name: 'Total Purchases',
          sort: true
        },
        {
          fieldKey: 'total_paid',
          name: 'Total Paid',
          sort: true
        },
        {
          fieldKey: 'total_pending',
          name: 'Outstanding Amount',
          sort: true
        },
        {
          fieldKey: 'last_purchase_date',
          name: 'Last Purchase Date',
          sort: true
        },
        {
          fieldKey: 'phone',
          name: 'Phone',
          sort: false
        },
        {
          fieldKey: 'email',
          name: 'Email',
          sort: false
        },
        {
          fieldKey: 'gst',
          name: 'GST Status',
          sort: true
        }
      ]
    },
    //===================================================VendorLedgerReport============================================
    VendorLedgerReport: {
      apiUrl: 'vendors/vendors/?vendor_ledger_report=true',
      pkId: "journal_entry_line_id",
      pageSize: 10,
      globalSearch: {
        keys: ['transaction_date', 'reference_number', 'description', 'debit', 'credit', 'running_balance', 'transaction_type']
      },
      export: {downloadName: 'VendorLedgerReport'},
      defaultSort: { key: 'transaction_date', value: 'descend' },
      cols: [
        {
          fieldKey: 'transaction_date',
          name: 'Transaction Date',
          sort: true
        },
        {
          fieldKey: 'reference_number',
          name: 'Reference Number',
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
          fieldKey: 'running_balance',
          name: 'Running Balance',
          sort: true
        },
        {
          fieldKey: 'transaction_type',
          name: 'Transaction Type',
          sort: true
        }
      ]
    },

    //===================================================VendorOutstandingReport============================================
    VendorOutstandingReport: {
      apiUrl: 'vendors/vendors/?vendor_outstanding_report=true',
      pkId: "vendor_id",
      pageSize: 10,
      globalSearch: {
        keys: ['name', 'total_purchases', 'total_paid', 'total_pending', 'last_purchase_date', 'phone', 'email', 'gst']
      },
      export: {downloadName: 'VendorOutstandingReport'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Vendor Name',
          sort: true
        },
        {
          fieldKey: 'total_purchases',
          name: 'Total Purchases',
          sort: true
        },
        {
          fieldKey: 'total_paid',
          name: 'Total Paid',
          sort: true
        },
        {
          fieldKey: 'total_pending',
          name: 'Outstanding Amount',
          sort: true
        },
        {
          fieldKey: 'last_purchase_date',
          name: 'Last Purchase Date',
          sort: true
        },
        {
          fieldKey: 'phone',
          name: 'Phone',
          sort: false
        },
        {
          fieldKey: 'email',
          name: 'Email',
          sort: false
        },
        {
          fieldKey: 'gst',
          name: 'GST Status',
          sort: true
        }
      ]
    },

    //===================================================VendorPerformanceReport============================================
    VendorPerformanceReport: {
      apiUrl: 'vendors/vendors/?vendor_performance_report=true',
      pkId: "vendor_id",
      pageSize: 10,
      globalSearch: {
        keys: ['name', 'total_orders', 'on_time_deliveries', 'delayed_deliveries', 'on_time_percentage',
          'average_delay_days', 'rejected_items_count', 'quality_rating', 'last_order_date', 'phone', 'email']
      },
      export: {downloadName: 'VendorPerformanceReport'},
      defaultSort: { key: 'quality_rating', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Vendor Name',
          sort: true
        },
        {
          fieldKey: 'total_orders',
          name: 'Total Orders',
          sort: true
        },
        {
          fieldKey: 'on_time_deliveries',
          name: 'On Time Deliveries',
          sort: true
        },
        {
          fieldKey: 'delayed_deliveries',
          name: 'Delayed Deliveries',
          sort: true
        },
        {
          fieldKey: 'on_time_percentage',
          name: 'On Time %',
          sort: true
        },
        {
          fieldKey: 'average_delay_days',
          name: 'Avg. Delay (Days)',
          sort: true
        },
        {
          fieldKey: 'rejected_items_count',
          name: 'Rejected Items',
          sort: true
        },
        {
          fieldKey: 'quality_rating',
          name: 'Quality Rating',
          sort: true
        },
        {
          fieldKey: 'last_order_date',
          name: 'Last Order Date',
          sort: true
        },
        {
          fieldKey: 'phone',
          name: 'Phone',
          sort: false
        },
        {
          fieldKey: 'email',
          name: 'Email',
          sort: false
        }
      ]
    },
    
    //===================================================VendorPaymentReport==============================================
    VendorPaymentReport: {
      apiUrl: 'vendors/vendors/?vendor_payment_report=true',
      pkId: "payment_id",
      pageSize: 10,
      globalSearch: {
        keys: ['payment_date', 'vendor_name', 'payment_amount', 'payment_method', 'payment_status', 
        'reference_number', 'purchase_order_id', 'vendor_gst', 'notes']
      },
      export: {downloadName: 'VendorPaymentReport'},
      defaultSort: { key: 'payment_date', value: 'descend' },
      cols: [
        {
          fieldKey: 'payment_date',
          name: 'Payment Date',
          sort: true
        },
        {
          fieldKey: 'vendor_name',
          name: 'Vendor Name',
          sort: true
        },
        {
          fieldKey: 'payment_amount',
          name: 'Amount',
          sort: true
        },
        {
          fieldKey: 'payment_method',
          name: 'Payment Method',
          sort: true
        },
        {
          fieldKey: 'payment_status',
          name: 'Status',
          sort: true
        },
        {
          fieldKey: 'reference_number',
          name: 'Reference Number',
          sort: true
        },
        {
          fieldKey: 'invoice_id',
          name: 'Invoice ID',
          sort: true
        },
        {
          fieldKey: 'vendor_gst',
          name: 'Vendor GST',
          sort: true
        },
        {
          fieldKey: 'notes',
          name: 'Notes',
          sort: false
        }
      ]
    }
  };
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
