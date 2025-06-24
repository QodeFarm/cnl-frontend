import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/state/',
      title: 'State List',
      pkId: 'state_id',
      pageSize: 10,
      "globalSearch": {
        keys: ['country_name', 'state_name', 'state_code']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'country_name',
          name: 'Country',
          sort: false,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.country.country_name;
          },
        },
        {
          fieldKey: 'state_name',
          name: 'State Name',
          sort: true,
        },
        {
          fieldKey: 'state_code',
          name: 'State Code',
          sort: true,
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
              apiUrl: 'masters/state'
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
      url: 'masters/state/',
      pkId: 'state_id',
      title: 'State',
      exParams: [
        {
          key: 'country_id',
          type: 'script',
          value: 'data.country.country_id'
        },
      ],
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'country',
              type: 'select',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Country',
                required: true,
                dataKey: 'country_id',
                dataLabel: 'country_name',
                lazy: {
                  url: 'masters/country/',
                  lazyOneTime: true
                }
              },
            },
            {
              key: 'state_name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'State Name',
                required: true,
              },
            },
            {
              key: 'state_code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'State Code',
                required: true,
                maxLength: 10,
                description: 'e.g., KL, TN, MH'
              },
              validation: {
                messages: {
                  required: 'State Code is required',
                }
              }
            }
          ]
        }
      ]
    }

  }

}
