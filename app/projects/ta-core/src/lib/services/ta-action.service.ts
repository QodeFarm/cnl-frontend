import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { DomSanitizer, SafeScript } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class TaActionService {
  public stateAction: any = new Subject();
  constructor(private router: Router, private http: HttpClient, private sanitizer: DomSanitizer) {

  }

  async doActions(actions?: [], data?: any) {
    for (let index = 0; index < actions.length; index++) {
      const action = actions[index];
      return this.doAction(action, data);
    }
  }

  async doAction(action?: any, data?: any) {
    switch (action.type) {
      case 'page':
        this.goToPage(action.page, data);
        break;
      case 'api':
        const res = await this.getApiData(action.api,data);
        return res;
      case 'callBackFn':
        return action.callBackFn(data, action);
      case 'script':
        return this.executeExpression(action.script, data);
      default:
        break;
    }
  }

  async getApiData(api: any,data?:any) {
    let payload = {};
    let params;
    let queryParams;
    let result: any;
    let response:any;
    if (api.params) {
      params = this.getParams(api.params, {});
    }
    if (api.queryParams) {
      queryParams = this.getParams(api.queryParams, {});
    }
    switch (api.method) {
      case 'post':
        response = this.http.post(api.url, params);
        break;

      default: //get methode
        const paramsKeys = Object.keys(params);
        if (paramsKeys.length > 0) {
          paramsKeys.forEach((key, index) => {
            api.url += '/' + params[key];
          });
        }
        response = this.http.get(api.url, { params: queryParams });
        break;
    }

    // const response = this.http.get(api.url, { params: payload });
    result = await lastValueFrom(response);
    if (api.virableName) {
      window['page']['' + api.virableName] = result?.data;
    }

    return result;
  }

  goToPage(page?: any, data?: any) {
    let redirectUrl = page.url;
    const type = page.type;
    let pageParams = '';
    const queryParams = this.getParams(page.queryParams, data);
    if (page.params) {
      const params = this.getParams(page.params, data);
      const paramsKeys = Object.keys(params);
      if (paramsKeys.length > 0) {
        paramsKeys.forEach((key, index) => {
          pageParams += '/' + params[key];
        });
      }
    }
    this.router.navigate([redirectUrl + pageParams], { queryParams: queryParams });
  }

  getParams(params: any[], value: any) {
    const _params: any = {};
    if (params && params.length > 0) {
      params.forEach((param: any) => {
        if (param.type === 'array') {
          _params[param.key] = [this.getKeyValue(param.value, value)]; // [value[param.value]];
        } else if (param.type === 'object') {
          _params[param.key] = {};
          if (param.keys) {
            param.keys.map((key: { type: string; key: any; name: any; }) => {
              key.type = key.type || 'string';
              if (key.key)
                key.key = key.key;
            });
            _params[param.key] = this.getParams(param.keys, value);
          }
        } else if (param.type === 'script') {
          _params[param.key] = {};
          _params[param.key] = this.getKeyValueAny(param.value, value);
        } else if (param.type === 'string') {
          _params[param.key] = param.value;
        } else {
          _params[param.key] = {};
          if (this.getKeyValue(param.value, value) !== undefined) {
            _params[param.key] = this.getKeyValue(param.value, value);
          } else if (param.defaultValue !== undefined) {
            _params[param.key] = param.defaultValue;
          } else {
            _params[param.key] = param.value;
          }
        }
      });
    }
    return _params;
  }

  getKeyValue(key: any, value: any) {
    try {
      const colKey = 'value.' + key;
      const fun = new Function('value', 'return ' + colKey + ' ; ');
      return fun(value);
    } catch (error) {
      console.warn('key', key, value);
    }
  }
  getKeyValueAny(key: any, item?: any) {
    try {
      const fun = new Function('data', 'return ' + key + ' ; ');
      return fun(item);
    } catch (error) {
      console.warn('key', key);
    }
  }

  public storeObservable(): Observable<any> {
    return this.stateAction.asObservable();
  }

  public setStore(type: any, data?: any) {
    this.stateAction.next({ data: data, type: type });
  }
  sanitizeInput2(input: string): SafeScript {
    // Sanitize the input to prevent code injection
    const sanitizedInput = this.sanitizer.bypassSecurityTrustScript(input);
    return sanitizedInput;
  }
  sanitizeInput(input: string): string {
    // Sanitize the input to prevent code injection
    const sanitizedInput = input.replace(/[^-()\d/*+.]/g, '');
    return sanitizedInput;
  }

  executeExpression(expression: string, arg: any): any {
    const sanitizedExpression: any = this.sanitizeInput(expression);
    const result = eval(expression);
    return result;
  }

}

