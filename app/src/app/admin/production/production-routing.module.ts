import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionStatusesComponent } from './production-statuses/production-statuses.component';
import { MachinesComponent } from './machines/machines.component';
import { ProductionComponent } from './production.component';
import { WorkorderboardComponent } from './workorderboard/workorderboard.component';


const routes: Routes = [
  {
    path :'',
    component: ProductionComponent
  },
  {
    path :'productionstatuses',
    component: ProductionStatusesComponent
  },
  {
    path :'machines',
    component: MachinesComponent
  },
  {
    path :'workorderboard',
    component: WorkorderboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
