import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-gst-reports',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './gst-reports.component.html',
  styleUrls: ['./gst-reports.component.scss']
})
export class GstReportsComponent {
  isAccordionOpen = true;
      selectedReportKey: string | null = null;
      tableConfig: TaTableConfig | null = null;
      // totalRecords: number | null = null; 
    
      reportsConfig: { [key: string]: TaTableConfig } = {
    
        GSTSummaryReport: {
          apiUrl: '',
          pageSize: 10,
          globalSearch: {
            keys: ['gst_type', 'gst_collected', 'gst_paid', 'net_gst']
          },
          defaultSort: { key: 'gst_type', value: 'ascend' },
          cols: [
            {
              fieldKey: 'gst_type',
              name: 'GST Type',
              sort: true
            },
            {
              fieldKey: 'gst_collected',
              name: 'GST Collected',
              sort: true
            },
            {
              fieldKey: 'gst_paid',
              name: 'GST Paid',
              sort: true
            },
            {
              fieldKey: 'net_gst',
              name: 'Net GST',
              sort: true
            }
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
