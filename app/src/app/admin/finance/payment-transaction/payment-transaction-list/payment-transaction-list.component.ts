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
    showCheckbox:true,
    pkId: "payment_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['invoice_id','order_type','payment_date','payment_method','payment_status','amount','reference_number','currency','transaction_type','notes']
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
        sort: true
      },
      {
        fieldKey: 'currency', 
        name: 'Currency',
        sort: true
      },
      {
        fieldKey: 'transaction_type', 
        name: 'Transaction Type',
        sort: true
      },
      {
        fieldKey: 'notes', 
        name: 'Notes',
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
            apiUrl: 'finance/payment_transactions',
            confirm: true,
            confirmMsg: "Sure to delete?",
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

