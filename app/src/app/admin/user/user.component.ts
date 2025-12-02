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
        // {
        //   fieldKey: "code",
        //   name: "Action",
        //   type: 'action',
        //   actions: [
        //     {
        //       type: 'delete',
        //       label: 'Delete',
        //       confirm: true,
        //       confirmMsg: "Sure to delete?",
        //       apiUrl: 'users/create_user'
        //     },
        //     {
        //       type: 'edit',
        //       label: 'Edit'
        //     }
        //   ]
        // }
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
              apiUrl: 'users/create_user',
              isVisible: (row: any) => {
                // Get logged in user details
                const loggedInUser = this.taLocal.getItem('user');
                // Hide delete if current row is admin user
                return row.role?.role_name !== 'Admin';
              }
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
      // in component .ts
      fields: [
        {
          fieldGroupClassName: 'row col-12 p-0 m-0 custom-form',
          fieldGroup: [
            // LEFT: form area (9 cols on md+, full on xs)
            {
              className: 'col-lg-9 col-md-9 col-12 p-3',
              fieldGroupClassName: 'row gx-3 gy-3', // bootstrap gap between cols/rows
              fieldGroup: [
                {
                  key: 'title',
                  type: 'select',
                  className: 'col-12 col-md-6',
                  templateOptions: {
                    label: 'Title',
                    required: true,
                    options: [{ label: 'Mr.', value: 'Mr.' }, { label: 'Ms.', value: 'Ms.' }]
                  }
                },

                // First + Last name
                {
                  key: 'first_name',
                  type: 'text',
                  className: 'col-12 col-md-6',
                  templateOptions: { label: 'First Name', required: true }
                },
                {
                  key: 'last_name',
                  type: 'text',
                  className: 'col-12 col-md-6',
                  templateOptions: { label: 'Last Name', required: true }
                },

                // Email + Mobile
                {
                  key: 'email',
                  type: 'text',
                  className: 'col-12 col-md-6',
                  templateOptions: {
                    label: 'User Email',
                    dataKey: 'user',
                    dataLabel: 'user',
                    required: true
                  }
                },
                {
                  key: 'mobile',
                  type: 'text',
                  className: 'col-12 col-md-6',
                  templateOptions: { label: 'Mobile', required: true }
                },

                // Role + Gender
                {
                  key: 'role',
                  type: 'select',
                  className: 'col-12 col-md-6',
                  templateOptions: {
                    label: 'User Role',
                    dataKey: 'role_name',
                    dataLabel: 'role_name',
                    options: [],
                    lazy: { url: 'users/role/', lazyOneTime: true },
                    required: true
                  }
                },
                {
                  key: 'gender',
                  type: 'select',
                  className: 'col-12 col-md-6',
                  templateOptions: {
                    label: 'Gender',
                    required: true,
                    options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]
                  }
                },

                // DOB + Status
                {
                  key: 'date_of_birth',
                  type: 'date',
                  className: 'col-12 col-md-6',
                  templateOptions: { label: 'Date Of Birth', placeholder: 'Select date' }
                },
                {
                  key: 'status',
                  type: 'status-dropdown',
                  className: 'col-12 col-md-6',
                  templateOptions: {
                    label: 'Status',
                    dataKey: 'status_name',
                    dataLabel: 'status_name',
                    options: [],
                    lazy: { url: 'masters/statuses/', lazyOneTime: true }
                  }
                },

                // Username (full-width on small, half on md if you want)
                {
                  key: 'username',
                  type: 'text',
                  className: 'col-12 col-md-6',
                  templateOptions: { label: 'User Name', required: true }
                },

                // Hidden flag
                {
                  key: 'flag',
                  type: 'input',
                  defaultValue: 'admin_update',
                  className: 'd-none',
                  templateOptions: { type: 'hidden' },
                  hooks: {
                    onInit: (field: any) => field.formControl.setValue('admin_update')
                  }
                },

                // Password and Re-password (show only when creating)
                {
                  key: 'password',
                  type: 'text',
                  className: 'col-12 col-md-6',
                  templateOptions: { type: 'password', label: 'Password', required: true },
                  expressions: { hide: '(model.user_id)?true:false' }
                },
                {
                  key: 're_password',
                  type: 'text',
                  className: 'col-12 col-md-6',
                  templateOptions: { type: 'password', label: 'Re Password', required: true },
                  expressions: { hide: '(model.user_id)?true:false' }
                }
              ]
            },

            // RIGHT: avatar column (3 cols on md+, full width stacked on xs)
            {
              className: 'col-lg-3 col-md-3 col-12 p-3 d-flex',
              fieldGroupClassName: 'w-100 align-items-start justify-content-center',
              fieldGroup: [
                {
                  key: 'profile_picture_url',
                  type: 'file',
                  className: 'col-12 d-flex justify-content-center avatar-wrapper',
                  props: {
                    displayStyle: 'avatar',
                    storeFolder: 'profile',
                    label: 'Profile Pic',
                    multiple: false,
                    placeholder: 'Enter Profile Pic',
                    required: true
                  }
                }
              ]
            }
          ]
        }
      ]

    }
  }
  constructor(private taLocal: LocalStorageService) { }

  ngOnInit(): void {
    const user = this.taLocal.getItem('user');
    if (user && user.user_id) {
      // This component shows all users including the admin (logged in user)
      // But prevents deletion of the logged in user and any user with Admin role
      this.curdConfig.tableConfig.apiUrl = 'users/user';
      // Uncomment the line below if you want to exclude the logged-in user from the list
      // this.curdConfig.tableConfig.apiUrl = `users/user?exclude_id=${user.user_id}`;
    }
  }
}
