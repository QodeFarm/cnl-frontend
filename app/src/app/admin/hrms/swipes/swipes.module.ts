import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SwipesRoutingModule } from './swipes-routing.module';
import { SwipesComponent } from './swipes.component';
import { SwipesListComponent } from './swipes-list/swipes-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    SwipesComponent,
    AdminCommmonModule,
    SwipesListComponent
  ],
  imports: [
    CommonModule,
    SwipesRoutingModule
  ]
})
export class SwipesModule { }
