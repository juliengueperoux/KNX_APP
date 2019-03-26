import { Component, OnInit } from '@angular/core';
import KnxService from '../services/knxService';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  numeros =[1,2,3,4]

  constructor() { }

  ngOnInit() {
  }

  allLights(event): void {
    if(event.checked) KnxService.startAllLights();
    else KnxService.stopAllLights();
    //KnxService.startAllLights();
  }

  stateLight(numero,event){
    if(event.checked) KnxService.startLight(numero);
    else KnxService.stopLight(numero);
  }

}
