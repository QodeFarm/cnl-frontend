import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-notification-methods',
  templateUrl: './notification-methods.component.html',
  styleUrls: ['./notification-methods.component.scss']
})
export class NotificationMethodsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'reminders/notification_methods/',
      title: 'Notification Methods',
      pkId: "method_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['method_id', 'method_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'method_name',
          name: 'Method Name',
          sort: true
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
              apiUrl: 'reminders/notification_methods'
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
      url: 'reminders/notification_methods/',
      title: 'Notification Methods',
      pkId: "method_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'method_name',
              type: 'input',
              className: 'col-md-6 col-12 p-0',
              templateOptions: {
                label: 'Method Name',
                placeholder: 'Enter Method Name',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }
}
