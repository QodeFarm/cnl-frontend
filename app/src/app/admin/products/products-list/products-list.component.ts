import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent {
  
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  tableConfig: TaTableConfig = {
    apiUrl: 'products/products/?summary=true',
    showCheckbox: true,
    title: 'Products',
    pkId: "product_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    globalSearch: {
      keys: ['created_at','name','code','unit_options','balance','sales_rate','mrp','dis_amount','print_name','hsn_code','barcode']
    },
    export: {downloadName: 'ProductsList'},
    defaultSort: { key: 'created_at', value: 'descend' },
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
        fieldKey: 'unit_options',
        name: 'Unit',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row?.unit_options?.unit_name;
        },
      },
      {
        fieldKey: 'sales_rate',
        name: 'Sales Rate',
        sort: true
      },
      {
        fieldKey: 'wholesale_rate',
        name: 'WholeSale Rate',
        sort: true
      },
      {
        fieldKey: 'dealer_rate',
        name: 'Dealer Rate',
        sort: true
      },
      // {
      //   fieldKey: 'wholesale_rate',
      //   name: 'Wholesale',
      //   sort: false
      // },
      // {
      //   fieldKey: 'dealer_rate',
      //   name: 'Dealer',
      //   sort: false
      // },
      // {
      //   fieldKey: 'mrp',
      //   name: 'MRP',
      //   sort: true
      // },
      {
        fieldKey: 'discount',
        name: 'Disc(%)',
        sort: true
      },
      {
        fieldKey: 'balance',
        name: 'Balance',
        sort: true
      },
      // {
      //   fieldKey: 'print_name',
      //   name: 'Print Name',
      //   sort: true
      // },
      {
        fieldKey: 'hsn_code',
        name: 'HSN',
        sort: true
      },
      // {
      //   fieldKey: 'barcode',
      //   name: 'Barcode',
      //   sort: true
      // },
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
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
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
