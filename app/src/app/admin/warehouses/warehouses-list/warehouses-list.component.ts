import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouses-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './warehouses-list.component.html',
  styleUrls: ['./warehouses-list.component.scss']
})
export class WarehousesListComponent {
  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'inventory/warehouses/',
    showCheckbox:true,
    pkId: "warehouse_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['warehouse_id']
    },
    cols: [
      {
        fieldKey: 'name',
        name: 'Name',
        sort: true
      },
      {
        fieldKey: 'code',
        name: 'Code',
        sort: true
      },
      {
        fieldKey: 'phone', 
        name: 'Phone',
        sort: false
      },
      {
        fieldKey: 'city_id',
        name: 'City',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.city.city_name}`;
        },
      },
      {
        fieldKey: 'state_id',
        name: 'State',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.state.state_name}`;
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
            apiUrl: 'inventory/warehouses'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.warehouse_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}
