import { Injectable } from '@angular/core';
import { AngularNeo4jService} from "angular-neo4j";
import { Person} from "./person";
import { Observable, of } from 'rxjs';

const URL = 'bolt://localhost:7687';
const USERNAME = 'neo4j';
const PASSWORD = 'password';
const ENCRYPTED = false;


@Injectable({
  providedIn: 'root'
})
export class DbConnectorService {

  persons: Person[] = [];

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
    return this.neo4j.run(query, params)
  }

  getAllPersons(): Observable<Person[]>  {
    this.neo4j.run("MATCH (n:Person) RETURN n LIMIT 25").then((result: any) => {
      result.forEach((node: any[]) => {
        let p: Person = {
          person_id: node[0].properties.person_id,
          person_name: node[0].properties.person_name,
          person_surname: node[0].properties.person_surname,
        }
        this.persons?.push(p)
      })
    })
    return of(this.persons)
  }

}
