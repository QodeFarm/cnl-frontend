import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@ta/ta-core';

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

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    this.curdConfig = this.getCurdConfig();
  }

  ngOnInit() {
    this.isLoading = true; // Set loading to false once initialized
    this.getCurdConfig()
  }

  // Helper function to initialize curdConfig
  getCurdConfig(): TaCurdConfig {
    const user = this.localStorage.getItem('user');
    const isSuperUser = user?.is_sp_user === true;
    const apiUrl = isSuperUser
      ? 'sales/sale_order/?records_all=true&flow_status_name=dispatch'
      : 'sales/sale_order/?summary=true&flow_status_name=dispatch';

      const fixedFilters = isSuperUser
      ? [{ key: 'records_all', value: 'true' }, { key: 'flow_status_name', value: 'dispatch' }]
      : [{ key: 'summary', value: 'true' }, { key: 'flow_status_name', value: 'dispatch' }];
    return {
      drawerSize: 500,
      drawerPlacement: 'right',
      hideAddBtn: true,
      tableConfig: {
        apiUrl: apiUrl, //'sales/sale_order/?summary=true&flow_status_name=dispatch',
        title: 'Sales Dispatch',
        pkId: "sale_order_id",
        pageSize: 10,
        globalSearch: {
          keys: ['customer', 'order_no','products']
        },
        export: {
          downloadName: 'SalesDispatch'
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'customer',
            name: 'Customer',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => `${row.customer.name}`,
            sort: true

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
          // this.ngOnInit();
        },
        error => {
          console.error('Error in confirming dispatch:', error);
          alert('Failed to confirm dispatch. Please try again.');
        }
      );
    }
    this.ngOnInit();
  }

  // Refresh the curdConfig object to reload the data in ta-curd-modal
  refreshCurdConfig() {
    this.curdConfig = this.getCurdConfig(); // Reset the curdConfig with a fresh configuration
  }
}
