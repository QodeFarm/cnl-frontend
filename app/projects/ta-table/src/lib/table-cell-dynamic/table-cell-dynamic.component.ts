import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { evalFn } from '@ta/ta-core';

@Component({
  selector: 'ta-table-cell-dynamic',
  templateUrl: './table-cell-dynamic.component.html',
  styleUrls: ['./table-cell-dynamic.component.css'],
  providers: [DatePipe, CurrencyPipe]
})
export class TableCellDynamicComponent implements OnInit {
  @Input() options: any;
  @Input() col: any;
  @Input() row: any;
  @Input() value: any;
  html!: any;
  showEditContain = false;
  constructor(public datepipe: DatePipe, public currency: CurrencyPipe) { }

  ngOnInit(): void {
    switch (this.col.displayType) {
      case 'map':
        try {
          if (typeof this.col.mapFn == 'function') {
            this.html = this.col.mapFn(this.value, this.row, this.col);
          }
          if (typeof this.col.mapFn == 'string') {
            this.html = evalFn(this.col.mapFn, { value: this.value, row: this.row, col: this.col }, true);
          }
        } catch (error) {
          console.log('error', error);
        }
        break;
      case 'date':
        this.html = this.datepipe.transform(this.value, this.col.dateFormat || 'MMM d, y');
        break;
      case 'datetime':
        this.html = this.datepipe.transform(this.value, this.col.dateFormat || 'MMM d, y h:mm a');
        break;
      case 'time':
        this.html = this.datepipe.transform(this.value, this.col.dateFormat || 'h:mm a');
        break;
      case 'currency':
        this.html = this.currency.transform(this.value, 'INR');
        break;

      default:
        this.html = this.row[this.col.fieldKey];
        break;
    }
  }
  saveCell() {
    this.showEditContain = false;
  }
}
