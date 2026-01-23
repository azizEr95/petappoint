# VetLib - API Dokumentation

**Version:** 1.0
**Datum:** 2026-01-23
**Basis-URL:** `http://localhost:3000/api` (local) oder `https://api.vetlib.de` (production)

---

## 📋 Inhaltsverzeichnis

1. [Authentication & Login](#authentication--login)
2. [Persons (Personen)](#persons-personen)
3. [Animals (Tiere)](#animals-tiere)
4. [Animal Types & Races](#animal-types--races)
5. [Appointments (Termine)](#appointments-termine)
6. [Veterinary Practices (Praxen)](#veterinary-practices-praxen)
7. [Veterinarians (Tierärzte)](#veterinarians-tierärzte)
8. [Services & Specializations](#services--specializations)
9. [Countries & Locations](#countries--locations)
10. [Error Handling](#error-handling)
11. [Data Models](#data-models)

---

## 🚀 API-Übersicht

| #  | Methode | Endpoint                                                      | Auth                    | Status       |
|----|---------|---------------------------------------------------------------|-------------------------|--------------|
| **Login** | | | | |
| 1  | POST    | `/login`                                                      | optionalAuth            | 201/401      |
| 2  | GET     | `/login`                                                      | optionalAuth            | 200/401      |
| 3  | DELETE  | `/login`                                                      | optionalAuth            | 204          |
| **Persons** | | | | |
| 4  | POST    | `/persons`                                                    | optionalAuth            | 201/400      |
| 5  | GET     | `/persons/all`                                                | requiresAuth            | 200/401      |
| 6  | GET     | `/persons/:id`                                                | requiresAuth            | 200/401/403  |
| 7  | PUT     | `/persons/:id`                                                | requiresAuth+verified   | 200/400/401  |
| 8  | PUT     | `/persons/:id/email`                                          | requiresAuth            | 200/400/401  |
| 9  | GET     | `/persons/:id/picture`                                        | requiresAuth            | 200/401/403  |
| 10 | POST    | `/persons/:id/picture`                                        | requiresAuth            | 200/400/401  |
| 11 | GET     | `/persons/:id/animals`                                        | requiresAuth            | 200/401/403  |
| 12 | GET     | `/persons/:id/favorites`                                      | requiresAuth            | 200/401/403  |
| 13 | POST    | `/persons/:id/favorites/:practiceId`                          | requiresAuth            | 201/401/403  |
| 14 | DELETE  | `/persons/:id/favorites/:practiceId`                          | requiresAuth            | 204/401/403  |
| 15 | POST    | `/persons/email`                                              | optionalAuth            | 200/404/400  |
| **Animals** | | | | |
| 16 | POST    | `/animals`                                                    | requiresAuth+verified   | 201/400/401  |
| 17 | PUT     | `/animals/:animalId`                                          | requiresAuth+verified   | 200/400/401  |
| 18 | GET     | `/animals/:animalId/picture`                                  | requiresAuth+verified   | 200/401/403  |
| 19 | GET     | `/animals/unknownPicture`                                     | requiresAuth+verified   | 200/401      |
| 20 | POST    | `/animals/:animalId/picture`                                  | requiresAuth+verified   | 201/400/401  |
| 21 | DELETE  | `/animals/:animalId/picture`                                  | requiresAuth+verified   | 204/401      |
| 22 | DELETE  | `/animals/:animalId`                                          | requiresAuth+verified   | 204/401/403  |
| 23 | DELETE  | `/animals/:animalId/with-appointments`                        | requiresAuth+verified   | 204/401/403  |
| 24 | GET     | `/animals/:animalId/races`                                    | requiresAuth+verified   | 200/401/403  |
| 25 | POST    | `/animals/:animalId/races`                                    | requiresAuth+verified   | 201/400/401  |
| 26 | DELETE  | `/animals/:animalId/races`                                    | requiresAuth+verified   | 204/401      |
| 27 | DELETE  | `/animals/:animalId/races/:raceId`                            | requiresAuth+verified   | 204/401      |
| 28 | GET     | `/animals/:animalId/appointments`                             | requiresAuth+verified   | 200/401/403  |
| **Animal Types** | | | | |
| 29 | GET     | `/animaltypes/all`                                            | optionalAuth            | 200          |
| 30 | GET     | `/animaltypes/:animalTypeId`                                  | optionalAuth            | 200/404      |
| 31 | GET     | `/animaltypes/races/:animalTypeId`                            | optionalAuth            | 200/404      |
| **Appointments** | | | | |
| 32 | GET     | `/appointments/all`                                           | requiresAuth+verified   | 200/401      |
| 33 | GET     | `/appointments/past/:personId`                                | requiresAuth+verified   | 200/401/403  |
| 34 | GET     | `/appointments/future/:personId`                              | requiresAuth+verified   | 200/401/403  |
| 35 | GET     | `/appointments/:id`                                           | optionalAuth            | 200/401/403  |
| 36 | PUT     | `/appointments/:id`                                           | requiresAuth+verified   | 201/400/401  |
| 37 | PATCH   | `/appointments/:id`                                           | requiresCompany         | 200/400/401  |
| 38 | PATCH   | `/appointments/:id/notes`                                     | requiresCompany         | 200/400/401  |
| 39 | DELETE  | `/appointments/:id`                                           | requiresAuth+verified   | 204/401/403  |
| 40 | POST    | `/appointments`                                               | requiresCompany         | 201/400/401  |
| **Email & Password Reset** | | | | |
| 41 | GET     | `/registration/:sixdigitcode`                                 | requiresAuth            | 200/400/500  |
| 42 | POST    | `/registration`                                               | requiresAuth            | 200/400/500  |
| 43 | POST    | `/password-reset/request`                                     | optionalAuth            | 200/400/500  |
| 44 | POST    | `/password-reset/verify`                                      | optionalAuth            | 200/400      |
| 45 | POST    | `/password-reset/confirm`                                     | optionalAuth            | 200/400/500  |
| **Veterinary Practices** | | | | |
| 46 | POST    | `/veterinary-practice`                                        | optionalAuth            | 201/400      |
| 47 | GET     | `/veterinary-practice/all`                                    | optionalAuth            | 200          |
| 48 | GET     | `/veterinary-practice/search`                                 | optionalAuth            | 200          |
| 49 | GET     | `/veterinary-practice/:id`                                    | optionalAuth            | 200/404      |
| 50 | GET     | `/veterinary-practice/:id/services`                           | optionalAuth            | 200/404      |
| 51 | GET     | `/veterinary-practice/:id/animaltypes`                        | optionalAuth            | 200/404      |
| 52 | GET     | `/veterinary-practice/:id/customers`                          | optionalAuth            | 200/404      |
| 53 | GET     | `/veterinary-practice/:id/veterinarians`                      | optionalAuth            | 200/404      |
| 54 | GET     | `/veterinary-practice/:id/appointments`                       | optionalAuth            | 200/404      |
| 55 | GET     | `/veterinary-practice/:id/appointments/available`             | optionalAuth            | 200/404      |
| 56 | GET     | `/veterinary-practice/:id/appointments/booked`                | optionalAuth            | 200/404      |
| 57 | GET     | `/veterinary-practice/:id/veterinarians/treatableanimals`     | optionalAuth            | 200/404      |
| 58 | PUT     | `/veterinary-practice/:id`                                    | requiresAuth+company    | 200/400/401  |
| 59 | GET     | `/veterinary-practice/:id/image`                              | requiresAuth+verified   | 200/401/403  |
| 60 | POST    | `/veterinary-practice/:id/image`                              | requiresAuth+verified   | 201/400/401  |
| 61 | DELETE  | `/veterinary-practice/:id/image`                              | requiresAuth+verified   | 204/401/403  |
| **Veterinarians** | | | | |
| 62 | POST    | `/veterinarians`                                              | optionalAuth            | 201/400      |
| 63 | GET     | `/veterinarians/:id`                                          | optionalAuth            | 200/404      |
| 64 | PUT     | `/veterinarians/:id`                                          | optionalAuth            | 200/400/404  |
| 65 | GET     | `/veterinarians/:id/animaltypes`                              | optionalAuth            | 200/404      |
| 66 | GET     | `/veterinarians/:id/appointments`                             | optionalAuth            | 200/404      |
| **Services** | | | | |
| 67 | GET     | `/services/all`                                               | optionalAuth            | 200          |
| 68 | GET     | `/services/all/available`                                     | optionalAuth            | 200          |
| 69 | GET     | `/services/veterinary/:id`                                    | optionalAuth            | 200/404      |
| **Countries & Locations** | | | | |
| 70 | GET     | `/countries/all`                                              | optionalAuth            | 200          |
| 71 | GET     | `/countries/:id`                                              | optionalAuth            | 200/404      |
| 72 | GET     | `/locations/cities`                                           | -                       | 200          |

---

## Authentication & Login

### POST /api/login
**Login mit Email & Passwort**

- **Authentication:** `optionalAuth`
- **Status Code:** `201` (success), `401` (invalid credentials)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!@"
}
```

**Response (201):**
```json
{
  "id": 1,
  "role": "person",
  "verified": true,
  "exp": 1674123456
}
```

**Details:**
- Setzt `HttpOnly` Secure Cookie `access_token` automatisch
- Cookie `sameSite: "none"` für Cross-Origin Requests
- JWT Token gültig bis `exp` (Unix Timestamp in Sekunden)
- Response enthält User ID, Rolle (person/company), Verifizierungsstatus

---

### GET /api/login
**Token validieren & aktuelle User-Session abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200` (valid), `401` (invalid/expired)

**Request:** Kein Body (Cookie wird automatisch gelesen)

**Response (200):**
```json
{
  "id": 1,
  "role": "person",
  "verified": true,
  "exp": 1674123456
}
```

**Response (401):**
```json
false
```

---

### DELETE /api/login
**Logout - Token löschen**

- **Authentication:** `optionalAuth`
- **Status Code:** `204` (No Content)

**Request:** Kein Body

**Response:** 204 No Content (Cookie wird gelöscht)

---

## Persons (Personen)

### POST /api/persons
**Neue Person registrieren**

- **Authentication:** `optionalAuth`
- **Status Code:** `201` (success), `400` (validation error)

**Request Body:**
```json
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "sex": "male",
  "dateOfBirth": "1990-05-15T00:00:00Z",
  "phone": "+49123456789",
  "email": "max@example.com",
  "password": "SecurePass123!@",
  "address": {
    "street": "Musterstraße 123",
    "cityCode": "12345",
    "city": "Berlin",
    "country": 1,
    "longitude": 13.405,
    "latitude": 52.52
  }
}
```

**Response (201):**
```json
{
  "id": 1,
  "role": "person",
  "verified": false,
  "exp": 1674123456
}
```

**Details:**
- Passwort wird automatisch gehasht (bcrypt)
- Bestätigungs-Email wird automatisch versendet
- JWT Cookie wird gesetzt

---

### GET /api/persons/:id
**Person-Profil abrufen**

- **Authentication:** `requiresAuth`
- **Status Code:** `200`, `401`, `403`

**Response (200):**
```json
{
  "id": 1,
  "firstName": "Max",
  "lastName": "Mustermann",
  "sex": "male",
  "dateOfBirth": "1990-05-15T00:00:00Z",
  "phone": "+49123456789",
  "email": "max@example.com",
  "address": {
    "id": 1,
    "street": "Musterstraße 123",
    "cityCode": "12345",
    "city": "Berlin",
    "country": 1,
    "longitude": 13.405,
    "latitude": 52.52
  }
}
```

**Details:**
- Nur die Person selbst kann ihr Profil abrufen (`id` muss `req.userId` entsprechen)
- Passwort wird nie zurückgegeben

---

### PUT /api/persons/:id
**Person-Profil aktualisieren**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `200`, `400`, `401`, `403`

**Request Body:** (Wie POST, aber mit id und optionalem password)
```json
{
  "id": 1,
  "firstName": "Maximilian",
  "lastName": "Mustermann",
  "sex": "male",
  "dateOfBirth": "1990-05-15T00:00:00Z",
  "phone": "+49987654321",
  "email": "max@example.com",
  "password": "NewSecurePass456!@",
  "address": {
    "id": 1,
    "street": "Neue Straße 456",
    "cityCode": "12345",
    "city": "Berlin",
    "country": 1,
    "longitude": 13.405,
    "latitude": 52.52
  }
}
```

**Response:** Aktualisierter Person-Datensatz

---

### PUT /api/persons/:id/email
**Email-Adresse ändern**

- **Authentication:** `requiresAuth`
- **Status Code:** `200`, `400`, `401`

**Request Body:**
```json
{
  "email": "newemail@example.com"
}
```

**Response:** Aktualisierter Person-Datensatz mit neuer Email

---

### GET /api/persons/:id/picture
**Profilbild abrufen**

- **Authentication:** `requiresAuth`
- **Status Code:** `200`, `401`, `403`, `404`

**Response:** Binary Image File (JPEG/PNG/WebP)

---

### POST /api/persons/:id/picture
**Profilbild hochladen**

- **Authentication:** `requiresAuth`
- **Status Code:** `200`, `400`, `401`
- **Content-Type:** `multipart/form-data`

**Form Data:**
```
picture: [image file, max 2MB, only images]
```

**Response:** `200 OK`

---

### GET /api/persons/:id/animals
**Alle Tiere der Person abrufen**

- **Authentication:** `requiresAuth`
- **Status Code:** `200`, `401`, `403`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Bella",
    "dateOfBirth": "2020-03-10T00:00:00Z",
    "dateOfBirthIsExact": true,
    "weightInGram": 25000,
    "heightInCm": 45,
    "timeOfDeath": null,
    "isCastrated": false,
    "lifestyle": "mixed",
    "sex": "female",
    "animalTypeId": 2,
    "animalGroupId": 1
  }
]
```

---

### GET /api/persons/:id/favorites
**Favoriten-Praxen abrufen**

- **Authentication:** `requiresAuth`
- **Status Code:** `200`, `401`, `403`

**Response:**
```json
[1, 5, 12]
```

Array von Praxis-IDs

---

### POST /api/persons/:id/favorites/:practiceId
**Praxis zu Favoriten hinzufügen**

- **Authentication:** `requiresAuth`
- **Status Code:** `201`, `401`, `403`

**Response:** `201 Created`

---

### DELETE /api/persons/:id/favorites/:practiceId
**Praxis aus Favoriten entfernen**

- **Authentication:** `requiresAuth`
- **Status Code:** `204`, `401`, `403`

**Response:** `204 No Content`

---

### POST /api/persons/email
**Email-Existenz prüfen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`, `400`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200) - Email existiert:**
```json
{
  "exists": true,
  "isVeterinarian": false,
  "firstName": "Max",
  "lastName": "Mustermann"
}
```

**Response (404) - Email existiert nicht:**
```json
{
  "exists": false
}
```

---

### GET /api/persons/all
**Alle Personen abrufen (Admin)**

- **Authentication:** `requiresAuth`
- **Status Code:** `200`, `401`

**Response:** Array von PersonsType

---

## Animals (Tiere)

### POST /api/animals
**Neues Tier erstellen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `201`, `400`, `401`, `403`

**Request Body:**
```json
{
  "name": "Bella",
  "dateOfBirth": "2020-03-10T00:00:00Z",
  "dateOfBirthIsExact": true,
  "weightInGram": 25000,
  "heightInCm": 45,
  "timeOfDeath": null,
  "isCastrated": false,
  "lifestyle": "mixed",
  "sex": "female",
  "animalTypeId": 2,
  "animalGroupId": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Bella",
  "dateOfBirth": "2020-03-10T00:00:00Z",
  "dateOfBirthIsExact": true,
  "weightInGram": 25000,
  "heightInCm": 45,
  "timeOfDeath": null,
  "isCastrated": false,
  "lifestyle": "mixed",
  "sex": "female",
  "animalTypeId": 2,
  "animalGroupId": 1
}
```

**Enum-Werte:**
- `lifestyle`: "indoor", "outdoor", "mixed"
- `sex`: "not_known", "male", "female", "not_applicable"

---

### PUT /api/animals/:animalId
**Tier aktualisieren**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `200`, `400`, `401`, `403`

**Request Body:** (Wie POST)

**Response:** Aktualisierter Animal-Datensatz

---

### GET /api/animals/:animalId/picture
**Tierbild abrufen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `200`, `401`, `403`, `404`

**Response:** Binary Image File

---

### GET /api/animals/unknownPicture
**Standard-Tierbild abrufen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `200`, `401`

**Response:** Binary Image File (Default unknown animal picture)

---

### POST /api/animals/:animalId/picture
**Tierbild hochladen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `201`, `400`, `401`
- **Content-Type:** `multipart/form-data`

**Form Data:**
```
picture: [image file, max 2MB, only images]
```

---

### DELETE /api/animals/:animalId/picture
**Tierbild löschen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `204`, `401`, `403`

---

### DELETE /api/animals/:animalId
**Tier löschen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `204`, `401`, `403`

---

### DELETE /api/animals/:animalId/with-appointments
**Tier + alle Termine löschen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `204`, `401`, `403`

**Details:** Alle zugehörigen Termine werden storniert/gelöscht

---

### GET /api/animals/:animalId/races
**Rassen des Tieres abrufen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `200`, `401`, `403`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Deutscher Schäferhund",
    "animalTypeId": 1
  }
]
```

---

### POST /api/animals/:animalId/races
**Rassen zu Tier hinzufügen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `201`, `400`, `401`

**Request Body:**
```json
{
  "animalId": 1,
  "animalraceids": [1, 2, 3]
}
```

**Response:** Animal_has_RacesType

---

### DELETE /api/animals/:animalId/races
**Alle Rassen entfernen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `204`, `401`

---

### DELETE /api/animals/:animalId/races/:raceId
**Spezifische Rasse entfernen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `204`, `401`

---

### GET /api/animals/:animalId/appointments
**Termine für Tier abrufen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `200`, `401`, `403`

**Response:** Array von AppointmentsType

---

## Animal Types & Races

### GET /api/animaltypes/all
**Alle Tiertypen abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Hund"
  },
  {
    "id": 2,
    "name": "Katze"
  }
]
```

---

### GET /api/animaltypes/:animalTypeId
**Spezifischen Tiertyp abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:** AnimalTypeType

---

### GET /api/animaltypes/races/:animalTypeId
**Rassen für Tiertyp abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Deutscher Schäferhund",
    "animalTypeId": 1
  },
  {
    "id": 2,
    "name": "Dachshund",
    "animalTypeId": 1
  }
]
```

---

## Appointments (Termine)

### GET /api/appointments/all
**Alle Termine abrufen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `200`, `401`

**Response:** Array von AppointmentsType

---

### GET /api/appointments/past/:personId
**Vergangene Termine einer Person abrufen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `200`, `401`, `403`

**Response:** Array von AppointmentsType

---

### GET /api/appointments/future/:personId
**Zukünftige Termine einer Person abrufen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `200`, `401`, `403`

**Response:** Array von AppointmentsType

---

### GET /api/appointments/:id
**Einzelnen Termin abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `401`, `403`, `404`

**Response:**
```json
{
  "id": 1,
  "startTime": "2024-02-15T10:00:00Z",
  "endTime": "2024-02-15T10:30:00Z",
  "animal": {
    "id": 1,
    "name": "Bella",
    "dateOfBirth": "2020-03-10T00:00:00Z",
    "dateOfBirthIsExact": true,
    "weightInGram": 25000,
    "heightInCm": 45,
    "timeOfDeath": null,
    "isCastrated": false,
    "lifestyle": "mixed",
    "sex": "female",
    "animalTypeId": 2,
    "animalGroupId": 1
  },
  "veterinary": {
    "id": 1,
    "firstName": "Dr.",
    "lastName": "Schmidt",
    "infoEmail": "dr.schmidt@praxis.de",
    "fk_veterinarypracticeid": 1
  },
  "veterinaryPractice": {
    "id": 1,
    "name": "Tierarzt Schmidt",
    "email": "info@praxis.de",
    "phone": "+49123456789",
    "infoEmail": "dr.schmidt@praxis.de",
    "website": "https://praxis-schmidt.de",
    "info": "Kleine Tierpraxis mit moderner Ausstattung",
    "address": {
      "id": 1,
      "street": "Tierstraße 1",
      "cityCode": "12345",
      "city": "Berlin",
      "country": 1,
      "longitude": 13.405,
      "latitude": 52.52
    }
  },
  "service": {
    "id": 1,
    "name": "Allgemeine Untersuchung"
  },
  "availableServices": [
    {
      "id": 1,
      "name": "Allgemeine Untersuchung"
    },
    {
      "id": 2,
      "name": "Impfung"
    }
  ],
  "notes": null
}
```

---

### PUT /api/appointments/:id
**Termin buchen (als Person)**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `201`, `400`, `401`, `403`

**Request Body:**
```json
{
  "id": 1,
  "animalId": 5,
  "serviceId": 2
}
```

**Response (201):** Aktualisierter AppointmentsType (mit gebuchtem Tier & Service)

**Details:**
- Bestätigungs-Email wird automatisch versendet
- Nur verfügbare Termine können gebucht werden
- Termin darf noch kein Tier haben

---

### PATCH /api/appointments/:id
**Verfügbaren Termin aktualisieren (Company)**

- **Authentication:** `requiresAuth + verified + role:company`
- **Status Code:** `200`, `400`, `401`, `403`

**Request Body:**
```json
{
  "startTime": "2024-02-15T11:00:00Z",
  "endTime": "2024-02-15T11:30:00Z",
  "veterinaryId": 2,
  "availableServiceIds": [1, 2, 3]
}
```

**Response:** Aktualisierter AppointmentsType

---

### PATCH /api/appointments/:id/notes
**Notizen zu Termin hinzufügen (Company)**

- **Authentication:** `requiresAuth + verified + role:company`
- **Status Code:** `200`, `400`, `401`

**Request Body:**
```json
{
  "notes": "Impfung durchgeführt, Auffrischung in 12 Monaten nötig"
}
```

**Response:** Aktualisierter AppointmentsType

---

### DELETE /api/appointments/:id
**Termin stornieren**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `204`, `401`, `403`

**Details:**
- Personen können nur ihre eigenen Termine stornieren
- Companies können ihre Termine stornieren
- Stornierungs-Email wird versendet

---

### POST /api/appointments
**Verfügbare Termine/Slots erstellen (Company)**

- **Authentication:** `requiresAuth + verified + role:company`
- **Status Code:** `201`, `400`, `401`

**Request Body:**
```json
{
  "startTime": "2024-02-15T09:00:00Z",
  "endTime": "2024-02-15T09:30:00Z",
  "veterinaryId": 1,
  "fk_veterinarypracticeid": 1,
  "availableServiceIds": [1, 2],
  "endDate": "2024-02-29T09:30:00Z"
}
```

**Response (201):**
```json
{
  "message": "Appointments created successfully",
  "count": 15
}
```

**Details:**
- `endDate` optinal für wiederkehrende Slots
- Slots werden bei Buchung auf "booked" gesetzt

---

## Email Verification & Password Reset

### GET /api/registration/:sixdigitcode
**Email-Verifikation mit Code**

- **Authentication:** `requiresAuth`
- **Status Code:** `200`, `400`, `500`

**Response (200):**
```json
{
  "id": 1,
  "role": "person",
  "verified": true,
  "exp": 1674123456
}
```

**Details:**
- JWT Cookie wird mit neuem Token aktualisiert
- `verified` Flag wird auf `true` gesetzt
- Code wird invalidiert nach Verwendung

---

### POST /api/registration
**Bestätigungs-Email erneut versenden**

- **Authentication:** `requiresAuth`
- **Status Code:** `200`, `400`, `500`

**Response (200):**
```json
{}
```

**Details:**
- Nur unverifizierten Accounts möglich
- Neue Email mit 6-stelligem Code wird versendet

---

### POST /api/password-reset/request
**Passwort-Reset anfordern**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `400`, `500`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If the email exists, a reset link has been sent"
}
```

**Details:**
- Gibt immer 200 zurück (verhindert Email-Enumeration)
- Reset-Link wird nur bei existierendem Account gesendet
- Token gültig für X Minuten (z.B. 1 Stunde)

---

### POST /api/password-reset/verify
**Reset-Token validieren**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `400`

**Request Body:**
```json
{
  "token": "abc123def456..."
}
```

**Response (200) - Valid:**
```json
{
  "valid": true
}
```

**Response (400) - Invalid:**
```json
{
  "valid": false,
  "error": "Token is invalid, expired, or already used"
}
```

---

### POST /api/password-reset/confirm
**Passwort zurücksetzen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `400`, `500`

**Request Body:**
```json
{
  "token": "abc123def456...",
  "newPassword": "NewSecurePass456!@"
}
```

**Response (200):**
```json
{
  "message": "Password successfully reset"
}
```

**Response (400) - Invalid Token:**
```json
{
  "error": "Token is invalid, expired, or already used"
}
```

**Response (400) - Validation Error:**
```json
{
  "error": "Password validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 8,
      "path": ["newPassword"],
      "message": "String must contain at least 8 character(s)"
    }
  ]
}
```

**Password-Anforderungen:**
- Mindestens 8 Zeichen
- Mindestens 1 Großbuchstabe
- Mindestens 1 Zahl
- Mindestens 1 Sonderzeichen (!@#$%^&*()_+-=[]{}...etc)

---

## Veterinary Practices (Praxen)

### POST /api/veterinary-practice
**Neue Tierarztpraxis registrieren**

- **Authentication:** `optionalAuth`
- **Status Code:** `201`, `400`

**Request Body:**
```json
{
  "name": "Tierarzt Schmidt",
  "email": "info@praxis.de",
  "phone": "+49123456789",
  "infoEmail": "dr.schmidt@praxis.de",
  "website": "https://praxis-schmidt.de",
  "info": "Kleine Tierpraxis mit moderner Ausstattung",
  "password": "SecurePass123!@",
  "address": {
    "street": "Tierstraße 1",
    "cityCode": "12345",
    "city": "Berlin",
    "country": 1,
    "longitude": 13.405,
    "latitude": 52.52
  }
}
```

**Response (201):**
```json
{
  "id": 1,
  "role": "company",
  "verified": false,
  "exp": 1674123456
}
```

**Details:**
- Passwort wird gehasht
- Bestätigungs-Email wird versendet
- JWT Cookie wird gesetzt

---

### GET /api/veterinary-practice/all
**Alle Praxen abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`

**Response:** Array von VeterinaryPracticesType

---

### GET /api/veterinary-practice/search
**Praxen suchen mit Filtern**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`

**Query Parameters:**
```
GET /api/veterinary-practice/search?name=Schmidt&address=Berlin&animalTypeIds=1,2&serviceTypeIds=3,4&page=1&pageSize=10
```

- `name`: Praxis-Name (optional)
- `address`: Straße oder Stadt (optional)
- `animalTypeIds`: Komma-separierte Tier-Typ-IDs (optional)
- `serviceTypeIds`: Komma-separierte Service-IDs (optional)
- `page`: Seite (default: 1)
- `pageSize`: Items pro Seite (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Tierarzt Schmidt",
      "email": "info@praxis.de",
      "phone": "+49123456789",
      "infoEmail": "dr.schmidt@praxis.de",
      "website": "https://praxis-schmidt.de",
      "info": "Kleine Tierpraxis...",
      "address": {
        "id": 1,
        "street": "Tierstraße 1",
        "cityCode": "12345",
        "city": "Berlin",
        "country": 1,
        "longitude": 13.405,
        "latitude": 52.52
      }
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 10
}
```

---

### GET /api/veterinary-practice/:id
**Praxis-Details abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:** VeterinaryPracticesType

---

### GET /api/veterinary-practice/:id/services
**Services der Praxis abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Allgemeine Untersuchung"
  },
  {
    "id": 2,
    "name": "Impfung"
  }
]
```

---

### GET /api/veterinary-practice/:id/animaltypes
**Behandelbare Tiertypen abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:** Array von AnimalTypeType

---

### GET /api/veterinary-practice/:id/customers
**Kunden & deren Tiere abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:**
```json
[
  {
    "animal": {
      "id": 1,
      "name": "Bella",
      ...
    },
    "person": {
      "id": 1,
      "firstName": "Max",
      "lastName": "Mustermann",
      ...
    }
  }
]
```

---

### GET /api/veterinary-practice/:id/veterinarians
**Tierärzte der Praxis abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:** Array von VeterinariansType

---

### GET /api/veterinary-practice/:id/appointments
**Termine der Praxis abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Query Parameters:**
```
GET /api/veterinary-practice/:id/appointments?animalTypeIds=1,2&serviceTypeIds=3,4
```

**Response:** Array von AppointmentsType

---

### GET /api/veterinary-practice/:id/appointments/available
**Verfügbare Termine abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Query Parameters:** (Wie appointments)

**Response:** Array von verfügbaren AppointmentsType (animal == null)

---

### GET /api/veterinary-practice/:id/appointments/booked
**Gebuchte Termine abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:** Array von gebuchten AppointmentsType (animal != null)

---

### GET /api/veterinary-practice/:id/veterinarians/treatableanimals
**Behandelbare Tiere pro Tierarzt abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:**
```json
[
  {
    "id": 1,
    "treatableAnimalTypes": [1, 2, 3]
  },
  {
    "id": 2,
    "treatableAnimalTypes": [1, 4]
  }
]
```

---

### PUT /api/veterinary-practice/:id
**Praxis-Profil aktualisieren**

- **Authentication:** `requiresAuth + verified + role:company`
- **Status Code:** `200`, `400`, `401`, `403`

**Request Body:** (Wie POST, ohne password)
```json
{
  "name": "Neue Tierarzt Schmidt",
  "email": "neueinfo@praxis.de",
  "phone": "+49987654321",
  "infoEmail": "dr.schmidt@praxis.de",
  "website": "https://neue-praxis-schmidt.de",
  "info": "Modernisierte Praxis",
  "address": {
    "id": 1,
    "street": "Neue Tierstraße 2",
    "cityCode": "54321",
    "city": "München",
    "country": 1,
    "longitude": 11.581,
    "latitude": 48.135
  }
}
```

**Response:** Aktualisierter VeterinaryPracticesType

---

### GET /api/veterinary-practice/:id/image
**Praxis-Bild abrufen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `200`, `401`, `403`, `404`

**Response:** Binary Image File

---

### POST /api/veterinary-practice/:id/image
**Praxis-Bild hochladen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `201`, `400`, `401`
- **Content-Type:** `multipart/form-data`

**Form Data:**
```
image: [image file, max 2MB, only images]
```

---

### DELETE /api/veterinary-practice/:id/image
**Praxis-Bild löschen**

- **Authentication:** `requiresAuth + verified`
- **Status Code:** `204`, `401`, `403`

---

## Veterinarians (Tierärzte)

### POST /api/veterinarians
**Neuen Tierarzt erstellen**

**Option 1: Neue Person**
```json
{
  "firstName": "Dr.",
  "lastName": "Schmidt",
  "infoEmail": "dr.schmidt@praxis.de",
  "fk_veterinarypracticeid": 1
}
```

**Option 2: Existierende Person als Tierarzt hinzufügen**
```json
{
  "id": 5,
  "firstName": "Existing",
  "lastName": "Person",
  "infoEmail": "person@example.com",
  "fk_veterinarypracticeid": 1
}
```

- **Authentication:** `optionalAuth`
- **Status Code:** `201`, `400`

**Response (201):** VeterinariansType

---

### GET /api/veterinarians/:id
**Tierarzt-Details abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:** VeterinariansType

---

### PUT /api/veterinarians/:id
**Tierarzt aktualisieren**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `400`, `404`

**Request Body:**
```json
{
  "infoEmail": "dr.neuemail@praxis.de",
  "animalTypeIds": [1, 2, 3],
  "serviceIds": [1, 2, 4]
}
```

**Response:** Aktualisierter VeterinariansType

---

### GET /api/veterinarians/:id/animaltypes
**Behandelbare Tiertypen abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:** Array von AnimalTypeType

---

### GET /api/veterinarians/:id/appointments
**Termine des Tierarztes abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:** Array von AppointmentsType

---

## Services & Specializations

### GET /api/services/all
**Alle Services abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Allgemeine Untersuchung"
  },
  {
    "id": 2,
    "name": "Impfung"
  },
  {
    "id": 3,
    "name": "Zahnarzt"
  }
]
```

---

### GET /api/services/all/available
**Verfügbare (aktive) Services abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`

**Response:** Array von aktiven ServiceType

---

### GET /api/services/veterinary/:id
**Services für spezifischen Tierarzt abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:** Array von ServiceType

---

## Countries & Locations

### GET /api/countries/all
**Alle Länder abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`

**Response:**
```json
[
  {
    "id": 1,
    "code": "DE",
    "name": "Germany"
  },
  {
    "id": 2,
    "code": "AT",
    "name": "Austria"
  }
]
```

---

### GET /api/countries/:id
**Spezifisches Land abrufen**

- **Authentication:** `optionalAuth`
- **Status Code:** `200`, `404`

**Response:** CountryType

---

### GET /api/locations/cities
**Alle Städte abrufen (cached)**

- **Authentication:** `none`
- **Status Code:** `200`
- **Cache:** 1 Stunde

**Response:**
```json
[
  "Berlin",
  "Munich",
  "Hamburg",
  "Cologne",
  "Frankfurt"
]
```

---

## Error Handling

### Standard Error Response

**400 Bad Request (Validation Error):**
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email format"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Authentication token missing or invalid"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Data Models

### PersonsType
```typescript
{
  id: number;
  firstName: string; // 2-60 chars
  lastName: string;  // 2-60 chars
  sex: "not_known" | "male" | "female" | "not_applicable";
  dateOfBirth: Date;
  address: AddressesType;
  phone: string; // 5-20 chars
  email: string; // valid email, max 100 chars
}
```

### AnimalsType
```typescript
{
  id: number;
  name: string; // 1-100 chars
  dateOfBirth: Date | null;
  dateOfBirthIsExact: boolean | null;
  weightInGram: number | null;
  heightInCm: number | null;
  timeOfDeath: Date | null;
  isCastrated: boolean;
  lifestyle: "indoor" | "outdoor" | "mixed";
  sex: "not_known" | "male" | "female" | "not_applicable";
  animalTypeId: number;
  animalGroupId: number | null;
}
```

### AddressesType
```typescript
{
  id: number;
  street: string; // 3-80 chars
  cityCode: string; // 3-12 chars (ZIP code)
  city: string; // 3-60 chars
  country: number; // Country ID
  longitude: number;
  latitude: number;
}
```

### VeterinaryPracticesType
```typescript
{
  id: number;
  name: string; // 5-200 chars
  email: string; // valid email
  phone: string; // 5-20 chars
  infoEmail: string; // valid email
  website: string | null; // valid URL, max 150 chars
  info: string | null;
  address: AddressesType;
}
```

### AppointmentsType
```typescript
{
  id: number;
  startTime: Date;
  endTime: Date;
  animal: AnimalsType | null;
  veterinary: VeterinariansType;
  veterinaryPractice: VeterinaryPracticesType;
  service: ServiceType | null;
  availableServices: ServiceType[];
  notes: string | null;
}
```

### VeterinariansType
```typescript
{
  id: number; // same as person id
  firstName: string;
  lastName: string;
  infoEmail: string | null; // valid email or null
  fk_veterinarypracticeid: number | null;
}
```

### ServiceType
```typescript
{
  id: number;
  name: string; // 1-100 chars
}
```

### AnimalTypeType
```typescript
{
  id: number;
  name: string;
}
```

### LoginType (JWT Token Payload)
```typescript
{
  id: number;
  role: "person" | "company";
  verified: boolean;
  exp: number; // Unix timestamp (seconds)
}
```

---

## Authentifizierungsmechanismus

### Cookie-basiertes JWT
- **Cookie Name:** `access_token`
- **Type:** HttpOnly, Secure, SameSite=none
- **Token Format:** JWT (RS256 oder HS256)
- **Standard TTL:** 10 Minuten (konfigurierbar)
- **Refresh:** Neuer Token bei neuer Anfrage automatisch gesetzt

### Middleware Stack
Alle Requests durchlaufen:
1. CORS-Check
2. Cookie Parser
3. JSON Parser
4. Auth Middleware (setzt `req.userId`, `req.role`, `req.verified`)
5. Exception Handler

### Autorisierungsstufen
- **optionalAuth:** Authentifizierung optional
- **requiresAuth:** JWT Token erforderlich
- **requiresAuth + verified:** Token + verifizierte Email erforderlich
- **requiresCompany:** Token + Company-Rolle erforderlich

---

## Hinweise für Entwickler

1. **Password Hashing:** Automatisch via Prisma Client Extensions (bcrypt, 10 salt rounds)
2. **Email Validation:** Alle Email-Felder validiert mit Zod
3. **File Uploads:** Max 2MB, nur Bilder (MIME-Type: image/*)
4. **CORS:** Konfiguriert für Cross-Origin Requests
5. **Error Handling:** Custom Exceptions mit HTTP Status Codes
6. **Validation:** Zod Schemas für alle Request Bodies

---

**Stand:** 2026-01-23
**API Version:** 1.0
**Maintainer:** VetLib Team
