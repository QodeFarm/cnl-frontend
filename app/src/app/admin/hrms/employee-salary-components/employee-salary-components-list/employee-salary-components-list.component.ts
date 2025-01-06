import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-employee-salary-components-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './employee-salary-components-list.component.html',
  styleUrls: ['./employee-salary-components-list.component.scss']
})
export class EmployeeSalaryComponentsListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/employee_salary_components/',
    showCheckbox:true,
    pkId: "employee_component_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['component_id','component_amount','salary_id']
    },
    cols: [
      {
        fieldKey: 'component_id',
        name: 'salary Component',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.component.component_name}`;
        },
      },
      {
        fieldKey: 'component_amount', 
        name: 'Component Amount',
        sort: true
      }, 
      {
        fieldKey: 'salary_id',
        name: 'Salary',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.salary.salary_amount}`;
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
            apiUrl: 'hrms/employee_salary_components',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.employee_component_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}


  
