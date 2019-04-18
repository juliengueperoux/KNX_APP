import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';

import KnxService from '../../services/knx.service';
import UtilsService from '../../services/utils.service'
import { KnxMachine } from '../../models/knx-machine';
import { Lamp } from '../../models/lamp';
import { DialogUpdateComponent } from '../dialog-update/dialog-update.component';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';


@Component({
  selector: 'app-setting-panel',
  templateUrl: './setting-panel.component.html',
  styleUrls: ['./setting-panel.component.css']
})

export class SettingPanelComponent implements OnInit {

  constructor( public dialog: MatDialog,private _formBuilder: FormBuilder, private _utils: UtilsService) { }
  
  isLinear: boolean = false;
  validate: boolean = false;
  animal: string;
  name: string;

  knxGroup: FormGroup;
  lampsGroup: FormGroup;
  isOptional = false;

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
    this.getAllLights();
  }
  
  addNewLamp():void{
      this.arrayNewLamp.push(new Lamp(this.inputNameLamp,this.inputIdLamp));
      this.lampsGroup.reset();
  }

  createNewKnxMachine() : void{
    this.knx = new KnxMachine(this.inputNameKnx, this.inputIpKnx, this.inputPortKnx, this.arrayNewLamp);
    KnxService.addConfig(this.knx).then((res) =>{
      if(res.data.success){
        this._utils.openSnackBar("Machine KNX  ajoutée à la base de données","Ok");
        this.arrayKnx.push(this.knx);
        this.arrayNewLamp = [];
        this.knxGroup.reset();
        this.lampsGroup.reset();
      }
    });
  }
  
  deleteKnxMachine(indice) : void{
    let data = {
      validate : this.validate,
      id: this.arrayKnx[indice]._id,
      name: this.arrayKnx[indice].name, 
      sentence : 'Étes-vous sur de vouloir supprimer la machine Knx' + this.arrayKnx[indice].name,
      fun : function (id){
        KnxService.deleteConfig(id).then((res) =>{
          if(res.data.success){
            this._utils.openSnackBar("La machine KNX a été supprimée","Ok");
            this.arrayKnx.forEach((element, i) => {
              if(element._id==id){
                this.arrayKnx.splice(i, 1); 
                return true;
              }
            });
          }else{
            this._utils.openSnackBar("Erreur de suppression : " + res.data,"Ok");
          }
        });
    }
    }
    this.openDialog(data,DialogDeleteComponent);
  }

  public deleteKnxMachineValidate(id) : void{
    
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
    this.openDialog(data,DialogUpdateComponent);
  }

  /**
   * Call la dialog générique avec les paramètres à afficher 
   * @param data 
   */
  openDialog(data,dialog) {
    const dialogRef = this.dialog.open(dialog, {
      width: '450px',
      data: data
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('RESULT :  ' + result)
      this.validate = result;
      console.log("VALIDATE : " + this.validate);
    });
  }

 
  /**
   * KNX PART 
   */
  connect(event,id):void{
    if(event.checked){
      KnxService.connect(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Connecté à KNX","Ok") : this._utils.openSnackBar("Error" + res.data,"Ok");
      });
    }else{
      KnxService.disconnect(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Deconnecté à KNX","Ok") : this._utils.openSnackBar("Error" + res.data,"Ok");
      });
    }
  }
}

