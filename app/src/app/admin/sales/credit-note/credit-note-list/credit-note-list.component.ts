import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-credit-note-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './credit-note-list.component.html',
  styleUrls: ['./credit-note-list.component.scss']
})
export class CreditNoteListComponent {
  @Output('edit') edit = new EventEmitter<void>();
  @Output('circle') circle = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_credit_notes/',
    showCheckbox: true,
    pkId: "credit_note_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['customer','credit_date','sale_invoice_id','credit_note_number','reason','total_amount','status_name']
    },
    export: {downloadName: 'CreditNoteList'},
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
        fieldKey: 'credit_note_number',
        name: 'Credit note no',
        sort: true
      },
      {
        fieldKey: 'credit_date',
        name: 'Credit Date',
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
            apiUrl: 'sales/sale_credit_notes'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'sales/sale_credit_notes'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.credit_note_id);
              
            }
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-check-circle',
            confirm: true,
            confirmMsg: "Sure to Approve?",
            callBackFn: (row, action) => {
              console.log(row);
              this.circle.emit(row.credit_note_id);
            }
          }
        ]
      }
    ]
  };

constructor(private router: Router) {}
}