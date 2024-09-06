import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionRoutingModule } from './production-routing.module';
import { ProductionComponent } from './production.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { BillOfMaterialsComponent } from './bill-of-materials/bill-of-materials.component';
import { ProductionStatusesComponent } from './production-statuses/production-statuses.component';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { InventoryComponent } from './inventory/inventory.component';
import { MachinesComponent } from './machines/machines.component';
import { LaborComponent } from './labor/labor.component';


@NgModule({
  declarations: [
    ProductionComponent,
    BillOfMaterialsComponent,
    ProductionStatusesComponent,
    WorkOrdersComponent,
    InventoryComponent,
    MachinesComponent,
    LaborComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    ProductionRoutingModule
  ]
})
export class ProductionModule { }
