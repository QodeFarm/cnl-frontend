import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { DoubleClickNavigationService } from 'src/app/services/double-click-navigation.service';
import { BulkSelection } from 'src/app/admin/utils/bulk-operations.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent {

  @Output('edit') edit = new EventEmitter<any>();
  @Output('bulkEdit') bulkEdit = new EventEmitter<BulkSelection>();
  @Output('exportProducts') exportProducts = new EventEmitter<BulkSelection>();
  @Output('mergeProducts') mergeProducts = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  /** Single source of truth for select-all-matching lives in ta-table so the toolbar
   *  banner and the row/header checkboxes can never disagree. */
  get selectAllMatching(): boolean {
    return !!this.taTableComponent?.selectAllMatching;
  }

  /** Selected product IDs from ta-table's checkedRows */
  get selectedIds(): string[] {
    return (this.tableConfig.checkedRows as string[]) || [];
  }

  /** Total records matching the current filter (across all pages). */
  get totalRecords(): number {
    return this.taTableComponent?.total || 0;
  }

  /** The header checkbox is on = every enabled row on the current page is ticked. */
  get pageFullySelected(): boolean {
    return !!this.taTableComponent?.checked;
  }

  /** Offer "select all matching" only when the page is full-selected and more rows exist. */
  get canSelectAllMatching(): boolean {
    return !this.selectAllMatching && this.pageFullySelected && this.totalRecords > this.selectedIds.length;
  }

  /** "All N matching" banner is active (state owned by ta-table). */
  get selectAllMatchingActive(): boolean {
    return this.selectAllMatching;
  }

  enableSelectAllMatching() {
    this.taTableComponent?.enableSelectAllMatching();
  }

  get isOverLimit(): boolean {
    // The 100 cap only applies to explicit selection; select-all-matching bypasses it.
    return !this.selectAllMatching && this.selectedIds.length > 100;
  }

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  /** Clear all checkbox selections (and exit select-all-matching). */
  clearSelections() {
    this.taTableComponent?.clearAllSelections();
    this.tableConfig.checkedRows = [];
  }

  /** Emit the selection (explicit ids, or all-matching + filter) to parent for bulk edit */
  onBulkEditClick() {
    if (this.selectAllMatching) {
      this.bulkEdit.emit({
        selectAll: true,
        filterQuery: this.taTableComponent?.getFilterQuery() || '',
        count: this.totalRecords
      });
    } else {
      this.bulkEdit.emit({ ids: [...this.selectedIds], count: this.selectedIds.length });
    }
  }

  /** Emit the selection to parent for export (all-matching, explicit ids, or none=all) */
  onExportClick() {
    if (this.selectAllMatching) {
      this.exportProducts.emit({
        selectAll: true,
        filterQuery: this.taTableComponent?.getFilterQuery() || '',
        count: this.totalRecords
      });
    } else {
      this.exportProducts.emit({ ids: [...this.selectedIds], count: this.selectedIds.length });
    }
  }

  /** Count shown on the Export button (all-matching total, else explicit selection). */
  get exportCount(): number {
    return this.selectAllMatching ? this.totalRecords : this.selectedIds.length;
  }

  /** Emit merge event to parent (parent closes modal then navigates) */
  onMergeClick() {
    this.mergeProducts.emit();
  }

  tableConfig: TaTableConfig = {
    apiUrl: 'products/products/?summary=true',
    showCheckbox: true,
    title: 'Products',
    pkId: "product_id",
    rowEvents: {
      dblclick: this.dblClickNav.createHandler({ pkField: 'product_id', moduleName: 'Products', sectionName: 'Product', editEmitter: this.edit }),
    },
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    globalSearch: {
      keys: ['created_at', 'name', 'code', 'type_name', 'group_name','category', 'stock_unit', 'balance', 'sales_rate', 'mrp', 'dis_amount', 'print_name', 'hsn_code', 'barcode']
    },
    export: { downloadName: 'ProductsList' },
    defaultSort: { key: 'code', value: 'descend' },
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true
      },
      {
        fieldKey: 'code',
        name: 'Code',
        sort: true
      },
      {
        fieldKey: 'type_name',
        name: 'Type',
        sort: true,
        displayType: "map",
        mapFn: (v, row) => row?.type?.type_name || ''
      },
      {
        fieldKey: 'group_name',
        name: 'Group',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row?.product_group?.group_name || '';
        },
      },
      {
        fieldKey: 'category_name',
        name: 'Category',
        sort: true,
        displayType: "map",
        mapFn: (v, row) => row?.category?.category_name || ''
      },
      {
        fieldKey: 'stock_unit',
        name: 'Stock Unit',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row?.stock_unit?.stock_unit_name || '';
        },
      },
      {
        fieldKey: 'sales_rate',
        name: 'Sales Rate',
        sort: true,
        isEdit: true,
        isEditSumbmit: (row, value, col) => {
          console.log("isEditSumbmit", row, value, col);
          // Implement your logic here
          // For example, you can make an API call to save the edited value
          // this.http.put(`api/sales/${row.sale_order_id}`, { total_amount: value }).subscribe(...);
        },
        autoSave: {
          apiUrl: row => `products/products/${row.product_id}`,
          method: 'patch',
          body: (row: any, value: any, col: any) => {
            console.log('PATCH value:', value); // Add this log
            return {
              [col.fieldKey]: value,
              product_id: row.product_id
            };
          }

        }
      },
      {
        fieldKey: 'wholesale_rate',
        name: 'WholeSale Rate',
        sort: true,
        isEdit: true,
        isEditSumbmit: (row, value, col) => {
          console.log("isEditSumbmit", row, value, col);
          // Implement your logic here
        },
        autoSave: {
          apiUrl: row => `products/products/${row.product_id}`,
          method: 'patch',
          body: (row: any, value: any, col: any) => {
            console.log('PATCH value:', value); // Add this log
            return {
              [col.fieldKey]: value,
              product_id: row.product_id
            };
          }
        }

      },
      {
        fieldKey: 'dealer_rate',
        name: 'Dealer Rate',
        sort: true,
        isEdit: true,
        isEditSumbmit: (row, value, col) => {
          console.log("isEditSumbmit", row, value, col);
          // Implement your logic here
        },
        autoSave: {
          apiUrl: row => `products/products/${row.product_id}`,
          method: 'patch',
          body: (row: any, value: any, col: any) => {
            console.log('PATCH value:', value); // Add this log
            return {
              [col.fieldKey]: value,
              product_id: row.product_id
            };
          }
        }
      },
      {
        fieldKey: 'discount',
        name: 'Disc(%)',
        sort: true
      },
      {
        fieldKey: 'balance',
        name: 'Balance',
        sort: true
        // Inline stock edit removed on purpose: stock/balance must change through
        // Stock Management / Stock Adjustment so there is an audit trail. Read-only here.
      },
      {
        fieldKey: 'physical_balance',
        name: 'Physical Balance',
        sort: true,
        isEdit: true,
        isEditSumbmit: (row, value, col) => {
          console.log("isEditSumbmit", row, value, col);
          // Implement your logic here
        },
        autoSave: {
          apiUrl: row => `products/products/${row.product_id}`,
          method: 'patch',
          body: (row: any, value: any, col: any) => {
            console.log('PATCH value:', value); // Add this log
            return {
              [col.fieldKey]: value,
              product_id: row.product_id
            };
          }
        }
      },
      {
        fieldKey: 'balance_diff',
        name: 'Balance Diff',
        sort: true,
        displayType: 'map',
        mapFn: (value: number, row: any) => {
          if (value > 0) {
            return `<span class="text-success fw-bold">+${value}</span>`;
          }
          if (value < 0) {
            return `<span class="text-danger fw-bold">${value}</span>`;
          }
          return `<span>${value || 0}</span>`;
        }
      },

      // {
      //   fieldKey: 'hsn_code',
      //   name: 'HSN',
      //   sort: true
      // },
      // {
      //   fieldKey: 'barcode',
      //   name: 'Barcode',
      //   sort: true
      // },
      {
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            confirm: true,
            confirmMsg: "Sure to delete?",
            apiUrl: 'products/products'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'products/products'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.product_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router, private http: HttpClient, private dblClickNav: DoubleClickNavigationService) { }

}
