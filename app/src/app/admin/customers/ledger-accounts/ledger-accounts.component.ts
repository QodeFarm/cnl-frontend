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
    drawerPlacement: 'right',
    tableConfig: {
      apiUrl: 'customers/ledger_accounts/',
      title: 'Ledger Accounts',
      pkId: "ledger_account_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['ledger_account_id', 'name']
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
          fieldKey: 'is_subledger',
          name: 'Is Subledger',
          sort: false,
          type: 'boolean'
        },
        {
          fieldKey: 'inactive',
          name: 'Inactive',
          sort: false,
          type: 'boolean'
        },
        {
          fieldKey: 'type', 
          name: 'Type',
          sort: false
        },
        {
          fieldKey: 'account_no',
          name: 'Account No',
          sort: false,
          isEncrypted: true
        },
        {
          fieldKey: 'rtgs_ifsc_code', 
          name: 'RTGS-IFSC',
          sort: false
        },
        {
          fieldKey: 'classification',
          name: 'Classification',
          sort: false,
        },
        {
          fieldKey: 'is_loan_account',
          name: 'Loan Account',
          sort: false,
          type: 'boolean'
        },
        {
          fieldKey: 'tds_applicable',
          name: 'TDS',
          sort: false,
          type: 'boolean'
        },
        {
          fieldKey: 'address', 
          name: 'Address',
          sort: false
        },
        {
          fieldKey: 'pan',
          name: 'PAN',
          sort: false,
        },
        {
          fieldKey: 'ledger_group_id',
          name: 'Ledger Group',
          sort: true,
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
        {
          key: 'is_subledger',
          type: 'checkbox',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Is Subledger'
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
          key: 'type',
          type: 'input',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Type',
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
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Account No',
            type: 'password'
          }
        },
        {
          key: 'rtgs_ifsc_code',
          type: 'input',
          className: 'ta-cell pr-md col-md-6 col-12',
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
          className: 'ta-cell pr-md col-md-6 col-12',
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
          key: 'is_loan_account',
          type: 'checkbox',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'Is Loan Account'
          }
        },
        {
          key: 'tds_applicable',
          type: 'checkbox',
          className: 'ta-cell pr-md col-md-6 col-12',
          templateOptions: {
            label: 'TDS Applicable'
          }
        },
		{
          key: 'address',
          type: 'text',
          className: 'ta-cell pr-md col-md-6 col-12',
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
          className: 'ta-cell pr-md col-md-6 col-12',
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
          type: 'select',
          className: 'ta-cell pr-md col-md-6 col-12',
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
      ]
    }

  }
}