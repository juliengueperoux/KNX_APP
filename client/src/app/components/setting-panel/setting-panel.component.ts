import { Component, OnInit } from '@angular/core';
import KnxService from '../../services/knx.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-setting-panel',
  templateUrl: './setting-panel.component.html',
  styleUrls: ['./setting-panel.component.css']
})
export class SettingPanelComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) { }
  
  numeros =[1,2,3,4]
  
  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  

  /**
   * KNX PART 
   */
  connect(event):void{
    if(event.checked){
      KnxService.connect().then((res) =>{
        (res.data.success) ? this.openSnackBar("Connecté à KNX","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
    }else{
      KnxService.disconnect().then((res) =>{
        (res.data.success) ? this.openSnackBar("Deconnecté à KNX","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
    }
  }


}
