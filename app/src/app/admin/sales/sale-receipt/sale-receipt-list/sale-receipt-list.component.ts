import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-sale-receipt-list',
  standalone: true, 
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './sale-receipt-list.component.html',
  styleUrls: ['./sale-receipt-list.component.scss']
})
export class SaleReceiptListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = { //receipt_path
    apiUrl: 'sales/sale_receipts/',
    // title: 'Edit Sales Order List',
    showCheckbox:true,
    pkId: "sale_receipt_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['sale_invoice_id','sale_invoice','receipt_name','description']
    },
    cols: [
      {
        fieldKey: 'sale_invoice_id',
        name: 'Customer',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.sale_invoice.customer?.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'sale_invoice',
        name: 'Sale invoice',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.sale_invoice.invoice_no}`;
        },
        sort: true
      },
      {
        fieldKey: 'receipt_name',
        name: 'Receipt name',
        sort: true
      },
      {
        fieldKey: 'description',
        name: 'Description',
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
            apiUrl: 'sales/sale_receipts'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              this.edit.emit(row.sale_receipt_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}