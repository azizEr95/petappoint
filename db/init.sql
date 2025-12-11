DROP TABLE IF EXISTS person_has_favorized_veterinarypractice;
DROP TABLE IF EXISTS veterinary_has_invitation;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS medications;
DROP TABLE IF EXISTS animal_has_vaccination;
DROP TABLE IF EXISTS vaccinations;
DROP TABLE IF EXISTS appointment_has_review;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS appointment_has_service;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS veterinary_can_treat_animaltype;
DROP TABLE IF EXISTS veterinary_has_service;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS veterinarians;
DROP TABLE IF EXISTS veterinarypractices;
DROP TABLE IF EXISTS person_has_animal;
DROP TABLE IF EXISTS animal_has_races;
DROP TABLE IF EXISTS animals;
DROP TABLE IF EXISTS animal_groups;
DROP TABLE IF EXISTS animal_races;
DROP TABLE IF EXISTS animal_types;
DROP TABLE IF EXISTS password_reset_tokens;
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

CREATE TYPE sexes AS ENUM ('not_known', 'male', 'female', 'not_applicable');

CREATE TYPE lifestyles AS ENUM ('indoor', 'outdoor', 'mixed');

CREATE TABLE IF NOT EXISTS persons(
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(60) NOT NULL,
  lastName VARCHAR(60) NOT NULL,
  sex sexes NOT NULL,
  dateOfBirth DATE NOT NULL,
  fk_address INTEGER NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  picturePath VARCHAR(256) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS password_reset_tokens(
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

CREATE TABLE IF NOT EXISTS animal_types(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS animal_races(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  fk_animalTypeId INTEGER NOT NULL REFERENCES animal_types(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS animal_groups(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS animals(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dateOfBirth DATE,
  dateOfBirthIsExact BOOLEAN,
  weightInGram INTEGER,
  heightInCm INTEGER,
  timeOfDeath DATE,
  isCastrated BOOLEAN NOT NULL,
  lifestyle lifestyles NOT NULL DEFAULT 'indoor',
  picturePath VARCHAR(256) DEFAULT NULL,
  sex sexes NOT NULL DEFAULT 'not_known',
  fk_animalTypeId INTEGER NOT NULL REFERENCES animal_types(id) ON DELETE CASCADE,
  fk_animalGroupId INTEGER REFERENCES animal_groups(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS animal_has_races(
  fk_animalId INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  fk_animalRaceId INTEGER NOT NULL REFERENCES animal_races(id) ON DELETE CASCADE,
  PRIMARY KEY (fk_animalId, fk_animalRaceId)
);

CREATE TABLE IF NOT EXISTS person_has_animal(
  fk_personId INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE, /*wenn Person geloescht wird, wird die Zuweisung in dieser Tabelle auch geloescht (Tier wird nicht geloescht)*/
  fk_animalId INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  PRIMARY KEY (fk_personId, fk_animalId)
);

CREATE TABLE IF NOT EXISTS veterinarypractices(
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  infoEmail VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  website VARCHAR(150),
  info TEXT,
  fk_addressId INTEGER NOT NULL REFERENCES addresses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS veterinarians(
  id INTEGER PRIMARY KEY REFERENCES persons(id) ON DELETE CASCADE,
  infoEmail VARCHAR(100),
  fk_veterinaryPracticeId INTEGER REFERENCES veterinarypractices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS services(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS veterinary_has_service(
  fk_veterinaryId INTEGER NOT NULL REFERENCES veterinarians(id) ON DELETE CASCADE,
  fk_serviceId INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  notes TEXT,
  PRIMARY KEY (fk_veterinaryId, fk_serviceId)
);

CREATE TABLE IF NOT EXISTS veterinary_can_treat_animaltype(
  fk_veterinaryId INTEGER NOT NULL REFERENCES veterinarians(id) ON DELETE CASCADE,
  fk_animaltypeId INTEGER NOT NULL REFERENCES animal_types(id) ON DELETE CASCADE,
  PRIMARY KEY (fk_veterinaryId, fk_animaltypeId)
);

CREATE TABLE IF NOT EXISTS appointments(
  id SERIAL PRIMARY KEY,
  startTime TIMESTAMP NOT NULL,
  endTime TIMESTAMP NOT NULL,
  fk_animalId INTEGER REFERENCES animals(id) ON DELETE CASCADE,
  fk_veterinaryId INTEGER NOT NULL REFERENCES veterinarians(id) ON DELETE CASCADE,
  fk_veterinaryPracticeId INTEGER NOT NULL REFERENCES veterinarypractices(id) ON DELETE CASCADE,
  fk_serviceId INTEGER REFERENCES services(id) ON DELETE CASCADE DEFAULT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS appointment_has_service(
  fk_appointmentId INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  fk_serviceId INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (fk_appointmentId, fk_serviceId)
);

CREATE TABLE IF NOT EXISTS reviews(
  id SERIAL PRIMARY KEY,
  contentment SMALLINT NOT NULL CHECK (contentment BETWEEN 0 AND 100),
  waitingTime SMALLINT NOT NULL CHECK (waitingTime BETWEEN 0 AND 100),
  kindness SMALLINT NOT NULL CHECK (kindness BETWEEN 0 AND 100),
  serviceQuality SMALLINT NOT NULL CHECK (serviceQuality BETWEEN 0 AND 100),
  price SMALLINT NOT NULL CHECK (price BETWEEN 0 AND 100),
  comment TEXT
);

CREATE TABLE IF NOT EXISTS appointment_has_review(
  fk_appointmentId INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  fk_reviewId INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  PRIMARY KEY (fk_appointmentId, fk_reviewId)
);

CREATE TYPE paymentStatus AS ENUM('unpaid', 'paid', 'cancelled');

CREATE TABLE IF NOT EXISTS vaccinations(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS animal_has_vaccination(
  id SERIAL PRIMARY KEY,
  dateOfVaccination DATE NOT NULL,
  fk_animalId INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  fk_vaccinationId INTEGER NOT NULL REFERENCES vaccinations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medications(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

/* TODO: NICHT FERTIG */
CREATE TABLE IF NOT EXISTS recipes(
  id SERIAL PRIMARY KEY,
  fk_animalId INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  fk_medicationId INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  starting DATE NOT NULL,
  endDate DATE NOT NULL,
  instructions TEXT
);

CREATE TABLE IF NOT EXISTS veterinary_has_invitation(
  fk_veterinaryId INTEGER NOT NULL REFERENCES veterinarians(id) ON DELETE CASCADE,
  fk_veterinaryPracticeId INTEGER NOT NULL REFERENCES veterinarypractices(id) ON DELETE CASCADE,
  dateOfInvitation DATE NOT NULL,
  PRIMARY KEY (fk_veterinaryId, fk_veterinaryPracticeId)
);

CREATE TABLE IF NOT EXISTS person_has_favorized_veterinarypractice(
  fk_personId INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  fk_veterinaryPracticeId INTEGER NOT NULL REFERENCES veterinarypractices(id) ON DELETE CASCADE,
  PRIMARY KEY (fk_personId, fk_veterinaryPracticeId)
);