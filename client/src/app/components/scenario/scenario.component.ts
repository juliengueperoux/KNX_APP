import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Scenario } from "../../models/scenario";
import ScenarioService  from "../../services/scenario.service";
import KnxService  from "../../services/knx.service";
import { KnxMachine } from '../../models/knx-machine';
import { Lamp } from '../../models/lamp';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})


export class ScenarioComponent {
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;
  
  action = "Eteindre";

  arrayScenario : Array<Scenario>;
  arrayKnx:Array<KnxMachine> = [];
  arrayLamp: Array<Lamp> = [];

  scenarioObj: Scenario;

  columnNames = [{
    id: "nameScenario",
    value: "Nom Scénario"

  },
  {
    id: "nameKnx",
    value: "Machine"
  }, 
  {
    id: "nameLamp",
    value: "Lamp"
  },
  {
    id: "action",
    value: "Action"
  },
  {
    id: "hours",
    value: "Heures"
  },
  {
    id: "repetition",
    value: "Activation"
  }];

  ngOnInit() {
    this.displayedColumns = this.columnNames.map(x => x.id);
    this.createTable();
    this.getAllLights();
    this.scenarioObj = new Scenario("","","",[],false,new Date(),"");
  }

  getAllLights() : void{
    KnxService.findConfigs().then((res) =>{
      this.arrayKnx = res.data;
    });
  }

  setCurrentLampArray(id,idKnx): void{
    document.getElementById(id).removeAttribute("disabled");
    this.arrayKnx.forEach((element, i) => {
      console.log(element);
      if(element._id==idKnx){
        //this.scenarioObj.setName(element.name);
        //this.scenarioObj.setIdKnx(element._id);
        this.arrayLamp = element.lights;
        return true;
      }
    });
  }

  setArrayLamp(id, arrayLamp): void{
    console.log("PARA : " + arrayLamp);
    this.scenarioObj.setLights(arrayLamp);
    (arrayLamp.length > 0) ? document.getElementById(id).removeAttribute("disabled") : document.getElementById(id).setAttribute("disabled","disabled");
  }

  changeAction(event){
    this.scenarioObj.setAction(event);
    this.action = (event.checked) ? "Allumer" : "Eteindre";
  }

  createTable() {
    ScenarioService.getAllScenario().then((res) =>{
      console.log(res.data);
      if(res.data){
        var arrayElement = Array<Element>();
        res.data.forEach(element => {
          let nameLamp = "";
          element.lights.forEach(e => {
            nameLamp+= e.name + ", "
          });
          arrayElement.push({
            nameScenario : element.name,
            nameKnx : element.nameKnx,
            nameLamp : nameLamp,
            action: (element.action) ? 'Allumer' : 'Eteindre',
            hours: element.date,
            repetition: element.repetition
          });
          this.dataSource = new MatTableDataSource(arrayElement);
          this.dataSource.sort = this.sort;
        });
      }
    });
    
  }

}

export interface Element {
  nameScenario: string,
  nameKnx: string,
  nameLamp: string,
  action: string,
  hours: string,
  repetition: string
}