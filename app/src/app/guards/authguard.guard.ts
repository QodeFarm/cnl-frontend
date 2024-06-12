import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TaLocalStorage } from '@ta/ta-core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser: any = TaLocalStorage.getItem('user');
    let url: string = state.url;
    if (localStorage.getItem('accessToken') && currentUser) {


      if (url === '/login') {
        this.goNavUrl(currentUser);
        // this.router.navigate(['/studio']);
        return false;
      }
      if (currentUser) {
        // check if route is restricted by role
        if (route.data.roles && route.data.roles.indexOf(currentUser.role.code) === -1) {
          // role not authorised so redirect to home page
          this.goNavUrl(currentUser);
          return false;
        }
        // authorised so return true
        return true;
      }
      return true;
    } else {
      if (url !== '/login') {
        this.router.navigateByUrl('/login');
        return false;
      }
      return true;
    }
  }
  goNavUrl(currentUser: any) {
    if (currentUser.role.code == 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

}
