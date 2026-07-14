# Database Layout

Use PostgreSQL with `pg` and Drizzle's `node-postgres` adapter.

## Required configuration

Expose `config.db` with `database`, `host`, `password`, `port`, and `user`. Load the environment file before constructing the client. Use `DB_DIALECT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`; default the dialect to `postgresql`.

## Required modules

- `src/singletons/pgClient/index.ts`: construct and export one `Client` from `config.db`.
- `src/utils/createDbClient/index.ts`: return `connect` and `disconnect` helpers around that client.
- `src/db/index.ts`: export `dbClient = createDbClient(pgClient)` and `db = drizzle(pgClient)`.
- `drizzle.config.ts`: import config, use `schema: './src/db/schema/*'`, `out: './drizzle'`, dialect `postgresql`, and the configured database URL.
- `src/db/migrate.ts`: connect, call Drizzle `migrate` with `./drizzle`, disconnect in both success and failure paths.

## Package scripts

Keep `db-generate` for `drizzle-kit generate` and `db-migrate` for `tsx src/db/migrate.ts`. Add initialization/reset scripts only through `$expressjs-setup-drizzle-data-initializers`.

## Verification

Run the compiler and inspect that no schema or migration was created. Database connection, generation, and migration execution change external state and require explicit authorization.
