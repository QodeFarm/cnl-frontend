import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'users/role/',
      title: 'User Roles',
      pkId: "role_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['id', 'name']
      },
      cols: [
        {
          fieldKey: 'role_name',
          name: 'Name'
        },
        {
          fieldKey: 'description',
          name: 'Description',
          sort: true
        },
        {
          fieldKey: 'created_at',
          name: 'Created TS',
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
              apiUrl: 'users/role/'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
          ]
        }
      ]
    },
    formConfig: {
      url: 'users/role/',
      title: 'User Role',
      pkId: "role_id",
      exParams: [
      ],
      fields: [
        {
          key: 'role_name',
          type: 'input',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Role Nmae',
            placeholder: 'Enter Role Name',
            required: true,
          }
        },
        {
          key: 'description',
          type: 'textarea',
          className: 'ta-cell pr-md',
          templateOptions: {
            label: 'Description',
            placeholder: 'Enter description',
            required: true,
          }
        }

      ]
    }

  }


  tableConfig: TaTableConfig = {
    apiUrl: 'users/role/',
    title: 'Roles',
    pkId: "role_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['id', 'first_name', 'last_name']
    },
    cols: [
      {
        fieldKey: '',
        name: 'Name'
      },
      {
        fieldKey: 'description',
        name: 'Description',
        sort: true
      },
      {
        fieldKey: 'created_at',
        name: 'Created TS',
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
            apiUrl: 'api/users'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            // callBackFn: (row, action) => {
            //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            // }
          }
        ]
      }
    ]
  };
}
