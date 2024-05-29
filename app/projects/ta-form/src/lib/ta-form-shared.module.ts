import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Json2formlyFormatePipe } from './json2formly-formate.pipe';
import { FormlyModule } from '@ngx-formly/core';



@NgModule({
  declarations: [Json2formlyFormatePipe],
  imports: [
    CommonModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: 'This field is required' }]
  })
  ],
  exports:[
    Json2formlyFormatePipe,
    FormlyModule
  ]
})
export class TaFormSharedModule { }
