# vetilib Naming Conventions

## 1. General Principles

- **Language**: Code in English, UI text in German
- **No Manual Prisma Edits**: Never edit `backend/prisma/schema.prisma` directly - it's auto-generated
- **Source of Truth**: `db/init.sql` defines database schema

## 2. File Naming

### Backend

- **Services**: camelCase, singular noun + "Service" → `animalService.ts`, `appointmentService.ts`
- **Routes**: camelCase, plural noun → `animals.ts`, `appointments.ts`
- **Errors**: PascalCase → `ConstraintError.ts`, `ResourceNotFoundError.ts`
- **Tests**: Match source filename + `.test.ts` → `animalService.test.ts`

### Frontend

- **Components**: PascalCase → `AnimalCard.tsx`, `NextAvailableAppointments.tsx`
- **API Clients**: PascalCase + "API" → `AnimalsAPI.ts`, `VeterinaryPracticeAPI.ts`
- **Routes**: lowercase + $camelCase params → `animals.tsx`, `practices/$practiceId/booking/$appointmentId.tsx`
- **Utils**: camelCase → `calendarExport.ts`, `dateToStringFormat.ts`

## 3. Variable & Function Naming

### JavaScript/TypeScript

- **Variables**: camelCase (English only) → `appointmentId`, `currentDisplay`, `dateView`
- **Functions**: camelCase verbs → `handleBookAppointment`, `getAnimalTypes`, `createVeterinaryPractice`
- **Constants**: UPPER_SNAKE_CASE → `HTTP_PORT`, `DATABASE_URL`, `MAX_FILE_SIZE`
- **Types/Interfaces**: PascalCase → `Animal`, `VeterinaryPractice`, `AppointmentType`
- **Enums**: PascalCase name, UPPER_SNAKE_CASE values → `enum Status { PENDING = 'PENDING' }`

### React Components

- **Props**: camelCase → `animalId`, `isLoading`, `onSubmit`
- **State**: camelCase → `const [selectedAnimal, setSelectedAnimal] = useState()`
- **Refs**: camelCase + "Ref" → `inputRef`, `modalRef`

### Query Keys (TanStack Query)

- **Format**: camelCase array → `['veterinaryPractices']`, `['animalTypes', practiceId]`
- **Never German**: ~~`['tierarztpraxen']`~~ → `['veterinaryPractices']`

## 4. Database Naming (init.sql)

### Tables

- **Format**: snake_case, plural → `persons`, `appointments`, `veterinary_practices`
- **Junction Tables**: `entity1_has_entity2` → `person_has_animal`, `veterinary_has_service`
- **Exception**: Lookup tables can be singular → `animal_types`, `animal_races`

### Columns

- **Format**: camelCase → `firstName`, `dateOfBirth`, `weightInGram`, `infoEmail`
- **Foreign Keys**: `fk_entityName` → `fk_personId`, `fk_veterinaryPracticeId`
- **Booleans**: `is/has` prefix → `isCastrated`, `lifestyle`, `dateOfBirthIsExact`
- **Dates**: descriptive → `dateOfBirth`, `dateOfVaccination`, `startTime`, `endTime`

### Enums

- **Type Name**: lowercase → `sexes`, `paymentstatus` (PostgreSQL convention)
- **Values**: snake_case lowercase → `not_known`, `male`, `female`, `not_applicable`

### Prisma Schema Conventions (Official)

- **Model Names**: PascalCase SINGULAR → `Person`, `Animal`, `Veterinarian`
- **Field Names**: camelCase → `firstName`, `dateOfBirth`, `infoEmail`
- **DB Mapping**: Use @@map() for plural table names
  ```prisma
  model Person {
    id Int @id
    firstName String
    @@map("persons")  // Maps to plural DB table
  }
  ```
- **Current State (TO BE FIXED in Phase 3)**:
  - Models: lowercase plural (persons, animals) - NICHT Prisma-konform
  - Fields: concatenated lowercase (dateofbirth) - NICHT Prisma-konform

## 5. Route Naming

### Frontend (TanStack Router)

- **Base Routes**: English lowercase → `/animals`, `/appointments`, `/practices`
- **Parameters**: $camelCase English → `/$practiceId`, `/$appointmentId`, `/$animalId`
- **Never German**: ~~`/praxen/$praxisId/$terminId`~~ → `/practices/$practiceId/$appointmentId`
- **Nested**: Clear hierarchy → `/practices/$practiceId/booking/$appointmentId`

### Backend (Express)

- **Base**: Plural noun → `/api/animals`, `/api/appointments`, `/api/veterinary-practices`
- **ID Params**: `:id` or `:entityId` → `/api/animals/:id`, `/api/practices/:practiceId`

## 6. Zod Schema Naming (shared/schemas/ZodSchemas.ts)

**Location:** `/shared/schemas/ZodSchemas.ts` (used by both backend & frontend)

### Schema Names

- **Format:** PascalCase + "Schema" suffix
- **Pattern:** `EntityNameSchema` for base, `EntityNameTypeSchema` for derived
- **Examples:**
  - `PersonSchema` → base person schema
  - `AnimalsSchema` → base animal schema
  - `AppointmentsSchema` → base appointment schema
  - `ServiceSchema` → base service schema

### Type Exports (from Zod schemas)

- **Format:** PascalCase + "Type" suffix
- **Pattern:** `z.infer<typeof SchemaName>`
- **Examples:**

  ```typescript
  export const AnimalsSchema = z.object({ ... })
  export type AnimalsType = z.infer<typeof AnimalsSchema>

  export const AppointmentsSchema = z.object({
    availableServices: z.array(ServiceSchema),  // camelCase!
    ...
  })
  export type AppointmentsType = z.infer<typeof AppointmentsSchema>
  ```

### Field Naming in Schemas

- **Must match backend service response format** (camelCase)
- **Critical:** After backend changes, update Zod schemas to match!
- **Example:**

  ```typescript
  // Backend service returns:
  { availableServices: [...] }

  // Zod schema MUST match:
  availableServices: z.array(ServiceSchema)  // ✓
  availableservices: z.array(ServiceSchema)  // ✗ (old, causes TS errors)
  ```

### Common Zod Schemas

| Schema Name              | Type Name               | Used For               | Location          |
| ------------------------ | ----------------------- | ---------------------- | ----------------- |
| PersonSchema             | PersonType              | Person data            | ZodSchemas.ts:20  |
| AnimalsSchema            | AnimalsType             | Animal data            | ZodSchemas.ts:45  |
| AppointmentsSchema       | AppointmentsType        | Appointment data       | ZodSchemas.ts:231 |
| ServiceSchema            | ServiceType             | Service/treatment type | ZodSchemas.ts:193 |
| VeterinaryPracticeSchema | VeterinaryPracticesType | Practice data          | ZodSchemas.ts:140 |
| AnimalTypeSchema         | AnimalTypeType          | Animal type/species    | ZodSchemas.ts:162 |

### Validation Schemas (Create/Update)

- **Pattern:** `EntityNameCreateSchema`, `EntityNameUpdateSchema`
- **Examples:**
  ```typescript
  export const AppointmentsCreateSchema = z.object({ ... })
  export const PersonUpdateSchema = PersonSchema.partial()
  ```

## 7. Import/Export Naming

### Named Exports (Preferred)

```typescript
// Good
export const animalService = { create, getById, getAll, update, delete }
export function calculateAge(dateOfBirth: Date): number { ... }

// Bad
export default AnimalService
```

### Default Exports (Components Only)

```typescript
// Acceptable for React components
export default function AnimalCard({ animalId }: Props) { ... }
```

## 8. Common Entities - Naming Reference

| Entity              | DB Table            | Prisma Model (Aktuell) | Prisma Model (Ziel Phase 3)                     | Zod Schema               | Service File                 | API Client               | Route                  |
| ------------------- | ------------------- | ---------------------- | ----------------------------------------------- | ------------------------ | ---------------------------- | ------------------------ | ---------------------- |
| Person              | persons             | persons                | Person @@map("persons")                         | PersonSchema             | personService.ts             | -                        | /persons               |
| Animal              | animals             | animals                | Animal @@map("animals")                         | AnimalsSchema            | animalService.ts             | AnimalsAPI.ts            | /animals               |
| Appointment         | appointments        | appointments           | Appointment @@map("appointments")               | AppointmentsSchema       | appointmentService.ts        | AppointmentsAPI.ts       | /appointments          |
| Veterinary Practice | veterinarypractices | veterinarypractices    | VeterinaryPractice @@map("veterinarypractices") | VeterinaryPracticeSchema | veterinaryPracticeService.ts | VeterinaryPracticeAPI.ts | /practices/:practiceId |
| Veterinarian        | veterinarians       | veterinarians          | Veterinarian @@map("veterinarians")             | VeterinarySchema         | veterinaryService.ts         | -                        | -                      |
| Animal Type         | animal_types        | animaltypes            | AnimalType @@map("animal_types")                | AnimalTypeSchema         | animalTypeService.ts         | AnimalTypeAPI.ts         | /animaltypes           |
| Service             | services            | services               | Service @@map("services")                       | ServiceSchema            | serviceService.ts            | ServicesAPI.ts           | /services              |

## 9. Migration Rules

### Safe Changes (No DB Impact)

1. Rename backend service files
2. Rename frontend components/variables
3. Fix typos in code/comments
4. Standardize casing (praxisID → practiceId)

### Risky Changes (Requires DB Rebuild)

1. Update `db/init.sql` column names
2. Run `docker-compose down -v`
3. Run `docker-compose up -d`
4. Run `npm --prefix backend run prisma` (regenerates schema)
5. Update all backend services using renamed columns
6. Update all frontend API clients
7. Run full test suite

### NEVER

- Edit `backend/prisma/schema.prisma` manually
- Edit generated Prisma client files
- Rename DB tables without updating seed scripts

## 10. Common Mistakes to Avoid

❌ German variable names in code:

````typescript
const terminId = Route.useParams().terminId  // Bad
const appointmentId = Route.useParams().appointmentId  // Good


❌ Inconsistent ID casing:
```typescript
const praxisID = 123  // Bad (PascalCase D)
const praxisId = 123  // Good (camelCase)


❌ Concatenated lowercase:
```typescript
const dateofbirth = new Date()  // Bad
const dateOfBirth = new Date()  // Good


❌ Manual Prisma schema edits:
```typescript
// NEVER edit schema.prisma directly!
// Always update init.sql → regenerate Prisma


## 11. Cross-Reference: Where Is Each Entity Used?

### persons
- **DB**: `persons` table (init.sql:38)
- **Prisma**: `persons` model (schema.prisma:81)
- **Zod**: `PersonSchema` (ZodSchemas.ts:20)
- **Backend**: `personService.ts`, `/routes/persons.ts`
- **Seed**: `seed-testdata.ts:52`
- **Frontend**: Login, registration, dashboard

### animals
- **DB**: `animals` table (init.sql:66)
- **Prisma**: `animals` model (schema.prisma:24)
- **Zod**: `AnimalsSchema` (ZodSchemas.ts:45)
- **Backend**: `animalService.ts`, `/routes/animals.ts`
- **Seed**: `seed-testdata.ts:176`
- **Frontend**: `AnimalsAPI.ts`, `/routes/animals.tsx`, `AnimalCard.tsx`

### appointments
- **DB**: `appointments` table (init.sql:130)
- **Prisma**: `appointments` model (schema.prisma:55)
- **Zod**: `AppointmentsSchema` (ZodSchemas.ts:231)
- **Backend**: `appointmentService.ts`, `/routes/appointments.ts`
- **Seed**: `seed-appointments.ts`
- **Frontend**: `AppointmentsAPI.ts`, `/routes/appointments.tsx`, booking flow

### veterinarypractices
- **DB**: `veterinarypractices` table (init.sql:94)
- **Prisma**: `veterinarypractices` model (schema.prisma:109)
- **Backend**: `veterinaryPracticeService.ts`, `/routes/veterinaryPractice.ts`
- **Seed**: `seed-testdata.ts:296`, `seed-practices.ts`
- **Frontend**: `VeterinaryPracticeAPI.ts`, `/routes/practices/$practiceId/`

### veterinarians
- **DB**: `veterinarians` table (init.sql:106)
- **Prisma**: `veterinarians` model (schema.prisma:97)
- **Backend**: `veterinaryService.ts`
- **Seed**: `seed-testdata.ts:351`
- **Frontend**: Practice detail pages

### animal_types
- **DB**: `animal_types` table (init.sql:50)
- **Prisma**: `animaltypes` model (schema.prisma:47)
- **Backend**: `animalTypeService.ts`, `/routes/animaltypes.ts`
- **Seed**: `seed-testdata.ts:117`
- **Frontend**: `AnimalTypeAPI.ts`, animal selection forms

### services
- **DB**: `services` table (init.sql:112)
- **Prisma**: `services` model (schema.prisma:197)
- **Backend**: `serviceService.ts`, `/routes/services.ts`
- **Seed**: `seed-testdata.ts:359`
- **Frontend**: `ServicesAPI.ts`, appointment booking

## 12. Checklist for Renaming

When renaming an entity or field:

### Database-Level Changes
- [ ] Update init.sql (column/table names)
- [ ] Update seed scripts (seed-*.ts)
- [ ] Run `docker-compose down -v` (drop old DB)
- [ ] Run `docker-compose up -d` (recreate DB)
- [ ] Regenerate Prisma: `npm --prefix backend run prisma`

### Schema Layer
- [ ] **Update Zod schemas** in `shared/schemas/ZodSchemas.ts`
- [ ] Verify field names match backend service responses
- [ ] Update schema names if entity renamed

### Backend Changes
- [ ] Update backend service (response object field names)
- [ ] Update backend routes
- [ ] Update backend tests
- [ ] Search backend for old names: `grep -r "oldName" backend/src`

### Frontend Changes
- [ ] Update frontend API clients
- [ ] Update frontend routes (if route params changed)
- [ ] Update frontend components using the entity
- [ ] Update query keys (TanStack Query)
- [ ] Search frontend for old names: `grep -r "oldName" frontend/src`

### Testing
- [ ] Run backend tests: `npm --prefix backend test`
- [ ] Run frontend tests: `npm --prefix frontend test`
- [ ] Build frontend: `npm --prefix frontend run build` (catches TS errors)
- [ ] Manual smoke test (critical user flows)
- [ ] Verify no TypeScript errors

### Common Pitfalls
- ⚠️ **Zod schema mismatch**: After changing backend service field names (e.g., `availableservices` → `availableServices`), MUST update Zod schema or frontend will have TS errors
- ⚠️ **Query key cache**: Old query keys may persist in browser cache - clear if issues
- ⚠️ **Route params**: Changing route params ($praxisId → $practiceId) requires updating ALL navigation links



````
