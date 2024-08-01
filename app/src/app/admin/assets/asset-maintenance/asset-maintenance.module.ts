import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetMaintenanceRoutingModule } from './asset-maintenance-routing.module';
import { AssetMaintenanceListComponent } from './asset-maintenance-list/asset-maintenance-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    AssetMaintenanceListComponent,
    AssetMaintenanceRoutingModule
  ]
})
export class AssetMaintenanceModule { }


