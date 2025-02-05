import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-notification-frequencies',
  templateUrl: './notification-frequencies.component.html',
  styleUrls: ['./notification-frequencies.component.scss']
})
export class NotificationFrequenciesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'reminders/notification_frequencies/',
      title: 'Notification Frequencies',
      pkId: "frequency_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['frequency_id', 'frequency_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'frequency_name',
          name: 'Frequency Name'
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
              apiUrl: 'reminders/notification_frequencies'
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
      url: 'reminders/notification_frequencies/',
      title: 'Notification Frequencies',
      pkId: "frequency_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'frequency_name',
              type: 'input',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Frequency Name',
                placeholder: 'Enter Frequency Name',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }
}
