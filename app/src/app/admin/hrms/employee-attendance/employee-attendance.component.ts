import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  standalone: true,
  imports: [CommonModule,AdminCommmonModule],
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'hrms/employee_attendance/',
      title: 'Employee Attendance',
      pkId: "employee_attendance_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['employee','attendance_date','absent','leave_duration']
      },
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
          fieldKey: 'attendance_date',
          name: 'Attendance Date',
          sort: true
        },
        {
          fieldKey: 'absent',
          name: 'Absent',
          sort: false,
          displayType: 'map',
          mapFn: () => 'Yes' // Always display 'Yes'
        },       
        {
          fieldKey: 'leave_duration',
          name: 'Leave Duration',
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
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'hrms/employee_attendance'
            },
            {
              type: 'edit',
              label: 'Edit'
            }
          ]
        }
      ]
    },
    formConfig: {
      url: 'hrms/employee_attendance/',
      title: 'Employee Attendance',
      pkId: "employee_attendance_id",
      exParams: [
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'absent',
          value: true // Always set absent to true
        }
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'employee',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Employee',
                dataKey: 'employee_id',
                dataLabel: "first_name",
                options: [],
                lazy: {
                  url: 'hrms/employees/',
                  lazyOneTime: true
                },
                required: true
              }
            },
            {
              key: 'attendance_date',
              type: 'date',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Attendance Date',
                placeholder: 'Select date',
                required: true
              }
            },
            {
              key: 'leave_duration',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Leave Duration',
                required: false,
                options: [
                  { value: 'First Half', label: 'First Half' },
                  { value: 'Full Day', label: 'Full Day' },
                  { value: 'Second Half', label: 'Second Half' }
                ]
              }
            }
          ]
        }
      ],
    }
  };
};
