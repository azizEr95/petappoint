-- ======================================================
-- Testdaten für veterinarypractices
-- (mit minimalen Dummy-Addresses für Foreign Keys)
-- ======================================================

-- Dummy-Adressen (nur zum FK-Verknüpfen)
INSERT INTO addresses (street, citycode, city, country, longitude, latitude)
VALUES
  ('Hauptstraße 1', '10115', 'Berlin', 'Deutschland', 13.4050, 52.5200),
  ('Bahnhofstraße 12', '20095', 'Hamburg', 'Deutschland', 10.0000, 53.5500),
  ('Marktplatz 5', '80331', 'München', 'Deutschland', 11.5755, 48.1374),
  ('Rheinallee 22', '50667', 'Köln', 'Deutschland', 6.9603, 50.9375),
  ('Kaiserstraße 8', '60311', 'Frankfurt am Main', 'Deutschland', 8.6821, 50.1109);

-- Personen
INSERT INTO persons (firstName, lastName, sex, dateOfBirth, fk_address, phone, email, password)
VALUES
  /* id */
  /* 01 */ ('Joe', 'Doe', 'male', DATE '2000-01-01', 1, '+493000000000', 'joe@doe.de', '#123456'),
  /* 02 */ ('Daniel', 'Müller', 'male', DATE '1920-05-10', 1, '+493000000001', 'daniel@daniel.de', '#123456'),
  /* 03 */ ('James', 'Jayjay', 'male', DATE '1999-02-15', 2, '+493000000002', 'james@jay.de', '#123456'),
  /* 04 */ ('Maria', 'May', 'female', DATE '1999-02-15', 4, '+493000000003', 'm@m.de', '#123456'),
  /* 05 */ ('Denis', 'Deniz', 'notknown', DATE '2050-01-01', 5, '+493000000004', 'joey@doey.de', '#123456'),
  /* 06 */ ('Aziz', 'Erol', 'male', DATE '1900-11-20', 5, '+493000000005', 'aziz@erol.de', '#123456');

-- animaltypes
INSERT INTO animaltypes (name)
VALUES
  ('Hund'),
  ('Katze'),
  ('Kleintier'),
  ('Vogel'),
  ('Reptil'),
  ('Pferd'),
  ('Nutztier');

-- animalRaces
INSERT INTO animalRaces (name, fk_animalTypeId)
VALUES
  /* id */
  --  Hund
  /* 01 */ ('Labrador', 1),
  /* 02 */ ('Pudel', 1),
  /* 03 */ ('Schäferhund', 1),
  /* 04 */ ('Pitbull', 1),
  -- Katze
  /* 05 */ ('Britisch Kurzhaar', 2),
  -- Kleintier
  /* 06 */ ('Kaninchen', 3),
  /* 07 */ ('Meerschweinchen', 3),
  /* 08 */ ('Hamster', 3),
  -- Vogel
  /* 09 */ ('Papagei', 4),
  /* 10 */ ('Wellensittich', 4),
  /* 11 */ ('Taube', 4),
  /* 12 */ ('Falke', 4),
  /* 13 */ ('Krähe', 4),
  /* 14 */ ('Rabe', 4),
  /* 15 */ ('Aasgeier', 4),
  -- Reptil
  /* 16 */ ('Eidechse', 5),
  /* 17 */ ('Schlange', 5),
  -- Pferd
  /* 18 */ ('Pegasus', 6),
  /* 19 */ ('Pony', 6),
  -- Nutztier
  /* 20 */ ('Huhn', 7),
  /* 21 */ ('Schaf', 7),
  /* 22 */ ('Kuh', 7),
  /* 23 */ ('Rind', 7);

-- animalgroup
INSERT INTO animalgroup (name)
VALUES
  /* id */
  /* 01 */ ('Viecher'),
  /* 02 */ ('Haustiere'),
  /* 03 */ ('Farm'),
  /* 04 */ ('Streuner'),
  /* 05 */ ('Farm');

-- animals
INSERT INTO animals (name, dateOfBirth, dateOfBirthIsExact, weightInGram, heightInCm, timeOfDeath, isCastrated, lifestyle, sex, fk_animalTypeId, fk_animalGroupId)
VALUES
  /* id */
  /* 01 */ ('Bambi', DATE '2021-01-13', TRUE, 4000, NULL, NULL, TRUE, 'indoor', 'female', 2, NULL),
  /* 02 */ ('Maya', DATE '2020-09-30', TRUE, 4300, NULL, NULL, TRUE, 'indoor', 'female', 2, NULL),
  /* 03 */ ('Huhn 1', NULL, FALSE, NULL, NULL, NULL, TRUE, 'organic', 'female', 7, NULL),
  /* 04 */ ('Huhn 2', NULL, FALSE, NULL, NULL, NULL, TRUE, 'organic', 'female', 7, NULL),
  /* 05 */ ('Huhn 3', NULL, FALSE, NULL, NULL, NULL, TRUE, 'organic', 'female', 7, NULL),
  /* 06 */ ('Huhn 4', NULL, FALSE, NULL, NULL, NULL, TRUE, 'organic', 'female', 7, NULL),
  /* 07 */ ('Huhn 5', NULL, FALSE, NULL, NULL, NULL, TRUE, 'organic', 'female', 7, NULL),
  /* 08 */ ('Cookie', '2022-09-20', FALSE, 97000, 197, NULL, TRUE, 'organic', 'notapplicable', 2, NULL);

-- animal_has_races
--

INSERT INTO person_has_animal (fk_personId, fk_animalId)
VALUES
  (6, 1),
  (6, 2),
  (1, 3),
  (2, 4),
  (4, 5),
  (3, 6);

-- Testdaten für Tierarztpraxen (veterinarypractices)
INSERT INTO veterinarypractices (name, phone, infoemail, email, password, website, info, fk_addressid)
VALUES
  ('Tierarztpraxis Berlin Mitte', '+49 30 123456', 'info@berlinvet.de', 'kontakt@berlinvet.de', 'hashedpw123', 'https://www.berlinvet.de', 'Kompetente Kleintierpraxis im Herzen Berlins.', 1),
  ('Alstertal Tierklinik Hamburg', '+49 40 987654', 'info@alstertier.de', 'kontakt@alstertier.de', 'hashedpw456', 'https://www.alstertier.de', 'Moderne Tierklinik mit 24h-Notdienst.', 2),
  ('Tiergesundheit München', '+49 89 111222', 'info@muenchentiere.de', 'praxis@muenchentiere.de', 'hashedpw789', NULL, 'Praxis für Haustiere aller Art.', 3),
  ('VetKöln - Tiermedizin am Rhein', '+49 221 333444', 'info@vetkoeln.de', 'praxis@vetkoeln.de', 'hashedpw321', 'https://www.vetkoeln.de', 'Spezialisiert auf Kleintiere und Exoten.', 4),
  ('FrankfurtVet - Zentrum für Tiermedizin', '+49 69 555666', 'info@frankfurtvet.de', 'kontakt@frankfurtvet.de', 'hashedpw654', 'https://www.frankfurtvet.de', 'Tierärztliches Zentrum mit Chirurgie und Diagnostik.', 5);

-- Tierarzt
INSERT INTO veterinaries (id, infoEmail, fk_veterinarypractice)
VALUES
  (4, 'maria@arzt.de', 1),
  (2, 'daniel@arzt.de', 1),
  (1, NULL, NULL);

-- Termine
INSERT INTO appointments (startTime, endTime, fk_animalId, fk_veterinaryId, fk_veterinaryPracticeId)
VALUES
  ('2020-01-01 10:00', '2020-01-01 10:45', 4, 1, 1),
  ('2025-11-15 10:00', '2025-11-15 10:45', 4, 1, 1),
  ('2025-11-15 11:00', '2025-11-15 11:45', NULL, 4, 1),
  ('2025-11-15 11:00', '2025-11-15 11:45', NULL, 2, 1),
  ('2025-11-15 13:00', '2025-11-15 13:45', NULL, 4, 1);