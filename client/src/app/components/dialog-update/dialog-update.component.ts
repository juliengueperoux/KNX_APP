import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { KnxMachine } from '../../models/knx-machine';
import knxService from '../../services/knx.service';
import UtilsService from '../../services/utils.service'


export interface DialogData {
  type: number,
  knxMachine: KnxMachine,
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

  constructor(
    public dialogRef: MatDialogRef<DialogUpdateComponent>,
    private _utils: UtilsService,
    @Inject(MAT_DIALOG_DATA) public d: DialogData) {
      this.data =d;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.type = this.data.type
    if(this.type == 1){
      this.knxMachine = this.data.knxMachine
    }else if(this.type == 2){

    }
  }

  updateMachineKnx(): void{
   /* knxService.addLight(this.knxMachine).then((res) =>{
      if(res.data.success){
        this._utils.openSnackBar("La lampes a été supprimée","Ok","success-snackbar");
      }else{
        this._utils.openSnackBar("Erreur de suppression : " + res.data,"Ok","error-snackbar");
      }
    });*/
  }

  updateLamp(): void{

  }

}
