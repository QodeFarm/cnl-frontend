import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-leave-types',
  templateUrl: './leave-types.component.html',
  styleUrls: ['./leave-types.component.scss']
})
export class LeaveTypesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'hrms/leave_types/',
      title: 'Leave Types',
      pkId: "leave_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['leave_type_id','leave_type_name','description','max_days_allowed']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'leave_type_name',
          name: 'Leave Type Name'
        },
        {
          fieldKey: 'description',
          name: 'Description'
        },
        {
          fieldKey: 'max_days_allowed',
          name: 'Max Days Allowed'
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
              apiUrl: 'hrms/leave_types'
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
      url: 'hrms/leave_types/',
      title: 'Leave Types',
      pkId: "leave_type_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'leave_type_name',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Leave Type Name',
                placeholder: 'Enter Leave Type Name',
                required: true,
              }
            },
            {
              key: 'description',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Description',
                placeholder: 'Enter Description',
                required: true,
              }
            },
            {
              key: 'max_days_allowed',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Max Days Allowed',
                placeholder: 'Enter Max Days Allowed',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }
};
