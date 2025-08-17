import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  loading = false;
  html!: any;
  showEditContain = false;
  inputValue = '';
  constructor(public datepipe: DatePipe, public currency: CurrencyPipe, private http: HttpClient) { }

  ngOnInit(): void {
    this.loading = false;
    this.inputValue = this.value;
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

    if (this.col && this.col.autoSave && typeof this.col.autoSave.apiUrl) {
      this.loading = true;
      const body = this.col.autoSave.body ? this.col.autoSave.body(this.row, this.inputValue, this.col) : this.row;
      this.http[this.col.autoSave.method || 'put'](this.col.autoSave.apiUrl, body).subscribe((res: any) => {
        this.loading = false;
        if (res && res.status === 'success' || res.data) {
          this.value = this.inputValue;
          this.row[this.col.fieldKey] = this.value;
          this.cancelCell();
          // Handle success response
        }
      }, (error) => {
        this.loading = false;
        console.error('Error saving cell:', error);
      });
    } else {
      this.value = this.inputValue;
      this.row[this.col.fieldKey] = this.value;
      if (this.col.isEditSumbmit) {
        this.col.isEditSumbmit(this.row, this.value, this.col);
        this.cancelCell();
      };
    }
  }
  cancelCell() {
    this.showEditContain = false;
    this.ngOnInit();
  }
}
