import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockjournalComponent } from './stockjournal.component';

const routes: Routes = [
  {
    path: '',
    component: StockjournalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockjournalRoutingModule { }