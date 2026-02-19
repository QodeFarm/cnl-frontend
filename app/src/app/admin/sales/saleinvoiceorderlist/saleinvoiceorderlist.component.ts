import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { TaTableConfig } from '@ta/ta-table';

@Component({
  selector: 'app-saleinvoiceorderlist',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './saleinvoiceorderlist.component.html',
  styleUrls: ['./saleinvoiceorderlist.component.scss']
})
export class SaleinvoiceorderlistComponent implements OnChanges{
  @Output() orderSelected = new EventEmitter<any>();
  @Input() customerOrders: any[] = [];
  @Input() selectedCustomerId: string | null = null;
  @Input() noOrdersMessage: string = '';

  selectedProducts: any[] = [];
  tempSelectedProducts: any[] = [];

  @Output() productsPulled = new EventEmitter<any[]>();
  @Output() modalClosed = new EventEmitter<void>();

  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  constructor(private http: HttpClient) {}

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_order/?summary=true',
    showCheckbox: true,
    pkId: 'sale_order_id',
    pageSize: 10,
    globalSearch: {
      keys: [
        'order_date',
        'order_no',
        // 'sale_type',
        'customer',
        'amount',
        'tax',
        'advance_amount',
        'status_name'
      ]
    },
    cols: [
      // {
      //   fieldKey: 'sale_type',
      //   name: 'Sale Type',
      //   displayType: 'map',
      //   mapFn: (_: any, row: any) => row.sale_type?.name
      // },
      {
        fieldKey: 'order_no',
        name: 'Order No'
      },
      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: 'map',
        mapFn: (_: any, row: any) => row.customer?.name
      },
      {
        fieldKey: 'order_date',
        name: 'Order Date',
        displayType: 'date'
      },
      {
        fieldKey: 'products',
        name: 'Products',
        displayType: 'map',
        mapFn: (_: any, row: any) => {
          if (row.products && typeof row.products === 'object') {
            return Object.values(row.products)
              .map((p: any) => `${p.product_name} (Qty: ${p.quantity})`)
              .join(', ');
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

  selectOrder(order: any) {
    this.orderSelected.emit(order);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCustomerId && this.selectedCustomerId) {
      this.updateTableConfig();
    }
  }

  updateTableConfig() {
    this.tableConfig = {
      ...this.tableConfig,
      apiUrl: `sales/sale_order/?summary=true&status_name=Pending&customer_id=${this.selectedCustomerId}`
    };

    setTimeout(() => {
      this.taTableComponent?.refresh();
    });
  }

  // 🔁 EXACT SAME PRODUCT SELECTION LOGIC (reused)
  onProductCheckboxChange(row: any, product: any, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.getOrderDetails(row.sale_order_id).then(orderData => {
        const saleOrderItems = orderData.sale_order_items || [];

        const selectedItem = saleOrderItems.find(item =>
          item.product.product_id === product.product_id &&
          item.quantity === product.quantity
        );

        if (selectedItem) {
          this.tempSelectedProducts.push({
            ...product,
            product_id: selectedItem.product.product_id,
            name: selectedItem.product.name,
            code: selectedItem.product.code,
            discount: selectedItem.discount,
            total_boxes: selectedItem.total_boxes,
            rate: selectedItem.rate,
            tax: selectedItem.tax,
            amount: selectedItem.amount,
            unit_options_id: selectedItem.unit_options_id,
            quantity: selectedItem.quantity,
            cgst: selectedItem.cgst,
            sgst: selectedItem.sgst,
            igst: selectedItem.igst,
            remarks: selectedItem.remarks,
            sale_order_id: row.sale_order_id
          });
        }
      });
    } else {
      this.tempSelectedProducts = this.tempSelectedProducts.filter(
        p => !(p.product_id === product.product_id && p.sale_order_id === row.sale_order_id)
      );
    }
  }

  private getOrderDetails(saleOrderId: string): Promise<any> {
    return this.http
      .get<any>(`sales/sale_order/${saleOrderId}/`)
      .toPromise()
      .then(res => res.data);
  }

  pullSelectedOrders(): void {
    if (this.tempSelectedProducts.length === 0) {
      alert('Please select at least one product.');
      return;
    }

    this.tempSelectedProducts.forEach(product => {
      const exists = this.selectedProducts.some(
        p => p.product_id === product.product_id && p.sale_order_id === product.sale_order_id
      );

      if (!exists) {
        this.selectedProducts.push(product);
      }
    });

    this.productsPulled.emit(this.selectedProducts);

    // reset
    this.tempSelectedProducts = [];
    this.customerOrders.forEach(order => {
      order.products?.forEach((p: any) => (p.checked = false));
    });

    this.modalClosed.emit();
  }

  closeModal() {
    this.modalClosed.emit();
  }
}