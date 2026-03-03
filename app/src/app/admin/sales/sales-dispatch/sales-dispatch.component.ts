import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@ta/ta-core';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, NzNotificationModule],
  selector: 'app-sales-dispatch',
  templateUrl: './sales-dispatch.component.html',
  styleUrls: ['./sales-dispatch.component.scss']
})
export class SalesDispatchComponent implements OnInit {
  isLoading = true;
  showModal = false;
  selectedOrder: any = null;
  dispatchedOrderContext: { sale_order_id: any; order_no: string } | null = null;
  @ViewChild('notificationActionTpl') notificationActionTpl!: TemplateRef<any>;

  // Initial curdConfig setup
  curdConfig: TaCurdConfig = this.getCurdConfig();

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.curdConfig = this.getCurdConfig();
  }

  ngOnInit() {
    this.isLoading = false;
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
          keys: ['customer', 'order_no', 'products']
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
      const orderNo = this.selectedOrder.order_no;
      const dispatchedOrder = {
        sale_order_id: saleOrderId,
        order_no: orderNo
      };
      const url = `sales/SaleOrder/${saleOrderId}/move_next_stage/`;

      this.http.post(url, {}).subscribe(
        () => {
          console.log('Dispatch confirmed for order:', saleOrderId);
          this.dispatchedOrderContext = dispatchedOrder;
          this.closeModal(); // Close the modal after confirmation
          this.refreshCurdConfig(); // Refresh the data list in curdConfig

          // detectChanges BEFORE template() so that dispatchedOrderContext
          // is propagated into the template before the notification panel renders
          this.cdRef.detectChanges();
          this.notification.template(this.notificationActionTpl, {
            nzDuration: 8000,
            nzPlacement: 'topRight'
          });
        },
        error => {
          console.error('Error in confirming dispatch:', error);
          this.notification.error('Dispatch Failed', 'Could not confirm dispatch. Please try again.');
        }
      );
    }
  }

  navigateToInvoice() {
    const orderId = this.dispatchedOrderContext?.sale_order_id;
    if (!orderId) {
      this.notification.warning(
        'Order Context Missing',
        'Could not identify the dispatched order. Please open Sales Order List and create invoice manually.'
      );
      return;
    }
    this.notification.remove();
    // Use queryParams instead of history.state — queryParams are URL-based,
    // guaranteed available in ngOnInit regardless of component lifecycle timing.
    this.router.navigate(['/admin/sales'], {
      queryParams: { autoInvoice: 'true', orderId: String(orderId) }
    });
  }

  // Refresh the curdConfig object to reload the data in ta-curd-modal
  refreshCurdConfig() {
    this.curdConfig = this.getCurdConfig(); // Reset the curdConfig with a fresh configuration
  }
}
