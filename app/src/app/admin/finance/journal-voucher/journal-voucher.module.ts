import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalVoucherRoutingModule } from './journal-voucher-routing.module';
import { JournalVoucherComponent } from './journal-voucher.component';
import { JournalVoucherListComponent } from './journal-voucher-list/journal-voucher-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@NgModule({
  declarations: [
    // Components are standalone, no declarations needed
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    JournalVoucherRoutingModule
  ]
})
export class JournalVoucherModule { }
