import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-bank-account-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.scss'],

})
export class BankAccountListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
 };

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/bank_accounts/',
    showCheckbox:true,
    pkId: "bank_account_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['created_at','account_type','account_name','account_number','bank_name','branch_name',]
    },
    export: {downloadName: 'BankAccountList'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'account_type', 
        name: 'Account Type',
        sort: true
      },
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
        sort: true
      },
      {
        fieldKey: 'branch_name', 
        name: 'Branch Name',
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
            apiUrl: 'finance/bank_accounts',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'restore',
            label: 'Restore',
            apiUrl: 'finance/bank_accounts',
            confirm: true,
            confirmMsg: "Sure to restore?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
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

