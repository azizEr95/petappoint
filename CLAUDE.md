# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Veterinary library management system with 3 main components:
- **backend/**: Node.js/Express/TypeScript API with Prisma ORM
- **frontend/**: React/TypeScript SPA using TanStack Router & Query, Vite, Tailwind CSS
- **db/**: PostgreSQL database with init scripts

## Development Commands

### Backend (from `backend/`)
- `npm start` - dev server w/ nodemon, hot reload on port 3000 (or HTTP_PORT env var)
- `npm run build` - compile TypeScript to `dist/`
- `npm test` - run Jest tests with `--runInBand`
- `npm run prisma` - pull DB schema and generate Prisma client to `generated/prisma/`

### Frontend (from `frontend/`)
- `npm run dev` - Vite dev server on port 3001
- `npm run build` - prod build + TypeScript compile
- `npm run serve` - preview prod build
- `npm test` - run Vitest tests
- `npm run check` - format with Prettier + lint with ESLint (auto-fix)

### Database
- `docker-compose up` - starts PostgreSQL on port 5432
  - DB: `vetlib-db`, User: `vetlib`, Password: `123`
- Schema in `db/init.sql`, test data in `db/testdaten.sql`

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
- Config in `frontend/config/config` (e.g., BACKEND_URL)

### Database Schema
Prisma schema in `backend/prisma/schema.prisma` (reverse-engineered from DB):
- Main entities: persons, veterinaries, veterinarypractices, animals, appointments, invoices, reviews
- Junction tables use `_has_` naming (e.g., `person_has_animal`, `veterinary_has_specialization`)
- Enums: sexes, husbandarysystem, paymentstatus
- Generated client output: `backend/generated/prisma/`

## Testing

### Backend
- Jest config in `backend/jest.config.js`
- Uses ts-jest preset, node environment
- Tests in `backend/tests/` (ignored in coverage)
- Setup file: `testConfig/singleton.ts`
- Test pattern: `*.test.ts` or `*.test.mts`

### Frontend
- Vitest with jsdom environment
- Testing Library React for component tests
- Config in `frontend/vite.config.ts`

## Key Conventions

- Backend uses NodeNext modules, strict TypeScript
- Frontend uses `@/` alias for `src/` directory
- CORS configured in `backend/src/configCors.ts`
- Prisma client must be regenerated after schema changes via `npm run prisma`
- Frontend port 3001, backend port 3000 (configurable via HTTP_PORT)
