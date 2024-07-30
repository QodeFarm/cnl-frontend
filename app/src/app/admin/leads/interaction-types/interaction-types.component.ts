import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-interaction-types',
  templateUrl: './interaction-types.component.html',
  styleUrls: ['./interaction-types.component.scss']
})
export class InteractionTypesComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'leads/interaction_types/',
      title: 'Interaction type',
      pkId: "interaction_type_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['interaction_type_id']
      },
      cols: [
        {
          fieldKey: 'interaction_type',
          name: 'Interaction type'
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
              apiUrl: 'leads/interaction_types'
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
      url: 'leads/interaction_types/',
      title: 'Interaction type',
      pkId: "interaction_type_id",
      exParams: [],
      fields: [{
        fieldGroupClassName: "ant-row",
        fieldGroup: [{
          key: 'interaction_type',
          type: 'input',
          className: 'ant-col-6 pr-md m-3',
          templateOptions: {
            label: 'Interaction type',
            placeholder: 'Enter Interaction type',
            required: true,
          }
        }]
      }]
    }
  }
};
