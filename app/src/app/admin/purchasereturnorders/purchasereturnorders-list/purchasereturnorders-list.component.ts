import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchasereturnorders-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './purchasereturnorders-list.component.html',
  styleUrls: ['./purchasereturnorders-list.component.scss']
})
export class PurchasereturnordersListComponent {
  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'purchase/purchase_return_order/',
    showCheckbox: true,
    pkId: "purchase_return_id",
    pageSize: 10,
    globalSearch: {
      keys: []
    },
    cols: [
      {
        fieldKey: 'return_no',
        name: 'Return No',
        sort: true
      },
      {
        fieldKey: 'tax',
        name: 'Tax',
        sort: true
      },
      {
        fieldKey: 'return_reason',
        name: 'Return Reason',
        sort: true
      },
      {
        fieldKey: 'due_date',
        name: 'Due Date',
        sort: true
      },
      {
        fieldKey: 'tax_amount',
        name: 'Tax Amount',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      {
        fieldKey: 'remarks',
        name: 'Remarks',
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
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.purchase_type.name}`;
        },
        sort: true
      },
      {
        fieldKey: "actions",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            apiUrl: 'purchase/purchase_return_order'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            callBackFn: (row, action) => {
              this.edit.emit(row.purchase_return_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}
