import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { formatMoney } from '@ta/ta-core';

/**
 * Read-only money display for Formly summary/total fields.
 * Shows the control value with Indian grouping (20,000.00) but NEVER mutates the
 * model — the value submitted to the backend stays a plain number. Use this only
 * for disabled/computed totals; editable amount inputs must stay `type: 'text'`.
 *
 * Config: `{ key: 'total_amount', type: 'inrDisplay', templateOptions: { currencySymbol: true } }`
 */
@Component({
  selector: 'ta-field-inr-display',
  template: `<div class="ta-inr-display">{{ display }}</div>`,
  styles: [`
  .ta-inr-display { 
    padding: 4px 11px; 
    font-weight: 600; 
    font-size: 20px;
    line-height: 1.6; 
    color: white; 
    background-color: #041a61; 
    border: 1px solid #041a61; 
    border-radius: .25rem;
    display: flex;          /* Change to flex */
    justify-content: flex-end; /* Push content to right */
    width: 100%;            /* Full width */
  }
`]
})
export class TaFieldInrDisplayComponent extends FieldType {
  get display(): string {
    return formatMoney(this.formControl?.value, { symbol: !!(this.to as any)?.currencySymbol });
  }
}
