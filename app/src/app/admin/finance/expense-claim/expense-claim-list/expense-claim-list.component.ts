import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-claim-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './expense-claim-list.component.html',
  styleUrls: ['./expense-claim-list.component.scss']
})
export class ExpenseClaimListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/expense_claims/',
    showCheckbox:true,
    pkId: "expense_claim_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['expense_claim_id']
    },
    cols: [
      {
        fieldKey: 'employee_id',
        name: 'Employee',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.employee.name}`;
        },
      },
      {
        fieldKey: 'claim_date',
        name: 'Claim Date',
        sort: true
      },
      {
        fieldKey: 'description', 
        name: 'Description',
        sort: false
      },
      {
        fieldKey: 'total_amount', 
        name: 'Total Amount',
        sort: false
      },
      {
        fieldKey: 'status', 
        name: 'Status',
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
            apiUrl: 'finance/expense_claims'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.expense_claim_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}


