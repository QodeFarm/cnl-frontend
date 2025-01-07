import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-chart-of-accounts-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './chart-of-accounts-list.component.html',
  styleUrls: ['./chart-of-accounts-list.component.scss']
})
export class ChartOfAccountsListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
 };

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/chart_of_accounts/',
    showCheckbox:true,
    pkId: "account_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['account_code','account_name','account_type','parent_account_id','bank_account_id']
    },
    cols: [
      {
        fieldKey: 'created_at',
        name: 'Created At',
        sort: true,
        displayType: 'datetime'
      },
      {
        fieldKey: 'account_code',
        name: 'Account Code',
        sort: true
      },
      {
        fieldKey: 'account_name',
        name: 'Account Name',
        sort: true
      },
      {
        fieldKey: 'account_type', 
        name: 'Account Type',
        sort: true
      },
      {
        fieldKey: 'parent_account_id',
        name: 'Parent Account',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.parent_account.account_name}`;
        },
      },
      {
        fieldKey: 'bank_account_id',
        name: 'Bank Account',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.bank_account.bank_name}`;
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
            apiUrl: 'finance/chart_of_accounts',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.account_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}