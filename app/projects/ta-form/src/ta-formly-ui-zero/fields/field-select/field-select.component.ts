import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { getListParamsQuery } from 'projects/ta-core/src/lib/utility';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ta-field-select',
  templateUrl: './field-select.component.html',
  styleUrls: ['./field-select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldSelectComponent extends FieldType implements OnInit {

  randomUserUrl = 'lco';
  searchChange$ = new BehaviorSubject('');
  optionList: string[] = [];
  selectedUser?: string;
  isLoading = false;
  isLoading$ = new BehaviorSubject<boolean>(false);
  serverSearch = false;
  lazySelectedItem: any;

  constructor(private http: HttpClient) {
    super();
  }
  ngOnInit() {
    if (this.field.type == 'lookup') {
      if (this.props.lookup) {
        this.props.lazy = {
          url: 'table-data/' + this.props.lookup.from
        }
        this.props.dataKey = this.props.lookup.foreignField;
        this.props.dataLabel = 'Full Name'; //this.props.lookup.foreignField;
      }
    }
    if (this.props.lazy && this.props.lazy.url) {
      this.lazyService();
    }
    if (this.props.lazy && !this.props.lazy.lazyOneTime) {
      this.serverSearch = true;
    }
    this.formControl.valueChanges.subscribe(res => {
      if (this.formControl.value) {
        this.lazySelectedItem = this.itemMapping(this.formControl.value);
      }
    })

  }

  defaultOptions = {
    templateOptions: { options: [] },
  };
  compareFn = (o1: any, o2: any) => {
    if (this.props.dataKey && o1 && o2) {
      return o1[this.props.dataKey] === o2[this.props.dataKey];
    } else {
      return o1 === o2;
    }
  };
  onSearch(value: string): void {
    if (this.props.lazy && this.props.lazy.url && !this.props.lazy.lazyOneTime) {
      this.isLoading = true;
      this.isLoading$.next(true);
      this.searchChange$.next(value);
    }
  }
  lazyService() {
    const getRandomNameList = (searchValue: string) => {
      let globalSearch: any;
      if (this.props.lazy.filters && this.props.lazy.filters.searchKeys) {
        globalSearch = { keys: this.props.lazy.filters.searchKeys, value: searchValue }
      }
      const pageSize = (this.props.lazyOneTime) ? 100 : 40;
      const q = getListParamsQuery({ globalSearch: globalSearch, fixedFilters: this.props.lazy.fixedFilters, pageSize: pageSize });

      return this.http
        .get(`${this.props.lazy.url}?` + q)
        .pipe(
          catchError(() => of({ results: [] })),
          map((res: any) => res.data || res || [])
        )
        .pipe(map((list: any) => list.map((item: any) => {
          // let labelKey = this.props.dataLabel || 'label';
          // let label = item[labelKey as string];
          // if(this.props.labelMapFn){
          //   label = this.props.labelMapFn(item);
          // }
          // return {label:label,value:item}
          return this.itemMapping(item);
        })));


    }

    const optionList$: Observable<any[]> = this.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(getRandomNameList));
    optionList$.subscribe(data => {
      this.isLoading = false;
      this.props.options = data;
      this.isLoading$.next(false);

    });
  }
  itemMapping(item: any) {
    let labelKey = this.props.dataLabel || 'label';
    let label = item[labelKey as string];
    if (this.props.labelMapFn) {
      label = this.props.labelMapFn(item);
    }
    return { label: label, value: item }
  }
}
