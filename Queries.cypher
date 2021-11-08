// TO FILL THE DB YOU CAN ENABLE MULTIPLE QUERIES FROM NEO4J AND THEN COPY ALL THE QUERIES TOGETHER

:param db : "http://localhost:11001/project-da7cfe3e-7448-46ba-905f-926647e1f16d/"; // Daniel
//:param db : "http://localhost:11001/project-c11cdf0a-2a95-4b3d-a467-86685e8e4496/"; // Federico
// :param db : "http://localhost:11001/project-b1dd45f0-9969-4248-ab57-242777289819/"; // Ottavio
////////////////////////////////////
// PERSON //
////////////////////////////////////

// (NODE) Loading the (PERSON) nodes
LOAD CSV WITH HEADERS FROM ($db + 'person.csv') AS row
CREATE (:Person {person_id: row.person_id, person_name: row.person_name, person_surname: row.person_surname});

// (EDGES) Loading the (RELATIONSHIP) edges 
LOAD CSV WITH HEADERS FROM $db + 'relative.csv' AS row
MATCH (person1:Person {person_id:row.person_id_1}), (person2:Person {person_id:row.person_id_2})
CREATE (person1)-[:RELATED_TO]->(person2);

// (EDGES) Loading the (MEETS) edges
LOAD CSV WITH HEADERS FROM $db + 'meets_trimmed.csv' AS row
MATCH (person1:Person {person_id:row.person_id_1}), (person2:Person {person_id:row.person_id_2})
CREATE (person1)-[:MEETS {place_name: row.place_name, place_category: row.place_category, meeting_date: row.meeting_date} ]->(person2);

////////////////////////////////////
// CONTAGION
////////////////////////////////////
LOAD CSV WITH HEADERS FROM $db + 'contagion_trimmed.csv' AS row
CREATE (:Contagion {contagion_id: row.contagion_id, contagion_date: date(row.contagion_date), 
contagion_place_name: row.place_name, contagion_place_category: row.place_category});

// RELATIONS

// (PERSON)
LOAD CSV WITH HEADERS FROM $db + 'contagion_person_relation.csv' AS row
MATCH (person:Person {person_id:row.infected_person_id}), (contagion:Contagion {contagion_id:row.contagion_id})
CREATE (person)-[:IS {person_id: row.infected_person_id, contagion_id: row.contagion_id} ]->(contagion);


////////////////////////////////////
// VACCINES //
////////////////////////////////////
LOAD CSV WITH HEADERS FROM $db + 'vaccine.csv' AS row
CREATE (:Vaccine {vaccine_id: row.vaccine_id, vaccine_date: date(row.vaccine_date), vaccine_manufacturer: row.vaccine_manufacturer});

// (PERSON)
LOAD CSV WITH HEADERS FROM $db + 'vaccine_person_relation.csv' AS row
MATCH (person:Person {person_id:row.vaccinated_person_id}), (vaccine:Vaccine {vaccine_id:row.vaccine_id})
CREATE (person)-[:GETS {person_id: row.vaccinated_person_id, vaccine_id: row.vaccine_id} ]->(vaccine);

////////////////////////////////////
// TEST //
////////////////////////////////////
LOAD CSV WITH HEADERS FROM $db + 'test.csv' AS row
CREATE (:Test {test_id: row.test_id, test_date: date(row.test_date), test_type: row.test_type, result: row.result});

// (PERSON)
LOAD CSV WITH HEADERS FROM $db + 'test_person_relation.csv' AS row
MATCH (person:Person {person_id:row.tested_person_id}), (test:Test {test_id:row.test_id})
CREATE (person)-[:TAKES {person_id: row.tested_person_id, test_id: row.test_id} ]->(test);

// DELETE //
MATCH (n) DETACH DELETE n

// QUERIES //

// Basic queries // 
// 1) Number of vaccinated people
MATCH (p:Person)-[r:GETS]->()
RETURN count(DISTINC p) AS count

// 2) Number of people with positive test (last 30 days)
MATCH (p:Person)-[r:TAKES]->(t:Test)
WHERE t.test_date >= (date() - duration({days:30}))
RETURN count(DISTINCT p) AS count

// 3) How many different places category are there? (theather, restaurant, cinema)
MATCH (p1:Person)-[r:MEETS]->(p2:Person)
RETURN DISTINCT r.place_category AS place

// 4) How many people were contagion at least twice?
MATCH (p:Person)-[r:IS]->(c:Contagion)
WITH p, count(c) AS countContag
WHERE countContag >=2
RETURN p

// Check that all the relatives of an infected person gets infected (as required by the project report)
// Intermediate queries //

// 1) Place categories where the highest number of contagions occurred
MATCH (c:Contagion)
WITH c.contagion_place_category as Place, count(*) as NContagions
ORDER BY NContagions DESC
RETURN Place, NContagions

// 2) Top 3 ranking of highest number of contagions in place category
MATCH (c:Contagion)
WITH c.contagion_place_category as Place, count(*) as NContagions
ORDER BY NContagions DESC
LIMIT 3
RETURN Place, NContagions

// 3) Maximum number of contagion in a single place
MATCH (c:Contagion)
WITH c.contagion_place_name as Place, count(*) as NContagions
UNWIND NContagions as element
RETURN max(element) AS MaxNContagions

// Advanced queries //
// 1) Retrieve all the people that have been a contagion along with all their parents
// relationships away from a contagion ( these should have higher chances of being infected )
MATCH (p:Person)-[r1:IS]-(c:Contagion)
MATCH (p)-[r2:RELATED_TO*..n]-(p2:Person)
RETURN *
