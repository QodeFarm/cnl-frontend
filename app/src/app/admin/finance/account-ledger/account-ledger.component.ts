import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';
import { TaCurdModalComponent } from 'projects/ta-curd/src/lib/ta-curd-modal/ta-curd-modal.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-account-ledger',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './account-ledger.component.html',
  styleUrls: ['./account-ledger.component.scss']
})
export class AccountLedgerComponent implements OnInit, AfterViewInit {
  @ViewChild(TaCurdModalComponent) curdModalComponent: TaCurdModalComponent;
  tableComponent: TaTableComponent;
  currentAccountId: string = '';

  constructor(
    private http: HttpClient,
    private notification: NzNotificationService
  ) {
    // Make the component instance available globally
    window['accountLedgerComponentInstance'] = this;
  }

  ngOnInit() {
    // Initially, don't set an API URL so it won't try to load data without a selected customer/vendor
    this.curdConfig.tableConfig.apiUrl = '';
  }

  ngAfterViewInit() {
    // Get reference to the table component after the view is initialized
    setTimeout(() => {
      if (this.curdModalComponent && this.curdModalComponent.table) {
        this.tableComponent = this.curdModalComponent.table;
        console.log('Table component reference acquired');
      } else {
        console.warn('Could not get reference to table component');
      }
    }, 500);
  }

  loadLedgerData(type: string, id: string) {
    console.log("loadLedgerData called with:", type, id);

    // Store current account ID for search functionality
    this.currentAccountId = id;

    // Construct the complete API URL with customer/vendor ID - with trailing slash
    const apiUrl = `finance/journal_entry_lines_list/${id}/`;

    // Update the tableConfig apiUrl to support search functionality
    this.curdConfig.tableConfig.apiUrl = apiUrl;

    console.log("Making direct API call to:", apiUrl);

    // Make direct HTTP request to fetch the data
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        console.log('API response received:', response);

        if (response && response.data) {
          if (response.data.length === 0) {
            // No data found, show notification message using NzNotificationService
            const entityType = type === 'customer' ? 'Customer' : type === 'vendor' ? 'Vendor' : 'Account';
            this.notification.warning(
              'No Data Found',
              `No ledger data found for the selected ${entityType.toLowerCase()}.`,
              { nzDuration: 5000 }
            );

            // Update UI to reflect empty data
            if (this.tableComponent) {
              this.tableComponent.rows = [];
              this.tableComponent.total = 0;
            }
            return;
          }

          console.log(`Found ${response.data.length} journal entries`);

          // Get the table component and update its data
          if (this.tableComponent) {
            // Directly update the table component's data rows
            this.tableComponent.rows = response.data;
            this.tableComponent.total = response.count || response.data.length;
            console.log("Table data updated successfully");
          } else {
            console.error("Table component reference not found");

            // Try to find the table component again
            if (this.curdModalComponent && this.curdModalComponent.table) {
              this.tableComponent = this.curdModalComponent.table;
              this.tableComponent.rows = response.data;
              this.tableComponent.total = response.count || response.data.length;
              console.log("Table data updated on second attempt");
            }
          }
        } else {
          console.warn("API response contains no data");
          this.notification.warning(
            'No Data Found',
            'No ledger data found for the selected account.',
            { nzDuration: 5000 }
          );

          // Clear the table
          if (this.tableComponent) {
            this.tableComponent.rows = [];
            this.tableComponent.total = 0;
          }
        }
      },
      (error) => {
        console.error('Error fetching ledger data:', error);
        // this.notification.error(
        //   'Error',
        //   'Failed to fetch ledger data. Please try again.',
        //   { nzDuration: 5000 }
        // );
      }
    );
  }

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: '', // Start with empty API URL to prevent initial loading
      // title: 'Journal Entry Lines',
      pkId: "journal_entry_line_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['account', 'debit', 'credit', 'balance', 'created_at']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      export: { downloadName: 'AccountLedgerList' },
      cols: [
        {
          fieldKey: 'account',
          name: 'Account',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.account?.account_name || ''}`;
          },
        },
        {
          fieldKey: 'created_at',
          name: 'Date',
          sort: true,
          displayType: 'date'
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
          name: 'Running Balance',
          sort: true
        },
        // {
        //   fieldKey: "code",
        //   name: "Action",
        //   type: 'action',
        //   actions: [
        //     {
        //       type: 'delete',
        //       label: 'Delete',
        //       confirm: true,
        //       confirmMsg: "Sure to delete?",
        //       apiUrl: 'hrms/employee_attendance'
        //     },
        //     {
        //       type: 'edit',
        //       label: 'Edit'
        //     }
        //   ]
        // }
      ]
    },
    formConfig: {
      submit: {},
      formState: {},
      model: {},
      fields: []
    }
  };
}
