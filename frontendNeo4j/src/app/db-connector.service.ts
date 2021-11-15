import { Injectable } from '@angular/core';
import { AngularNeo4jService} from "angular-neo4j";
import { Person} from "./person";
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vaccine } from './vaccine';
import { CovidCheck } from './covidCheck';
import { Places } from './places';


const URL = 'bolt://localhost:7687';
const USERNAME = 'neo4j';
const PASSWORD = 'password';
const ENCRYPTED = false;


@Injectable({
  providedIn: 'root'
})
export class DbConnectorService {

  persons: Person[] = [];
  vaccinesPerson: Vaccine[] = [];
  testsPerson: CovidCheck[] = [];
  placesCategory: Places[] = [];

  constructor(private neo4j: AngularNeo4jService) { }

  connect() {
    this.neo4j.connect(
      URL,
      USERNAME,
      PASSWORD,
      ENCRYPTED
    ).then(driver => {
      if (driver) {
        console.log(`Successfully connected to ${URL}`);
      }
    }).catch(e => {
        console.error(e)
      }
    );
  }

  rawQuery(query: string, params?: any) {
    return this.neo4j.run("MATCH (n:Person) RETURN n LIMIT 25")
  }

  getAllPersons(): Observable<Person[]>  {
    return from(this.neo4j.run("MATCH (n:Person) RETURN n LIMIT 25")).pipe(
      map((result: any) => {
        this.persons = []
        result.forEach((node: any[]) => {
          let p: Person = {
            person_id: node[0].properties.person_id,
            person_name: node[0].properties.person_name,
            person_surname: node[0].properties.person_surname,
          }
          this.persons?.push(p)
        })
        return this.persons
      }),
      catchError(err => {
        throw err
      })
    )
  }

  getVaccinesForPerson(idOfPerson: string): Observable<Vaccine[]>  {
    this.vaccinesPerson = []
    return from(this.neo4j.run("MATCH (p:Person{person_id: $idOfPerson})-[r:GETS]->(v:Vaccine) RETURN v LIMIT 25", {idOfPerson: idOfPerson})).pipe(
      map((result: any) => {
        result.forEach((node: any[]) => {
          let v: Vaccine = {
            vaccine_id: node[0].properties.vaccine_id,
            vaccine_date: node[0].properties.vaccine_date,
            vaccinated_person_id: node[0].properties.vaccinated_person_id,
            vaccine_manufacturer: node[0].properties.vaccine_manufacturer,
          }
          this.vaccinesPerson?.push(v)
        })
        return this.vaccinesPerson
      }),
      catchError(err => {
        throw err
      })
    )
  }

  getTestForPerson(idOfPerson: string): Observable<CovidCheck[]> {
    this.testsPerson = []
    return from(this.neo4j.run('MATCH (p:Person{person_id: $idOfPerson})-[r:TAKES]->(t:Test) RETURN t LIMIT 25', {idOfPerson: idOfPerson})).pipe(
      map((result: any) => {
        result.forEach((node: any[]) => {
          let t: CovidCheck = {
            test_id: node[0].properties.test_id,
            test_date: node[0].properties.test_date,
            test_type: node[0].properties.test_type,
            result: node[0].properties.result,
          }
          this.testsPerson?.push(t)
        })
        return this.testsPerson
      }),
      catchError(err => {
        throw err
      })
    )
  }

  // Number of vaccinated people in the database
  getNumberOfVacconatedPeople(): Observable<number> {
    return from(this.neo4j.run('MATCH (p:Person)-[r:GETS]->() RETURN count(DISTINCT p) AS count')).pipe(
      map((result: any) => {
        return result[0][0] as number;
      }),
      catchError(err => {
        throw err
      })
    )
  }

  // Number of people with a positive tests over the last “n” days
  getNumberOfPeopleWithPositiveTestLast30Days(): Observable<number> {
    return from(this.neo4j.run('MATCH (p:Person)-[r:TAKES]->(t:Test) WHERE t.test_date >= (date() - duration({days:30})) RETURN count(DISTINCT p) AS count')).pipe(
      map((result: any) => {
        return result[0][0] as number;
      }),
      catchError(err => {
        throw err
      })
    )
  }

  // Distinct point of interests for people to meet
  getDifferentPlacesCategory(): Observable<Places[]> {
    return from(this.neo4j.run('MATCH (p1:Person)-[r:MEETS]->(p2:Person) RETURN DISTINCT r.place_category AS place')).pipe(
      map((result: any) => {
        this.placesCategory = ([] as Places[]).concat(...result)
        return this.placesCategory
      }),
      catchError(err => {
        throw err
      })
    )
  }

  // Who have been a contagion at least twice?
  getPersonsWereContagionAtLeastTwice() : Observable<Person[]> {
    return from(this.neo4j.run("MATCH (p:Person)-[r:IS]->(c:Contagion) WITH p, count(c) AS countContag WHERE countContag >=2 RETURN p")).pipe(
      map((result: any) => {
        this.persons = []
        result.forEach((node: any[]) => {
          let p: Person = {
            person_id: node[0].properties.person_id,
            person_name: node[0].properties.person_name,
            person_surname: node[0].properties.person_surname,
          }
          this.persons?.push(p)
        })
        return this.persons
      }),
      catchError(err => {
        throw err
      })
    )
  }

  getPlaceCategoryWhereTheHighestNumberOfContagionsOccurred(): Observable<Places[]>  {
    return from(this.neo4j.run("MATCH (c:Contagion) WITH c.contagion_place_category as Place, count(*) as NContagions ORDER BY NContagions DESC RETURN Place, NContagions")).pipe(
      map((result: any) => {
        this.placesCategory = []
        result.forEach((node: any[]) => {
          let p: Places = {
            place_name: node[0],
            contagion_number: node[1],
          }
          this.placesCategory?.push(p)
        })
        return this.placesCategory
      }),
      catchError(err => {
        throw err
      })
    )
  }

  // Top 3 ranking of highest number of contagions by place category
  getTop3RankingOfHighestNumberOfContagionsInPlaceCategory(): Observable<Places[]>  {
    return from(this.neo4j.run("MATCH (c:Contagion) WITH c.contagion_place_category as Place, count(*) as NContagions ORDER BY NContagions DESC LIMIT 3 RETURN Place, NContagions")).pipe(
      map((result: any) => {
        this.placesCategory = []
        result.forEach((node: any[]) => {
          let p: Places = {
            place_name: node[0],
            contagion_number: node[1],
          }
          this.placesCategory?.push(p)
        })
        return this.placesCategory
      }),
      catchError(err => {
        throw err
      })
    )
  }

  // Maximum number of contagion in a single place
  getMaxNumberOfContagionInASinglePlace(): Observable<number> {
    return from(this.neo4j.run('MATCH (c:Contagion) WITH c.contagion_place_name as Place, count(*) as NContagions UNWIND NContagions as element RETURN max(element) AS MaxNContagions')).pipe(
      map((result: any) => {
        return result[0][0] as number;
      }),
      catchError(err => {
        throw err
      })
    )
  }

  // Retrieve all the people that have been a contagion along with all their parents
  // relationships max "n" people away ( higher chances of being infected )
  getAllThePeopleThatHaveBeenAContagionAlongWithAllTheirParentsRelationshipsAwayFromAContagion() {
    return from(this.neo4j.run('MATCH (p:Person)-[r1:IS]-(c:Contagion) MATCH (p)-[r2:RELATED_TO*..1]-(p2:Person) RETURN *')).pipe(
      map((result: any) => {
        console.log(result)
        result.forEach((node: any[]) => {
          console.log(node)
        })
        return result
      }),
      catchError(err => {
        throw err
      })
    )
  }
}
