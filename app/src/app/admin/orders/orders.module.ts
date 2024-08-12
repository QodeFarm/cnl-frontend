import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { StatusesComponent } from './statuses/statuses.component';
import { OrderTypesComponent } from './order-types/order-types.component';
import { OrderStatusesComponent } from './order-statuses/order-statuses.component';
import { GstTypesComponent } from './gst-types/gst-types.component';
import { PurchaseTypesComponent } from './purchase-types/purchase-types.component';
import { SaleTypesComponent } from './sale-types/sale-types.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { PaymentLinkTypeComponent } from './payment-link-type/payment-link-type.component';


@NgModule({
  declarations: [
    OrdersComponent,
    StatusesComponent,
    OrderTypesComponent,
    OrderStatusesComponent,
    GstTypesComponent,
    PurchaseTypesComponent,
    SaleTypesComponent,
    PaymentLinkTypeComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    OrdersRoutingModule
  ],
  exports:[
    StatusesComponent,
    OrderTypesComponent,
    OrderStatusesComponent,
    GstTypesComponent,
    PurchaseTypesComponent,
    SaleTypesComponent,
    PaymentLinkTypeComponent
  ]
})
export class OrdersModule { }
