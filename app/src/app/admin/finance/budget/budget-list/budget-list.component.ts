import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/budgets/',
    // title: 'Edit Tasks List',
    showCheckbox:true,
    pkId: "budget_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['budget_id']
    },
    cols: [
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
        sort: false
      },
      {
        fieldKey: 'spent_amount', 
        name: 'Spent Amount',
        sort: false
      },
      {
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            // confirm: true,
            // confirmMsg: "Sure to delete?",
            apiUrl: 'finance/budgets'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.budget_id);
              // this.router.navigateByUrl('inventory/warehouses/' + row.warehouse_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}


