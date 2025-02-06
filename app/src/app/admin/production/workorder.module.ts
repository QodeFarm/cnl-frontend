import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionRoutingModule } from './production-routing.module';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ProductionStatusesComponent } from './production-statuses/production-statuses.component';
import { MachinesComponent } from './machines/machines.component';

@NgModule({
  declarations: [ProductionStatusesComponent, MachinesComponent],
  imports: [
    CommonModule,
    AdminCommmonModule,
    ProductionRoutingModule
  ],
  exports:[ProductionStatusesComponent, MachinesComponent]
})
export class ProductionModule { }
