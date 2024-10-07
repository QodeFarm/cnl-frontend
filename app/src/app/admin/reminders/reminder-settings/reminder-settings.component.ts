import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-reminder-settings',
  templateUrl: './reminder-settings.component.html',
  styleUrls: ['./reminder-settings.component.scss']
})
export class ReminderSettingsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'reminders/reminder_settings/',
      title: 'Reminder Settings',
      pkId: "setting_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['user_id', 'notification_frequency_id','notification_method_id']
      },
      cols: [
        {
          fieldKey: 'user_id',
          name: 'User',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.user.name}`;
          },
        },
        {
          fieldKey: 'notification_frequency_id',
          name: 'Notification Frequency',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.notification_frequency.frequency_name}`;
          },
        },
        {
          fieldKey: 'notification_method_id',
          name: 'Notification Methods',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.notification_method.method_name}`;
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
              apiUrl: 'reminders/reminder_settings'
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
      url: 'reminders/reminder_settings/',
      title: 'Reminder Settings',
      pkId: "setting_id",
      exParams: [
        {
          key: 'user_id',
          type: 'script',
          value: 'data.user.employee_id'
        },
        {
          key: 'notification_frequency_id',
          type: 'script',
          value: 'data.notification_frequency.frequency_id'
        },
        {
          key: 'notification_method_id',
          type: 'script',
          value: 'data.notification_method.method_id'
        },        
      ],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'user',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'User',
                dataKey: 'employee_id',
                dataLabel: "name",
                options: [],
                required: true,
                lazy: {
                  url: 'hrms/employees/',
                  lazyOneTime: true
                },
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'notification_frequency',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Notification Frequency',
                dataKey: 'frequency_id',
                dataLabel: "frequency_name",
                options: [],
                lazy: {
                  url: 'reminders/notification_frequencies/',
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
              key: 'notification_method',
              type: 'select',
              className: 'col-6 pb-3 ps-0',
              templateOptions: {
                label: 'Notification Method',
                dataKey: 'method_id',
                dataLabel: "method_name",
                options: [],
                lazy: {
                  url: 'reminders/notification_methods/',
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
