import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';


@Component({
  selector: 'app-reminder-types',
  templateUrl: './reminder-types.component.html',
  styleUrls: ['./reminder-types.component.scss']
})
export class ReminderTypesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'reminders/reminder_types/',
      title: 'Reminder Types',
      pkId: "reminder_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['reminder_type_id', 'type_name']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'type_name',
          name: 'Type Name',
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
              apiUrl: 'reminders/reminder_types'
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
      url: 'reminders/reminder_types/',
      title: 'Reminder Types',
      pkId: "reminder_type_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [                  
            {
              key: 'type_name',
              type: 'input',
              className: 'col-md-6 col-12 p-0',
              templateOptions: {
                label: 'Type Name',
                placeholder: 'Enter Type Name',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }
}
