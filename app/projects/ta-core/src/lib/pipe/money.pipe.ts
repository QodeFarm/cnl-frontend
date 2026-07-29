import { Pipe, PipeTransform } from '@angular/core';
import { formatMoney } from '../utility';

/**
 * Indian-grouped money for templates: {{ value | inr }} -> 48,42,000.00
 * Pass true for a rupee symbol: {{ value | inr:true }} -> ₹48,42,000.00
 * Pure pipe — Angular memoizes it, so it re-runs only when the value changes.
 */
@Pipe({
  name: 'inr',
  standalone: true,
  pure: true,
})
export class MoneyPipe implements PipeTransform {
  transform(value: any, symbol: boolean = false): string {
    return formatMoney(value, { symbol });
  }
}
