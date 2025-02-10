import { ComponentFactory, ComponentFactoryResolver, NgModule } from '@angular/core';
import { TaFormComponent } from '@ta/ta-form';
import { TaTableModule } from '@ta/ta-table';
import { TaCurdComponent } from './ta-curd.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { TaCoreModule } from '@ta/ta-core';
import { TaCurdModalComponent } from './ta-curd-modal/ta-curd-modal.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
    declarations: [
        TaCurdComponent,
        TaCurdModalComponent
    ],
    imports: [
        CommonModule,
        TaCoreModule,
        TaTableModule,
        TaFormComponent,
        NzGridModule,
        NzCardModule,
        NzIconModule,
        NzDrawerModule,
        NzButtonModule,
        NzModalModule
    ],
    exports: [
        TaCurdComponent,
        TaCurdModalComponent
    ]
})
export class TaCurdModule {
    static rootComponent = TaCurdModalComponent;
    // constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
    // public resolveComponent(): ComponentFactory<TaCurdModalComponent> {
    //   return this.componentFactoryResolver.resolveComponentFactory(TaCurdModalComponent);
    // }
}
