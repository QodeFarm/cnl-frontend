import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

const TABLE_FIELDS = {
  workOrder: [
    { key: 'product.name', label: 'Product Name' },
    { key: 'size.size_name', label: 'Size' },
    { key: 'color.color_name', label: 'Color' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'completed_qty', label: 'Completed Quantity', defaultValue: 0 },
    { key: 'status.status_name', label: 'Status' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' }
  ],
  workers: [
    { key: 'employee.first_name', label: 'Employee' },
    { key: 'hours_worked', label: 'Hours Worked' }
  ],
  bom: [
    { key: 'product.name', label: 'Product Name' },
    { key: 'product.code', label: 'Product Code' },
    { key: 'product.print_name', label: 'Print Name' },
    { key: 'size.size_name', label: 'Size' },
    { key: 'color.color_name', label: 'Color' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unit_cost', label: 'Unit Cost' },
    { key: 'total_cost', label: 'Total Cost' },
    { key: 'notes', label: 'Notes' }
  ],
  stages: [
    { key: 'stage_name', label: 'Stage Name' },
    { key: 'stage_description', label: 'Description' },
    { key: 'stage_start_date', label: 'Start Date' },
    { key: 'stage_end_date', label: 'End Date' },
    { key: 'notes', label: 'Notes' }
  ]
};

@Component({
  selector: 'app-workorderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminCommmonModule, NzModalModule, NzTableModule, NzNotificationModule, NzSelectModule, NzIconModule],
  templateUrl: './workorderboard.component.html',
  styleUrls: ['./workorderboard.component.scss']
})
export class WorkorderboardComponent implements OnInit, OnDestroy {
  @ViewChild('woCompletedTpl', { static: false }) woCompletedTpl: TemplateRef<{}>;
  @ViewChild(TaTableComponent) taTable!: TaTableComponent;
  woNotifRef: any = null;
  woNotifProductName = '';

  isLoading = true;
  showModal = false;
  showEditModal = false;
  selectedOrder: any = null;
  selectedWorkOrderId: string;
  workOrderData: any = null;
  tableFields = TABLE_FIELDS;
  private routeSub: Subscription;
  private destroy$ = new Subject<void>();
  private summaryTrigger$ = new Subject<void>();

  // Floor picker. A tab per floor does not survive a tenant that models each machine as a
  // floor, so the list is a server-searched select that never loads more than one page.
  // 'unassigned' is kept as a fixed option so work orders created before any floor was set
  // stay reachable — a job reachable from nowhere is worse than a job on the wrong floor.
  readonly ALL_FLOORS = 'all';
  readonly UNASSIGNED = 'unassigned';
  private readonly FLOOR_PAGE = 20;
  activeFloorId: string = this.ALL_FLOORS;
  floorOptions: any[] = [];
  floorsLoading = false;
  /** Held separately so a search that filters it out cannot blank the picker's label. */
  selectedFloor: any = null;
  private floorSearch$ = new Subject<string>();

  @Output() view = new EventEmitter<any>();

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private notification: NzNotificationService) {}

  ngOnInit() {
    this.isLoading = false;
    // switchMap so a slower earlier request cannot land after a newer one. Deep-linking to
    // ?floor=<id> fires an 'all floors' load and a per-floor load back to back; without this
    // the panel could settle on every floor's totals while the table below shows one floor.
    this.summaryTrigger$.pipe(
      switchMap(() => this.http
        .get(this.boardApiUrl())
        .pipe(catchError(() => of({ data: [] })))),
      takeUntil(this.destroy$)
    ).subscribe((res: any) => {
      this.generateProductionSummary(res?.data || res?.results || []);
    });

    this.initFloorPicker();
    this.loadProductionSummary();
    // Reload whenever the 'refresh' query param changes (the tab may already be open and
    // Angular reuses the component instance), or when the selected floor changes.
    this.routeSub = this.route.queryParams.subscribe(params => {
      const floor = params['floor'] || this.ALL_FLOORS;
      if (floor !== this.activeFloorId) {
        this.activeFloorId = floor;
        this.resolveSelectedFloor(floor);
        this.reloadBoard();
      } else if (params['refresh']) {
        // Same floor, just newer data — keep the operator's page, search and sort.
        this.refreshRows();
      }
    });
  }


  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Floor options, fetched one page at a time and narrowed server-side by `name`. The whole
   * master is never pulled down: a tenant with thousands of floors costs the same as one with
   * three, and the picker stays usable at both ends.
   */
  private initFloorPicker(): void {
    this.floorSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { this.floorsLoading = true; }),
      switchMap((term: string) => this.http
        .get(`masters/production_floors/?limit=${this.FLOOR_PAGE}` +
             (term ? `&name=${encodeURIComponent(term)}` : ''))
        .pipe(catchError(() => of({ data: [] })))),
      takeUntil(this.destroy$)
    ).subscribe((res: any) => {
      this.floorsLoading = false;
      this.floorOptions = (res?.data || []).filter((f: any) => !f.is_deleted);
    });

    this.floorSearch$.next('');
  }

  onFloorSearch(term: string): void {
    this.floorSearch$.next(term || '');
  }

  /**
   * A bookmarked ?floor=<id> may not appear in the first page of options, which would leave
   * the picker showing an empty box over a filtered list. Fetch that one floor by id.
   */
  private resolveSelectedFloor(id: string): void {
    if (!id || id === this.ALL_FLOORS || id === this.UNASSIGNED) {
      this.selectedFloor = null;
      return;
    }
    const known = this.floorOptions.find((f: any) => f.production_floor_id === id);
    if (known) {
      this.selectedFloor = known;
      return;
    }
    this.http.get(`masters/production_floors/${id}/`)
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe((res: any) => {
        const data = res?.data ?? res;
        this.selectedFloor = Array.isArray(data) ? data[0] : data;
      });
  }

  selectFloor(floorId: string | null): void {
    // Clearing the picker means "no floor filter", the same as clearing Warehouse or Status.
    const next = floorId || this.ALL_FLOORS;
    if (next === this.activeFloorId) { return; }
    // Kept in the URL so a floor view can be bookmarked or pinned and the back button works.
    // The queryParams subscription above is what actually applies it. The default is written
    // as null so the URL stays clean when no floor is chosen.
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { floor: next === this.ALL_FLOORS ? null : next },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * The active floor as a query-string fragment. One source of truth for both the table and
   * the planning summary, so the two can never disagree about which floor is on screen.
   *
   * Appended to apiUrl rather than passed as `fixedFilters`: ta-table reads fixedFilters with
   * Object.keys() while every caller supplies an array, so an array yields the junk parameter
   * `0=[object Object]`. The apiUrl query string is the mechanism `flow_status=Production`
   * already uses on this screen.
   */
  /** The list endpoint for the board, including the active floor. One source of truth. */
  private boardApiUrl(): string {
    return `production/work_order/?flow_status=Production${this.floorQuery()}`;
  }

  private floorQuery(): string {
    if (this.activeFloorId === this.UNASSIGNED) {
      return '&production_floor_isnull=true';
    }
    if (this.activeFloorId !== this.ALL_FLOORS) {
      return `&production_floor_id=${encodeURIComponent(this.activeFloorId)}`;
    }
    return '';
  }

  /**
   * Apply a floor change to the list.
   *
   * The table is NOT destroyed and recreated. ta-table computes which global filters to show
   * (Quick Period, From/To date, Status) in its own ngOnInit from router.url; recreating it
   * recomputed those flags at an unpredictable moment, so the filter bar appeared or vanished
   * depending on which tab the router happened to be on. Instead the apiUrl on the config
   * object ta-table already holds is mutated in place — loadDataFromServer reads it verbatim
   * on every request — and refresh() reloads from page 1.
   */
  reloadBoard(): void {
    // Mutate, never reassign: ta-table captured this object reference at init, so a fresh
    // object from getCurdConfig() would leave it reading the old apiUrl.
    this.curdConfig.tableConfig.apiUrl = this.boardApiUrl();
    this.taTable?.refresh();
    this.loadProductionSummary();
  }

  /**
   * Reload the ROWS only, keeping the operator's page, search and sort. Used after a dispatch:
   * recreating the table there would bounce someone back to page 1 with their search cleared
   * on every single Done click.
   */
  refreshRows(): void {
    this.taTable?.refresh();
    this.loadProductionSummary();
  }

  loadProductionSummary(): void {
    this.summaryTrigger$.next();
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  viewWorkOrder(workOrderId: string) {
    this.selectedWorkOrderId = workOrderId;
    this.showEditModal = true;
    this.workOrderData = null; // Reset previous data

    this.http.get(`production/work_order/${workOrderId}`).subscribe({
      next: (res: any) => {
        this.workOrderData = res?.data ?? null;
      },
      error: (err) => {
        console.error("Error fetching work order:", err);
      }
    });
  }

  closeEditModal() {
      this.showEditModal = false;
  }

  openModal(order: any) {
    this.selectedOrder = order;
    // Reset modal fields every time it opens
    this.dispatchQty = 0;
    this.dispatchRemarks = '';

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedOrder = null;
  }

  // confirmDispatch() {
  //   if (this.selectedOrder) {
  //     const saleOrderId = this.selectedOrder.sale_order_id;
  //     const url = `sales/SaleOrder/${saleOrderId}/move_next_stage/`;

  //     this.http.post(url, {}).subscribe(
  //       () => {
  //         console.log('Dispatch confirmed for order:', saleOrderId);
  //         this.closeModal();
  //         this.curdConfig = this.getCurdConfig();
  //       },
  //       error => {
  //         console.error('Error in confirming dispatch:', error);
  //         alert('Failed to confirm dispatch. Please try again.');
  //       }
  //     );
  //   }
  // }

  showZeroBalanceModal = false;
zeroBalanceProductName = '';


showZeroBalancePopup(item: any) {
  this.zeroBalanceProductName = item.product?.name || 'This product';
  this.showZeroBalanceModal = true;
  // refreshRows(), not ngOnInit() — calling the lifecycle hook by hand re-subscribed
  // queryParams every time, stacking a new subscription per dispatch.
  this.refreshRows();
}

closeZeroBalanceModal() {
  this.showZeroBalanceModal = false;
}

zeroBalanceTitle = '';
zeroBalanceMessage = '';

showStockError(
  item: any,
  type:
    | 'ZERO_BALANCE'
    | 'INSUFFICIENT_BALANCE'
    | 'DISPATCH_EXCEEDS_STOCK'
    | 'DISPATCH_EXCEEDS_ORDER'
    | 'DISPATCH_EXCEEDS_AVAILABLE',
  balance?: number,
  dispatchQty?: number
) {
  this.zeroBalanceProductName =
    item?.product?.name || item?.product_name || 'Product';

  if (type === 'ZERO_BALANCE') {
    this.zeroBalanceTitle = 'Product Balance is 0';
    this.zeroBalanceMessage =
      `Stock is not available for "${this.zeroBalanceProductName}". 
       Please update the product balance before dispatching.`;
  }

  if (type === 'INSUFFICIENT_BALANCE') {
    this.zeroBalanceTitle = 'Insufficient Product Balance';
    this.zeroBalanceMessage =
      `Cannot process order for "${this.zeroBalanceProductName}". 
       Ordered quantity (${item.quantity}) exceeds available stock (${balance}).`;
  }

  if (type === 'DISPATCH_EXCEEDS_STOCK') {
    this.zeroBalanceTitle = 'Dispatch Quantity Exceeds Stock';
    this.zeroBalanceMessage =
      `Dispatch quantity (${dispatchQty}) for "${this.zeroBalanceProductName}" exceeds current stock (${balance}). 
       Please select a quantity within available stock.`;
  }

  if (type === 'DISPATCH_EXCEEDS_ORDER') {
    this.zeroBalanceTitle = 'Dispatch Quantity Exceeds Order';
    this.zeroBalanceMessage =
      `Dispatch quantity (${dispatchQty}) cannot be greater than the ordered quantity (${item.quantity}) for "${this.zeroBalanceProductName}".`;
  }

  if (type === 'DISPATCH_EXCEEDS_AVAILABLE') {
    this.zeroBalanceTitle = 'Dispatch Quantity Exceeds Available Balance';
    this.zeroBalanceMessage =
      `Selected dispatch quantity (${dispatchQty}) for "${this.zeroBalanceProductName}" exceeds the available balance (${balance}). 
       Please select a quantity within the available balance.`;
  }

  this.showZeroBalanceModal = true;
}

dispatchQty: number = 0;
dispatchRemarks: string = '';

confirmDispatch() {

  if (!this.selectedOrder) {
    console.warn('No order selected');
    return;
  }

  const saleOrderId = this.selectedOrder.sale_order_id;
  const workOrderId = this.selectedOrder.work_order_id;

  if (!this.dispatchQty || this.dispatchQty <= 0) {
    return;
  }

  const dispatchQty = Number(this.dispatchQty);

  const previousAvailableQty = Number(this.selectedOrder.available_qty || 0);
  const totalOrderQty = Number(this.selectedOrder.quantity || 0);

  // Prevent dispatch more than available
  if (dispatchQty > previousAvailableQty) {
    this.showStockError(
      this.selectedOrder,
      'DISPATCH_EXCEEDS_AVAILABLE',
      previousAvailableQty,
      dispatchQty
    );
    return;
  }

  /* ================= WORK ORDER CALCULATION ================= */

  const newOrderedQty =
    Number(this.selectedOrder.ordered_qty || 0) - dispatchQty;

  const newAvailableQty = previousAvailableQty - dispatchQty;

  /* ================= REMARKS LOGIC ================= */

  const previousRemarks = this.selectedOrder?.remarks || '';

  const autoMessage = `Dispatched ${dispatchQty} qty from ${totalOrderQty}`;

  const finalRemark = this.dispatchRemarks?.trim()
    ? this.dispatchRemarks
    : autoMessage;

  // Add bullet point
  const bulletRemark = `• ${finalRemark}`;

  const updatedRemarks = previousRemarks
    ? `${previousRemarks}\n${bulletRemark}`
    : bulletRemark;

  console.log('Starting dispatch confirmation for order:', saleOrderId);

  this.http.get(`sales/sale_order/${saleOrderId}/`).subscribe(
    async (res: any) => {

      const saleOrder = res?.data?.sale_order;
      const saleOrderItems = res?.data?.sale_order_items || [];
      const orderAttachments = res?.data?.order_attachments || [];
      const orderShipments = res?.data?.order_shipments || [];
      const customFields = res?.data?.custom_fields || {};

      if (!saleOrder || !saleOrderItems.length) {
        return;
      }

      const updatedSaleOrderItems = [];
      let isFullDispatch = true;

      for (const item of saleOrderItems) {

        const orderedQty = Number(item.quantity || 0);
        if (!item.product_id || orderedQty <= 0) continue;

        try {

          const productRes: any = await this.http
            .get(`products/products/${item.product_id}`)
            .toPromise();

          const currentBalance =
            Number(productRes?.data?.products.balance || 0);

          if (currentBalance === 0) {
            this.showStockError(item, 'ZERO_BALANCE');
            return;
          }

          if (dispatchQty > currentBalance) {
            this.showStockError(
              item,
              'DISPATCH_EXCEEDS_STOCK',
              currentBalance,
              dispatchQty
            );
            return;
          }

          const updatedBalance = currentBalance - dispatchQty;

          const newAvailableQtyItems =
            Number(item.available_qty || 0) + dispatchQty;

          const newProductionQty =
            orderedQty - newAvailableQtyItems;

          if (newProductionQty > 0) {
            isFullDispatch = false;
          }

          updatedSaleOrderItems.push({
            sale_order_item_id: item.sale_order_item_id,
            sale_order_id: saleOrderId,
            product_id: item.product_id,
            unit_options_id: item.unit_options_id,
            quantity: orderedQty,
            available_qty: newAvailableQtyItems,
            production_qty: newProductionQty > 0 ? newProductionQty : 0
          });

          // Update Product Balance
          await this.http.patch(
            `products/update-balance/${item.product_id}/`,
            { balance: updatedBalance }
          ).toPromise();

        } catch (err) {
          console.error(
            `Failed to fetch balance for product ${item.product_id}`,
            err
          );
        }
      }

      const payload = {
        sale_order: {
          ...saleOrder,
          order_type: 'sale_order'
        },
        sale_order_items: updatedSaleOrderItems,
        order_attachments: orderAttachments,
        order_shipments: orderShipments,
        custom_fields: customFields
      };

      /* ================= UPDATE SALE ORDER ================= */

      this.http.put(`sales/sale_order/${saleOrderId}/`, payload).subscribe(
        () => {

          console.log('Sale order items updated successfully');

          /* ================= UPDATE WORK ORDER ================= */

          const workOrderPayload = {
            work_order: {
              ordered_qty: newOrderedQty,
              available_qty: newAvailableQty,
              remarks: updatedRemarks
            }
          };

          this.http.patch(
            `production/work_order/${workOrderId}/`,
            workOrderPayload
          ).subscribe(() => {
            console.log('Work Order updated successfully');
          });

          // Update UI instantly
          this.selectedOrder.available_qty = newAvailableQty;
          this.selectedOrder.ordered_qty = newOrderedQty;
          this.selectedOrder.remarks = updatedRemarks;

          if (isFullDispatch) {

            const moveNextStageUrl =
              `sales/SaleOrder/${saleOrderId}/move_next_stage/`;

            this.http.post(moveNextStageUrl, {}).subscribe(
              () => {

                console.log('Dispatch confirmed & moved to next stage');

                this.closeModal();
                this.refreshRows();

              },
              error => {
                console.error('Move next stage failed:', error);
              }
            );

          } else {

            console.log('Partial dispatch - staying in current stage');

            this.closeModal();
            this.refreshRows();

          }

        },
        error => {
          console.error('Sale order update failed:', error);
        }
      );

    },
    error => {
      console.error('Fetch sale order failed:', error);
    }
  );
}


// confirmDispatch() {
//   if (!this.selectedOrder) {
//     console.warn('No order selected');
//     return;
//   }

//   const saleOrderId = this.selectedOrder.sale_order_id;
//   console.log('Starting dispatch confirmation for order:', saleOrderId);

//   // ================= STEP 1: FETCH FULL SALE ORDER =================
//   this.http.get(`sales/sale_order/${saleOrderId}/`).subscribe(
//     async (res: any) => {

//       const saleOrder = res?.data?.sale_order;
//       const saleOrderItems = res?.data?.sale_order_items || [];
//       const orderAttachments = res?.data?.order_attachments || [];
//       const orderShipments = res?.data?.order_shipments || [];
//       const customFields = res?.data?.custom_fields || {};

//       if (!saleOrder || !saleOrderItems.length) {
//         alert('Sale order data not found');
//         return;
//       }

//       // ================= STEP 2: PREPARE UPDATED ITEMS (WITH REAL BALANCE) =================
//       const updatedSaleOrderItems = [];

//       for (const item of saleOrderItems) {

//         const orderedQty = Number(item.quantity || 0);
//         if (!item.product_id || orderedQty <= 0) continue;

//         try {
//           // FETCH REAL PRODUCT BALANCE
//           const productRes: any = await this.http
//             .get(`products/products/${item.product_id}`)
//             .toPromise();

//           console.log(`Fetched balance for product ${item.product_id}:`, productRes);

//           const currentBalance =
//             Number(productRes?.data?.products.balance || 0);

//           console.log(`Product ${item.product_id} - Current Balance: ${currentBalance}, Ordered Qty: ${orderedQty}`);

//           // balance = 0
//           if (currentBalance === 0) {
//             this.showStockError(item, 'ZERO_BALANCE');
//             return;
//           }

//           // ordered qty > balance
//           if (orderedQty > currentBalance) {
//             this.showStockError(item, 'INSUFFICIENT_BALANCE', currentBalance);
//             return;
//           }

//           const availableQty = currentBalance - orderedQty;
//           const productionQty = availableQty >= orderedQty ? 0 : orderedQty - availableQty;
//           console.log("availableQty:", availableQty, "productionQty:", productionQty);
//           updatedSaleOrderItems.push({
//             // REQUIRED FOR UPDATE (NO DELETE)
//             sale_order_item_id: item.sale_order_item_id,
//             sale_order_id: saleOrderId,
//             product_id: item.product_id,
//             unit_options_id: item.unit_options_id,

//             // REQUIRED FIELD
//             quantity: orderedQty,

//             // FINAL CORRECT VALUES
//             available_qty: availableQty,
//             production_qty: productionQty
//           });

//           // ================= UPDATE PRODUCT BALANCE =================
//           await this.http.patch(
//             `products/update-balance/${item.product_id}/`,
//             { balance: availableQty }
//           ).toPromise();


//           } catch (err) {
//           console.error(
//             `Failed to fetch balance for product ${item.product_id}`,
//             err
//           );
//         }
//       }
      

//       // ================= STEP 3: BUILD PUT PAYLOAD (UNCHANGED STRUCTURE) =================
//       const payload = {
//         sale_order: {
//           ...saleOrder,

//           // FORCE order_type
//           order_type: 'sale_order'
//         },
//         sale_order_items: updatedSaleOrderItems,
//         order_attachments: orderAttachments,
//         order_shipments: orderShipments,
//         custom_fields: customFields
//       };

//       // ================= STEP 4: UPDATE SALE ORDER (PUT) =================
//       this.http.put(`sales/sale_order/${saleOrderId}/`, payload).subscribe(
//         () => {

//           console.log('✅ Sale order items updated successfully');

//           // ================= STEP 5: MOVE TO NEXT STAGE =================
//           const moveNextStageUrl =
//             `sales/SaleOrder/${saleOrderId}/move_next_stage/`;

//           this.http.post(moveNextStageUrl, {}).subscribe(
//             () => {
//               console.log('✅ Dispatch confirmed & moved to next stage');
//               const productName = this.selectedOrder?.product?.name || 'Product';
//               this.closeModal();
//               this.curdConfig = this.getCurdConfig();
//               this.woNotifProductName = productName;
//               this.woNotifRef = this.notification.template(this.woCompletedTpl, {
//                 nzDuration: 6000,
//                 nzPlacement: 'topRight'
//               });
//             },
//             error => {
//               console.error('Move next stage failed:', error);
//               alert('Failed to move order to next stage');
//             }
//           );

//         },
//         error => {
//           console.error('Sale order update failed:', error);
//           alert('Failed to update sale order items');
//         }
//       );

//     },
//     error => {
//       console.error('Fetch sale order failed:', error);
//       alert('Unable to fetch sale order data');
//     }
//   );
// }

  getCurdConfig(): TaCurdConfig {
    return {
      drawerSize: 500,
      drawerPlacement: 'right',
      tableConfig: {
        apiUrl: this.boardApiUrl(),
        title: 'Work Order Board',
        pkId: "work_order_id",
        pageSize: 10,
        globalSearch: { keys: ['product', 'quantity', 'status_id', 'start_date', 'end_date'] },
        export: {downloadName: 'WorkOrderBoard'},
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
                {
                  fieldKey: 'customer',
                  name: 'Customer',
                  displayType: "map",
                  mapFn: (cv, row) => `${row.sale_order?.customer_name || '-'}`,
                  sort: true
                },
                {
                  fieldKey: 'product',
                  name: 'Product',
                  displayType: "map",
                  mapFn: (cv, row) => `${row.product?.name || '-'}`,
                  sort: true
                },
                {
                  fieldKey: 'color',
                  name: 'Color',
                  displayType: "map",
                  mapFn: (cv, row) => `${row.color?.color_name || '-'}`,
                  sort: true
                },
                {
                  fieldKey: 'size',
                  name: 'Size',
                  displayType: "map",
                  mapFn: (cv, row) => `${row.size?.size_name || '-'}`,
                  sort: true
                },
                {
                  fieldKey: 'production_floor',
                  name: 'Floor',
                  displayType: "map",
                  // Never blank: a job with no floor reads 'Unassigned', matching the option
                  // it can be found under.
                  mapFn: (cv, row) => `${row.production_floor?.name || 'Unassigned'}`,
                  sort: false
                },
                { fieldKey: 'ordered_qty', name: 'Quantity', sort: true },
                { fieldKey: 'available_qty', name: 'Available Qty', sort: true },

                {
                  fieldKey: 'status_id',
                  name: 'Status',
                  displayType: 'map',
                  mapFn: (cv, row) => `${row.status?.status_name || '-'}`,
                  sort: true
                },

                { fieldKey: 'start_date', name: 'Start Date', sort: true },
                { fieldKey: 'end_date', name: 'End Date', sort: true },
                // { fieldKey: 'remarks', name: 'Remarks', sort: false },
                {
                  fieldKey: 'remarks',
                  name: 'Remarks',
                  displayType: "map",
                  mapFn: (cv) => {
                    return `<div style="white-space: pre-line;">${cv || '-'}</div>`;
                  },
                  sort: false
                },

                {
                  fieldKey: 'actions',
                  name: 'Actions',
                  type: 'action',
                  // Explicit width: the default 150px left the sticky action column too narrow
                  // for two buttons, so Done/View wrapped and overlapped End Date.
                  width: '170px',
                  actions: [
                    { type: 'callBackFn', label: 'Done', callBackFn: (row) => this.openModal(row) },
                    { type: 'callBackFn', label: 'View', callBackFn: (row) => this.viewWorkOrder(row.work_order_id) }
                  ]
                }
              ]
        // cols: [
        //   { fieldKey: 'product', name: 'Product', displayType: "map", mapFn: (cv, row) => `${row.product.name}`, sort: true },
        //   { fieldKey: 'quantity', name: 'Quantity', sort: true },
        //   { fieldKey: 'status_id', name: 'Status', displayType: 'map', mapFn: (cv, row) => `${row.status.status_name}`, sort: true },
        //   { fieldKey: 'start_date', name: 'Start Date', sort: true },
        //   { fieldKey: 'end_date', name: 'End Date', sort: true },
        //   { fieldKey: 'actions', name: 'Actions', type: 'action',
        //     actions: [
        //       { type: 'callBackFn', label: 'Done', callBackFn: (row) => this.openModal(row) },
        //       { type: 'callBackFn', label: 'View', callBackFn: (row) => this.viewWorkOrder(row.work_order_id) }
        //     ]
        //   }
        // ]
      },
      formConfig: {
        url: 'sales/sale_order/{saleOrderId}/move_next_stage/',
        title: 'Work Order Confirmation',
        pkId: "sale_order_id",
        fields: [
          { key: 'sale_order_id', type: 'text' },
          { key: 'confirmation', type: 'select', defaultValue: 'yes' }
        ]
      }
    };
  }

  curdConfig: TaCurdConfig = this.getCurdConfig();

  dismissWoNotif(): void {
    if (this.woNotifRef) {
      this.notification.remove(this.woNotifRef.messageId);
      this.woNotifRef = null;
    }
  }

  goToSaleOrders(): void {
    this.dismissWoNotif();
    this.router.navigate(['/admin/sales'], { queryParams: { showList: 'true' } });
  }

  goToDispatch(): void {
    this.dismissWoNotif();
    this.router.navigate(['/admin/sales/sales-dispatch']);
  }

  productionSummary: any[] = [];

generateProductionSummary(data: any[]) {
  const map: { [key: string]: any } = {};

  data.forEach(row => {
    const productId = row.product?.product_id;
    if (!productId) return;

    if (!map[productId]) {
      map[productId] = {
        product_name: row.product?.name,
        total_qty: 0,
        available_qty: 0
      };
    }

    map[productId].total_qty += Number(row.quantity || 0);
    map[productId].available_qty += Number(row.available_qty || 0);
  });

  this.productionSummary = Object.values(map);
}

showProductionPlanning = false;

toggleProductionPlanning() {
  this.showProductionPlanning = !this.showProductionPlanning;
}

getCompletionPercentage(item: any): number {
  console.log("repsonse data : ", this.productionSummary);
  console.log("item data : ", item);
  if (!item.total_qty) return 0;
  return ((item.available_qty || 0) / item.total_qty) * 100;
}


getProgressColor(item: any) {
  const percent = this.getCompletionPercentage(item);

  if (percent === 100) return 'bg-success';
  if (percent >= 50) return 'bg-warning';
  return 'bg-danger';
}
}