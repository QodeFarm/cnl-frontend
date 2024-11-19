import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-hrms',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule,EmployeeListComponent],
  templateUrl: './hrms.component.html',
  styleUrls: ['./hrms.component.scss']
})

export class EmployeesComponent  implements OnInit {
  showEmployeesList: boolean = false;
  showForm: boolean = false;
  EmployeeEditID: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showEmployeesList = false;
    this.showForm = true;
    this.EmployeeEditID = null;
    // set form config
    this.setFormConfig();
    console.log('this.formConfig', this.formConfig);

  };

  formConfig: TaFormConfig = {};

  hide() {
    document.getElementById('modalClose').click();
  };

  editEmployee(event) {
    console.log('event', event);
    this.EmployeeEditID = event;
    this.http.get('hrms/employee/' + event).subscribe((res: any) => {
      console.log('data in res',res)
      if (res && res.data) {
        this.formConfig.model = {
          employee: res.data.employee,
          employee_details: res.data.employee_details || {}
        };
        this.formConfig.model = res.data;
        this.formConfig.showActionBtn = true;
        this.formConfig.pkId = 'employee_id';
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.model['employee_id'] = this.EmployeeEditID;
        this.showForm = true;
      }
    })
    this.hide();
  };


  showEmployeesListFn() {
    this.showEmployeesList = true;
  };

  setFormConfig() {
    this.EmployeeEditID = null;
    this.formConfig = {
      url: "hrms/employee/",
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
        employee: {},
        employee_details: {},
      },
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          key: 'employee',
          fieldGroup: [
            {
              key: 'first_name',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'First Name',
                placeholder: 'Enter First Name',
                required: true,
              },
            },
            {
              key: 'last_name',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Last Name',
                placeholder: 'Enter Last Name',
                required: true,
              },
            },
            {
              key: 'email',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Email',
                placeholder: 'Enter Email',
                required: true,
              },
            },
            {
              key: 'phone',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter with country code',
                required: false,
              },
            },
            {
              key: 'address',
              type: 'textarea',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Address',
                placeholder: 'Enter Address',
                required: false,
              },
            },
            {
              key: 'hire_date',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Hire Date',
                type: 'date',  
                placeholder: 'Select Hire Date and Time',
                required: false,
              },
            },
            {
              key: 'job_type',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Job Type',
                dataKey: 'job_type_id',
                dataLabel: "job_type_name",
                options: [],
                lazy: {
                  url: 'hrms/job_types/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['job_type_id'] = data.job_type_id;
                    } else {
                      console.error('Form config or job_type data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'designation',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Designation',
                dataKey: 'designation_id',
                dataLabel: "designation_name",
                options: [],
                lazy: {
                  url: 'hrms/designations/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['designation_id'] = data.designation_id;
                    } else {
                      console.error('Form config or designation data model is not defined.');
                    }
                  });
                },
              }
            },
            {
              key: 'job_code',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Job Code',
                dataKey: 'job_code_id',
                dataLabel: "job_code",
                options: [],
                lazy: {
                  url: 'hrms/job_codes/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['job_code_id'] = data.job_code_id;
                    } else {
                      console.error('Form config or job_code data model is not defined.');
                    }
                  });
                },
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
                required: true
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['department_id'] = data.department_id;
                    } else {
                      console.error('Form config or department data model is not defined.');
                    }
                  });
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
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['shift_id'] = data.shift_id;
                    } else {
                      console.error('Form config or shift data model is not defined.');
                    }
                  });
                }
              }
            },
          ]
        },

        // end employees

        // start of employee_details keys

        {
          fieldGroupClassName: "row col-12 m-0 custom-form-card",
          fieldGroup: [
            {
              template: '<div class="custom-form-card-title">Employee Details</div>',
              className: 'col-12',
            },
            {
              fieldGroupClassName: "ant-row custom-form-block",
              key: 'employee_details',
              fieldGroup: [
                {
                  key: 'date_of_birth',
                  type: 'input',
                  className: 'col-3 pb-3 ps-0',
                  templateOptions: {
                    label: 'Date Of Birth',
                    type: 'date',
                    placeholder: 'Select Date',
                    required: true,
                  }
                },
                {
                  key: 'gender',
                  type: 'input',
                  className: 'col-3 pb-3 ps-0',
                  templateOptions: {
                    label: 'Gender',
                    placeholder: 'Enter Gender',
                    required: false,
                  }
                },
                {
                  key: 'nationality',
                  type: 'input',
                  className: 'col-3 pb-3 ps-0',
                  templateOptions: {
                    label: 'Nationality',
                    placeholder: 'Enter Nationality',
                    required: false,
                  }
                },
                {
                  key: 'emergency_contact',
                  type: 'input',
                  className: 'col-3 pb-3 ps-0',
                  templateOptions: {
                    label: 'Emergency Contact',
                    placeholder: 'Enter Emergency Contact',
                    required: false,
                  }
                },
                {
                  key: 'emergency_contact_relationship',
                  type: 'input',
                  className: 'col-3 pb-3 ps-0',
                  templateOptions: {
                    label: 'Emergency Contact Relationship',
                    placeholder: 'Enter Name',
                    required: false,
                  }
                },
              ]
            }
          ]
        }
      ]
    }
  }
}
