import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehousesComponent } from './warehouses.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    WarehousesComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    WarehousesRoutingModule
  ]
})
export class WarehousesModule { }
