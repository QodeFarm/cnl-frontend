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
  @Input() noOrdersMessage: string = '';

  // @Output() productsPulled = new EventEmitter<any[]>();
  @Output() modalClosed = new EventEmitter<void>();
  @Output() orderSelected = new EventEmitter<any>();

  selectedProducts: any[] = [];

  constructor(private http: HttpClient) {}

  // ✅ ADD: watch input data
  ngOnChanges() {
    if (this.customerOrders?.length) {
      this.loadPendingQty();
      this.loadAvailableQty();
    }
  }

  // ✅ ADD: loop and fetch balance
  loadAvailableQty() {
    this.customerOrders.forEach(order => {
      order.productsList?.forEach(product => {
        product.available_qty = 0; // default
        this.fetchAvailableQty(product);
      });
    });
  }

  // ✅ ADD: fetch product balance
  fetchAvailableQty(product: any) {
    if (!product?.product_id) return;

    this.http
      .get<any>(`products/products/${product.product_id}/`)
      .subscribe(res => {
        // console.log(`Fetched balance for product :`, res);
        // console.log(`res?.data?.products.balance :`, res?.data?.products.balance);
        product.available_qty = res?.data?.products.balance ?? 0;
      });
  }

  // checkbox toggle
  toggleProduct(product: any, event: any) {
    product.selected = event.target.checked;

    if (product.selected) {
      product.dispatch_qty = product.dispatch_qty || 0;
    }
  }

  validateDispatchQty(product: any) {
    const maxQty = Math.min(
      product.pending_qty,
      product.available_qty
    );

    if (product.dispatch_qty > maxQty) {
      product.dispatch_qty = maxQty;
    }

    if (product.dispatch_qty < 0) {
      product.dispatch_qty = 0;
    }
  }


selectOrder(order: any) {
  console.log('Order clicked in child:', order);
  this.orderSelected.emit(order);
  // this.modalClosed.emit();
}



  pullSelectedProducts() {
  const pulledProducts: any[] = [];

  this.customerOrders.forEach(order => {
    order.productsList?.forEach(product => {

      if (!product.selected || product.dispatch_qty <= 0) {
        return;
      }

      pulledProducts.push({
        product: {
          product_id: product.product_id,
          name: product.product_name,
          code: product.code
        },

        product_id: product.product_id,
        code: product.code,

        quantity: product.dispatch_qty,
        rate: product.rate,
        discount: product.discount || 0,
        amount: product.dispatch_qty * product.rate,

        tax: product.tax || 0,
        cgst: product.cgst || 0,
        sgst: product.sgst || 0,
        igst: product.igst || 0,

        unit_options_id: product.unit_options_id || null,
        total_boxes: product.total_boxes || 0,

        size: {
          size_id: product.size?.size_id || null,
          size_name: product.size?.size_name || 'Unspecified'
        },

        color: {
          color_id: product.color?.color_id || null,
          color_name: product.color?.color_name || 'Unspecified'
        },

        remarks: product.remarks || '',
        print_name: product.print_name || product.product_name || ''
      });
    });
  });

  if (!pulledProducts.length) {
    alert('Please select products with dispatch quantity');
    return;
  }

  // 🔥 SAME EVENT AS ORDERLIST
  // this.productsPulled.emit(pulledProducts);
  this.modalClosed.emit();
}


  closeModal() {
    this.modalClosed.emit();
  }

  loadPendingQty() {
  this.http.get<any[]>('sales/pending/').subscribe(res => {
    if (!Array.isArray(res)) return;

    // Build lookup: sale_order_id + product_id + unit_options_id
    const pendingMap = new Map<string, number>();

    res.forEach(order => {
      order.pending_items?.forEach(item => {
        console.log(`Processing pending item for order ${order.sale_order_id}:`, item);
        const key = `${order.sale_order_id}_${item.product_id}_${item.unit_options_id}`;
        pendingMap.set(key, item.pending_qty);
      });
    });

    // Inject pending_qty into existing list
    this.customerOrders.forEach(order => {
      order.productsList?.forEach(product => {
        const key = `${order.sale_order_id}_${product.product_id}_${product.unit_options_id}`;
        product.pending_qty = pendingMap.get(key) ?? 0;
        console.log(`Set pending_qty for product ${product.product_id} in order ${order.sale_order_id}:`, product.pending_qty);
      });
    });
  });
}


  
}