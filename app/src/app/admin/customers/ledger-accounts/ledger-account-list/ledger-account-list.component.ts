import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableComponent, TaTableModule } from '@ta/ta-table'; 
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-ledger-account-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './ledger-account-list.component.html',
  styleUrls: ['./ledger-account-list.component.scss']
})
export class LedgerAccountListComponent {
    @Output('edit') edit = new EventEmitter<void>();
    @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;
  
    refreshTable() {
      this.taTableComponent?.refresh();
    };
    curdConfig: TaCurdConfig = {
      drawerSize: 500,
      drawerPlacement: 'top',
      tableConfig: {
        apiUrl: 'customers/ledger_accounts/',
        title: 'Chart of Accounts',
        pkId: "ledger_account_id",
        pageSize: 10,
        "globalSearch": {
          keys: ['ledger_account_id', 'name', 'code', 'inactive', 'type', 'account_no', 'is_loan_account', 'address', 'pan', 'ledger_group_id']
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
              type: 'callBackFn',
              icon: 'fa fa-pen',
              label: '',
              tooltip: "Edit this record",
              callBackFn: (row, action) => {
                console.log(row);
                this.edit.emit(row.ledger_account_id);
              }
            }
            ]
          }
        ]
      },
      formConfig: undefined
    }
  }
