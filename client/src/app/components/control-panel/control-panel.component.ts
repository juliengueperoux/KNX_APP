import { Component, OnInit, OnDestroy } from '@angular/core';
import KnxService from '../../services/knx.service';
import {MatSnackBar} from '@angular/material';
import UtilsService from '../../services/utils.service';
import { StatesService } from "../../services/states.service";
import { takeUntil } from 'rxjs/operators';
import {componentDestroyed} from "@w11k/ngx-componentdestroyed";
import { element } from 'protractor';
import { KnxMachine } from '../../models/knx-machine';


@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit, OnDestroy {

  arrayNgModelSwitch = [];
  arrayKnx:Array<KnxMachine> = [];
  interval = 1000;
  active = true; 
  constructor(private snackBar: MatSnackBar, private _utils: UtilsService,private states: StatesService) { }

  ngOnInit() {
    this.getAllLights();
    this.initReceptionWebSocket()
  }
  ngOnDestroy(){

  }

  initReceptionWebSocket(){
    if (this.states.socketCreated()){
      this.states
        .getMessages().pipe(takeUntil(componentDestroyed(this))).subscribe((message: string)=>{
          let data = JSON.parse(message);
          let nameLight = "";
          this.arrayKnx.forEach(machine =>{
            if(machine._id == data.idKnx){
              machine.lights.forEach(light => {
                if(light.id == data.action.idLamp){
                  light.state = (data.action.idLamp == 0) ? false : true;
                }
              });
            }
          })
          switch(data.action.value){
            case 0 :
                nameLight = "svg-light-" + data.action.idLamp + "-" + data.idKnx;
                this.setCSSclass(nameLight,'is-activated',false);
              break;
            case 1 :
                nameLight = "svg-light-" + data.action.idLamp + "-" + data.idKnx;
                this.setCSSclass(nameLight,'is-activated',true);
              break;
          }
          
      });
    }
  }

  getAllLights() : void{
    KnxService.findConfigs().then((res) =>{
      res.data.forEach(element => {
        this.arrayKnx.push(new KnxMachine(element._id, element.name, element.ipAddr, element.ipPort, element.lights));
        this.arrayKnx[this.arrayKnx.length-1].setInterval(element.interval);
        this.arrayKnx[this.arrayKnx.length-1].setStartChain(element.startChain);
        this.arrayKnx[this.arrayKnx.length-1].setSensDirect(element.sensDirect);
        let ngModelSwith = {};
        ngModelSwith["switchAllLights-" + element._id] = false;
        this.arrayNgModelSwitch.push(ngModelSwith);
      });
    });
  }

  setCSSclass(name,classCss,action) : void{
    (action) ? document.getElementById(name).classList.add(classCss) : document.getElementById(name).classList.remove(classCss);
  }

  checkIfAllLightsCheck(idKnx): void{
    let isAllLights = true
    this.arrayKnx.forEach(machine => {
      if(machine._id == idKnx){
        machine.lights.forEach(light => {
          if(!light.state){
            isAllLights = false;
          }
        })
      }
    })
    if(isAllLights){
      this.arrayNgModelSwitch.forEach(element => {
        element["switchAllLights-" + idKnx] = true;
      });
      
    }
  }

  allLights(event,indice,id): void {
    if(event.checked){
      KnxService.startAllLights(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Lampes allumées","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage.errorMessage,"Ok","error-snackbar");
      });
    }
    else{
      KnxService.stopAllLights(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Lampes éteintes","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
      });
    } 
  }

  stateLight(numero,event,indice,id): void{
    this.checkIfAllLightsCheck(id)
    /*this.arrayKnx.forEach(machine => {
      if(machine._id == id){
        machine.lights.forEach(light => {
          if(!light.state) light.state = true;
        })
      }
    })*/
    if(event.checked){
      KnxService.startLight({
        'id' : numero,
        'idKnx' : id,
        'state': true
      }).then((res) =>{
        if(res.data.success){
          this._utils.openSnackBar("Lampe numéro " + numero + " allumée","Ok","default-snackbar")
        }else{
          
          this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
        }
      });
    } 
    else{
      KnxService.stopLight({
        'id' : numero,
        'idKnx' : id,
        'state': false
      }).then((res) =>{
        if(res.data.success){
          this.arrayKnx.forEach(machine => {
            if(machine._id == id){
              machine.lights.forEach(light => {
                if(!light.state) light.state = false;
              })
            }
          })
          this._utils.openSnackBar("Lampe numéro " + numero + " éteinte","Ok","default-snackbar")
        }else{
          this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
        }
      });
    } 
  }

  chase(event,id) : void{
    if(event.checked){
      KnxService.startChase(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Chenillard allumé","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
      });
    }
    else{
      KnxService.stopChase(id).then((res) =>{
        (res.data.success) ? this._utils.openSnackBar("Chenillard éteint","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
      });
      this.active =false;
    } 
  }

  reverse(event,id) : void{
    KnxService.reverse(id).then((res) =>{
      (res.data.success) ? this._utils.openSnackBar("Chenillard inversé","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
    });
  }

  setIntervalChase(event) : void{
    this.interval = event.value;
  }

  intervalChaseService(id) : void{
    KnxService.intervalValue({
      'interval' : this.interval,
      'idKnx' : id
    }).then((res) =>{
      (res.data.success) ? this._utils.openSnackBar("Interval de " + this.interval + " µs","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
    });
  }
  


}
