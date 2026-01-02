import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';

@Component({
  selector: 'app-journal-voucher-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './journal-voucher-list.component.html',
  styleUrls: ['./journal-voucher-list.component.scss']
})
export class JournalVoucherListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  }

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/journal_vouchers/',
    showCheckbox: true,
    pkId: "journal_voucher_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['voucher_no', 'voucher_date', 'voucher_type', 'narration', 'total_debit', 'total_credit', 'is_posted']
    },
    export: { downloadName: 'JournalVoucherList' },
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'voucher_no',
        name: 'Voucher No',
        sort: true
      },
      {
        fieldKey: 'voucher_date',
        name: 'Date',
        sort: true
      },
      {
        fieldKey: 'voucher_type',
        name: 'Voucher Type',
        sort: true
      },
      {
        fieldKey: 'total_debit',
        name: 'Total Debit',
        sort: true,
        displayType: 'map',
        mapFn: (val: any) => val ? `₹${parseFloat(val).toFixed(2)}` : '₹0.00'
      },
      {
        fieldKey: 'total_credit',
        name: 'Total Credit',
        sort: true,
        displayType: 'map',
        mapFn: (val: any) => val ? `₹${parseFloat(val).toFixed(2)}` : '₹0.00'
      },
      {
        fieldKey: 'is_posted',
        name: 'Posted',
        sort: true,
        displayType: 'map',
        mapFn: (val: any) => val ? 'Yes' : 'No'
      },
      {
        fieldKey: 'narration',
        name: 'Narration',
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
            apiUrl: 'finance/journal_vouchers',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.journal_voucher_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}
