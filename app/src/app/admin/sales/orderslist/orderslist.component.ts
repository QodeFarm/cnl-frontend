import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

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
  tempSelectedProducts: any[] = []; // Temporary list for checkbox selections

  @Output() orderSelected = new EventEmitter<any>();
  @Output() productsPulled = new EventEmitter<any[]>();
  @Output() modalClosed = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

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

  constructor(private http: HttpClient) {}

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

 // Checkbox change handler
 onProductCheckboxChange(row: any, product: any, event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;
  // console.log(`Product selected: ${product.product_name}, Quantity: ${product.quantity}`);
  // Log the product and its selected state
  if (isChecked) {
    console.log(`Product selected: ${product.product_name}, Quantity: ${product.quantity}`);
} else {
    console.log(`Product deselected: ${product.product_name}, Quantity: ${product.quantity}`);
}

  if (isChecked) {
    this.getOrderDetails(row.sale_order_id).then(orderData => {
      const saleOrderItems = orderData.sale_order_items || [];
      const selectedItem = saleOrderItems.find(item =>
        item.product.product_id === product.product_id && item.quantity === product.quantity
      );

      if (selectedItem) {
        const fullProductDetails = {
          ...product,
          product_id: selectedItem.product.product_id,
          name: selectedItem.product.name,
          code: selectedItem.product.code,
          discount: selectedItem.discount,
          total_boxes: selectedItem.total_boxes,
          rate: selectedItem.rate,
          tax: selectedItem.tax,
          remarks: selectedItem.remarks,
          amount: selectedItem.amount,
          unit_options_id: selectedItem.unit_options_id,
          quantity: selectedItem.quantity,
          print_name: selectedItem.print_name || 'N/A',
          size: {
            size_id: selectedItem.size_id || null,
            size_name: selectedItem.size?.size_name || null,
          },
          color: {
            color_id: selectedItem.color_id || null,
            color_name: selectedItem.color?.color_name || null,
          },
          sale_order_id: row.sale_order_id, // Ensure the sale_order_id is included for reference
        };

        this.tempSelectedProducts.push(fullProductDetails);
        console.log("full product detailss",fullProductDetails )
      } else {
        console.warn('No matching product found for selection:', product);
      }
    }).catch(error => {
      console.error('Error fetching order details:', error);
    });
  } else {
    // Remove the product from `tempSelectedProducts` when unchecked
    this.tempSelectedProducts = this.tempSelectedProducts.filter(
      item => !(item.product_id === product.product_id && item.sale_order_id === row.sale_order_id)
    );
  }
}


private getOrderDetails(saleOrderId: string): Promise<any> {
  const url = `sales/sale_order/${saleOrderId}/`;
  return this.http.get<any>(url).toPromise().then(res => res.data);
}

// Method to finalize selection when "Pull Selected Orders" is clicked
// Method to finalize selection when "Pull Selected Orders" is clicked
pullSelectedOrders(): void {
  if (this.tempSelectedProducts.length === 0) {
    alert('Please select at least one product to pull.');
    return;
  }

  // Filter out products that are already in selectedProducts
  this.tempSelectedProducts.forEach(product => {
    const isDuplicate = this.selectedProducts.some(selectedProduct =>
      selectedProduct.product_id === product.product_id &&
      selectedProduct.sale_order_id === product.sale_order_id
    );

    // Only add product if it's not already in the selectedProducts list
    if (!isDuplicate) {
      this.selectedProducts.push(product);
    }
  });

  // Emit selected products to parent component
  this.productsPulled.emit(this.selectedProducts);

  // Clear `tempSelectedProducts` and reset all checkboxes
  this.tempSelectedProducts = [];

  // Clear all checkboxes for products in `customerOrders`
  this.customerOrders.forEach(order => {
    order.productsList?.forEach(product => {
      product.checked = false; // Uncheck all products
    });
  });

  // Close the modal after pulling products
  this.modalClosed.emit();
}


closeModal() {
  console.log('Close button clicked in OrderslistComponent'); // Log for debugging
  this.modalClosed.emit(); // Emit the close event to the parent component
}

  
}