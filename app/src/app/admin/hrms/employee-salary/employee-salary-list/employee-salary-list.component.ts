import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-salary-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './employee-salary-list.component.html',
  styleUrls: ['./employee-salary-list.component.scss']
})
export class EmployeeSalaryListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/employee_salary/',
    showCheckbox:true,
    pkId: "salary_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['salary_amount','salary_currency','salary_start_date','salary_end_date','employee_id']
    },
    cols: [
      {
        fieldKey: 'salary_amount', 
        name: 'Salary Amount',
        sort: true
      }, 
      {
        fieldKey: 'salary_currency', 
        name: 'Salary Currency',
        sort: true
      }, 
      {
        fieldKey: 'salary_start_date',
        name: 'Salary Start Date',
        sort: true
      },
      {
        fieldKey: 'salary_end_date',
        name: 'Salary End Date',
        sort: true
      },
      {
        fieldKey: 'employee_id',
        name: 'Employee',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.employee.first_name}`;
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
            apiUrl: 'hrms/employee_salary',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.salary_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}


  
