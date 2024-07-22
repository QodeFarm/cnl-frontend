import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase.component';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    PurchaseComponent,
    // PurchaseListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    PurchaseRoutingModule,
    PurchaseListComponent
  ]
})
export class PurchaseModule { }
