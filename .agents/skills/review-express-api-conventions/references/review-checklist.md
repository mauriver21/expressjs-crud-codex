# Review Checklist

- Confirm `src/index.ts` calls `startServer`, while `app` remains exportable for Supertest.
- Confirm public and private routers are mounted under `/api` and authentication is applied once to the private router.
- Confirm controller, repository, and model factories exist for mutable resources and follow the route-to-model boundary.
- Confirm internal imports use registered `@/` aliases in both TypeScript and Vitest configuration.
- Confirm writes have Yup validation, create returns 201, and validation returns `{ errors }` with 400.
- Confirm CRUD list routes use zero-based `page`/`pageSize` and standardized pagination output.
- Confirm CRUD soft deletes records and excludes deleted records from lists.
- Confirm models own Drizzle queries and repositories own missing-row/contextual error logic.
- Confirm PostgreSQL connects before production listen and tests exercise exported app without listening.
- Confirm integration tests use unique data and clean it up.
