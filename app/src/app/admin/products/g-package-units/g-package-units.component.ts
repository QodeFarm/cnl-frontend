import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-g-package-units',
  templateUrl: './g-package-units.component.html',
  styleUrls: ['./g-package-units.component.scss']
})
export class GPackageUnitsComponent {

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/g_package_units/',
      title: 'GPack Unit',
      pkId: "g_pack_unit_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['g_pack_unit_id','unit_name']
      },
      defaultSort: { key: 'unit_name', value: 'descend' },
      cols: [
        {
          fieldKey: 'unit_name',
          name: 'Unit Name',
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
              apiUrl: 'masters/g_package_units'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'masters/g_package_units'
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
      url: 'masters/g_package_units/',
      title: 'GPack Unit',
      pkId: "g_pack_unit_id",
      exParams: [],
      fields: [{
        fieldGroupClassName: "row col-12 p-0 m-0 custom-form field-no-bottom-space",
        fieldGroup: [
          {
          key: 'unit_name',
          type: 'input',
          className: 'col-md-6 col-12 p-0',
          templateOptions: {
            label: 'Unit Name',
            placeholder: 'Enter Unit Name',
            required: true,
          }
        }
      ]
      }]
    }
  }
};
