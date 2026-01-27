import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { LocalStorageService } from '@ta/ta-core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, NzModalModule, NzButtonModule, NzIconModule, NzToolTipModule],
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
        // is_active is now handled directly via the switch toggle
        // No need to extract status_id - backend uses is_active boolean
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
                    required: false
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
                // User Active/Inactive Toggle - Only shown in EDIT mode
                // Backend automatically sets status on CREATE:
                // - WITH email: is_active=False (until activation)
                // - WITHOUT email: is_active=True (with force_password_change=True)
                {
                  key: 'is_active',
                  type: 'switch',
                  className: 'col-12 col-md-6',
                  defaultValue: true,
                  templateOptions: {
                    label: 'Account Status',
                    checkedLabel: 'Active',
                    uncheckedLabel: 'Inactive',
                    showLabel: true
                  },
                  expressions: {
                    // Hide in CREATE mode - only show in EDIT mode
                    hide: (field: any) => !field.model?.user_id
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

                // Password and Re-password - ALWAYS HIDDEN
                // User sets password via:
                // - WITH email: Activation email link
                // - WITHOUT email: Force change password on first login
                // {
                //   key: 'password',
                //   type: 'text',
                //   className: 'col-12 col-md-6',
                //   templateOptions: { type: 'password', label: 'Password', required: false },
                //   expressions: { 
                //     hide: () => true // Always hide - password set by user, not admin
                //   }
                // },
                // {
                //   key: 're_password',
                //   type: 'text',
                //   className: 'col-12 col-md-6',
                //   templateOptions: { type: 'password', label: 'Re Password', required: false },
                //   expressions: { 
                //     hide: () => true // Always hide - password set by user, not admin
                //   }
                // },

                // Helper text for WITH email users
                {
                  type: 'template',
                  className: 'col-12',
                  template: `
                    <div class="alert alert-info py-2 px-3 mb-0" style="font-size: 13px;">
                      <i class="fa fa-info-circle me-1"></i>
                      <strong>Email provided:</strong> User will receive an activation email to set their own password.
                    </div>
                  `,
                  expressions: {
                    hide: (field: any) => {
                      // Show only when creating with email
                      return field.model?.user_id || !field.model?.email;
                    }
                  }
                },

                // Helper text for NO email users
                {
                  type: 'template',
                  className: 'col-12',
                  template: `
                    <div class="alert alert-warning py-2 px-3 mb-0" style="font-size: 13px;">
                      <i class="fa fa-exclamation-triangle me-1"></i>
                      <strong>No email provided:</strong> A temporary password will be generated. 
                      Share it securely with the user.
                    </div>
                  `,
                  expressions: {
                    hide: (field: any) => {
                      // Show only when creating without email
                      return field.model?.user_id || field.model?.email;
                    }
                  }
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
      ],
      // Submit callback to handle temp_password response
      submit: {
        submittedFn: (res: any) => {
          this.handleUserCreated(res);
        }
      }
    }
  }

  // Temp password modal properties
  showTempPasswordModal: boolean = false;
  tempPassword: string = '';
  tempPasswordVisible: boolean = false;
  createdUserName: string = '';

  @ViewChild('taCurd') taCurd: any;

  constructor(private taLocal: LocalStorageService, private message: NzMessageService) { }

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

  // Handle user creation response
  handleUserCreated(res: any): void {
    console.log('User created response:', res);
    console.log('Response type:', typeof res);
    
    // Handle different response structures from ta-curd
    let tempPassword = null;
    let username = 'User';
    
    // Case 1: res.data.temp_password (full response object)
    if (res?.data?.temp_password) {
      tempPassword = res.data.temp_password;
      username = res.data.username || res.data.first_name || 'User';
    }
    // Case 2: res.temp_password (just the data object)
    else if (res?.temp_password) {
      tempPassword = res.temp_password;
      username = res.username || res.first_name || 'User';
    }
    
    console.log('Temp password found:', tempPassword);
    
    // Show modal if temp_password exists
    if (tempPassword) {
      this.tempPassword = tempPassword;
      this.createdUserName = username;
      this.showTempPasswordModal = true;
      this.tempPasswordVisible = false;
      console.log('Modal should show now, showTempPasswordModal:', this.showTempPasswordModal);
    }
  }

  // Toggle password visibility
  toggleTempPasswordVisibility(): void {
    this.tempPasswordVisible = !this.tempPasswordVisible;
  }

  // Copy password to clipboard
  copyTempPassword(): void {
    navigator.clipboard.writeText(this.tempPassword).then(() => {
      this.message.success('Password copied to clipboard!');
    }).catch(() => {
      this.message.error('Failed to copy password');
    });
  }

  // Close temp password modal
  closeTempPasswordModal(): void {
    this.showTempPasswordModal = false;
    this.tempPassword = '';
    this.tempPasswordVisible = false;
    this.createdUserName = '';
    
    // Refresh the table
    if (this.taCurd) {
      this.taCurd.refresh();
    }
  }
}
