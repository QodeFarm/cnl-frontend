import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from '@ta/ta-table';

@Component({
  selector: 'app-payment-receipt-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './payment-receipt-list.component.html',
  styleUrls: ['./payment-receipt-list.component.scss']
})
export class PaymentReceiptListComponent {
  @Output('edit') edit = new EventEmitter<string>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  }

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/payment_transactions/',
    showCheckbox: true,
    pkId: "payment_transaction_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['invoice_no', 'payment_receipt_no', 'payment_date', 'payment_method', 'payment_status']
    },
    export: { downloadName: 'PaymentReceiptList' },
    defaultSort: { key: 'payment_date', value: 'descend' },
    cols: [
      {
        fieldKey: 'invoice_no',
        name: 'Invoice No',
        sort: true
      },
      {
        fieldKey: 'invoice_date',
        name: 'Invoice Date',
        sort: true
      },
      {
        fieldKey: 'due_date',
        name: 'Due Date',
        sort: true
      },
      {
        fieldKey: 'payment_receipt_no',
        name: 'Receipt No',
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
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any) => {
          return currentValue ? `₹${currentValue}` : '₹0.00';
        }
      },
      {
        fieldKey: 'outstanding_amount',
        name: 'Outstanding',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any) => {
          return currentValue ? `₹${currentValue}` : '₹0.00';
        }
      },
      {
        fieldKey: 'adjusted_now',
        name: 'Adjusted Now',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any) => {
          return currentValue ? `₹${currentValue}` : '₹0.00';
        }
      },
      {
        fieldKey: 'payment_status',
        name: 'Payment Status',
        sort: true
      },
      {
        fieldKey: 'ref_date',
        name: 'Reference Date',
        sort: true
      },
      {
        fieldKey: 'taxable',
        name: 'Taxable',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any) => {
          return currentValue ? `${currentValue}` : 'N/A';
        }
      },
      {
        fieldKey: 'tax_amount',
        name: 'Tax Amount',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any) => {
          return currentValue ? `₹${currentValue}` : '₹0.00';
        }
      },
      {
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            apiUrl: 'sales/payment_transactions',
            confirm: true,
            confirmMsg: "Are you sure you want to delete this payment receipt?"
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row: any) => {
              this.edit.emit(row.payment_transaction_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}