import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concat',
  pure:true
})
export class ConcatPipe implements PipeTransform {

  transform(value: any,args = []): unknown {
    // console.log('va',value, args);
    return this.replacePlaceholders(args, value);;
  }
  replacePlaceholders(placeholders: string[], data: any): string {
    function getValueByPath(obj: any, path: string): any {
        const keys: string[] = path.split('.');
        let value: any = obj;

        for (const key of keys) {
            if (value.hasOwnProperty(key)) {
                value = value[key];
            } else {
                return null;
            }
        }

        return value;
    }

    return placeholders.map(item => {
        if (item.startsWith("$")) {
            const placeholderValue = getValueByPath(data, item.slice(1));
            return placeholderValue !== null ? placeholderValue : '';
        } else {
            return item;
        }
    }).join('');
}

}
