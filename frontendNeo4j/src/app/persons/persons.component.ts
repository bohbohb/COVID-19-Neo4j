import { Component, OnInit } from '@angular/core';
import {Person} from "../person";
import {PERSONS} from "../mock-persons";
import {DbConnectorService} from "../db-connector.service";
import { Vaccine } from '../vaccine';
import { CovidCheck } from '../covidCheck';

@Component({
  selector: 'app-persons-component',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {

  persons: Person[] | undefined;
  selectedPerson?: Person;
  dbConnector: DbConnectorService
  vaccinesForPerson: Vaccine[] = [];
  testsForPerson: CovidCheck[] = [];

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

  getTests(person: Person) {
    this.dbConnector.getTestForPerson(person.person_id.toString()).subscribe(test => {
      this.testsForPerson = test
      //console.log(test)
    })
  }

  onSelect(person: Person): void {
    this.selectedPerson = person;
    this.vaccinesForPerson = [];
    this.testsForPerson = [];
    this.dbConnector.getVaccinesForPerson(this.selectedPerson.person_id.toString()).subscribe(vac => this.vaccinesForPerson = vac)
    this.getTests(this.selectedPerson)



  }

}
