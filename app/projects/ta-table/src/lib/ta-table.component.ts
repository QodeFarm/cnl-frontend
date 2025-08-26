import { Component, Input, OnDestroy, OnInit, Output, ViewChild, EventEmitter, ElementRef, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { getValue } from '@ta/ta-core';
import { cloneDeep } from 'lodash';
import {
  NzTableComponent,
  NzTableFilterFn,
  NzTableFilterList,
  NzTableQueryParams,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { Observable, Subscription } from 'rxjs';
import { TaParamsConfig, TaTableConfig } from './ta-table-config';
import { TaTableService } from './ta-table.service';
import moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'ta-table',
  templateUrl: './ta-table.component.html',
  styles: [
    `
      .table-operations {
        margin-bottom: 16px;
      }

      .table-operations > button {
        margin-right: 8px;
      }
      .search-box {
        padding: 8px;
      }

      .search-box input {
        width: 188px;
        margin-bottom: 8px;
        display: block;
      }

      .search-box button {
        width: 90px;
      }
      .search-button {
        margin-right: 8px;
      }
      .nzValue{
        display:flex;
      }
      .file-action-buttons {
        display: flex;
        margin-top: 8px;
      }
      .file-action-buttons button {
        margin-right: 8px;
      }
    `,
  ],
})
export class TaTableComponent implements OnDestroy {
  @Input() options!: TaTableConfig;
  @Output() doAction: EventEmitter<any> = new EventEmitter();
  @ViewChild('taTable') taTable!: NzTableComponent<any> | any;
  @Input() customProductTemplate!: TemplateRef<any>;
  // selectedProducts: any[] = []; // This holds the selected products
  // @Output() selectedProductsChange = new EventEmitter<any[]>(); // Event emitter to notify parent component
  checked = false;
  indeterminate = false;
  selectedEmployee: string | null = null;
  selectedStatus: string | null = null;
  selectedQuickPeriod: string | null = null;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  isButtonVisible = false;
  isStatusButtonVisible = false;
  isEmployeeFilterVisible = false;
  setOfCheckedId = new Set<number>();
  selectedAccountType: string | null = null;
  selectedAccountId: number | null = null;
  isAccountLedgerPage: boolean;
  // Filters for product/inventory pages
isProductFilterVisible = false;
isInventoryFilterVisible = false;

selectedGroup: string | null = null;
selectedCategory: string | null = null;
selectedType: string | null = null;
selectedWarehouse: string | null = null;

groupOptions: Array<{ value: string; label: string }> = [];
categoryOptions: Array<{ value: string; label: string }> = [];
typeOptions: Array<{ value: string; label: string }> = [];
warehouseOptions: Array<{ value: string; label: string }> = [];



  statusOptions: Array<{ value: string, label: string }> = []; // Store the statuses here

  employeeOptions: Array<{ value: number; label: string }> = [];// Add this for employee filter

  accountOptions: Array<{ value: number; label: string }> = [];


  accountTypeOptions = [
    { value: 'customer', label: 'Customer' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'general', label: 'General' }
  ];

  // List of quick period options like 'Today', 'Last Week', etc.
  quickPeriodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'current_month', label: 'Current Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_six_months', label: 'Last Six Months' },
    { value: 'current_quarter', label: 'Current Quarter' },
    { value: 'year_to_date', label: 'Year to Date' },
    { value: 'last_year', label: 'Last Year' }
  ];
  formConfig: any;

  onQuickPeriodChange() {
    const today = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = today;

    switch (this.selectedQuickPeriod) {
      case 'today':
        startDate = endDate;
        break;
      case 'yesterday':
        startDate = new Date(today.setDate(today.getDate() - 1));
        endDate = startDate;
        break;
      case 'last_week':
        startDate = new Date(today.setDate(today.getDate() - today.getDay() - 6));
        endDate = new Date(today.setDate(startDate.getDate() + 6));
        break;
      case 'current_month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'last_month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'last_six_months':
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 6);
        // Set the day to the start of the month for consistency
        startDate.setDate(1);
        break;
      case 'current_quarter':
        const currentMonth = today.getMonth();
        const quarterStartMonth = currentMonth - (currentMonth % 3);
        startDate = new Date(today.getFullYear(), quarterStartMonth, 1);
        break;
      case 'year_to_date':
        startDate = new Date(today.getFullYear(), 3, 1); // Assuming fiscal year starts in April
        break;
      case 'last_year':
        startDate = new Date(today.getFullYear() - 1, 3, 1);
        endDate = new Date(today.getFullYear(), 2, 31);
        break;
    }

    this.fromDate = startDate;
    this.toDate = endDate;
  }
  loadStatuses() {
    const url = 'masters/order_status/';

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          this.statusOptions = response.data.map(status => ({
            value: status.status_name,  // Use status_name as value
            label: status.status_name   // Use status_name as label
          }));
        } else {
          console.warn('No statuses found in the API response.');
        }
      },
      (error) => {
        console.error('Error fetching statuses:', error);
      }
    );
  }
  onStatusChange(status: string) {
    this.selectedStatus = status;
    // this.applyFilters();
  }

 

loadWarehouses() {
    const url = 'inventory/warehouses/'; 
    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          this.warehouseOptions = response.data.map(warehouse => ({
            value: warehouse.warehouse_id,
            label: warehouse.name
          }));
        } else {
          console.warn('No warehouses found in the API response.');
        }
      },
      (error) => {
        console.error('Error fetching warehouses:', error);
      }
    );
  }

loadGroups() {
    const url = 'products/product_groups'; // Replace with your actual product group API endpoint

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          this.groupOptions = response.data.map(group => ({
            value: group.product_group_id,
            label: group.group_name
          }));
        } else {
          console.warn('No product groups found in the API response.');
        }
      },
      (error) => {
        console.error('Error fetching product groups:', error);
      }
    );
  } 

loadCategories() {
    const url = 'products/product_categories/'; // Replace with your actual product category API endpoint

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          this.categoryOptions = response.data.map(category => ({
            value: category.category_id,
            label: category.category_name
          }));
        } else {
          console.warn('No product categories found in the API response.');
        }
      },
      (error) => {
        console.error('Error fetching product categories:', error);
      }
    );
  } 


loadTypes() {
    const url = 'masters/product_types/'; // Replace with your actual product type API endpoint

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          this.typeOptions = response.data.map(type => ({
            value: type.type_id,
            label: type.type_name
          }));
        } else {
          console.warn('No product types found in the API response.');
        }
      },
      (error) => {
        console.error('Error fetching product types:', error);
      }
    );
  }
  

  loadEmployees() {
    const url = 'hrms/employees/'; // Replace with your actual employee API endpoint

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          // Map the employees' data to options for the select dropdown
          this.employeeOptions = response.data.map(employee => {
            const fullName = `${employee.first_name} ${employee.last_name || ''}`.trim(); // Concatenate first and last names

            return {
              value: employee.employee_id,  // Use the employee ID as value
              label: fullName // Store the full name
            };
          });
        } else {
          console.warn('No employees found in the API response.');
        }
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
  onEmployeeChange(employee: string) {
    this.selectedEmployee = employee; // Now selectedEmployee will store the full name
    console.log('Selected Employee Name:', this.selectedEmployee); // Log full name
    // this.applyFilters(); // Apply the filter immediately
  }

  loadAccounts() {
    if (!this.selectedAccountType) {
      this.accountOptions = [];
      return;
    }

    let url = '';
    switch (this.selectedAccountType) {
      case 'customer':
        url = 'customers/customer/';
        break;
      case 'vendor':
        url = 'vendors/vendor_get/';
        break;
      case 'general':
        url = 'finance/general-accounts/';
        break;
    }

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.data) {
          console.log('Account options loaded:', response);
          // For customer and vendor, use customer_id/vendor_id as the value
          if (this.selectedAccountType === 'customer') {
            this.accountOptions = response.data.map(item => ({
              value: item.customer_id,
              label: item.name
            }));
          } else if (this.selectedAccountType === 'vendor') {
            this.accountOptions = response.data.map(item => ({
              value: item.vendor_id,
              label: item.name
            }));
          } else {
            // For general accounts, use account_id
            this.accountOptions = response.data.map(item => ({
              value: item.account_id,
              label: item.name
            }));
          }
        }
      },
      (error) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

  onAccountTypeChange() {
    this.selectedAccountId = null;
    this.loadAccounts();
  }

  onAccountChange() {
    if (this.selectedAccountType && this.selectedAccountId) {
      console.log("Account selected:", this.selectedAccountType, this.selectedAccountId);

      // For account ledger page
      if (this.router.url === '/admin/finance/account-ledger') {
        console.log("On account ledger page, looking for accountLedgerComponentInstance");

        // Check if we have the global reference to the AccountLedgerComponent
        if (window['accountLedgerComponentInstance'] &&
          typeof window['accountLedgerComponentInstance'].loadLedgerData === 'function') {
          console.log("Using global reference to AccountLedgerComponent");
          window['accountLedgerComponentInstance'].loadLedgerData(
            this.selectedAccountType,
            this.selectedAccountId
          );
          return;
        }

        // Make the API call directly from here as a fallback
        console.log("Making API call directly from table component");
        const apiUrl = `finance/journal_entry_lines_list/${this.selectedAccountId}/`;

        this.http.get(apiUrl).subscribe(
          (response: any) => {
            console.log("API response received directly:", response);
            if (response && response.data) {
              this.rows = response.data;
              this.total = response.count || response.data.length;
              console.log("Data loaded directly in table component", this.rows);
            }
          },
          error => {
            console.error("Error loading data:", error);
          }
        );
        return;
      }
    }

    this.applyFilters(); // Fall back to the default behavior
  }

  // Apply filters like quick period, date range, and status to fetch filtered data
  applyFilters() {
  const filters = {
    quickPeriod: this.selectedQuickPeriod,
    fromDate: this.fromDate,
    toDate: this.toDate,
    status: this.selectedStatus,
    employee: this.selectedEmployee,
    accountType: this.selectedAccountType,
    accountId: this.selectedAccountId,
    group: this.selectedGroup,        
    category: this.selectedCategory,  
    type: this.selectedType,          
    warehouse: this.selectedWarehouse 
  };

  const queryString = this.generateQueryString(filters);
  const page = this.pageIndex;
  const limit = this.pageSize;

  const tableParamConfig: TaParamsConfig = {
    apiUrl: this.options.apiUrl,
    pageIndex: this.pageIndex,
    pageSize: this.pageSize,
    filters: this.filters,
    fixedFilters: this.options.fixedFilters
  }

  // Check if apiUrl already has a '?'
  let url = this.options.apiUrl;
  let connector = url.includes('?') ? '&' : '?';
  url = `${url}${connector}summary=true${queryString ? '&' + queryString.slice(1) : ''}&page=${page}&limit=${limit}`;

  console.log("Making API request to:", url);

  this.http.get(url).subscribe(
    response => {
      this.taTableS.getTableData(tableParamConfig).subscribe((data: any) => {
        this.loading = false;
        this.rows = response['data'] || data;
      });
    },
    error => {
      console.error('Error executing URL:', url, error);
    }
  );
  return url;
}
  
  // Clear all filters like quick period, date range, and status
  clearFilters() {
    // Reset all filter values
    this.selectedQuickPeriod = null;
    this.fromDate = null;
    this.toDate = null;
    this.selectedStatus = null;
    this.selectedEmployee = null; // Clear employee filter
    this.selectedAccountType = null;
    this.selectedAccountId = null;
    this.selectedGroup = null;       
    this.selectedCategory = null;    
    this.selectedType = null;         
    this.selectedWarehouse = null;   

    // Optionally, you might want to clear other filters or reset pagination if necessary
    this.pageIndex = 1;

    // Re-fetch data without any filters
    const tableParamConfig: TaParamsConfig = {
      apiUrl: this.options.apiUrl,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      // filters: {}, // Clear all filters
      fixedFilters: this.options.fixedFilters
    }

    // const url = `${this.options.apiUrl}&page=${this.pageIndex}&limit=${this.pageSize}`;
    const url = `${this.options.apiUrl}`;


    console.log('API URL:', url); // Debugging log

    // const url = this.options.apiUrl; // Base URL without any filters
    this.http.get(url).subscribe(
      response => {
        this.taTableS.getTableData(tableParamConfig).subscribe((data: any) => {
          this.loading = false;
          this.rows = response['data'] || data;
        });
      },
      error => {
        console.error('Error executing URL:', url, error);
      }
    );
  }

  // Generate query string for the API call based on the applied filters
  // generateQueryString(filters: { quickPeriod: string, fromDate: Date, toDate: Date, status: string, employee: string, group:string,category:string,type:string,warehouse:string }): string {
  //   const queryParts: string[] = [];

  //   // Add filter for 'fromDate' if available
  //   if (filters.fromDate) {
  //     const fromDateStr = this.formatDate(filters.fromDate);
  //     queryParts.push(`created_at_after=${encodeURIComponent(fromDateStr)}`);
  //   }

  //   // Add filter for 'toDate' if available
  //   if (filters.toDate) {
  //     const toDateStr = this.formatDate(filters.toDate);
  //     queryParts.push(`created_at_before=${encodeURIComponent(toDateStr)}`);
  //   }

  //   // Add filter for status if available
  //   if (filters.status) {
  //     queryParts.push(`status_name=${encodeURIComponent(filters.status)}`);
  //   }

  //   // Add filter for status if available
  //   if (filters.employee) {
  //     queryParts.push(`employee_id=${encodeURIComponent(filters.employee)}`);
  //   }

  //   if (filters.group) {
  //     queryParts.push(`group_id=${encodeURIComponent(filters.group)}`);
  //   }
  //   if (filters.category) {
  //     queryParts.push(`category_id=${encodeURIComponent(filters.category)}`);
  //   }
  //   if (filters.type) {
  //     queryParts.push(`type_id=${encodeURIComponent(filters.type)}`);
  //   }
  //   if (filters.warehouse) {
  //     queryParts.push(`warehouse_id=${encodeURIComponent(filters.warehouse)}`);
  //   }


  //   // Return the query string by joining all the filters
  //   // return '?' + queryParts.join('&'); 
  //   // Return the query string by joining all the filters
  //   // return '?&' + queryParts.join('&');
  //    return queryParts.length ? '&' + queryParts.join('&') : '';
  // }

  generateQueryString(filters: { 
    quickPeriod?: string | null, 
    fromDate?: Date | null, 
    toDate?: Date | null, 
    status?: string | null, 
    employee?: string | number | null, 
    group?: string | number | null, 
    category?: string | number | null, 
    type?: string | number | null, 
    warehouse?: string | number | null 
    }): string {
    const queryParts: string[] = [];

    // Add filter for 'fromDate' if available
    if (filters.fromDate) {
      const fromDateStr = this.formatDate(filters.fromDate);
      queryParts.push(`created_at_after=${encodeURIComponent(fromDateStr)}`);
    }

    // Add filter for 'toDate' if available
    if (filters.toDate) {
      const toDateStr = this.formatDate(filters.toDate);
      queryParts.push(`created_at_before=${encodeURIComponent(toDateStr)}`);
    }

    // Add filter for status if available
    if (filters.status) {
      queryParts.push(`status_name=${encodeURIComponent(filters.status)}`);
    }

    // Add filter for status if available
    if (filters.employee) {
      queryParts.push(`employee_id=${encodeURIComponent(filters.employee)}`);
    }

    if (filters.group) {
      queryParts.push(`product_group_id=${encodeURIComponent(filters.group.toString())}`);
    }

    if (filters.category) {
      queryParts.push(`category_id=${encodeURIComponent(filters.category.toString())}`);
    }

    if (filters.type) {
      queryParts.push(`type_id=${encodeURIComponent(filters.type.toString())}`);
    }

    if (filters.warehouse) {
      queryParts.push(`warehouse_id=${encodeURIComponent(filters.warehouse.toString())}`);
    }

    return queryParts.length ? '&' + queryParts.join('&') : '';
    }

  formatDate(date: Date): string {
    // Format date as 'yyyy-MM-dd'
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Also update downloadData to use the same logic
downloadData(event: any) {
  const tableParamConfig: TaParamsConfig = {
    apiUrl: this.options.apiUrl,
    pageIndex: this.pageIndex,
    pageSize: this.pageSize,
  }

  this.taTableS.getTableData(tableParamConfig).subscribe((data: any) => {
    this.loading = false;
    const full_path = this.options.apiUrl
    const name_of_file = full_path.split('/')[1]
    let url = full_path;
    let connector = url.includes('?') ? '&' : '?';
    const query = this.applyFilters();
    url = `${url}${connector}summary=true${query ? '&' + query.split('?')[1] : ''}&download=excel`;

    const download_url = url;
    this.http.get(download_url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `${name_of_file}.xlsx`
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  })
};

  searchValue = '';
  visible = false;
  total = 1;
  rows: any[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  sort: any;
  filters = <any>[];
  filterGender = [
    { text: 'male', value: 'male' },
    { text: 'female', value: 'female' },
  ];
  globalSearchValue = '';
  actionObservable$: Subscription = new Subscription();
  filtersObservable$: Subscription = new Subscription();

  constructor(
    public taTableS: TaTableService,
    private http: HttpClient,
    private router: Router,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    this.actionObservable$ = this.taTableS.actionObserval().subscribe((res: any) => {
      // if (res && res.action && res.action.type === 'delete') {
      //   this.deleteRow(res);
      // }
      // this.doAction.emit(res);
    });
    this.filtersObservable$ = this.taTableS.filterObserval().subscribe((res: any) => {
      // // console.log('res', res);
    });
  }



  ngOnInit(): void {
    // // console.log('table otpions', this.options);
    this.options.checkedRows = [];
    if (this.options.pageSize) {
      this.pageSize = this.options.pageSize;
    } else {
      this.options.pageSize = 10;
    }
    this.options.reload = () => { this.reload() };

    if (!this.options.pageSizeOptions) {
      this.options.pageSizeOptions = [10, 20, 30, 50, 100, 300, 500, 1000]
    }
    if (!this.options.tableLayout) this.options.tableLayout = "fixed";
    if (!this.options.cols) this.options.cols = [];
    if (this.options.bordered !== false) this.options.bordered = true;
    if (!this.options.paginationPosition)
      this.options.paginationPosition = 'bottom';
    // this.loadDataFromServer();
    const currentUrl = this.router.url;
    this.isAccountLedgerPage = this.router.url === '/admin/finance/account-ledger';

    if (this.isAccountLedgerPage) {
      this.loadAccounts();
    }

    
    // console.log('Current URL:', currentUrl); 
    const visibleUrls = [
      '/admin/purchase',
      '/admin/purchase/invoice',
      '/admin/purchase/purchase-invoice',
      '/admin/purchase/purchasereturns',
      '/admin/sales',
      '/admin/sales/salesinvoice',
      '/admin/sales/sale-returns',
      '/admin/hrms/employee-attendance',
      '/admin/employees',
      '/admin/hrms/employee-leave-balance',
      '/admin/reports/sales-reports',
      '/admin/reports/production-reports',
      '/admin/reports/purchase-reports',
      '/admin/reports/vendor-reports',
      '/admin/reports/customer-reports',
      '/admin/reports/ledgers-reports',
      '/admin/finance/account-ledger',
      '/admin/finance/expense-item',
    ]
    this.loadStatuses();
    this.loadEmployees();
    this.loadGroups();
    this.loadCategories();
    this.loadTypes();
    this.loadWarehouses();

    // Show status filter for specific URLs    
    this.isButtonVisible = visibleUrls.includes(currentUrl);

    // Hide status button for specific URLs
    const hideStatusUrls = [
      '/admin/hrms/employee-attendance',
      '/admin/employees',// Added employees URL
      '/admin/hrms/employee-leave-balance',
      '/admin/finance/account-ledger',
      '/admin/finance/expense-item',
      '/admin/inventory',
      
      

    ];
    this.isStatusButtonVisible = !hideStatusUrls.includes(currentUrl);

    // Show employee filter for specific URLs
    const employeeFilterUrls = [
      '/admin/hrms/employee-attendance',
      '/admin/employees', // Added employees URL
      '/admin/hrms/employee-leave-balance'
    ];
    this.isEmployeeFilterVisible = employeeFilterUrls.includes(currentUrl);

    const productFilterUrls = ['/admin/products',];
    this.isProductFilterVisible = productFilterUrls.includes(currentUrl);
    const inventoryFilterUrls = ['/admin/inventory'];  
    this.isInventoryFilterVisible = inventoryFilterUrls.includes(currentUrl);
   
    // // Check if current URL is '/admin/hrms/employee-attendance' to show employee filter
    // this.isEmployeeFilterVisible = currentUrl === '/admin/hrms/employee-attendance';

    // if (currentUrl === '/admin/hrms/employee-attendance') { // add URL where you want to hide the Status dropdown.
    //   this.isStatusButtonVisible = false;  // Hide Status dropdown for this specific URL
    // } else {
    //   this.isStatusButtonVisible = true;   // Show Status dropdown for other URLs
    // }
  }
  loadDataFromServer(startIntial?: boolean): void {

    // let _pageIndex = this.pageIndex;
    // if(startIntial){
    //   _pageIndex = 1;
    // }
    const tableParamConfig: TaParamsConfig = {
      apiUrl: this.options.apiUrl,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sort: this.sort,
      filters: this.filters,
      globalSearch: this.options.globalSearch,
      fixedFilters: this.options.fixedFilters
    }
    if (tableParamConfig.apiUrl) {
      this.loading = true;
      this.taTableS.getTableData(tableParamConfig).subscribe((data: any) => {
        this.loading = false;
        this.total = data.totalCount; // mock the total data here
        this.rows = data.data || data;
        if (this.options.showCheckbox) {
          this.refreshCheckedStatus();
        }
        this.cdr.detectChanges();
      }, (error) => {
        this.loading = false;
      });
    }

  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // // console.log('onQueryParamsChange', params);
    // { this.pageSize, this.pageIndex, this.sort, this.filters } = params;
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex;
    //this.filters = params.filter;
    const sort = params.sort;
    this.sort = null;
    const currentSort = sort.find((item) => item.value);
    if (currentSort) {
      const sortField = (currentSort && currentSort.key) || null;
      const sortOrder = (currentSort && currentSort.value) || null;
      this.sort = { key: sortField, value: sortOrder };
    } else {
      if (this.options.defaultSort) {
        this.sort = this.options.defaultSort
      }
    }

    this.loadDataFromServer();
    // this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.rows.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every((row) => this.setOfCheckedId.has(row[this.options.pkId]));
    this.options.checkedRows = Array.from(this.setOfCheckedId) || [];
    this.indeterminate = listOfEnabledData.some((row) => this.setOfCheckedId.has(row[this.options.pkId])) && !this.checked;
  }
  onAllChecked(checked: boolean): void {
    this.rows
      .filter(({ disabled }) => !disabled)
      .forEach((row) => this.updateCheckedSet(row[this.options.pkId], checked));
    this.refreshCheckedStatus();
  }
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  reset(c: any) {
    c.searchValue = null;
    this.filters = [];
    (this.pageIndex == 1) ? this.loadDataFromServer() : this.pageIndex = 1;
  }
  setFilter(c: any) {
    this.options.globalSearch.value = null;
    this.globalSearchValue = '';
    this.filters = [];
    this.options.cols?.forEach(c => {
      let filterKey = c.fieldKey;
      if (c.filter && c.filter.key) {
        filterKey = c.filter.key;
      }
      let _opt = null;
      if (c.filter && c.filter.operator) {
        _opt = c.filter.operator;
      }
      this.filters.push({ key: filterKey, operator: _opt, value: c.filterValue });
    });


    //this.filters = [{ key: filterKey, operator: _opt, value: c.filterValue }];
    // find if exist

    // this.loadDataFromServer(true);
    (this.pageIndex == 1) ? this.loadDataFromServer() : this.pageIndex = 1;
  }
  globalSearch() {
    if (!this.options.globalSearch) {
      this.options.globalSearch = {
        keys: []
      }
    }
    if (this.globalSearchValue) {
      this.options.globalSearch.value = this.globalSearchValue;
    } else {
      this.options.globalSearch.value = null;
    }
    (this.pageIndex == 1) ? this.loadDataFromServer() : this.pageIndex = 1;

  }
  // starting page
  refresh() {
    this.filters = [];
    (this.pageIndex == 1) ? this.loadDataFromServer() : this.pageIndex = 1;

    // this.loadDataFromServer(true);
  }
  reload() {
    this.loadDataFromServer();
  }
  globalSearchClear() {
    this.globalSearchValue = '';
    this.globalSearch();
  }

  refreshIcon() {
    // Clear any active filters and global search values
    this.filters = [];
    this.globalSearchValue = '';
    if (this.options.globalSearch) {
      this.options.globalSearch.value = null;
    }
    // Reload data starting from page 1 if not already on page 1
    (this.pageIndex === 1) ? this.loadDataFromServer() : this.pageIndex = 1;
  }

  filterFun(event: any) {
    // console.log(event);
  }
  nzPageIndexChange(event: number) {
    // console.log('nzPageIndexChange', event);
    this.pageIndex = event;
  }
  nzPageSizeChange(event: number) {
    // console.log('nzPageSizeChange', event);
    this.pageSize = event;
  }
  nzSortOrderChange(event: any) {
    // console.log('nzSortOrderChange', event);
  }
  deleteRow(action: any) {
    this.taTableS.deleterow(action.action.apiUrl, action.data, this.options).subscribe(res => {
      this.loadDataFromServer();
    });
  }

  loadTableData() {
    // console.log('this.pageIndex', this.pageIndex);
    // console.log('this.pageSize', this.pageSize);
  }
  exportExcel() {
    let _rows = cloneDeep(this.rows);
    if (this.options.export) {
      _rows = _rows.map((r: any) => {
        const _r: any = <any>{};
        let _cols = []
        _cols = (this.options.export.cols) ? this.options.export.cols : this.options.cols;
        _cols.forEach((col: any) => {
          // Skip 'action' type columns
          if (col.type === 'action') return;

          // 1) Check if displayType=map and mapFn is a function
          if (col.displayType === 'map' && typeof col.mapFn === 'function') {
            _r[col.name] = col.mapFn(r[col.fieldKey], r, col);
          } else {
            // 2) Otherwise just use the raw value
            _r[col.name] = getValue(r, col.fieldKey);
          }

          // 3) If it's a date type, format it
          if (col.type === 'date') {
            _r[col.name] = moment(_r[col.name]).format('MMMM Do YYYY, h:mm:ss a');
          }
        });
        return _r;
      });

    }
    this.taTableS.exportDataAsExcelFile(_rows, this.options.export.downloadName || this.options.title || 'list-data');

    console.log('_rows', _rows);
    //getValue()
    // const tableElementref: ElementRef = this.taTable.elementRef as ElementRef;
    // this.taTableS.exportTableAsExcelFile(tableElementref.nativeElement, 'test');
  }
  actionClick(event) {
    if (event && event.action && event.action.type === 'delete') {
      this.deleteRow(event);
    }
    this.doAction.emit(event);
  }

  ngOnDestroy() {
    this.actionObservable$.unsubscribe();
  }
  // Additional code for handling action button events in the table(added this code for file upload)(start)
  performAction(action: any, row: any) {
    if (action && action.type === 'callBackFn' && typeof action.callBackFn === 'function') {
      action.callBackFn(row); // Execute the callback function with row data
    }

    // Optionally, emit the event to parent if needed
    this.doAction.emit({ action, row });
  }

  /**
   * View the uploaded file
   * @param rowData Row data containing file information
   */
  viewFile(rowData: any): void {
    // Check if the row has the actual file path to view
    if (rowData && rowData.receipt_path && rowData.receipt_path.length > 0) {
      // If receipt_path is available in the data, use it to open the file
      const fileUrl = rowData.receipt_path[0].attachment_path;
      window.open(fileUrl, '_blank');
    } else if (rowData && rowData.selectedFile) {
      // If we have the actual file object (recent uploads that aren't saved yet)
      const fileUrl = URL.createObjectURL(rowData.selectedFile);
      window.open(fileUrl, '_blank');
    } else {
      // Show message if no file is available to view
      alert('No viewable file found. The file might not be uploaded to the server yet.');
    }
  }
  onRowSelect(row) {
    if (this.options.rowSelection) {
      this.options.rowSelection(row);
    }
  }

  // getFilters(){
  //   const filters = this.options.cols.filter((item: { searchValue: any; })=>{
  //     item.searchValue;
  //   });
  // }

  // constructor() { }
  // ngOnInit(): void {
  // }
  // listOfColumns: ColumnItem[] = [
  //   {
  //     name: 'Name',
  //     sortOrder: null,
  //     sortFn: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name),
  //     listOfFilter: [
  //       { text: 'Joe', value: 'Joe' },
  //       { text: 'Jim', value: 'Jim' }
  //     ],
  //     filterFn: (list: string[], item: DataItem) => list.some(name => item.name.indexOf(name) !== -1)
  //   },
  //   {
  //     name: 'Age',
  //     sortOrder: null,
  //     sortFn: (a: DataItem, b: DataItem) => a.age - b.age,
  //     listOfFilter: [],
  //     filterFn: null
  //   },
  //   {
  //     name: 'Address',
  //     sortFn: null,
  //     sortOrder: null,
  //     listOfFilter: [
  //       { text: 'London', value: 'London' },
  //       { text: 'Sidney', value: 'Sidney' }
  //     ],
  //     filterFn: (address: string, item: DataItem) => item.address.indexOf(address) !== -1
  //   }
  // ];
  // listOfData: DataItem[] = [
  //   {
  //     name: 'John Brown',
  //     age: 32,
  //     address: 'New York No. 1 Lake Park'
  //   },
  //   {
  //     name: 'Jim Green',
  //     age: 42,
  //     address: 'London No. 1 Lake Park'
  //   },
  //   {
  //     name: 'Joe Black',
  //     age: 32,
  //     address: 'Sidney No. 1 Lake Park'
  //   },
  //   {
  //     name: 'Jim Red',
  //     age: 32,
  //     address: 'London No. 2 Lake Park'
  //   }
  // ];

  // trackByName(_: number, item: ColumnItem): string {
  //   return item.name;
  // }

  // sortByAge(): void {
  //   this.listOfColumns.forEach(item => {
  //     if (item.name === 'Age') {
  //       item.sortOrder = 'descend';
  //     } else {
  //       item.sortOrder = null;
  //     }
  //   });
  // }

  // resetFilters(): void {
  //   this.listOfColumns.forEach(item => {
  //     if (item.name === 'Name') {
  //       item.listOfFilter = [
  //         { text: 'Joe', value: 'Joe' },
  //         { text: 'Jim', value: 'Jim' }
  //       ];
  //     } else if (item.name === 'Address') {
  //       item.listOfFilter = [
  //         { text: 'London', value: 'London' },
  //         { text: 'Sidney', value: 'Sidney' }
  //       ];
  //     }
  //   });
  // }

  // resetSortAndFilters(): void {
  //   this.listOfColumns.forEach(item => {
  //     item.sortOrder = null;
  //   });
  //   this.resetFilters();
  // }
}
