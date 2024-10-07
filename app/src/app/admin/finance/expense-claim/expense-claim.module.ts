import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseClaimRoutingModule } from './expense-claim-routing.module';
import { ExpenseClaimComponent } from './expense-claim.component';
import { ExpenseClaimListComponent } from './expense-claim-list/expense-claim-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // ExpenseClaimComponent,
    // ExpenseClaimListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    ExpenseClaimRoutingModule
  ]
})
export class ExpenseClaimModule { }
