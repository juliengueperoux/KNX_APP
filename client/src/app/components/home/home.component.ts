import { Component, OnInit } from '@angular/core';
import { StatesService } from "../../states.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(private states: StatesService) { }

  ngOnInit() {
    console.log("home init")
    if (this.states.socketCreated()){
      console.log("socket created")
      this.states
        .getMessages()
        .subscribe((message: String) => {
          console.log(message)
      });
    }
  }

  
  
}
