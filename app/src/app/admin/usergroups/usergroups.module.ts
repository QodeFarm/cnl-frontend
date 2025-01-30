import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsergroupsRoutingModule } from './usergroups-routing.module';
import { UsergroupsComponent } from './usergroups.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { UserGroupMembersComponent } from './user-group-members/user-group-members.component';


@NgModule({
  declarations: [
    // UsergroupsComponent
    // UserGroupMembersComponent
  ],
  imports: [
    UsergroupsComponent,
    UserGroupMembersComponent,
    CommonModule,
    UsergroupsRoutingModule,
    AdminCommmonModule
  ],
    exports:[
      UsergroupsComponent,
      UserGroupMembersComponent
    ]
  
})
export class UsergroupsModule { }
