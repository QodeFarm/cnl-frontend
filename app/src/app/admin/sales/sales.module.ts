import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';

import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@NgModule({
  declarations: [
    SalesComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
