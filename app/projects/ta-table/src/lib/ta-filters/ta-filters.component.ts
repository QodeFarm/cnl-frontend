import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ColumnItem } from '../ta-table-config';

@Component({
  selector: 'ta-filters',
  templateUrl: './ta-filters.component.html',
  styleUrls: ['./ta-filters.component.css']
})
export class TaFiltersComponent implements OnInit {
  @Input() c!: ColumnItem;
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() reset: EventEmitter<any> = new EventEmitter();
  placeholder = "Search";
  filterValue: any;
  filterType = 'text';
  constructor() { }

  ngOnInit(): void {
    // // console.log(typeof this.c.filter);
    this.placeholder = "Search " + this.c.name;

    if (typeof this.c.filter == 'object') {
      if (this.c.filter.type) {
        this.filterType = this.c.filter.type;
      }
      if(this.c.filter.placeholder){
        this.c.filter.placeholder = this.c.filter.placeholder || this.placeholder;
      }else{
        this.c.filter.placeholder = this.placeholder;
      }
    }
 
  }
  setFilter(c: any) {
    this.search.emit(c);
  }
  resetFilter(c: any) {
    this.c.filterValue = null;
    this.search.emit(c);
  }

}
