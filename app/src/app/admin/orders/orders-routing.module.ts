import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { GstTypesComponent } from './gst-types/gst-types.component';
import { OrderStatusesComponent } from './order-statuses/order-statuses.component';
import { OrderTypesComponent } from './order-types/order-types.component';
import { PurchaseTypesComponent } from './purchase-types/purchase-types.component';
import { SaleTypesComponent } from './sale-types/sale-types.component';
import { StatusesComponent } from './statuses/statuses.component';

const routes: Routes = [
  {
    path : '',
    component: OrdersComponent
  },
  {
    path : 'gst-types',
    component: GstTypesComponent
  },
  {
    path : 'order-statuses',
    component: OrderStatusesComponent
  },
  {
    path : 'order-types',
    component: OrderTypesComponent
  },
  {
    path : 'purchase-types',
    component: PurchaseTypesComponent
  },
  {
    path : 'sale-types',
    component: SaleTypesComponent
  },
  {
    path : 'statuses',
    component: StatusesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
