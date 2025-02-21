import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponseBase,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
// import { ALAIN_I18N_TOKEN } from '@delon/theme';
// import { _HttpClient } from '@delon/theme';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, mergeMap, switchMap, take } from 'rxjs/operators';
import { SiteConfigService } from '../services/site-config.service';
import { LoadingService } from '../services/loading.service';
import { NzModalService } from 'ng-zorro-antd/modal';

const CODEMESSAGE: { [key: number]: string } = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'The data was deleted successfully.',
  400: 'There was an error in the request sent, and the server did not create or modify the data.',
  401: 'The user does not have permission (the token, username, password is wrong).',
  403: 'The user is authorized, but access is forbidden.',
  404: 'The request sent was for a record that did not exist, and the server did not operate.',
  406: 'The requested format is not available.',
  410: 'The requested resource is permanently deleted and will no longer be available.',
  422: 'When creating an object, a validation error occurred.',
  500: 'An error occurred in the server, please check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable, and the server is temporarily overloaded or maintained.',
  504: 'The gateway timed out.',
};

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  private refreshTokenEnabled = true;//environment.api.refreshTokenEnabled;
  private refreshTokenType: 're-request' | 'auth-refresh' | any = 're-request'; //environment.api.refreshTokenType;
  private refreshToking = false;
  private refreshToken$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private injector: Injector, private siteConfig: SiteConfigService, private loadingS: LoadingService) {
    if (this.refreshTokenType === 'auth-refresh') {
      //this.buildAuthRefresh();
    }
  }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private get modelSvc(): NzModalService {
    return this.injector.get(NzModalService);
  }
  // private get tokenSrv(): ITokenService {
  //   return this.injector.get(DA_SERVICE_TOKEN);
  // }

  // private get http(): _HttpClient {
  //   return this.injector.get(_HttpClient);
  // }

  private goTo(url: string): void {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  // private checkStatus(ev: HttpErrorResponse): void {
  //   let errorMsg = `Request error ${ev.status}: `;
  //   if (ev.status == 400) {
  //     const errortext = CODEMESSAGE[ev.status] || ev.statusText;
  //     this.notification.error('', errortext);
  //     return;
  //   }
  //   if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
  //     return;
  //   }

  //   const errortext = "Username or Password is not valid" //CODEMESSAGE[ev.status] || ev.statusText;
  //   this.notification.error(errorMsg, errortext);
  // }

  private checkStatus(ev: HttpErrorResponse): void {
    let errorMsg = `Request error ${ev.status}: `;

    if (ev.status == 400) {
      const responseBody = ev.error;  // Assuming response is in `ev.error` (adjust as necessary)

      // Case 0: If the error is due to form validation at model level (viewsets - not API View), show the validation errors
      if (ev.status == 400 && ev.error?.message?.includes('Form validation failed')) {
        if (ev.error.errors) {
          let errorMessages: string[] = [];
      
          Object.keys(responseBody.errors).forEach((key) => {
            // Remove underscores and make the key bold
            const formattedKey = key.replace(/_/g, ' ').toUpperCase();
            errorMessages.push(`<strong>${formattedKey}:</strong> ${ev.error.errors[key].join(', ')}`);
          });
      
          this.showError(errorMessages.join('<br>'));
          return
        } else {
          this.showError('Form validation failed, but no specific errors were provided.');
          return
        }
      }
      
      // Case 1: If the message is available, show it directly
      if (responseBody && responseBody.message && responseBody.data.length === 0) {
        // If only message is present (no detailed error data)
        const errortext = responseBody.message;
        // -- old notification error type is commented below -- 
        // this.notification.error(
        //   `<div style="font-size: 12px; color: #333;">${errortext}</div>`,
        //   '',
        //   { nzDuration: 5000, nzStyle: { backgroundColor: '#fff9f9', border: '1px solid #ffa39e', maxWidth: '800px' } }
        // );
        this.showError(errortext)
        return;
      }

      // Case 2: If detailed validation errors are present in `data`
      if (responseBody && responseBody.data && Object.keys(responseBody.data).length > 0 && Object.values(responseBody.data).every(value => typeof value === 'string')
      ) {
        let detailedError = '';
        for (const [key, message] of Object.entries(responseBody.data)) {
          // For each validation error, format it as "KEY: Error message"
          detailedError += `<strong>${key.toUpperCase()}:</strong> ${message}<br>`;

        }
        // -- old notification error type is commented below -- 
        // this.notification.error(
        //   `${detailedError}`,
        //   '',
        //   { 
        //     nzDuration: 5000, 
        //     nzStyle: { 
        //       backgroundColor: '#fff9f9', 
        //       border: '1px solid #ffa39e', 
        //       maxWidth: '1000px'
        //     } 
        //   }
        // );
        this.showError(detailedError);
        return;
      }
      

      // if more backend requirements not satisfied.
      if (responseBody?.data && Object.keys(responseBody.data).length) {
        const errorText = this.formatErrors(responseBody);
        this.showError(errorText);
        return;
      }
    }

    // Fallback for other HTTP status codes
    const errortext = "An error occurred. Please try again.";
    this.notification.error(
      errorMsg,
      errortext,
      { nzDuration: 5000, nzStyle: { backgroundColor: '#fff9f9', border: '1px solid #ffa39e', maxWidth: '600px' } }
    );
  }

  /**
   * 刷新 Token 请求
   */
  // private refreshTokenRequest(): Observable<any> {
  //   const model = this.tokenSrv.get();
  //   return this.http.post(`/api/auth/refresh`, null, null, { headers: { refresh_token: model?.refresh_token || '' } });
  // }

  // #region 刷新Token方式一：使用 401 重新刷新 Token

  // private tryRefreshToken(ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
  //   // 1、若请求为刷新Token请求，表示来自刷新Token可以直接跳转登录页
  //   if ([`/api/auth/refresh`].some((url) => req.url.includes(url))) {
  //     this.toLogin();
  //     return throwError(ev);
  //   }
  //   // 2、如果 `refreshToking` 为 `true` 表示已经在请求刷新 Token 中，后续所有请求转入等待状态，直至结果返回后再重新发起请求
  //   if (this.refreshToking) {
  //     return this.refreshToken$.pipe(
  //       filter((v) => !!v),
  //       take(1),
  //       switchMap(() => next.handle(this.reAttachToken(req))),
  //     );
  //   }
  //   // 3、尝试调用刷新 Token
  //   this.refreshToking = true;
  //   this.refreshToken$.next(null);

  //   return this.refreshTokenRequest().pipe(
  //     switchMap((res) => {
  //       // 通知后续请求继续执行
  //       this.refreshToking = false;
  //       this.refreshToken$.next(res);
  //       // 重新保存新 token
  //       this.tokenSrv.set(res);
  //       // 重新发起请求
  //       return next.handle(this.reAttachToken(req));
  //     }),
  //     catchError((err) => {
  //       this.refreshToking = false;
  //       this.toLogin();
  //       return throwError(err);
  //     }),
  //   );
  // }

  /**
   * 重新附加新 Token 信息
   *
   * > 由于已经发起的请求，不会再走一遍 `@delon/auth` 因此需要结合业务情况重新附加新的 Token
   */
  // private reAttachToken(req: HttpRequest<any>): HttpRequest<any> {
  //   // 以下示例是以 NG-ALAIN 默认使用 `SimpleInterceptor`
  //   const token = this.tokenSrv.get()?.token;
  //   return req.clone({
  //     setHeaders: {
  //       token: `Bearer ${token}`,
  //     },
  //   });
  // }

  // #endregion

  // #region 刷新Token方式二：使用 `@delon/auth` 的 `refresh` 接口

  // private buildAuthRefresh(): void {
  //   if (!this.refreshTokenEnabled) {
  //     return;
  //   }
  //   this.tokenSrv.refresh
  //     .pipe(
  //       filter(() => !this.refreshToking),
  //       switchMap((res) => {
  //         // console.log(res);
  //         this.refreshToking = true;
  //         return this.refreshTokenRequest();
  //       }),
  //     )
  //     .subscribe(
  //       (res: any) => {
  //         // TODO: Mock expired value
  //         res.expired = +new Date() + 1000 * 60 * 5;
  //         this.refreshToking = false;
  //         this.tokenSrv.set(res);
  //       },
  //       () => this.toLogin(),
  //     );
  // }

  // #endregion

  private toLogin(errorMsg?: any): void {
    // console.log('ev', errorMsg.error.message);
    let msg = 'Not logged in or login has expired, please log in again.';
    if (errorMsg && errorMsg.error && errorMsg.error.message) {
      msg = errorMsg.error.message;
    }
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    this.notification.error(msg, ``);
    this.goTo('/login');
  }

  private handleData(ev: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.loadingS.hide();
    this.checkStatus(ev);
    //Business processing: some common operations
    switch (ev.status) {
      case 200:
      case 400:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        // 例如响应内容：
        //  错误内容：{ status: 1, msg: '非法参数' }
        //  正确内容：{ status: 0, response: {  } }
        // 则以下代码片断可直接适用
        // if (ev instanceof HttpResponse) {
        //   const body = ev.body;
        //   if (body && body.status !== 0) {
        //     this.injector.get(NzMessageService).error(body.msg);
        //     // 注意：这里如果继续抛出错误会被行254的 catchError 二次拦截，导致外部实现的 Pipe、subscribe 操作被中断，例如：this.http.get('/').subscribe() 不会触发
        //     // 如果你希望外部实现，需要手动移除行254
        //     return throwError({});
        //   } else {
        //     // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
        //     return of(new HttpResponse(Object.assign(ev, { body: body.response })));
        //     // 或者依然保持完整的格式
        //     return of(ev);
        //   }
        // }
        break;
      case 401:
        if (this.refreshTokenEnabled && this.refreshTokenType === 're-request') {
          // return this.tryRefreshToken(ev, req, next);
        }
        this.toLogin(ev);
        break;
      case 403:
      case 404:
      case 500:
        // this.goTo(`/exception/${ev.status}`);
        break;
      default:
        if (ev instanceof HttpErrorResponse) {
          console.warn(
            'Unknown errors, mostly caused by the backend does not support cross-domain CORS or invalid configuration, please refer to https://ng-alain.com/docs/server to solve cross-domain issues',
            ev,
          );
        }
        break;
    }
    if (ev instanceof HttpErrorResponse) {
      return throwError(() => ev);
    } else {
      return of(ev);
    }
  }

  private getAdditionalHeaders(headers?: HttpHeaders): { [name: string]: string } {
    const res: { [name: string]: string } = {};
    // const lang = this.injector.get(ALAIN_I18N_TOKEN).currentLang;
    // if (!headers?.has('Accept-Language') && lang) {
    //   res['Accept-Language'] = lang;
    // }
    if (localStorage.getItem('accessToken')) {
      res['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');
    }
    return res;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 统一加上服务端前缀
    let url = req.url;
    // this.loadingS.show();
    if (!url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('assets')) {
      const baseUrl = this.siteConfig.CONFIG.baseUrl;
      url = baseUrl + url//environment.api.baseUrl + url;
    }
    // alert(url);

    // const myheaders = {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Authorization': 'Basic YW5ndWxhcjphbmd1bGFy'
    // };
    const newReq = req.clone({ url, setHeaders: this.getAdditionalHeaders(req.headers) });
    return next.handle(newReq).pipe(
      mergeMap((ev) => {

        // 允许统一对请求错误处理
        if (ev instanceof HttpErrorResponse) {
          return this.handleData(ev, newReq, next);
        }
        // 若一切都正常，则后续操作
        return of(ev);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err, newReq, next)),
      finalize(() => {
        // this.loadingS.hide();
      })
    );

  }

  showError(message: string): void {
    const modalRef = this.modelSvc.create({
      // nzTitle: 'Error :',
      nzContent: `<p>${message}</p>`, // Display the error message
      nzClosable: false, // Disable the close button
      nzFooter: [
        {
          label: 'OK',
          type: 'primary',
          onClick: () => modalRef.destroy(), // Close the modal when OK is clicked
        },
      ],
      nzCentered: true, // Center the modal
      nzWrapClassName: 'error-modal', // Custom class for styling
    });
  };

  formatErrors(responseBody: any): string {
    if (!responseBody?.data) return responseBody?.message || 'An unknown error occurred';
  
    let errorMessages: string[] = [];
  
    Object.entries(responseBody.data).forEach(([key, value]) => {
      const processMessages = (subKey: string, messages: any) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg) => errorMessages.push(`<b>${key.toUpperCase()}</b> - ${subKey} - ${msg}<br>`));
        }
      };
  
      if (Array.isArray(value)) {
        value.forEach(item => typeof item === 'object' && Object.entries(item).forEach(([subKey, messages]) => processMessages(subKey, messages)));
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, messages]) => processMessages(subKey, messages));
      }
    });
  
    return errorMessages.length ? errorMessages.join('') : responseBody.message || 'Unknown error';
  }
}
