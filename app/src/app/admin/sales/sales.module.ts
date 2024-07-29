import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';

import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SaleReturnsComponent } from './sale-returns/sale-returns.component';
import { SaleReturnsListComponent } from './sale-returns/sale-returns-list/sale-returns-list.component';

@NgModule({
  declarations: [
    SalesComponent,
    SaleReturnsComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    SalesRoutingModule,
    SalesListComponent,
    SaleReturnsListComponent
    
  ]
})
export class SalesModule { }
