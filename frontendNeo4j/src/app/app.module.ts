import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PersonsComponent } from './persons/persons.component';
import {FormsModule} from "@angular/forms";
import {AngularNeo4jModule} from "angular-neo4j";

@NgModule({
  declarations: [
    AppComponent,
    PersonsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularNeo4jModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
