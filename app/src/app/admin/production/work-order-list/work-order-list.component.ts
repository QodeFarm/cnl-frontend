import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './work-order-list.component.html',
  styleUrls: ['./work-order-list.component.scss']
})
export class WorkOrderListComponent {
  
  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'production/work_order/',
    showCheckbox: true,
    title: 'Work Order',
    pkId: "work_order_id",
    fixedFilters: [
      // {
      //   key: 'summary',
      //   value: 'true'
      // }
    ],
    pageSize: 10,
    globalSearch: {
      keys: ['product','quantity','status_id','start_date','end_date']
    },
    cols: [
      {
        fieldKey: 'product',
        name: 'Product',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.product.name;
        },
      },
      {
        fieldKey: 'quantity',
        name: 'Quantity',
        sort: true
      },
      {
        fieldKey: 'status_id',
        name: 'Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.status.status_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'start_date',
        name: 'Start Date',
        sort: true
      },
      {
        fieldKey: 'end_date',
        name: 'End Date',
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
            apiUrl: 'production/work_order'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.work_order_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router, private http: HttpClient) {}

}

