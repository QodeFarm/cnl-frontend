import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})

export class EmployeeListComponent {


  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/employees/',
    // title: 'Edit Sales Order List',
    showCheckbox:true,
    pkId: "employee_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['employee_id']
    },
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true
      },
      {
        fieldKey: 'email',
        name: 'Email',
        sort: true
      },
      {
        fieldKey: 'phone',
        name: 'Phone',
        sort: true
      },
      {
        fieldKey: 'department_id',
        name: 'Department',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.department.department_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'designation_id',
        name: 'Designation',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.designation.designation_name}`;
        },
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
            // confirm: true,
            // confirmMsg: "Sure to delete?",
            apiUrl: 'hrms/employees'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              this.edit.emit(row.employee_id);
              // this.router.navigateByUrl('hrms/employees' + row.employee_id);
            }
          }
        ]
      }
    ]
  };
}
