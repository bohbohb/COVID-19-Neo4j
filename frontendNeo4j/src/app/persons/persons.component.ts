import { Component, OnInit } from '@angular/core';
import {Person} from "../person";
import {PERSONS} from "../mock-persons";
import {DbConnectorService} from "../db-connector.service";

@Component({
  selector: 'app-persons-component',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {

  persons: Person[] | undefined;
  selectedPerson?: Person;
  dbConnector: DbConnectorService

  constructor(dbConnector: DbConnectorService) {
    this.dbConnector = dbConnector
  }

  ngOnInit(): void {
    this.dbConnector.connect()
    this.getPersons()
  }

  getPersons() {
     this.dbConnector.getAllPersons().subscribe(pers => this.persons = pers)
  }

  onSelect(person: Person): void {
    this.selectedPerson = person;
  }

}
