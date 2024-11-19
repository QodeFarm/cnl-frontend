import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-leave-balance-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './employee-leave-balance-list.component.html',
  styleUrls: ['./employee-leave-balance-list.component.scss']
})
export class EmployeeLeaveBalanceListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/employee_leave_balance/',
    showCheckbox:true,
    pkId: "balance_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['employee_id','leave_type_id','leave_balance','year']
    },
    cols: [
      {
        fieldKey: 'employee_id',
        name: 'Employee',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          // Concatenate first_name and last_name correctly
          const firstName = row.employee?.first_name || '';
          const lastName = row.employee?.last_name || '';
          return `${firstName} ${lastName}`.trim();
        },
      }, 
      {
        fieldKey: 'leave_type_id',
        name: 'Leave Type',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.leave_type.leave_type_name}`;
        },
      },
      {
        fieldKey: 'leave_balance',
        name: 'Leave Balance',
        sort: true
      },
      {
        fieldKey: 'year',
        name: 'Year',
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
            apiUrl: 'hrms/employee_leave_balance',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.balance_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}