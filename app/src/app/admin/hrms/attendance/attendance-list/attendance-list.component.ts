import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';


@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'hrms/attendance/',
    showCheckbox:true,
    pkId: "attendance_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['attendance_date','employee_id','clock_in_time','clock_out_time','status_id','department_id','shift_id']
    },
    cols: [
      {
        fieldKey: 'attendance_date',
        name: 'Attendance Date',
        sort: true
      },
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
        fieldKey: 'clock_in_time',
        name: 'Clock In Time',
        sort: true
      },
      {
        fieldKey: 'clock_out_time',
        name: 'Clock Out Time',
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
            apiUrl: 'hrms/attendance',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.attendance_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}