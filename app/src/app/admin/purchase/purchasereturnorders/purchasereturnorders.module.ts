import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasereturnordersRoutingModule } from './purchasereturnorders-routing.module';
import { PurchasereturnordersComponent } from './purchasereturnorders.component';
import { PurchasereturnordersListComponent } from './purchasereturnorders-list/purchasereturnorders-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    PurchasereturnordersComponent,
  ],
  imports: [
    AdminCommmonModule,
    CommonModule,
    PurchasereturnordersRoutingModule,
    PurchasereturnordersListComponent
  ]
})
export class PurchasereturnordersModule { }
