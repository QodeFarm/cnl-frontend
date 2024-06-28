import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldFileComponent } from './field-file.component';
// import { TaPluginComponent } from '@ta/ta-plugin';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TaFileUploadComponent } from './ta-file-upload/ta-file-upload.component';



@NgModule({
  declarations: [
    FieldFileComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, TaFileUploadComponent, FormlyModule.forChild({
    extras: {
      checkExpressionOn: 'changeDetectionCheck'
    },
    types: [
      {
        name: 'file',
        component: FieldFileComponent,
        wrappers: ['ta-field'],
      },
      {
        name: 'attachment',
        extends: 'file'
      }
    ]
  })
  ]
})
export class FieldFileModule { }
