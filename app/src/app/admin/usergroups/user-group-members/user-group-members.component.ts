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
          sort: true,
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.group.group_name}`;
          },
        },
        {
          fieldKey: 'employee_id',
          name: 'Employee',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            // Concatenate first_name and last_name correctly
            const firstName = row.employee?.first_name || '';
            const lastName = row.employee?.last_name || '';
            return `${firstName} ${lastName}`.trim();
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
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
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
              type: 'user-groups-dropdown',
              className: 'col-md-6 col-12 px-1 pb-3 pb-md-0',
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
              className: 'col-md-6 col-12 px-1',
              templateOptions: {
                label: 'Employees',
                dataKey: 'employee_id',
                dataLabel: "first_name",
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
