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
  
  arrayScenario : Array<Scenario>;
  arrayKnx:Array<KnxMachine> = [];
  arrayLamp: Array<Lamp> = [];

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
  }

  getAllLights() : void{
    KnxService.findConfigs().then((res) =>{
      this.arrayKnx = res.data;
    });
  }

  setCurrentLampArray(id,idKnx): void{
    console.log("Ici :" + id);
    document.getElementById(id).removeAttribute("disabled");
    this.arrayKnx.forEach((element, i) => {
      if(element._id==idKnx){
        this.arrayLamp = element.lights;
        return true;
      }
    });
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