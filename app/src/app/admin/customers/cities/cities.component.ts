import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/city/',
      title: 'City List',
      pkId: 'city_id',
      pageSize: 10,
      "globalSearch": {
        keys: ['state_name', 'city_name', 'city_code']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'state_name',
          name: 'State',
          sort: false,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.state.state_name;
          },
        },
        {
          fieldKey: 'city_name',
          name: 'City Name',
          sort: true,
        },
        {
          fieldKey: 'city_code',
          name: 'City Code',
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
              apiUrl: 'masters/city'
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
      url: 'masters/city/',
      pkId: 'city_id',
      title: 'City',
        exParams: [
        {
          key: 'state_id',
          type: 'script',
          value: 'data.state.state_id'
        },
      ],
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'state',
              type: 'select',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'State',
                required: true,
                dataKey: 'state_id',
                dataLabel: 'state_name',
                lazy: {
                  url: 'masters/state/',
                  lazyOneTime: true
                }
              },
            },
            {
              key: 'city_name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'City Name',
                required: true,
              },

            },
            {
              key: 'city_code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'City Code',
                placeholder: 'Enter City Code'
              }
            },
          ]
        }
      ]
    }

  }
}
