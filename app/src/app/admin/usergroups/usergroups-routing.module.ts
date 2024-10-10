import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsergroupsComponent } from './usergroups.component';
import { UserGroupMembersComponent } from './user-group-members/user-group-members.component';

const routes: Routes = [
  {
    path : 'user-groups',
    component : UsergroupsComponent
  },
  {
    path : 'user-group-members',
    component : UserGroupMembersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsergroupsRoutingModule { }
