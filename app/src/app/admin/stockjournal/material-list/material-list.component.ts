import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss']
})

export class MaterialListComponent  {
  showBomList: boolean;

  showBom(event: any) {
    console.log('Data received from child:', event);
    this.showBomList = true;
  }

  tableConfig: TaTableConfig = {
    showCheckbox:true,
    pkId: "bank_account_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['product','size','color']
    },
    cols: [
      {
        fieldKey: 'product',
        name: 'Finished Product',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.material.product.name;
        },
      },
      {
        fieldKey: 'size',
        name: 'Size',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.material.size?.size_name;
        },
      },
      {
        fieldKey: 'color',
        name: 'Color',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.material.color?.color_name;
        },
      },
    ]
  };
  constructor(private router: Router) {}
}


