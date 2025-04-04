import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-debit-note-list',
  standalone: true, 
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './debit-note-list.component.html',
  styleUrls: ['./debit-note-list.component.scss']
})
export class DebitNoteListComponent {
  @Output('edit') edit = new EventEmitter<void>();
  @Output('circle') circle = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_debit_notes/',
    showCheckbox: true,
    pkId: "debit_note_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['customer','debit_date','sale_invoice_id','debit_note_number','reason','total_amount','status_name']
    },
    export: {downloadName: 'DebitNoteList'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.customer.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'sale_invoice_id',
        name: 'Invoice',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.sale_invoice.invoice_no}`;
        },
        sort: true
      },
      {
        fieldKey: 'debit_note_number',
        name: 'Debit note no',
        sort: true
      },
      {
        fieldKey: 'debit_date',
        name: 'Debit Date',
        sort: true
      },
      {
        fieldKey: 'reason',
        name: 'Return Reason',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      {
        fieldKey: 'status_name',
        name: 'Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.order_status.status_name}`;
        },
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
            apiUrl: 'sales/sale_debit_notes'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.debit_note_id);
            }
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-check-circle',
            confirm: true,
            confirmMsg: "Sure to Approve?",
            callBackFn: (row, action) => {
              console.log(row);
              this.circle.emit(row.debit_note_id);
            }
          }
        ]
      }
    ]
  };

constructor(private router: Router) {}
}