import { Component, OnInit } from '@angular/core';
import 'hammerjs';
import { Router } from '@angular/router';
import { JwtService } from '../jwt.service';
import { StatesService } from "../states.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'todoApp'
  
  constructor(private auth: JwtService, private router: Router,private states: StatesService){ }

  ngOnInit() {
    if (this.states.socketCreated()){
      this.states
        .getMessages()
        .subscribe((message: string) => {
      });
    }
  }

  sendMessage() {
    this.states.sendMessage("Test Message");
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }

}