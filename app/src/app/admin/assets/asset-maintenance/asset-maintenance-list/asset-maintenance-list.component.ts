import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-maintenance-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './asset-maintenance-list.component.html',
  styleUrls: ['./asset-maintenance-list.component.scss']
})
export class AssetMaintenanceListComponent {
  
  baseUrl: string = 'http://195.35.20.172:8000/api/v1/';

  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: this.baseUrl + 'assets/asset_maintenance/',
    showCheckbox:true,
    pkId: "asset_maintenance_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['asset_id','cost','maintenance_date','maintenance_description']
    },
    cols: [
      {
        fieldKey: 'asset_id',
        name: 'Asset',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.asset.name}`;
        },
      },
      {
        fieldKey: 'cost', 
        name: 'Cost',
        sort: false
      },
      {
        fieldKey: 'maintenance_date',
        name: 'Maintenance Date',
        sort: false
      },
      {
        fieldKey: 'maintenance_description',
        name: 'Maintenance Description',
        sort: false
      },
      {
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            apiUrl: this.baseUrl + 'assets/asset_maintenance'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.asset_maintenance_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}
}
