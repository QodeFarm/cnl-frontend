import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { getListParamsQuery } from '@ta/ta-core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { TaTableService } from '../../ta-table.service';
import { ColumnItem } from '../../ta-table-config';

@Component({
  selector: 'ta-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.css']
})
export class SelectFilterComponent implements OnInit {
  @Input() col: ColumnItem | any;
  searchChange$ = new BehaviorSubject('');
  optionList: string[] = [];
  selectedUser?: string;
  isLoading = false;
  isLoading$ = new BehaviorSubject<boolean>(false);
  serverSearch = false;
  lazySelectedItem: any;
  dataKey: any;
  multiple = true;
  options = [
    {
      label: "KBS-hyd",
      value: 'kbs'
    },
    {
      label: "KBS-hyd",
      value: 'kbss'
    },
    {
      label: "KBS-hyd",
      value: 'r'
    },
    {
      label: "KBS-hyd",
      value: 'd'
    },
    {
      label: "KBS-hyd",
      value: 'kbfs'
    },
    {
      label: "KBS-hyd",
      value: 'kbsss'
    }
  ];
  // searchChange$ = new BehaviorSubject('');
  // optionList: string[] = [];
  // selectedUser?: string;
  // isLoading = false;
  // isLoading$ = new BehaviorSubject<boolean>(false);
  // serverSearch = false;
  // lazySelectedItem: any;
  filter: any;
  constructor(private http: HttpClient, private ts: TaTableService) {
  }
  ngOnInit() {
    this.filter = this.col.filter;
    if (!this.col.filterValue) {
      // this.col.filterValue = [];
    }
    if (this.filter.lazy && this.filter.lazy.url) {
       this.lazyService();
    }
    if (this.filter.lazy && !this.filter.lazy.lazyOneTime) {
      this.serverSearch = true;
    }

  }

  defaultOptions = {
    templateOptions: { options: [] },
  };
  changeValue(event: any) {
    this.col.filterValue = event;
    this.col.filter.operator = '$in';
  }
  compareFn = (o1: any, o2: any) => {
    if (this.filter.dataKey && o1 && o2) {
      return o1[this.filter.dataKey] === o2[this.filter.dataKey];
    } else {
      return o1 === o2;
    }
  };
  onSearch(value: string): void {
    if (this.filter.lazy && !this.filter.lazy.lazyOneTime) {
      this.isLoading = true;
      this.isLoading$.next(true);
      this.searchChange$.next(value);
    }
  }
  lazyService() {
    const getRandomNameList = (searchValue: string) => {
      let globalSearch: any;
      if (this.filter.lazy.filters && this.filter.lazy.filters.searchKeys) {
        globalSearch = { keys: this.filter.lazy.filters.searchKeys, value: searchValue }
      }
      const pageSize = (this.filter.lazyOneTime) ? 100 : 40;
      const q = getListParamsQuery({ globalSearch: globalSearch, fixedFilters: this.filter.lazy.fixedFilters, pageSize: pageSize });

      return this.http
        .get(`${this.filter.lazy.url}?` + q)
        .pipe(
          catchError(() => of({ results: [] })),
          map((res: any) => res.data || [])
        )
        .pipe(map((list: any) => list.map((item: any) => {
          // let labelKey = this.filter.dataLabel || 'label'; 
          // let label = item[labelKey as string];
          // if(this.filter.labelMapFn){
          //   label = this.filter.labelMapFn(item);
          // }
          // return {label:label,value:item}
          return this.itemMapping(item);
        })));


    }
    if (this.filter.lazy && this.filter.lazy.url) {
      const optionList$: Observable<any[]> = this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getRandomNameList));
      optionList$.subscribe(data => {
        this.isLoading = false;
        this.filter.options = data;
        this.isLoading$.next(false);

      });
    }
  }
  itemMapping(item: any) {
    let labelKey = this.filter.dataLabel || 'label';
    let label = item[labelKey as string];
    if (this.filter.labelMapFn) {
      label = this.filter.labelMapFn(item);
    }
    return { label: label, value: label }
  }

}
