import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assets-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent {
  
  baseUrl: string = 'http://195.35.20.172:8000/api/v1/';

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: this.baseUrl + 'assets/assets/',
    showCheckbox:true,
    pkId: "asset_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['name','price','asset_category_id','unit_options_id','purchase_date','location_id','asset_status_id']
    },
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true
      },
      {
          fieldKey: 'price', 
          name: 'Price',
          sort: false
      },
      {
        fieldKey: 'asset_category_id',
        name: 'Category',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.asset_category.category_name}`;
        },
      },
      {
        fieldKey: 'unit_options_id',
        name: 'Unit Options',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.unit_options.unit_name}`;
        },
      },
      {
        fieldKey: 'purchase_date', 
        name: 'Purchase Date',
        sort: false,
        displayType: "date"
      },
      {
        fieldKey: 'location_id',
        name: 'Location',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.location.location_name}`;
        },
      },
      {
        fieldKey: 'asset_status_id',
        name: 'Status',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.asset_status.status_name}`;
        },
      },
      {
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            apiUrl: this.baseUrl + 'assets/assets'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.asset_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}













