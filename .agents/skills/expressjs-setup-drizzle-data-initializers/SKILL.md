---
name: expressjs-setup-drizzle-data-initializers
description: Add repository-style ordered and idempotent data initialization to a Drizzle/PostgreSQL Express API. Use when adding seed tracking, per-entity initializer functions, initialization/reset CLI scripts, or safe development/test database bootstrap workflows.
---

# Set Up Drizzle Data Initializers

Build seed workflows that are ordered, repeatable, and explicit about destructive operations.

## Workflow

1. Read [references/initializer-contract.md](references/initializer-contract.md) and confirm `$expressjs-setup-drizzle-postgres` exists.
2. Add the data-initializer tracking schema and a migration only after the user authorizes the database change.
3. Add one initializer module per dataset and aggregate them in dependency order in `src/db/data-initializers/index.ts`.
4. Reuse insert/select helpers so each initializer records completion and can skip already-applied work. Use `$expressjs-add-data-initializer` for one domain initializer.
5. Add `src/db/initializeData.ts` and the `db-initialize` script. Ensure connection cleanup on success and failure.
6. Add `db-reset` only when explicitly requested. It must prompt for `development` or `test`, set `NODE_ENV` before importing config, and list exact truncated tables.
7. Test idempotence against an isolated test database only when one is explicitly supplied. Never run initialization or reset against an unspecified database.

## Rules

- Order parent data before child data to satisfy foreign keys.
- Do not seed production by default.
- Treat reset as destructive: require explicit confirmation and keep it interactive.
