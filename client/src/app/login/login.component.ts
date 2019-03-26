import { Component, OnInit } from '@angular/core';
import { JwtService } from '../jwt.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
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

  on(): void {
    console.log("ici");
    this.router.navigate(['home']);
    this.states.getMessages();
  }

  public submit() {
    /*this.auth.login(this.username, this.password)
      .pipe(first())
      .subscribe(
        result => {
          this.router.navigate(['home'])
          this.states.getMessages()
        }
       // err => this.error = 'Could not authenticate'
      );*/
  }
}
