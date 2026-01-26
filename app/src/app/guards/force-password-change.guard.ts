import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TaLocalStorage } from '@ta/ta-core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForcePasswordChangeGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkForcePasswordChange(state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkForcePasswordChange(state);
  }

  private checkForcePasswordChange(state: RouterStateSnapshot): boolean | UrlTree {
    // Check if user needs to change password
    const forcePasswordChange = localStorage.getItem('force_password_change');
    
    // Allow access to force-change-password page always
    if (state.url.includes('/force-change-password')) {
      return true;
    }
    
    // Allow access to regular change-password page (for normal password changes)
    if (state.url.includes('/profile/change-password')) {
      return true;
    }
    
    // If force_password_change is true, redirect to force-change-password page
    if (forcePasswordChange === 'true') {
      this.router.navigateByUrl('/admin/force-change-password');
      return false;
    }
    
    return true;
  }
}
