import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillPaymentsComponent } from './bill-payments.component';
import { BillPaymentsListComponent } from './bill-payments-list/bill-payments-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';



@NgModule({
  declarations: [
    BillPaymentsComponent,
    // BillPaymentsListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    BillPaymentsListComponent
  ],
  exports: [
    BillPaymentsListComponent
  ]
})
export class BillPaymentsModule { }
