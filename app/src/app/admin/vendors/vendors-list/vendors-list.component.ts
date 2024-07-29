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
    apiUrl: 'vendors/vendors/?summary=true&summary=true&page=1&limit=10&sort[0]=name,DESC',
    title: 'Vendors',
    showCheckbox:true,
    pkId: "vendor_id",
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
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.email}`;
        },
      },
      {
        fieldKey: 'phone',
        name: 'Phone',
        sort: false,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.phone}`;
        },
      },
      {
        fieldKey: 'vendor_category_id.name',
        name: 'Vendor Category',
        sort: false,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.vendor_category_id.name;
        },
      },
      {
        fieldKey: 'ledger_account_id.name',
        name: 'Account Name',
        sort: false,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.ledger_account_id.name;
        },
      },
      {
        fieldKey: 'city.city_name',
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
            // confirm: true,
            // confirmMsg: "Sure to delete!!!!!",
            apiUrl: 'vendors/vendors'
          },
          {
            type: 'callBackFn',
            label: 'Edit',
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