import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankAccountComponent } from './bank-account.component';
import { BankAccountListComponent } from './bank-account-list/bank-account-list.component';

const routes: Routes = [
  {
    path : '',
    component : BankAccountListComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankAccountRoutingModule { }
