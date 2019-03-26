import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {StatesService} from './states.service'

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private httpClient: HttpClient, private states : StatesService) { 
    this.autoConnectSocket()
  }

  login(username:string, password:string) {
    return this.httpClient.post<{success:boolean,token:  string}>('http://localhost:3000/api/login', {username, password}).pipe(tap(res => {
      if(res.success){
        localStorage.setItem('access_token', res.token);
        this.states.login()
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

  autoConnectSocket(){
    if(!!localStorage.getItem('access_token')) this.states.login()
  }


  public get loggedIn(): boolean{
    return localStorage.getItem('access_token') !==  null;
  }
}
