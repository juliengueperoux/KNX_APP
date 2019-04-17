import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
    inputNameKnxControl: new FormControl([
      Validators.required,
      Validators.minLength(4),
    ]),
    inputIpKnxControl: new FormControl([
      Validators.required,
      Validators.minLength(4),
      Validators.pattern(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)
    ]),
    inputPortKnxControl: new FormControl([
      Validators.required,
      Validators.maxLength(5),
    ]),
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
  
  addNewLamp():void{
      this.arrayNewLamp.push(new Lamp(this.inputNameLamp,this.inputIdLamp));
      this.lampsGroup.reset();
  }

  createNewKnxMachine() : void{
    this.knx = new KnxMachine(this.inputNameKnx, this.inputIpKnx, this.inputPortKnx, this.arrayNewLamp);
    KnxService.addConfig(this.knx).then((res) =>{
      if(res.data.success){
        this.openSnackBar("Machine KNX  ajoutée à la base de données","Ok");
        this.arrayKnx.push(this.knx);
        this.arrayNewLamp = [];
        this.knxGroup.reset();
        this.lampsGroup.reset();
      }
    });
  }
  
  deleteKnxMachine(id : String) : void{
    KnxService.deleteConfig(id).then((res) =>{
      if(res.data.success){
        this.openSnackBar("La machine KNX a été supprimée","Ok");
        this.arrayKnx.forEach((element, i) => {
          if(element._id==id){
            this.arrayKnx.splice(i, 1); 
            return true;
          }
        });
      }else{
        this.openSnackBar("Erreur de suppression : " + res.data,"Ok");
      }
    });
  }

  getAllLights() : void{
    KnxService.findConfigs().then((res) =>{
      this.arrayKnx = res.data;
      console.log(this.arrayKnx);
    });
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