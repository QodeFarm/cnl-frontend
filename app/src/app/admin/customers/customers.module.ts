import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { LedgerAccountsComponent } from './ledger-accounts/ledger-accounts.component';
import { LedgerGroupsComponent } from './ledger-groups/ledger-groups.component';
import { TerritoryComponent } from './territory/territory.component';
import { TransportersComponent } from './transporters/transporters.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { CustomersListComponent } from './customers-list/customers-list.component';


@NgModule({
  declarations: [
    CustomersComponent,
    LedgerAccountsComponent,
    LedgerGroupsComponent,
    TerritoryComponent,
    TransportersComponent,
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    CustomersRoutingModule,
    CustomersListComponent
  ],
<<<<<<< HEAD
  exports:[
    LedgerAccountsComponent,
    LedgerGroupsComponent,
    TerritoryComponent,
    TransportersComponent,
=======
  exports: [
    LedgerAccountsComponent,
    LedgerGroupsComponent,
    TerritoryComponent,
    TransportersComponent
>>>>>>> 90468cd0e9a98a1a0cedcd0b260819287a28ae70
  ]
})
export class CustomersModule { }
