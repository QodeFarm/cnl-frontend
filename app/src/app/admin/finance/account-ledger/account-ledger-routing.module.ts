import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountLedgerComponent } from './account-ledger.component';

const routes: Routes = [
  {
      path : '',
      component : AccountLedgerComponent 
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountLedgerRoutingModule { }
