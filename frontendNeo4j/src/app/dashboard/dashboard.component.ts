import { Component, OnInit } from '@angular/core';
import {DbConnectorService} from "../db-connector.service";
import { Person } from '../person';
import { Places } from '../places';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  numberOfVacconatedPeople: number = 0;
  numberOfPeopleWithPositiveTestLast30Days: number = 0;
  differentPlacesCategory: Places[] = [];
  personsWereContagionAtLeastTwice: Person[] = [];

  contagionsPlaces: Places[] = [];
  totalContagionsInPlaces: number = 0;
  top3ContagionsPlaces: Places[] = [];
  maxNumberOfContagionInASinglePlace: number = 0;

  dbConnector: DbConnectorService;

  constructor(dbConnector: DbConnectorService) {
    this.dbConnector = dbConnector
  }

  ngOnInit(): void {
    this.dbConnector.connect()
    this.getNumberOfVacconatedPeople()
    this.getNumberOfPeopleWithPositiveTestLast30Days()
    this.getDifferentPlacesCategory()
    this.getPersonsWereContagionAtLeastTwice()
    this.getPlaceCategoryWhereTheHighestNumberOfContagionsOccurred()
    this.getTop3RankingOfHighestNumberOfContagionsInPlaceCategory()
    this.getMaxNumberOfContagionInASinglePlace()
  }

  getNumberOfVacconatedPeople() {
    this.dbConnector.getNumberOfVacconatedPeople().subscribe(num => this.numberOfVacconatedPeople = num);
  }

  getNumberOfPeopleWithPositiveTestLast30Days() {
    this.dbConnector.getNumberOfPeopleWithPositiveTestLast30Days().subscribe(num => this.numberOfPeopleWithPositiveTestLast30Days = num);
  }

  getDifferentPlacesCategory() {
    this.dbConnector.getDifferentPlacesCategory().subscribe(places => this.differentPlacesCategory = places)
  }

  getPersonsWereContagionAtLeastTwice() {
    this.dbConnector.getPersonsWereContagionAtLeastTwice().subscribe(persons => this.personsWereContagionAtLeastTwice = persons)
  }

  getPlaceCategoryWhereTheHighestNumberOfContagionsOccurred() {
    this.dbConnector.getPlaceCategoryWhereTheHighestNumberOfContagionsOccurred().subscribe(places => {
      this.contagionsPlaces = places
      let sum: number = this.contagionsPlaces.map(p => p.contagion_number).reduce((sum, cur) => sum + cur)
      this.totalContagionsInPlaces = sum
    })
  }

  getTop3RankingOfHighestNumberOfContagionsInPlaceCategory() {
    this.dbConnector.getTop3RankingOfHighestNumberOfContagionsInPlaceCategory().subscribe(places => this.top3ContagionsPlaces = places)
  }

  getMaxNumberOfContagionInASinglePlace() {
    this.dbConnector.getMaxNumberOfContagionInASinglePlace().subscribe(nMax => this.maxNumberOfContagionInASinglePlace = nMax)
  }
}
