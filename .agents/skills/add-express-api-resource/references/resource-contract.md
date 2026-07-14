# Resource Contract

## Full CRUD

Create `POST /<plural>`, `GET /<plural>`, `GET /<plural>/:id`, `PUT /<plural>/:id`, and `DELETE /<plural>/:id`. Bind visibility per operation: route reads can be public while writes use the private router.

The model returns records or `undefined`; it computes `offset = page * pageSize`, counts matching non-deleted rows, and returns `data` plus `{ totalPages, size, page, totalElements }`. Update must set `updatedAt`; delete must set `deletedAt` and list must filter `isNull(deletedAt)`.

The repository owns missing-row checks and contextual errors. The controller owns typed `Request` inputs, conversion of query pagination strings, response status, and JSON serialization.

## Lookup profile

Create only `GET /<plural>` by default. Omit mutation DTOs, validators, soft deletion, and write operations. Order results by a stable human-facing field when one exists, as countries are ordered by `name`.

## Schema conventions

Use camelCase TypeScript properties and snake_case SQL columns. Use `uuid('id').primaryKey().defaultRandom()` and timestamp columns named `created_at`, `updated_at`, and, for CRUD, `deleted_at`. Add foreign keys with `.references` and test them through valid fixtures.

## Test contract

Use Supertest against exported `app`; never call `startServer` in tests. Generate unique fixture values, authenticate private operations, and remove test rows in `afterAll`. Cover successful writes/reads, validation failure, pagination, update, and soft delete for CRUD; cover list and pagination for lookup resources.
