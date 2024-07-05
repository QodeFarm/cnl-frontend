import { Component } from '@angular/core';
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


  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_order/',
    // title: 'Edit Sales Order List',
    pkId: "employee_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['id', 'first_name', 'last_name']
    },
    cols: [
      // {
      //   fieldKey: 'Edit',
      //   name: 'ID',
      //   // sort: true
      // },
      {
        fieldKey: 'first_name',
        name: 'Voucher'
      },
      {
        fieldKey: 'order_date',
        name: 'Order Date',
        sort: true
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
      // {
      //   fieldKey: 'email',
      //   name: 'Party',
      //   sort: true
      // },
      {
        fieldKey: 'item_value',
        name: 'Amount',
        sort: true
      },
      {
        fieldKey: 'phone',
        name: 'Tax',
        sort: true
      },
      {
        fieldKey: 'phone',
        name: 'Approval Status',
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
        fieldKey: 'job_code_id',
        name: 'Cash / Credit',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          // return `${row.job_code_id.job_code}`;
        },
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
            apiUrl: 'api/users'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
            callBackFn: (row, action) => {
              this.router.navigateByUrl('/admin/employee/create/' + row.employee_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {

  }
}
