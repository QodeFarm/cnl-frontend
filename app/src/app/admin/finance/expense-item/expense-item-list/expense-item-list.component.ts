import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-expense-item-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './expense-item-list.component.html',
  styleUrls: ['./expense-item-list.component.scss']
})
export class ExpenseItemListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/expense_items/',
    showCheckbox:true,
    pkId: "expense_item_id",
    pageSize: 10,    "globalSearch": {
      keys: ['expense_date', 'category_id', 'amount', 'description', 'vendor_id', 'employee_id', 'bank_account_id', 'status']
    },
    export: {downloadName: 'ExpenseItemList'},
    defaultSort: { key: 'created_at', value: 'descend' }, 
    cols: [
      {
        fieldKey: 'expense_date',
        name: 'Date',
        sort: true
      },
      {
        fieldKey: 'category_id',
        name: 'Category',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.category?.category_name || '';
        },
      },
      {
        fieldKey: 'amount', 
        name: 'Amount',
        sort: true
      },
      {
        fieldKey: 'description',
        name: 'Description',
        sort: true
      },      {
        fieldKey: 'vendor_id',
        name: 'Vendor',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.vendor?.name || '';
        },
      },      {
        fieldKey: 'employee_id',
        name: 'Employee',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.employee ? `${row.employee.first_name} ${row.employee?.second_name || ''}` : '';
        },
      },      {
        fieldKey: 'bank_account_id',
        name: 'Bank Account',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.bank_account?.bank_name || '';
        },
      },
      {
        fieldKey: 'status', 
        name: 'Status',
        sort: true
      },
      {
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            apiUrl: 'finance/expense_items',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.expense_item_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}
