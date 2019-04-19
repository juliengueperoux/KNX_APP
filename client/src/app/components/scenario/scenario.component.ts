import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Scenario } from "../../models/scenario";
import ScenarioService from "../../services/scenario.service";
import KnxService from "../../services/knx.service";
import { KnxMachine } from '../../models/knx-machine';
import { Lamp } from '../../models/lamp';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})


export class ScenarioComponent implements OnInit {
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;

  knxGroup: FormGroup;
  lampGroup: FormGroup;
  repetitionsGroup: FormGroup

  action = "Eteindre";

  arrayScenario: Array<Scenario>;
  arrayKnx: Array<KnxMachine> = [];
  arrayLamp: Array<Lamp> = [];
  repetitionList: string[] = ['Jour', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
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

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {

    this.knxGroup = this._formBuilder.group({
      selectKnxControl: ['', Validators.required],
      inputNameScenarioControl: ['', Validators.required]
    })
    this.lampGroup = this._formBuilder.group({
      selectLampControl: [[], Validators.required]
    })

    this.repetitionsGroup = this._formBuilder.group({
      inputTimeControl: ['', Validators.required],
      selectRepetitionControl: ['', Validators.required]
    });

    this.displayedColumns = this.columnNames.map(x => x.id);
    this.createTable();
    this.getAllLights();
    this.scenarioObj = new Scenario("", "", "", [], false, { hour: 0, minutes: 0 }, []);
  }

  getAllLights(): void {
    KnxService.findConfigs().then((res) => {
      this.arrayKnx = res.data;
    });
  }

  setCurrentLampArray(): void {
    const idKnx: String = this.knxGroup.get('selectKnxControl').value._id;
    this.arrayKnx.forEach((element) => {
      if (element._id == idKnx) {
        this.arrayLamp = element.lights;
      }
    });
  }

  setArrayLamp(arrayLamp): void {
    this.scenarioObj.setLights(arrayLamp);
  }

  changeAction(event) {
    this.scenarioObj.setAction(event);
    this.action = (event.checked) ? "Allumer" : "Eteindre";
  }

  createTable() {
    ScenarioService.getAllScenario().then((res) => {
      console.log(res.data);
      if (res.data) {
        var arrayElement = Array<Element>();
        res.data.forEach(element => {
          let nameLamp = "";
          element.lights.forEach(e => {
            nameLamp += e.name + ", "
          });
          arrayElement.push({
            nameScenario: element.name,
            nameKnx: element.nameKnx,
            nameLamp: nameLamp,
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

  recapObject(): void{
    const time :Array<String> = this.repetitionsGroup.get('inputTimeControl').value.split(':')
    this.scenarioObj.time = {hour:time[0], minutes:time[1]}
    this.scenarioObj.name =  this.knxGroup.get('inputNameScenarioControl').value
    this.scenarioObj.idKnx = this.knxGroup.get('selectKnxControl').value._id
    this.scenarioObj.nameKnx = this.knxGroup.get('selectKnxControl').value.name
    this.scenarioObj.repetition = this.repetitionsGroup.get('selectRepetitionControl').value
    this.scenarioObj.lights = this.lampGroup.get('selectLampControl').value
  }

  resetFormGroups(): void {
    this.scenarioObj = new Scenario("", "", "", [], false, { hour: 0, minutes: 0 }, []);
  }

  createNewScenario(): void {
    console.log("on lance la requete !")
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