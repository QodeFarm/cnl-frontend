import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-purchase-invoice-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './purchase-invoice-list.component.html',
  styleUrls: ['./purchase-invoice-list.component.scss']
})
export class PurchaseInvoiceListComponent {
  
  @Output('edit') edit = new EventEmitter<void>();
  
  tableConfig: TaTableConfig = {
    apiUrl: 'purchase/purchase_invoice_order/?summary=true',
    showCheckbox:true,
    pkId: "purchase_invoice_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    "globalSearch": {
      keys: ['invoice_date','vendor','purchase_type','invoice_no','supplier_invoice_no','tax','total_amount','tax_amount','advance_amount','status_name','remarks']
    },
    cols: [
      {
        fieldKey: 'invoice_date',
        name: 'Invoice Date',
        sort: true
      },
      {
        fieldKey: 'vendor',
        name: 'Vendor',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.vendor.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'purchase_type',
        name: 'Purchase Type',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          // console.log("-->", currentValue);
          return `${row.purchase_type.name}`;
        },
      },
      {
        fieldKey: 'invoice_no',
        name: 'Invoice No',
        sort: true
      },
      {
        fieldKey: 'supplier_invoice_no',
        name: 'Supplier invoice no',
        sort: true
      },
      {
        fieldKey: 'tax',
        name: 'Tax',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total amount',
        sort: true
      },
      {
        fieldKey: 'tax_amount',
        name: 'Tax amount',
        sort: true
      },
      {
        fieldKey: 'advance_amount',
        name: 'Advance Amount',
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
        fieldKey: 'remarks',
        name: 'Remarks',
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
            apiUrl: 'purchase/purchase_invoice_order'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.purchase_invoice_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {

  }
}