import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickpacksRoutingModule } from './quickpacks-routing.module';
import { QuickpacksComponent } from './quickpacks.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { QuickpacksListComponent } from './quickpacks-list/quickpacks-list.component';


@NgModule({
  declarations: [
    // QuickpacksComponent,
  ],
  imports: [
    CommonModule,
    QuickpacksRoutingModule,
    AdminCommmonModule,
    QuickpacksListComponent
  ]
})
export class QuickpacksModule { }
