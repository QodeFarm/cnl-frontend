import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'users/userdata/',
      title: 'Users',
      pkId: "first_name",
      pageSize: 10,
      "globalSearch": {
        keys: ['id', 'name']
      },
      cols: [
        {
          fieldKey: 'username',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'email',
          name: 'Email',
          sort: true
        },
        {
          fieldKey: 'role',
          name: 'Role',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.role.role_name}`;
          },
        },
        {
          fieldKey: 'mobile',
          name: 'Mobile No.',
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
              apiUrl: 'leaves/employeeleaves'
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

  }
}
