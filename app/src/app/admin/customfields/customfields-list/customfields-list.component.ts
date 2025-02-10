import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';

@Component({
  selector: 'app-customfields-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './customfields-list.component.html',
  styleUrls: ['./customfields-list.component.scss']
})
export class CustomfieldsListComponent {

  @Output('edit') edit = new EventEmitter<void>(); // Emit custom field id for editing

  // Configuration for TaTable
  tableConfig: TaTableConfig = {
    apiUrl: 'customfields/customfieldscreate/', // API endpoint to fetch custom fields
    showCheckbox: true,
    pkId: 'custom_field_id', // Primary key identifier
    pageSize: 10,
    globalSearch: {
      keys: ['field_name', 'entity_id','field_type_id','is_required']
    },
    cols: [
      {
        fieldKey: 'field_name',
        name: 'Field Name',
        sort: true
      },
      {
        fieldKey: 'entity_id',
        name: 'Entity Name',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.entity.entity_name}`;
        },
        sort: true 
      },
      {
        fieldKey: 'field_type_id',
        name: 'Field Type',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.field_type.field_type_name}`;
        },
        sort: true 
      },
      {
        fieldKey: 'is_required',
        name: 'Is Required',
        displayType: 'boolean',
        sort: true
      },
      {
        fieldKey: 'actions',
        name: 'Actions',
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            apiUrl: 'customfields/customfieldscreate' // The endpoint for deleting a custom field
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              this.edit.emit(row.custom_field_id); // Emit the custom field ID for editing
            }
          }
        ]
      }
    ]
  };

  constructor() {}
}
