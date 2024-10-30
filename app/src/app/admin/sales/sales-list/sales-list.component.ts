import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent {

  @Output('edit') edit = new EventEmitter<void>();


  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_order/?summary=true',
    // title: 'Edit Sales Order List',
    showCheckbox: true,
    pkId: "sale_order_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    "globalSearch": {
      keys: ['order_date','order_no','sale_type','customer','amount','tax','advance_amount','status_name','flow_status']
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
        fieldKey: 'sale_type',
        name: 'Sale Type',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          // console.log("-->", currentValue);
          return `${row.sale_type.name}`;
        },
      },

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
        fieldKey: 'sale_estimate',
        name: 'Sale Estimate',
        sort: true
      },
      {
        fieldKey: 'amount',
        name: 'Amount',
        sort: true
      },
      {
        fieldKey: 'tax',
        name: 'Tax',
        sort: true
      },
      {
        fieldKey: 'advance_amount',
        name: 'Advance Amt',
        sort: true
      },
      // {
      //   fieldKey: 'job_type_id',
      //   name: 'Document Status',
      //   displayType: "map",
      //   mapFn: (currentValue: any, row: any, col: any) => {
      //     return `${row.job_type_id.job_type_name}`;
      //   },
      //   sort: true
      // },
      // {
      //   fieldKey: 'job_code_id',
      //   name: 'Print Count',
      //   displayType: "map",
      //   mapFn: (currentValue: any, row: any, col: any) => {
      //     return `${row.job_code_id.job_code}`;
      //   },
      //   sort: true
      // },
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
        fieldKey: 'flow_status',
        name: 'Flow Status',
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
            apiUrl: 'sales/sale_order'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.sale_order_id);
              // this.router.navigateByUrl('/admin/sales/edit/' + row.sale_order_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {

  }
}
