# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Journey to Recovery is a stroke rehabilitation web application featuring SMART goal setting, daily wellness tracking, a multi-dimensional wellness wheel assessment, and an AI-powered chatbot (RehabLeo) using Google Gemini.

## Commands

```bash
# Install all dependencies (root + workspaces)
bun install

# Run both client and server concurrently (from root)
bun run dev

# Client only
cd packages/client && bun run dev      # Vite dev server (port 5173)
cd packages/client && bun run build    # TypeScript check + Vite production build
cd packages/client && bun run lint     # ESLint

# Server only
cd packages/server && bun run dev      # Express with --watch auto-reload (port 3000)
cd packages/server && bun run start    # Production server
```

No test framework is configured.

## Architecture

**Monorepo** using Bun workspaces with two packages:

```
packages/
  client/   → React 19 + Vite + TypeScript frontend
  server/   → Express 5 + Bun + TypeScript backend
```

The root `index.ts` uses `concurrently` to launch both packages in parallel during development.

### Client (`packages/client`)

- **Routing:** React Router DOM in `src/shared/routing/routes.tsx`. Authenticated pages are wrapped by `PrivateRoutes.tsx`.
- **Auth state:** React Context in `src/shared/contexts/`. JWT access token stored in localStorage; refresh token in httpOnly cookie.
- **API layer:** Axios instance configured in `src/shared/utilities/axiosConfig.ts` with interceptors for automatic token refresh. Base URL toggles between localhost and Railway production URL.
- **UI components:** Radix UI primitives in `src/components/ui/`, styled with Tailwind CSS 4 and CVA.
- **Path alias:** `@/*` maps to `src/*` (configured in vite.config.ts and tsconfig).
- **Pages:** `src/components/` contains 40+ page components organized by feature (goal-setting workflow, wellness assessment, check-ins, chatbot, auth).

### Server (`packages/server`)

- **Entry:** `index.ts` creates an Express app. All API routes are mounted under `/api` from a single file `routes/userRoutes.ts`.
- **Database:** MySQL via `mysql2/promise` connection pool in `db/connection.ts`. Raw SQL queries (no ORM). Production connects to Railway MySQL using environment variables.
- **Auth middleware:** `middleware/auth.ts` validates JWT from Authorization header and checks a token blacklist table.
- **Validation:** Zod schemas with a `validateBody` middleware for request validation.
- **AI integration:** Google GenAI (Gemini 2.5 Flash) for the chatbot. System prompt and configuration in `utilities/prompt.config.ts`. Includes SMART goal structuring and risk assessment logic.
- **Local DB config:** `config/db.config.ts` reads from `.env` (HOST, USER, PASSWORD, DB_NAME). Production uses Railway MySQL env vars (MYSQLUSER, MYSQL_ROOT_PASSWORD, RAILWAY_TCP_PROXY_DOMAIN, etc.).

### Data Flow

```
Client (React) ←→ Axios ←→ Express API (/api/*) ←→ MySQL
                                  ↕
                           Google Gemini AI
```

### Authentication Flow

JWT access tokens (1d expiry) + refresh tokens (7d expiry, one-time use). Logout blacklists the access token. The client's Axios interceptor automatically calls `/api/refresh-token` on 401/403 responses.

## Environment Variables

**Server** requires a `.env` file in `packages/server/`:
- `HOST`, `USER`, `PASSWORD`, `DB_NAME` — local MySQL connection
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — JWT signing keys
- `GEMINI_API_KEY` — Google GenAI API key
- `NODE_ENV` — `development` or `production`
- Railway MySQL vars for production: `MYSQLUSER`, `MYSQL_ROOT_PASSWORD`, `RAILWAY_TCP_PROXY_DOMAIN`, `RAILWAY_TCP_PROXY_PORT`, `MYSQL_DATABASE`

## Deployment

- **Frontend:** Netlify
- **Backend + Database:** Railway (Express server + MySQL)

## Key Conventions

- Zod is used for validation on both client (form schemas) and server (request body validation).
- All API endpoints are in a single router file (`routes/userRoutes.ts`).
- The client uses React Hook Form + Zod resolvers for form handling.
- CORS is configured in `packages/server/index.ts` with the production Netlify URL. When developing locally, toggle the commented `origin` line to `http://localhost:5173`.
- The Axios base URL in `packages/client/src/shared/utilities/axiosConfig.ts` must also be toggled between localhost and the production Railway URL.
