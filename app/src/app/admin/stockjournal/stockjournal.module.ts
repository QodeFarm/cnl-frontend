import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

import { StockjournalRoutingModule } from './stockjournal-routing.module';
import { StockjournalComponent } from './stockjournal.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminCommmonModule,
    StockjournalRoutingModule,
  ]
})
export class StockjournalModule { }
