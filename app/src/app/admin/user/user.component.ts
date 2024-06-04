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
          fieldKey: 'first_name',
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
      pkId: "leave_id",
      exParams: [
        {
          key: 'status_id',
          type: 'script',
          value: 'data.status.status_id'
        },
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },
        {
          key: 'leave_type_id',
          type: 'script',
          value: 'data.leave_type.leave_type_id'
        }
      ],
      fields: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
        {
          key: 'user',
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
          key: 'role_name',
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
          key: 'user',
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
          key: 'comments',
          type: 'textarea',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Comments',
            placeholder: 'Enter comments',
            required: true,
          }
        },
      ]}
      ]
    }

  }
}
