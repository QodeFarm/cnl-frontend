import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionStatusesComponent } from './production-statuses/production-statuses.component';
import { MachinesComponent } from './machines/machines.component';
import { WorkorderComponent } from './workorder.component';
import { WorkorderboardComponent } from './workorderboard/workorderboard.component';
import { BomComponent } from './bom/bom.component';


const routes: Routes = [
  {
    path :'',
    component: WorkorderComponent
  },
  {
    path :'production-statuses',
    component: ProductionStatusesComponent
  },
  {
    path :'machines',
    component: MachinesComponent
  },
  {
    path :'workorderboard',
    component: WorkorderboardComponent
  },
  {
    path :'bom',
    component: BomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
