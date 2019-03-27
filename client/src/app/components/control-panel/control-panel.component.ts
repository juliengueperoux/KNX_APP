import { Component, OnInit } from '@angular/core';
import KnxService from '../../services/knx.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  numeros =[1,2,3,4]
  interval = 1000;
  active = true; 
  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
    // FINIR DE TRAITER LA PROMISE
    KnxService.getAllLight().then((res) =>{
      this.numeros = res.data; 
    });
    console.log(this.numeros);
  }

  setCSSclass(name,classCss,action) : void{
    (action) ? document.getElementById(name).classList.add(classCss) : document.getElementById(name).classList.remove(classCss);
  }

  openSnackBar(message: string, action: string) : void{
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  allLights(event): void {
    if(event.checked){
      KnxService.startAllLights().then((res) =>{
        (res.data.success) ? this.openSnackBar("Lampes allumées","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      this.numeros.forEach(element => {
        let nameLight = "svg-light-" + element
        //let nameToggle = "toggle-" + element
        //document.getElementById(nameToggle). = true;
        this.setCSSclass(nameLight,'is-activated',true);
        document.getElementById(nameLight).classList.add();
      })
    }
    else{
      KnxService.stopAllLights().then((res) =>{
        (res.data.success) ? this.openSnackBar("Lampes éteintes","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      this.numeros.forEach(element => {
        let name = "svg-light-" + element
        this.setCSSclass(name,'is-activated',false);
      })
    } 
  }

  stateLight(numero,event): void{
    if(event.checked){
      KnxService.startLight(numero).then((res) =>{
        (res.data.success) ? this.openSnackBar("Lampe numéro " + numero + " allumée","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      let name = "svg-light-" + numero;
      this.setCSSclass(name,'is-activated',true);
    } 
    else{
      KnxService.stopLight(numero).then((res) =>{
        (res.data.success) ? this.openSnackBar("Lampe numéro " + numero + " éteinte","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });;
      let name = "svg-light-" + numero;
      this.setCSSclass(name,'is-activated',false);
    } 
  }

  chase(event) : void{
    if(event.checked){
      KnxService.startChase().then((res) =>{
        (res.data.success) ? this.openSnackBar("Chenillard allumé","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
    }
    else{
      KnxService.stopChase().then((res) =>{
        (res.data.success) ? this.openSnackBar("Chenillard éteint","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      this.active =false;
    } 
  }

  reverse() : void{
    KnxService.reverse().then((res) =>{
      (res.data.success) ? this.openSnackBar("Chenillard inversé","Ok") : this.openSnackBar("Error" + res.data,"Ok");
    });
  }

  setIntervalChase(event) : void{
    this.interval = event.value;
  }

  intervalChaseService() : void{
    KnxService.startLight(this.interval).then((res) =>{
      (res.data.success) ? this.openSnackBar("Interval de " + this.interval + " µs","Ok") : this.openSnackBar("Error" + res.data,"Ok");
    });
  }
  


}
