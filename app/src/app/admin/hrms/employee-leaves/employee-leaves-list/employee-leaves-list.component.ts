import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-leaves-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './employee-leaves-list.component.html',
  styleUrls: ['./employee-leaves-list.component.scss']
})
export class EmployeeLeavesListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/employee_leaves/',
    showCheckbox:true,
    pkId: "leave_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['start_date','end_date','status_id','comments','employee_id','leave_type_id']
    },
    cols: [
      {
        fieldKey: 'start_date',
        name: 'Start Date',
        sort: true
      },
      {
        fieldKey: 'end_date',
        name: 'End Date',
        sort: true
      },
      {
        fieldKey: 'status_id',
        name: 'Status',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.status.status_name}`;
        },
      },
      {
        fieldKey: 'comments', 
        name: 'Comments',
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
        fieldKey: 'leave_type_id',
        name: 'Leave Type',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.leave_type.leave_type_name}`;
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
            apiUrl: 'hrms/employee_leaves',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.leave_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}


  
