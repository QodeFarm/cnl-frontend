import { Pipe, PipeTransform } from '@angular/core';
import { TaFormService } from './ta-form.service';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Pipe({
  name: 'json2formlyFormate'
})
export class Json2formlyFormatePipe implements PipeTransform {
  constructor(private formS: TaFormService){

  }
  transform(value: any, ...args: unknown[]): FormlyFieldConfig[]  {
    return this.formS.getFormlyFormate(value);

  }

}
