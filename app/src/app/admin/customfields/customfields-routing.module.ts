import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomfieldsComponent } from './customfields.component';
import { CustomersListComponent } from '../customers/customers-list/customers-list.component';
import { CustomfieldsListComponent } from './customfields-list/customfields-list.component';

const routes: Routes = [
  {
    path : '',
    component: CustomfieldsComponent,
  },
  // {
  //   path : '',
  //   component: CustomfieldsListComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomfieldsRoutingModule { }
