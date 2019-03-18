import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private httpClient: HttpClient) { }

  login(username:string, password:string) {
    return this.httpClient.post<{success:boolean,token:  string}>('http://localhost:3000/api/login', {username, password}).pipe(tap(res => {
      if(res.success){
        localStorage.setItem('access_token', res.token);
      }
    }))
  }
  register(email:string, password:string) {
    return this.httpClient.post<{access_token: string}>('http://localhost:3000/api/register', {email, password}).pipe(tap(res => {
      this.login(email, password)
    }))
  }
  logout() {
    localStorage.removeItem('access_token');
  }


  public get loggedIn(): boolean{
    return localStorage.getItem('access_token') !==  null;
  }
}
