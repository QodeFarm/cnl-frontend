import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent {
  curdConfig: TaCurdConfig = {
    tableConfig: {
      pkId: "shift_id",
      apiUrl: "employees/shifts",
      title: "Shifts",
      globalSearch: {
        keys: ['shift_name']
      },
      cols: [
        {
          fieldKey: "shift_name",
          name: "Name",
          filter: true,
          sort: true
        },
        {
          fieldKey: "start_time",
          name: "Start Date",
          filter: true,
          displayType: 'time',
          sort: true
        },
        {
          fieldKey: "end_time",
          name: "End Date",
          displayType: 'time',
          filter: true,
          sort: true
        },
        {
          fieldKey: "code",
          name: "Action",
          sort: false,
          type: 'action',
          filter: false,
          actions: [
            {
              type: 'delete',
              label: 'Delete',
              confirm: true,
              confirmMsg: "Sure to delete?",
              apiUrl: 'employees/shifts'
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
      url: "employees/shifts/",
      pkId: "shift_id",
      title: "Shifts",
      // exParams: [
      //   {
      //     key: 'start_time',
      //     type: 'script'
      //   }
      // ],
      fields: [
        {
          key: 'shift_name',
          type: 'input',
          templateOptions: {
            label: 'Shift Name',
            placeholder: 'Enter Shift Name',
            required: true,
          }
        },
        {
          key: 'start_time',
          type: 'input',
          templateOptions: {
            type: 'datetime-local',
            label: 'Start Time',
            placeholder: 'Enter Start Time',
            required: true,
          }
        },
        {
          key: 'end_time',
          type: 'input',
          templateOptions: {
            type: 'datetime-local',
            label: 'End Time',
            placeholder: 'Enter End Time',
            required: true,
          }
        }
      ],
      submit: {

      }
    },
    displayStyle: "inlineform"
  }
}
