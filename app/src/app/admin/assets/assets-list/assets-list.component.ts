import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-assets-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent {
  
  baseUrl: string = 'https://apicore.cnlerp.com/api/v1/';

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: this.baseUrl + 'assets/assets/',
    showCheckbox:true,
    pkId: "asset_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['purchase_date','name','price','asset_category_id','unit_options_id','location_id','asset_status_id']
    },
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true
      },
      {
          fieldKey: 'price', 
          name: 'Price',
          sort: true
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
        sort: true,
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













