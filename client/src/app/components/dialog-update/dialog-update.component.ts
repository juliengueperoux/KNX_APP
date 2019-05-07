import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { KnxMachine } from '../../models/knx-machine';
import knxService from '../../services/knx.service';
import UtilsService from '../../services/utils.service'
import { Lamp } from '../../models/lamp';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';


export interface DialogData {
  type: number,
  knxMachine: KnxMachine,
  lamp: Lamp,
  idKnx: string,
  sentence : string,
}

@Component({
  selector: 'app-dialog-update',
  templateUrl: './dialog-update.component.html',
  styleUrls: ['./dialog-update.component.css']
})
export class DialogUpdateComponent implements OnInit {

  data : DialogData;
  type : number;
  knxMachine : KnxMachine;
  lamp : Lamp;
  old_id : string;

  knxGroup: FormGroup;
  lampsGroup: FormGroup;
  
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateComponent>,
    private _utils: UtilsService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public d: DialogData) {
      this.data =d;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * type : 1 => update machine
   * type : 2 => update lamp
   */
  ngOnInit(): void {
    this.type = this.data.type
    if(this.type == 1){ 
      this.knxMachine = this.data.knxMachine;
    }else if(this.type == 2){
      this.lamp = this.data.lamp;
      this.old_id = this.data.lamp.id;
    }

    this.knxGroup = this._formBuilder.group({
      inputNameKnxControl: [
        '',
        Validators.compose([
          Validators.required, 
          Validators.minLength(2),
          Validators.maxLength(254)
        ])
      ],
      inputIpKnxControl: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(15),
          Validators.pattern(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)
        ])
      ],
      inputPortKnxControl: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength(5),
        ]) 
      ],

    });
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
          Validators.maxLength(254),
        ])
      ],
    });
  }

  updateMachineKnx(): void{
    let dataClose = {
      type: 3,
      knxMachine : this.knxMachine,
    }
    knxService.updateConfig(this.knxMachine).then((res) =>{
      if(res.data.success){
        this._utils.openSnackBar("La machine knx a été modifiée","Ok","success-snackbar");
<<<<<<< HEAD
        this.dialogRef.close(dataClose);
      }else{
        this._utils.openSnackBar("Erreur de suppression : " + res.errorMessage,"Ok","error-snackbar");
        this.dialogRef.close();
      }
    });
    
=======
      }else{
        this._utils.openSnackBar("Erreur de suppression : " + res.errorMessage,"Ok","error-snackbar");
      }
    });
    this.dialogRef.close(dataClose);

>>>>>>> finish-dialogue
  }

  updateLamp(): void{
    let dataClose = {
      type: 4,
      light: this.lamp,
      old_id: this.old_id,
      idKnx: this.data.idKnx,
    }
    let dataToSend = {
      idKnx: this.data.idKnx,
      light: this.lamp,
    }
    knxService.updateLight(dataToSend).then((res) =>{
      if(res.data.success){
        this._utils.openSnackBar("La lampe a été modifiée","Ok","success-snackbar");
        this.dialogRef.close(dataClose);
      }else{
        this._utils.openSnackBar("Erreur de suppression : " + res.errorMessage,"Ok","error-snackbar");
        this.dialogRef.close();      
      }
    });
  }

}
