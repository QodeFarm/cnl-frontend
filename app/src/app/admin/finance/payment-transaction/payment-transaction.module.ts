import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentTransactionRoutingModule } from './payment-transaction-routing.module';
import { PaymentTransactionComponent } from './payment-transaction.component';
import { PaymentTransactionListComponent } from './payment-transaction-list/payment-transaction-list.component';


@NgModule({
  declarations: [
    PaymentTransactionComponent,
    PaymentTransactionListComponent
  ],
  imports: [
    CommonModule,
    PaymentTransactionRoutingModule
  ]
})
export class PaymentTransactionModule { }
