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
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'masters/ledger_groups/',
      title: 'Ledger Groups',
      pkId: "ledger_group_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['ledger_group_id', 'name','code','inactive','under_group','nature']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
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
          sort: true,
          type: 'boolean'
        },
        {
          fieldKey: 'under_group', 
          name: 'Under Group',
          sort: true
        },
        {
          fieldKey: 'nature',
          name: 'Nature',
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
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup:[
            {
              key: 'name',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Name',
                placeholder: 'Enter Name',
                required: true,
              }
            },
            {
              key: 'code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Code',
                placeholder: 'Enter Code'
              }
            },
            {
              key: 'under_group',
              type: 'text',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Under Group',
                placeholder: 'Enter Under Group',
              }
            },
            {
              key: 'nature',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 pb-md-0 px-1',
              templateOptions: {
                label: 'Nature',
                placeholder: 'Enter Nature'
              }
            },
            {
              key: 'inactive',
              type: 'checkbox',
              className: 'col-md-6 col-12 px-1',
              templateOptions: {
                label: 'Inactive'
              }
            },
          ]
        }
      ]
    }

  }
}