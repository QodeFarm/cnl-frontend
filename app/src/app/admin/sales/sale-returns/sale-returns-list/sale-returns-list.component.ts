import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-sale-returns-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './sale-returns-list.component.html',
  styleUrls: ['./sale-returns-list.component.scss']
})
export class SaleReturnsListComponent {
//['sale_return_id', 'return_no', 'return_date', 'tax', 'return_reason', 'total_amount', 'due_date', 'tax_amount', 'customer_id', 'order_status_id', 'remarks']
@Output('edit') edit = new EventEmitter<void>();

tableConfig: TaTableConfig = {
  apiUrl: 'sales/sale_return_order/?summary=true',
  showCheckbox: true,
  pkId: "sale_return_id",
  fixedFilters: [
    {
      key: 'summary',
      value: 'true'
    }
  ],
  pageSize: 10,
  "globalSearch": {
    keys: ['customer','return_no','return_date','status_name','tax','return_reason','due_date','tax_amount','total_amount','remarks']
  },
  cols: [
    {
      fieldKey: 'customer',
      name: 'Customer',
      displayType: "map",
      mapFn: (currentValue: any, row: any, col: any) => {
        return `${row.customer.name}`;
      },
      sort: true
    },
    {
      fieldKey: 'return_no',
      name: 'Return No',
      sort: true
    },
    {
      fieldKey: 'return_date',
      name: 'Return Date',
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
      fieldKey: "code",
      name: "Action",
      type: 'action',
      actions: [
        {
          type: 'delete',
          label: 'Delete',
          confirm: true,
          confirmMsg: "Sure to delete?",
          apiUrl: 'sales/sale_return_order'
        },
        {
          type: 'callBackFn',
          icon: 'fa fa-pen',
          label: '',
          callBackFn: (row, action) => {
            console.log(row);
            this.edit.emit(row.sale_return_id);
          }
        }
      ]
    }
  ]
};

constructor(private router: Router) {}
}