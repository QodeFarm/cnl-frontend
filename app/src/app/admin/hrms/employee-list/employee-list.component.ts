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
    apiUrl: 'hrms/employee/',
    // title: 'Edit Sales Order List',
    showCheckbox:true,
    pkId: "employee_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['first_name','last_name','email','phone','address','hire_date','job_type_id','designation_id','job_code_id','department_id','shift_id']
    },
    cols: [
      {
        fieldKey: 'first_name',
        name: 'Name',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          // Safely access and concatenate first_name and last_name
          const firstName = row?.first_name || '';
          const lastName = row?.last_name || '';
          return `${firstName} ${lastName}`.trim();
        },
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
        fieldKey: 'address',
        name: 'Address',
        sort: true
      },
      {
        fieldKey: 'hire_date',
        name: 'Hire Date',
        sort: true
      },
      {
        fieldKey: 'job_type_id',
        name: 'Job Type',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.job_type.job_type_name}`;
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
        fieldKey: 'department_id',
        name: 'Department',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.department.department_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'shift_id',
        name: 'Shift',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.shift.shift_name}`;
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
            apiUrl: 'hrms/employee'
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
