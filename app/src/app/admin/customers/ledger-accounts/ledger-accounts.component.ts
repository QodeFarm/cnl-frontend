import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';

@Component({
  selector: 'app-ledger-accounts',
  templateUrl: './ledger-accounts.component.html',
  styleUrls: ['./ledger-accounts.component.scss']
})
export class LedgerAccountsComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'top',
    tableConfig: {
      apiUrl: 'customers/ledger_accounts/',
      title: 'Ledger Accounts',
      pkId: "ledger_account_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['ledger_account_id', 'name','code','inactive','type','account_no','is_loan_account', 'address','pan','ledger_group_id']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
      defaultSort: { key: 'is_deleted', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Name',
          // sort: true
        },
        {
          fieldKey: 'code', 
          name: 'Code',
          // sort: true
        },
        // {
        //   fieldKey: 'is_subledger',
        //   name: 'Is Subledger',
        //   sort: false,
        //   type: 'boolean'
        // },
        {
          fieldKey: 'inactive',
          name: 'Inactive',
          sort: true,
          type: 'boolean'
        },
        {
          fieldKey: 'type', 
          name: 'Type',
          sort: true
        },
        {
          fieldKey: 'account_no',
          name: 'Account No',
          sort: true,
          isEncrypted: true
        },
        // {
        //   fieldKey: 'rtgs_ifsc_code', 
        //   name: 'RTGS-IFSC',
        //   sort: false
        // },
        // {
        //   fieldKey: 'classification',
        //   name: 'Classification',
        //   sort: false,
        // },
        {
          fieldKey: 'is_loan_account',
          name: 'Loan Account',
          sort: true,
          type: 'boolean'
        },
        // {
        //   fieldKey: 'tds_applicable',
        //   name: 'TDS',
        //   sort: false,
        //   type: 'boolean'
        // },
        {
          fieldKey: 'address', 
          name: 'Address',
          sort: true
        },
        {
          fieldKey: 'pan',
          name: 'PAN',
          sort: true,
        },
        {
          fieldKey: 'ledger_group_id',
          name: 'Ledger Group',
          // sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.ledger_group.name}`;
          },
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
              apiUrl: 'customers/ledger_accounts'
            },
            {
              type: 'restore',
              label: 'Restore',
              confirm: true,
              confirmMsg: "Sure to restore?",
              apiUrl: 'customers/ledger_accounts'
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
      url: 'customers/ledger_accounts/',
      title: 'Ledger Accounts',
      pkId: "ledger_account_id",
      exParams: [
        {
          key: 'ledger_group_id',
          type: 'script',
          value: 'data.ledger_group.ledger_group_id'
        },
      ],
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
                placeholder: 'Enter Code',
                required: true,
              }
            },
            {
              key: 'type',
              type: 'select',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Type',
                options: [
                  { value: 'Customer', label: 'Customer' },
                  { value: 'Bank', label: 'Bank' },
                  { value: 'Cash', label: 'cash' },
                  { value: 'Vendor', label: 'Vendor'}
                ],
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'account_no',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Account No',
                type: 'password'
              }
            },
            {
              key: 'rtgs_ifsc_code',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'RTGS IFSC Code',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'classification',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Classification',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
        {
              key: 'address',
              type: 'text',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Address',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
        {
              key: 'pan',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'PAN',
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'ledger_group',
              type: 'ledger-group-dropdown',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Ledger Group',
                dataKey: 'ledger_group_id',
                dataLabel: "name",
                options: [],
                lazy: {
                  url: 'masters/ledger_groups/',
                  lazyOneTime: true
                },
                required: true
              },
              hooks: {
                onInit: (field: any) => {
                  //field.templateOptions.options = this.cs.getRole();
                }
              }
            },
            {
              key: 'tds_applicable',
              type: 'checkbox',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'TDS Applicable'
              }
            },
            {
              key: 'is_subledger',
              type: 'checkbox',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Is Subledger'
              }
            },
            {
              key: 'inactive',
              type: 'checkbox',
              className: 'col-md-6 col-12 pb-md-0 pb-3 px-1',
              templateOptions: {
                label: 'Inactive'
              }
            },
            {
              key: 'is_loan_account',
              type: 'checkbox',
              className: 'col-md-6 col-12  px-1',
              templateOptions: {
                label: 'Is Loan Account'
              }
            },
          ]
        }
      ]
    }

  }
}