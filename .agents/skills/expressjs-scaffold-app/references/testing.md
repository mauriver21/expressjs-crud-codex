# Test Strategy

Use Vitest with the exported Express `app` and Supertest. Do not call `startServer` from tests.

## Global setup

`src/tests/globalSetup.ts` runs before the suite. A fresh scaffold has no `drizzle/` directory, so the health test runs without a database. Once a migration exists, it automatically connects to the isolated test database, applies `./drizzle`, and disconnects. Configure the dedicated test database before running those tests.

When `$expressjs-setup-drizzle-data-initializers` is installed, extend the global setup to run the ordered `initializers` array after migration. When `$expressjs-setup-jwt-auth` is installed, create or obtain a seeded authorization token there and set `TEST_AUTHORIZATION_HEADER` for `testsContext`.

## Resource tests

Colocate each integration test with its controller. Give fixtures a unique prefix, open a database connection in `beforeAll`, delete only those prefixed rows in `afterAll`, and disconnect. Keep test credentials in `.env.test`; that database must be distinct from development and production.
