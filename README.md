# VetLib

Veterinary library management system for managing veterinary practices, appointments, animals, and patient records.

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Jest

### Frontend
- React 19
- TypeScript
- TanStack Router + Query
- Vite
- Tailwind CSS + Bootstrap
- Vitest

### Database
- PostgreSQL
- Docker

## Quick Start

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- npm

### Installation

```bash
# Install all dependencies (root, backend, frontend)
npm run install-all
```

### Development

Start all services (database, backend, frontend):

```bash
npm run vetlib
```

This runs all services in Docker containers:
- PostgreSQL database on port 5432
- Backend API on port 3000
- Frontend dev server on port 3001

Or run services individually:

```bash
# Database only
docker-compose up

# Backend only (from backend/)
cd backend
npm start

# Frontend only (from frontend/)
cd frontend
npm run dev
```

## Available Scripts

### Root Level

- `npm run vetlib` - Start all services
- `npm run vetlib:detached` - Start services in background
- `npm run stop` - Stop all Docker containers
- `npm test` - Run all tests (backend + frontend)
- `npm run prisma` - Pull DB schema and generate Prisma client

### Backend (from `backend/`)

- `npm start` - Start dev server with hot reload
- `npm run build` - Compile TypeScript
- `npm test` - Run Jest tests
- `npm run prisma` - Sync Prisma schema with database

### Frontend (from `frontend/`)

- `npm run dev` - Start Vite dev server (port 3001)
- `npm run build` - Production build
- `npm test` - Run Vitest tests
- `npm run check` - Format & lint with auto-fix

## Project Structure

```
vetlib/
├── backend/           # Express API + Prisma
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── service/   # Business logic layer
│   │   └── ...
│   ├── prisma/        # Database schema
│   ├── tests/         # Jest tests
│   └── generated/     # Prisma client (auto-generated)
├── frontend/          # React SPA
│   ├── src/
│   │   ├── routes/    # TanStack Router pages
│   │   ├── api/       # API client
│   │   └── components/
│   └── ...
├── db/                # PostgreSQL setup
│   ├── init.sql       # Schema initialization
│   └── testdaten.sql  # Test data
├── shared/
│   └── schemas/      # Zod Schemas (needed in Backend and Frontend)
└── docker-compose.yml
```

## Database

Connection details (development):
- Host: `localhost:5432`
- Database: `vetlib-db`
- User: `vetlib`
- Password: `123`

After schema changes, regenerate Prisma client:

```bash
cd backend
npm run prisma
# or: npx prisma generate
```

## API Endpoints

Base URL: `http://localhost:3000/api`

### Veterinary Practices

_endpoints to be documented_

## Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

## Contributing

1. Create feature branch from `dev`: `<your-initials>/feat/feature-name` or `<your-initials>/fix/bug-name`
   - Example: `mk11/feat/user-authentication`, `jd/fix/login-bug`
2. Make changes and commit
3. Run tests: `npm test`
4. Push branch and create merge request to `dev`
5. Never commit directly to `dev` or `main`

## License

_To be added_
