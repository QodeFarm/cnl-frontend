import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesinvoiceRoutingModule } from './salesinvoice-routing.module';
import { SalesinvoiceComponent } from './salesinvoice.component';

import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { SalesInvoiceListComponent } from './salesinvoice-list/salesinvoice-list.component';


@NgModule({
  declarations: [
    SalesinvoiceComponent,
  ],
  imports: [
    CommonModule,
    SalesinvoiceRoutingModule,
    AdminCommmonModule,
    SalesInvoiceListComponent
  ]
})
export class SalesinvoiceModule { }
