import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import * as _ from 'lodash';
import moment from 'moment';
interface Filter {
  key?: string,
  value?: any,
  operator?: string
}
export interface TaParamsConfig {
  pageIndex?: number;
  pageSize?: number;
  sort?: any;
  filters?: Array<{ key: string; value: string[] }> | null;
  globalSearch?: { keys: [], value: string } | any;
  fixedFilters?: Filter[];
}

export function getListParamsQuery2(globalSearch?: { keys: [], value: string }, sort?: any, filters?: any, pageIndex?: number,
  pageSize?: number): string {
  let queryString = RequestQueryBuilder.create();
  queryString.setPage(pageIndex || 1);
  queryString.setLimit(pageSize || 20);
  if (sort && sort.key) {
    const order = (sort.value == 'ascend') ? 'ASC' : 'DESC';
    queryString.sortBy({ field: sort.key, order: order });
  }

  if (globalSearch && globalSearch.keys && globalSearch.keys.length > 0) {
    globalSearch.keys.forEach((key: any) => {
      if (globalSearch.value) {
        queryString.setOr({
          field: key,
          operator: CondOperator.CONTAINS,
          value: globalSearch.value
        })
      }
    });
  }
  if (filters) {
    filters.forEach((item: any) => {
      if (item.value)
        queryString.setFilter({
          field: item.key,
          operator: CondOperator.CONTAINS,
          value: item.value
        })
    });
  }

  return queryString.query(false);
}
export const TaLocalStorage = {

  setItem: (key: string, value: any) => {
    const _value = JSON.stringify(value);
    localStorage.setItem(key, _value);
  },
  getItem: (key: string) => {
    return JSON.parse(localStorage.getItem(key) as string);
  },
  removeItem: (key: string) => {
    return localStorage.removeItem(key);
  },
  clearAll() {
    return localStorage.clear();
  }

}

export function getListParamsQuery(qParams: TaParamsConfig): string {
  let queryString = RequestQueryBuilder.create();
  const pageIndex = (qParams.pageIndex) ? qParams.pageIndex : 1;
  const pageSize = (qParams.pageSize) ? qParams.pageSize : 40;
  queryString.setPage(pageIndex);
  queryString.setLimit(pageSize);
  if (qParams.sort && qParams.sort.key) {
    const order = (qParams.sort.value == 'ascend') ? 'ASC' : 'DESC';
    queryString.sortBy({ field: qParams.sort.key, order: order });
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
      if (item.value && itemCondition)
        queryString.setFilter({
          field: item.key,
          operator: CondOperator.EQUALS,
          value: item.value
        })
    });
  }


  if (qParams.globalSearch && qParams.globalSearch.value && qParams.globalSearch.keys && qParams.globalSearch.keys.length > 0) {
    if (qParams.globalSearch.value) {
      const searchArry: any = [];
      const fixedArry: any = [];
      qParams.globalSearch.keys.forEach((key: any) => {
        const searchF = {
          [key]: {
            "$cont": qParams.globalSearch.value
          }
        }
        searchArry.push(searchF)
      });
      queryString.search({ $or: searchArry });
    }
  } else {
    if (qParams.filters) {
      qParams.filters.forEach((item: any) => {
        if (item.value)
          queryString.setFilter({
            field: item.key,
            operator: CondOperator.CONTAINS,
            value: item.value
          })
      });
    }
  }
  return queryString.query(false);
}
export function getValue(object: any, value: string) {
  return _.get(object, value);
}

export function cloneObject(object: any) {
  return _.cloneDeep(object);
}
export function cloneJson(object: any) {
  return JSON.parse(JSON.stringify(object));
}
export function getDBDateFormate(value: any) {
  return moment(value).format('YYYY-MM-DD');
}
export function evalFnBK(str:string,...data:any){
  return eval(str); 
}

export function evalFn(script: string, arg:any, returnValue = false) {
  try {
      if (returnValue)
          script = 'return ' + script + ';';
      const argKeys = Object.keys(arg); // get arg keys
      const argKeysString = argKeys.join(); // keys convert string
      const argValue = argKeys.map(argKey => arg[argKey]) || []; // get arg array
      const fun = new Function(argKeysString, script);
      return fun(...argValue);
  } catch (error) {
      if (returnValue) {
          return false;
      }
      console.error('zcUtils evalFun', script, error);
  }

}

export function getValueByObject(obj:any, valuekey:any) {
  const keys = valuekey.split('.');
  return keys.reduce((prev:any, key:any) => prev[key], obj);
}


