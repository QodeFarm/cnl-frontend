import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionStatusesComponent } from './production-statuses/production-statuses.component';
import { MachinesComponent } from './machines/machines.component';
import { WorkorderComponent } from './workorder.component';
import { WorkorderboardComponent } from './workorderboard/workorderboard.component';
import { BomComponent } from './bom/bom.component';
import { MaterialIssueComponent } from './material-issue/material-issue.component';
import { MaterialReceivedComponent } from './material-received/material-received.component';
import { ProductionFloorsComponent } from './production-floors/production-floors.component';
import { StockSummaryComponent } from './stock-summary/stock-summary.component';


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
  },
  {
    path :'material-issue',
    component: MaterialIssueComponent
  },
  {
    path :'material-received',
    component: MaterialReceivedComponent
  },
  {
    path :'production-floors',
    component: ProductionFloorsComponent
  },
  {
    path :'stock-summary',
    component: StockSummaryComponent

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
