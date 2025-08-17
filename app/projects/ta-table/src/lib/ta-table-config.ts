import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface TaTableConfig {
  title?: string;
  pageSize?: number;
  apiUrl?: string;
  cols?: ColumnItem[];
  export?: Export | any;
  pkId?: string;
  paginationPosition?: 'top' | 'bottom' | 'both';
  scrollX?: any;
  scrollY?: any;
  globalSearch?: {
    keys?: any[];
    label?: string; //default search
  } | any;
  fixedFilters?: Filter[],
  bordered?: boolean;
  tableLayout?: 'fixed' | 'auto';
  pageSizeOptions?: number[];
  showCheckbox?: boolean;
  defaultSort?: { key?: string, value?: 'ascend' | 'descend' },
  checkedRows?: any[],
  reload?: () => any,
  rowSelectionEnabled?: boolean
  rowSelection?: (row: any) => any;
}

export interface Export {
  downloadName?: string;
  cols?: ColumnItem[] | string[]
}
export interface ColumnItem {
  fieldKey?: string;
  name?: string;
  isEdit?: boolean;
  filterValue?: any;
  sort?: boolean | undefined;
  sortKey?: string;
  filter?: Filter | any;
  sortOrder?: NzTableSortOrder | null;
  sortFn?: NzTableSortFn | null;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn | null;
  type?: string;
  visible?: boolean;
  actions?: Action[];
  displayType?: 'html' | any;
  tdClassName?: string;
  thClassName?: string;
  html?: string;
  mapFn?: (currentValue: any, row: any, col: any) => any;
  isEditSumbmit?: (row: any, value: any, col: any) => any;
  ellipsis?: boolean;
  width?: any;
  [any: string]: any;
}
interface Action {
  type?: string;
  label?: string | ((row: any, action?: any) => string);  // <-- Update here;
  confirm?: boolean;
  confirmMsg?: string;
  icon?: string;
  apiUrl?: string;
  callBackFn?: (row: any, action: any) => any; // if type == 'callBackFn'
  conditionFn?: (row: any, action: any) => any;
  [any: string]: any;
}

export interface TaParamsConfig {
  apiUrl?: string;
  pageIndex: number;
  pageSize: number;
  sort?: any;
  filters?: Array<{ key: string; value: string[] }> | null;
  globalSearch?: { keys: [], value: string } | any;
  fixedFilters?: Filter[];
}

export interface Filter {
  key?: string,
  value?: any,
  operator?: string,
  valueFn?: () => any;
  conditionFn?: () => any;
  placeholder?: any;
  [any: string]: any;
}
