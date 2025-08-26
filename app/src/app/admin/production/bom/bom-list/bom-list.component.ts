import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'


@Component({
  selector: 'app-bom-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './bom-list.component.html',
  styleUrls: ['./bom-list.component.scss']
})
export class BomListComponent {
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'production/bom',
    showCheckbox: true,
    pkId: "bom_id",
    // fixedFilters: [
    //   {
    //     key: 'summary',
    //     value: 'true'
    //   }
    // ],
    pageSize: 10,
    "globalSearch": {
      keys: ['created_at','bom','notes','product']
    },
    export: {downloadName: 'BomList'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'bom',
        name: 'BOM Name',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.bom_name}`;
        },
      },
      {
        fieldKey: 'product',
        name: 'Product',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.product.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'notes',
        name: 'Notes',
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
            apiUrl: 'production/bom'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'production/bom'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.bom_id);
              
            }
          }
        ]
      }
    ]
  };

constructor(private router: Router) {}
}