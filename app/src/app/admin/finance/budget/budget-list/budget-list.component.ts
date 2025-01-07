import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/budgets/',
    showCheckbox:true,
    pkId: "budget_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['account_id','fiscal_year','allocated_amount','spent_amount']
    },
    cols: [
      {
        fieldKey: 'created_at',
        name: 'Created At',
        sort: true,
        displayType: 'datetime'
      },
      {
        fieldKey: 'account_id',
        name: 'Account',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.account.account_name}`;
        },
      },
      {
        fieldKey: 'fiscal_year',
        name: 'Fiscal Year',
        sort: true
      },
      {
        fieldKey: 'allocated_amount', 
        name: 'Allocated Amount',
        sort: true
      },
      {
        fieldKey: 'spent_amount', 
        name: 'Spent Amount',
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
            apiUrl: 'finance/budgets',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.budget_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}


