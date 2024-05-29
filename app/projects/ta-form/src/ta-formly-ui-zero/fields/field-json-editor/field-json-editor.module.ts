import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldJsonEditorComponent } from './field-json-editor.component';
import { FormlyModule } from '@ngx-formly/core';
// import { AngJsoneditorModule } from '@maaxgr/ang-jsoneditor'
import { ReactiveFormsModule } from '@angular/forms';
import { TaPluginComponent } from '@ta/ta-plugin';


@NgModule({
  declarations: [
    FieldJsonEditorComponent
  ],
  imports: [
    CommonModule,
    TaPluginComponent,
    ReactiveFormsModule,
    FormlyModule.forChild({
      extras: { lazyRender: false },
      types: [
        {
          name: 'json-editor',
          component: FieldJsonEditorComponent,
          wrappers: ['ta-field'],
        },
        {
          name:'json',
          extends:'json-editor'
        }
      ],
    })
  ]
})
export class FieldJsonEditorModule { }
