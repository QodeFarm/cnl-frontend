import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-expense-claim-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './expense-claim-list.component.html',
  styleUrls: ['./expense-claim-list.component.scss']
})
export class ExpenseClaimListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/expense_claims/',
    showCheckbox:true,
    pkId: "expense_claim_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['employee_id','claim_date','description','total_amount','status']
    },
    defaultSort: { key: 'created_at', value: 'descend' }, 
    cols: [
      {
        fieldKey: 'employee_id',
        name: 'Employee',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.employee.first_name} ${row.employee?.second_name || ''}`;
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
        sort: true
      },
      {
        fieldKey: 'total_amount', 
        name: 'Total Amount',
        sort: true
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
            apiUrl: 'finance/expense_claims',
            confirm: true,
            confirmMsg: "Sure to delete?",
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


