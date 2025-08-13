import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaCurdModule } from '@ta/ta-curd';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TaCurdModule
  ],
  exports: [TaCurdModule]
})
export class FieldSharedModulesModule { }
