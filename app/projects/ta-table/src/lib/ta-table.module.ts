import { ComponentFactory, ComponentFactoryResolver, ComponentRef, NgModule, ViewContainerRef } from '@angular/core';
import { TaTableComponent } from './ta-table.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { TableActionsComponent } from './table-actions/table-actions.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { TaTableService } from './ta-table.service';
import { TableCellDynamicComponent } from './table-cell-dynamic/table-cell-dynamic.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { TaFiltersComponent } from './ta-filters/ta-filters.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { SelectFilterComponent } from './ta-filters/select-filter/select-filter.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DateRangeFilterComponent } from './ta-filters/date-range-filter/date-range-filter.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
@NgModule({
  declarations: [
    TaTableComponent,
    TableActionsComponent,
    TableCellDynamicComponent,
    TaFiltersComponent,
    SelectFilterComponent,
    DateRangeFilterComponent
  ],
  imports: [
    NzInputModule,
    CommonModule,
    NzPopconfirmModule,
    FormsModule,
    NzTableModule,
    NzDropDownModule,
    NzIconModule,
    NzButtonModule,
    NzGridModule,
    NzDividerModule,
    NzSpaceModule,
    NzSelectModule,
    NzDatePickerModule
  ],
  providers: [TaTableService],
  exports: [
    TaTableComponent
  ]
})
export class TaTableModule {
  static rootComponent = TaTableComponent;
  // constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
  // public resolveComponent(): ComponentFactory<TaTableComponent> {
  //   return this.componentFactoryResolver.resolveComponentFactory(TaTableComponent);
  // }
  // constructor(private viewContainerRef: ViewContainerRef) { }
  // public resolveComponent(): ComponentRef<TaTableComponent> {
  //   return this.viewContainerRef.createComponent(TaTableComponent);
  // }
}
