import { Component, OnInit, Inject } from '@angular/core';
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

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog) { }
  
  numeros =[1,2,3,4]
  nameLight: string;


  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  
  openDialog() {
    this.dialog.open(DialogAdd, {
      data: {
        animal: 'panda'
      }
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


@Component({
  selector: '../dialog-add/app-dialog-add',
  templateUrl: '../dialog-add/dialog-add.component.html',
})
export class DialogAdd {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}