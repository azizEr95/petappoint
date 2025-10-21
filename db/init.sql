DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS veterinary_has_specialization;
DROP TABLE IF EXISTS veterinaries;
DROP TABLE IF EXISTS veterinarypractices;
DROP TABLE IF EXISTS specializations;
DROP TABLE IF EXISTS person_has_animal;
DROP TABLE IF EXISTS animals;
DROP TABLE IF EXISTS animaltypes;
DROP TABLE IF EXISTS animalkinds;
DROP TABLE IF EXISTS persons;
DROP TABLE IF EXISTS addresses;


CREATE TABLE IF NOT EXISTS addresses(
  id SERIAL PRIMARY KEY,
  street VARCHAR(80) NOT NULL,
  citycode VARCHAR(12) NOT NULL,
  city VARCHAR(60) NOT NULL,
  country VARCHAR(150) NOT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL
);

CREATE TYPE sexes AS ENUM ('notknown', 'male', 'female', 'notapplicable');

CREATE TABLE IF NOT EXISTS persons(
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(60) NOT NULL,
  lastName VARCHAR(60) NOT NULL,
  sex sexes NOT NULL,
  dateOfBirth DATE NOT NULL,
  fk_address INTEGER NOT NULL REFERENCES addresses(id),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS animalkinds(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS animaltypes(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  fk_animalkindId INTEGER REFERENCES animalkinds(id)
);

CREATE TABLE IF NOT EXISTS animals(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dateOfBirth DATE,
  fk_animalTypeId INTEGER NOT NULL REFERENCES animaltypes(id)
);

CREATE TABLE IF NOT EXISTS person_has_animal(
  fk_personId INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE, /*wenn Person geloescht wird, wird die Zuweisung in dieser Tabelle auch geloescht (Tier wird nicht geloescht)*/
  fk_animalId INTEGER NOT NULL REFERENCES animals(id),
  PRIMARY KEY (fk_personId, fk_animalId)
);

CREATE TABLE IF NOT EXISTS specializations(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS veterinarypractices(
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  infoEmail VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  website VARCHAR(150),
  info TEXT,
  fk_addressId INTEGER NOT NULL REFERENCES addresses(id)
);

CREATE TABLE IF NOT EXISTS veterinaries(
  id INTEGER PRIMARY KEY REFERENCES persons(id),
  infoEmail VARCHAR(100),
  fk_veterinarypractice INTEGER REFERENCES veterinarypractices(id)
);

CREATE TABLE IF NOT EXISTS veterinary_has_specialization(
  fk_veterinaryId INTEGER NOT NULL REFERENCES veterinaries(id) ON DELETE CASCADE,
  fk_specializationId INTEGER NOT NULL REFERENCES specializations(id),
  PRIMARY KEY (fk_veterinaryId, fk_specializationId)
);

CREATE TABLE IF NOT EXISTS appointments(
  id SERIAL PRIMARY KEY,
  startTime TIMESTAMP NOT NULL,
  endTime TIMESTAMP NOT NULL,
  fk_animalId INTEGER REFERENCES animals(id),
  fk_veterinaryId INTEGER NOT NULL REFERENCES veterinaries(id)
);