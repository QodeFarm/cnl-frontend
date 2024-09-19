import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalEntryRoutingModule } from './journal-entry-routing.module';
import { JournalEntryComponent } from './journal-entry.component';
import { JournalEntryListComponent } from './journal-entry-list/journal-entry-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    JournalEntryComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,    
    JournalEntryRoutingModule,
    JournalEntryListComponent
  ]
})
export class JournalEntryModule { }
