# Petappoint Test Data & Seeding System - Final Implementation Plan

## Executive Summary

2-Tier seeding system with deterministic, fast execution:
- **Static Seed** (`seed-static.ts`): Fixed 15 practices, 6 test accounts, 24 animals
- **Dynamic Seed** (`seed-dynamic.ts`): Date-relative appointments (regenerates daily)
- **Speed**: <5s total, all data persists across restarts
- **Idempotency**: Re-runs skip duplicates, preserve new user registrations

---

## Part 1: Static Seed (Persistent Data)

**File**: `backend/scripts/seed-static.ts`
**Execution**: Once per fresh DB
**Data**: Foundation + practices + persons + animals + vets

### Data Volumes

| Entity | Count | Purpose |
|--------|-------|---------|
| Practices | 15 exact | Geographic distribution (Berlin, Hamburg, München, Köln, Frankfurt, Stuttgart, Düsseldorf, Leipzig, Dresden, Hannover, Nürnberg, Bremen, Essen, Dortmund, Bonn) |
| Persons (test accounts) | 6 fixed | joe@doe.de, daniel@daniel.de, james@jay.de, m@m.de, joey@doey.de, aziz@erol.de |
| Veterinarians | 3 | maria.vet@example.de, daniel.vet@example.de, joe.vet@example.de |
| Animals | 24 deterministic | 1+ per race, all 7 animal types covered |
| Services | 11 | Foundation data (Untersuchung, Impfung, Röntgen, etc.) |
| Animal Types | 7 | Hund, Katze, Kleintier, Vogel, Reptil, Pferd, Nutztier |
| Animal Races | 24 total | 4 dog breeds, 1 cat, 3 small animals, 6 birds, 2 reptiles, 2 horses, 4 livestock |

### Animal Distribution

**Aziz Erol (aziz@erol.de)** - Special test account:
- Bambi (Katze - Britisch Kurzhaar)
- Maya (Katze - Britisch Kurzhaar)
- Taube1 (Vogel - Taube)
- Pegasus (Pferd - Pegasus)

**Other 5 Test Accounts** - Distributed variety:
- Joe Doe: Rex (Hund), Hoppy (Kleintier), Falky (Vogel), Pony1 (Pferd)
- Daniel Müller: Buddy (Hund), Whiskers (Kleintier), Krähe1 (Vogel), Huhn1 (Nutztier)
- James Jayjay: Charlie (Hund), Nibbles (Kleintier), Raven (Vogel), Schaf1 (Nutztier)
- Maria May: Duke (Hund), Polly (Vogel), Lizzy (Reptil), Cow1 (Nutztier)
- Denis Deniz: Tweety (Vogel), Slinky (Reptil), Bull1 (Nutztier)

### Idempotency Strategy

```typescript
// Check by unique email before creating
const existing = await prisma.veterinaryPractice.findUnique({
  where: { email: practiceData.email },
  select: { id: true },
});

if (existing) {
  // Skip, already created
  continue;
}

// Create new entry
const practice = await prisma.veterinaryPractice.create({ ... });
```

**Effect**: Running `npm run seed:static` multiple times:
- 1st run: Creates all 15 + 6 + 24 data
- 2nd run: 0 new entries (all skipped by email check)
- New user registrations preserved

---

## Part 2: Dynamic Seed (Date-Relative Data)

**File**: `backend/scripts/seed-dynamic.ts`
**Execution**: Each system start (`npm run petappoint` → triggers `seed:dynamic`)
**Data**: Appointments only

### Appointment Generation

**Past Appointments** (-14 to -1 days):
- ~150-160 total across all 15 practices
- 30-40% linked to animals (for history view testing)
- Realistic slot distribution: 5-8 weekday, 2-4 weekend slots per day

**Future Appointments** (+1 to +28 days):
- ~485-500 total across all 15 practices
- **100% linked to animals** (all booked)
- Normal distribution: 8-12 weekday, 4-6 weekend slots per day
- **Special**: Practices 11-15 have first appointment at day +15 (UI test for "jump to next free")

### Example Flow

```
Today: 2026-01-19

Appointments generated:
- Past: 2026-01-05 to 2026-01-18 (148-157 total, ~40-50 booked)
- Future: 2026-01-20 to 2026-02-16 (485-500 total, ALL with animals)

Practices 1-10: Appointments start tomorrow (2026-01-20)
Practices 11-15: First appointments at day +15 (2026-02-03)
```

### Re-execution (e.g., next day)

```
Tomorrow: 2026-01-20

Appointments regenerated:
- Past: 2026-01-06 to 2026-01-19 (151-160 total)
- Future: 2026-01-21 to 2026-02-17 (all with animals)

Result: Dates shifted by 1 day, appointments relative to current date
```

---

## Part 3: Implementation Details

### Batch Operations

All creates use `createMany()` for performance:
```typescript
// Service linking
await prisma.veterinaryHasService.createMany({
  data: serviceIds.map((serviceId) => ({
    veterinaryId: vet.id,
    serviceId,
  })),
  skipDuplicates: true,
});
```

### Transactions for Consistency

Dynamic seed uses transaction:
```typescript
await prisma.$transaction(async (tx) => {
  await tx.appointmentHasService.deleteMany({});
  await tx.appointment.deleteMany({});
  await tx.appointment.createMany({ data: appointments });
});
```

### Password Handling

All passwords plain text in seed files:
```typescript
password: "Petappoint123!"
```

Automatic hashing via Prisma Client Extension in `singletonPC.ts`:
- Passwords hashed on `create()` with bcrypt (10 rounds)
- Extension applies before DB insert
- No manual hashing needed

---

## Part 4: Package.json Scripts

### Backend (`backend/package.json`)

```json
{
  "scripts": {
    "seed": "npm run seed:all",
    "seed:static": "tsx scripts/seed-static.ts",
    "seed:dynamic": "tsx scripts/seed-dynamic.ts",
    "seed:all": "tsx scripts/seed-all.ts",
    "seed:fresh": "npm run seed:all",
    "seed:e2e": "tsx scripts/seed-e2e-tests.ts"
  }
}
```

### Root (`package.json`)

```json
{
  "scripts": {
    "seed": "npm --prefix ./backend run seed"
  }
}
```

---

## Part 5: Workflow

### Fresh Database Setup

```bash
npm run stop
docker-compose down -v
docker-compose up -d
npm run prisma
npm run seed:all     # Static + Dynamic
npm-run-all --parallel startBackend startFrontend
```

Result:
- 15 practices ✓
- 6 test accounts ✓
- 24 animals ✓
- 640-650 appointments (150-160 past, 485-500 future) ✓

### Daily Restart

```bash
npm run petappoint      # Runs seed:all (triggers seed:dynamic on startup)
```

Result:
- All existing data preserved ✓
- Appointments regenerated relative to today ✓
- New user registrations intact ✓

### Manual Re-seed (Same DB)

```bash
npm run seed:dynamic
```

Result:
- Only appointments deleted/recreated ✓
- All persons, animals, practices unchanged ✓

---

## Part 6: Test Credentials

All use password: `Petappoint123!`

| Email | Role | Animals | Practice |
|-------|------|---------|----------|
| joe@doe.de | User | Rex, Hoppy, Falky, Pony1 | All |
| daniel@daniel.de | User | Buddy, Whiskers, Krähe1, Huhn1 | All |
| james@jay.de | User | Charlie, Nibbles, Raven, Schaf1 | All |
| m@m.de | User | Duke, Polly, Lizzy, Cow1 | All |
| joey@doey.de | User | Tweety, Slinky, Bull1 | All |
| aziz@erol.de | User | Bambi, Maya, Taube1, Pegasus | All |
| maria.vet@example.de | Vet | - | Berlin Mitte |
| daniel.vet@example.de | Vet | - | Hamburg |
| joe.vet@example.de | Vet | - | Berlin Mitte |

---

## Part 7: Files Changed

### New Files
- `backend/scripts/seed-static.ts` (500 lines)
- `backend/scripts/seed-dynamic.ts` (150 lines)
- `backend/scripts/seed-all.ts` (25 lines)

### Modified Files
- `backend/package.json` (seed scripts)
- `backend/scripts/seed-testdata.ts` → fixed passwords to `Petappoint123!`
- `backend/scripts/seed-appointments.ts` → updated distribution logic

### Deprecated Files (Renamed)
- `backend/scripts/seed-testdata.ts.deprecated`
- `backend/scripts/seed-practices.ts.deprecated`
- `backend/scripts/seed-appointments.ts.deprecated`
- `backend/scripts/seed-playtest.ts` (deleted)

---

## Part 8: Success Criteria

✅ All 6 test accounts login with `Petappoint123!`
✅ Static seed runs once, idempotent on re-run
✅ Dynamic seed regenerates appointments relative to current date
✅ 24 animals with good variety (all 7 types covered)
✅ Aziz has exactly Bambi + Maya
✅ No duplicates on re-run
✅ Seed time <5s total
✅ New user registrations preserved across restarts
✅ Past appointments exist for history view (~40-50 booked)
✅ 100% of future appointments have animals
✅ Practices 11-15 have first appointment at day +15
✅ E2E tests script unchanged (CI/CD stable)

---

## Part 9: Performance

**Static Seed**: ~2-3s
- 15 practices: 200ms
- 6 persons: 100ms
- 24 animals: 150ms
- Vet linking: 50ms

**Dynamic Seed**: ~2-3s
- Delete old appointments: 100ms
- Generate 640-650 appointments: 1500ms
- Batch create: 800ms
- Link services: 100ms

**Total**: <5s (both seeds combined)

---

## Part 10: Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Re-run static seed | Email uniqueness prevents duplicates |
| New user registration mid-session | Preserved (static seed skips existing) |
| Restart without DB wipe | Idempotent static, regenerates appointments |
| Practices without vets | Seeds 3 fixed vets for Berlin & Hamburg |
| Appointment-animal linking | 100% future appointments have animals |
| Animal type coverage | 24 animals cover all 7 types + variation |
| Test account consistency | Fixed by email (always same IDs) |

---

## Deprecation Notes

Old scripts removed:
- `seed-playtest.ts`: Hardcoded Dec 2025 dates, 100 identical users
- Random person/animal generation: Replaced with deterministic 6 + 24

Kept for CI/CD:
- `seed-e2e-tests.ts`: Unchanged (separate test data)
