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
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'users/users_list/',
      title: 'Users',
      pkId: "first_name",
      pageSize: 10,
      "globalSearch": {
        keys: ['username', 'email']
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
          value: 'data.status.status_id'
        },
        {
          key: 'branch_id',
          type: 'script',
          value: 'data.brach.branch_id'
        }
      ],
      fields: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'profile_picture_url',
              type: 'file',
              className: "col-4",
              props: {
                displayStyle: 'avatar',
                storeFolder: "profile",
                label: 'Profile Pic',
                multiple: false,
                placeholder: 'Enter Profile Pic',
                required: false,
              }
            },
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
              key: 'brach',
              type: 'select',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Branch',
                dataKey: 'branch_id',
                dataLabel: "name",
                options: [],
                required: true,
                lazy: {
                  url: 'company/branches/',
                  lazyOneTime: true
                }
              }
            },
            {
              key: 'status',
              type: 'select',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Status',
                dataKey: 'status_id',
                dataLabel: "status_name",
                options: [],
                // required: true,
                lazy: {
                  url: 'masters/statuses/',
                  lazyOneTime: true
                }
              }
            },
            {
              key: 'isActive',
              type: 'boolean',
              className: 'ta-cell pr-md col-md-6 col-12',
              templateOptions: {
                label: 'Is Active',
                dataKey: 'name',
                dataLabel: "name",
                options: [],
                // required: true,
                // lazy: {
                //   url: 'masters/sale_types/',
                //   lazyOneTime: true
                // }
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
              className: 'ta-cell pr-md col-12',
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
