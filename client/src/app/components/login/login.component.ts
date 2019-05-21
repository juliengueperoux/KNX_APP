import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../services/jwt.service';
import { Router } from '@angular/router';
import { StatesService } from "../../services/states.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public isIP: boolean;

  loginGroup: FormGroup;
  ipServerGroup: FormGroup;

  _auth: JwtService;

  constructor(private auth: JwtService, private router: Router, private states : StatesService, private _formBuilder: FormBuilder, ) {
    this._auth=auth;
   }

  ngOnInit() {
    this.detectIpServer();
    this.loginGroup = this._formBuilder.group({
      usernameControl: [
        '',
        Validators.compose([
          Validators.required, 
          Validators.minLength(2),
          Validators.maxLength(254)
        ])
      ],
      passwordControl: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(254)
        ])
      ],
    });

    this.ipServerGroup = this._formBuilder.group({
      ipServerControl: [
        '',
        Validators.compose([
          Validators.required, 
          Validators.minLength(7),
          Validators.maxLength(15),
          Validators.pattern(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)
        ])
      ],
    });

  }

  public submit() {
    this._auth.login(this.loginGroup.get("usernameControl").value, this.loginGroup.get("passwordControl").value).then((res:any) => {
      if(res.data.success){
          this.router.navigate(['home'])
          this.states.getMessages()
          this.states.getConnectionStatus()
        }
      })
  }

  public setIpServer(){
    localStorage.setItem('ipServer',this.ipServerGroup.get("ipServerControl").value);
    this.detectIpServer();
    this.router.navigate(['login']);
    
  }

  detectIpServer(){
    if(localStorage.getItem('ipServer')){
      this.isIP = true;
      this.title = "Connection";
      this.subTitle = "Entrez vos identifiants";
    }else{
      this.isIP = false;
      this.title = "Première connection";
      this.subTitle = "Vous devenez paramétrer votre application avec l'adresse ip de votre server local";
    }
  }
}
