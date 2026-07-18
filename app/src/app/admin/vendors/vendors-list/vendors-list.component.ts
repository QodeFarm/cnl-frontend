import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { DoubleClickNavigationService } from 'src/app/services/double-click-navigation.service';
import { BulkSelection } from 'src/app/admin/utils/bulk-operations.service';

@Component({
  selector: 'app-vendors-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.scss']
})
export class VendorsListComponent {

  @Output('edit') edit = new EventEmitter<any>();
  @Output('bulkEdit') bulkEdit = new EventEmitter<BulkSelection>();
  @Output('exportVendors') exportVendors = new EventEmitter<BulkSelection>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  /** Single source of truth for select-all-matching lives in ta-table (checkboxes + banner stay in sync). */
  get selectAllMatching(): boolean {
    return !!this.taTableComponent?.selectAllMatching;
  }

  /** Selected vendor IDs from ta-table's checkedRows */
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
      this.exportVendors.emit({
        selectAll: true,
        filterQuery: this.taTableComponent?.getFilterQuery() || '',
        count: this.totalRecords
      });
    } else {
      this.exportVendors.emit({ ids: [...this.selectedIds], count: this.selectedIds.length });
    }
  }

  tableConfig: TaTableConfig = {
    // apiUrl: 'vendors/vendors/?summary=true&summary=true&page=1&limit=10&sort[0]=name,DESC',
    apiUrl: 'vendors/vendors/?summary=true',
    title: 'Vendors',
    showCheckbox:true,
    pkId: "vendor_id",
    rowEvents: {
      dblclick: this.dblClickNav.createHandler({ pkField: 'vendor_id', moduleName: 'Vendors', sectionName: 'Vendor', editEmitter: this.edit }),
    },
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    globalSearch: {
      keys: ['created_at','name','gst_no','email','phone','vendor_category_id','ledger_account','city_id']
    },
    export: {downloadName: 'VendorList'},
    // defaultSort: { key: 'created_at', value: 'descend' },
    defaultSort: { key: 'is_deleted', value: 'ascend' },
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
        fieldKey: 'city_id',
        name: 'City Name',
        sort: false,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.city?.city_name;
        },
      },
      {
        fieldKey: 'vendor_category_id',
        name: 'Vendor Category',
        sort: true,
        hidden: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.vendor_category?.name;
        },
      },
      {
        fieldKey: 'ledger_account',
        name: 'Ledger Account',
        sort: true,
        hidden: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.ledger_account?.name;
        },
      },
      {
        fieldKey: 'vendor_addresses',
        name: 'Billing Address',
        sort: true,
        hidden: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.vendor_addresses.custom_billing_address;
        },
      },
      {
        fieldKey: "vendor_id",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            confirm: true,
            confirmMsg: "Sure to delete?",
            apiUrl: 'vendors/vendors'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'vendors/vendors'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            tooltip: "Edit this record",
            callBackFn: (row, action) => {
              console.log(`vendor ID: ${row.vendor_id}`);
              this.edit.emit(row.vendor_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router, private dblClickNav: DoubleClickNavigationService) { }
}