import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetMaintenanceListComponent } from './asset-maintenance-list/asset-maintenance-list.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: AssetMaintenanceListComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetMaintenanceRoutingModule { }
