import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})


export class ScenarioComponent {
      dataSource;
      displayedColumns = [];
      @ViewChild(MatSort) sort: MatSort;
      
      
      columnNames = [{
        id: "nameKnx",
        value: "Knx machine"

      }, {
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
        id: "repition",
        value: "Activation"
      }];

      ngOnInit() {
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();
      }

      createTable() {
        let tableArr: Element[] = [{ nameKnx: "Test", nameLamp: 'Hydrogen', action: "Allumer", hours: '10h', repition: '12 mars 2018' },
        { nameKnx: "Test", nameLamp: 'Helium', action: "Allumer", hours: '14h', repition: 'Tous les jours' },
        { nameKnx: "Test", nameLamp: 'Lithium', action: "Eteindre", hours: '16h', repition: '1 fois par semaines'},
        { nameKnx: "Test", nameLamp: 'Beryllium', action: "Allumer", hours: '6h', repition: '14 avril 2019' },
        { nameKnx: "Test", nameLamp: 'Boron', action: "Eteindre", hours: '5h', repition: 'Tous les jours' },
        { nameKnx: "Test", nameLamp: 'Carbon', action: "Allumer", hours: '6h30', repition: 'Tous les jours' }
        ];
        this.dataSource = new MatTableDataSource(tableArr);
        this.dataSource.sort = this.sort;
      }

}

export interface Element {
  nameKnx: string,
  nameLamp: string,
  action: string,
  hours: string,
  repition: string
}