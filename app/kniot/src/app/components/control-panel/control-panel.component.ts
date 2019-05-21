import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import KnxService from '../../services/knx.service';
import {MatSnackBar} from '@angular/material';
import UtilsService from '../../services/utils.service';
import { StatesService } from "../../services/states.service";
import { takeUntil } from 'rxjs/operators';
import {componentDestroyed} from "@w11k/ngx-componentdestroyed";
import { element } from 'protractor';
import { KnxMachine } from '../../models/knx-machine';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

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
  matches: String[];
  isRecording = false;
 
  constructor(private snackBar: MatSnackBar, 
              private _utils: UtilsService,
              private states: StatesService,
              private speechRecognition: SpeechRecognition,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.getAllLights();
    this.initReceptionWebSocket();
  }
  ngOnDestroy(){

  }

  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }
 
  getPermission() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission();
        }
      });
  }
 
  startListening() {
    let options = {
      language: 'fr-FR'
    }
    this.speechRecognition.startListening(options).subscribe(matches => {

      let number = 0;
      if(parseInt(matches[0].slice(-1)) > 0 && parseInt(matches[0].slice(-1)) < 10){
        number = parseInt(matches[0].slice(-1));
        matches[0] = matches[0].slice(0,-2);
      }
      if(number > this.arrayKnx.length){
        matches[0] = "erreur";
      }

      switch(matches[0]){
        case "allume toutes les lampes de la machine" :
          KnxService.startAllLights(this.arrayKnx[number-1]._id).then((res) =>{
            (res.data.success) ? this._utils.openSnackBar("Lampes machine : " + number + " allumées","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage.errorMessage,"Ok","error-snackbar");
          });
        break;
        case "allume toutes les lampes" :
          this.arrayKnx.forEach(element =>{
            KnxService.startAllLights(element._id).then((res) =>{
              (res.data.success) ? this._utils.openSnackBar("Toutes les lampes allumées","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage.errorMessage,"Ok","error-snackbar");
            });
          })
        break;
        case "éteins toutes les lampes de la machine" :
            KnxService.stopAllLights(this.arrayKnx[number-1]._id).then((res) =>{
              (res.data.success) ? this._utils.openSnackBar("Lampes machine : " + number + " éteintes","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage.errorMessage,"Ok","error-snackbar");
          })
        break;
        case "éteins toutes les lampes" :
          this.arrayKnx.forEach(element =>{
            KnxService.stopAllLights(element._id).then((res) =>{
              (res.data.success) ? this._utils.openSnackBar("Toutes les lampes éteintes","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage.errorMessage,"Ok","error-snackbar");
            });
          })
        break;
        case "allume le chenillards de la machine" :
          KnxService.startChase(this.arrayKnx[number-1]._id).then((res) =>{
            (res.data.success) ? this._utils.openSnackBar("Chenillard " + number + " allumé","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
          });
        break;
        case "allume les chenillards" :
          this.arrayKnx.forEach(element =>{
            KnxService.startChase(element._id).then((res) =>{
              (res.data.success) ? this._utils.openSnackBar("Tous les chenilliard sont allumés","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
            });
          })
        break;
        case "éteins le chenillards de la machine" :
          KnxService.stopChase(this.arrayKnx[number-1]._id).then((res) =>{
            (res.data.success) ? this._utils.openSnackBar("Chenillard " + number + " éteins","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
          });
        break;
        case "éteins les chenillards" :
          this.arrayKnx.forEach(element =>{
            KnxService.stopChase(element._id).then((res) =>{
              (res.data.success) ? this._utils.openSnackBar("Tous les chenilliards sont éteins","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
            });
          })
        break;
        case "inverse le chenillards de la machine" :
          KnxService.reverse(this.arrayKnx[number-1]._id).then((res) =>{
            (res.data.success) ? this._utils.openSnackBar("Chenillard " + number + "  inversé","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
          });
        break;
        case "inverse tous les chenillards" :
          this.arrayKnx.forEach(element =>{
            KnxService.reverse(element._id).then((res) =>{
              (res.data.success) ? this._utils.openSnackBar("Chenillard inversés","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
            });
          })
        break;
        case "accélère le chenillards de la machine" :
          KnxService.intervalDown(this.arrayKnx[number-1]._id).then((res) =>{
            (res.data.success) ? this._utils.openSnackBar("Accélèration chenillard " + number + " ","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
          });
        break;
        case "accélère tous les chenillards" :
          this.arrayKnx.forEach(element =>{
            KnxService.intervalDown(element._id).then((res) =>{
              (res.data.success) ? this._utils.openSnackBar("Accélèration des chenillard inversé","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
            });
          })
        break;
        case "ralenti le chenillards de la machine" :
        KnxService.intervalUp(this.arrayKnx[number-1]._id).then((res) =>{
          (res.data.success) ? this._utils.openSnackBar("Accélèration chenillard " + number + " ","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
        });
        break;
        case "ralenti tous les chenillards" :
          this.arrayKnx.forEach(element =>{
            KnxService.intervalUp(element._id).then((res) =>{
              (res.data.success) ? this._utils.openSnackBar("Accélèration des chenillard inversé","Ok","default-snackbar") : this._utils.openSnackBar("Error: " + res.data.errorMessage,"Ok","error-snackbar");
            });
          })
        case "boursier" :
          this._utils.openSnackBar("C'est tres IoTy les easters-eggs ","Beau Gosse","success-snackbar")
        break;
          default:
          this._utils.openSnackBar("Cette commande n'est pas implémentée ","Ok","default-snackbar")
      }
    });
    this.isRecording = true;
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
                  console.log("data. : " + JSON.stringify(data));
                  light.state = (data.action.value == 0) ? false : true;
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
