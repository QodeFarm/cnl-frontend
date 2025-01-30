import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwipesListComponent } from './swipes-list/swipes-list.component';

const routes: Routes = [
  {
    path:"",
    component:SwipesListComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwipesRoutingModule { }
