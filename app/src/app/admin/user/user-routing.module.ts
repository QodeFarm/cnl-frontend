import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { RoleComponent } from './role/role.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent
  },
  {
    path: 'roles',
    component: RoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
