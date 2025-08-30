import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild(EmployeeListComponent) EmployeeListComponent!: EmployeeListComponent;

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
    this.http.get('hrms/employees/' + event).subscribe((res: any) => {
      if (res) {
        // this.formConfig.model = res;
        this.formConfig.model = {
          employee: res.data.employee
        };
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
    this.EmployeeListComponent?.refreshTable();
  };

  setFormConfig() {
    this.EmployeeEditID = null;
    this.formConfig = {
      url: "hrms/employees/",
      // title: 'leads',
      formState: {
        viewMode: false,
      },
      showActionBtn : true,
      exParams: [
        {
          key: 'job_type_id',
          type: 'script',
          value: 'data.job_type.job_type_id'
        },
        {
          key: 'designation_id',
          type: 'script',
          value: 'data.designation.designation_id'
        },
        {
          key: 'job_code_id',
          type: 'script',
          value: 'data.job_code.job_code_id'
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
        },
        {
          key: 'manager_id',
          type: 'script',
          value: 'data.manager.employee_id'
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
      model:{
        employee:{},
      },
      fields: [
        {
          key:"employee",
          fieldGroupClassName: "ant-row custom-form-block px-0 mx-0",
          fieldGroup: [
            {
              key: 'first_name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'First Name',
                placeholder: 'Enter First Name',
                required: true,
              },
            },
            {
              key: 'last_name',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Last Name',
                placeholder: 'Enter Last Name',
                required: true,
              },
            },
            {
              key: 'phone',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter with country code',
                required: true,
              },
            },
            {
              key: 'gender',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Gender',
                required: true,
                options: [
                  { value: 'Female', label: 'Female' },
                  { value: 'Male', label: 'Male' }
                ]
              }
            },
            {
              key: 'job_type',
              type: 'JobTypes-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Job Type',
                dataKey: 'job_type_id',
                dataLabel: "job_type_name",
                options: [],
                lazy: {
                  url: 'hrms/job_types/',
                  lazyOneTime: true
                },
                required: false
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
              type: 'designations-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Designation',
                dataKey: 'designation_id',
                dataLabel: "designation_name",
                options: [],
                lazy: {
                  url: 'hrms/designations/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['designation_id'] = data.designation_id;
                    } else {
                      console.error('Form config or designation data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'job_code',
              type: 'jobCode-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Job Code',
                dataKey: 'job_code_id',
                dataLabel: "job_code",
                options: [],
                lazy: {
                  url: 'hrms/job_codes/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['job_code_id'] = data.job_code_id;
                    } else {
                      console.error('Form config or job_code data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'department',
              type: 'departments-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
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
              type: 'shifts-dropdown',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Shift',
                dataKey: 'shift_id',
                dataLabel: "shift_name",
                options: [],
                lazy: {
                  url: 'hrms/shifts/',
                  lazyOneTime: true
                },
                required: false
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
            {
              key: 'manager',
              type: 'select',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Manager',
                dataKey: 'employee_id',
                dataLabel: "first_name",
                options: [],
                lazy: {
                  url: 'hrms/employees/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onChanges: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['employee']) {
                      this.formConfig.model['employee']['manager_id'] = data.employee_id;
                    } else {
                      console.error('Form config or employee data model is not defined.');
                    }
                  });
                }
              }
            },
            {
              key: 'hire_date',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Hire Date',
                type: 'date',  
                placeholder: 'Select Hire Date and Time',
                required: false,
              },
            },
            {
              key: 'email',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Email',
                placeholder: 'Enter Email',
                required: false,
              },
            },
            {
              key: 'address',
              type: 'textarea',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Address',
                placeholder: 'Enter Address',
                required: false,
              },
            },
            {
              key: 'date_of_birth',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Date Of Birth',
                type: 'date',
                placeholder: 'Select Date',
                required: false,
              }
            },
            {
              key: 'nationality',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Nationality',
                placeholder: 'Enter Nationality',
                required: false,
              }
            },
            {
              key: 'emergency_contact',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Emergency Contact',
                placeholder: 'Enter Emergency Contact',
                required: false,
              }
            },
            {
              key: 'emergency_contact_relationship',
              type: 'input',
              className: 'col-md-4 col-sm-6 col-12',
              templateOptions: {
                label: 'Emergency Contact Relationship',
                placeholder: 'Enter Name',
                required: false,
              }
            },
          ]
        },
      ]
    }
  }
}