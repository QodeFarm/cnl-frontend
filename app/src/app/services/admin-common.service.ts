import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
interface Action {
  type: string;
  data: string;
}
@Injectable({
  providedIn: 'root'
})
export class AdminCommonService {
  private actionSubject = new BehaviorSubject<Action>(<any>{});
  action$ = this.actionSubject.asObservable();
  constructor() { }
  setAction(type: any, data: any) {
    this.actionSubject.next({ type: type, data: data });
  }
}
