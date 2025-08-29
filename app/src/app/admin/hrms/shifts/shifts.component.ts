import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'hrms/shifts/',
      title: 'Shifts',
      pkId: "shift_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['shift_id','shift_name','start_time','end_time']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'shift_name',
          name: 'Shift Name',
          sort: true
        },
        {
          fieldKey: 'start_time',
          name: 'Start Time',
          sort: true
        },
        {
          fieldKey: 'end_time',
          name: 'End Time',
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
              apiUrl: 'hrms/shifts'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'hrms/shifts'
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
      url: 'hrms/shifts/',
      title: 'Shifts',
      pkId: "shift_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'shift_name',
              type: 'input',
              className: 'col-md-6 col-12 px-1 mb-3',
              templateOptions: {
                label: 'Shift Name',
                placeholder: 'Enter Shift Name',
                required: true,
              }
            },
            {
              key: 'start_time',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-md-6 col-12 px-1 mb-3',
              templateOptions: {
                label: 'Start Time',
                type: 'datetime-local',  // Use datetime-local for both date and time input
                placeholder: 'Select Date and Time',
                required: true,
              }
            },
            {
              key: 'end_time',
              type: 'input',  // Use 'input' to allow custom types like 'datetime-local'
              className: 'col-md-6 col-12 px-1',
              templateOptions: {
                label: 'End Time',
                type: 'datetime-local',  // Use datetime-local for both date and time input
                placeholder: 'Select Date and Time',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }
};
