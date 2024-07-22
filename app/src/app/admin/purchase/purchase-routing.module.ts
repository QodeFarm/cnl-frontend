import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseComponent } from './purchase.component';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';

const routes: Routes = [
  {
    path: 'purchase',
    component: PurchaseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
