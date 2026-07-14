import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';
import { DoubleClickNavigationService } from 'src/app/services/double-click-navigation.service';
import { BulkSelection } from 'src/app/admin/utils/bulk-operations.service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent {

  @Output('edit') edit = new EventEmitter<any>();
  @Output('bulkEdit') bulkEdit = new EventEmitter<BulkSelection>();
  @Output('exportCustomers') exportCustomers = new EventEmitter<BulkSelection>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;
  constructor(private http: HttpClient, private router: Router, private message: NzMessageService, private dblClickNav: DoubleClickNavigationService) { }

  /** Single source of truth for select-all-matching lives in ta-table (checkboxes + banner stay in sync). */
  get selectAllMatching(): boolean {
    return !!this.taTableComponent?.selectAllMatching;
  }

  /** Selected customer IDs — read directly from ta-table's checkedRows */
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

  /** Count shown on the Export button (all-matching total, else explicit selection). */
  get exportCount(): number {
    return this.selectAllMatching ? this.totalRecords : this.selectedIds.length;
  }

  get isOverLimit(): boolean {
    // The 100 cap only applies to explicit selection; select-all-matching bypasses it.
    return !this.selectAllMatching && this.selectedIds.length > 100;
  }

  refreshTable() {
    this.taTableComponent?.refresh();
  }

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
      this.exportCustomers.emit({
        selectAll: true,
        filterQuery: this.taTableComponent?.getFilterQuery() || '',
        count: this.totalRecords
      });
    } else {
      this.exportCustomers.emit({ ids: [...this.selectedIds], count: this.selectedIds.length });
    }
  }

  tableConfig: TaTableConfig = {
    apiUrl: 'customers/customers/?summary=true',
    showCheckbox: true,
    pkId: "customer_id",
    rowEvents: {
      dblclick: this.dblClickNav.createHandler({ pkField: 'customer_id', moduleName: 'Customers', sectionName: 'Customer', editEmitter: this.edit }),
    },
    export: {
      downloadName: 'customers'
    },
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      },
    ],
    pageSize: 10,
    "globalSearch": {
      keys: ['created_at', 'name', 'email', 'phone', 'gst', 'city_id', 'ledger_account_id']
    },
    // defaultSort: { key: 'is_deleted', value: 'ascend' },
    defaultSort: { key: 'created_at', value: 'descend' },
    extraFields: [
      { fieldKey: 'customer_code',        name: 'Customer Code'              },
      { fieldKey: 'pan',                  name: 'PAN'                        },
      { fieldKey: 'website',              name: 'Website'                    },
      { fieldKey: 'is_sub_customer',      name: 'Sub Customer',   displayType: 'map', mapFn: (v: any) => v ? 'Yes' : 'No' },
      { fieldKey: 'customer_common',      name: 'Common Customer',displayType: 'map', mapFn: (v: any) => v ? 'Yes' : 'No' },
      { fieldKey: 'enable_portal_access', name: 'Portal Access',  displayType: 'map', mapFn: (v: any) => v ? 'Yes' : 'No' },
      { fieldKey: 'tds_applicable',       name: 'TDS Applicable', displayType: 'map', mapFn: (v: any) => v ? 'Yes' : 'No' },
      { fieldKey: 'gst_suspend',          name: 'GST Suspend',    displayType: 'map', mapFn: (v: any) => v ? 'Yes' : 'No' },
      { fieldKey: 'ledger_account_id',    name: 'Ledger Account', displayType: 'map', mapFn: (_v: any, row: any) => row.ledger_account?.name || '' },
      { fieldKey: 'pin_code',             name: 'Pin Code'                   },
      { fieldKey: 'customer_addresses',   name: 'Shipping Address', displayType: 'map', mapFn: (_v: any, row: any) => row.customer_addresses?.custom_shipping_address || '' },
    ],
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true,
        isEdit: true,
        isEditSumbmit: (row, value, col) => {
        },
        autoSave: {
          apiUrl: row => `customers/customers/${row.customer_id}`,
          method: 'patch',
          body: (row: any, value: any, col: any) => {
            return {
              customer_id: row.customer_id,
              name: value,
              customer_addresses: row.customer_addresses
            };
          }
        }
      },
      {
        fieldKey: 'email',
        name: 'Email',
        sort: false
      },
      {
        fieldKey: 'phone',
        name: 'Phone',
        sort: false,
      },
      {
        fieldKey: 'gst',
        name: 'GST',
        sort: true,
      },
      {
        fieldKey: 'city_id',
        name: 'City Name',
        sort: false,
        displayType: 'map',
        mapFn: (_v: any, row: any) => row.city?.city_name || '',
      },

      {
        fieldKey: 'code',
        name: 'Action',
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            confirm: true,
            confirmMsg: "Sure to delete?",
            apiUrl: 'customers/customers'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'customers/customers'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
            callBackFn: (row, action) => {
              this.edit.emit(row.customer_id);
            }
          }
        ]
      },
    ]
  };

}





