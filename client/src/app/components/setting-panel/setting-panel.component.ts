import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import KnxService from '../../services/knx.service';
import { KnxMachine } from '../../models/knx-machine';
import { Lamp } from '../../models/lamp';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-setting-panel',
  templateUrl: './setting-panel.component.html',
  styleUrls: ['./setting-panel.component.css']
})

export class SettingPanelComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog,private _formBuilder: FormBuilder) { }
  
  isLinear:boolean = false;
  
  knxGroup = new FormGroup({
    inputNameKnxControl: new FormControl(''),
    inputIpKnxControl: new FormControl(''),
    inputPortKnxControl: new FormControl(''),
  });
  
  lampsGroup = new FormGroup({
    inputNameLampControl: new FormControl(''),
    inputIdLampControl: new FormControl(''),
  });
  
  inputNameKnx: string;
  inputIpKnx: string;
  inputPortKnx: number;
  inputNameLamp: string;
  inputIdLamp: string;
  nameLight: string;
  knx: KnxMachine;
  
  arrayNewLamp:Array<Lamp> = [];
  arrayKnx:Array<KnxMachine> = [];

  ngOnInit() {
    this.getAllLights();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  createNewKnxMachine() : void{
    this.knx = new KnxMachine(this.inputNameKnx, this.inputIpKnx, this.inputPortKnx, this.arrayNewLamp);
    console.log(JSON.stringify(this.knx));

    KnxService.addConfig(this.knx).then((res) =>{
      console.log(res);
    });
  }
  
  deleteKnxMachine(id : String) : void{
    KnxService.deleteConfig(id).then((res) =>{
      console.log(res);
    });
  }

  getAllLights() : void{
    KnxService.findConfigs().then((res) =>{
      this.arrayKnx = res.data;
      console.log(this.arrayKnx);
    });
  }

  addNewLamp():void{
    if(this.inputIdLamp != " "  && this.inputNameLamp != " ")
    {
      this.arrayNewLamp.push(new Lamp(this.inputNameLamp,this.inputIdLamp));
      this.inputIdLamp = null;
      this.inputNameLamp = null;
    }
  }
   /*
  openDialog() {
    this.dialog.open(DialogAdd, {
      data: {
        animal: 'panda'
      }
    });
  }
*/
  /**
   * KNX PART 
   */
  connect(event,id):void{
    if(event.checked){
      KnxService.connect(id).then((res) =>{
        (res.data.success) ? this.openSnackBar("Connecté à KNX","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
    }else{
      KnxService.disconnect(id).then((res) =>{
        (res.data.success) ? this.openSnackBar("Deconnecté à KNX","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
    }
  }
}

/*
@Component({
  selector: '../dialog-add/app-dialog-add',
  templateUrl: '../dialog-add/dialog-add.component.html',
})
export class DialogAdd {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}*/