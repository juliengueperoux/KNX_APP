import { Component, OnInit } from '@angular/core';
import KnxService from '../../services/knx.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  arrayKnx = [];
  interval = 1000;
  active = true; 
  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
    // FINIR DE TRAITER LA PROMISE
    this.getAllLights();
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

  openSnackBar(message: string, action: string) : void{
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  allLights(event,indice,id): void {
    if(event.checked){
      KnxService.startAllLights(id).then((res) =>{
        (res.data.success) ? this.openSnackBar("Lampes allumées","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      this.arrayKnx[indice].lights.forEach(element => {
        let nameLight = "svg-light-" + element.id + "-" + indice;
        this.setCSSclass(nameLight,'is-activated',true);
        document.getElementById(nameLight).classList.add();
      })
    }
    else{
      KnxService.stopAllLights(id).then((res) =>{
        (res.data.success) ? this.openSnackBar("Lampes éteintes","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      this.arrayKnx[indice].lights.forEach(element => {
        let nameLight = "svg-light-" + element.id + "-" + indice;
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
        (res.data.success) ? this.openSnackBar("Lampe numéro " + numero + " allumée","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      let nameLight = "svg-light-" + numero + "-" + indice;
      console.log(nameLight);
      this.setCSSclass(nameLight,'is-activated',true);
    } 
    else{
      KnxService.stopLight({
        'id' : numero,
        'idKnx' : id
      }).then((res) =>{
        (res.data.success) ? this.openSnackBar("Lampe numéro " + numero + " éteinte","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });;
      let nameLight = "svg-light-" + numero + "-" + indice;
      this.setCSSclass(nameLight,'is-activated',false);
    } 
  }

  chase(event,id) : void{
    if(event.checked){
      KnxService.startChase(id).then((res) =>{
        (res.data.success) ? this.openSnackBar("Chenillard allumé","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
    }
    else{
      KnxService.stopChase(id).then((res) =>{
        (res.data.success) ? this.openSnackBar("Chenillard éteint","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      this.active =false;
    } 
  }

  reverse(id) : void{
    KnxService.reverse(id).then((res) =>{
      (res.data.success) ? this.openSnackBar("Chenillard inversé","Ok") : this.openSnackBar("Error" + res.data,"Ok");
    });
  }

  setIntervalChase(event,id) : void{
    this.interval = event.value;
  }

  intervalChaseService(id) : void{
    KnxService.intervalValue({
      'interval' : this.interval,
      'idKnx' : id
    }).then((res) =>{
      (res.data.success) ? this.openSnackBar("Interval de " + this.interval + " µs","Ok") : this.openSnackBar("Error" + res.data,"Ok");
    });
  }
  


}
