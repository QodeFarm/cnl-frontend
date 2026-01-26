import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { InventoryScanComponent } from './inventory-scan/inventory-scan.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    // InventoryComponent
  
    // InventoryScanComponent
  ],
  imports: [
    CommonModule,
    // FormsModule,
    InventoryRoutingModule,
    AdminCommmonModule
  ]
})
export class InventoryModule { }
