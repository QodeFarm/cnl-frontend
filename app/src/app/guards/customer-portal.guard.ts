// guards/customer-portal.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerPortalGuard implements CanActivate {
  
  constructor(
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('🔐 CUSTOMER PORTAL GUARD');
    console.log('📍 Attempting to access:', state.url);
    
    const user = localStorage.getItem('user');
    const userType = localStorage.getItem('user_type');
    
    console.log('📦 localStorage - user:', user);
    console.log('📦 localStorage - userType:', userType);
    
    // Only allow if user is customer
    if (user && userType === 'customer') {
      console.log('✅ Customer user found, allowing access');
      return of(true);
    }
    
    // If not customer, redirect to customer login (not admin login)
    console.log('❌ Not a customer, redirecting to customer login');
    window.location.href = '/#/customer-portal-login';
    return of(false);
  }
}