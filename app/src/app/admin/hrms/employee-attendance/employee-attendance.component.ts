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
    // drawerPlacement: 'right',
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
  // // Modal logic
  // showDuplicateDialog = false;
  // duplicateMessage = '';

  // constructor(private http: HttpClient) {}

  // // Open modal dialog
  // openDuplicateDialog(message: string) {
  //   this.duplicateMessage = message;
  //   this.showDuplicateDialog = true;
  // }

  // // Close modal dialog
  // closeDuplicateDialog() {
  //   this.showDuplicateDialog = false;
  // }

  // handleFormSubmission() {
  //   const { employee, attendance_date } = this.curdConfig.formConfig.model;

  //   // Validate employee and attendance_date
  //   if (!employee?.employee_id || !attendance_date) {
  //     alert('Employee and Attendance Date are required!');
  //     return;
  //   }

  //   const apiUrl = `${this.curdConfig.tableConfig.apiUrl}?employee_id=${employee.employee_id}&attendance_date=${attendance_date}`;
  //   this.http.get(apiUrl).subscribe({
  //     next: (response: any) => {
  //       if (response.length > 0) {
  //         this.openDuplicateDialog(`Attendance already exists for Employee ID ${employee.employee_id} on ${attendance_date}.`);
  //       } else {
  //         this.submitForm();
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error checking duplicates:', error);
  //       alert('An error occurred while checking attendance.');
  //     }
  //   });
  // }

  // submitForm() {
  //   const payload = {
  //     employee_id: this.curdConfig.formConfig.model.employee.employee_id,
  //     leave_duration: this.curdConfig.formConfig.model.leave_duration,
  //     attendance_date: this.curdConfig.formConfig.model.attendance_date,
  //   };

  //   // Debugging log to verify the payload
  //   console.log('Submitting payload:', payload);

  //   // Check if required fields are present
  //   if (!payload.employee_id || !payload.attendance_date) {
  //     alert('Employee and Attendance Date are required!');
  //     return;
  //   }

  //   this.http.post('hrms/employee_attendance/', payload).subscribe({
  //     next: (response) => {
  //       alert('Record submitted successfully!');
  //       this.resetForm();
  //     },
  //     error: (error) => {
  //       console.error('Error submitting form:', error);
  //       alert('An error occurred while submitting the form.');
  //     }
  //   });
  // }  

  // // Form submit handler
  // onSubmit() {
  //   this.handleFormSubmission();
  // }

  // // Reset form
  // resetForm() {
  //   this.curdConfig.formConfig.model = {}; // Reset the form model after submission
  // }
// }
