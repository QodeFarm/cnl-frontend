import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SiteConfigService {
  CONFIG:any;
  constructor(private http:HttpClient) { }

  loadConfig():Promise<any>{
    return  this.http.get('assets/config.json').toPromise().then(res=>{
      this.CONFIG = res;
    })
  }
}
