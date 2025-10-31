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

-- Testdaten für Tierarztpraxen (veterinarypractices)
INSERT INTO veterinarypractices (name, phone, infoemail, email, password, website, info, fk_addressid)
VALUES
  ('Tierarztpraxis Berlin Mitte', '+49 30 123456', 'info@berlinvet.de', 'kontakt@berlinvet.de', 'hashedpw123', 'https://www.berlinvet.de', 'Kompetente Kleintierpraxis im Herzen Berlins.', 1),
  ('Alstertal Tierklinik Hamburg', '+49 40 987654', 'info@alstertier.de', 'kontakt@alstertier.de', 'hashedpw456', 'https://www.alstertier.de', 'Moderne Tierklinik mit 24h-Notdienst.', 2),
  ('Tiergesundheit München', '+49 89 111222', 'info@muenchentiere.de', 'praxis@muenchentiere.de', 'hashedpw789', NULL, 'Praxis für Haustiere aller Art.', 3),
  ('VetKöln – Tiermedizin am Rhein', '+49 221 333444', 'info@vetkoeln.de', 'praxis@vetkoeln.de', 'hashedpw321', 'https://www.vetkoeln.de', 'Spezialisiert auf Kleintiere und Exoten.', 4),
  ('FrankfurtVet – Zentrum für Tiermedizin', '+49 69 555666', 'info@frankfurtvet.de', 'kontakt@frankfurtvet.de', 'hashedpw654', 'https://www.frankfurtvet.de', 'Tierärztliches Zentrum mit Chirurgie und Diagnostik.', 5);
