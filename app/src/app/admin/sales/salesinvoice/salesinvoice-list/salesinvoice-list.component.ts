import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-salesinvoice-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './salesinvoice-list.component.html',
  styleUrls: ['./salesinvoice-list.component.scss']
})
export class SalesInvoiceListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_invoice_order/',
    pkId: "sale_invoice_id",
    showCheckbox: true,
    pageSize: 10,
    globalSearch: {
      keys: []
    },
    cols: [
      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.customer.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'invoice_date',
        name: 'Invoice Date',
        sort: true
      },
      {
        fieldKey: 'invoice_no',
        name: 'Invoice No',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      {
        fieldKey: 'tax_amount',
        name: 'Tax Amount',
        sort: false
      },
      {
        fieldKey: 'advance_amount',
        name: 'Advance Amount',
        sort: false
      },
      {
        fieldKey: 'order_status',
        name: 'Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.order_status.status_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'remarks',
        name: 'Remarks',
        sort: false
      },
      {
        fieldKey: "action",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            apiUrl: 'sales/sale_invoice_order'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.sale_invoice_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) { }
}
