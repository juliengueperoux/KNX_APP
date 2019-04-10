import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import KnxService from '../../services/knx.service';
import {MatSnackBar} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
  
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  inputIpKnx ="";
  inputPortKnx = 0;
  inputNameLamp = "";
  inputIdLamp = "";
  
  tabNewLamp = [];

  arrayKnx = [];
  nameLight: string;


  ngOnInit() {
    this.getAllLights();
    this.firstFormGroup = this._formBuilder.group({     
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  createNewKnxMachine() : void{
    let objToSend = {
      'name' : "",
      'ipAddr' : this.inputIpKnx,
      'port' : this.inputPortKnx,
      'arrayLights' : this.tabNewLamp,
    }
    console.log(JSON.stringify(objToSend));

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
      this.tabNewLamp.push(
        {
          'id' : this.inputIdLamp,
          'name' :  this.inputNameLamp,
        }
      ) 
      this.inputIdLamp = " ";
      this.inputNameLamp = " ";
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

/*
@Component({
  selector: '../dialog-add/app-dialog-add',
  templateUrl: '../dialog-add/dialog-add.component.html',
})
export class DialogAdd {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}*/