---
name: expressjs-setup-drizzle-postgres
description: Configure or repair the repository-style PostgreSQL and Drizzle ORM infrastructure in an existing TypeScript Express API. Use when adding database environment configuration, pg Client singletons, Drizzle clients/configuration, migration commands, or a schema directory without creating domain tables or executing migrations.
---

# Set Up Drizzle PostgreSQL

Inspect the target first. Preserve compatible infrastructure and add only missing pieces.

## Workflow

1. Run `scripts/check_prerequisites.py <project-root>` and inspect the reported gaps.
2. Read [references/database-layout.md](references/database-layout.md).
3. Confirm the target uses TypeScript CommonJS and the `@/` aliases, or stop and explain the incompatibility.
4. Add `pg`, `drizzle-orm`, `drizzle-kit`, and their type packages only when missing; use the target package manager.
5. Add environment variables, `src/config`, `src/singletons/pgClient`, `src/utils/createDbClient`, `src/db/index.ts`, `drizzle.config.ts`, and migration scripts without overwriting compatible exports.
6. Create `src/db/schema/` only; leave domain tables and migrations to `$expressjs-add-api-resource`.
7. Compile TypeScript. Do not connect to a database, generate migrations, or run migrations unless explicitly requested.

## Rules

- Export `pgClient`, `dbClient`, and `db` as named singletons.
- Resolve `.env.test`, `.env.dev`, and `.env.prod` from `NODE_ENV`.
- Keep connection values as split environment fields, not a committed connection string.
- Treat conflicting database clients, dialects, or module formats as a blocking compatibility issue; report them rather than replacing them.
