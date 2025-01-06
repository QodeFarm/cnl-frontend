import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

export class SalesInvoiceListComponent implements OnInit {

  ngOnInit() {
    console.log('Sorting table columns by "created_at"...');
    
    // this.tableConfig.cols.sort((a, b) => {
    //   // Assuming 'created_at' is a field in the objects inside 'cols'
    //   const dateA = new Date(a.created_at).getTime();
    //   const dateB = new Date(b.created_at).getTime();
      
    //   return dateB - dateA; // Ascending order
    // });
  }
  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_invoice_order/?summary=true',
    showCheckbox: true,
    pkId: "sale_invoice_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    "globalSearch": {
      keys: ['invoice_date','customer','invoice_no','total_amount','tax_amount','advance_amount','status_name','remarks']
    },
    cols: [
      {
        fieldKey: 'invoice_date',
        name: 'Invoice Date',
        sort: true
      },
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
        fieldKey: 'invoice_no',
        name: 'Invoice No',
        sort: true
      },
      {
        fieldKey: 'created_at',
        name: 'created_at',
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
