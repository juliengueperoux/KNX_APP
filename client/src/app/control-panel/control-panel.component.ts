import { Component, OnInit } from '@angular/core';
import KnxService from '../services/knxService';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  numeros =[1,2,3,4]

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
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
        document.getElementById(nameLight).classList.add('is-activated');
      })
    }
    else{
      KnxService.stopAllLights().then((res) =>{
        (res.data.success) ? this.openSnackBar("Lampes éteintes","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      this.numeros.forEach(element => {
        let name = "svg-light-" + element
        document.getElementById(name).classList.remove  ('is-activated');
      })
    } 
  }

  stateLight(numero,event): void{
    if(event.checked){
      KnxService.startLight(numero).then((res) =>{
        (res.data.success) ? this.openSnackBar("Lampe numéro " + numero + " allumée","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      let name = "svg-light-" + numero;
      document.getElementById(name).classList.add('is-activated');
    } 
    else{
      KnxService.stopLight(numero).then((res) =>{
        (res.data.success) ? this.openSnackBar("Lampe numéro " + numero + " éteinte","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });;
      let name = "svg-light-" + numero;
      document.getElementById(name).classList.remove('is-activated');
    } 
  }

  chase(event) : void{
    if(event.checked){
      KnxService.startChase().then((res) =>{
        (res.data.success) ? this.openSnackBar("Chenillard allumé","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      /*this.numeros.forEach(element => {
        let nameLight = "svg-light-" + element
        //let nameToggle = "toggle-" + element
        //document.getElementById(nameToggle). = true;
        document.getElementById(nameLight).classList.add('is-activated');
      })*/
    }
    else{
      KnxService.stopChase().then((res) =>{
        (res.data.success) ? this.openSnackBar("Chenillard éteint","Ok") : this.openSnackBar("Error" + res.data,"Ok");
      });
      /*this.numeros.forEach(element => {
        let name = "svg-light-" + element
        document.getElementById(name).classList.remove  ('is-activated');
      })*/
    } 
  }

  reverse() : void{
    KnxService.reverse().then((res) =>{
      (res.data.success) ? this.openSnackBar("Chenillard inversé","Ok") : this.openSnackBar("Error" + res.data,"Ok");
    });
  }
  

}
