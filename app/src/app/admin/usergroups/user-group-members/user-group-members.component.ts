import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  standalone: true,
  imports: [CommonModule,AdminCommmonModule],
  selector: 'app-user-group-members',
  templateUrl: './user-group-members.component.html',
  styleUrls: ['./user-group-members.component.scss']
})
export class UserGroupMembersComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/user_group_members/',
      title: 'User Group Members',
      pkId: "member_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['member_id', 'group_id', 'employee_id']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
		{
          fieldKey: 'group_id',
          name: 'Groups',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.group.group_name}`;
          },
        },
		{
          fieldKey: 'employee_id',
          name: 'Employees',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.employee.name}`;
          },
        },
        {
          fieldKey: "code",
          name: "Action",
          type: 'action',
          actions: [{
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'masters/user_group_members'
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
      url: 'masters/user_group_members/',
      title: 'User Group Members',
      pkId: "member_id",
      exParams: [
        {
          key: 'group_id',
          type: 'script',
          value: 'data.group.group_id'
        },
        {
          key: 'employee_id',
          type: 'script',
          value: 'data.employee.employee_id'
        },	  
	    ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'group',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Groups',
                dataKey: 'group_id',
                dataLabel: "group_name",
                options: [],
                lazy: {
                  url: 'masters/user_groups/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
           },
			     {
              key: 'employee',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Employees',
                dataKey: 'employee_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'hrms/employees/',
                  lazyOneTime: true
                },
                required: false
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
          ]
        }
      ]
    }
  }
}
