# Environment Contract

The application resolves `.env.dev` for development and `.env.test` when `NODE_ENV=test`. Keep both files out of version control; commit only the example files.

## `.env.test`

Define every variable in `.env.test.example`:

- `ALLOWED_ORIGINS`: Test client origin; normally `http://localhost:3000`.
- `PORT`: HTTP port when the service is started manually; Supertest does not use it.
- `JWT_SECRET_KEY`: A non-production secret used only by tests.
- `DB_DIALECT`: `postgresql`.
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`: Credentials for the local or CI test database.
- `DB_NAME`: A dedicated test database ending in `_test`, never the development or production database.

Before database integration tests, create the test database, set its credentials locally or in CI secrets, and run migrations with `NODE_ENV=test`. Do not put real passwords in either example file.
