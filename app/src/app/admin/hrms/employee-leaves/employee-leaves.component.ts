import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { EmployeeLeavesListComponent } from './employee-leaves-list/employee-leaves-list.component';

@Component({
  selector: 'app-employee-leaves',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,EmployeeLeavesListComponent],
  templateUrl: './employee-leaves.component.html',
  styleUrls: ['./employee-leaves.component.scss']
})
export class EmployeeLeavesComponent {
  showEmployeeLeavesList: boolean = false;
  showForm: boolean = false;
  EmployeeLeavesEditID: any; 
  @ViewChild(EmployeeLeavesListComponent) EmployeeLeavesListComponent!: EmployeeLeavesListComponent;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showEmployeeLeavesList = false;
    this.showForm = true;
    this.EmployeeLeavesEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editEmployeeLeaves(event) {
    console.log('event', event);
    this.EmployeeLeavesEditID = event;
    this.http.get('hrms/employee_leaves/' + event).subscribe((res: any) => {
      if (res) {
        this.formConfig.model = res;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'leave_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.showForm = true;
      }
    })
    this.hide();
  };

  showEmployeeLeavesListFn() {
    this.showEmployeeLeavesList = true;
    this.EmployeeLeavesListComponent?.refreshTable();
  };

  setFormConfig() {
    this.EmployeeLeavesEditID = null;
    this.formConfig = {
      url: "hrms/employee_leaves/",
      // title: 'leads',
      formState: {
        viewMode: false,
      },
      showActionBtn : true,
      exParams: [
        {
          key: 'status_id',
          type: 'script',
          value: 'data.status.status_id'
        },
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'leave_type_id',
          type: 'script',
          value: 'data.leave_type.leave_type_id'
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
              key: 'start_date',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Start Date',
                type: 'date',  // Use date for date-only input
                placeholder: 'Select Start Date and Time',
                required: true,
              }
            },
            {
              key: 'end_date',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'End Date',
                type: 'date',  // Use date for date-only input
                placeholder: 'Select End Date and Time',
                required: true,
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
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'comments',
              type: 'textarea',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Comments',
                placeholder: 'Enter Comments',
                required: false,
              }
            },
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
              key: 'leave_type',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Leave Type',
                dataKey: 'leave_type_id',
                dataLabel: "leave_type_name",
                options: [],
                lazy: {
                  url: 'hrms/leave_types/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            }
          ]
        }
      ]
    }
  }
}

