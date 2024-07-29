import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales.component';
import { SaleReturnsComponent } from './sale-returns/sale-returns.component';
import { SaleReturnsListComponent } from './sale-returns/sale-returns-list/sale-returns-list.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent
  },
  {
    path: 'sale-returns',
    component: SaleReturnsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
