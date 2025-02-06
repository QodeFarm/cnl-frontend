import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { MaterialListComponent } from './material-list/material-list.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule,AdminCommmonModule, MaterialListComponent],
  selector: 'app-stockjournal',
  templateUrl: './stockjournal.component.html',
  styleUrls: ['./stockjournal.component.scss']
})

export class StockjournalComponent implements OnInit {
  showBomList: boolean = false;
  materialId: any;
  showForm: boolean = false;

  ngOnInit(): void {
    this.showBomList = false
    this.curdConfig.tableConfig.showCheckbox = true
  }

  hide() {
    document.getElementById('modalClose').click();
  };
  
  constructor(private http: HttpClient) {}

  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: 'production/work_order/?stock_journal=true',
      title: 'Inventory',
      pkId: "product_id",
      pageSize: 10,
      "globalSearch": {
        keys: ['id', 'name']
      },
      cols: [
        {
          fieldKey: 'finished_product',
          name: 'Finished Product',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.product.name;
          },
        },
        {
          fieldKey: 'size',
          name: 'Size',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.size?.size_name;
          },
        },
        {
          fieldKey: 'color',
          name: 'Color',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.color?.color_name;
          },
        },
        {
          fieldKey: 'status',
          name: 'Status',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.status.status_name;
          },
        },
        {
          fieldKey: 'bom_name',
          name: 'Bom Name',
          sort: true
        },            
        {
          fieldKey: 'material',
          name: 'Bill Of Materials',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            if (row.material && typeof row.material === 'object') {
              return Object.values(row.material).map((product: any) => `
              ${product.product.name} (Qty: ${product.quantity})
              <ul>
                <li>Color : ${product.color?.color_name || ''}</li>
                <li>Size : ${product.size?.size_name || ''}</li>
              </ul>
              `
            ).join('<br>');
            }
            return 'No products';
          },
        }
      ]
    },
    formConfig: undefined,
  }
}  
