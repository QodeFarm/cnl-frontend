import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { LedgerAccountsComponent } from './ledger-accounts/ledger-accounts.component';
import { LedgerGroupsComponent } from './ledger-groups/ledger-groups.component';
import { TerritoryComponent } from './territory/territory.component';
import { TransportersComponent } from './transporters/transporters.component';
import { CustomerCategoriesComponent } from './customer-categories/customer-categories.component';

const routes: Routes = [
  {
    path : '',
    component : CustomersComponent
  },
  {
    path : 'ledger_accounts',
    component : LedgerAccountsComponent
  },
  {
    path : 'ledger_groups',
    component : LedgerGroupsComponent
  },
  {
    path : 'customer_categories',
    component : CustomerCategoriesComponent
  },
  // {
  //   path : 'territory',
  //   component : TerritoryComponent
  // },
  {
    path : 'transporters',
    component : TransportersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
