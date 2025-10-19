DROP TABLE IF EXISTS termine;
DROP TABLE IF EXISTS tierarzt_has_spezialisierung;
DROP TABLE IF EXISTS tieraerzte;
DROP TABLE IF EXISTS tierarztpraxen;
DROP TABLE IF EXISTS spezialisierungen;
DROP TABLE IF EXISTS person_has_tier;
DROP TABLE IF EXISTS tiere;
DROP TABLE IF EXISTS tierarten;
DROP TABLE IF EXISTS tiergattungen;
DROP TABLE IF EXISTS personen;
DROP TABLE IF EXISTS addressen;


CREATE TABLE IF NOT EXISTS addressen(
  id SERIAL PRIMARY KEY,
  strasse VARCHAR(80) NOT NULL,
  citycode VARCHAR(12) NOT NULL,
  city VARCHAR(60) NOT NULL,
  country VARCHAR(150) NOT NULL
);

CREATE TYPE geschlechtEnum AS ENUM ('m', 'w', 'd');

CREATE TABLE IF NOT EXISTS personen(
  id SERIAL PRIMARY KEY,
  vorname VARCHAR(60) NOT NULL,
  nachname VARCHAR(60) NOT NULL,
  geschlecht geschlechtEnum NOT NULL,
  geburtsdatum DATE NOT NULL,
  addresse INTEGER NOT NULL REFERENCES addressen(id),
  telefon VARCHAR(20) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tiergattungen(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS tierarten(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  fk_tiergattungId INTEGER REFERENCES tiergattungen(id)
);

CREATE TABLE IF NOT EXISTS tiere(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  geburtsdatum DATE,
  fk_tierartId INTEGER NOT NULL REFERENCES tierarten(id)
);

CREATE TABLE IF NOT EXISTS person_has_tier(
  fk_personId INTEGER NOT NULL REFERENCES personen(id) ON DELETE CASCADE, /*wenn Person geloescht wird, wird die Zuweisung in dieser Tabelle auch geloescht (Tier wird nicht geloescht)*/
  fk_tierId INTEGER NOT NULL REFERENCES tiere(id),
  PRIMARY KEY (fk_personId, fk_tierId)
);

CREATE TABLE IF NOT EXISTS spezialisierungen(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS tierarztpraxen(
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  telefon VARCHAR(20) NOT NULL,
  infoEmail VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  website VARCHAR(150),
  info TEXT,
  fk_addresseId INTEGER NOT NULL REFERENCES addressen(id)
);

CREATE TABLE IF NOT EXISTS tieraerzte(
  id INTEGER PRIMARY KEY REFERENCES personen(id),
  infoEmail VARCHAR(100),
  fk_tierarztpraxis INTEGER REFERENCES tierarztpraxen(id)
);

CREATE TABLE IF NOT EXISTS tierarzt_has_spezialisierung(
  fk_tierarztId INTEGER NOT NULL REFERENCES tieraerzte(id) ON DELETE CASCADE,
  fk_spezialisierungId INTEGER NOT NULL REFERENCES spezialisierungen(id),
  PRIMARY KEY (fk_tierarztId, fk_spezialisierungId)
);

CREATE TABLE IF NOT EXISTS termine(
  id SERIAL PRIMARY KEY,
  startZeit TIMESTAMP NOT NULL,
  endZeit TIMESTAMP NOT NULL,
  fk_tierId INTEGER REFERENCES tiere(id),
  fk_tierarztId INTEGER NOT NULL REFERENCES tieraerzte(id)
);