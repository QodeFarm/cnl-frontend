import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-hrms',
  templateUrl: './hrms.component.html',
  styleUrls: ['./hrms.component.scss']
})

export class EmployeesComponent {
  showEmployeesList: boolean = false;
  showForm: boolean = false;
  EmployeeEditID: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.showEmployeesList = false;
    this.showForm = true;
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
        this.formConfig.model = res;
        //set labels for update
        this.formConfig.submit.label = 'Update';
        this.formConfig.pkId = 'employee_id';
        this.showForm = true;
      }
    })
    this.hide();
  };


  showEmployeesListFn() {
    this.showEmployeesList = true;
  };

  setFormConfig() {
    this.formConfig = {
      url: "hrms/employees/",
      // title: 'leads',
      formState: {
        viewMode: false,
      },
      exParams: [
        {
          key: 'department_id',
          type: 'script',
          value: 'data.department.department_id'
        },
        {
          key: 'designation_id',
          type: 'script',
          value: 'data.designation.designation_id'
        }
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => this.ngOnInit()
      },
      reset: {},
      model:{},
      fields: [
        {
          fieldGroupClassName: "ant-row custom-form-block",
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'email',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Email',
                placeholder: 'Enter Email',
                required: false,
              }
            },
            {
              key: 'phone',
              type: 'input',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Phone',
                placeholder: 'Enter with country code',
                required: false,
              }
            },
            {
              key: 'department',
              type: 'select',
              className: 'col-3 pb-3 ps-0',
              templateOptions: {
                label: 'Department',
                dataKey: 'department',
                dataLabel: "department_name",
                options: [],
                lazy: {
                  url: 'hrms/departments/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  field.formControl.valueChanges.subscribe((data: any) => {
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['department_id']) {
                      this.formConfig.model['department_id'] = data.department_id
                    } else {
                      console.error('Form config or lead_status data model is not defined.');
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
                    if (this.formConfig && this.formConfig.model && this.formConfig.model['designation_id']) {
                      this.formConfig.model['designation_id'] = data.designation_id
                    } else {
                      console.error('Form config or lead_status data model is not defined.');
                    }
                  });
                },
              }
            }
          ]
        }
      ]
    }
  }
}
