import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {
  isEmployeePortal: boolean = false;
  employeeId: string | null = null;

  constructor(private route: ActivatedRoute) {}

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
      export: {downloadName: 'EmployeeAttendance'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'employee',
          name: 'Employee',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
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
          mapFn: () => 'Yes'
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
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
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
          value: true
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

  ngOnInit() {
    // Check if this is employee portal
    this.route.data.subscribe(data => {
      this.isEmployeePortal = data['employeeView'] || false;
      
      if (this.isEmployeePortal) {
        // Get employee ID from localStorage
        const user = JSON.parse(localStorage.getItem('employee_user') || '{}');
        this.employeeId = user.id || null;
        
        console.log('Employee Portal Mode - Employee ID:', this.employeeId);
        
        // Update the config for employee view
        this.updateConfigForEmployee();
      }
    });
  }

  updateConfigForEmployee() {
    // Set API URL with employee filter
    this.curdConfig.tableConfig.apiUrl = `hrms/employee_attendance/?employee_id=${this.employeeId}`;
    
    // Add fixed filters
    this.curdConfig.tableConfig.fixedFilters = [
      { key: 'employee_id', value: this.employeeId }
    ];

    // Remove admin-only actions (keep only edit for employees)
    this.curdConfig.tableConfig.cols = this.curdConfig.tableConfig.cols.map(col => {
      if (col.fieldKey === 'code') {
        // For employee portal, only keep edit action
        col.actions = [
          {
            type: 'edit',
            label: 'Edit'
          }
        ];
      }
      return col;
    });

    // Remove export option for employees
    this.curdConfig.tableConfig.export = undefined;
    
    // Remove checkboxes for employees
    this.curdConfig.tableConfig.showCheckbox = false;
    
    // Update title for employee view
    this.curdConfig.tableConfig.title = 'My Attendance';
    
    // Remove the Employee column since it will only show current employee
    this.curdConfig.tableConfig.cols = this.curdConfig.tableConfig.cols.filter(
      (col: any) => col.fieldKey !== 'employee'
    );

    // For form config - disable employee selection and pre-fill with logged employee
    if (this.isEmployeePortal) {
      // Find and modify the employee field in form
      const employeeField = this.curdConfig.formConfig.fields[0].fieldGroup.find(
        (field: any) => field.key === 'employee'
      );
      if (employeeField) {
        employeeField.templateOptions.disabled = true;
        employeeField.templateOptions.required = false;
      }
    }

    console.log('Updated attendance config for employee:', this.curdConfig);
  }
}