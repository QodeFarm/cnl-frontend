import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-ledger-groups',
  templateUrl: './ledger-groups.component.html',
  styleUrls: ['./ledger-groups.component.scss']
})
export class LedgerGroupsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'masters/ledger_groups/',
      title: 'Ledger Groups',
      pkId: "ledger_group_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['ledger_group_id', 'name']
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
          fieldKey: 'inactive',
          name: 'Inactive',
          sort: false,
          type: 'boolean'
        },
        {
          fieldKey: 'under_group', 
          name: 'Under Group'
        },
        {
          fieldKey: 'nature',
          name: 'Nature',
          sort: false
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
              apiUrl: 'masters/ledger_groups'
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
      url: 'masters/ledger_groups/',
      title: 'Ledger Groups',
      pkId: "ledger_group_id",
      fields: [
        {
          key: 'name',
          type: 'input',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Name',
            placeholder: 'Enter Name',
            required: true,
          }
        },
        {
          key: 'code',
          type: 'input',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Code',
            placeholder: 'Enter Code'
          }
        },
        {
          key: 'inactive',
          type: 'checkbox',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Inactive'
          }
        },
        {
          key: 'under_group',
          type: 'text',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Under Group',
            placeholder: 'Enter Under Group',
          }
        },
        {
          key: 'nature',
          type: 'input',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Nature',
            placeholder: 'Enter Nature'
          }
        },
      ]
    }

  }
}