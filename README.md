# InterviewPrep Platform

A LeetCode-style interview preparation platform focused on JavaScript, React, Node.js, and TypeScript — with sandboxed Docker code execution.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Sandboxed-2496ED?logo=docker&logoColor=white)

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js       │────▶│   Express API    │────▶│  Judge Worker   │
│   Frontend      │     │   (Clean Arch)   │     │  (Docker Exec)  │
│                 │     │                  │     │                 │
│ • Monaco Editor │     │ Domain Layer     │     │ • BullMQ        │
│ • TanStack Query│     │ Application Layer│     │ • Dockerode     │
│ • Zustand       │     │ Infrastructure   │     │ • Sandboxed     │
│ • shadcn/ui     │     │ Presentation     │     │   Execution     │
└─────────────────┘     └────────┬─────────┘     └────────┬────────┘
                                 │                         │
                        ┌────────▼─────────┐     ┌────────▼────────┐
                        │   PostgreSQL     │     │     Redis       │
                        │   (Supabase)     │     │   (BullMQ +     │
                        │                  │     │    Cache)       │
                        └──────────────────┘     └─────────────────┘
```

### Clean Architecture (Backend)

```
Presentation  →  Application  →  Domain  ←  Infrastructure
(Express)        (Use Cases)     (Ports)    (Prisma, Redis, JWT)
```

**Dependency Rule:** All dependencies point inward. Domain has zero framework imports.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query |
| Backend | Express 5, TypeScript, Prisma 6, PostgreSQL 16 |
| Auth | jose (JWT), argon2 (passwords), next-auth (OAuth) |
| Queue | BullMQ + Redis 7 |
| Execution | Docker (sandboxed containers via dockerode) |
| Testing | Vitest (unit/integration), Playwright (E2E) |
| CI/CD | GitHub Actions, Turborepo |
| Deployment | Vercel (frontend), VPS (backend + worker), Supabase (database) |

---

## Getting Started

### Prerequisites

- Node.js 22+
- Docker Desktop (for PostgreSQL, Redis, and code execution)
- npm 10+

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/interview-prep-platform.git
cd interview-prep-platform

# 2. Install dependencies
npm install

# 3. Start PostgreSQL and Redis
docker compose -f infrastructure/docker-compose.yml up -d

# 4. Setup environment variables
cp .env.example .env
# Edit .env with your values

# 5. Run database migration
npm run db:migrate

# 6. Seed the database
npm run db:seed

# 7. Start development servers
npm run dev
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start all services in development mode |
| `npm run build` | Build all packages |
| `npm run lint` | Run ESLint across all packages |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run unit and integration tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

---

## Project Structure

```
interview-prep-platform/
├── apps/
│   ├── frontend/          # Next.js (App Router)
│   ├── backend-api/       # Express (Clean Architecture)
│   └── judge-worker/      # Docker code execution service
├── packages/
│   ├── shared-types/      # Shared TypeScript types + Zod schemas
│   └── shared-utils/      # Shared utility functions
├── infrastructure/
│   └── docker-compose.yml # Local dev (PostgreSQL + Redis)
└── turbo.json             # Turborepo config
```

---

## API Documentation

Interactive API docs available at: `http://localhost:4000/api-docs` (when backend is running)

---

## License

MIT
