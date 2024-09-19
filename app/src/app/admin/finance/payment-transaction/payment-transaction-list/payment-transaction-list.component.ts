import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-transaction-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './payment-transaction-list.component.html',
  styleUrls: ['./payment-transaction-list.component.scss']
})
export class PaymentTransactionListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'finance/payment_transactions/',
    // title: 'Edit Tasks List',
    showCheckbox:true,
    pkId: "payment_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['payment_id']
    },
    cols: [
      {
        fieldKey: 'invoice_id',
        name: 'Invoice',
        sort: true
      },
      {
        fieldKey: 'order_type',
        name: 'Order Type',
        sort: true
      },
      {
        fieldKey: 'payment_date', 
        name: 'Payment Date',
        sort: true
      },
      {
        fieldKey: 'payment_method', 
        name: 'Payment Method',
        sort: true
      },
      {
        fieldKey: 'payment_status', 
        name: 'Payment Status',
        sort: true
      },
      {
        fieldKey: 'amount', 
        name: 'Amount',
        sort: true
      },
      {
        fieldKey: 'reference_number', 
        name: 'Reference Number',
        sort: false
      },
      {
        fieldKey: 'currency', 
        name: 'Currency',
        sort: false
      },
      {
        fieldKey: 'transaction_type', 
        name: 'Transaction Type',
        sort: true
      },
      {
        fieldKey: 'notes', 
        name: 'Notes',
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
            // confirm: true,
            // confirmMsg: "Sure to delete?",
            apiUrl: 'finance/payment_transactions'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.payment_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}

