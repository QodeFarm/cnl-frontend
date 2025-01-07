import { Component, Input, OnDestroy, OnInit, Output, ViewChild, EventEmitter, ElementRef, TemplateRef  } from '@angular/core';
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
  
  selectedEmployee: string | null = null;
  selectedStatus: string | null = null;
  selectedQuickPeriod: string | null = null;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  isButtonVisible = false;
  isStatusButtonVisible = false;
  isEmployeeFilterVisible = false;

  statusOptions: Array<{ value: string, label: string }> = []; // Store the statuses here

  employeeOptions: Array<{ value: number; label: string }> = [];// Add this for employee filter


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
  ;
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
  ;
  loadEmployees() {
    const url = 'hrms/employees/'; // Replace with your actual employee API endpoint
  
    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          // Map the employees' data to options for the select dropdown
          this.employeeOptions = response.data.map(employee => {
          console.log('Fetched Employee List:', this.employeeOptions);
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

  // Apply filters like quick period, date range, and status to fetch filtered data
  applyFilters() {
    // Construct the filters object
    const filters = {
      quickPeriod: this.selectedQuickPeriod,
      fromDate: this.fromDate,
      toDate: this.toDate,
      status: this.selectedStatus,
      employee :this.selectedEmployee,
    };

    // Generate query string from filters
    const queryString = this.generateQueryString(filters);

    // Add page and limit parameters
    const page = this.pageIndex;
    const limit = this.pageSize;

    const tableParamConfig: TaParamsConfig = {
      apiUrl: this.options.apiUrl,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      filters: this.filters,
      fixedFilters: this.options.fixedFilters
    }

    // Append page and limit to the query string
    // Construct final URL with filters and pagination
    const finalQueryString = `${queryString}&page=${page}&limit=${limit}`;

    const full_path = this.options.apiUrl;
    const url = `${full_path}${finalQueryString}`;

    // Fetch filtered data from the server using the constructed URL
    this.http.get(url).subscribe(
      response => {
        this.taTableS.getTableData(tableParamConfig).subscribe((data: any) => {
          this.loading = false;
          this.rows = response['data'] || data;
        });
      },
      error => {
        console.error('Error executing URL:', `${full_path}${queryString}`, error);
      }
    );
    // return queryString;
    return finalQueryString;
  }

  // Clear all filters like quick period, date range, and status
  clearFilters() {
    // Reset all filter values
    this.selectedQuickPeriod = null;
    this.fromDate = null;
    this.toDate = null;
    this.selectedStatus = null;
    this.selectedEmployee = null; // Clear employee filter

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
  generateQueryString(filters: { quickPeriod: string, fromDate: Date, toDate: Date, status: string, employee: string }): string {
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

    // Return the query string by joining all the filters
    return '?&' + queryParts.join('&');
  }
  formatDate(date: Date): string {
    // Format date as 'yyyy-MM-dd'
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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
      let fullUrl = `${this.options.apiUrl}`;
      const query = this.applyFilters()
      if (query.length > 1) {
        fullUrl = `${fullUrl}${query}&`
      }

      const download_url = `${fullUrl}download/excel/`
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
    private router: Router
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
    if (this.options.pageSize) {
      this.pageSize = this.options.pageSize;
    } else {
      this.options.pageSize = 10;
    }
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
      '/admin/hrms/employee-leave-balance'
    ]
    this.loadStatuses();
    this.loadEmployees();

    // Show status filter for specific URLs    
    this.isButtonVisible = visibleUrls.includes(currentUrl);

    // Hide status button for specific URLs
    const hideStatusUrls = [
      '/admin/hrms/employee-attendance',
      '/admin/employees',// Added employees URL
      '/admin/hrms/employee-leave-balance'
    ];
    this.isStatusButtonVisible = !hideStatusUrls.includes(currentUrl);

    // Show employee filter for specific URLs
    const employeeFilterUrls = [
      '/admin/hrms/employee-attendance',
      '/admin/employees', // Added employees URL
      '/admin/hrms/employee-leave-balance'
    ];
    this.isEmployeeFilterVisible = employeeFilterUrls.includes(currentUrl);

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
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.sort = { key: sortField, value: sortOrder };
    this.loadDataFromServer();
    // this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
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
  export() {
    let _rows = cloneDeep(this.rows);
    if (this.options.export && this.options.export.cols && this.options.export.cols.length > 0) {
      _rows = _rows.map((r: any) => {
        const _r: any = <any>{};
        this.options.export.cols.forEach((col: any) => {

          _r[col.name] = getValue(r, col.fieldKey);

          if (col.type === 'date') {
            _r[col.name] = moment(_r[col.name]).format('MMMM Do YYYY, h:mm:ss a')
          }
        });
        return _r;
      });

    }
    // this.taTableS.exportDataAsExcelFile(_rows, this.options.export.downloadName || this.options.title);

    // console.log('_rows', _rows);
    // getValue()
    // const tableElementref:ElementRef = this.taTable.elementRef as ElementRef;
    // this.taTableS.exportTableAsExcelFile(tableElementref.nativeElement,'test');
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
