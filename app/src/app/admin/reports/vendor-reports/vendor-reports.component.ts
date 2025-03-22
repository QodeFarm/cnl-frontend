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
      apiUrl: 'vendors/vendors/?summary=true',
      pkId: "vendor_id",
      fixedFilters: [
        {
          key: 'summary',
          value: 'true'
        }
      ],
      pageSize: 10,
      globalSearch: {
        keys: ['created_at', 'name', 'gst_no', 'email', 'phone', 'vendor_category_id', 'ledger_account', 'city_id']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'gst_no',
          name: 'GST No',
          sort: true
        },
        {
          fieldKey: 'email',
          name: 'Email',
          sort: false,
        },
        {
          fieldKey: 'phone',
          name: 'Phone',
          sort: false,
        },
        {
          fieldKey: 'vendor_category_id',
          name: 'Vendor Category',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.vendor_category?.name;
          },
        },
        {
          fieldKey: 'ledger_account',
          name: 'Ledger Account',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.ledger_account?.name;
          },
        },
        {
          fieldKey: 'city_id',
          name: 'City Name',
          sort: false,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.city?.city_name;
          },
        },
      ]
    },
//===================================================VendorOutstandingReport============================================
    VendorOutstandingReport: {
      apiUrl: 'vendors/vendors/?vendor_outstanding_report=true',
      pkId: "vendor_id",
      pageSize: 10,
      globalSearch: {
        keys: ['vendor_name', 'invoice_no', 'invoice_date', 'due_date', 'total_amount', 'advance_amount ', 'outstanding_amount']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'vendor_name',
          name: 'Vendor',
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
          sort: true,
        },
        {
          fieldKey: 'due_date',
          name: 'Due Date',
          sort: true,
        },
        {
          fieldKey: 'total_amount',
          name: 'Total Amount',
          sort: true
        },
        {
          fieldKey: 'advance_amount',
          name: 'Advance Amount',
          sort: true,
        },
        {
          fieldKey: 'outstanding_amount',
          name: 'Outstanding Amount',
          sort: false,
        },
      ]
    },
    //===================================================VendorPerformanceReport============================================
    VendorPerformanceReport: {
      apiUrl: 'vendors/vendors/?vendor_performance_report=true',
      pkId: "vendor_id",
      pageSize: 10,
      globalSearch: {
        keys: ['vendor_name', 'total_orders', 'on_time_orders', 'on_time_percentage', 'avg_delivery_time']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'vendor_name',
          name: 'Vendor',
          sort: true
        },
        {
          fieldKey: 'total_orders',
          name: 'Total Orders',
          sort: true
        },
        {
          fieldKey: 'on_time_orders',
          name: 'On Time Orders',
          sort: true,
        },
        {
          fieldKey: 'on_time_percentage',
          name: 'On Time Percentage',
          sort: true,
        },
        {
          fieldKey: 'avg_delivery_time',
          name: 'Avg Delivery Time',
          sort: true
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
