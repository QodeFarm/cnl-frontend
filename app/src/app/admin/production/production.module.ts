import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionRoutingModule } from './production-routing.module';
import { ProductionComponent } from './production.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ProductionStatusesComponent } from './production-statuses/production-statuses.component';
import { MachinesComponent } from './machines/machines.component';
import { WorkOrderListComponent } from './work-order-list/work-order-list.component';


@NgModule({
  declarations: [
    ProductionComponent,
    ProductionStatusesComponent,
    MachinesComponent,
    WorkOrderListComponent,
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    ProductionRoutingModule
  ]
})
export class ProductionModule { }
