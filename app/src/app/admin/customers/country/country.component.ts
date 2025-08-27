import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/country/',
      title: 'Country List',
      pkId: 'country_id',
      pageSize: 10,
      "globalSearch": {
        keys: ['country_name', 'country_code']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'country_name',
          name: 'Country Name',
          sort: true,
        },
        {
          fieldKey: 'country_code',
          name: 'Country Code',
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
              apiUrl: 'masters/country'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/country'
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
      url: 'masters/country/',
      pkId: 'country_id',
      title: 'Country',
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'country_name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',

              templateOptions: {
                label: 'Country Name',
                placeholder: 'Enter Country Name',
                required: true,
              },
            },
            {
              key: 'country_code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Country Code',
                required: true,
                placeholder: 'Enter Country Code',
                description: 'e.g., IND, USA, AUS'
              },
            }
          ]
        }
      ]
    }

  }
}
