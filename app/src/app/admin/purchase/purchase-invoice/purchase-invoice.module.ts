import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseInvoiceRoutingModule } from './purchase-invoice-routing.module';
import { PurchaseInvoiceComponent } from './purchase-invoice.component';
import { PurchaseInvoiceListComponent } from './purchase-invoice-list/purchase-invoice-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    PurchaseInvoiceComponent,
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    PurchaseInvoiceRoutingModule,
    PurchaseInvoiceListComponent
  ]
})
export class PurchaseInvoiceModule { }
