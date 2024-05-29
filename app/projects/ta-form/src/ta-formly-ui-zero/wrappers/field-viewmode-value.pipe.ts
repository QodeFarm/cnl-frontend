import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldValue'
})
export class FieldViewmodeValuePipe implements PipeTransform {

  transform(value: any, field: any, props: any): unknown {
    let result = '---';
    switch (field.type) {
      case 'select':
        if (value){
          result = value[props.dataLabel];
        }
        break;
      default:
        if (value)
          result = value;
        break;
    }

    return result;
  }

}
