import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-quickpacks-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './quickpacks-list.component.html',
  styleUrls: ['./quickpacks-list.component.scss']
})
export class QuickpacksListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/quick_pack/',
    showCheckbox: true,
    pkId: "quick_pack_id",
    pageSize: 10,
    globalSearch: {
      keys: ['created_at','name','lot_qty','description','active']
    },
    export: {downloadName: 'QuickpackList'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'name',
        name: 'Quick Pack Name',
        sort: true
      },
      {
        fieldKey: 'lot_qty',
        name: 'Lot Quantity',
        sort: true,
      },
      {
        fieldKey: 'description',
        name: 'Description',
        sort: true
      },
      {
        fieldKey: 'active',
        name: 'Active',
        sort: true,
      },
      {
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            // confirm: true,
            // confirmMsg: "Sure to delete?",
            apiUrl: 'sales/quick_pack'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'sales/quick_pack'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.quick_pack_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}

}
