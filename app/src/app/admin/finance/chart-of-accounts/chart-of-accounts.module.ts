import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartOfAccountsRoutingModule } from './chart-of-accounts-routing.module';
import { ChartOfAccountsComponent } from './chart-of-accounts.component';
import { ChartOfAccountsListComponent } from './chart-of-accounts-list/chart-of-accounts-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // ChartOfAccountsComponent,
    // ChartOfAccountsListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    ChartOfAccountsRoutingModule
  ]
})
export class ChartOfAccountsModule { }
