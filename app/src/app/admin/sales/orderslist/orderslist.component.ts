import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  styleUrls: ['./orderslist.component.scss']
})
export class OrderslistComponent {
  @Input() customerOrders: any[] = [];
  @Output() productsPulled = new EventEmitter<any[]>();   // Output to emit selected products back to the parent component
  @Input() noOrdersMessage: string = '';
  @Output() orderSelected = new EventEmitter<any>();  // Output to emit when an order is selected
  @Output() modalClosed = new EventEmitter<void>();
  
  selectedOrder: any = null;
  selectedProducts: any[] = [];

  constructor(private http: HttpClient) {}

  // Handles product selection using checkboxes
  selectProduct(order: any, product: any, event: any) {
    // If the checkbox is checked, add the product to the selectedProducts array
    if (event.target.checked) {
      this.selectedProducts.push({
        ...product,
        product_name: product.product_name || product.print_name || '', // Ensure the product name is set
      });
    } 
    else {
      // If unchecked, remove the product from the selectedProducts array
      this.selectedProducts = this.selectedProducts.filter(p => p !== product);
    }
    console.log("Selected products:", this.selectedProducts);
    this.selectedOrder = order;
  }

  // Handles the selection of the entire order (when "Select" button is clicked)
  selectOrder(order: any) {
    console.log("Order selected:", order);

    if (order && order.sale_order_id) {
      // Emit the order object to the parent component
      this.orderSelected.emit(order.sale_order_id);
      console.log("Emitted order ID:", order.sale_order_id);
    } else {
      console.warn("Order missing sale order ID:", order);
    }
  }

  

  // Function to pull the selected products from the selected order
  pullOrder() {
    console.log('Attempting to pull order:', this.selectedOrder);
  
    if (this.selectedOrder && this.selectedOrder.sale_order_id) {
      const saleOrderId = this.selectedOrder.sale_order_id;

       // Make an HTTP GET request to fetch the full sale order details
      this.http.get(`sales/sale_order/${saleOrderId}/`).subscribe((response: any) => {
        if (response && response.data && response.data.sale_order_items) {
          const fullProducts = this.selectedProducts.map(selectedProduct => {
            const matchingItem = response.data.sale_order_items.find(
              item => item.product.product_id === selectedProduct.product_id || 
                      item.product.code === selectedProduct.code
            );
  
            return {
              ...matchingItem,  // Merge the matching item details
              product: matchingItem ? matchingItem.product : selectedProduct,
              product_id: matchingItem ? matchingItem.product.product_id : selectedProduct.product_id,
              code: matchingItem ? matchingItem.product.code : selectedProduct.code,
              total_boxes: matchingItem ? matchingItem.total_boxes : selectedProduct.total_boxes,
              unit_options_id: matchingItem ? matchingItem.unit_options.unit_options_id : selectedProduct.unit_options_id,
              quantity: matchingItem ? matchingItem.quantity : selectedProduct.quantity,
              rate: matchingItem ? matchingItem.rate : selectedProduct.rate,
              discount: matchingItem ? matchingItem.discount : selectedProduct.discount,
              print_name: matchingItem ? matchingItem.print_name : selectedProduct.print_name,
              amount: matchingItem ? matchingItem.amount : selectedProduct.amount,
              tax: matchingItem ? matchingItem.tax : selectedProduct.tax,
              remarks: matchingItem ? matchingItem.remarks : selectedProduct.remarks,
              product_name: selectedProduct.product_name || selectedProduct.print_name || '', 
            };
          });
  
          console.log('Filtered Products to Emit:', fullProducts);
          
          // Emit the selected products with full details back to the parent component
          this.productsPulled.emit(fullProducts);
          this.hideModal();
        } else {
          console.error('No sale order items found or invalid response structure.');
        }
      });
    } else {
      console.error('No order selected or sale_order_id is missing.');
    }
  }

  // Closes the modal
  hideModal() {
    this.modalClosed.emit();
  }
}