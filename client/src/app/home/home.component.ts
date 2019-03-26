import { Component, OnInit } from '@angular/core';
import KnxService from '../services/knxService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  connect():void{
    KnxService.connect()
  }

  disconnect():void{
    KnxService.disconnect()
  }
  
}
