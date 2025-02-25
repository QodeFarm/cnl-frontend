import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LocalStorageService } from '@ta/ta-core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      // apiUrl: 'users/user/',
      title: 'Users',
      pkId: "user_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['username', 'email', 'role', 'mobile']
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
            return `${row.role?.role_name || '--'}`;
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
              apiUrl: 'users/create_user'
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
        // {
        //   key: 'company_id',
        //   type: 'script',
        //   value: 'data.company.company_id'
        // },
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
        // {
        //   key: 'branch_id',
        //   type: 'script',
        //   value: 'data.brach.branch_id'
        // }
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form",
          fieldGroup: [
            {
              className: 'col-lg-9 col-md col-12 p-0',
              fieldGroup: [
                {
                  key: 'profile_picture_url',
                  type: 'file',
                  className: "ta-cell pr-md col d-md-none d-block",
                  props: {
                    displayStyle: 'avatar',
                    storeFolder: "profile",
                    label: 'Profile Pic',
                    multiple: false,
                    placeholder: 'Enter Profile Pic',
                    required: true,
                  }
                },
                {
                  key: 'title',
                  type: 'select',
                  className: 'ta-cell pr-md col-12',
                  templateOptions: {
                    label: 'Title',
                    required: true,
                    options: [
                      { 'label': "Mr.", value: 'Mr.' },
                      { 'label': "Ms.", value: 'Ms.' }
                    ]
                  },
                  hooks: {
                    onInit: (field: any) => {
                      //field.templateOptions.options = this.cs.getRole();
                    }
                  }
                },
                {
                  fieldGroupClassName: "row m-0",
                  fieldGroup: [
                    {
                      key: 'first_name',
                      type: 'text',
                      className: 'ta-cell pr-md col-12 col-md-6',
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
                      className: 'ta-cell pr-md col-12 col-md-6',
                      templateOptions: {
                        label: 'Last Name',
                        required: true
                      }
                    },
                    {
                      key: 'email',
                      type: 'text',
                      className: 'ta-cell pr-md col-12',
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
                  ],
                },
              ],
            },
            {
              className: 'col-lg-3 col-md-auto col-12 p-0',
              fieldGroup: [
                {
                  key: 'profile_picture_url',
                  type: 'file',
                  className: "ta-cell pr-md col d-md-block d-none",
                  props: {
                    displayStyle: 'avatar',
                    storeFolder: "profile",
                    label: 'Profile Pic',
                    multiple: false,
                    placeholder: 'Enter Profile Pic',
                    required: true,
                  }
                },
              ],
            },
            {
              fieldGroupClassName: "row m-0",
              className: 'col-12 p-0',
              fieldGroup: [
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
                    // bindId: true,
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
                  key: 'date_of_birth',
                  type: 'date',
                  className: 'ta-cell pr-md col-md-6 col-12',
                  templateOptions: {
                    label: 'Date Of Birth',
                    placeholder: 'Enter Birth Date',
                    required: false,
                  }
                },
                {
                  key: 'status',
                  type: 'select',
                  className: 'ta-cell pr-md col-md-6 col-12',
                  templateOptions: {
                    label: 'Status',
                    // bindId: true,
                    dataKey: 'status_name',
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
                  key: 'flag',
                  type: 'input',
                  defaultValue: 'admin_update',
                  className: 'ta-cell pr-md col-12',
                  templateOptions: {
                    type: 'hidden' // Hides the input field
                  },
                  hooks: {
                    onInit: (field: any) => {
                      field.formControl.setValue('admin_update'); // Ensures value is always 'admin_update'
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
                  expressions: {
                    hide: "(model.user_id)?true:false"
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
                  expressions: {
                    hide: "(model.user_id)?true:false"
                  },
                  hooks: {
                    onInit: (field: any) => {
                      //field.templateOptions.options = this.cs.getRole();
                    }
                  }
                }
              ]
            },

          ]
        }
      ]
    }
  }
  constructor(private taLocal: LocalStorageService) {}

  ngOnInit(): void {
    const user = this.taLocal.getItem('user');
    if (user && user.user_id) {
      this.curdConfig.tableConfig.apiUrl = `users/user?exclude_id=${user.user_id}`;
    }
  }
}
