import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionRoutingModule } from './production-routing.module';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminCommmonModule,
    ProductionRoutingModule
  ]
})
export class ProductionModule { }
