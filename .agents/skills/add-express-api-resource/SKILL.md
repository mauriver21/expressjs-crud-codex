---
name: add-express-api-resource
description: Add a complete repository-style Express API resource backed by Drizzle/PostgreSQL. Use when creating CRUD or read-only lookup endpoints and their interfaces, schema, model, repository, controller, Yup validators, public/private routes, migration, and Vitest/Supertest integration tests.
---

# Add Express API Resource

Build one complete vertical slice. Do not create isolated routes, models, or controllers.

## Inputs

Obtain or infer the singular and plural names, fields with database/validation constraints, profile (`crud` or `lookup`), and public/private operations. Run `scripts/validate_resource_spec.py` to normalize the names and reject invalid profiles before editing.

## Workflow

1. Confirm `$setup-drizzle-postgres` prerequisites exist. Read [references/resource-contract.md](references/resource-contract.md).
2. Inspect routes, existing schemas, and migrations for naming collisions. Stop on a conflict; do not overwrite an entity.
3. Add one interface per PascalCase file, including create/update/read/list shapes and shared `IdParams`/pagination shapes when absent.
4. Add a Drizzle table in `src/db/schema/<plural>.ts`, with UUID ID and timestamps. For CRUD, include `deletedAt` and implement soft deletion.
5. Add `create<Entity>Model`, `create<Entity>Repository`, and `create<Entity>Controller` factories. Keep persistence in the model and HTTP concerns in the controller.
6. For CRUD, add Yup create/update schemas and attach `validateBodyMiddleware` at write routes. Lookup resources omit write validators and methods.
7. Register plural lowercase routes under `/api`; mount each operation on the requested public or private router.
8. Add colocated Supertest integration tests for every requested operation, including invalid input and cleanup of unique test records.
9. Compile TypeScript, then generate and inspect the Drizzle migration only when the user authorizes the database change.

## Invariants

- Use factory directory names such as `createProductModel` and named exports from `index.ts`.
- Use `@/` imports, zero-based `page`/`pageSize`, and `{ data, pagination }` list responses.
- Return `201` for create; return `200` for read, list, update, and soft delete; return `{ errors }` with `400` for validation failure.
- Check a missing database row in the repository and add contextual errors there.
