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
  this.ngOnInit();
}

closeZeroBalanceModal() {
  this.showZeroBalanceModal = false;
}


confirmDispatch() {
  if (!this.selectedOrder) {
    console.warn('No order selected');
    return;
  }

  const saleOrderId = this.selectedOrder.sale_order_id;
  console.log('Starting dispatch confirmation for order:', saleOrderId);

  // ================= STEP 1: FETCH FULL SALE ORDER =================
  this.http.get(`sales/sale_order/${saleOrderId}/`).subscribe(
    async (res: any) => {

      const saleOrder = res?.data?.sale_order;
      const saleOrderItems = res?.data?.sale_order_items || [];
      const orderAttachments = res?.data?.order_attachments || [];
      const orderShipments = res?.data?.order_shipments || [];
      const customFields = res?.data?.custom_fields || {};

      if (!saleOrder || !saleOrderItems.length) {
        alert('Sale order data not found');
        return;
      }

      // ================= STEP 2: PREPARE UPDATED ITEMS (WITH REAL BALANCE) =================
      const updatedSaleOrderItems = [];

      for (const item of saleOrderItems) {

        const orderedQty = Number(item.quantity || 0);
        if (!item.product_id || orderedQty <= 0) continue;

        try {
          // FETCH REAL PRODUCT BALANCE
          const productRes: any = await this.http
            .get(`products/products/${item.product_id}`)
            .toPromise();

          console.log(`Fetched balance for product ${item.product_id}:`, productRes);

          const currentBalance =
            Number(productRes?.data?.products.balance || 0);

          console.log(`Product ${item.product_id} - Current Balance: ${currentBalance}, Ordered Qty: ${orderedQty}`);

          // NEW USE CASE
          if (currentBalance === 0) {
            this.showZeroBalancePopup(item);
            return; // stop further processing
          }

          const availableQty = currentBalance - orderedQty;
          const productionQty = availableQty >= orderedQty ? 0 : orderedQty - availableQty;
          console.log("availableQty:", availableQty, "productionQty:", productionQty);
          updatedSaleOrderItems.push({
            // REQUIRED FOR UPDATE (NO DELETE)
            sale_order_item_id: item.sale_order_item_id,
            sale_order_id: saleOrderId,
            product_id: item.product_id,
            unit_options_id: item.unit_options_id,

            // REQUIRED FIELD
            quantity: orderedQty,

            // FINAL CORRECT VALUES
            available_qty: availableQty,
            production_qty: productionQty
          });

          // ================= UPDATE PRODUCT BALANCE =================
          await this.http.put(
            `products/products/${item.product_id}/`,
            { balance: availableQty }
          ).toPromise();

          } catch (err) {
          console.error(
            `Failed to fetch balance for product ${item.product_id}`,
            err
          );
        }
      }
      

      // ================= STEP 3: BUILD PUT PAYLOAD (UNCHANGED STRUCTURE) =================
      const payload = {
        sale_order: {
          ...saleOrder,

          // FORCE order_type
          order_type: 'sale_order'
        },
        sale_order_items: updatedSaleOrderItems,
        order_attachments: orderAttachments,
        order_shipments: orderShipments,
        custom_fields: customFields
      };

      // ================= STEP 4: UPDATE SALE ORDER (PUT) =================
      this.http.put(`sales/sale_order/${saleOrderId}/`, payload).subscribe(
        () => {

          console.log('✅ Sale order items updated successfully');

          // ================= STEP 5: MOVE TO NEXT STAGE =================
          const moveNextStageUrl =
            `sales/SaleOrder/${saleOrderId}/move_next_stage/`;

          this.http.post(moveNextStageUrl, {}).subscribe(
            () => {
              console.log('✅ Dispatch confirmed & moved to next stage');
              this.closeModal();
              this.curdConfig = this.getCurdConfig();
            },
            error => {
              console.error('Move next stage failed:', error);
              alert('Failed to move order to next stage');
            }
          );

        },
        error => {
          console.error('Sale order update failed:', error);
          alert('Failed to update sale order items');
        }
      );

    },
    error => {
      console.error('Fetch sale order failed:', error);
      alert('Unable to fetch sale order data');
    }
  );
}



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
          { fieldKey: 'product', name: 'Product', displayType: "map", mapFn: (cv, row) => `${row.product.name}`, sort: true },
          { fieldKey: 'quantity', name: 'Quantity', sort: true },
          { fieldKey: 'status_id', name: 'Status', displayType: 'map', mapFn: (cv, row) => `${row.status.status_name}`, sort: true },
          { fieldKey: 'start_date', name: 'Start Date', sort: true },
          { fieldKey: 'end_date', name: 'End Date', sort: true },
          { fieldKey: 'actions', name: 'Actions', type: 'action',
            actions: [
              { type: 'callBackFn', label: 'Done', callBackFn: (row) => this.openModal(row) },
              { type: 'callBackFn', label: 'View', callBackFn: (row) => this.viewWorkOrder(row.work_order_id) }
            ]
          }
        ]
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
}