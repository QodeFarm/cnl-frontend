import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleReceiptRoutingModule } from './sale-receipt-routing.module';
import { SaleReceiptComponent } from './sale-receipt.component';
import { SaleReceiptListComponent } from './sale-receipt-list/sale-receipt-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    SaleReceiptComponent,
    
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    SaleReceiptRoutingModule,
    SaleReceiptListComponent
  ]
})
export class SaleReceiptModule { }
