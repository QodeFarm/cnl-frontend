import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

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

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_debit_notes/',
    showCheckbox: true,
    pkId: "debit_note_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['debit_note_id']
    },
    cols: [
      {
        fieldKey: 'debit_date',
        name: 'Debit Date',
        sort: true
      },
      {
        fieldKey: 'customer_id',
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
        fieldKey: 'order_status_id',
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