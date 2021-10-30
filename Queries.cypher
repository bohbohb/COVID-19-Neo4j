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
// CONTAGION // (TODO: determine what to do with this entity! )
////////////////////////////////////
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/contagion.csv' AS row
CREATE (:Contagion {contagion_id: row.contagion_id, infected_person_id: row.infected_person_id, contagion_place_id: row.contagion_place_id, contagion_date: row.contagion_date})

////////////////////////////////////
// VACCINES //
////////////////////////////////////
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/vaccine.csv' AS row
CREATE (:Vaccine {vaccine_id: row.vaccine_id, vaccinated_person_id: row.vaccinated_person_id, vaccine_date: row.vaccine_date})

////////////////////////////////////
// TEST //
////////////////////////////////////
LOAD CSV WITH HEADERS FROM 'http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/test.csv' AS row
CREATE (:Test {test_id: row.test_id, tested_person_id: row.tested_person_id, test_date: row.test_date, test_type: row.test_type, result: row.result})

