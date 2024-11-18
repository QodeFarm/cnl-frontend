import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  selector: 'app-sales-dispatch',
  templateUrl: './sales-dispatch.component.html',
  styleUrls: ['./sales-dispatch.component.scss']
})
export class SalesDispatchComponent implements OnInit {
  isLoading = true;
  showModal = false;
  selectedOrder: any = null;
  
  // Initial curdConfig setup
  curdConfig: TaCurdConfig = this.getCurdConfig();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isLoading = false; // Set loading to false once initialized
  }

  // Helper function to initialize curdConfig
  getCurdConfig(): TaCurdConfig {
    return {
      drawerSize: 500,
      drawerPlacement: 'right',
      tableConfig: {
        apiUrl: 'sales/sale_order/?summary=true&flow_status=dispatch',
        title: 'Sales Dispatch',
        pkId: "sale_order_id",
        pageSize: 10,
        globalSearch: {
          keys: ['customer', 'order_no']
        },
        cols: [
          {
            fieldKey: 'customer',
            name: 'Customer',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => `${row.customer.name}`,
          },
          {
            fieldKey: 'order_no',
            name: 'Order No',
            sort: true
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
                label: 'Confirm Dispatch',
                callBackFn: (row: any) => this.openModal(row),
              }
            ]
          }
        ]
      },
      formConfig: {
        url: 'sales/SaleOrder/{saleOrderId}/move_next_stage/',
        title: 'Sales Dispatch Confirmation',
        pkId: "sale_order_id",
        exParams: [],
        fields: [
          {
            key: 'sale_order_id',
            type: 'text',
          },
          {
            key: 'confirmation',
            type: 'select',
            defaultValue: 'yes'
          }
        ]
      }
    };
  }

  // Open modal for dispatch confirmation
  openModal(order: any) {
    this.selectedOrder = order;
    this.showModal = true;
  }

  // Close modal without confirmation
  closeModal() {
    this.showModal = false;
    this.selectedOrder = null;
  }

  // Confirm dispatch and trigger data refresh
  confirmDispatch() {
    if (this.selectedOrder) {
      const saleOrderId = this.selectedOrder.sale_order_id;
      const url = `sales/SaleOrder/${saleOrderId}/move_next_stage/`;

      this.http.post(url, {}).subscribe(
        () => {
          console.log('Dispatch confirmed for order:', saleOrderId);
          this.closeModal(); // Close the modal after confirmation
          this.refreshCurdConfig(); // Refresh the data list in curdConfig
        },
        error => {
          console.error('Error in confirming dispatch:', error);
          alert('Failed to confirm dispatch. Please try again.');
        }
      );
    }
  }

  // Refresh the curdConfig object to reload the data in ta-curd-modal
  refreshCurdConfig() {
    this.curdConfig = this.getCurdConfig(); // Reset the curdConfig with a fresh configuration
  }
}
