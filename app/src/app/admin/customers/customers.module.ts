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
import { CustomerPaymentTermsComponent } from './customer-payment-terms/customer-payment-terms.component';


@NgModule({
  declarations: [
    CustomersComponent,
    LedgerAccountsComponent,
    LedgerGroupsComponent,
    TerritoryComponent,
    TransportersComponent,
    CustomerPaymentTermsComponent,
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    CustomersRoutingModule,
    CustomersListComponent
  ],
  exports: [
    LedgerAccountsComponent,
    LedgerGroupsComponent,
    TerritoryComponent,
    TransportersComponent,
    CustomerPaymentTermsComponent
  ]
})
export class CustomersModule { }
