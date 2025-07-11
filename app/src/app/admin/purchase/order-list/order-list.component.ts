import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TaTableComponent, TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnChanges {
  @Input() vendorOrders: any[] = [];
  @Input() selectedVendorId: string | null = null;
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
    apiUrl: 'purchase/purchase_order/?summary=true',
    showCheckbox: true,
    pkId: 'purchase_order_id',
    pageSize: 10,
    globalSearch: {
      keys: ['order_date', 'order_no']
    },
    cols: [
      {
        fieldKey: 'purchase_type',
        name: 'Purchase Type',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => `${row.purchase_type.name}`,
      },
      {
        fieldKey: 'vendor',
        name: 'Vendor',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => `${row.vendor.name}`,
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
    if (changes.selectedVendorId && this.selectedVendorId) {
      this.updateTableConfig();
    }
  }

  constructor(private http: HttpClient) {}

  updateTableConfig() {
    this.tableConfig = {
      ...this.tableConfig,
      apiUrl: `purchase/purchase_order/?summary=true&vendor_id=${this.selectedVendorId}`,
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
    this.getOrderDetails(row.purchase_order_id).then(orderData => {
      const purchaseOrderItems = orderData.purchase_order_items || [];
      const selectedItem = purchaseOrderItems.find(item =>
        item.product.product_id === product.product_id &&
        parseFloat(item.quantity) === parseFloat(product.quantity)
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
          cgst: selectedItem.cgst,
          sgst: selectedItem.sgst,
          igst: selectedItem.igst,
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
          purchase_order_id: row.purchase_order_id, // Ensure the purchase_order_id is included for reference
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
      item => !(item.product_id === product.product_id && item.purchase_order_id === row.purchase_order_id)
    );
  }
}


private getOrderDetails(purchaseOrderId: string): Promise<any> {
  const url = `purchase/purchase_order/${purchaseOrderId}/`;
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
      selectedProduct.purchase_order_id === product.purchase_order_id
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

  // Clear all checkboxes for products in `vendorOrders`
  this.vendorOrders.forEach(order => {
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
