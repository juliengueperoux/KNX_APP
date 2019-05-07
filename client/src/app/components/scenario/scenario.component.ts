import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Scenario } from "../../models/scenario";
import ScenarioService from "../../services/scenario.service";
import KnxService from "../../services/knx.service";
import { KnxMachine } from '../../models/knx-machine';
import { Lamp } from '../../models/lamp';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})


export class ScenarioComponent implements OnInit {
  dataSource: MatTableDataSource<Element>;
  selection = new SelectionModel<Element>(true, []);
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;

  responsive: boolean = false;

  knxGroup: FormGroup;
  lampGroup: FormGroup;
  repetitionsGroup: FormGroup

  action = "Eteindre";
  arrayElement: Array<Element>; //Scenario table
  arrayScenario: Array<Scenario>;
  arrayKnx: Array<KnxMachine> = [];
  arrayLamp: Array<Lamp> = [];
  repetitionList: string[] = ['Tous les jours', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  scenarioObj: Scenario;


    columnNames = [ //whithout select
      {
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
    this.responsive = (window.innerWidth < 500) ? true : false;
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

    this.displayedColumns = ['select',...this.columnNames.map(x => x.id)];
    this.createTable();
    this.getAllLights();
    this.scenarioObj = new Scenario("", "", "", [], false, { hours: 0, minutes: 0 }, [], false);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  removeSelectedRows() {
    this.selection.selected.forEach(item => {
      let index: number = this.arrayElement.findIndex(d => d === item);
      console.log(this.arrayElement.findIndex(d => d === item));
      this.dataSource.data.splice(index, 1);
      ScenarioService.deleteScenario(item.id)
      this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
    });
    this.selection = new SelectionModel<Element>(true, []);
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
        this.arrayElement = Array<Element>();
        res.data.forEach(element => {
          let nameLamp = "";
          element.lights.forEach(e => {
            nameLamp += e.name + ", "
          });
          nameLamp = nameLamp.slice(0, nameLamp.length - 2)
          this.arrayElement.push({
            id: element._id,
            nameScenario: element.name,
            nameKnx: element.nameKnx,
            nameLamp: nameLamp,
            action: (element.action) ? 'Allumer' : 'Eteindre',
            hours: element.time.hours + ':' + element.time.minutes,
            repetition: element.repetition
          });
          this.dataSource = new MatTableDataSource(this.arrayElement);
          this.dataSource.sort = this.sort;
        });
      }
    });
  }

  recapObject(): void {
    const time: Array<String> = this.repetitionsGroup.get('inputTimeControl').value.split(':')
    const action: Boolean = (this.action == "Allumer" ? true : false)
    this.scenarioObj.action = action
    this.scenarioObj.time = { hours: time[0], minutes: time[1] }
    this.scenarioObj.name = this.knxGroup.get('inputNameScenarioControl').value
    this.scenarioObj.idKnx = this.knxGroup.get('selectKnxControl').value._id
    this.scenarioObj.nameKnx = this.knxGroup.get('selectKnxControl').value.name
    this.scenarioObj.repetition = this.repetitionsGroup.get('selectRepetitionControl').value
    this.scenarioObj.lights = this.lampGroup.get('selectLampControl').value
  }

  resetFormGroups(): void {
    this.scenarioObj = new Scenario("", "", "", [], false, { hours: '0', minutes: '0' }, [], false);
  }

  createNewScenario(): void {
    ScenarioService.addScenario(this.scenarioObj).then(result => {
      if (result.data.success) {
        let nameLamp = "";
        this.scenarioObj.lights.forEach(e => {
          nameLamp += e.name + ", "
        });
        nameLamp = nameLamp.slice(0, nameLamp.length - 2)
        this.arrayElement.push({
          id: result.data.data._id,
          nameScenario: this.scenarioObj.name,
          nameKnx: this.scenarioObj.nameKnx,
          nameLamp: nameLamp,
          action: (this.scenarioObj.action) ? 'Allumer' : 'Eteindre',
          hours: this.scenarioObj.time.hours + ':' + this.scenarioObj.time.minutes,
          repetition: this.scenarioObj.repetition
        });
        this.dataSource = new MatTableDataSource(this.arrayElement);
        this.resetFormGroups()
      }
    })
    console.log("on lance la requete !")
  }

}

export interface Element {
  id: String,
  nameScenario: String,
  nameKnx: String,
  nameLamp: String,
  action: String,
  hours: String,
  repetition: Object[]
}