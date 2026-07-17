import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableComponent } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-opening-balance-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './opening-balance-list.component.html',
  styleUrls: ['./opening-balance-list.component.scss']
})
export class OpeningBalanceListComponent {
  @Output('edit') edit = new EventEmitter<any>();
  @Output('cancel') cancel = new EventEmitter<any>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  }

  curdConfig: TaCurdConfig = {
    tableConfig: {
      apiUrl: 'finance/opening_balance_entries/',
      title: 'Opening Balance',
      pkId: 'opening_balance_entry_id',
      pageSize: 10,
      globalSearch: {
        keys: ['account_name', 'account_type', 'amount', 'entry_type']
      },
      // Double-click a row to open it for editing (same as the pencil action) - matches
      // how the Ledger Accounts list behaves.
      rowEvents: {
        dblclick: (row: any) => this.edit.emit(row),
      },
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
          sort: false
        },
        {
          fieldKey: 'amount',
          name: 'Amount',
          sort: true
        },
        {
          fieldKey: 'entry_type',
          name: 'Dr/Cr',
          sort: true,
          displayType: 'map',
          mapFn: (value: any) => value === 'Debit' ? 'Dr' : (value === 'Credit' ? 'Cr' : '-')
        },
        {
          fieldKey: 'opening_balance_date',
          name: 'As Of',
          sort: true,
          displayType: 'date'
        },
        {
          fieldKey: 'status',
          name: 'Status',
          sort: true
        },
        {
          fieldKey: 'opening_balance_entry_id',
          name: 'Action',
          type: 'action',
          actions: [
            {
              type: 'callBackFn',
              icon: 'fa fa-pen',
              label: '',
              tooltip: 'Edit this opening balance',
              callBackFn: (row, action) => { this.edit.emit(row); }
            },
            {
              // Accounting entries are never hard-deleted - this Cancels the entry, reversing
              // its ledger impact and marking it Cancelled (audit trail kept). Trash icon so it
              // reads as "remove"; the confirm modal spells out that it reverses.
              type: 'callBackFn',
              icon: 'fa fa-trash',
              label: '',
              tooltip: 'Cancel this opening balance (reverses its ledger impact)',
              callBackFn: (row, action) => { this.cancel.emit(row); }
            }
          ]
        }
      ]
    },
    formConfig: undefined
  }
}
