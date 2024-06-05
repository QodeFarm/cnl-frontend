import { Component } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {

  tableConfig: TaTableConfig = {
    apiUrl: 'users/role/',
    title: 'Roles',
    pkId: "",
    pageSize: 10,
    "globalSearch": {
      keys: ['id', 'first_name', 'last_name']
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
