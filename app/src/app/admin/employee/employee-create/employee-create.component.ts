import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaFormConfig } from '@ta/ta-form';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent implements OnInit {
  title = "Create Employee";
  showForm = false;
  formConfig: TaFormConfig = {

    url: 'employees/employees/',
    title: 'User',
    pkId: "employee_id",
    exParams: [
      {
        key: 'job_type',
        type: 'script',
        value: 'data.job_type_id.job_type_id'
      },
      {
        key: 'department',
        type: 'script',
        value: 'data.department_id.department_id'
      },
      {
        key: 'designation',
        type: 'script',
        value: 'data.designation_id.designation_id'
      },
      {
        key: 'job_code',
        type: 'script',
        value: 'data.job_code_id.job_code_id'
      },
      {
        key: 'shift',
        type: 'script',
        value: 'data.shift_id.shift_id'
      }
    ],
    fields: [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'first_name',
            type: 'input',
            className: 'ta-cell pr-md col-6',
            templateOptions: {
              label: 'First Name',
              placeholder: 'Enter First name',
              required: true,
            }
          },
          {
            key: 'last_name',
            type: 'input',
            className: 'ta-cell pr-md col-6',
            templateOptions: {
              label: 'Last Name',
              placeholder: 'Enter Last name',
              required: true,
            }
          },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'email',
            type: 'input',
            className: 'ta-cell pr-md col-6',
            templateOptions: {
              label: 'Email',
              placeholder: 'Enter email',
              required: true,
            }
          },
          {
            key: 'phone',
            type: 'input',
            className: 'ta-cell pr-md col-6',
            templateOptions: {
              label: 'Phone',
              placeholder: 'Enter Phone',
              required: true,
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'address',
            type: 'textarea',
            className: 'ta-cell pr-md',
            templateOptions: {
              label: 'Address',
              placeholder: 'Enter Address',
              required: true,
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'hire_date',
            type: 'date',
            className: 'ta-cell pr-md col-4',
            templateOptions: {
              label: 'Hire Date',
              placeholder: 'Enter Hire Date',
              required: true,
            }
          },
          {
            key: 'job_type_id',
            type: 'JobTypes-dropdown',
            className: 'ta-cell pr-md col-4',
            templateOptions: {
              label: 'Job Type',
              dataKey: 'job_type_id',
              dataLabel: "job_type_name",
              options: [],
              lazy: {
                url: 'employees/job_types/',
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
            key: 'designation_id',
            type: 'designations-dropdown',
            className: 'ta-cell pr-md col-4',
            templateOptions: {
              label: 'Designation',
              dataKey: 'designation_id',
              dataLabel: "designation_name",
              options: [],
              lazy: {
                url: 'employees/designations/',
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
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'job_code_id',
            type: 'jobCode-dropdown',
            className: 'ta-cell pr-md col-4',
            templateOptions: {
              label: 'Job Code',
              dataKey: 'job_code_id',
              dataLabel: "job_code",
              options: [],
              lazy: {
                url: 'employees/job_codes/',
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
            key: 'department_id',
            type: 'departments-dropdown',
            className: 'ta-cell pr-md col-4',
            templateOptions: {
              label: 'Department',
              dataKey: 'department_id',
              dataLabel: "department_name",
              options: [],
              lazy: {
                url: 'employees/departments/',
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
            key: 'shift_id',
            type: 'shifts-dropdown',
            className: 'ta-cell pr-md col-4',
            templateOptions: {
              label: 'Shift',
              dataKey: 'shift_id',
              dataLabel: "shift_name",
              options: [],
              lazy: {
                url: 'employees/shifts/',
                lazyOneTime: true
              },
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          }]
      }
    ],
    submit: {
      submittedFn: (res) => {
        this.router.navigateByUrl('/admin/employee')
      }
    }
  }
  constructor(private router: Router, private activeRouter: ActivatedRoute, private http: HttpClient) {

  }
  ngOnInit(): void {

    if (this.activeRouter.snapshot.params.id) {
      this.title = "Update Employee";
      this.http.get(this.formConfig.url + this.activeRouter.snapshot.params.id).subscribe(res => {
        this.formConfig.model = res;
        this.showForm = true;
      })
    } else {
      this.showForm = true;
    }
  }

}
