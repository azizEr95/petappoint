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


CREATE TABLE IF NOT EXISTS countries(
  id SERIAL PRIMARY KEY,
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL
);

-- https://de.wikipedia.org/wiki/ISO-3166-1-Kodierliste
INSERT INTO countries(code, name) VALUES
('AFG', 'Afghanistan'),
('EGY', 'Agypten'),
('ALA', 'Aland'),
('ALB', 'Albanien'),
('DZA', 'Algerien'),
('ASM', 'Samoa Amerikanisch'),
('VIR', 'Jungferninseln Amerikanische'),
('AND', 'Andorra'),
('AGO', 'Angola'),
('AIA', 'Anguilla'),
('ATA', 'Guam'),
('ATG', 'Antigua und Barbuda'),
('GNQ', 'Äquatorialguinea'),
('ARG', 'Argentinien'),
('ARM', 'Armenien'),
('ABW', 'Aruba'),
('ASC', 'Ascension'),
('AZE', 'Aserbaidschan'),
('ETH', 'Athiopien'),
('AUS', 'Australien'),
('BHS', 'Bahamas'),
('BHR', 'Bahrain'),
('BGD', 'Bangladesch'),
('BRB', 'Barbados'),
('BLR', 'Belarus'),
('BEL', 'Belgien'),
('BLZ', 'Belize'),
('BEN', 'Benin'),
('BMU', 'Bermuda'),
('BTN', 'Bhutan'),
('BOL', 'Bolivien'),
('BES', 'Bonaire'),
('BIH', 'Bosnien und Herzegowina'),
('BWA', 'Botswana'),
('BVT', 'Norwegen'),
('BRA', 'Brasilien'),
('VGB', 'Jungferninseln Britische'),
('IOT', 'Britisches Territorium im Indischen Ozean'),
('BRN', 'Brunei'),
('BGR', 'Bulgarien'),
('BFA', 'Burkina Faso'),
('BUR', 'Burma'),
('BDI', 'Burundi'),
--('', 'Ceuta'),
('CHL', 'Chile'),
('CHN', 'China Volksrepublik'),
('CPT', 'Clipperton'),
('COK', 'Cookinseln'),
('CRI', 'Costa Rica'),
('CUW', 'Curaçao'),
('DNK', 'Danemark'),
--('DDR', 'Deutschland Demokratische Republik 1949'),
('DEU', 'Deutschland'),
('DGA', 'Diego Garcia'),
('DMA', 'Dominica'),
('DOM', 'Dominikanische Republik'),
('DJI', 'Dschibuti'),
('ECU', 'Ecuador'),
('CIV', 'Elfenbeinküste'),
('SLV', 'El Salvador'),
('ERI', 'Eritrea'),
('EST', 'Estland'),
('SWZ', 'Eswatini'),
('FLK', 'Falklandinseln'),
('FRO', 'Faroer'),
('FJI', 'Fidschi'),
('FIN', 'Finnland'),
('FRA', 'Frankreich'),
('FXX', 'Frankreich'),
('GUF', 'Franzosisch-Guayana'),
('PYF', 'Franzosisch-Polynesien'),
('ATF', 'Französische Süd- und Antarktisgebiete'),
('GAB', 'Gabun'),
('GMB', 'Gambia'),
('GEO', 'Georgien'),
('GHA', 'Ghana'),
('GIB', 'Gibraltar'),
('GRD', 'Grenada'),
('GRC', 'Griechenland'),
('GRL', 'Gronland'),
('GLP', 'Guadeloupe'),
('GUM', 'Guam'),
('GTM', 'Guatemala'),
('GGY', 'Bailiwick of Guernsey'),
('GIN', 'Guinea-a'),
('GNB', 'Guinea-Bissau'),
('GUY', 'Guyana'),
('HTI', 'Haiti'),
('HMD', 'Australien'),
('HND', 'Honduras'),
('HKG', 'Hongkong'),
('IND', 'Indien'),
('IDN', 'Indonesien'),
('IMN', 'Isle of Man'),
('IRQ', 'Irak'),
('IRN', 'Iran'),
('IRL', 'Irland'),
('ISL', 'Island'),
('ISR', 'Israel'),
('ITA', 'Italien'),
('JAM', 'Jamaika'),
('JPN', 'Japan'),
('YEM', 'Jemen'),
('JEY', 'Bailiwick of Jersey'),
('JOR', 'Jordanien'),
('YUG', 'Jugoslawien'),
('CYM', 'Cayman Islands'),
('KHM', 'Kambodscha'),
('CMR', 'Kamerun'),
('CAN', 'Kanada'),
('IC', 'Kanarische Inseln'),
('CPV', 'Kap Verde'),
('KAZ', 'Kasachstan'),
('QAT', 'Katar'),
('KEN', 'Kenia'),
('KGZ', 'Kirgisistan'),
('KIR', 'Kiribati'),
('CCK', 'Kokosinseln'),
('COL', 'Kolumbien'),
('COM', 'Komoren'),
('COD', 'Kongo Demokratische Republik'),
('COG', 'Kongo Republik'),
('PRK', 'Korea Nord'),
('KOR', 'Korea Sud'),
--('', 'Kosovo'),
('HRV', 'Kroatien'),
('CUB', 'Kuba'),
('KWT', 'Kuwait'),
('LAO', 'Laos'),
('LSO', 'Lesotho'),
('LVA', 'Lettland'),
('LBN', 'Libanon'),
('LBR', 'Liberia'),
('LBY', 'Libyen'),
('LIE', 'Liechtenstein'),
('LTU', 'Litauen'),
('LUX', 'Luxemburg'),
('MAC', 'Macau'),
('MDG', 'Madagaskar'),
('MWI', 'Malawi'),
('MYS', 'Malaysia'),
('MDV', 'Malediven'),
('MLI', 'Mali'),
('MLT', 'Malta'),
('MAR', 'Marokko'),
('MHL', 'Marshallinseln'),
('MTQ', 'Martinique'),
('MRT', 'Mauretanien'),
('MUS', 'Mauritius'),
('MYT', 'Mayotte'),
('MEX', 'Mexiko'),
('FSM', 'Mikronesien Foderierte Staaten'),
('MDA', 'Moldau Republik'),
('MCO', 'Monaco'),
('MNG', 'Mongolei'),
('MNE', 'Montenegro'),
('MSR', 'Montserrat'),
('MOZ', 'Mosambik'),
('MMR', 'Myanmar'),
('NAM', 'Namibia'),
('NRU', 'Nauru'),
('NPL', 'Nepal'),
('NCL', 'Neukaledonien'),
('NZL', 'Neuseeland'),
--('NTZ', 'Neutrale Zone'),
('NIC', 'Nicaragua'),
('NLD', 'Niederlande'),
('ANT', 'Niederlandische Antillen'),
('NER', 'Niger'),
('NGA', 'Nigeria'),
('NIU', 'Niue'),
('MNP', 'Marianen Nordliche'),
('MKD', 'Nordmazedonien'),
('NFK', 'Norfolkinsel'),
('NOR', 'Norwegen'),
('OMN', 'Oman'),
('AUT', 'Österreich'),
('TLS', 'Osttimor'),
('PAK', 'Pakistan'),
('PSE', 'Palästina'),
('PLW', 'Palau'),
('PAN', 'Panama'),
('PNG', 'Papua-Neuguinea'),
('PRY', 'Paraguay'),
('PER', 'Peru'),
('PHL', 'Philippinen'),
('PCN', 'Pitcairninseln'),
('POL', 'Polen'),
('PRT', 'Portugal'),
('PRI', 'Puerto Rico'),
('REU', 'Reunion'),
('RWA', 'Ruanda'),
('ROU', 'Rumänien'),
('RUS', 'Russland'),
('SLB', 'Salomonen'),
('BLM', 'Saintbarthelemy'),
('MAF', 'Saint-Martin'),
('ZMB', 'Sambia'),
('WSM', 'Samoa'),
('SMR', 'San Marino'),
('STP', 'Sao Tome und Principe'),
('SAU', 'Saudi-Arabien'),
('SWE', 'Schweden'),
('CHE', 'Schweiz'),
('SEN', 'Senegal'),
('SRB', 'Serbien'),
('SCG', 'Serbien und Montenegro'),
('SYC', 'Seychellen'),
('SLE', 'Sierra Leone'),
('ZWE', 'Simbabwe'),
('SGP', 'Singapur'),
('SXM', 'Sint Maarten'),
('SVK', 'Slowakei'),
('SVN', 'Slowenien'),
('SOM', 'Somalia'),
('SUN', 'Sowjetunion'),
('ESP', 'Spanien'),
('LKA', 'Sri Lanka'),
('SHN', 'St. Helena, Ascension und Tristan da Cunha'),
('KNA', 'Saint Kitts Nevis'),
('LCA', 'Saint Lucia'),
('SPM', 'Saint-Pierre und Miquelon'),
('VCT', 'Saint Vincent Grenadinen'),
('ZAF', 'Sudafrika'),
('SDN', 'Sudan'),
('SGS', 'Sudgeorgien Sandwichinseln'),
('SSD', 'Sudsudan'),
('SUR', 'Suriname'),
('SJM', 'Norwegen'),
('SYR', 'Syrien'),
('TJK', 'Tadschikistan'),
('TWN', 'Taiwan'),
('TZA', 'Tansania'),
('THA', 'Thailand'),
('TGO', 'Togo'),
('TKL', 'Tokelau'),
('TON', 'Tonga'),
('TTO', 'Trinidad und Tobago'),
('TAA', 'Tristan da Cunha'),
('TCD', 'Tschad'),
('CZE', 'Tschechien'),
('CSK', 'Tschechoslowakei'),
('TUN', 'Tunesien'),
('TUR', 'Türkei'),
('TKM', 'Turkmenistan'),
('TCA', 'Turksinseln und Caicosinseln'),
('TUV', 'Tuvalu'),
('UGA', 'Uganda'),
('UKR', 'Ukraine'),
('HUN', 'Ungarn'),
('URY', 'Uruguay'),
('UZB', 'Usbekistan'),
('VUT', 'Vanuatu'),
('VAT', 'Vatikanstadt'),
('VEN', 'Venezuela'),
('ARE', 'Vereinigte Arabische Emirate'),
('USA', 'Vereinigte Staaten'),
('GBR', 'Vereinigtes Königreich'),
('VNM', 'Vietnam'),
('WLF', 'Wallis Futuna'),
('CXR', 'Weihnachtsinsel'),
('ESH', 'Westsahara'),
('ZAR', 'Zaire'),
('CAF', 'Zentralafrikanische Republik'),
('CYP', 'Zypern Republik');


CREATE TABLE IF NOT EXISTS addresses(
  id SERIAL PRIMARY KEY,
  street VARCHAR(80) NOT NULL,
  citycode VARCHAR(12) NOT NULL,
  city VARCHAR(60) NOT NULL,
  fk_country INTEGER NOT NULL REFERENCES countries(id),
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
  picturepath VARCHAR(256),
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

CREATE TABLE IF NOT EXISTS person_has_confirmation_code(
  fk_personId INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  code char(6) NOT NULL ,
  dateOfCreation DATE NOT NULL,
  verified BOOLEAN NOT NULL,
  PRIMARY KEY (fk_personId)
);

CREATE TABLE IF NOT EXISTS veterinarypractices_has_confirmation_code(
  fk_veterinaryPracticeId INTEGER NOT NULL REFERENCES veterinarypractices(id) ON DELETE CASCADE,
  code char(6) NOT NULL ,
  dateOfCreation DATE NOT NULL,
  verified BOOLEAN NOT NULL,
  PRIMARY KEY (fk_veterinaryPracticeId)
);
