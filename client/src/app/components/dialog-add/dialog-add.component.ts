import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import UtilsService from '../../services/utils.service';
import knxService from '../../services/knx.service';
import { Lamp } from '../../models/lamp';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

export interface DialogData {
  id: string,
  name: string, 
  sentence : string,
}

@Component({
  selector: 'app-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.css']
})
export class DialogAddComponent implements OnInit {

  data: DialogData;
  idLamp: string;
  nameLamp: string;

  lampsGroup: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<DialogAddComponent>,
    private _utils: UtilsService,
    @Inject(MAT_DIALOG_DATA) public d: DialogData,
    private _formBuilder: FormBuilder) {
      this.data = d;
    }



  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.lampsGroup = this._formBuilder.group({
      inputIdLampControl: [ '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
        ]) 
      ],
      inputNameLampControl: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
        ])
      ],
    });
  }

  public addLight() : void{
    let data = {
      type: 1,
      idKnx : this.data.id,
      light : new Lamp(this.nameLamp,this.idLamp, false)
    }
    knxService.addLight(data).then((res) =>{
      if(res.data.success){
        this._utils.openSnackBar("La lampes a été ajouté","Ok","success-snackbar");
      }else{
        this._utils.openSnackBar("Erreur de l'ajout : " + res.data,"Ok","error-snackbar");
      }
    });
    this.dialogRef.close(data);
  }

}