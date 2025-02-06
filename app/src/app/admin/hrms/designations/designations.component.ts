import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'hrms/designations/',
      title: 'Designation',
      pkId: "designation_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['designation_id','designation_name','responsibilities']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'designation_name',
          name: 'Designation Name'
        },
        {
          fieldKey: 'responsibilities',
          name: 'Responsibilities'
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
              apiUrl: 'hrms/designations'
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
      url: 'hrms/designations/',
      title: 'Designation',
      pkId: "designation_id",
      exParams: [],
      fields: [
        {
          fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
          fieldGroup: [
            {
              key: 'designation_name',
              type: 'input',
              className: 'col-6 ps-0',
              templateOptions: {
                label: 'Designation Name',
                placeholder: 'Enter Designation Name',
                required: true,
              }
            },
            {
              key: 'responsibilities',
              type: 'input',
              className: 'col-6 ps-0',
              templateOptions: {
                label: 'Responsibilities',
                placeholder: 'Enter Responsibilities',
                required: true,
              }
            },
          ]
        }
      ]
    }
  }
};
