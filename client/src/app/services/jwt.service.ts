import { Injectable } from '@angular/core';
import {StatesService} from './states.service'
import { Router } from '@angular/router';
import api from "./Api"
import axios from 'axios'

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private states : StatesService, private router : Router) { 
    this.autoConnectSocket()

    api.interceptors.response.use(response => response, error =>{
      if(error.response.status === 401){
        this.logout()      
      }
    })
  }

  login(username:string, password:string) {
      return new Promise((resolve, reject) => {
        api.post('/login',  {username, password})
          .then(res => {
            if(res.data.success){
              const token = res.data.token
              localStorage.setItem('access_token', token);
              axios.defaults.headers.common['Authorization'] = token
              this.states.login()
            }
            resolve(res)
          })
          .catch(err => {
            localStorage.removeItem('access_token')
            reject(err)
          })
      })
    }

  logout() {
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization']
    this.router.navigate(['login'])
  }

  autoConnectSocket(){
    if(!!localStorage.getItem('access_token')) this.states.login()
  }

  public get loggedIn(): boolean{
    return localStorage.getItem('access_token') !==  null;
  }
}
