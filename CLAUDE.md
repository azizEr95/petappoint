# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Veterinary library management system with 4 main components:
- **backend/**: Node.js/Express/TypeScript API with Prisma ORM
- **frontend/**: React/TypeScript SPA using TanStack Router & Query, Vite, Bootstrap + custom CSS
- **shared/**: Zod validation schemas used by both backend & frontend
- **db/**: PostgreSQL database with init scripts

## Development Commands

### Root Level (from repo root)
- `npm run vetilib` - start all services (DB + backend + frontend)
- `npm run vetilib:detached` - start services in Docker background
- `npm run stop` - stop all Docker containers
- `npm test` - run all tests (backend + frontend)
- `npm run prisma` - regenerate Prisma client after schema changes

### Backend (from `backend/`)
- `npm start` - dev server w/ nodemon, hot reload on port 3000 (or HTTP_PORT env var)
- `npm run build` - compile TypeScript to `dist/`
- `npm test` - run Jest tests with `--runInBand`
- `npm test -- --testPathPattern=service/VeterinaryPractice` - run specific test file
- `npm run prisma` - pull DB schema and generate Prisma client to `generated/prisma/`
- `npm run seed` - seed all test data (testdata, practices, appointments)
- `npm run seed:testdata` - seed person/veterinary/animal data
- `npm run seed:practices` - seed veterinary practice data
- `npm run seed:appointments` - seed appointment data

### Frontend (from `frontend/`)
- `npm run dev` - Vite dev server on port 3001 with HMR
- `npm run build` - prod build + TypeScript compile
- `npm run serve` - preview prod build locally
- `npm test` - run Vitest tests
- `npm test -- src/components/Form.test.tsx` - run specific test file
- `npm run check` - format with Prettier + lint with ESLint (auto-fix)

### Database
- `docker-compose up` - starts PostgreSQL on port 5432
  - DB: `vetlib-db`, User: `vetlib`, Password: `123`
- Schema in `db/init.sql`, test data in `db/testdaten.sql`
- Use `npm run seed` after DB init to populate test data

## Architecture

### Backend Service Layer
Each DB entity has corresponding service in `backend/src/service/`:
- Services export object with CRUD methods (create, getById, getAll, update, delete)
- All services use singleton Prisma client from `singletonPC.ts`
- Routes in `backend/src/routes/` consume services
- Pattern: `router -> service -> Prisma -> PostgreSQL`

### Password Security
**Automatic password hashing** via Prisma Client Extensions:
- Passwords in `persons` and `veterinarypractices` tables automatically hashed with bcrypt (10 salt rounds)
- Hashing happens transparently on create/update operations in `singletonPC.ts`
- No manual hashing needed in services
- Use `comparePassword(plain, hashed)` from `backend/src/utils/password.ts` for login verification
- Never store plain text passwords

### Frontend Data Flow
- API calls in `frontend/src/api/` (e.g., `VeterinaryPractice.ts`)
- Routes in `frontend/src/routes/` (TanStack Router file-based routing)
- Auto-generated route tree in `routeTree.gen.ts` (don't edit manually)
- State management with Zustand in `frontend/src/stores/` (e.g., auth state)
- Config in `frontend/config/config` (e.g., BACKEND_URL)
- TanStack Query for server state caching and sync

### Backend Email Service
- Email service via Brevo API (`singletonEmail.ts`)
- Configured with BREVO_API_KEY env var
- Used for appointment confirmations, invitations, notifications
- Pattern: services call `singletonEmail.sendEmail()` methods

### Database Schema
Prisma schema in `backend/prisma/schema.prisma` (reverse-engineered from DB):
- Main entities: persons, veterinaries, veterinarypractices, animals, appointments, invoices, reviews
- Junction tables use `_has_` naming (e.g., `person_has_animal`, `veterinary_has_specialization`)
- Enums: sexes, husbandarysystem, paymentstatus
- Generated client output: `backend/generated/prisma/`

## Testing

### Backend (Unit Tests)
- Jest config in `backend/jest.config.js`
- Uses ts-jest preset, node environment
- Tests in `backend/tests/` (ignored in coverage)
- Setup file: `testConfig/singleton.ts`
- Test pattern: `*.test.ts` or `*.test.mts`
- Run: `npm run test:backend` or `cd backend && npm test`

### Frontend (Unit Tests)
- Vitest with jsdom environment
- Testing Library React for component tests
- Config in `frontend/vite.config.ts`
- Run: `cd frontend && npm test`

### E2E-Tests (Integration Tests)
- Playwright framework in `e2e-tests/` folder
- Config: `playwright.config.ts`
- Tests in: `e2e-tests/tests/`
- Setup script: `e2e-tests/scripts/seed-e2e-tests.ts`
- Run: `npm run e2e-tests` (starts DB + backend + frontend automatically)
- CI mode: `npm run e2e-tests:ci` (single worker, 1 retry)
- Reports: HTML report + JUnit XML (GitLab CI integration)

## Key Conventions

- Backend uses NodeNext modules, strict TypeScript
- Frontend uses `@/` alias for `src/` directory
- Shared Zod schemas in `shared/schemas/` used by both backend validation & frontend type safety
- CORS configured in `backend/src/configCors.ts`
- Prisma client must be regenerated after schema changes via `npm run prisma`
- Frontend port 3001, backend port 3000 (configurable via HTTP_PORT)
- Code quality: run `npm run check` in frontend before commit (Prettier + ESLint auto-fix)
- Prettier config: no semicolons, single quotes, trailing commas

### Pre-Commit Quality Gates

**Pipeline requirement (GitLab CI enforces):**
- E2E tests must pass: `npm run e2e-tests:ci`
- This is the only automated gate in pipeline (`e2e-tests` stage)
- Test setup: DB provisioning, backend/frontend servers, Playwright tests
- Reports: HTML + JUnit XML artifacts

**Local quality checks (recommended before push, not enforced):**
- Frontend code quality: `cd frontend && npm run check:staged` (format + lint only staged files)
  - ⚠️ **IMPORTANT:** Use `check:staged` NOT `check` to avoid formatting all files
  - `npm run check` formats ALL files = massive unintended changes in MRs
  - `npm run check:staged` formats ONLY staged files = clean commits
- Backend unit tests: `cd backend && npm test` (optional - currently not in pipeline)
- Frontend unit tests: `cd frontend && npm test` (optional - currently not in pipeline)
- Combined: `npm test` runs both unit test suites locally

## Claude Code Workflow

### Plan Mode (before implementation)
- Use Plan Mode for complex features, bug fixes with unclear root cause, or architectural decisions
- Phases: (1) Explore existing code, (2) Design solution, (3) Review critical files, (4) Finalize plan
- Always exit plan mode with `ExitPlanMode` to get user approval before implementation

### Implementation Mode (after approval)
- Create branch: `git checkout -b mk11/feat/[feature-name]` (or mk11/fix/, mk11/ref/, mk11/chore/)
- Implement changes according to approved plan
- Manual testing required before commit: `npm run vetilib`
- Commit with clear message: `feat: description` or `fix: description`

### Best Practices for Prompts
- **Include context:** Mention existing files, similar features, test data (accounts, IDs)
- **Be specific:** Clear problem description + expected behavior + reproduction steps
- **Provide test cases:** Account email, animal type, service type, location for testing
- **Define scope:** Backend only? Frontend only? Both? Testing needed?
