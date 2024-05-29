import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  setItem(key:string,value:any){
    const _value = JSON.stringify(value);
    localStorage.setItem(key,_value);
  }
  getItem(key:string){
    return JSON.parse(localStorage.getItem(key) as string);
  }
}
