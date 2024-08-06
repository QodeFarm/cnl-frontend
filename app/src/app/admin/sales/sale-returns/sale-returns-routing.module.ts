import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleReturnsComponent } from './sale-returns.component';
import { SaleReturnsListComponent } from './sale-returns-list/sale-returns-list.component';

const routes: Routes = [
  {
    path: '',
    component: SaleReturnsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleReturnsRoutingModule { }
