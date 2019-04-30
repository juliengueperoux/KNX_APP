import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import UtilsService from '../../services/utils.service';
import knxService from '../../services/knx.service';

export interface DialogData {
  id: string,
  name: string, 
  sentence : string,
}

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent implements OnInit {

  data : DialogData;
  test : String;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteComponent>,
    private _utils: UtilsService,
    @Inject(MAT_DIALOG_DATA) public d: DialogData) {
      this.data =d;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(this.data);
  }

  deleteKnxMachine(){
    let dataClose = {
      type: 2,
      idKnx : this.data.id,
    }
    knxService.deleteConfig(this.data.id).then((res) =>{
      if(res.data.success){
        this._utils.openSnackBar("La machine KNX a été supprimée","Ok","success-snackbar");
      }else{
        this._utils.openSnackBar("Erreur de suppression : " + res.data,"Ok","error-snackbar");
      }
    });
    this.dialogRef.close(dataClose);
  }

  
}