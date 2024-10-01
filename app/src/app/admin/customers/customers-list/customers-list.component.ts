import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'customers/customers/?summary=true',
    showCheckbox:true,
    pkId: "customer_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    "globalSearch": {
      keys: ['name','email','phone','gst','city_id','ledger_account_id','created_at']
    },
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true
      },
      {
        fieldKey: 'email',
        name: 'Email',
        sort: false,
      },
      {
        fieldKey: 'phone',
        name: 'Phone',
        sort: false,
      },
      {
        fieldKey: 'gst',
        name: 'GST',
        sort: true,
      },
      {
        fieldKey: 'city_id',
        name: 'City Name',
        sort: false,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.city.city_name;
        },
      },
      {
        fieldKey: 'ledger_account_id',
        name: 'Ledger Account',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.ledger_account.name;
        },
      },
      {
        fieldKey: 'created_at',
        name: 'Created At',
        sort: true,
        displayType: "date"
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
            apiUrl: 'customers/customers'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.customer_id);
            }
          }       
        ]
      },
    ]
  };
  
  constructor(private router: Router) {

  }
}
