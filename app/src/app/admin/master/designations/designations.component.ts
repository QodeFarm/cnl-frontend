import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent {
  curdConfig: TaCurdConfig = {
    tableConfig: {
      pkId: "designation_id",
      apiUrl: "employees/designations",
      title: "Designations",
      globalSearch: {
        keys: ['designation_name']
      },
      cols: [
        {
          fieldKey: "designation_name",
          name: "Designation Name",
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
              apiUrl: 'employees/designations'
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
      url: "employees/designations/",
      pkId: "designation_id",
      title: "Designations",
      fields: [
        {
          key: 'designation_name',
          type: 'input',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter Name',
            required: true,
          }
        }
      ],
      submit: {}
    },
    displayStyle: "inlineform"
  }
}
