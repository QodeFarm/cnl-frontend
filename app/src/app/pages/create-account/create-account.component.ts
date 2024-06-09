import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaFormConfig } from '@ta/ta-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {

  options: TaFormConfig = {
    url: 'users/create_user/',
    title: 'User',
    pkId: "user_id",
    exParams: [
      {
        key: 'company_id',
        type: 'script',
        value: 'data.company.company_id'
      },
      {
        key: 'role_id',
        type: 'script',
        value: 'data.role.role_id'
      },
      {
        key: 'status_id',
        type: 'script',
        value: '"f8edc445-7017-4ae1-819e-280c8c061484"'
      }
    ],
    submit: {
      label: "Create Account",
      icon: 'user',
      successMsg: "Create Account Successfully",
      submittedFn: (res: any) => {
        this.router.navigateByUrl('/');
      },
    },
    fields: [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'username',
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'User Name',
              dataKey: 'user',
              dataLabel: "user",
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'first_name',
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'First Name',
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'last_name',
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Last Name',
              required: true
            }
          },
          {
            key: 'email',
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'User Email',
              dataKey: 'user',
              dataLabel: "user",
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'mobile',
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Mobile',
              required: true
            }
          },
          {
            key: 'role',
            type: 'select',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'User Role',
              dataKey: 'role_name',
              dataLabel: "role_name",
              options: [],
              lazy: {
                url: 'users/role/',
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
            key: 'company',
            type: 'select',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Company',
              dataKey: 'company_id',
              dataLabel: "name",
              options: [],
              lazy: {
                url: 'company/companies/',
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
            key: 'gender',
            type: 'select',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Gender',
              required: true,
              options: [
                { 'label': "Male", value: 'Male' },
                { 'label': "Female", value: 'Female' }
              ]
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'password',
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              type: 'password',
              label: 'Password',
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 're_password',
            type: 'text',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              type: 'password',
              label: 'Re Password',
              required: true
            },
            hooks: {
              onInit: (field: any) => {
                //field.templateOptions.options = this.cs.getRole();
              }
            }
          },
          {
            key: 'bio',
            type: 'textarea',
            className: 'ta-cell pr-md col-md-6 col-12',
            templateOptions: {
              label: 'Comments',
              placeholder: 'Enter comments',
              required: true,
            }
          }
        ]
      }
    ]
  }
  constructor(private router: Router) { }

}
