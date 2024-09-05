import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowComponent } from './workflow.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';

const routes: Routes = [
  {
    path : '',
    component: WorkflowComponent,
  },
  {
    path : '',
    component: WorkflowListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
