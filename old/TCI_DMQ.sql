/*CS 340 Porject Group 33
* Pokemon TCI Data Manipulation Queries
* Bernardo Mendes
* Gage Davelaar
*/

-- SELECT QUERIES --
-- display all regions
SELECT name
FROM Regions;

-- display all gyms
SELECT Gyms.name AS gym_name, Gyms.type, Regions.name AS region_name
FROM Gyms
INNER JOIN Regions ON Gyms.region_id = Regions.region_id;

-- display all gyms of a particular type
SELECT Gyms.name AS gym_name, Gyms.type, Regions.name AS region_name
FROM Gyms
INNER JOIN Regions ON Gyms.region_id = Regions.region_id
WHERE Gyms.type = :gym_type;

-- display all trainers
SELECT Trainers.name AS trainer_name, Trainers.age, Regions.name AS region_name
FROM Trainers
INNER JOIN Regions ON Trainers.region_id = Regions.region_id;

-- display all pokemon
SELECT Pokemon.name AS pokemon_name, Pokemon.type, Trainers.name AS trainer_name, Regions.name AS region_name
FROM Pokemon
INNER JOIN Trainers ON Pokemon.trainer_id = Trainers.trainer_id
INNER JOIN Regions ON Pokemon.region_id = Regions.region_id;

--display all pokemon owned by a specific trainer
SELECT Pokemon.name AS pokemon_name, Pokemon.type, Trainers.name AS trainer_name, Regions.name AS region_name
FROM Pokemon
INNER JOIN Trainers ON Pokemon.trainer_id = Trainers.trainer_id
INNER JOIN Regions ON Pokemon.region_id = Regions.region_id
WHERE Trainers.name = :trainer_name;

-- display all Badges
SELECT Trainers.name AS trainer_name, TrainerGyms.badge_name, TrainerGyms.date_earned
FROM TrainerGyms
INNER JOIN Trainers ON TrainerGyms.trainer_id = Trainers.trainer_id;

-- display all badges earned by a particular trainer
SELECT Trainers.name AS trainer_name, TrainerGyms.badge_name, TrainerGyms.date_earned
FROM TrainerGyms
INNER JOIN Trainers ON TrainerGyms.trainer_id = Trainers.trainer_id
WHERE Trainers.name = :trainer_name;


-- INSERT QUERIES -- 
-- insert a new region
INSERT INTO Regions (name) 
VALUES (:region_name_input)

-- insert a new gym
INSERT INTO Gyms (name, type, region_id)
VALUES (:gym_name_input, :gym_type_input, :region_id_from_dropdown_input)

-- insert a new trainer
INSERT INTO Trainers (name, age, region_id)
VALUES (:trainer_name_input, :trainer_age_input, :region_id_from_dropdown_input)

-- insert a new pokemon
INSERT INTO Pokemon (name, type, region_id, trainer_id) 
VALUES (:pokemonNameInput, :typeInput, :region_id_from_dropdown_input, :trainer_id_from_dropdown_input);

-- insert a new badge earning (insert a new relationship between trainer and gym)
INSERT INTO TrainerGyms (trainer_id, gym_id, badge_name, date_earned) 
VALUES (:trainer_id_from_dropdown_Input, :gym_id_from_dropdown_input, :badge_name_Input, :date_earned_input);


-- UPDATE QUERIES -- 

-- update trainer data
UPDATE Trainers
SET name = :trainer_name_input,
age = :trainer_age_input,
region_id = :region_id_from_dropdown_input
WHERE trainer_id = :trainer_id_from_update_form;


-- DELETE QUERIES --

-- delete a pokemon
DELETE FROM Pokemon
WHERE pokemon_id = :pokemon_id_from_browse_page;

-- disqualify badge earning (delete M:M relationship between trainer and gym)
DELETE FROM TrainerGyms
WHERE trainer_id = :trainer_id_from_browse_page
AND gym_id = :gym_id_from_browse_page;