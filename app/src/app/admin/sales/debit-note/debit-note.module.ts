import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebitNoteRoutingModule } from './debit-note-routing.module';
import { DebitNoteComponent } from './debit-note.component';
import { DebitNoteListComponent } from './debit-note-list/debit-note-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    DebitNoteComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    DebitNoteRoutingModule,
    DebitNoteListComponent
  ]
})
export class DebitNoteModule { }
