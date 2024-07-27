import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent {
  
  @Output('edit') edit = new EventEmitter<void>();
  
  tableConfig: TaTableConfig = {
    apiUrl: 'purchase/purchase_order/',
    showCheckbox:true,
    pkId: "purchase_order_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['id', 'first_name', 'last_name']
    },
    cols: [
      {
        fieldKey: 'order_date',
        name: 'Order Date',
        sort: true
      },
      {
        fieldKey: 'order_no',
        name: 'Order No',
        sort: true
      },
      {
        fieldKey: 'tax',
        name: 'Tax',
        sort: false
      },
      {
        fieldKey: 'tax_amount',
        name: 'Tax amount',
        sort: false
      },
      {
        fieldKey: 'total_amount',
        name: 'Total amount',
        sort: false
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
          return `${currentValue?.name}`;
        },
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
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            // confirm: true,
            // confirmMsg: "Sure to delete?",
            apiUrl: 'purchase/purchase_order'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.purchase_order_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {

  }
}

