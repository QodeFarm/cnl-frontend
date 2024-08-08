import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';

import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { SalesListComponent } from './sales-list/sales-list.component';
import { OrderslistComponent } from './orderslist/orderslist.component';

@NgModule({
  declarations: [
    SalesComponent,
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    SalesRoutingModule,
    SalesListComponent,
    OrderslistComponent
  ]
})
export class SalesModule { }
