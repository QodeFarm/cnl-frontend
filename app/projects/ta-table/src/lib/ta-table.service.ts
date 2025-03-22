import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaParamsConfig } from './ta-table-config';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as FileSaver from 'file-saver';

@Injectable()
export class TaTableService {

  randomUserUrl = 'users';
  actionSubject = new Subject();
  filterSubject = new Subject();
  constructor(private http: HttpClient) { }
  getTableData(arg: TaParamsConfig): Observable<any> {

    let queryString: string = this.getParamsQuery(arg);
    const expKey = arg.apiUrl.includes('?') ? '&' : '?';
    return this.http
      .get<{ results: any[] }>(`${arg.apiUrl}${expKey}${queryString}`);
  }
  deleterow(apiUrl: string, row: any, options?: any) {
    if (row[options.pkId]) {
      return this.http.delete(apiUrl + '/' + row[options.pkId]);
    }
    return null;
  }
  getParamsQuery(qParams: TaParamsConfig): string {
    let queryString = RequestQueryBuilder.create();
    // RequestQueryBuilder.setOptions({
    //   delim: "||",
    //   delimStr: ",",
    //   paramNamesMap: {
    //     fields: ["fields", "select"],
    //     search: "s",
    //     filter: ["filter", "filter"],
    //     or: ["or[]", "or"],
    //     join: ["join[]", "join"],
    //     sort: ["sort[]", "sort"],
    //     limit: ["per_page", "limit"],
    //     offset: ["offset"],
    //     page: ["page"],
    //     cache: ["cache"]
    //   }
    // });
    queryString.setPage(qParams.pageIndex);
    queryString.setLimit(qParams.pageSize);
    if (qParams.sort && qParams.sort.key) {
      const order = (qParams.sort.value == 'ascend') ? 'ASC' : 'DESC';
      queryString.sortBy({ field: qParams.sort.key, order: order });
    }




    if (qParams.globalSearch && qParams.globalSearch.value && qParams.globalSearch.keys && qParams.globalSearch.keys.length > 0) {
      // queryString.search(globalSearch);
      // queryString.search({ "$or": [{ "isActive": false }, { "updatedAt": { "$notnull": true } }] })


      if (qParams.globalSearch.value) {
        const searchArry: any = [];
        const fixedArry: any = [];
        //mysql search
        // qParams.globalSearch.keys.forEach((key: any) => {
        //   const searchF = {
        //     [key]: {
        //       "$cont": qParams.globalSearch.value
        //     }
        //   }
        //   searchArry.push(searchF)
        // });
        // mongo search
        qParams.globalSearch.keys.forEach((key: any) => {
          const searchF = {
            [key]: qParams.globalSearch.value
          }
          searchArry.push(searchF)
        });
        const fixedF: any = [];
        if (qParams.fixedFilters) {

          qParams.fixedFilters.forEach((item: any) => {
            let itemCondition = true;
            if (item.conditionFn) {
              itemCondition = item.conditionFn();
            }
            if (item.valueFn) {
              item.value = item.valueFn();
            }
            if (item.value && itemCondition) {
              const searchF = {
                [item.key]: {
                  "$eq": item.value
                }
              }
              searchArry.push(searchF)
            }
            // if (item.value)
            //   queryString.setFilter({
            //     field: item.key,
            //     operator: CondOperator.EQUALS,
            //     value: item.value
            //   })
          });
        }
        // mysql
        // queryString.search({ $or: searchArry });
        // monodb
        queryString.search(searchArry);
      }

      // qParams.globalSearch.keys.forEach((key: any) => {
      //   if (qParams.globalSearch.value) {
      //     queryString.setOr({
      //       field: key,
      //       operator: CondOperator.CONTAINS,
      //       value: qParams.globalSearch.value
      //     })
      //   }
      // });
    } else {

    }
    if (qParams.filters) {
      qParams.filters.forEach((item: any) => {
        if (item.value)
          queryString.setFilter({
            field: item.key,
            operator: item.operator || CondOperator.CONTAINS,
            value: item.value
          })
      });
    }
    if (qParams.fixedFilters) {
      qParams.fixedFilters.forEach((item: any) => {

        let itemCondition = true;
        if (item.conditionFn) {
          itemCondition = item.conditionFn();
        }
        if (item.valueFn) {
          item.value = item.valueFn();
        }
        if (item.value && itemCondition) {
          // queryString.setFilter({
          //   field: item.key,
          //   operator: CondOperator.EQUALS,
          //   value: item.value
          // })
        }
      });
    }
    return queryString.query(true)
  }
  actionObserval(): Observable<any> {
    return this.actionSubject.asObservable();
  }
  actionChange(action: any) {
    this.actionSubject.next(action);
  }

  filterObserval(): Observable<any> {
    return this.actionSubject.asObservable();
  }
  filterChange(filter: any) {
    this.filterSubject.next(filter);
  }


  public exportDataAsExcelFile(json: any[], excelFileName: string): void {

    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  public exportTableAsExcelFile(elementTable: any, excelFileName: string): void {

    const myworksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(elementTable);
    const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_exported' + EXCEL_EXTENSION);
  }


}
