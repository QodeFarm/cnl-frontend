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
      keys: ['customer_id', 'name']
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
        sort: true
      },
      {
        fieldKey: 'phone',
        name: 'Phone',
        sort: false,
      },
      {
        fieldKey: 'gst',
        name: 'GST',
        sort: false,
      },
      {
        fieldKey: 'city.name',
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
        sort: false,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.ledger_account_id.name;
        },
      },
      {
        fieldKey: 'created_at',
        name: 'Created At',
        sort: false,
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
            confirmMsg: "are you Sure to delete?",
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
