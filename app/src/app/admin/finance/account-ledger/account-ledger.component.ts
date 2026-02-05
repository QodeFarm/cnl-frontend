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

  // Opening and Closing Balance for ERP-standard ledger display
  openingBalance: string = '0.00';
  closingBalance: string = '0.00';
  totalDebit: string = '0.00';
  totalCredit: string = '0.00';
  showBalanceSummary: boolean = false;
  
  get isPositiveBalance(): boolean {
    return parseFloat(this.closingBalance) >= 0;
  }

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

  // loadLedgerData(type: string, id: string) {
  //   console.log("loadLedgerData called with:", type, id);


  //   //  STORE FOR PRINT / PREVIEW
  //   this.selectedAccountType = type;
  //   this.selectedAccountId = id;


  //   // Store current account ID for search functionality
  //   this.currentAccountId = id;

  //   // Construct the complete API URL with customer/vendor ID - with trailing slash
  //   const apiUrl = `finance/journal_entry_lines_list/${id}/`;

  //   // Update the tableConfig apiUrl to support search functionality
  //   this.curdConfig.tableConfig.apiUrl = apiUrl;

  //   console.log("Making direct API call to:", apiUrl);

  //   // Make direct HTTP request to fetch the data
  //   this.http.get(apiUrl).subscribe(
  //     (response: any) => {
  //       console.log('API response received:', response);

  //       if (response && response.data) {
  //         if (response.data.length === 0) {
  //           // No data found, show notification message using NzNotificationService
  //           const entityType = type === 'customer' ? 'Customer' : type === 'vendor' ? 'Vendor' : 'Account';
  //           this.notification.warning(
  //             'No Data Found',
  //             `No ledger data found for the selected ${entityType.toLowerCase()}.`,
  //             { nzDuration: 5000 }
  //           );

  //           // Update UI to reflect empty data
  //           // if (this.tableComponent) {
  //           //   this.tableComponent.rows = [];
  //           //   this.tableComponent.total = 0;
  //           // }
  //           return;
  //         }

  //         console.log(`Found ${response.data.length} journal entries`);

  //         // Get the table component and update its data
  //         if (this.tableComponent) {
  //           // Directly update the table component's data rows
  //           this.tableComponent.rows = response.data;
  //           this.tableComponent.total = response.count || response.data.length;
  //           console.log("Table data updated successfully");
  //         } else {
  //           console.error("Table component reference not found");

  //           // Try to find the table component again
  //           if (this.curdModalComponent && this.curdModalComponent.table) {
  //             this.tableComponent = this.curdModalComponent.table;
  //             this.tableComponent.rows = response.data;
  //             this.tableComponent.total = response.count || response.data.length;
  //             console.log("Table data updated on second attempt");
  //           }
  //         }
  //       } else {
  //         console.warn("API response contains no data");
  //         this.notification.warning(
  //           'No Data Found',
  //           'No ledger data found for the selected account.',
  //           { nzDuration: 5000 }
  //         );

  //         // Clear the table
  //         if (this.tableComponent) {
  //           this.tableComponent.rows = [];
  //           this.tableComponent.total = 0;
  //         }
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching ledger data:', error);
  //       // this.notification.error(
  //       //   'Error',
  //       //   'Failed to fetch ledger data. Please try again.',
  //       //   { nzDuration: 5000 }
  //       // );
  //     }
  //   );
  // }

  loadLedgerData(type: string, id: string) {
    console.log("loadLedgerData called with:", type, id);

    //  STORE FOR PRINT / PREVIEW
    this.selectedAccountType = type;
    this.selectedAccountId = id;

    this.currentAccountId = id;

    const apiUrl = `finance/journal_entry_lines_list/${id}/`;
    this.curdConfig.tableConfig.apiUrl = apiUrl;

    // 🔹 KEEP manual API call ONLY for validation / messages
    this.http.get(apiUrl).subscribe((response: any) => {

      if (response && response.data && response.data.length === 0) {
        const entityType =
          type === 'customer' ? 'Customer' :
          type === 'vendor' ? 'Vendor' : 'Account';

        this.notification.warning(
          'No Data Found',
          `No ledger data found for the selected ${entityType.toLowerCase()}.`,
          { nzDuration: 5000 }
        );

        // Reset balance summary when no data
        this.showBalanceSummary = false;
        this.openingBalance = '0.00';
        this.closingBalance = '0.00';
        this.totalDebit = '0.00';
        this.totalCredit = '0.00';
        return;
      }

      // Capture Opening and Closing Balance from API response (ERP standard)
      this.openingBalance = response.opening_balance || '0.00';
      this.closingBalance = response.closing_balance || '0.00';
      this.totalDebit = response.total_debit || this.calculateTotalDebit(response.data);
      this.totalCredit = response.total_credit || this.calculateTotalCredit(response.data);
      this.showBalanceSummary = true;

      //  VERY IMPORTANT LINE (this fixes pagination)
      if (this.tableComponent) {
        this.tableComponent.reload();
      }

    }, error => {
      console.error('Error fetching ledger data:', error);
    });
  }

  // Helper methods to calculate totals from data (fallback if API doesn't provide)
  private calculateTotalDebit(data: any[]): string {
    if (!data || !Array.isArray(data)) return '0.00';
    const total = data.reduce((sum, row) => sum + (parseFloat(row.debit) || 0), 0);
    return total.toFixed(2);
  }

  private calculateTotalCredit(data: any[]): string {
    if (!data || !Array.isArray(data)) return '0.00';
    const total = data.reduce((sum, row) => sum + (parseFloat(row.credit) || 0), 0);
    return total.toFixed(2);
  }

  /**
   * Clear ledger data when account type or account is cleared
   * Called from ta-table component when user clears the dropdown selection
   */
  clearLedgerData() {
    console.log("clearLedgerData called - resetting ledger state");
    
    // Reset stored values
    this.currentAccountId = '';
    this.selectedAccountType = null;
    this.selectedAccountId = null;
    this.selectedCity = null;
    
    // Reset balance summary (ERP standard)
    this.openingBalance = '0.00';
    this.closingBalance = '0.00';
    this.totalDebit = '0.00';
    this.totalCredit = '0.00';
    this.showBalanceSummary = false;
    
    // Clear the API URL to prevent any data loading
    this.curdConfig.tableConfig.apiUrl = '';
    
    // Clear the table data
    if (this.tableComponent) {
      this.tableComponent.rows = [];
      this.tableComponent.total = 0;
      this.tableComponent.pageIndex = 1;
    }
  }


  onCityChange(city: string) {
    if (!this.currentAccountId) {
      this.notification.warning(
        'Select Ledger',
        'Please select a ledger before selecting city'
      );
      return;
    }

    const apiUrl = `finance/journal_entry_lines_list/${this.currentAccountId}/?city=${city}`;
    this.curdConfig.tableConfig.apiUrl = apiUrl;

    // Reload table
    if (this.tableComponent) {
      //  RESET pagination when city changes
      this.tableComponent.pageIndex = 1;

      //  Reload with fresh pagination state
      this.tableComponent.reload();
    }
  }


  // //----------print & preview ------------------------
  showDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'flex'; // Show the dialog
    }
  }

  // Function to close the custom dialog
  closeDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'none'; // Hide the dialog
    }
  }

  showSuccessToast = false;
  toastMessage = '';
  showLoading : Boolean;

onPrintSelect(event: Event): void {
  console.log("Entered onPrintSelect");
  const selectElement = event.target as HTMLSelectElement;
  const selectedValue = selectElement.value;

  console.log("selectElement : ",  selectElement);
  console.log("selectedValue : ",  selectedValue);

  if (selectedValue === 'preview') {
    this.onPreviewClick();
  }

  if (selectedValue === 'print') {
    this.onPrintClick();
  }

  selectElement.value = '';
}

public selectedAccountType: string | null = null;
public selectedAccountId: string | null = null;
public selectedCity: string | null = null;
public selectedPeriod: string | null = null;
public fromDate: string | null = null;
public toDate: string | null = null;


private buildLedgerDocumentUrl(): string | null {

  let type = this.selectedAccountType;
  const id = this.selectedAccountId;
  const cityId = this.selectedCity;

  console.log("RAW type :", type);
  console.log("accountId :", id);
  console.log("cityId :", cityId);

  const periodName = this.selectedPeriod;  
  const fromDate = this.formatDateForApi(this.fromDate);
  const toDate = this.formatDateForApi(this.toDate);

  console.log("periodName :", periodName);
  console.log("fromDate :", fromDate);
  console.log("toDate :", toDate);

  if (!type) {
    this.showDialog();
    return null;
  }

  // Normalize
  type = type.trim().toLowerCase();

  let backendKey: string | null = null;

  if (type === 'customer') {
    backendKey = 'customer_id';
  }
  else if (type === 'vendor') {
    backendKey = 'vendor_id';
  }
  else if (type === 'general' || type.includes('ledger')) {
    backendKey = 'ledger_account_id';
  }

  if (!backendKey) {
    this.showDialog();
    return null;
  }

  // ---------------------------
  // CASE 1: Account-based print
  // ---------------------------

  const params: string[] = [];

//   if (id) {
//     const url =
//       `masters/document_generator/${backendKey}/account_ledger/?${backendKey}=${id}`;
//     console.log("FINAL ACCOUNT URL :", url);
//     return url;
//   }

//   // ---------------------------
//   // CASE 2: City-based print
//   // ---------------------------
//   if (cityId && backendKey !== 'ledger_account_id') {
//     const url =
//       `masters/document_generator/${backendKey}/account_ledger/?city=${cityId}`;
//     console.log("FINAL CITY URL :", url);
//     return url;
//   }

//   this.showDialog();
//   return null;
// }
  if (id) params.push(`${backendKey}=${id}`);
    if (cityId && backendKey !== 'ledger_account_id') params.push(`city=${cityId}`);

    // PERIOD PARAMS
    if (periodName) params.push(`period_name=${periodName}`);
    if (fromDate) params.push(`created_at_after=${fromDate}`);
    if (toDate) params.push(`created_at_before=${toDate}`);

    const queryString = params.join('&');

    const url = `masters/document_generator/${backendKey}/account_ledger/?${queryString}`;
    console.log("FINAL DOCUMENT URL:", url);

    return url;
  }

private formatDateForApi(date: any): string | null {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}



onPreviewClick(): void {
  const url = this.buildLedgerDocumentUrl();
  console.log("URL : ", url);
  if (!url) return;

  this.showLoading = true;

  this.http.post(url, { flag: 'preview' }, { responseType: 'blob' }).subscribe(
    (pdfBlob: Blob) => {
      this.showLoading = false;
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    },
    () => {
      this.showLoading = false;
      this.toastMessage = 'Error generating document preview';
      this.showSuccessToast = true;
      setTimeout(() => (this.showSuccessToast = false), 2000);
    }
  );
}


onPrintClick(): void {
  const url = this.buildLedgerDocumentUrl();
  console.log("URL : ", url);
  if (!url) return;

  this.showLoading = true;

  this.http.post(url, { flag: 'print' }, { responseType: 'blob' }).subscribe(
    (pdfBlob: Blob) => {
      this.showLoading = false;
      this.openAndPrintPdf(pdfBlob);
    },
    () => {
      this.showLoading = false;
      this.toastMessage = 'Error generating document for printing';
      this.showSuccessToast = true;
      setTimeout(() => (this.showSuccessToast = false), 2000);
    }
  );
}



private openAndPrintPdf(pdfBlob: Blob): void {
  // Create blob URL
  const blobUrl = URL.createObjectURL(pdfBlob);
  
  // Open in new window first
  const printWindow = window.open(blobUrl, '_blank');
  
  // Wait for window to load
  if (printWindow) {
      printWindow.onload = () => {
          try {
              // Give it a small delay to ensure PDF is rendered
              setTimeout(() => {
                  printWindow.print();
                  // Clean up after printing
                  URL.revokeObjectURL(blobUrl);
              }, 500);
          } catch (e) {
              console.error('Print error:', e);
              // Fallback to iframe if window.print() fails
              this.fallbackPrint(pdfBlob);
          }
      };
  } else {
      // If popup was blocked, fallback to iframe
      this.fallbackPrint(pdfBlob);
  }
}

private fallbackPrint(pdfBlob: Blob): void {
  const blobUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = blobUrl;
  
  document.body.appendChild(iframe);
  
  iframe.onload = () => {
      setTimeout(() => {
          try {
              iframe.contentWindow?.print();
          } catch (e) {
              console.error('Iframe print error:', e);
              // Final fallback - open in new tab
              window.open(blobUrl, '_blank');
          }
          // Clean up
          setTimeout(() => {
              document.body.removeChild(iframe);
              URL.revokeObjectURL(blobUrl);
          }, 100);
      }, 1000);
  };
}


//---------------------------------------------------------

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
        keys: ['ledger_account', 'debit', 'credit', 'running_balance', 'created_at', 'voucher_no']
      },
      // Backend returns data in chronological order (ASC) for accounting correctness
      // Removing defaultSort to preserve backend ordering
      defaultSort: null,
      export: { downloadName: 'AccountLedgerList' },
      cols: [
        {
          fieldKey: 'ledger_account',
          name: 'Account',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.ledger_account?.name || ''}`;
          },
        },
        {
          fieldKey: 'voucher_no',
          name: 'voucher',
          sort: true,
        },
        {
          fieldKey: 'created_at',
          name: 'Date',
          sort: false,  // Disable sorting - backend handles chronological order
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
          sort: false,  // Disable sorting for accounting columns
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            const value = parseFloat(row.debit) || 0;
            return value.toFixed(2);
          }
        },
        {
          fieldKey: 'credit',
          name: 'Credit',
          sort: false,  // Disable sorting for accounting columns
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            const value = parseFloat(row.credit) || 0;
            return value.toFixed(2);
          }
        },
        {
          fieldKey: 'running_balance',  // Using new running_balance field from backend
          name: 'Running Balance',
          sort: false,  // Disable sorting - running balance must stay in order
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            // Use running_balance if available, fallback to balance for backward compatibility
            const value = parseFloat(row.running_balance || row.balance) || 0;
            return value.toFixed(2);
          }
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
