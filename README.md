# Express.js CRUD Codex Prototype

A pnpm monorepo that demonstrates a TypeScript Express.js API and the Codex skills used to build and extend it. The API is deliberately small: it provides JWT authentication, a protected `users` CRUD resource, Drizzle/PostgreSQL migrations, and an idempotent default-admin initializer.

This is a prototype and convention reference, not a production-ready starter.

## Project layout

```text
.
├── .agents/skills/                 # Reusable Codex skills for this API style
└── packages/api/api-service/       # Demo Express.js service
```

The service uses Express 4, strict TypeScript/CommonJS, PostgreSQL with Drizzle ORM, Yup, Vitest/Supertest, bcrypt, and JWT.

## Run the demo

Requirements: Node.js and pnpm 10, plus a PostgreSQL database.

```bash
pnpm install
cp packages/api/api-service/.env.example packages/api/api-service/.env.dev
```

Update `.env.dev` with local database credentials, then generate and apply migrations:

```bash
pnpm --filter api-service db-generate
pnpm --filter api-service db-migrate
pnpm --filter api-service db-initialize
pnpm dev
```

The service starts on the configured port (default `3000`). Its public endpoints are:

```text
GET  /api/health
POST /api/login
```

`/api/users` is protected by a bearer token returned from `/api/login`.

To create the default admin, set `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` in `.env.dev` before running `db-initialize`. The initializer is safe to run repeatedly.

## Tests

Create an isolated test configuration from `packages/api/api-service/.env.test.example`. Use a database whose name ends in `_test`; never point test configuration at development or production data.

```bash
cp packages/api/api-service/.env.test.example packages/api/api-service/.env.test
pnpm test
```

When the service has a `drizzle/` migration directory, Vitest global setup automatically applies those migrations to the test database before the suite. Resource tests use Supertest against the exported Express app.

## Codex skill suite

The repository-local skills live in `.agents/skills/` and encode the same architecture rather than copying domain code:

- `expressjs-scaffold-app` — create a single-repo or pnpm-monorepo API baseline.
- `expressjs-setup-drizzle-postgres` — add or repair Drizzle/PostgreSQL wiring.
- `expressjs-add-api-resource` — generate a complete CRUD or lookup resource.
- `expressjs-setup-jwt-auth` — add login, password hashing, JWT middleware, and protected routes.
- `expressjs-setup-i18n-context` — add request-scoped i18n support.
- `expressjs-setup-drizzle-data-initializers` — set up ordered, idempotent initialization.
- `expressjs-add-data-initializer` — add one initializer, such as a default admin or lookup seed.
- `expressjs-review-api-conventions` — audit an API against these conventions.

Invoke a skill in Codex by name, for example:

```text
$expressjs-add-api-resource Product, {id: uuid, name: string, price: decimal, createdAt, updatedAt, deletedAt}
```

## Architecture conventions

Each API feature follows this flow:

```text
route → middleware → controller → repository → model → Drizzle/PostgreSQL
```

Features use `@/` imports, factory modules, plural lowercase routes, Yup request validation, zero-based pagination, soft deletion, and colocated integration tests. Public routes and authenticated routes are split, with authorization applied once to the private router.
