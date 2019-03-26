import { Component, OnInit } from '@angular/core';
import KnxService from '../services/knxService';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  panelOpenState = false;

  constructor() { }

  ngOnInit() {
  }

  startAllLights(): void {
    KnxService.startAllLights();
  }

}
