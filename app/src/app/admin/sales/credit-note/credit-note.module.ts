import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditNoteRoutingModule } from './credit-note-routing.module';
import { CreditNoteListComponent } from './credit-note-list/credit-note-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { CreditNoteComponent } from './credit-note.component';


@NgModule({
  declarations: [
    CreditNoteComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    CreditNoteRoutingModule,
    CreditNoteListComponent
  ]
})
export class CreditNoteModule { }
