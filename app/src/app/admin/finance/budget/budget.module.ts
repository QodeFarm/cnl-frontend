import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetComponent } from './budget.component';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // BudgetComponent,
    // BudgetListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    BudgetRoutingModule
  ]
})
export class BudgetModule { }
