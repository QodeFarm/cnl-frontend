import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing.module';
import { AssetsComponent } from './assets.component';
import { AssetStatusesComponent } from './asset-statuses/asset-statuses.component';
import { AssetCategoriesComponent } from './asset-categories/asset-categories.component';
import { LocationsComponent } from './locations/locations.component';
import { AssetMaintenanceComponent } from './asset-maintenance/asset-maintenance.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { AssetMaintenanceListComponent } from './asset-maintenance/asset-maintenance-list/asset-maintenance-list.component';


@NgModule({
  declarations: [
    // AssetsComponent,
    AssetStatusesComponent,
    AssetCategoriesComponent,
    LocationsComponent,
    // AssetMaintenanceComponent

  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    AssetsRoutingModule,
    AssetsListComponent,
    AssetMaintenanceListComponent
  ],
  exports:[
    AssetStatusesComponent,
    AssetCategoriesComponent,
    LocationsComponent,
    // AssetMaintenanceComponent
  ]
})
export class AssetsModule { }
