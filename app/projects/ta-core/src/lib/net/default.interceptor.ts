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
  // Track requests that should skip error handling
  private skipErrorUrls = new Set<string>();
  // Flag to prevent duplicate session expiration notifications
  private isRedirectingToLogin = false;

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

  private checkStatus(ev: HttpErrorResponse): void {
    // Skip error handling if URL is in our skip list or has skipErrorInterceptor flag
    if (ev.error?.skipErrorInterceptor === true || 
        (ev.url && this.skipErrorUrls.has(ev.url))) {
      return;
    }
    // Skip showing any error for login attempts - those will be handled by the form component
    const isLoginAttempt = ev.url?.includes('users/login');
    if (isLoginAttempt && ev.status === 401) {
      return; // Exit early for login 401 errors
    }

    // Handle 400 errors specifically
    if (ev.status === 400) {
      const responseBody = ev.error;  // Response is in `ev.error`

      // Case 1: Handle field-level validation errors first (highest priority)
      if (responseBody && typeof responseBody === 'object') {
        // Check for typical Django/DRF validation error format
        const hasFieldErrors = Object.keys(responseBody).some(key => 
          Array.isArray(responseBody[key]) && responseBody[key].length > 0
        );
        
        if (hasFieldErrors) {
          let errorMessages: string[] = [];
          
          Object.keys(responseBody).forEach((key) => {
            if (Array.isArray(responseBody[key])) {
              const formattedKey = key.replace(/_/g, ' ').toUpperCase();
              errorMessages.push(`<strong>${formattedKey}:</strong> ${responseBody[key].join(', ')}`);
            }
          });
          
          if (errorMessages.length > 0) {
            this.showError(errorMessages.join('<br>'));
            return;
          }
        }
      }
      
      // Case 2: Handle form validation errors with nested 'errors' object
      if (responseBody?.errors && typeof responseBody.errors === 'object') {
        let errorMessages: string[] = [];
        
        Object.keys(responseBody.errors).forEach((key) => {
          const formattedKey = key.replace(/_/g, ' ').toUpperCase();
          errorMessages.push(`<strong>${formattedKey}:</strong> ${responseBody.errors[key].join(', ')}`);
        });
        
        if (errorMessages.length > 0) {
          this.showError(errorMessages.join('<br>'));
          return;
        }
      }
      
      // Case 3: If there's a message in the response
      if (responseBody?.message) {
        this.showError(responseBody.message);
        return;
      }
      
      // Case 4: If we have data with errors
      if (responseBody?.data && Object.keys(responseBody.data).length > 0) {
        const errorText = this.formatErrors(responseBody);
        this.showError(errorText);
        return;
      }
      
      // Case 5: Generic 400 error with no specific details
      this.showError("Bad Request! Please check your input.");
      return;
    }

    // Skip showing generic errors for login attempts
    if (isLoginAttempt) {
      return;
    }

    // Fallback for other HTTP status codes
    let errorText = "An unexpected error occurred. Please try again.";
    if (ev.error && ev.error.message) {
        errorText = ev.error.message; // Use API-provided message if available
    } else {
        // Handle Specific Error Codes
        switch (ev.status) {
            case 403:
                errorText = "Access Denied! You do not have permission.";
                break;
            case 404:
                errorText = "The requested resource was not found.";
                break;
            case 500:
                errorText = "Server Error! Something went wrong on our end.";
                break;
        }
    }
    
    this.notification.error(
      'Error',
      errorText,
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
    // Prevent duplicate notifications when multiple requests fail simultaneously
    if (this.isRedirectingToLogin) {
      return;
    }
    this.isRedirectingToLogin = true;
    
    // Check if this is a login attempt by examining the URL in the error
    const isLoginAttempt = errorMsg?.url?.includes('users/login');
    
    // Check if token expired
    const isTokenExpired = errorMsg?.error?.code === 'token_not_valid' ||
                           (errorMsg?.error?.messages && errorMsg.error.messages.some((m: any) => m.message?.includes('expired')));
    
    // Clear user data from storage
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    
    // Only show notification if this is not a login attempt
    // For login attempts, the form component will handle the error display
    if (!isLoginAttempt) {
      let msg = 'Not logged in or login has expired, please log in again.';
      
      // Show specific message for token expiration
      if (isTokenExpired) {
        msg = 'Your session has expired. Please log in again.';
      } else if (errorMsg && errorMsg.error && errorMsg.error.message) {
        msg = errorMsg.error.message;
      }
      
      this.notification.error('Session Expired', msg);
    }
    
    this.goTo('/login');
    
    // Reset the flag after a short delay to allow future redirects
    setTimeout(() => {
      this.isRedirectingToLogin = false;
    }, 1000);
  }

  private handleData(ev: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.loadingS.hide();
    
    // Check if this request URL is in our skip list
    const skipErrorHandling = req.url && this.skipErrorUrls.has(req.url);
    
    // Check if token is expired (can come as 401 or 403 with token_not_valid code)
    const isTokenExpired = ev.error?.code === 'token_not_valid' || 
                           ev.error?.detail?.includes('token') ||
                           (ev.error?.messages && ev.error.messages.some((m: any) => m.message?.includes('expired')));
    
    // If token is expired, redirect to login
    if (isTokenExpired) {
      this.toLogin(ev);
      return throwError(() => ev);
    }
    
    // Only call checkStatus if we're not skipping error handling
    if (!skipErrorHandling) {
      this.checkStatus(ev);
    }
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
        // Check if 403 is due to expired token
        if (isTokenExpired) {
          this.toLogin(ev);
        }
        // this.goTo(`/exception/${ev.status}`);
        break;
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
    
    // Check if this request should skip error handling
    const shouldSkipErrors = req.headers.has('X-Skip-Error-Interceptor');
    if (shouldSkipErrors) {
      // Add the full URL to our skip list
      this.skipErrorUrls.add(url);
      // Clean up the URL from our skip list after 10 seconds
      setTimeout(() => this.skipErrorUrls.delete(url), 10000);
    }
    
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
