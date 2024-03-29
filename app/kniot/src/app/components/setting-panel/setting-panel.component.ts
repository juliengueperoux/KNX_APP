import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';

import KnxService from '../../services/knx.service';
import UtilsService from '../../services/utils.service'
import { KnxMachine } from '../../models/knx-machine';
import { Lamp } from '../../models/lamp';
import { DialogAddComponent } from '../dialog-add/dialog-add.component';
import { DialogUpdateComponent } from '../dialog-update/dialog-update.component';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { StatesService } from '../../services/states.service';
import { takeUntil } from 'rxjs/operators';
import {componentDestroyed} from "@w11k/ngx-componentdestroyed";


@Component({
  selector: 'app-setting-panel',
  templateUrl: './setting-panel.component.html',
  styleUrls: ['./setting-panel.component.css']
})

export class SettingPanelComponent implements OnInit, OnDestroy {

  constructor( public dialog: MatDialog,private _formBuilder: FormBuilder, private _utils: UtilsService, private states: StatesService) { }
  
  responsive: boolean = false;

  isLinear: boolean = false;
  validate: boolean = false;
  animal: string;
  name: string;

  connected: boolean = false;

  knxGroup: FormGroup;
  lampsGroup: FormGroup;
  isOptional = false;
  nameLight: string;
  knx: KnxMachine;

  
  arrayNewLamp:Array<Lamp> = [];
  arrayKnx:Array<KnxMachine> = [];
  

  ngOnInit() {
    this.initReceptionWebSocket();
    this.responsive = (window.innerWidth < 500) ? true : false;
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
  ngOnDestroy(){

  }

  initReceptionWebSocket(): void{
    if (this.states.socketCreated()){
      this.states
        .getConnectionStatus().pipe(takeUntil(componentDestroyed(this))).subscribe((message: string)=>{
          let data = JSON.parse(message);
      });
    }
  }
  
  addNewLamp():void{

      this.arrayNewLamp.push(new Lamp(this.lampsGroup.get("inputIdLampControl").value,this.lampsGroup.get("inputNameLampControl").value,false));
      this.lampsGroup.reset();
  }

  addNewLampToExistingMachine(indice): void{
    let data = {
      id: this.arrayKnx[indice]._id,
      name: this.arrayKnx[indice].name, 
      sentence : 'Ajouter une lampe à la machine : ' + this.arrayKnx[indice].name,
     
    }
    this.openDialog(data,DialogAddComponent);
  }


  createNewKnxMachine() : void{
    this.knx = new KnxMachine(null,this.knxGroup.get("inputNameKnxControl").value, this.knxGroup.get("inputIpKnxControl").value,this.knxGroup.get("inputPortKnxControl").value, this.arrayNewLamp);
    KnxService.addConfig(this.knx).then((res) =>{
      if(res.data.success){
        this._utils.openSnackBar("Machine KNX  ajoutée à la base de données","Ok","success-snackbar");
        this.arrayKnx.push(this.knx);
        this.arrayNewLamp = [];
        this.knxGroup.reset();
        this.lampsGroup.reset();
      }
    });
  }
  
  deleteKnxMachine(indice) : void{
    let data = {
      id: this.arrayKnx[indice]._id,
      name: this.arrayKnx[indice].name, 
      sentence : 'Étes-vous sur de vouloir supprimer la machine Knx' + this.arrayKnx[indice].name,
    }
    this.openDialog(data,DialogDeleteComponent);
  }

  addLamp(idKnx) : void{
    let lights = []
    let light = new Lamp(this.lampsGroup.get("inputIdLampControl").value,this.lampsGroup.get("inputNameLampControl").value,false);
    this.arrayKnx.forEach(element => {
      if(element._id==idKnx){
        element.lights.push(light);
        lights = element.lights;
      }
    });
    let data = {
      idKnx : idKnx,
      light : lights
    }
    KnxService.addLight(data).then((res) =>{
      if(res.data.success){
        this._utils.openSnackBar("La lampes a été supprimée","Ok","success-snackbar");
      }else{
        this._utils.openSnackBar("Erreur de suppression : " + res.data,"Ok","error-snackbar");
      }
    });
  }

  /**
   * UPDATA : Knx Setting 
   * Construction de l'objet  à envoyer à la dialog générique pour la construire 
   * name : le noms
   * knxMachine : array des champs à modifier
   * @sentence : service pour update
   * @param indice 
   */
 

  updateKnxMachine(indice) : void{
    let data = {
      type:1, // type == 1 update machine type == 2 update lamp
      knxMachine : new KnxMachine(this.arrayKnx[indice]._id, 
                                  this.arrayKnx[indice].name,
                                  this.arrayKnx[indice].ipAddr,
                                  this.arrayKnx[indice].port,
                                  this.arrayKnx[indice].lights),
      sentence : 'Modifier la machine Knx' + this.arrayKnx[indice].name,
    }
    this.openDialog(data,DialogUpdateComponent);
  }

  updateLamp(indiceKnx,indiceLamp) : void{
    let data = {
      type:2,
      idKnx: this.arrayKnx[indiceKnx]._id,
      lamp : new Lamp(this.arrayKnx[indiceKnx].lights[indiceLamp].name,this.arrayKnx[indiceKnx].lights[indiceLamp].id, this.arrayKnx[indiceKnx].lights[indiceLamp].state),
      sentence : 'Modifier la lampe : ' + this.arrayKnx[indiceKnx].lights[indiceLamp].name,
    }
    this.openDialog(data,DialogUpdateComponent);
  }

  deleteLamp(idKnx,idLamp) : void{
    let lights = []
    this.arrayKnx.forEach(element => {
      if(element._id==idKnx){
        element.lights.forEach((lamp,i) =>{
          if(lamp.id == idLamp)element.lights.splice(i,1)
        })
        lights = element.lights;
      }
    });
    let data = {
      idKnx : idKnx,
      light : lights    
    }
    KnxService.removeLight(data).then((res) =>{
      if(res.data.success){
        this._utils.openSnackBar("La lampes a été supprimée","Ok","success-snackbar");
      }else{
        this._utils.openSnackBar("Erreur de suppression : " + res.data,"Ok","error-snackbar");
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
   * Call la dialog générique avec les paramètres à afficher 
   * @param data 
   */
  openDialog(data,dialog) {
    const dialogRef = this.dialog.open(dialog, {
      width: '450px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.type){
          switch(result.type){
            case 1 :
              this.arrayKnx.forEach(element => {
                if(element._id==result.idKnx){
                  element.lights.push(result.light);
                }
              });
              break;
            case 2: 
              this.arrayKnx.forEach((element, i) => {
                if(element._id==result.idKnx){
                  this.arrayKnx.splice(i, 1); 
                  return true;
                }
              });
              break;
            case 3: 
              this.arrayKnx.forEach((element, i) => {
                if(element._id==result.knxMachine._id){
                  if(element.name != result.knxMachine.name) element.name = result.knxMachine.name;
                  if(element.ipAddr != result.knxMachine.ipAddr) element.ipAddr = result.knxMachine.ipAddr;
                  if(element.port != result.knxMachine.port) element.port = result.knxMachine.port;
                  return true;
                }
              });
              break;
            case 4: 
              this.arrayKnx.forEach((element, i) => {
                if(element._id==result.idKnx){
                  element.lights.forEach(light =>{
                    if(light.id == result.old_id){
                      if(light.id != result.old_id) light.id = result.light.id;
                      if(light.name != result.light.name) light.name = result.light.name;
                    }
                  })
                  return true;
                }
              });
              break;
          }
        }
      }
    });
  }

 
  /**
   * KNX PART 
   */
  connect(event,id):void{
    if(event.checked){
      KnxService.connect(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Connecté à KNX","Ok","default-snackbar") : this._utils.openSnackBar("Error" + res.data,"Ok","error-snackbar");
      });
    }else{
      KnxService.disconnect(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Deconnecté à KNX","Ok","default-snackbar") : this._utils.openSnackBar("Error" + res.data,"Ok","error-snackbar");
      });
    }
  }
}

