import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-sales-reports',
  standalone:true,
  imports:[CommonModule,AdminCommmonModule],
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.scss']
})
export class SalesReportsComponent {
  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_order/?summary=true',
    pkId: "sale_order_id",
    pageSize: 10,
    globalSearch: {
      keys: ['order_date', 'order_no', 'customer', 'sale_type', 'amount']
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
        displayType: "map",
        mapFn: (currentValue: any, row: any) => {
          return row.sale_type?.name || '';
        },
        sort: true
      },
      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: "map",
        mapFn: (currentValue: any, row: any) => {
          return row.customer.name;
        },
        sort: true
      },
      {
        fieldKey: 'amount',
        name: 'Total Amount',
        sort: true
      }
    ]
  };
     formConfig: undefined

}
  
