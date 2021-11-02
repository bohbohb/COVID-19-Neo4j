////////////////////////////////////
// PERSON //
////////////////////////////////////

// (NODE) Loading the (PERSON) nodes
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/person.csv' AS row
CREATE (:Person {person_id: row.person_id, person_name: row.person_name, person_surname: row.person_surname})

// (EDGES) Loading the (RELATIONSHIP) edges 
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/relative.csv' AS row
MATCH (person1:Person {person_id:row.person_id_1})
MATCH (person2:Person {person_id:row.person_id_2})
CREATE (person1)-[:RELATED_TO]->(person2)

////////////////////////////////////
// PLACE //
////////////////////////////////////

// (NODE) Loading the (PLACE) nodes
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/place.csv' AS row
CREATE (:Place {place_id: row.place_id, place_name: row.place_name, place_category: row.place_category})

// (EDGES) Loading the (MEETS) edges
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/meets.csv' AS row
MATCH (person1:Person {person_id:row.person_id_1})
MATCH (person2:Person {person_id:row.person_id_2})
CREATE (person1)-[:MEETS {place_id: row.place_id, meeting_date: row.meeting_date} ]->(person2)

////////////////////////////////////
// CONTAGION
////////////////////////////////////
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/contagion.csv' AS row
CREATE (:Contagion {contagion_id: row.contagion_id, contagion_date: row.contagion_date})

// RELATIONS

// (PERSON)
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/contagion_person_relation.csv' AS row
MATCH (person:Person {person_id:row.infected_person_id})
MATCH (contagion:Contagion {contagion_id:row.contagion_id})
CREATE (person)-[:IS {person_id: row.infected_person_id, contagion_id: row.contagion_id} ]->(contagion)

// (PLACES)
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/contagion_place_relation.csv' AS row
MATCH (place:Place {place_id:row.contagion_place_id})
MATCH (contagion:Contagion {contagion_id:row.contagion_id})
CREATE (contagion)-[:OCCUR {place_id: row.contagion_place_id, contagion_id: row.contagion_id} ]->(place)

////////////////////////////////////
// VACCINES //
////////////////////////////////////
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/vaccine.csv' AS row
CREATE (:Vaccine {vaccine_id: row.vaccine_id, vaccine_date: row.vaccine_date})

// (PERSON)
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/vaccine_person_relation.csv' AS row
MATCH (person:Person {person_id:row.vaccinated_person_id})
MATCH (vaccine:Vaccine {vaccine_id:row.vaccine_id})
CREATE (person)-[:GETS {person_id: row.vaccinated_person_id, vaccine_id: row.vaccine_id} ]->(vaccine)

////////////////////////////////////
// TEST //
////////////////////////////////////
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/test.csv' AS row
CREATE (:Test {test_id: row.test_id, test_date: row.test_date, test_type: row.test_type, result: row.result})

// (PERSON)
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/test_person_relation.csv' AS row
MATCH (person:Person {person_id:row.tested_person_id})
MATCH (test:Test {test_id:row.test_id})
CREATE (person)-[:TAKES {person_id: row.tested_person_id, test_id: row.test_id} ]->(test)

// DELETE //
MATCH (n) DETACH DELETE n

// QUERIES //

// Basic queries // 
// 1) Number of vaccinated people
// 2) Number of people with positive test (last 30 days)
// 3) How many different places category are there? (theather, restaurant, cinema)
// 4) How many people were contagion at least twice?

// Intermediate queries //
// 1) Show statistics (grouped) on vaccinated people / tests / 
// 2) Places where the highest number of contagions occurred

// Advanced queries //
// 1) Retrieve all the people that are max "n" relationships away from a contagion ( these should have higher chances of being infected )
// 2) 
