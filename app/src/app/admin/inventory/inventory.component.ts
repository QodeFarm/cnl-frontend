import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent {
  
  selectedTabKey: string | null = null;
  curdConfig: TaCurdConfig | null = null;
  loading: boolean = false;
  error: string | null = null;

   ngOnInit() {
    // Load default tab on page load
    this.switchTab('inventory');
  }

  inventoryConfigs: { [key: string]: TaCurdConfig } = {

    inventory: {
      drawerSize: 500,
      drawerPlacement: 'right',
      hideAddBtn: true,
      tableConfig: {
        apiUrl: 'products/products/?view=inventory',
        // title: 'Inventory',
        pkId: "product_id",
        pageSize: 10,
        globalSearch: {
          keys: ['name', 'code', 'stock_unit', 'mrp', 'purchase_rate', 'sales_rate', 'wholesale_rate', 'dealer_rate', 'balance', 'updated_at']
        },
        export: { downloadName: 'Inventory' },
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
            fieldKey: 'product_group', 
            name: 'Group', 
            sort: true,
            displayType: "map", 
            mapFn: (v, row) => row?.product_group?.group_name || ''
          },
          { 
            fieldKey: 'category', 
            name: 'Category', 
            sort: true,
            displayType: "map", 
            mapFn: (v, row) => row?.category?.category_name || ''
          },
          { 
            fieldKey: 'type', 
            name: 'Type', 
            sort: true,
            displayType: "map", 
            mapFn: (v, row) => row?.type?.type_name || ''
          },
          { 
            fieldKey: 'stock_unit', 
            name: 'Unit', 
            sort: true,
            displayType: "map", 
            mapFn: (v, row) => row?.stock_unit?.stock_unit_name || ''
          },
          { 
            fieldKey: 'mrp', 
            name: 'MRP', 
            sort: true 
          },
          { 
            fieldKey: 'purchase_rate', 
            name: 'Purchase Rate', 
            sort: true 
          },
          { 
            fieldKey: 'sales_rate', 
            name: 'Sales Rate', 
            sort: true 
          },
          { 
            fieldKey: 'wholesale_rate', 
            name: 'Wholesale Rate', 
            sort: true 
          },
          { 
            fieldKey: 'dealer_rate', 
            name: 'Dealer Rate', 
            sort: true 
          },
          { 
            fieldKey: 'balance', 
            name: 'Balance', 
            sort: true 
          },
          { 
            fieldKey: 'updated_at', 
            name: 'Last Updated', 
            sort: true,
            displayType: "map", mapFn: (v, row) => row.updated_at.split('T')[0] 
          }
        ]
      },
      formConfig: {
        url: 'products/products/',
        title: 'Inventory',
        pkId: "product_id",
        exParams: [
          { key: 'product_group_id', type: 'script', value: 'data.product_group.product_group_id' },
          { key: 'stock_unit_id', type: 'script', value: 'data.stock_unit.stock_unit_id' }
        ],
        fields: []
      }
    },

    nonInventory: {
      drawerSize: 500,
      drawerPlacement: 'right',
      hideAddBtn: true,
      tableConfig: {
        apiUrl: 'products/products/?view=non-inventory',
        // title: 'Non Inventory',
        pkId: "product_id",
        pageSize: 10,
        globalSearch: {
          keys: ['name','code','category','barcode']
        },
        export: { downloadName: 'NonInventory' },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          { fieldKey: 'name', 
            name: 'Name', 
            sort: true
        },
          { fieldKey: 'code',
            name: 'Code',
            sort: true
          },
          { 
            fieldKey: 'category', 
            name: 'Category', sort: true,
            displayType: "map", 
            mapFn: (v, row) => row.category.category_name 
          },
        ]
      },
      formConfig: {
        url: 'products/products/',
        title: 'Non Inventory',
        pkId: "product_id",
        fields: []
      }
    },

    services: {
      drawerSize: 500,
      drawerPlacement: 'right',
      hideAddBtn: true,
      tableConfig: {
        apiUrl: 'products/products/?view=service',
        // title: 'Services',
        pkId: "product_id",
        pageSize: 10,
        globalSearch: {
          keys: ['name','code','category']
        },
        export: { downloadName: 'Services' },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          { fieldKey: 'name', name: 'Name', sort: true },
          { fieldKey: 'code', name: 'Code', sort: true }
        ]
      },
      formConfig: {
        url: 'products/products/',
        title: 'Services',
        pkId: "product_id",
        fields: []
      }
    }

  };

  switchTab(tabKey: string) {
    this.loading = true;
    this.error = null;
    this.selectedTabKey = null;
    this.curdConfig = null;

    if (tabKey) {
      this.selectedTabKey = tabKey;
      this.curdConfig = this.inventoryConfigs[tabKey];
    }

    setTimeout(() => {
      this.loading = false;
    }, 0);
  }
}
