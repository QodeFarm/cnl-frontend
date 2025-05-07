import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountLedgerRoutingModule } from './account-ledger-routing.module';
import { AccountLedgerComponent } from './account-ledger.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // AccountLedgerComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    AccountLedgerRoutingModule
  ]
})
export class AccountLedgerModule { }
