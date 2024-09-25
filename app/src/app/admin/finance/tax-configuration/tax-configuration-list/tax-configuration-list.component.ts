import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { Component, EventEmitter, Output } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  selector: 'app-tax-configuration-list',
  templateUrl: './tax-configuration-list.component.html',
  styleUrls: ['./tax-configuration-list.component.scss']
})
export class TaxConfigurationListComponent {
  @Output('edit') edit = new EventEmitter<void>();
  tableConfig: TaTableConfig = {
    apiUrl: 'finance/tax_configurations/',
    showCheckbox:true,
    pkId: "tax_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['tax_name','tax_rate','tax_type','is_active']
    },
    cols: [
      {
        fieldKey: 'tax_name',
        name: 'Tax Name',
        sort: true
      },
      {
        fieldKey: 'tax_rate',
        name: 'Tax Rate',
        sort: true
      },
      {
        fieldKey: 'tax_type', 
        name: 'Tax Type',
        sort: true
      },
      {
        fieldKey: 'is_active', 
        name: 'Is Active',
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
            apiUrl: 'finance/tax_configurations',
            confirm: true,
            confirmMsg: "Sure to delete?",
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.tax_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router) {}
}
