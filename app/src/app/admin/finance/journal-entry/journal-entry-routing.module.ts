import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalEntryListComponent } from './journal-entry-list/journal-entry-list.component';
import { JournalEntryComponent } from './journal-entry.component';

const routes: Routes = [
  {
    path: '',
    component: JournalEntryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalEntryRoutingModule { }
