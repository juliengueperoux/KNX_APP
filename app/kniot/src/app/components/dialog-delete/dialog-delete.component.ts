import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import UtilsService from '../../services/utils.service';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
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
    this.test = "ici TEZST";
    console.log(this.data);
  }

}