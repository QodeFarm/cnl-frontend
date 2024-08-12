import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent {
  
  @Output('edit') edit = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'products/products/',
    showCheckbox: true,
    title: 'Products',
    pkId: "product_id",
    pageSize: 10,
    globalSearch: {
      keys: ['product_id', 'name']
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
        sort: false
      },
      {
        fieldKey: 'unit_options',
        name: 'Unit',
        sort: false,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.unit_options.unit_name;
        },
      },
      {
        fieldKey: 'sales_rate',
        name: 'Sale Rate',
        sort: false
      },
      {
        fieldKey: 'wholesale_rate',
        name: 'Wholesale',
        sort: false
      },
      {
        fieldKey: 'dealer_rate',
        name: 'Dealer',
        sort: false
      },
      {
        fieldKey: 'mrp',
        name: 'MRP',
        sort: false
      },
      {
        fieldKey: 'dis_amount',
        name: 'Disc',
        sort: false
      },
      {
        fieldKey: 'product_balance',
        name: 'Bal',
        sort: false
      },
      {
        fieldKey: 'print_name',
        name: 'Print Name',
        sort: true
      },
      {
        fieldKey: 'hsn_code',
        name: 'HSN',
        sort: false
      },
      {
        fieldKey: 'barcode',
        name: 'Barcode',
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
            confirm: true,
            confirmMsg: "Sure to delete?",
            apiUrl: 'products/products'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.product_id);
            }
          }
        ]
      }
    ]
  };
  constructor(private router: Router, private http: HttpClient) {}

}
