import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  styleUrls: ['./orderslist.component.scss']
})
export class OrderslistComponent implements OnChanges {
  @Input() customerOrders: any[] = [];
  @Input() selectedCustomerId: string | null = null;
  @Input() noOrdersMessage: string = '';
  selectedProducts: any[] = []; // Local selectedProducts array

  @Output() orderSelected = new EventEmitter<any>();
  @Output() productsPulled = new EventEmitter<any[]>();
  @Output() modalClosed = new EventEmitter<void>();

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_order/?summary=true',
    showCheckbox: true,
    pkId: 'sale_order_id',
    pageSize: 10,
    globalSearch: {
      keys: ['order_date', 'order_no', 'sale_type', 'customer', 'amount', 'tax', 'advance_amount', 'status_name', 'flow_status']
    },
    cols: [
      {
        fieldKey: 'sale_type',
        name: 'Sale Type',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => `${row.sale_type.name}`,
      },
      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => `${row.customer.name}`,
      },
      {
        fieldKey: 'order_no',
        name: 'Order No',
      },
      {
        fieldKey: 'order_date',
        name: 'Order Date',
        displayType: 'date',
      },
      {
        fieldKey: 'products',
        name: 'Products',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => {
          if (row.products && typeof row.products === 'object') {
            return Object.values(row.products).map((product: any) => `${product.product_name} (Qty: ${product.quantity})`).join(', ');
          }
          return 'No products';
        }
      },
      {
        fieldKey: 'actions',
        name: 'Actions',
        type: 'action',
        actions: [
          {
            type: 'callBackFn',
            label: 'Select',
            callBackFn: (row: any) => this.selectOrder(row),
          }
        ]
      }
    ]
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCustomerId && this.selectedCustomerId) {
      this.updateTableConfig();
    }
  }

  updateTableConfig() {
    this.tableConfig = {
      ...this.tableConfig,
      apiUrl: `sales/sale_order/?summary=true&customer_id=${this.selectedCustomerId}`,
    };
  }

  selectOrder(order: any) {
    this.orderSelected.emit(order);
  }

  handleSelectedProductsChange(updatedProducts: any[]): void {
    this.selectedProducts = updatedProducts;
    console.log('Updated selectedProducts in OrderslistComponent:', this.selectedProducts); // Log for debugging
  }

  // pullSelectedOrders(): void {
  //   if (this.selectedProducts.length === 0) {
  //     alert('Please select at least one product to pull.');
  //     return;
  //   }
  
  //   console.log('Pulled selected products in OrderslistComponent:', this.selectedProducts); // Log for debugging
  
  //   // Emit selected products to SalesComponent
  //   this.productsPulled.emit([...this.selectedProducts]);  // Ensure we’re emitting a copy to prevent reference issues
    
  //   // Close modal after pulling products
  //   this.closeModal.emit();
  // }

  pullSelectedOrders(): void {
    if (this.selectedProducts.length === 0) {
        alert('Please select at least one product to pull.');
        return;
    }

    // Emit a copy of selected products with full details to ensure data integrity
    this.productsPulled.emit([...this.selectedProducts]);
    
    // Close modal after pulling products
    this.modalClosed.emit();
}

  
}