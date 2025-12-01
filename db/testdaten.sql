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
-- Passwort: HabboHotel123
INSERT INTO persons (firstName, lastName, sex, dateOfBirth, fk_address, phone, email, password)
VALUES
  /* id */
  /* 01 */ ('Joe', 'Doe', 'male', DATE '2000-01-01', 1, '+493000000000', 'joe@doe.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2'),
  /* 02 */ ('Daniel', 'Müller', 'male', DATE '1920-05-10', 1, '+493000000001', 'daniel@daniel.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2'),
  /* 03 */ ('James', 'Jayjay', 'male', DATE '1999-02-15', 2, '+493000000002', 'james@jay.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2'),
  /* 04 */ ('Maria', 'May', 'female', DATE '1999-02-15', 4, '+493000000003', 'm@m.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2'),
  /* 05 */ ('Denis', 'Deniz', 'notknown', DATE '2050-01-01', 5, '+493000000004', 'joey@doey.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2'),
  /* 06 */ ('Aziz', 'Erol', 'male', DATE '1900-11-20', 5, '+493000000005', 'aziz@erol.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2');

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
-- Passwort: HabboHotel123
INSERT INTO veterinarypractices (name, phone, infoemail, email, password, website, info, fk_addressid)
VALUES
  ('Tierarztpraxis Berlin Mitte', '+49 30 123456', 'info@berlinvet.de', 'kontakt@berlinvet.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2', 'https://www.berlinvet.de', 'Kompetente Kleintierpraxis im Herzen Berlins.', 1),
  ('Alstertal Tierklinik Hamburg', '+49 40 987654', 'info@alstertier.de', 'kontakt@alstertier.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2', 'https://www.alstertier.de', 'Moderne Tierklinik mit 24h-Notdienst.', 2),
  ('Tiergesundheit München', '+49 89 111222', 'info@muenchentiere.de', 'praxis@muenchentiere.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2', NULL, 'Praxis für Haustiere aller Art.', 3),
  ('VetKöln - Tiermedizin am Rhein', '+49 221 333444', 'info@vetkoeln.de', 'praxis@vetkoeln.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2', 'https://www.vetkoeln.de', 'Spezialisiert auf Kleintiere und Exoten.', 4),
  ('FrankfurtVet - Zentrum für Tiermedizin', '+49 69 555666', 'info@frankfurtvet.de', 'kontakt@frankfurtvet.de', '$2b$10$3aziu8mKSUNiJ7dGCGcKd.FZeiOSW2Nw5Ml0w7DhGWZtE3nR2Z6b2', 'https://www.frankfurtvet.de', 'Tierärztliches Zentrum mit Chirurgie und Diagnostik.', 5);

-- Tierarzt
INSERT INTO veterinarians (id, infoEmail, fk_veterinarypractice)
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

-- ==============================================================================
-- SEED DATA: Veterinary Practices and veterinarians
-- Generated by backend/scripts/seed-practices.ts
-- ==============================================================================

-- Addresses from seed
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (6, 'Waldstraße 51', '50667', 'Köln', 'Deutschland', 6.949257997126332, 50.97823465814653);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (7, 'Waldstraße 27', '50667', 'Köln', 'Deutschland', 6.949188201912817, 50.90862008891581);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (8, 'Bahnhofstraße 24', '20095', 'Hamburg', 'Deutschland', 9.983665148531106, 53.50159637105136);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (9, 'Parkstraße 180', '70173', 'Stuttgart', 'Deutschland', 9.194942413501169, 48.73717702942994);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (10, 'Marktplatz 67', '50667', 'Köln', 'Deutschland', 7.009213365809604, 50.90231434763871);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (11, 'Kaiserstraße 126', '01067', 'Dresden', 'Deutschland', 13.72950011820729, 51.09804101753067);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (12, 'Königstraße 99', '60311', 'Frankfurt am Main', 'Deutschland', 8.70667497689707, 50.10571664534344);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (13, 'Königstraße 159', '10115', 'Berlin', 'Deutschland', 13.4536640168264, 52.5270501404766);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (14, 'Gartenstraße 176', '01067', 'Dresden', 'Deutschland', 13.75728587402428, 51.05163190658088);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (15, 'Bahnhofstraße 152', '10115', 'Berlin', 'Deutschland', 13.42112685297836, 52.50125552214876);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (16, 'Lindenstraße 22', '04103', 'Leipzig', 'Deutschland', 12.38209790440289, 51.38775195887765);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (17, 'Bahnhofstraße 98', '30159', 'Hannover', 'Deutschland', 9.757432010347559, 52.34889019727002);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (18, 'Schulstraße 44', '70173', 'Stuttgart', 'Deutschland', 9.232254952710292, 48.78147491394433);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (19, 'Marktplatz 97', '10115', 'Berlin', 'Deutschland', 13.39389797012373, 52.53850610633554);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (20, 'Hauptstraße 190', '20095', 'Hamburg', 'Deutschland', 10.0177551784922, 53.50874955989701);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (21, 'Kaiserstraße 119', '80331', 'München', 'Deutschland', 11.54017314285782, 48.12541132276721);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (22, 'Gartenstraße 118', '44135', 'Dortmund', 'Deutschland', 7.489504602910523, 51.48444897899741);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (23, 'Kirchstraße 149', '01067', 'Dresden', 'Deutschland', 13.78663631247801, 51.05521123685651);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (24, 'Marktplatz 2', '04103', 'Leipzig', 'Deutschland', 12.37509549441755, 51.33370125704316);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (25, 'Parkstraße 134', '80331', 'München', 'Deutschland', 11.60888711093314, 48.14291779204529);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (26, 'Rheinstraße 105', '80331', 'München', 'Deutschland', 11.58320536464447, 48.11457152031936);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (27, 'Lindenstraße 150', '45127', 'Essen', 'Deutschland', 7.001638294240489, 51.4417692251712);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (28, 'Bahnhofstraße 50', '60311', 'Frankfurt am Main', 'Deutschland', 8.662776225597755, 50.08167131589256);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (29, 'Hauptstraße 129', '60311', 'Frankfurt am Main', 'Deutschland', 8.673969029420025, 50.1181358174993);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (30, 'Königstraße 107', '45127', 'Essen', 'Deutschland', 6.985857851318831, 51.44964097526898);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (31, 'Königstraße 38', '50667', 'Köln', 'Deutschland', 6.992051803042362, 50.9356894088198);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (32, 'Bahnhofstraße 123', '01067', 'Dresden', 'Deutschland', 13.78159715677001, 51.00060394829613);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (33, 'Friedrichstraße 174', '70173', 'Stuttgart', 'Deutschland', 9.175450281680146, 48.77696412864238);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (34, 'Königstraße 194', '50667', 'Köln', 'Deutschland', 6.978548139390504, 50.97054025595972);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (35, 'Rheinstraße 104', '10115', 'Berlin', 'Deutschland', 13.43237196661101, 52.53491578686199);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (36, 'Bergstraße 24', '01067', 'Dresden', 'Deutschland', 13.68730967738797, 51.04063185339364);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (37, 'Kirchstraße 170', '80331', 'München', 'Deutschland', 11.53621095462461, 48.14613668591274);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (38, 'Schulstraße 5', '01067', 'Dresden', 'Deutschland', 13.71024256455218, 51.05312292765429);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (39, 'Rheinstraße 58', '20095', 'Hamburg', 'Deutschland', 9.95883918868934, 53.54053756261069);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (40, 'Kaiserstraße 76', '50667', 'Köln', 'Deutschland', 6.919494119801822, 50.95623116313577);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (41, 'Marktplatz 7', '04103', 'Leipzig', 'Deutschland', 12.37601243404031, 51.29644163782896);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (42, 'Parkstraße 93', '45127', 'Essen', 'Deutschland', 7.007290817970798, 51.42603164030889);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (43, 'Friedrichstraße 41', '20095', 'Hamburg', 'Deutschland', 9.972534703293439, 53.55732172277926);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (44, 'Kaiserstraße 104', '53111', 'Bonn', 'Deutschland', 7.10223057173227, 50.73414606890256);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (45, 'Lindenstraße 53', '40210', 'Düsseldorf', 'Deutschland', 6.781004686195896, 51.24214470235839);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (46, 'Schulstraße 55', '10115', 'Berlin', 'Deutschland', 13.39940581195015, 52.55395171026722);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (47, 'Waldstraße 97', '60311', 'Frankfurt am Main', 'Deutschland', 8.646278047622747, 50.10804619107272);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (48, 'Bergstraße 158', '20095', 'Hamburg', 'Deutschland', 10.00544945925635, 53.5514690253522);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (49, 'Kirchstraße 94', '53111', 'Bonn', 'Deutschland', 7.076228238234452, 50.7631457368993);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (50, 'Kaiserstraße 18', '28195', 'Bremen', 'Deutschland', 8.822426996133846, 53.06385421904717);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (51, 'Parkstraße 4', '70173', 'Stuttgart', 'Deutschland', 9.171525369162364, 48.82104234036122);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (52, 'Bergstraße 160', '53111', 'Bonn', 'Deutschland', 7.122451067125541, 50.7280513466412);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (53, 'Friedrichstraße 44', '60311', 'Frankfurt am Main', 'Deutschland', 8.71306915613039, 50.14340676595588);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (54, 'Bahnhofstraße 176', '44135', 'Dortmund', 'Deutschland', 7.432163630701069, 51.47032122065406);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (55, 'Kirchstraße 155', '90402', 'Nürnberg', 'Deutschland', 11.08730162055655, 49.43900493120916);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (56, 'Königstraße 73', '28195', 'Bremen', 'Deutschland', 8.780301797079288, 53.05805760031882);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (57, 'Schulstraße 164', '28195', 'Bremen', 'Deutschland', 8.811349992627955, 53.12577249871558);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (58, 'Lindenstraße 105', '01067', 'Dresden', 'Deutschland', 13.69095468526505, 51.04778151976991);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (59, 'Kirchstraße 195', '10115', 'Berlin', 'Deutschland', 13.43273700979656, 52.55950911586256);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (60, 'Schulstraße 55', '40210', 'Düsseldorf', 'Deutschland', 6.761654619070661, 51.24968771968539);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (61, 'Lindenstraße 135', '70173', 'Stuttgart', 'Deutschland', 9.193853406349527, 48.76085902782376);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (62, 'Bergstraße 65', '80331', 'München', 'Deutschland', 11.57688547806631, 48.11424365016308);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (63, 'Königstraße 70', '01067', 'Dresden', 'Deutschland', 13.75288258160517, 51.08182079268935);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (64, 'Bergstraße 100', '80331', 'München', 'Deutschland', 11.54896936740833, 48.14645496871703);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (65, 'Hauptstraße 58', '04103', 'Leipzig', 'Deutschland', 12.40298329577256, 51.29824018405533);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (66, 'Hauptstraße 127', '80331', 'München', 'Deutschland', 11.53569637283494, 48.11241333931598);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (67, 'Schulstraße 136', '28195', 'Bremen', 'Deutschland', 8.827664738956083, 53.11748971585875);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (68, 'Gartenstraße 33', '53111', 'Bonn', 'Deutschland', 7.115419482988714, 50.71009589599097);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (69, 'Bergstraße 27', '44135', 'Dortmund', 'Deutschland', 7.428304270487144, 51.47921891022978);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (70, 'Königstraße 77', '90402', 'Nürnberg', 'Deutschland', 11.03822482961101, 49.48040527684689);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (71, 'Hauptstraße 144', '80331', 'München', 'Deutschland', 11.59099452671509, 48.13248953601082);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (72, 'Rheinstraße 144', '44135', 'Dortmund', 'Deutschland', 7.473228095970682, 51.55059386058932);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (73, 'Schulstraße 7', '28195', 'Bremen', 'Deutschland', 8.809110769370427, 53.09589054298998);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (74, 'Waldstraße 157', '28195', 'Bremen', 'Deutschland', 8.75987294535168, 53.10507456323865);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (75, 'Friedrichstraße 157', '10115', 'Berlin', 'Deutschland', 13.3810476278532, 52.53193773874873);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (76, 'Hauptstraße 101', '04103', 'Leipzig', 'Deutschland', 12.37843546250038, 51.35979255581623);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (77, 'Marktplatz 109', '04103', 'Leipzig', 'Deutschland', 12.35066782629723, 51.31438504285457);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (78, 'Hauptstraße 77', '28195', 'Bremen', 'Deutschland', 8.801948943379173, 53.12720189393868);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (79, 'Marktplatz 197', '01067', 'Dresden', 'Deutschland', 13.77082690243788, 51.05041993971355);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (80, 'Parkstraße 171', '10115', 'Berlin', 'Deutschland', 13.39907979497108, 52.472772673121);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (81, 'Friedrichstraße 66', '01067', 'Dresden', 'Deutschland', 13.75178036974883, 51.05401430011582);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (82, 'Königstraße 29', '01067', 'Dresden', 'Deutschland', 13.7635628638248, 51.01813805385294);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (83, 'Rheinstraße 5', '10115', 'Berlin', 'Deutschland', 13.4310499480728, 52.55717191348099);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (84, 'Bismarckstraße 94', '50667', 'Köln', 'Deutschland', 6.924916580535849, 50.98533876720481);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (85, 'Parkstraße 46', '44135', 'Dortmund', 'Deutschland', 7.483683362395764, 51.55501749735171);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (86, 'Bergstraße 149', '80331', 'München', 'Deutschland', 11.58774188372941, 48.12647704679052);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (87, 'Parkstraße 10', '10115', 'Berlin', 'Deutschland', 13.38230736624206, 52.53156260761892);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (88, 'Rheinstraße 61', '80331', 'München', 'Deutschland', 11.53558795393453, 48.11062308344093);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (89, 'Bahnhofstraße 149', '60311', 'Frankfurt am Main', 'Deutschland', 8.686621275537643, 50.07111300775975);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (90, 'Gartenstraße 141', '30159', 'Hannover', 'Deutschland', 9.696560507457292, 52.3968197896026);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (91, 'Rheinstraße 17', '01067', 'Dresden', 'Deutschland', 13.70284313152065, 51.02649618303217);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (92, 'Gartenstraße 59', '10115', 'Berlin', 'Deutschland', 13.45433371266583, 52.50086862544732);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (93, 'Parkstraße 197', '80331', 'München', 'Deutschland', 11.59986123941962, 48.0912043772985);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (94, 'Waldstraße 57', '80331', 'München', 'Deutschland', 11.61647449982008, 48.18186236275178);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (95, 'Bahnhofstraße 172', '90402', 'Nürnberg', 'Deutschland', 11.12009192113636, 49.49213517413946);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (96, 'Kirchstraße 164', '10115', 'Berlin', 'Deutschland', 13.4158738595882, 52.50560423932555);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (97, 'Hauptstraße 104', '70173', 'Stuttgart', 'Deutschland', 9.187798215548531, 48.80739985362722);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (98, 'Rheinstraße 130', '50667', 'Köln', 'Deutschland', 6.967968697428962, 50.94094893627977);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (99, 'Bahnhofstraße 135', '40210', 'Düsseldorf', 'Deutschland', 6.805570582345017, 51.19507140816947);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (100, 'Parkstraße 194', '10115', 'Berlin', 'Deutschland', 13.41600326537204, 52.53637670707032);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (101, 'Marktplatz 13', '80331', 'München', 'Deutschland', 11.54873414231871, 48.17358093382614);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (102, 'Waldstraße 53', '45127', 'Essen', 'Deutschland', 7.054260513518586, 51.45857531081536);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (103, 'Bahnhofstraße 15', '20095', 'Hamburg', 'Deutschland', 10.04550323467859, 53.53422687877805);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (104, 'Gartenstraße 82', '53111', 'Bonn', 'Deutschland', 7.050203265718133, 50.73463312953894);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (105, 'Lindenstraße 181', '53111', 'Bonn', 'Deutschland', 7.095058572492788, 50.71522302908485);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (106, 'Bahnhofstraße 199', '44135', 'Dortmund', 'Deutschland', 7.475979930210157, 51.50451430967296);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (107, 'Königstraße 154', '44135', 'Dortmund', 'Deutschland', 7.442614808118551, 51.49680907150335);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (108, 'Gartenstraße 91', '10115', 'Berlin', 'Deutschland', 13.38481739392161, 52.47109632301129);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (109, 'Parkstraße 151', '20095', 'Hamburg', 'Deutschland', 9.97386464299938, 53.52609086927166);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (110, 'Hauptstraße 98', '28195', 'Bremen', 'Deutschland', 8.790711873281635, 53.11417028809295);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (111, 'Gartenstraße 123', '90402', 'Nürnberg', 'Deutschland', 11.10251886313596, 49.41102415384957);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (112, 'Rheinstraße 197', '70173', 'Stuttgart', 'Deutschland', 9.148232318694077, 48.75384117926615);
INSERT INTO addresses (id, street, citycode, city, country, longitude, latitude) VALUES (113, 'Bergstraße 160', '40210', 'Düsseldorf', 'Deutschland', 6.800504570445646, 51.22913944683743);

-- Veterinary Practices from seed
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (6, 'Tierklinik Köln Zentrum', '+49 671 4375649', 'info-tierklinikkoelnzentrum-1764197831675-2247@example.de', 'kontakt-tierklinikkoelnzentrum-1764197831675-3510@example.de', '$2b$10$TQ8EfaUfIDG48xWnwwO56u5xXhXGpYt9W8D7WX/jnNTEbYCklaAL2', NULL, 'Moderne Tierarztpraxis mit umfassendem Leistungsspektrum.', 6);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (7, 'Kleintierpraxis Köln Mitte', '+49 801 5206557', 'info-kleintierpraxiskoelnmitte-1764197831765-3298@example.de', 'kontakt-kleintierpraxiskoelnmitte-1764197831765-4337@example.de', '$2b$10$vUyRCv0722fkseRF9C8uouUHl/1Yv6NOMqpIEot3NKDBONDPN6oC2', NULL, NULL, 7);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (8, 'Tierklinik Hamburg am Bahnhof', '+49 265 5964284', 'info-tierklinikhamburgambahnhof-1764197831852-2515@example.de', 'kontakt-tierklinikhamburgambahnhof-1764197831852-8314@example.de', '$2b$10$1Bi/JcyeALNRI9PweaDGEefrfs0M/Wp3cmM8uJNz.h0UGGGiPekQ.', NULL, 'Moderne Tierarztpraxis mit umfassendem Leistungsspektrum.', 8);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (9, 'Tiergesundheitszentrum Stuttgart Süd', '+49 482 5898345', 'info-tiergesundheitszentrumstuttgartsued-1764197831939-4780@example.de', 'kontakt-tiergesundheitszentrumstuttgartsued-1764197831939-6565@example.de', '$2b$10$dfL6JT6gBSfhgv/Bk38.Nel7ylDuECdFTBZ0V86unImlxjwwkkrNy', 'https://www.tiergesundheitszentrumstuttgartsüd.de', NULL, 9);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (10, 'Tierklinik Köln', '+49 641 6743811', 'info-tierklinikkoeln-1764197832026-1686@example.de', 'kontakt-tierklinikkoeln-1764197832026-8141@example.de', '$2b$10$72q0v8rPOQrjq5XjeYR7c.O1pL/K8FrxsiBBB3QYn.c3gBppjPgCa', 'https://www.tierklinikköln.de', NULL, 10);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (11, 'Tiergesundheitszentrum Dresden', '+49 295 3820087', 'info-tiergesundheitszentrumdresden-1764197832112-8420@example.de', 'kontakt-tiergesundheitszentrumdresden-1764197832112-6833@example.de', '$2b$10$gelFFSc8tH2UVlcUyFN/pOPKCSe2yJ3r5U2qFNsA179WFiuZHdgOe', NULL, NULL, 11);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (12, 'Tierarztpraxis Frankfurt am Main', '+49 317 8147382', 'info-tierarztpraxisfrankfurtammain-1764197832198-2674@example.de', 'kontakt-tierarztpraxisfrankfurtammain-1764197832198-2035@example.de', '$2b$10$hxNgacS2i5ExQIzb2jYRFeV0JpHf4i8/TE33GF5ht4k/Lu9oTl2Ei', NULL, NULL, 12);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (13, 'Tiermedizinisches Zentrum Berlin West', '+49 935 8730089', 'info-tiermedizinischeszentrumberlinwest-1764197832285-3336@example.de', 'kontakt-tiermedizinischeszentrumberlinwest-1764197832285-9982@example.de', '$2b$10$OgGdwYLSGGifOGGTDRApWuSko1eKYPglqJ7eO60VLE1KYKHBMt0SG', NULL, 'Moderne Tierarztpraxis mit umfassendem Leistungsspektrum.', 13);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (14, 'Kleintierpraxis Dresden West', '+49 418 9061794', 'info-kleintierpraxisdresdenwest-1764197832370-3896@example.de', 'kontakt-kleintierpraxisdresdenwest-1764197832370-555@example.de', '$2b$10$2vzWTXF1XxCSxSou7kT1kurQclgPMlq0Ep7yA4nsEKBG30JwdCIDm', NULL, 'Moderne Tierarztpraxis mit umfassendem Leistungsspektrum.', 14);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (15, 'Tierarztpraxis Berlin', '+49 208 1146849', 'info-tierarztpraxisberlin-1764197832457-9252@example.de', 'kontakt-tierarztpraxisberlin-1764197832457-1172@example.de', '$2b$10$VRY8lPW8YYHUlD7dV0huAuepmuzLRFnEn/of3nist7yobVJpt6Q5O', NULL, 'Moderne Tierarztpraxis mit umfassendem Leistungsspektrum.', 15);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (16, 'VetCenter Leipzig', '+49 242 5431458', 'info-vetcenterleipzig-1764197832543-2756@example.de', 'kontakt-vetcenterleipzig-1764197832544-1271@example.de', '$2b$10$4QgLtcI.bxF9z0AuXcBDgucqMBOFpnIEbwUI6q2UpXbFurK4LuVde', NULL, NULL, 16);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (17, 'VetCenter Hannover Mitte', '+49 746 9818037', 'info-vetcenterhannovermitte-1764197832630-4659@example.de', 'kontakt-vetcenterhannovermitte-1764197832630-1781@example.de', '$2b$10$gfxQaXfWK/x/QnT.w0gEP.TCFRA5tipLAyGU/4eYturmA1hScypSa', 'https://www.vetcenterhannovermitte.de', 'Moderne Tierarztpraxis mit umfassendem Leistungsspektrum.', 17);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (18, 'VetCenter Stuttgart Süd', '+49 924 8795552', 'info-vetcenterstuttgartsued-1764197832717-7921@example.de', 'kontakt-vetcenterstuttgartsued-1764197832717-9247@example.de', '$2b$10$lwUnO9yz1kOuVa6/TnjiyevxgbTqwxXpNeLsCLc0H8MFuWz00HYA.', 'https://www.vetcenterstuttgartsüd.de', NULL, 18);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (19, 'Tiergesundheitszentrum Berlin', '+49 217 7767423', 'info-tiergesundheitszentrumberlin-1764197832803-3827@example.de', 'kontakt-tiergesundheitszentrumberlin-1764197832803-9236@example.de', '$2b$10$3vn1eFsbEHAUJcPPxSTdl.jUnlxc.BgAyntRqZO/xhwY4qbAUYR6O', NULL, NULL, 19);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (20, 'Kleintierpraxis Hamburg', '+49 651 8721618', 'info-kleintierpraxishamburg-1764197832889-8673@example.de', 'kontakt-kleintierpraxishamburg-1764197832889-2049@example.de', '$2b$10$HXLZb50YZ7qfTJt8H9NG9eSgW3Vqpl8gDWdbY.ykbIr4GtjlPpo9S', 'https://www.kleintierpraxishamburg.de', NULL, 20);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (21, 'Tierklinik München am Bahnhof', '+49 433 3088243', 'info-tierklinikmuenchenambahnhof-1764197832977-913@example.de', 'kontakt-tierklinikmuenchenambahnhof-1764197832977-3256@example.de', '$2b$10$QY2PGz7R2Qn5MMlKg/6i3uH2LZAUio7lEGFjLPzeQNb7y5.T9gutC', NULL, NULL, 21);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (22, 'Tierklinik Dortmund am Bahnhof', '+49 627 9882029', 'info-tierklinikdortmundambahnhof-1764197833063-1991@example.de', 'kontakt-tierklinikdortmundambahnhof-1764197833063-6804@example.de', '$2b$10$i/luhQE/2TqH/VnKDSVZAuzBvG5uHU6mOM5XE0P0IaM18q24BoKxW', NULL, NULL, 22);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (23, 'VetCenter Dresden', '+49 617 7741404', 'info-vetcenterdresden-1764197833150-9888@example.de', 'kontakt-vetcenterdresden-1764197833150-3326@example.de', '$2b$10$jEMon7pYtX7hi82MlyN/teUKTmJ6ztAeXGpcUAKg1f5D2wIrImF36', 'https://www.vetcenterdresden.de', NULL, 23);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (24, 'Tierarztpraxis Leipzig Süd', '+49 436 1151676', 'info-tierarztpraxisleipzigsued-1764197833237-8419@example.de', 'kontakt-tierarztpraxisleipzigsued-1764197833237-244@example.de', '$2b$10$BSRi1xEK1GMCPUjroli90O9QAQplNYDpGOumQ6cfoJd4GKggYxszO', NULL, 'Moderne Tierarztpraxis mit umfassendem Leistungsspektrum.', 24);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (25, 'VetCenter München', '+49 995 9265094', 'info-vetcentermuenchen-1764197833323-6686@example.de', 'kontakt-vetcentermuenchen-1764197833323-8971@example.de', '$2b$10$aiYaBsQakl/70GX9rPE7JucTcd1dszCyWeZZNljDFN2gtROfqHpSq', 'https://www.vetcentermünchen.de', NULL, 25);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (26, 'Tierarztpraxis München Süd', '+49 498 3892672', 'info-tierarztpraxismuenchensued-1764197833409-7048@example.de', 'kontakt-tierarztpraxismuenchensued-1764197833409-7824@example.de', '$2b$10$T1P/tBlHCapyc6tSr8cl2O1lRIGYi39/VDx0MSvNCi8MTo3aE8Ysm', NULL, NULL, 26);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (27, 'Tiermedizinisches Zentrum Essen', '+49 418 9091407', 'info-tiermedizinischeszentrumessen-1764197833496-8540@example.de', 'kontakt-tiermedizinischeszentrumessen-1764197833496-4719@example.de', '$2b$10$53Duw61.eF9SALmcGeI9U.gAHmAAaquvET1oxOgGIl6CzYiJWfs7q', NULL, NULL, 27);
INSERT INTO veterinarypractices (id, name, phone, infoemail, email, password, website, info, fk_addressid) VALUES (28, 'Tierklinik Frankfurt am Main', '+49 765 5414923', 'info-tierklinikfrankfurtammain-1764197833583-168@example.de', 'kontakt-tierklinikfrankfurtammain-1764197833583-3182@example.de', '$2b$10$7alZS3Ge67YfNqO0PMDxeumo1ndadKvojKH5QpYygaeXEbuTEC7X6', NULL, 'Moderne Tierarztpraxis mit umfassendem Leistungsspektrum.', 28);

-- Persons from seed
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (7, 'Tobias', 'Wolf', 'notknown', '1988-06-02', 29, '+49 775 1202185', 'tobias.wolf-1764197833672-2148@example.de', '$2b$10$aJ2z7Y5jU2aeNtkDXvCxpuHnMxTt1FCD10zybOTSIFnG8wu8kAXMq');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (8, 'Lisa', 'Neumann', 'notknown', '1967-11-15', 30, '+49 108 8189428', 'lisa.neumann-1764197833763-2558@example.de', '$2b$10$hLwOI.EabFFNVW9HClQ2JOG9gGoDfEt/qenrTMQKJN7OTaQ93QNui');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (9, 'Hannah', 'Müller', 'male', '1986-09-05', 31, '+49 849 8694714', 'hannah.mueller-1764197833850-4367@example.de', '$2b$10$d525rTUcw.5wDEOWEhU.w.9GyICwAjfA2ZaBTSIQhn1wMJ1BNkMzW');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (10, 'Andreas', 'Schulz', 'female', '1990-02-03', 32, '+49 751 6290679', 'andreas.schulz-1764197833938-3683@example.de', '$2b$10$MPzow1l.MtyOrLIPeMOAUufbpHusM/w54yJW0q/JorrBlQTp6hMta');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (11, 'Sarah', 'Wolf', 'female', '1988-04-14', 33, '+49 260 7297155', 'sarah.wolf-1764197834035-222@example.de', '$2b$10$RBdsVAzH.V72wIMklb0Fj.XRvolk6hStwf8Hoj0KbRGpCiHIvb99q');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (12, 'Daniel', 'Schwarz', 'female', '1987-10-19', 34, '+49 233 6817849', 'daniel.schwarz-1764197834122-2377@example.de', '$2b$10$hRjH.idt8VtvppZ581L/CO/Z5.3xJtBonE/SIn9zED2Ju46JtNO.6');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (13, 'Jan', 'Schröder', 'female', '1968-10-21', 35, '+49 246 7595486', 'jan.schroeder-1764197834210-6767@example.de', '$2b$10$nGUBxXCHETkjWnAJR1tPo.NpOg92KY3z2TqK6BNiDxg6rfZs8BsTy');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (14, 'Maria', 'Hoffmann', 'notknown', '1998-08-10', 36, '+49 557 8741100', 'maria.hoffmann-1764197834297-4878@example.de', '$2b$10$XJG8dU4lowQC7Oxkt7oKxOzgQEgthKMma8Dh3SKpEX.KNRogIA9HK');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (15, 'Andreas', 'Zimmermann', 'notknown', '1974-11-02', 37, '+49 761 2849360', 'andreas.zimmermann-1764197834384-5607@example.de', '$2b$10$rAw4CxxCeVLWvKKWQ5dMAOGgRe6RfpAH3XWreQMRL2ZmXjERKDj/6');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (16, 'Katharina', 'Müller', 'notknown', '1980-11-26', 38, '+49 752 2910201', 'katharina.mueller-1764197834473-8654@example.de', '$2b$10$goRqnttR2RWcEIVibO4njesiRZf1xOtCNtVfG6TjWRjm61WzbJid.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (17, 'Lukas', 'Wolf', 'notknown', '1993-02-20', 39, '+49 974 6887941', 'lukas.wolf-1764197834562-2116@example.de', '$2b$10$6AhYWGPPFdVLzUbmiCZdF.IsOoM0Akcy0AOR3tUROoaAfXr/.gEmS');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (18, 'Felix', 'Klein', 'notknown', '1966-01-31', 40, '+49 962 9334077', 'felix.klein-1764197834649-3568@example.de', '$2b$10$/4cxHqEvID7VxEr9qasfruAhEXw1weCPBosODJkk1TZThe4INwXCi');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (19, 'Daniel', 'Richter', 'female', '1994-06-12', 41, '+49 956 6108676', 'daniel.richter-1764197834736-3148@example.de', '$2b$10$BSfpvYWBwGwK3tPSbcEbbudUX95F46kwtiJ/CbFkYkAavZ9apJ/eC');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (20, 'Sarah', 'Bauer', 'male', '1971-09-10', 42, '+49 709 7529052', 'sarah.bauer-1764197834825-5451@example.de', '$2b$10$7d4tP3Us7aLEJms5rk4UVOltraLUnKzvGbG2zldm8VRAEmwU4qH0e');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (21, 'Emma', 'Schulz', 'male', '1966-01-26', 43, '+49 377 7201678', 'emma.schulz-1764197834914-724@example.de', '$2b$10$FF3N0Udiu50NJg9/Z3Kt0OovZewrI7LuhBIJ6woxTx9aWoiiw.8qe');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (22, 'Lena', 'Wagner', 'male', '1975-03-02', 44, '+49 554 9818294', 'lena.wagner-1764197834999-8729@example.de', '$2b$10$mxmI08XMyvVcmzM2N9T8pO4K2EtfCojyw7HiofQJlRCBKC6.e5UdK');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (23, 'Tobias', 'Hoffmann', 'male', '1965-07-19', 45, '+49 335 2795525', 'tobias.hoffmann-1764197835085-1020@example.de', '$2b$10$Ngap.8u2OlfiDMmCrtsa/./wwMXNT6Po1ade.ti1jDKWoM6ajkCwC');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (24, 'Katharina', 'Meyer', 'notknown', '1965-01-31', 46, '+49 416 5106010', 'katharina.meyer-1764197835170-7366@example.de', '$2b$10$.T47jOzp2lUayp9S9OKAK./pHoRcmwV3R4JH9kyBiWUdPnrdXi0Mi');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (25, 'Matthias', 'Schmidt', 'notknown', '1988-10-06', 47, '+49 966 5880422', 'matthias.schmidt-1764197835255-2939@example.de', '$2b$10$iUy6h/7YmX07mB5L931EXurnI7xFw8.N/5fC1S8egou59L5C6txfG');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (26, 'Felix', 'Becker', 'male', '1982-08-03', 48, '+49 894 1883645', 'felix.becker-1764197835343-7165@example.de', '$2b$10$B3FAZu2tu6KnZ2RGOZd6TetMKl5sH4dzuT5xfZn3XH5hywrLIri1C');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (27, 'Tobias', 'Hoffmann', 'notknown', '1985-07-06', 49, '+49 789 8944870', 'tobias.hoffmann-1764197835432-1974@example.de', '$2b$10$fDHZIut6wP55n9ZeMEFhI.PNMN854P1z.0uv4cbTMo8wQH0WgGpCe');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (28, 'Christian', 'Wagner', 'female', '1972-12-09', 50, '+49 285 1271382', 'christian.wagner-1764197835519-8058@example.de', '$2b$10$4fXg2BPKOLn.CdvV5xqiw.R19CK9vbYSZ0I9xOj0CwPcURYKpUpVu');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (29, 'Lisa', 'Weber', 'male', '1998-06-09', 51, '+49 754 4120495', 'lisa.weber-1764197835607-8812@example.de', '$2b$10$zSHFwRDKM.rfJLwTkVbPw.BBlxhCtSoxJdzRxHqO1no0P2GY5jUwa');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (30, 'Daniel', 'Weber', 'male', '1976-11-03', 52, '+49 496 9970214', 'daniel.weber-1764197835695-5024@example.de', '$2b$10$.cx03/RJQ9um83hmwi1NrOL.m6cuT3mXaA0AsZ95vsGVHu/15q2SW');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (31, 'Laura', 'Fischer', 'male', '1960-07-03', 53, '+49 527 7532687', 'laura.fischer-1764197835782-4954@example.de', '$2b$10$GI2tCsx6bkxbxMhB9mTaf.J4Vh3xwP88eM0sSaWf9lLWJUsE98JOC');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (32, 'Maria', 'Schröder', 'notknown', '1975-09-21', 54, '+49 327 3448712', 'maria.schroeder-1764197835870-6785@example.de', '$2b$10$6hBfDC6BosWOfJhaCvQf5.A6kGexNxq7WSBJZA4KyfdZU7/el8mOq');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (33, 'Sophie', 'Neumann', 'female', '1992-11-06', 55, '+49 257 9646710', 'sophie.neumann-1764197835959-9893@example.de', '$2b$10$vp7QiElV6488fyQpmW/3T.FC1hVzgzeQPyamYopHguuXSoJqJgnP.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (34, 'Sebastian', 'Klein', 'male', '1980-01-06', 56, '+49 378 7058362', 'sebastian.klein-1764197836048-4913@example.de', '$2b$10$LMQna.HtOU664HDjy1nu1O.iVYSG5eEog9EBbXJuKSEOr6Ej4EebS');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (35, 'Sophie', 'Wagner', 'male', '1977-08-27', 57, '+49 156 6441545', 'sophie.wagner-1764197836135-3059@example.de', '$2b$10$iXPYi5DW3g7AEjRhs292Pu7R0.SVc0IvCMZo2ZszcUBEL2ufk8HmC');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (36, 'Maria', 'Zimmermann', 'male', '1993-05-01', 58, '+49 641 4108356', 'maria.zimmermann-1764197836222-6218@example.de', '$2b$10$r2UYhaDB.SeCBiRQp0Zw3.2WSwpeSeqfNEENDMiVWMTv3gvahOzxq');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (37, 'Jan', 'Bauer', 'female', '1972-03-14', 59, '+49 435 5181662', 'jan.bauer-1764197836312-5151@example.de', '$2b$10$wfLQq/IUjy49Qf.qNyi4KOzOkhgmJZR4KMhBCCTR01K3hxPw6G6Ta');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (38, 'Christian', 'Zimmermann', 'notknown', '1972-10-18', 60, '+49 183 8127712', 'christian.zimmermann-1764197836399-9927@example.de', '$2b$10$3mPNXJFibyz5E16gbFjkIuxM5yRzTlyso.zlj/VESoUQt8j37ffz.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (39, 'Julia', 'Schäfer', 'male', '1979-03-20', 61, '+49 147 4472860', 'julia.schaefer-1764197836487-9783@example.de', '$2b$10$d0j8DwkhF5iBTxXL3AtjJur.ft.tahCsBKjUEVUZgjQDscrUx59Sq');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (40, 'Sebastian', 'Schneider', 'female', '1980-10-17', 62, '+49 382 2973679', 'sebastian.schneider-1764197836574-1752@example.de', '$2b$10$uDd5i32oARczgwhKo58gU.iDmIfsK4DR.6HYayLz9vx0M8u6lsPJC');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (41, 'Emma', 'Klein', 'notknown', '1993-04-08', 63, '+49 963 5402255', 'emma.klein-1764197836664-4906@example.de', '$2b$10$EClJjQJMRyZpcVlo7cCSceT/XUxKVO2J3KoBNKNDV4P.0EGioHbJq');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (42, 'Andreas', 'Wagner', 'female', '1979-01-08', 64, '+49 205 6175604', 'andreas.wagner-1764197836752-1551@example.de', '$2b$10$YBM0SRZsuVb4zbNxYQ1FBO4Gd/cXPCU9oZ39MzB7Ps5YhOyrEjbh.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (43, 'Sarah', 'Hoffmann', 'male', '1970-08-03', 65, '+49 660 6707161', 'sarah.hoffmann-1764197836839-9418@example.de', '$2b$10$nvjOGjJpfU24JcT0co9W8O28CiFXX551ogmrbEkErtY5JU.cHquMW');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (44, 'Michael', 'Braun', 'female', '1980-11-06', 66, '+49 450 8591722', 'michael.braun-1764197836927-1965@example.de', '$2b$10$8TNPJaOFdRvqPUsV9WmvUOHZo//kJPkiEX7EJ34uslNP5b6eYlIb.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (45, 'Hannah', 'Richter', 'notknown', '1993-06-23', 67, '+49 830 4995100', 'hannah.richter-1764197837014-352@example.de', '$2b$10$rP6.GXy2kOTAWwVXvamuI.HFku9peHg3Mda0koddBDMzPTAho0.6.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (46, 'Anna', 'Schulz', 'female', '1979-12-08', 68, '+49 322 7578697', 'anna.schulz-1764197837104-2854@example.de', '$2b$10$xCqGonoCiXusYbcBbVupy.qKbjQc1L8VwuDQXRsHUYrL78MroofBe');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (47, 'Sebastian', 'Richter', 'female', '1996-09-11', 69, '+49 581 3969240', 'sebastian.richter-1764197837192-2544@example.de', '$2b$10$wUoEaN8n4K2/SFHh1kbLgewI2QTcg9O7VTN78/QRHFNlXE1DVk5/W');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (48, 'Jan', 'Wagner', 'notknown', '1972-05-20', 70, '+49 152 5540735', 'jan.wagner-1764197837281-1360@example.de', '$2b$10$rHGSZ6TiA40ns5yOgmCVeeRAetwe8yq.nCu9GMSly5riJagCElnLa');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (49, 'Sarah', 'Zimmermann', 'male', '1969-08-10', 71, '+49 961 5942224', 'sarah.zimmermann-1764197837369-3890@example.de', '$2b$10$U7He3NQF8NiwQDjMRhoUTuU4hd2JdJW4UZxlU5XNIEWcizGUnmL8i');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (50, 'Thomas', 'Braun', 'notknown', '1966-08-19', 72, '+49 700 5260626', 'thomas.braun-1764197837456-8568@example.de', '$2b$10$sWAcY9FjR6HCAVgF.ENgyObqOI2PdLmb62lm/0NDi.NO56SLvP57W');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (51, 'Laura', 'Schäfer', 'notknown', '1999-01-01', 73, '+49 702 7278167', 'laura.schaefer-1764197837545-7496@example.de', '$2b$10$NMo.LzxC5PmpAwIQEO2IQOrc9BjyjCIFMFIMAdlcj8R3UJYxXmXFK');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (52, 'Emma', 'Schröder', 'female', '1980-08-03', 74, '+49 271 7600792', 'emma.schroeder-1764197837633-2831@example.de', '$2b$10$chYOn7abB7BzN96BFCzBDezQ/4IOsBH/xC9GRQfqSDcCIH1xb5bm.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (53, 'Katharina', 'Meyer', 'female', '1965-01-17', 75, '+49 600 4408770', 'katharina.meyer-1764197837721-611@example.de', '$2b$10$HjFhcxBGUHiaFb5ddvbHn.eV1w7WG8nggy5UBHl6MCVENR9a4WIrW');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (54, 'Mia', 'Klein', 'male', '1986-01-11', 76, '+49 640 7345420', 'mia.klein-1764197837809-7998@example.de', '$2b$10$gplUQ6Nl9wcj7TL5ySo5eeuvE2bm6xHAnv3lTPDL5Gh450yp4h2uq');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (55, 'Hannah', 'Fischer', 'female', '1982-08-24', 77, '+49 174 4661247', 'hannah.fischer-1764197837898-8969@example.de', '$2b$10$ghYZMPtrDmQuzLUJxZGPOOuyMRaprhWNBKWjQO0QLVzxfdAUQaPKq');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (56, 'Mia', 'Neumann', 'notknown', '1998-11-21', 78, '+49 706 3053919', 'mia.neumann-1764197837985-3425@example.de', '$2b$10$dD7H6Oq/7AVdr5NM7l4CW.BExJcwrmQ5pKjq4Zcs7p/oI5hWw5/k6');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (57, 'Lisa', 'Becker', 'male', '1985-04-14', 79, '+49 995 2250952', 'lisa.becker-1764197838072-3769@example.de', '$2b$10$DtO4qXuQcNv1mGiOYQaG1u0ZzgMqD1EPGcmXbHKwbBCV2HWPRTDE.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (58, 'Emma', 'Schmidt', 'female', '1988-09-13', 80, '+49 724 3343991', 'emma.schmidt-1764197838160-5047@example.de', '$2b$10$M9eLRcaLLlxGD93i6mvcHOCIJ7H42nkl9N.R8nh6Z7Mh1ADaalC4O');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (59, 'Maria', 'Schulz', 'male', '1991-09-20', 81, '+49 415 8521314', 'maria.schulz-1764197838247-820@example.de', '$2b$10$J6296OWZYlIhJ/dSYJFu2egBznNvF53ACYypgIuBniPu.dUKzJKvm');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (60, 'Lena', 'Wagner', 'male', '1985-05-04', 82, '+49 880 8604468', 'lena.wagner-1764197838334-955@example.de', '$2b$10$5TIaEqTDF9m9nalszOq0sOUCgnYVtEdXhF1p3DiV5JLQ5Tr2hVRk.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (61, 'Sarah', 'Hoffmann', 'notknown', '1978-08-02', 83, '+49 194 7056427', 'sarah.hoffmann-1764197838421-5390@example.de', '$2b$10$gRULDhuSTDqLbcvi8io7v.6Fjv/7jO9.pc9PeMK.ZdBD169zLX0l6');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (62, 'Hannah', 'Klein', 'notknown', '1998-02-12', 84, '+49 611 1322473', 'hannah.klein-1764197838512-9735@example.de', '$2b$10$uOOQN14ttQUDK5PEFF2I6.tpLnFsdJDz27eVOmsTedr0QFrbOMqcO');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (63, 'Laura', 'Hoffmann', 'male', '1993-08-31', 85, '+49 629 4416362', 'laura.hoffmann-1764197838599-1352@example.de', '$2b$10$7/uhlJwJVbasx7zntYwe3.UJnIBNkPSHpV9cTSySh2pAhNE2.LIWC');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (64, 'Lisa', 'Becker', 'female', '1984-10-18', 86, '+49 110 3855710', 'lisa.becker-1764197838688-6831@example.de', '$2b$10$FZmYSP5x3kLRv7VqsYjUc.0yN45f2peAXyisBblFdqz6V0Tsq1ffC');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (65, 'Mia', 'Weber', 'notknown', '1979-04-26', 87, '+49 300 9549082', 'mia.weber-1764197838782-5537@example.de', '$2b$10$TDY.Ric.KGAX00ZfzJk87e94UVZcKQDj0xLvqwArwh6gTeng5R3AC');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (66, 'Andreas', 'Schröder', 'male', '1999-11-26', 88, '+49 508 6423153', 'andreas.schroeder-1764197838873-1444@example.de', '$2b$10$Cq4a.5qD72kXI1qWUQL.f.D8bw4EaPU1VrWU/O2XFjH7v0DyacwTC');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (67, 'Michael', 'Hoffmann', 'female', '1966-01-03', 89, '+49 663 8851311', 'michael.hoffmann-1764197838961-325@example.de', '$2b$10$a2fsWwZvkiWC9.0gPsxv8utnmW/qqRIWQHi5G3RxfH4x.eDkNkBXu');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (68, 'Laura', 'Schwarz', 'male', '1960-12-14', 90, '+49 143 4789740', 'laura.schwarz-1764197839049-4781@example.de', '$2b$10$iCN.IiG4zqb5LQKWMIrzSe3xb9myQX/TndcQUgQlMUGO1hrH8MeVC');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (69, 'Stefan', 'Wolf', 'notknown', '1970-12-31', 91, '+49 947 1905815', 'stefan.wolf-1764197839136-4644@example.de', '$2b$10$qp3H97dBcF1WslJIrZJJJ.zHh4I0JzGna8jAycsKyrV8AQ8MT/sP.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (70, 'Mia', 'Schwarz', 'male', '2000-07-25', 92, '+49 901 6921357', 'mia.schwarz-1764197839224-4118@example.de', '$2b$10$FKfIrK8ikOomikGDuT.7yO2yZzCuaSwCkPb6hEHN1g8KarMBn/Sz.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (71, 'Sebastian', 'Zimmermann', 'female', '1978-06-03', 93, '+49 227 4223747', 'sebastian.zimmermann-1764197839314-4975@example.de', '$2b$10$sbo3NxQS0WJSHPEOcJ8jKeZ32.9N9wHpXd5kbGCTFVaf5t27QYQS6');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (72, 'Mia', 'Schwarz', 'male', '1989-04-26', 94, '+49 154 5823695', 'mia.schwarz-1764197839401-7843@example.de', '$2b$10$S9nwDOvpIFZxJVuCjSo8IOtUcb3x0Gg5K1.zgNCfEW.ooIrVO927G');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (73, 'Lena', 'Schneider', 'female', '1999-05-12', 95, '+49 721 2895358', 'lena.schneider-1764197839488-6966@example.de', '$2b$10$NmkoKW0xKHhaXXZB0No1QemwJDcYhGnWllIm75P.75gwsnZ1Z.XSG');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (74, 'Felix', 'Schwarz', 'male', '1989-09-18', 96, '+49 300 8180721', 'felix.schwarz-1764197839576-8211@example.de', '$2b$10$taqohEJQdqQcepJApEC6/u76uiVEK1RsL75gGXcOytdyuuPWo7.hm');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (75, 'Thomas', 'Fischer', 'notknown', '1972-10-17', 97, '+49 201 2006441', 'thomas.fischer-1764197839663-8010@example.de', '$2b$10$arc7DHpB/Mr/u14U8a9kU.A90/DCHFRMT.Xk7VujB5or4V8YB0rKq');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (76, 'Emma', 'Becker', 'female', '1981-11-03', 98, '+49 345 5040436', 'emma.becker-1764197839751-4444@example.de', '$2b$10$uFh2hxj55.CeT2mKE8dPWObUrzRtrG92jJ0NtgOBIQcUZMvk0PvEK');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (77, 'Lisa', 'Schmidt', 'female', '1995-06-20', 99, '+49 123 3543211', 'lisa.schmidt-1764197839838-1936@example.de', '$2b$10$webTBP3egfcQya4mhf.dAe1tPQaMpzrgGyq5nT7NmP1/TMz8vELmO');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (78, 'Sarah', 'Schröder', 'notknown', '1977-04-16', 100, '+49 513 9280423', 'sarah.schroeder-1764197839926-1397@example.de', '$2b$10$UH8xmba4/axXPLiXhyCNvu3BRnwOviRof7f5c98RO/fwsK8RNG.rW');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (79, 'Andreas', 'Schulz', 'female', '1988-12-22', 101, '+49 644 9128224', 'andreas.schulz-1764197840015-9395@example.de', '$2b$10$JUDqbBynuxE4EXRN2cMyq.hMnOcm0EIHBFzcAXrSMZqQJ/0HRMh7O');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (80, 'Michael', 'Schäfer', 'male', '1974-01-09', 102, '+49 391 2896953', 'michael.schaefer-1764197840103-4020@example.de', '$2b$10$8Yug9Pe1Fp5ofkpY7.rLFeIzf/jXYnDtaVL8nUhYupOsRAyPfCQsG');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (81, 'Hannah', 'Schwarz', 'male', '1960-08-07', 103, '+49 391 9275323', 'hannah.schwarz-1764197840190-1707@example.de', '$2b$10$UlTcuq0oYx61lGyPXxdjtOgJV5zo8ip724XxcDs9eNSsOSCcjjF7W');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (82, 'Anna', 'Meyer', 'notknown', '1992-11-14', 104, '+49 267 9967848', 'anna.meyer-1764197840278-8727@example.de', '$2b$10$aWL7l92WKua2vRc0d.PzT.ddGBXGpzxeCO/VCwe7NMc58Drry685m');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (83, 'Lukas', 'Wolf', 'male', '1990-07-11', 105, '+49 869 7003961', 'lukas.wolf-1764197840365-6535@example.de', '$2b$10$K5wfFV6rXL039ooE2PtKueThQb81R5rOX4YB.A1otferyn8IANO1.');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (84, 'Andreas', 'Wagner', 'notknown', '1985-05-17', 106, '+49 566 9977121', 'andreas.wagner-1764197840453-7793@example.de', '$2b$10$/oYfys.s.U/.4Ttho3Mt7uYzW6E1QXXZQLEH.cRgLrXIoojm16Vfq');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (85, 'Daniel', 'Wagner', 'female', '1996-05-18', 107, '+49 371 6565853', 'daniel.wagner-1764197840541-1891@example.de', '$2b$10$osv3JR5Ly9WKQxeyHdQlNuwgzxVlVztfgcXkmjVRzhNZtTV8dBf.6');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (86, 'Matthias', 'Schmidt', 'notknown', '1973-11-05', 108, '+49 258 8145816', 'matthias.schmidt-1764197840630-9468@example.de', '$2b$10$JWNNVrNXar8k7zOcnEZpOuWjqJxAaNBTYL78mJ2Pni5SnLgGy2sQO');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (87, 'Michael', 'Schneider', 'female', '1991-06-18', 109, '+49 806 1854913', 'michael.schneider-1764197840718-9282@example.de', '$2b$10$UT4XZRMJV88VbBjCkSR23enEvUr8xkh/ahlhUcv1mpoTCJBPPc2wi');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (88, 'Christian', 'Schröder', 'female', '1987-09-05', 110, '+49 139 2194099', 'christian.schroeder-1764197840805-2815@example.de', '$2b$10$t51zvWxXBsvJcqg9BT/4.uxeXzedBVffNBDOFzTXV58vPfbFxa0jO');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (89, 'Jan', 'Schneider', 'female', '1989-01-05', 111, '+49 905 9028635', 'jan.schneider-1764197840893-6110@example.de', '$2b$10$bkMJfibYDhcLCh6nwbztD.GOO0O06YcktgUzA09swOg52LDCw2Ym2');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (90, 'Sebastian', 'Wolf', 'male', '1986-05-07', 112, '+49 167 3193029', 'sebastian.wolf-1764197840981-1245@example.de', '$2b$10$HljScEk8HWpeKqOGaFG4fuBQjUKLyzUs7EUf39klS9itfi8zK0MXq');
INSERT INTO persons (id, firstname, lastname, sex, dateofbirth, fk_address, phone, email, password) VALUES (91, 'Andreas', 'Schmidt', 'male', '1989-06-04', 113, '+49 267 1987609', 'andreas.schmidt-1764197841069-6662@example.de', '$2b$10$pJl7Dp/9HdeQVF92uggnBeStDELu.ElJJfgWzplFNNEc7PO4INw9K');

-- veterinarians from seed
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (7, NULL, 6);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (8, 'dr.neumann-1764197833850-9434@example.de', 6);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (9, 'dr.mueller-1764197833937-6294@example.de', 6);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (10, NULL, 6);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (11, 'dr.wolf-1764197834121-589@example.de', 6);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (12, NULL, 7);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (13, 'dr.schroeder-1764197834296-5969@example.de', 7);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (14, 'dr.hoffmann-1764197834383-165@example.de', 7);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (15, 'dr.zimmermann-1764197834472-758@example.de', 8);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (16, 'dr.mueller-1764197834561-3270@example.de', 8);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (17, 'dr.wolf-1764197834648-6317@example.de', 8);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (18, 'dr.klein-1764197834735-9659@example.de', 9);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (19, NULL, 9);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (20, NULL, 9);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (21, 'dr.schulz-1764197834999-8864@example.de', 9);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (22, 'dr.wagner-1764197835084-4686@example.de', 9);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (23, 'dr.hoffmann-1764197835169-1303@example.de', 10);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (24, 'dr.meyer-1764197835254-9163@example.de', 10);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (25, NULL, 10);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (26, NULL, 10);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (27, NULL, 10);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (28, 'dr.wagner-1764197835606-2685@example.de', 11);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (29, 'dr.weber-1764197835694-4296@example.de', 11);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (30, 'dr.weber-1764197835781-7144@example.de', 11);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (31, 'dr.fischer-1764197835869-1208@example.de', 11);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (32, NULL, 11);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (33, 'dr.neumann-1764197836046-7692@example.de', 12);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (34, 'dr.klein-1764197836134-7831@example.de', 12);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (35, 'dr.wagner-1764197836221-4759@example.de', 13);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (36, 'dr.zimmermann-1764197836311-2374@example.de', 13);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (37, 'dr.bauer-1764197836398-3828@example.de', 13);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (38, 'dr.zimmermann-1764197836486-8734@example.de', 14);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (39, 'dr.schaefer-1764197836573-5151@example.de', 14);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (40, NULL, 14);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (41, NULL, 14);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (42, NULL, 15);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (43, NULL, 15);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (44, 'dr.braun-1764197837013-4812@example.de', 15);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (45, 'dr.richter-1764197837103-3562@example.de', 15);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (46, NULL, 16);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (47, 'dr.richter-1764197837280-8414@example.de', 16);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (48, NULL, 16);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (49, 'dr.zimmermann-1764197837455-5900@example.de', 17);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (50, NULL, 17);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (51, 'dr.schaefer-1764197837632-279@example.de', 17);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (52, NULL, 17);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (53, 'dr.meyer-1764197837808-8635@example.de', 17);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (54, NULL, 18);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (55, NULL, 18);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (56, 'dr.neumann-1764197838071-5343@example.de', 19);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (57, 'dr.becker-1764197838159-3161@example.de', 19);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (58, 'dr.schmidt-1764197838246-12@example.de', 19);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (59, NULL, 19);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (60, NULL, 19);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (61, NULL, 20);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (62, 'dr.klein-1764197838597-944@example.de', 20);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (63, 'dr.hoffmann-1764197838688-3574@example.de', 20);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (64, NULL, 20);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (65, 'dr.weber-1764197838872-1261@example.de', 20);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (66, 'dr.schroeder-1764197838960-3553@example.de', 21);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (67, 'dr.hoffmann-1764197839048-5798@example.de', 21);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (68, 'dr.schwarz-1764197839135-3530@example.de', 22);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (69, NULL, 22);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (70, 'dr.schwarz-1764197839313-908@example.de', 23);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (71, 'dr.zimmermann-1764197839400-8791@example.de', 23);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (72, 'dr.schwarz-1764197839487-8739@example.de', 23);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (73, NULL, 23);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (74, 'dr.schwarz-1764197839662-3614@example.de', 23);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (75, 'dr.fischer-1764197839750-2092@example.de', 24);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (76, 'dr.becker-1764197839837-2473@example.de', 24);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (77, 'dr.schmidt-1764197839924-6335@example.de', 25);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (78, 'dr.schroeder-1764197840014-1746@example.de', 25);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (79, 'dr.schulz-1764197840102-2157@example.de', 25);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (80, NULL, 26);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (81, 'dr.schwarz-1764197840277-5172@example.de', 26);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (82, NULL, 26);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (83, NULL, 26);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (84, 'dr.wagner-1764197840540-7607@example.de', 26);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (85, NULL, 27);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (86, NULL, 27);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (87, NULL, 27);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (88, 'dr.schroeder-1764197840892-6002@example.de', 27);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (89, 'dr.schneider-1764197840980-4746@example.de', 27);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (90, NULL, 28);
INSERT INTO veterinarians (id, infoemail, fk_veterinarypractice) VALUES (91, 'dr.schmidt-1764197841155-8691@example.de', 28);

-- veterinary_can_treat_animaltype from seed
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (7, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (7, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (7, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (7, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (8, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (9, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (10, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (10, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (10, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (11, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (11, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (12, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (12, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (12, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (12, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (13, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (13, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (14, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (14, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (14, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (15, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (15, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (15, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (15, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (16, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (16, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (16, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (17, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (18, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (19, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (19, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (20, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (20, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (21, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (21, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (21, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (21, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (22, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (22, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (22, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (23, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (23, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (24, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (24, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (24, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (24, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (25, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (26, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (27, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (27, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (28, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (28, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (28, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (28, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (29, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (30, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (30, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (31, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (32, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (32, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (33, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (33, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (33, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (33, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (34, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (34, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (35, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (35, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (36, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (36, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (37, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (37, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (38, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (38, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (38, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (39, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (39, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (40, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (41, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (41, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (41, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (41, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (42, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (42, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (43, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (43, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (44, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (44, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (44, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (45, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (46, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (46, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (47, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (47, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (47, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (47, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (48, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (48, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (48, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (48, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (49, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (49, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (49, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (49, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (50, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (51, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (52, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (52, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (52, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (53, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (54, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (55, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (56, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (56, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (56, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (56, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (57, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (57, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (57, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (57, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (58, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (58, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (59, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (59, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (59, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (60, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (61, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (61, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (61, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (62, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (62, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (62, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (62, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (63, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (63, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (64, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (64, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (64, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (65, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (66, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (66, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (67, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (68, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (69, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (70, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (70, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (70, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (71, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (71, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (71, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (72, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (72, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (72, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (73, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (73, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (74, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (74, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (74, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (74, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (75, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (75, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (76, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (76, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (76, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (76, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (77, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (77, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (77, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (77, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (78, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (78, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (78, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (78, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (79, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (79, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (79, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (79, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (80, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (80, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (81, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (81, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (82, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (82, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (83, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (83, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (83, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (84, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (84, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (85, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (85, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (86, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (86, 4);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (87, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (87, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (87, 6);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (87, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (88, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (88, 3);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (88, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (89, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (90, 1);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (90, 2);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (90, 5);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (90, 7);
INSERT INTO veterinary_can_treat_animaltype (fk_veterinaryid, fk_animaltypeid) VALUES (91, 6);

-- veterinary_has_service from seed
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (7, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (7, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (7, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (7, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (8, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (8, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (9, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (9, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (9, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (9, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (10, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (10, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (11, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (11, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (11, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (11, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (12, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (12, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (13, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (13, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (13, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (13, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (13, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (14, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (14, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (15, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (15, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (15, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (16, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (16, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (16, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (16, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (16, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (17, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (17, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (17, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (17, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (18, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (18, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (18, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (19, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (19, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (19, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (19, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (19, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (20, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (20, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (20, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (20, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (20, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (20, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (21, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (21, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (22, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (22, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (22, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (23, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (23, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (24, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (24, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (24, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (24, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (24, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (24, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (25, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (25, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (25, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (25, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (26, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (26, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (26, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (26, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (26, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (26, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (27, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (27, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (27, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (27, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (27, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (28, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (28, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (28, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (28, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (28, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (28, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (29, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (29, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (29, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (29, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (29, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (30, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (30, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (30, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (30, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (30, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (31, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (31, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (31, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (31, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (31, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (31, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (32, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (32, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (33, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (33, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (33, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (34, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (34, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (35, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (35, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (36, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (36, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (36, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (36, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (36, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (36, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (37, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (37, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (37, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (37, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (37, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (37, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (38, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (38, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (38, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (39, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (39, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (39, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (40, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (40, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (41, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (41, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (41, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (41, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (42, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (42, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (43, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (43, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (43, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (43, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (43, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (44, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (44, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (45, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (45, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (45, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (45, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (45, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (46, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (46, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (47, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (47, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (47, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (47, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (47, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (48, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (48, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (48, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (48, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (48, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (49, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (49, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (49, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (49, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (49, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (50, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (50, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (50, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (50, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (50, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (51, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (51, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (51, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (51, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (52, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (52, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (53, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (53, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (53, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (54, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (54, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (54, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (55, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (55, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (55, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (55, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (55, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (56, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (56, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (57, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (57, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (58, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (58, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (58, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (59, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (59, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (59, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (60, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (60, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (60, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (60, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (61, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (61, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (61, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (62, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (62, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (62, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (63, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (63, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (63, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (63, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (63, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (63, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (64, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (64, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (65, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (65, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (65, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (65, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (66, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (66, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (66, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (66, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (66, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (67, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (67, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (67, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (67, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (68, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (68, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (68, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (68, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (69, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (69, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (69, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (69, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (69, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (69, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (70, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (70, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (70, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (70, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (70, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (71, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (71, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (71, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (71, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (71, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (71, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (72, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (72, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (72, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (72, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (72, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (73, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (73, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (74, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (74, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (75, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (75, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (75, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (76, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (76, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (76, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (77, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (77, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (77, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (77, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (77, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (77, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (78, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (78, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (78, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (78, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (78, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (79, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (79, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (80, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (80, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (80, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (81, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (81, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (81, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (82, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (82, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (82, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (82, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (82, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (82, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (83, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (83, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (83, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (84, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (84, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (85, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (85, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (85, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (85, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (85, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (85, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (86, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (86, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (86, 4);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (86, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (86, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (86, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (87, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (87, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (87, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (87, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (88, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (88, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (88, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (88, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (88, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (88, 10);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (89, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (89, 2);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (89, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (89, 9);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (90, 1);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (90, 3);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (90, 5);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (90, 6);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (90, 8);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (90, 11);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (91, 7);
INSERT INTO veterinary_has_service (fk_veterinaryid, fk_serviceid) VALUES (91, 10);

-- veterinary_has_invitation from seed
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (10, 7, '2025-08-13');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (12, 6, '2025-09-20');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (12, 10, '2025-06-05');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (29, 14, '2025-10-29');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (29, 23, '2025-09-16');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (32, 23, '2025-07-12');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (38, 11, '2025-08-20');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (38, 23, '2025-11-23');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (39, 23, '2025-06-28');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (40, 11, '2025-11-16');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (40, 23, '2025-07-23');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (45, 19, '2025-06-23');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (48, 24, '2025-08-15');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (61, 8, '2025-06-23');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (62, 8, '2025-06-29');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (65, 8, '2025-06-21');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (67, 25, '2025-08-02');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (67, 26, '2025-10-31');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (70, 14, '2025-07-27');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (75, 16, '2025-11-22');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (78, 21, '2025-07-23');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (83, 21, '2025-10-13');
INSERT INTO veterinary_has_invitation (fk_veterinaryid, fk_veterinarypracticeid, dateofinvitation) VALUES (83, 25, '2025-09-24');
