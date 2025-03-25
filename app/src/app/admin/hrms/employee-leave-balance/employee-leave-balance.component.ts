import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-leave-balance',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule],
  templateUrl: './employee-leave-balance.component.html',
  styleUrls: ['./employee-leave-balance.component.scss']
})

export class EmployeeLeaveBalanceComponent {

  constructor(private http: HttpClient) {};

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    // drawerPlacement: 'top',
    drawerPlacement: 'right',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: 'hrms/employee_leave_balance/',
      title: 'Employee Leave Balance',
      pkId: "balance_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['employee','leave_type','leave_balance','year']
      },
      export: {downloadName: 'EmployeeLeaveBalance'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'employee',
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
          fieldKey: 'leave_type',
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
      ]
    },
    formConfig: {
      url: 'hrms/employee_leave_balance/',
      title: 'Employee Leave Balance',
      pkId: "balance_id",
      exParams: [
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'leave_type_id',
          type: 'script',
          value: 'data.leave_type.leave_type_id'
        }
      ],
      fields: [],
    }
  };
};