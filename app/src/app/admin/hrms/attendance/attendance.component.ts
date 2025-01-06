import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';


@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,AttendanceListComponent],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {
  showAttendanceList: boolean = false;
  showForm: boolean = false;
  AttendanceEditID: any; 
  @ViewChild(AttendanceListComponent) AttendanceListComponent!: AttendanceListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showAttendanceList = false;
    this.showForm = true;
    this.AttendanceEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editAttendance(event) {
    console.log('event', event);
    this.AttendanceEditID = event;
    this.http.get('hrms/attendance/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'attendance_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };

  showAttendanceListFn() {
    this.showAttendanceList = true;
    this.AttendanceListComponent?.refreshTable();
  };

  setFormConfig() {
    this.AttendanceEditID = null;
    this.formConfig = {
      url: "hrms/attendance/",
      // title: 'leads',
      formState: {
        viewMode: false,
      },
      showActionBtn : true,
      exParams: [
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'status_id',
          type: 'script',
          value: 'data.status.status_id'
        },
        {
          key: 'department_id',
          type: 'script',
          value: 'data.department.department_id'
        },
        {
          key: 'shift_id',
          type: 'script',
          value: 'data.shift.shift_id'
        }
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model:{},

      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          fieldGroup: [
            {
              key: 'employee',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
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
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'attendance_date',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Attendance Date',
                type: 'date',
                placeholder: 'Select Attendance Date and Time',
                required: true,
              }
            },
            {
              key: 'clock_in_time',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Clock In Time',
                type: 'datetime-local',  // Use datetime-local for both date and time input
                placeholder: 'Select Date and Time',
                required: false,
              }
            },
            {
              key: 'clock_out_time',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Clock Out Time',
                type: 'datetime-local',  // Use datetime-local for both date and time input
                placeholder: 'Select Date and Time',
                required: false,
              }
            },
            {
              key: 'status',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Status',
                dataKey: 'status_id',
                dataLabel: "status_name",
                options: [],
                lazy: {
                  url: 'masters/statuses/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'department',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Department',
                dataKey: 'department_id',
                dataLabel: "department_name",
                options: [],
                lazy: {
                  url: 'hrms/departments/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'shift',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Shift',
                dataKey: 'shift_id',
                dataLabel: "shift_name",
                options: [],
                lazy: {
                  url: 'hrms/shifts/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
          ]
        }
      ]
    }
  }
}

