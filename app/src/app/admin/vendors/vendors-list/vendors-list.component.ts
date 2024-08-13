import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendors-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.scss']
})
export class VendorsListComponent {

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    // apiUrl: 'vendors/vendors/?summary=true&summary=true&page=1&limit=10&sort[0]=name,DESC',
    apiUrl: 'vendors/vendors/?summary=true',
    title: 'Vendors',
    showCheckbox:true,
    pkId: "vendor_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    globalSearch: {
      keys: ['id', 'name']
    },
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true
      },
      {
        fieldKey: 'gst_no',
        name: 'GST No',
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
        fieldKey: 'vendor_category_id',
        name: 'Vendor Category',
        sort: false,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.vendor_category.name;
        },
      },
      {
        fieldKey: 'ledger_account',
        name: 'Ledger Account',
        sort: false,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.ledger_account.name;
        },
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
        fieldKey: 'created_at',
        name: 'Created At',
        sort: false,
        displayType: "date"
      },
      {
        fieldKey: "vendor_id",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            confirm: true,
            confirmMsg: "Sure to delete?",
            apiUrl: 'vendors/vendors'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            callBackFn: (row, action) => {
              console.log(`vendor ID: ${row.vendor_id}`);
              this.edit.emit(row.vendor_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) { }
}