import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, ComponentFactory, NgModule, forwardRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { TaCoreModule } from '@ta/ta-core';
import { TaFormlyUiZeroModule } from '../ta-formly-ui-zero/ta-formly-ui-zero.module';
import { FormlyModule } from '@ngx-formly/core';
//import { TaPageBuilderModule } from '@ta/ta-page-builder';
// import { TaPluginComponent } from '@ta/ta-plugin';
// import { FormlyModule } from '@ta/ta-formly-core';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    TaCoreModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzLayoutModule,
    NzFormModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'minLength', message: 'invalid Field' },
        { name: 'maxLength', message: 'invalid Field' }
      ],
      extras: {
        checkExpressionOn: 'changeDetectionCheck'
      }
    })
  ],
  exports: [
  ]
})
export class TaFormModule {
  //static rootComponent = TaFormComponent;
  // constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
  // public resolveComponent(): ComponentFactory<TaFormComponent> {
  //   return this.componentFactoryResolver.resolveComponentFactory(TaFormComponent);
  // }
}
