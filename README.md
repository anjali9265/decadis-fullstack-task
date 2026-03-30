# Project Overview

A full stack application with a Vite React frontend and an Express backend using Prisma with SQLite. The project is dockerized — use Docker Compose to run the app. The backend includes a graceful shutdown that closes the HTTP server and disconnects Prisma to avoid SQLite file locks.

---

## Prerequisites

- Node.js v18 or later (required for running tests locally)
- npm (used throughout for package scripts)
- Docker and Docker Compose for running the application stack

---

## Environment Variables

### Example files included

- `backend/.env.example`
- `backend/.env.test.example`
- `frontend/.env.example`

### Create real env files from examples

```bash
cp backend/.env.example backend/.env
cp backend/.env.test.example backend/.env.test
cp frontend/.env.example frontend/.env
```

### Example contents

`backend/.env.example`

```env
DATABASE_URL="file:./dev.db"
```

`backend/.env.test.example`

```env
DATABASE_URL="file:./test.db"
```

`frontend/.env.example`

```env
VITE_API_URL=http://localhost:3001
```

### Security

Do not commit real `.env` files. Ensure these lines exist in `.gitignore`:

```gitignore
backend/.env
backend/.env.test
frontend/.env
```

---

## Docker Development

Use Docker Compose to build and run both services together.

### Start services

```bash
# from repository root
docker compose up --build
```

### Stop services

```bash
docker compose down
```

### Notes

- The backend API is exposed on the port mapped in `docker-compose.yml` (commonly `3001`).
- The frontend reads `VITE_API_URL` to locate the backend. When running via Docker Compose, the compose network and service names are used; the example `VITE_API_URL` points to `http://localhost:3001` for local development.
- The backend performs graceful shutdown and calls `prisma.$disconnect()` on termination so SQLite file locks are released.

---

## Tests

You can run tests locally using `npm`. The project distinguishes unit tests and integration tests for both frontend and backend.

### Frontend

Unit tests:

```bash
cd frontend
npm run test
```

Integration tests:

```bash
cd frontend
npm run test:integration
```

### Backend

Unit tests:

```bash
cd backend
npm run test:unit
```

Integration tests:

```bash
cd backend
npm run test:integration
```

### Test environment notes

- Ensure `backend/.env.test` exists.
- Tests that use Prisma/SQLite should call `prisma.$disconnect()` in teardown to release the DB file.
