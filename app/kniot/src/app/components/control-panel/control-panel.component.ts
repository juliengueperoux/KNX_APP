import { Component, OnInit, OnDestroy } from '@angular/core';
import KnxService from '../../services/knx.service';
import {MatSnackBar} from '@angular/material';
import UtilsService from '../../services/utils.service';
import { StatesService } from "../../services/states.service";
import { takeUntil } from 'rxjs/operators';
import {componentDestroyed} from "@w11k/ngx-componentdestroyed";

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit, OnDestroy {

  arrayKnx = [];
  interval = 1000;
  active = true; 
  constructor(private snackBar: MatSnackBar, private _utils: UtilsService,private states: StatesService) { }

  ngOnInit() {
    // FINIR DE TRAITER LA PROMISE
    this.getAllLights();
    this.initReceptionWebSocket()
  }
  ngOnDestroy(){

  }



  initReceptionWebSocket(){
    if (this.states.socketCreated()){
      console.log("socket created");
      this.states
        .getMessages().pipe(takeUntil(componentDestroyed(this))).subscribe((message: string)=>{
          let data = JSON.parse(message);
          let nameLight = "";
          switch(data.action.value){
            case 1 :
                nameLight = "svg-light-" + data.action.idLamp + "-" + data.idKnx;
                this.setCSSclass(nameLight,'is-activated',true);
              break;
            case 2 :
                nameLight = "svg-light-" + data.action.idLamp + "-" + data.idKnx;
                this.setCSSclass(nameLight,'is-activated',false);
              break;
          }
          console.log(data);
      });
    }
  }

  getAllLights() : void{
    KnxService.findConfigs().then((res) =>{
      this.arrayKnx = res.data;
      console.log(this.arrayKnx);
    });
  }

  setCSSclass(name,classCss,action) : void{
    (action) ? document.getElementById(name).classList.add(classCss) : document.getElementById(name).classList.remove(classCss);
  }

  allLights(event,indice,id): void {
    if(event.checked){
      KnxService.startAllLights(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Lampes allumées","Ok","default-snackbar") : this._utils.openSnackBar("Error" + res.data,"Ok","error-snackbar");
      });
      this.arrayKnx[indice].lights.forEach(element => {
        let nameLight = "svg-light-" + element.id + "-" + this.arrayKnx[indice]._id;
        this.setCSSclass(nameLight,'is-activated',true);
        document.getElementById(nameLight).classList.add();
      })
    }
    else{
      KnxService.stopAllLights(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Lampes éteintes","Ok","default-snackbar") : this._utils.openSnackBar("Error" + res.data,"Ok","error-snackbar");
      });
      this.arrayKnx[indice].lights.forEach(element => {
        let nameLight = "svg-light-" + element.id + "-" + this.arrayKnx[indice]._id;
        this.setCSSclass(nameLight,'is-activated',false);
      })
    } 
  }

  stateLight(numero,event,indice,id): void{
    if(event.checked){
      KnxService.startLight({
        'id' : numero,
        'idKnx' : id
      }).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Lampe numéro " + numero + " allumée","Ok","default-snackbar") : this._utils.openSnackBar("Error" + res.data,"Ok","error-snackbar");
      });
      let nameLight = "svg-light-" + numero + "-" + this.arrayKnx[indice]._id;
      console.log(nameLight);
      this.setCSSclass(nameLight,'is-activated',true);
    } 
    else{
      KnxService.stopLight({
        'id' : numero,
        'idKnx' : id
      }).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Lampe numéro " + numero + " éteinte","Ok","default-snackbar") : this._utils.openSnackBar("Error" + res.data,"Ok","error-snackbar");
      });;
      let nameLight = "svg-light-" + numero + "-" + this.arrayKnx[indice]._id;
      this.setCSSclass(nameLight,'is-activated',false);
    } 
  }

  chase(event,id) : void{
    if(event.checked){
      KnxService.startChase(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Chenillard allumé","Ok","default-snackbar") : this._utils.openSnackBar("Error" + res.data,"Ok","error-snackbar");
      });
    }
    else{
      KnxService.stopChase(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Chenillard éteint","Ok","default-snackbar") : this._utils.openSnackBar("Error" + res.data,"Ok","error-snackbar");
      });
      this.active =false;
    } 
  }

  reverse(id) : void{
    KnxService.reverse(id).then((res) =>{
      (res.data.success) ? this._utils.openSnackBar("Chenillard inversé","Ok","default-snackbar") : this._utils.openSnackBar("Error" + res.data,"Ok","error-snackbar");
    });
  }

  setIntervalChase(event,id) : void{
    this.interval = event.value;
  }

  intervalChaseService(id) : void{
    console.log("id:"+id)
    KnxService.intervalValue({
      'interval' : this.interval,
      'idKnx' : id
    }).then((res) =>{
      (res.data.success) ? this._utils.openSnackBar("Interval de " + this.interval + " µs","Ok","default-snackbar") : this._utils.openSnackBar("Error" + res.data,"Ok","error-snackbar");
    });
  }
  


}
