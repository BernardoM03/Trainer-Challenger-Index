/*CS 340 Porject Group 33
* Pokemon TCI
* Bernardo Mendes
* Gage Davelaar
*/

SET time_zone = "+00:00";

SET FOREIGN_KEY_CHECKS=0; 
SET AUTOCOMMIT = 0;


-- --------------------------------------------------------

--
-- Table structure for table `Regions`
--

DROP TABLE IF EXISTS Regions;
CREATE TABLE Regions (
  region_id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  PRIMARY KEY (region_id)
);

--
-- Dumping data for table `Regions`
--

INSERT INTO Regions (name) VALUES
('Kanto'),
('Sinnoh'),
('Kalos');

-- --------------------------------------------------------

--
-- Table structure for table `Trainers`
--
DROP TABLE IF EXISTS Trainers;
CREATE TABLE Trainers (
  trainer_id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  age int(11) DEFAULT NULL,
  region_id int(11),
  PRIMARY KEY (trainer_id),
  FOREIGN KEY (region_id) REFERENCES Regions(region_id) ON DELETE CASCADE ON UPDATE CASCADE
);
--
-- Dumping data for table `Trainers`
--

INSERT INTO Trainers (name, age, region_id) VALUES 
('Ash Ketchum', 10, (SELECT region_id FROM Regions WHERE name = 'Kanto')),
('Gary Oak', 10, (SELECT region_id FROM Regions WHERE name = 'Kanto')),
('Dawn', 10, (SELECT region_id FROM Regions WHERE name = 'Sinnoh')),
('Alain', NULL, (SELECT region_id FROM Regions WHERE name = 'Kalos'));

-- --------------------------------------------------------

--
-- Table structure for table `Pokemon`
--

DROP TABLE IF EXISTS Pokemon;
CREATE TABLE Pokemon (
  pokemon_id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  type varchar(45) NOT NULL,
  region_id int(11),
  trainer_id int(11) NOT NULL,
  PRIMARY KEY (pokemon_id),
  FOREIGN KEY (region_id) REFERENCES Regions(region_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES Trainers(trainer_id) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping data for table `Pokemon`
--

INSERT INTO Pokemon (name, type, region_id, trainer_id) VALUES
('Pikachu', 'Electric', (SELECT region_id FROM Regions WHERE name = 'Kanto'), (SELECT trainer_id FROM Trainers WHERE name = 'Ash Ketchum')),
('Blastoise', 'Water', (SELECT region_id FROM Regions WHERE name = 'Kanto'), (SELECT trainer_id FROM Trainers WHERE name = 'Gary Oak')),
('Piplup', 'Water', (SELECT region_id FROM Regions WHERE name = 'Sinnoh'), (SELECT trainer_id FROM Trainers WHERE name = 'Dawn')),
('Charizard', 'Fire, Flying', (SELECT region_id FROM Regions WHERE name = 'Kalos'), (SELECT trainer_id FROM Trainers WHERE name = 'Alain')),
('Greninja', 'Water, Dark', (SELECT region_id FROM Regions WHERE name = 'Kalos'), (SELECT trainer_id FROM Trainers WHERE name = 'Ash Ketchum'));

-- --------------------------------------------------------

--
-- Table structure for table `Gyms`
--

DROP TABLE IF EXISTS Gyms;
CREATE TABLE Gyms (
  gym_id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  type varchar(45) NOT NULL,
  region_id int(11) NOT NULL,
  PRIMARY KEY (gym_id),
  FOREIGN KEY (region_id) REFERENCES Regions(region_id) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping data for table `Gyms`
--

INSERT INTO Gyms (name, type, region_id) VALUES
('Vermillion Gym', 'Electric', (SELECT region_id FROM Regions WHERE name = 'Kanto')),
('Pastoria Gym', 'Water', (SELECT region_id FROM Regions WHERE name = 'Sinnoh')),
('Shalour Gym', 'Fighting', (SELECT region_id FROM Regions WHERE name = 'Kalos'));

--
-- Table structure for table `TrainerGyms`
--

DROP TABLE IF EXISTS `TrainerGyms`;

CREATE TABLE TrainerGyms (
  gym_id int(11) NOT NULL,
  trainer_id int(11) NOT NULL,
  badge_name varchar(45) NOT NULL,
  date_earned date DEFAULT NULL,
  PRIMARY KEY (gym_id,trainer_id),
  FOREIGN KEY (gym_id) REFERENCES Gyms(gym_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES Trainers(trainer_id) ON DELETE CASCADE ON UPDATE CASCADE  
);

--
-- Dumping data for table `TrainerGyms`
--

INSERT INTO TrainerGyms (gym_id, trainer_id, badge_name, date_earned) VALUES
((SELECT gym_id FROM Gyms WHERE name = 'Vermillion Gym'), (SELECT trainer_id FROM Trainers WHERE name = 'Ash Ketchum'), 'Thunder Badge', '1997-07-01'),
((SELECT gym_id FROM Gyms WHERE name = 'Pastoria Gym'), (SELECT trainer_id FROM Trainers WHERE name = 'Ash Ketchum'), 'Fen Badge', '2008-06-19'),
((SELECT gym_id FROM Gyms WHERE name = 'Shalour Gym'), (SELECT trainer_id FROM Trainers WHERE name = 'Ash Ketchum'), 'Rumble Badge', '2014-09-25');


SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*

INSERT INTO Regions (name) VALUES
('Kanto'),
('Sinnoh'),
('Kalos');

INSERT INTO Trainers (name, age, region_id) VALUES 
('Ash Ketchum', 10, (SELECT region_id FROM Regions WHERE name = 'Kanto')),
('Gary Oak', 10, (SELECT region_id FROM Regions WHERE name = 'Kanto')),
('Dawn', 10, (SELECT region_id FROM Regions WHERE name = 'Sinnoh')),
('Alain', NULL, (SELECT region_id FROM Regions WHERE name = 'Kalos'));

INSERT INTO Pokemon (name, type, region_id, trainer_id) VALUES
('Pikachu', 'Electric', (SELECT region_id FROM Regions WHERE name = 'Kanto'), (SELECT trainer_id FROM Trainers WHERE name = 'Ash Ketchum')),
('Blastoise', 'Water', (SELECT region_id FROM Regions WHERE name = 'Kanto'), (SELECT trainer_id FROM Trainers WHERE name = 'Gary Oak')),
('Piplup', 'Water', (SELECT region_id FROM Regions WHERE name = 'Sinnoh'), (SELECT trainer_id FROM Trainers WHERE name = 'Dawn')),
('Charizard', 'Fire, Flying', (SELECT region_id FROM Regions WHERE name = 'Kalos'), (SELECT trainer_id FROM Trainers WHERE name = 'Alain')),
('Greninja', 'Water, Dark', (SELECT region_id FROM Regions WHERE name = 'Kalos'), (SELECT trainer_id FROM Trainers WHERE name = 'Ash Ketchum'));

INSERT INTO Gyms (name, type, region_id) VALUES
('Vermillion Gym', 'Electric', (SELECT region_id FROM Regions WHERE name = 'Kanto')),
('Pastoria Gym', 'Water', (SELECT region_id FROM Regions WHERE name = 'Sinnoh')),
('Shalour Gym', 'Fighting', (SELECT region_id FROM Regions WHERE name = 'Kalos'));

INSERT INTO TrainerGyms (gym_id, trainer_id, badge_name, date_earned) VALUES
((SELECT gym_id FROM Gyms WHERE name = 'Vermillion Gym'), (SELECT trainer_id FROM Trainers WHERE name = 'Ash Ketchum'), 'Thunder Badge', '1997-07-01'),
((SELECT gym_id FROM Gyms WHERE name = 'Pastoria Gym'), (SELECT trainer_id FROM Trainers WHERE name = 'Ash Ketchum'), 'Fen Badge', '2008-06-19'),
((SELECT gym_id FROM Gyms WHERE name = 'Shalour Gym'), (SELECT trainer_id FROM Trainers WHERE name = 'Ash Ketchum'), 'Rumble Badge', '2014-09-25');

*/
