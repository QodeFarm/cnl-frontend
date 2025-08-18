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
      keys: ['created_at', 'name', 'code', 'unit_options', 'balance', 'sales_rate', 'mrp', 'dis_amount', 'print_name', 'hsn_code', 'barcode']
    },
    export: { downloadName: 'ProductsList' },
    defaultSort: { key: 'code', value: 'descend' },
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
        fieldKey: 'type',
        name: 'Type',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row?.type?.type_name || '';
        },
      },
      {
        fieldKey: 'product_group',
        name: 'Group',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row?.product_group?.group_name || '';
        },
      },
      // {
      //   fieldKey: 'unit_options',
      //   name: 'Unit',
      //   sort: true,
      //   displayType: 'map',
      //   mapFn: (currentValue: any, row: any, col: any) => {
      //     return row?.unit_options?.unit_name;
      //   },
      // },
      {
        fieldKey: 'stock_unit',
        name: 'Stock Unit',
        sort: true,
        displayType: 'map',
        mapFn: (currentValue: any, row: any, col: any) => {
          return row?.stock_unit?.stock_unit_name || '';
        },
      },

      {
        fieldKey: 'sales_rate',
        name: 'Sales Rate',
        sort: true,
        isEdit: true,
        isEditSumbmit: (row, value, col) => {
          console.log("isEditSumbmit", row, value, col);
          // Implement your logic here
          // For example, you can make an API call to save the edited value
          // this.http.put(`api/sales/${row.sale_order_id}`, { total_amount: value }).subscribe(...);
        },
        autoSave: {
          apiUrl: row => `products/products/${row.product_id}`,
          method: 'patch',
          body: (row: any, value: any, col: any) => {
            console.log('PATCH value:', value); // Add this log
            return {
              [col.fieldKey]: value,
              product_id: row.product_id
            };
          }

        }
      },
      {
        fieldKey: 'wholesale_rate',
        name: 'WholeSale Rate',
        sort: true,
        isEdit: true,
        isEditSumbmit: (row, value, col) => {
          console.log("isEditSumbmit", row, value, col);
          // Implement your logic here
        },
        autoSave: {
          apiUrl: row => `products/products/${row.product_id}`,
          method: 'patch',
          body: (row: any, value: any, col: any) => {
            console.log('PATCH value:', value); // Add this log
            return {
              [col.fieldKey]: value,
              product_id: row.product_id
            };
          }
        }

      },
      {
        fieldKey: 'dealer_rate',
        name: 'Dealer Rate',
        sort: true,
        isEdit: true,
        isEditSumbmit: (row, value, col) => {
          console.log("isEditSumbmit", row, value, col);
          // Implement your logic here
        },
        autoSave: {
          apiUrl: row => `products/products/${row.product_id}`,
          method: 'patch',
          body: (row: any, value: any, col: any) => {
            console.log('PATCH value:', value); // Add this log
            return {
              [col.fieldKey]: value,
              product_id: row.product_id
            };
          }
        }
      },
      {
        fieldKey: 'discount',
        name: 'Disc(%)',
        sort: true
      },
      {
        fieldKey: 'balance',
        name: 'Balance',
        sort: true,
        isEdit: true,
        isEditSumbmit: (row, value, col) => {
          console.log("isEditSumbmit", row, value, col);
          // Implement your logic here
        },
        autoSave: {
          apiUrl: row => `products/products/${row.product_id}`,
          method: 'patch',
          body: (row: any, value: any, col: any) => {
            console.log('PATCH value:', value); // Add this log
            return {
              [col.fieldKey]: value,
              product_id: row.product_id
            };
          }
        }
      },
      // {
      //   fieldKey: 'print_name',
      //   name: 'Print Name',
      //   sort: true
      // },
      // {
      //   fieldKey: 'hsn_code',
      //   name: 'HSN',
      //   sort: true
      // },
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
  constructor(private router: Router, private http: HttpClient) { }

}
