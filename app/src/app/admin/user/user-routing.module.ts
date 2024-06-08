import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { RolesComponent } from './roles/roles.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent
  },
  {
    path: 'roles',
    component: RolesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
