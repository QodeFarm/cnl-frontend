import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';

import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { SalesListComponent } from './sales-list/sales-list.component';
import { OrderslistComponent } from './orderslist/orderslist.component';
import { SaleReturnsComponent } from './sale-returns/sale-returns.component';
import { SaleReturnsListComponent } from './sale-returns/sale-returns-list/sale-returns-list.component';
// import { SalesInvoiceListComponent } from './salesinvoice/salesinvoice-list/salesinvoice-list.component';
// import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';

@NgModule({
  declarations: [
    SalesComponent,
    SaleReturnsComponent,
    // SalesinvoiceComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    SalesRoutingModule,
    SalesListComponent,
    OrderslistComponent,
    SaleReturnsListComponent,
    // SalesInvoiceListComponent
    
  ]
})
export class SalesModule { }
