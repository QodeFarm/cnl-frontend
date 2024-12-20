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
  public accessModuleList = <any>[]
  private actionSubject = new BehaviorSubject<Action>(<any>{});
  action$ = this.actionSubject.asObservable();
  constructor() { }
  setAction(type: any, data: any) {
    this.actionSubject.next({ type: type, data: data });
  }
  checkPermission(moduleName: string, sectionName: string, actionName: string): boolean {
    const module = this.accessModuleList.find(mod => mod.module_name.toLowerCase() === moduleName.toLowerCase());
    if (!module) return false;

    const section = module.module_sections.find(sec => sec.section_name.toLowerCase() === sectionName.toLowerCase());
    if (!section) return false;

    return section.actions.some(act => act.action_name.toLowerCase() === actionName.toLowerCase());
  }
}
