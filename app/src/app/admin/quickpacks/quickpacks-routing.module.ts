import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickpacksComponent } from './quickpacks.component';

const routes: Routes = [
  {
    path: '',
    component: QuickpacksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickpacksRoutingModule { }
