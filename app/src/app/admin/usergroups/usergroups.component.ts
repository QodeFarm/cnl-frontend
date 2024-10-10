import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-usergroups',
  standalone: true,
  imports: [CommonModule,AdminCommmonModule],
  templateUrl: './usergroups.component.html',
  styleUrls: ['./usergroups.component.scss']
})
export class UsergroupsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/user_groups/',
      title: 'User Groups',
      pkId: "group_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['group_id', 'group_name', 'description']
      },
      cols: [
        {
          fieldKey: 'group_name',
          name: 'Group Name'
        },
		    {
        fieldKey: 'description', 
        name: 'Description',
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
              apiUrl: 'masters/user_groups'
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
      url: 'masters/user_groups/',
      title: 'User Groups',
      pkId: "group_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'group_name',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Group Name',
                placeholder: 'Enter Group Name',
                required: true,
              }
            },
			      {
              key: 'description',
              type: 'textarea',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }
}
