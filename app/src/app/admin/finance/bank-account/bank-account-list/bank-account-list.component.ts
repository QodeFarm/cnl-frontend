import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-account-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.scss'],

})
export class BankAccountListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/bank_accounts/',
    showCheckbox:true,
    pkId: "bank_account_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['bank_account_id']
    },
    cols: [
      {
        fieldKey: 'account_name',
        name: 'Account Name',
        sort: true
      },
      {
        fieldKey: 'account_number',
        name: 'Account Number',
        sort: true
      },
      {
        fieldKey: 'bank_name', 
        name: 'Bank Name',
        sort: false
      },
      {
        fieldKey: 'branch_name', 
        name: 'Branch Name',
        sort: false
      },
      {
        fieldKey: 'account_type', 
        name: 'Account Type',
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
            apiUrl: 'finance/bank_accounts'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.bank_account_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}

