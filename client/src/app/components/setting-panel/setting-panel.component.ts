import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';

import KnxService from '../../services/knx.service';
import { KnxMachine } from '../../models/knx-machine';
import { Lamp } from '../../models/lamp';
import { DialogUpdateComponent } from '../dialog-update/dialog-update.component';


@Component({
  selector: 'app-setting-panel',
  templateUrl: './setting-panel.component.html',
  styleUrls: ['./setting-panel.component.css']
})

export class SettingPanelComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog,private _formBuilder: FormBuilder) { }
  
  isLinear:boolean = false;
  animal: string;
  name: string;


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


  /**
   * UPDATA : Knx Setting 
   * Construction de l'objet  à envoyer à la dialog générique pour la construire 
   * name : le noms
   * imputs : array des champs à modifier
   * function : service pour update
   * @param indice 
   */
  updateSettingKnxMachine(indice){
    let data = {
      name: this.arrayKnx[indice].name, 
      inputs: {
        'name' : this.arrayKnx[indice].name,
        'ipAddr' : this.arrayKnx[indice].ipAddr,
        'port' : this.arrayKnx[indice].port
      },
      //function : 
    }
    this.openDialogUpdate(data);
  }

  /**
   * Call la dialog générique avec les paramètres à afficher 
   * @param dataToUpdate 
   */
  openDialogUpdate(dataToUpdate) {
    const dialogRef = this.dialog.open(DialogUpdateComponent, {
      width: '450px',
      data: dataToUpdate
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

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

