import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-asset-maintenance-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './asset-maintenance-list.component.html',
  styleUrls: ['./asset-maintenance-list.component.scss']
})
export class AssetMaintenanceListComponent {
  
  // baseUrl: string = 'https://apicore.cnlerp.com/api/v1/';
  baseUrl: string = 'http://127.0.0.1:8000/api/v1/';

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: this.baseUrl + 'assets/asset_maintenance/',
    showCheckbox:true,
    pkId: "asset_maintenance_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['asset_id','maintenance_date','asset_id','cost','maintenance_description']
    },
    export: {downloadName: 'AssetMaintenanceList'},
    // defaultSort: { key: 'created_at', value: 'descend' },
    defaultSort: { key: 'is_deleted', value: 'ascend' },
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
        sort: true
      },
      {
        fieldKey: 'maintenance_date',
        name: 'Maintenance Date',
        sort: true
      },
      {
        fieldKey: 'maintenance_description',
        name: 'Maintenance Description',
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
            apiUrl: this.baseUrl + 'assets/asset_maintenance'
          },
          {
            type: 'restore',
            label: 'Restore',
            apiUrl: this.baseUrl + 'assets/asset_maintenance',
            confirm: true,
            confirmMsg: "Sure to restore?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
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
