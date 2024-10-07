import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentTransactionRoutingModule } from './payment-transaction-routing.module';
import { PaymentTransactionComponent } from './payment-transaction.component';
import { PaymentTransactionListComponent } from './payment-transaction-list/payment-transaction-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // PaymentTransactionComponent,
    // PaymentTransactionListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    PaymentTransactionRoutingModule
  ]
})
export class PaymentTransactionModule { }
