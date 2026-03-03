import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';

const TABLE_FIELDS = {
  workOrder: [
    { key: 'product.name', label: 'Product Name' },
    { key: 'size.size_name', label: 'Size' },
    { key: 'color.color_name', label: 'Color' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'available_qty', label: 'Completed Quantity', defaultValue: 0 },
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
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './workorderboard.component.html',
  styleUrls: ['./workorderboard.component.scss']
})
export class WorkorderboardComponent implements OnInit {
  isLoading = true;
  showModal = false;
  showEditModal = false;
  selectedOrder: any = null;
  selectedWorkOrderId: string;
  workOrderData: any = null;
  tableFields = TABLE_FIELDS;
  
  @Output() view = new EventEmitter<any>();

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.isLoading = false;
    this.http.get('production/work_order/?flow_status=Production')
      .subscribe((res: any) => {
        const records = res?.data || res?.results || [];
        this.generateProductionSummary(records);
      });
  }

  getQtyColor(qty: number) {
    if (qty >= 200) return 'high-production';
    if (qty >= 100) return 'medium-production';
    return 'low-production';
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
  this.dispatchQty = 0;
  this.dispatchRemarks = '';
  this.showModal = true;
}

  closeModal() {
    this.showModal = false;
    this.selectedOrder = null;
  }

showZeroBalanceModal = false;
zeroBalanceProductName = '';


showZeroBalancePopup(item: any) {
  this.zeroBalanceProductName = item.product?.name || 'This product';
  this.showZeroBalanceModal = true;
  this.ngOnInit();
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
      'Stock is not available. Product balance update is mandatory before dispatch.';
  }

  if (type === 'INSUFFICIENT_BALANCE') {
    this.zeroBalanceTitle = 'Insufficient Product Balance';
    this.zeroBalanceMessage =
      `Ordered quantity is greater than available stock.
       Available: ${balance}, Ordered: ${item.quantity}`;
  }

  if (type === 'DISPATCH_EXCEEDS_STOCK') {
    this.zeroBalanceTitle = 'Dispatch Quantity Exceeds Stock';
    this.zeroBalanceMessage =
      `Dispatch qty (${dispatchQty}) is greater than available stock (${balance}).`;
  }

  if (type === 'DISPATCH_EXCEEDS_ORDER') {
    this.zeroBalanceTitle = 'Dispatch Quantity Exceeds Order';
    this.zeroBalanceMessage =
      `Dispatch qty (${dispatchQty}) cannot be greater than ordered qty (${item.quantity}).`;
  }

  this.showZeroBalanceModal = true;
}

dispatchQty: number = 0;
dispatchRemarks: string = '';

// confirmDispatch() {
//   if (!this.selectedOrder) {
//     console.warn('No order selected');
//     return;
//   }

//   const saleOrderId = this.selectedOrder.sale_order_id;

//   // Removed alert, just stop execution
//   if (!this.dispatchQty || this.dispatchQty <= 0) {
//     return;
//   }

//   console.log('Starting dispatch confirmation for order:', saleOrderId);

//   this.http.get(`sales/sale_order/${saleOrderId}/`).subscribe(
//     async (res: any) => {

//       const saleOrder = res?.data?.sale_order;
//       const saleOrderItems = res?.data?.sale_order_items || [];
//       const orderAttachments = res?.data?.order_attachments || [];
//       const orderShipments = res?.data?.order_shipments || [];
//       const customFields = res?.data?.custom_fields || {};

//       if (!saleOrder || !saleOrderItems.length) {
//         return;
//       }

//       const updatedSaleOrderItems = [];
//       let isFullDispatch = true; // 🔥 used to control stage movement

//       for (const item of saleOrderItems) {

//         const orderedQty = Number(item.quantity || 0);
//         const previousCompletedQty = Number(this.selectedOrder.available_qty || 0);
//         const remainingWorkOrderQty = Number(this.selectedOrder.quantity || 0) - previousCompletedQty;
//         if (!item.product_id || orderedQty <= 0) continue;

//         try {
//           const productRes: any = await this.http
//             .get(`products/products/${item.product_id}`)
//             .toPromise();

//           const currentBalance =
//             Number(productRes?.data?.products.balance || 0);

//           // ZERO BALANCE CHECK
//           if (currentBalance === 0) {
//             this.showStockError(item, 'ZERO_BALANCE');
//             return;
//           }

//           const dispatchQty = Number(this.dispatchQty);

//           if (dispatchQty > orderedQty) {
//             this.showStockError(item, 'DISPATCH_EXCEEDS_ORDER', currentBalance, dispatchQty);
//             return;
//           }

//           if (dispatchQty > currentBalance) {
//             this.showStockError(item, 'DISPATCH_EXCEEDS_STOCK', currentBalance, dispatchQty);
//             return;
//           }

//           const remainingOrderQty = orderedQty - dispatchQty;
//           const updatedBalance = currentBalance - dispatchQty;

//           // 🔥 IMPORTANT LOGIC
//           if (remainingOrderQty > 0) {
//             isFullDispatch = false;
//           }

//           updatedSaleOrderItems.push({
//             sale_order_item_id: item.sale_order_item_id,
//             sale_order_id: saleOrderId,
//             product_id: item.product_id,
//             unit_options_id: item.unit_options_id,
//             quantity: orderedQty,
//             available_qty: Number(item.available_qty || 0) + dispatchQty,
//             production_qty: orderedQty - (Number(item.available_qty || 0) + dispatchQty),

//             remarks:
//               this.dispatchRemarks ||
//               (remainingOrderQty === 0
//                 ? `Order completed. Dispatched ${dispatchQty}`
//                 : `Partial dispatch ${dispatchQty}, Pending ${remainingOrderQty}`)
//           });

//           // Update Product Balance
//           await this.http.patch(
//             `products/update-balance/${item.product_id}/`,
//             { balance: updatedBalance }
//           ).toPromise();

//         } catch (err) {
//           console.error(
//             `Failed to fetch balance for product ${item.product_id}`,
//             err
//           );
//         }
//       }

//       const payload = {
//         sale_order: {
//           ...saleOrder,
//           order_type: 'sale_order'
//         },
//         sale_order_items: updatedSaleOrderItems,
//         order_attachments: orderAttachments,
//         order_shipments: orderShipments,
//         custom_fields: customFields
//       };

//       this.http.put(`sales/sale_order/${saleOrderId}/`, payload).subscribe(
//         () => {

//           console.log('Sale order items updated successfully');

//           // 🔥 MOVE NEXT STAGE ONLY IF FULL DISPATCH
//           if (isFullDispatch) {

//             const moveNextStageUrl =
//               `sales/SaleOrder/${saleOrderId}/move_next_stage/`;

//             this.http.post(moveNextStageUrl, {}).subscribe(
//               () => {
//                 console.log('Dispatch confirmed & moved to next stage');
//                 this.closeModal();
//                 this.curdConfig = this.getCurdConfig();
//                 this.ngOnInit();
//               },
//               error => {
//                 console.error('Move next stage failed:', error);
//               }
//             );

//           } else {
//             // Stay in same stage
//             console.log('Partial dispatch - staying in current stage');
//             this.closeModal();
//             this.curdConfig = this.getCurdConfig();
//             this.ngOnInit();
//           }

//         },
//         error => {
//           console.error('Sale order update failed:', error);
//         }
//       );

//     },
//     error => {
//       console.error('Fetch sale order failed:', error);
//     }
//   );
// }

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

  const updatedRemarks = previousRemarks
    ? `${previousRemarks}\n${finalRemark}`
    : finalRemark;

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
            this.showStockError(item, 'DISPATCH_EXCEEDS_STOCK', currentBalance, dispatchQty);
            return;
          }

          const updatedBalance = currentBalance - dispatchQty;

          const newAvailableQtyItems = Number(item.available_qty || 0) + dispatchQty;
          const newProductionQty = orderedQty - newAvailableQtyItems;

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

      /* ================= UPDATE SALE ORDER (YOUR EXISTING LOGIC) ================= */

      this.http.put(`sales/sale_order/${saleOrderId}/`, payload).subscribe(
        () => {

          console.log('Sale order items updated successfully');

          /* ================= UPDATE WORK ORDER (NEW ADDITION) ================= */

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
                this.curdConfig = this.getCurdConfig();
                this.ngOnInit();
              },
              error => {
                console.error('Move next stage failed:', error);
              }
            );

          } else {
            console.log('Partial dispatch - staying in current stage');
            this.closeModal();
            this.curdConfig = this.getCurdConfig();
            this.ngOnInit();
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
//           // if (orderedQty > currentBalance) {
//           //   this.showStockError(item, 'INSUFFICIENT_BALANCE', currentBalance);
//           //   return;
//           // }

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
//               this.closeModal();
//               this.curdConfig = this.getCurdConfig();
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
        apiUrl: 'production/work_order/?flow_status=Production',
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
                { fieldKey: 'remarks', name: 'Remarks', sort: false },

                {
                  fieldKey: 'actions',
                  name: 'Actions',
                  type: 'action',
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