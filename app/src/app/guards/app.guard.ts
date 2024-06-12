import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TaLocalStorage } from '@ta/ta-core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class appGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser: any = TaLocalStorage.getItem('user');
    if (currentUser) {
      this.router.navigate(['/admin/dashboard']);
      return false;
    }
    return true;

  }
}


// export const appGuard: CanActivateFn = (route, state) => {
//   const currentUser: any = TaLocalStorage.getItem('user');
//   debugger;
//   if (currentUser) {
//     this.router.navigate(['/admin/dashboard']);
//     return false;
//   }
//   return true;
// };
