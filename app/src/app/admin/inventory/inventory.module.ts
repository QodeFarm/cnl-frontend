import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // InventoryComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    AdminCommmonModule
  ]
})
export class InventoryModule { }
