import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
export class SalesDispatchComponent implements OnInit, OnDestroy {
  isLoading = true;
  showModal = false;
  selectedOrder: any = null;
  dispatchedOrderContext: { sale_order_id: any; order_no: string } | null = null;
  @ViewChild('notificationActionTpl') notificationActionTpl!: TemplateRef<any>;

  private knownRowIds = new Set<string>();
  private pendingNewRowIds: string[] = [];
  private pollInterval: any;
  // Fast-poll state: used when navigating from Sales with a specific order to highlight
  private highlightPendingId: string | null = null;
  private fastPollInterval: any;
  private fastPollAttempts = 0;
  private readonly FAST_POLL_MAX_ATTEMPTS = 20; // 20 × 3s = 60s max wait

  curdConfig: TaCurdConfig;

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    // If navigated from Sales "Save & Go to Dispatch", store the order ID for fast-poll.
    // Do NOT inject into getCurdConfig here — the order may not be in the API yet
    // (backend processing delay). The fast poll will trigger the blink once it appears.
    const highlightId = window.history.state?.highlightOrderId;
    if (highlightId) {
      this.highlightPendingId = String(highlightId);
      history.replaceState({}, '', window.location.href); // consume so back-nav doesn't re-blink
    }
    this.curdConfig = this.getCurdConfig();
  }

  ngOnInit() {
    this.isLoading = false;
    // Seed known IDs so existing rows don't blink on background polls
    this.seedKnownRowIds();
    // If a specific order needs to be highlighted, fast-poll every 3s until it appears
    if (this.highlightPendingId) {
      this.startFastPoll();
    }
    // Regular 30s poll — detects orders sent by OTHER users while this page is open
    this.pollInterval = setInterval(() => this.pollForNewOrders(), 30000);
  }

  ngOnDestroy() {
    clearInterval(this.pollInterval);
    clearInterval(this.fastPollInterval);
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
        newRowIds: this.pendingNewRowIds.length ? [...this.pendingNewRowIds] : undefined,
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
    this.curdConfig = this.getCurdConfig();
    // Clear pending IDs after injecting into config — prevents re-blink on next rebuild
    this.pendingNewRowIds = [];
  }

  private getDispatchApiUrl(): string {
    const user = this.localStorage.getItem('user');
    const isSuperUser = user?.is_sp_user === true;
    return isSuperUser
      ? 'sales/sale_order/?records_all=true&flow_status_name=dispatch'
      : 'sales/sale_order/?summary=true&flow_status_name=dispatch';
  }

  /**
   * Polls every 3s until the highlighted order appears in the dispatch queue,
   * then triggers the blink. Stops after 60s to avoid infinite polling.
   */
  private startFastPoll(): void {
    this.fastPollAttempts = 0;
    this.fastPollInterval = setInterval(() => {
      this.fastPollAttempts++;
      this.http.get(`${this.getDispatchApiUrl()}&page=1&limit=500`).subscribe({
        next: (res: any) => {
          const rows: any[] = res?.data || [];
          const found = rows.some(r => String(r.sale_order_id) === this.highlightPendingId);
          const timedOut = this.fastPollAttempts >= this.FAST_POLL_MAX_ATTEMPTS;

          if (found || timedOut) {
            clearInterval(this.fastPollInterval);
            if (found) {
              // Add to knownRowIds so regular 30s poll doesn't re-blink it later
              this.knownRowIds.add(this.highlightPendingId!);
              this.pendingNewRowIds = [this.highlightPendingId!];
              this.highlightPendingId = null;
              this.refreshCurdConfig();
              this.cdRef.detectChanges();
            } else {
              this.highlightPendingId = null;
            }
          }
        },
        error: () => {
          if (this.fastPollAttempts >= this.FAST_POLL_MAX_ATTEMPTS) {
            clearInterval(this.fastPollInterval);
            this.highlightPendingId = null;
          }
        }
      });
    }, 3000);
  }

  /** Called once on init — populates knownRowIds so existing rows don't blink */
  private seedKnownRowIds(): void {
    this.http.get(`${this.getDispatchApiUrl()}&page=1&limit=500`).subscribe({
      next: (res: any) => {
        const rows: any[] = res?.data || [];
        this.knownRowIds = new Set(rows.map(r => String(r.sale_order_id)));
      },
      error: () => {} // silent — poll will catch up
    });
  }

  /** Polls the dispatch queue and blinks any newly arrived orders */
  private pollForNewOrders(): void {
    this.http.get(`${this.getDispatchApiUrl()}&page=1&limit=500`).subscribe({
      next: (res: any) => {
        const rows: any[] = res?.data || [];
        const currentIds = rows.map(r => String(r.sale_order_id));
        const newIds = currentIds.filter(id => !this.knownRowIds.has(id));

        // Replace known set with current state (handles removed orders too)
        this.knownRowIds = new Set(currentIds);

        if (newIds.length > 0) {
          this.pendingNewRowIds = newIds;
          this.refreshCurdConfig();
          this.cdRef.detectChanges();
        }
      },
      error: () => {} // silent — try next poll cycle
    });
  }
}
