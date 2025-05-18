import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-expense-category-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './expense-category-list.component.html',
})
export class ExpenseCategoryListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/expense_categories/',
    showCheckbox:true,
    pkId: "category_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['category_name','description','account_id','is_active', 'code']
    },
    export: {downloadName: 'ExpenseCategoryList'},
    defaultSort: { key: 'created_at', value: 'descend' }, 
    cols: [
      {
        fieldKey: 'category_name',
        name: 'Category Name',
        sort: true
      },
      {
        fieldKey: 'description',
        name: 'Description',
        sort: true
      },
      {
        fieldKey: 'account_id',
        name: 'Account',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.account?.account_name || '';
        },
      },
      {
        fieldKey: 'is_active', 
        name: 'Status',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return currentValue ? 'Active' : 'Inactive';
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
            apiUrl: 'finance/expense_categories',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.category_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}
