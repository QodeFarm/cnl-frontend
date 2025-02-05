import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-statuses',
  templateUrl: './statuses.component.html',
  styleUrls: ['./statuses.component.scss']
})
export class StatusesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/statuses/',
      title: 'Statuses',
      
      pkId: "status_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['status_id', 'name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'status_name',
          name: 'Status name'
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
              apiUrl: 'masters/statuses'
            },
            {
              type: 'edit',
              label: 'Edit'
            },
            // {
            //   type: 'callBackFn',
            //   label: 'Edit',
            //   // callBackFn: (row, action) => {
            //   //   this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            //   // }
            // }
          ]
        }
      ]
    },
    formConfig: {
      url: 'masters/statuses/',
      title: 'Statuses',
      pkId: "status_id",
      exParams: [
      ],
      fields: 
    [ 
      {
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: 
      [
       {
          key: 'status_name',
          type: 'input',
          className: 'col-6 pb-3 ps-0',
          templateOptions: {
            label: 'Status name',
            placeholder: 'Enter status name',
            required: true,
          }
        },
      ]
    }
      ]
    }

  }
}
