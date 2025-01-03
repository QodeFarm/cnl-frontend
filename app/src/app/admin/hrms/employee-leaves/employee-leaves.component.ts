import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
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

export class EmployeeLeavesComponent implements OnInit {
  showEmployeeLeavesList: boolean = false;
  showForm: boolean = false;
  EmployeeLeavesEditID: any; 

  constructor(private http: HttpClient) {};

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
  }

  editEmployeeLeaves(event) {
    console.log('event', event);
    this.EmployeeLeavesEditID = event;
    this.http.get('hrms/employee_leaves/' + event).subscribe((res: any) => {
      if (res) {
        // this.formConfig.model = res;
        this.formConfig.model = {
          employee_leaves: res.data.employee_leaves,
          leave_approvals: res.data.leave_approvals || {}
        };
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'leave_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['leave_id'] = this.EmployeeLeavesEditID;
        this.showForm = true;
      }
    })
    this.hide();
  };

  showEmployeeLeavesListFn() {
    this.showEmployeeLeavesList = true;
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
      exParams: [],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {
        resetFn: () => {
          this.ngOnInit();
        }
      },
      model:{
        employee_leaves: {},
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'employee_leaves',
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
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee_leaves']) {
                      this.formConfig.model['employee_leaves']['employee_id'] = data.employee_id;
                    } else {
                      console.error('Form config or employee data model is not defined.');
                    }
                  });
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
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee_leaves']) {
                      this.formConfig.model['employee_leaves']['leave_type_id'] = data.leave_type_id;
                    } else {
                      console.error('Form config or leave_type data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'start_date',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Start Date',
                type: 'date',
                placeholder: 'Select Start Date',
                required: true,
              },
            },
            {
              key: 'end_date',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'End Date',
                type: 'date',
                placeholder: 'Select End Date',
                required: true,
              },
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
          ]
        },
      ]
    }
  }
}