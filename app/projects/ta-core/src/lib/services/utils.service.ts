import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private http: HttpClient,private router: Router) { 

  }
  logout(){
    this.http.get('auth/logout').subscribe(res => { });
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  getProfile(){
    const u:any = localStorage.getItem('user');
    if(u){
      return JSON.parse(u);
    }
    
  }

}
