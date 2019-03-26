import { Component, OnInit } from '@angular/core';
import { JwtService } from '../jwt.service';
import { Router } from '@angular/router';
import { StatesService } from "../states.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;

  constructor(private auth: JwtService, private router: Router, private states : StatesService) { }

  ngOnInit() {
  }

  public submit() {
    this.auth.login(this.username, this.password).then((res:any) => {
      if(res.data.success){
          this.router.navigate(['home'])
          this.states.getMessages()
        }
      })
  }
}
