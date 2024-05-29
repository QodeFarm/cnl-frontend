import { Component, Input, OnInit } from '@angular/core';
import { getDBDateFormate } from '@ta/ta-core';
import * as _ from 'lodash';
import { TaTableService } from '../../ta-table.service';
import { ColumnItem } from '../../ta-table-config';

@Component({
  selector: 'ta-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.css']
})
export class DateRangeFilterComponent implements OnInit {
  @Input() col: ColumnItem | any;
  date = null;
  constructor(private ts: TaTableService) { }
  ngOnInit(): void {
  }
  onChange(result: Date[]): void {
    let r: any = [];
    if (result[0] && result[1]) {
      this.col.filterValue = result.map((r: any, i) => {
        let time = '00:00:00';
        if (i == 1) {
          time = '23:59:00';
        }
        return getDBDateFormate(r) + ' ' + time;
      });
    };

    this.col.filter.operator = '$between';
    if (this.col.filterValue.length > 0)
      this.ts.filterChange(this.col)
  }

  getWeek(result: Date[]): void {
    // // console.log('week: ', result.map(getISOWeek));
  }

}
