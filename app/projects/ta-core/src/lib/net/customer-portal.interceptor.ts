// customer-portal.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CustomerPortalInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url;
    
    // Skip asset files
    if (url.includes('assets/') || url.includes('.json')) {
      return next.handle(req);
    }
    
    // Only intercept customer portal API requests
    if (url.includes('customers/portal/')) {
      console.log('🟢 API Request:', url);
      
      let fullUrl = url;
      if (!url.startsWith('http')) {
        fullUrl = 'http://127.0.0.1:8000/api/v1/' + url;
      }
      
      // CRITICAL: Clone with credentials and proper headers
      const modifiedReq = req.clone({
        url: fullUrl,
        withCredentials: true,  // THIS IS ABSOLUTELY CRITICAL
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('🟢 Modified request with credentials:', modifiedReq);
      
      return next.handle(modifiedReq);
    }
    
    return next.handle(req);
  }
}