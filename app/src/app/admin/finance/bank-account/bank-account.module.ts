import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankAccountRoutingModule } from './bank-account-routing.module';
import { BankAccountListComponent } from './bank-account-list/bank-account-list.component';
import { BankAccountComponent } from './bank-account.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // BankAccountComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    BankAccountRoutingModule
  ]
})
export class BankAccountModule { }
