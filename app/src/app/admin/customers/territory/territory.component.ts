import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-territory',
  templateUrl: './territory.component.html',
  styleUrls: ['./territory.component.scss']
})
export class TerritoryComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'masters/territory/',
      title: 'Territory',
      pkId: "territory_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['territory_id', 'name']
      },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          sort: true
        },
        {
          fieldKey: 'code', 
          name: 'Code',
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
              apiUrl: 'masters/territory'
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
      url: 'masters/territory/',
      title: 'Territory',
      pkId: "territory_id",
      fields: [
        {
          key: 'name',
          type: 'input',
          className: 'ta-cell pr-md col-md-6',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter Name',
            required: true,
          }
        },
        {
          key: 'code',
          type: 'input',
          className: 'ta-cell pr-md col-md-6',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Code',
            required: true,
          }
        },
      ]
    }

  }
}
