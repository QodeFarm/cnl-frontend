import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsComponent } from './assets.component';
import { AssetStatusesComponent } from './asset-statuses/asset-statuses.component';
import { AssetCategoriesComponent } from './asset-categories/asset-categories.component';
import { LocationsComponent } from './locations/locations.component';
import { AssetMaintenanceComponent } from './asset-maintenance/asset-maintenance.component';

const routes: Routes = [
  {
    path : 'assets',
    component : AssetsComponent
  },
  {
    path : 'asset_statuses',
    component : AssetStatusesComponent 
  },
  {
    path : 'asset_categories',
    component : AssetCategoriesComponent
  },
  {
    path : 'locations',
    component : LocationsComponent
  },
  {
    path : 'asset_maintenance',
    component : AssetMaintenanceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
