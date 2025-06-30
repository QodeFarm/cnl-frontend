import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

@Component({
  selector: 'app-saleinvoiceorderlist',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './saleinvoiceorderlist.component.html',
  styleUrls: ['./saleinvoiceorderlist.component.scss']
})
export class SaleinvoiceorderlistComponent {
  @Input() customerOrders: any[] = [];
  @Output() orderSelected = new EventEmitter<any>();
  @Output() productsPulled = new EventEmitter<any[]>();
  @Input() noOrdersMessage: string = '';
  @Output() modalClosed = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };
  
  selectedOrder: any = null;
  selectedProducts: any[] = [];

  constructor(private http: HttpClient) {}

  selectProduct(order: any, product: any, event: any) {
    if (event.target.checked) {
      this.selectedProducts.push(product);
    } 
    else {
      this.selectedProducts = this.selectedProducts.filter(p => p !== product);
    }
    console.log("Selected products:", this.selectedProducts);
    this.selectedOrder = order;
  }  

  selectInvoiceOrder(order: any) {
    if (order && order.sale_invoice_id) {
      this.orderSelected.emit(order);
      console.log("Navigating to edit with sale_invoice_id:", order.sale_invoice_id);
    } else {
      console.warn("Order missing sale_invoice_id:", order);
    }
  }

  hideModal() {
    this.modalClosed.emit();
  }
  pullSelectedProducts() {
    if (this.selectedProducts.length > 0) {
      this.productsPulled.emit(this.selectedProducts.map(product => ({
        product_id: product.product_id || null,
        name: product.product_name || '',
        code: product.code || '',
        total_boxes: product.total_boxes,
        unit_options_id: product.unit_options_id,
        discount: product.discount || 0,
        quantity: product.quantity || 0,
        rate: product.rate || 0,
        amount: product.amount || 0,
        tax: product.tax || 0,
        cgst: product.cgst || 0,
        sgst: product.sgst || 0,
        igst: product.igst || 0,
        remarks: product.remarks || '',
        // Add other required fields
      })));
    } else if (this.selectedOrder) {
      this.productsPulled.emit(this.selectedOrder.productsList.map(product => ({
        product_id: product.product_id || null,
        name: product.product_name || '',
        code: product.code || '',
        total_boxes: product.total_boxes,
        unit_options_id: product.unit_options_id,
        discount: product.discount || 0,
        quantity: product.quantity || 0,
        rate: product.rate || 0,
        amount: product.amount || 0,
        tax: product.tax || 0,
        cgst: product.cgst || 0,
        sgst: product.sgst || 0,
        igst: product.igst || 0,
        remarks: product.remarks || '',
        // Add other required fields
      })));
    }
  }
 
}
