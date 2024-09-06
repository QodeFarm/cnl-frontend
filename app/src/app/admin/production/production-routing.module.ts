import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillOfMaterialsComponent } from './bill-of-materials/bill-of-materials.component';
import { ProductionStatusesComponent } from './production-statuses/production-statuses.component';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { InventoryComponent } from './inventory/inventory.component';
import { MachinesComponent } from './machines/machines.component';
import { LaborComponent } from './labor/labor.component';


const routes: Routes = [
  {
    path :'billofmaterials',
    component: BillOfMaterialsComponent
  },
  {
    path :'productionstatuses',
    component: ProductionStatusesComponent
  },
  {
    path :'workorders',
    component: WorkOrdersComponent
  },
  {
    path :'inventory',
    component: InventoryComponent
  },
  {
    path :'machines',
    component: MachinesComponent
  },
  {
    path :'labor',
    component: LaborComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
