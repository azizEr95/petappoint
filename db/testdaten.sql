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
INSERT INTO animals (name, dateOfBirth, dateOfBirthIsExact, weightInGram, heightInCm, timeOfDeath, isCastrated, lifestyleIsIndoors, sex, fk_animalTypeId, fk_animalGroupId)
VALUES
  /* id */
  /* 01 */ ('Bambi', DATE '2021-01-13', TRUE, 4000, NULL, NULL, TRUE, TRUE, 'female', 2, NULL),
  /* 02 */ ('Maya', DATE '2020-09-30', TRUE, 4300, NULL, NULL, TRUE, TRUE, 'female', 2, NULL),
  /* 03 */ ('Huhn 1', NULL, FALSE, NULL, NULL, NULL, TRUE, FALSE, 'female', 7, NULL),
  /* 04 */ ('Huhn 2', NULL, FALSE, NULL, NULL, NULL, TRUE, FALSE, 'female', 7, NULL),
  /* 05 */ ('Huhn 3', NULL, FALSE, NULL, NULL, NULL, TRUE, FALSE, 'female', 7, NULL),
  /* 06 */ ('Huhn 4', NULL, FALSE, NULL, NULL, NULL, TRUE, FALSE, 'female', 7, NULL),
  /* 07 */ ('Huhn 5', NULL, FALSE, NULL, NULL, NULL, TRUE, FALSE, 'female', 7, NULL),
  /* 08 */ ('Cookie', '2022-09-20', FALSE, 97000, 197, NULL, TRUE, FALSE, 'notapplicable', 2, NULL);

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
  (2, 'daniel@arzt.de', 2),
  (1, 'hi@gmx.de', 4);

INSERT INTO SERVICES (name)
VALUES
  ('Allgemeine Untersuchung'),
  ('Röntgen'),
  ('Impfung'),
  ('Entwurmung'),
  ('Blutuntersuchung'),
  ('Kastration'),
  ('Untersuchung'),
  ('Zahnextraktion'),
  ('Zahnkontrolle'),
  ('Physiotherapie'),
  ('Notfalltermin');

-- Termine
-- Praxis 1
INSERT INTO appointments (startTime, endTime, fk_animalId, fk_veterinaryId, fk_veterinaryPracticeId, fk_serviceId)
VALUES
  ('2020-01-01 10:00', '2020-01-01 10:45', 1, 1, 1, 2),
  ('2025-11-13 22:00', '2025-11-13 22:45', NULL, 1, 1, NULL),
  ('2025-11-15 11:00', '2025-11-15 11:45', 8, 4, 1, NULL),
  ('2025-11-16 13:00', '2025-11-16 13:45', 2, 4, 1, 2),
  ('2025-11-18 13:00', '2025-11-18 13:45', 1, 4, 1, 3),
  ('2025-11-19 09:30', '2025-11-19 10:15', NULL, 2, 1, NULL),
  ('2025-11-19 14:00', '2025-11-19 14:45', NULL, 1, 1, NULL),
  ('2025-11-19 15:00', '2025-11-19 16:00', 2, 4, 1, 4),
  ('2025-11-20 16:30', '2025-11-20 17:00', NULL, 2, 1, NULL),
  ('2025-11-22 08:00', '2025-11-22 08:45', NULL, 4, 1, NULL),
  ('2025-11-22 09:00', '2025-11-22 09:45', NULL, 1, 1, NULL),
  ('2025-11-25 18:00', '2025-11-25 18:30', 1, 2, 1, 5),
  ('2025-11-28 10:00', '2025-11-28 10:45', 8, 4, 1, NULL),
  ('2025-11-30 16:30', '2025-11-30 17:00', NULL, 2, 1, NULL),
  ('2025-11-26 08:00', '2025-11-26 08:45', NULL, 4, 1, NULL),
  ('2025-11-24 09:00', '2025-11-24 09:45', NULL, 1, 1, NULL),
  ('2025-12-02 12:00', '2025-12-02 12:45', 2, 1, 1, 6),
  ('2025-12-02 13:00', '2025-12-02 13:30', NULL, 1, 1, NULL),
  ('2025-12-04 11:30', '2025-12-04 12:15', NULL, 1, 1, NULL),
  ('2025-12-07 20:00', '2025-12-07 21:00', NULL, 2, 1, NULL),
  ('2025-12-07 14:30', '2025-12-07 15:15', NULL, 1, 1, NULL),
  ('2025-12-10 10:00', '2025-12-10 10:30', 8, 4, 1, NULL),
  ('2025-12-10 14:00', '2025-12-10 15:00', 2, 2, 1, 2),
  ('2025-12-14 11:30', '2025-12-14 12:15', NULL, 1, 1, NULL),
  ('2025-12-16 20:00', '2025-12-16 21:00', NULL, 2, 1, NULL),
  ('2025-12-18 14:30', '2025-12-18 15:15', NULL, 1, 1, NULL),
  ('2025-12-22 11:30', '2025-12-22 12:15', NULL, 1, 1, NULL),
  ('2025-12-24 20:00', '2025-12-24 21:00', NULL, 2, 1, NULL),
  ('2025-12-28 14:30', '2025-12-28 15:15', NULL, 1, 1, NULL);
-- Praxis 2
INSERT INTO appointments (startTime, endTime, fk_animalId, fk_veterinaryId, fk_veterinaryPracticeId, fk_serviceId)
VALUES
  ('2025-11-17 09:00', '2025-11-17 09:30', 2, 2, 2, 8),
  ('2025-11-17 14:00', '2025-11-17 14:45', NULL, 4, 2, NULL),
  ('2025-11-19 11:30', '2025-11-19 12:00', NULL, 2, 2, NULL),
  ('2025-11-19 14:30', '2025-11-19 15:30', 1, 1, 2, 8),
  ('2025-11-21 16:00', '2025-11-21 16:45', 2, 4, 2, 8),
  ('2025-11-20 15:00', '2025-11-20 15:45', NULL, 2, 2, NULL),
  ('2025-11-20 17:00', '2025-11-20 17:30', NULL, 4, 2, NULL),
  ('2025-11-22 09:45', '2025-11-22 10:15', NULL, 4, 2, NULL),
  ('2025-11-24 15:00', '2025-11-24 15:45', NULL, 2, 2, NULL),
  ('2025-11-25 17:00', '2025-11-25 17:30', NULL, 4, 2, NULL),
  ('2025-11-25 09:45', '2025-11-25 10:15', NULL, 4, 2, NULL),
  ('2025-11-30 10:30', '2025-11-30 11:15', 2, 1, 2, 9),
  ('2025-11-25 19:00', '2025-11-25 19:45', NULL, 2, 2, NULL),
  ('2025-11-28 08:30', '2025-11-28 09:15', 8, 4, 2, NULL),
  ('2025-12-02 11:00', '2025-12-02 11:45', NULL, 1, 2, NULL),
  ('2025-12-02 15:00', '2025-12-02 15:45', NULL, 1, 2, NULL),
  ('2025-12-02 16:00', '2025-12-02 16:30', 2, 2, 2, 10),
  ('2025-12-10 12:00', '2025-12-10 12:45', 1, 4, 2, 3),
  ('2025-12-10 15:30', '2025-12-10 16:15', NULL, 2, 2, NULL),
  ('2025-12-14 12:10', '2025-12-14 12:45', 1, 4, 2, 9),
  ('2025-12-15 15:45', '2025-12-15 16:15', NULL, 2, 2, NULL),
  ('2025-12-20 10:30', '2025-12-20 11:00', NULL, 1, 2, NULL);
-- Praxen 3-5
INSERT INTO appointments (startTime, endTime, fk_animalId, fk_veterinaryId, fk_veterinaryPracticeId)
VALUES
  ('2025-11-24 10:00', '2025-11-24 10:45', NULL, 2, 3),
  ('2025-11-25 14:00', '2025-11-25 14:30', NULL, 1, 3),
  ('2025-11-28 09:30', '2025-11-28 10:15', NULL, 2, 3),
  ('2025-11-28 11:00', '2025-11-28 11:45', NULL, 4, 3),
  ('2025-12-04 16:00', '2025-12-04 16:30', NULL, 2, 3),
  ('2025-12-11 10:00', '2025-12-11 10:45', NULL, 1, 3),
  ('2025-12-12 15:00', '2025-12-12 16:00', NULL, 4, 3),
  ('2025-11-27 13:00', '2025-11-27 13:45', NULL, 2, 4),
  ('2025-12-02 09:00', '2025-12-02 09:45', NULL, 4, 4),
  ('2025-12-02 10:00', '2025-12-02 10:30', NULL, 4, 4),
  ('2025-12-16 11:30', '2025-12-16 12:00', NULL, 2, 4),
  ('2025-12-18 17:00', '2025-12-18 17:45', NULL, 1, 4),
  ('2025-12-05 15:00', '2025-12-05 15:45', NULL, 2, 5),
  ('2025-12-08 08:30', '2025-12-08 09:15', NULL, 4, 5),
  ('2025-12-20 13:00', '2025-12-20 13:30', NULL, 2, 5);

INSERT INTO person_has_favorized_veterinarypractice(fk_personId, fk_veterinaryPracticeId)
VALUES
  (1, 1),
  (2, 2),
  (1, 3),
  (4, 3);

  INSERT INTO veterinary_has_service(fk_veterinaryId, fk_serviceId)
VALUES
  (4, 1),
  (4, 2),
  (4, 3),
  (2, 3),
  (2, 2),
  (1, 1),
  (1, 2);

  INSERT INTO veterinary_can_treat_animaltype(fk_veterinaryId, fk_animalTypeId)
VALUES
  (4, 1),
  (4, 2),
  (4, 3),
  (2, 3),
  (2, 5),
  (2, 6),
  (1, 3);



-- ======================================================
-- TESTDATEN für Frontend-Features
-- ======================================================

-- Neue Adresse für Testpraxen
INSERT INTO addresses (street, citycode, city, country, longitude, latitude)
VALUES
  ('Teststraße 99', '10999', 'Berlin', 'Deutschland', 13.4200, 52.5100),
  ('Vieltermineweg 7', '20099', 'Hamburg', 'Deutschland', 10.0100, 53.5600);

-- Praxis OHNE Termine (ID 6)
INSERT INTO veterinarypractices (name, phone, infoemail, email, password, website, info, fk_addressid)
VALUES
  ('Tierpraxis Neustart', '+49 30 999999', 'info@neustart.de', 'kontakt@neustart.de', 'hashedpw999', NULL, 'Neu eröffnete Praxis ohne Termine.', 6);

-- Praxis MIT >5 Terminen an einem Tag (ID 7)
INSERT INTO veterinarypractices (name, phone, infoemail, email, password, website, info, fk_addressid)
VALUES
  ('Vollbuchte Tierklinik', '+49 40 888888', 'info@vollbucht.de', 'kontakt@vollbucht.de', 'hashedpw888', 'https://www.vollbucht.de', 'Sehr beliebte Klinik mit vielen Terminen.', 7);

-- Termine für Praxis 7: 8 Termine am gleichen Tag (2025-11-20)
INSERT INTO appointments (startTime, endTime, fk_animalId, fk_veterinaryId, fk_veterinaryPracticeId)
VALUES
  ('2025-11-20 08:00', '2025-11-20 08:30', NULL, 1, 7),
  ('2025-11-20 09:00', '2025-11-20 09:30', NULL, 1, 7),
  ('2025-11-20 10:00', '2025-11-20 10:30', NULL, 1, 7),
  ('2025-11-20 11:00', '2025-11-20 11:30', NULL, 1, 7),
  ('2025-11-20 12:00', '2025-11-20 12:30', NULL, 1, 7),
  ('2025-11-20 13:00', '2025-11-20 13:30', NULL, 1, 7),
  ('2025-11-20 14:00', '2025-11-20 14:30', NULL, 1, 7),
  ('2025-11-20 15:00', '2025-11-20 15:30', NULL, 1, 7);
