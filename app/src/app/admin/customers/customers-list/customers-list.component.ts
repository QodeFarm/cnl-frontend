import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @Output('bulkEdit') bulkEdit = new EventEmitter<string[]>();
  @Output('exportCustomers') exportCustomers = new EventEmitter<string[]>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;
  constructor(private http: HttpClient, private router: Router, private message: NzMessageService) { }

  /** Selected customer IDs — read directly from ta-table's checkedRows */
  get selectedIds(): string[] {
    return (this.tableConfig.checkedRows as string[]) || [];
  }

  get isOverLimit(): boolean {
    return this.selectedIds.length > 100;
  }

  refreshTable() {
    this.taTableComponent?.refresh();
  }

  /** Clear all checkbox selections */
  clearSelections() {
    this.taTableComponent?.setOfCheckedId?.clear();
    this.tableConfig.checkedRows = [];
    this.taTableComponent?.refreshCheckedStatus();
  }

  /** Emit selected IDs to parent for bulk edit */
  onBulkEditClick() {
    this.bulkEdit.emit([...this.selectedIds]);
  }

  /** Emit selected IDs (empty array if none selected) to parent for export */
  onExportClick() {
    this.exportCustomers.emit([...this.selectedIds]);
  }

  tableConfig: TaTableConfig = {
    apiUrl: 'customers/customers/?summary=true',
    showCheckbox: true,
    pkId: "customer_id",
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
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true,
        isEdit: true,
        isEditSumbmit: (row, value, col) => {
          console.log("isEditSumbmit", row, value, col );
          // Implement your logic here
          // For example, you can make an API call to save the edited value
          // this.http.put(`api/sales/${row.sale_order_id}`, { total_amount: value }).subscribe(...);
          

        },
        autoSave: {
        apiUrl: row => `customers/customers/${row.customer_id}`,
        method: 'patch',
        body: (row: any, value: any, col: any) => {
          return {
            customer_id: row.customer_id,
            name: value,
            customer_addresses: row.customer_addresses // <-- add this line
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
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.city.city_name;
        },
      },
      {
        fieldKey: 'ledger_account_id',
        name: 'Ledger Account',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.ledger_account.name;
        },
      },
      {
        fieldKey: 'pin_code',
        name: 'Pin Code',
        sort: true,
      },
      {
        fieldKey: 'customer_addresses',
        name: 'Shipping Address',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.customer_addresses.custom_shipping_address;
        },
      },

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
              console.log(row);
              this.edit.emit(row.customer_id);
            }
          }
        ]
      },
    ]
  };

}





