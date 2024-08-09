import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleReturnsRoutingModule } from './sale-returns-routing.module';
import { SaleReturnsComponent } from './sale-returns.component';
import { SaleReturnsListComponent } from './sale-returns-list/sale-returns-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    SaleReturnsComponent,
    // SaleReturnsListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    SaleReturnsRoutingModule,
    // SaleReturnsListComponent
  ]
})
export class SaleReturnsModule { }
