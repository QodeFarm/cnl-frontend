import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TaskPrioritiesComponent } from './task-priorities/task-priorities.component';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent
  },
  {
    path: 'task_priorities',
    component: TaskPrioritiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
