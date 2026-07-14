---
name: expressjs-scaffold-app
description: Scaffold a pnpm-managed TypeScript Express.js API that follows the portal-cms api-service conventions, including factory-based layers, path aliases, public/private routers, PostgreSQL with Drizzle ORM and Drizzle Kit, Yup validation, environment configuration, and Vitest/Supertest integration tests. Use when creating a new single-repository Express API, a pnpm monorepo with an api-service package, or establishing the initial server and folder structure before adding domain features.
---

# Scaffold Express.js App

Create a runnable API baseline from the bundled template, then adapt it to the user's requested domain without carrying over portal-cms entities.

## Workflow

1. Ask whether the project is a **single repository** or a **pnpm monorepo** before choosing a destination. Do not infer this from the desired service path.
2. Inspect the selected destination. In single mode, require an empty destination. In monorepo mode, permit an existing repository root only when it has no `package.json`, pnpm workspace configuration, lockfile, or conflicting service directory; never replace existing workspace configuration.
3. Run one of the following:

   ```bash
   # Single repository: destination becomes the API root.
   python3 <skill-directory>/scripts/scaffold.py <destination> --name <package-name> --layout single

   # Monorepo: destination becomes the workspace root; API is packages/api/<package-name>.
   python3 <skill-directory>/scripts/scaffold.py <destination> --name <package-name> --layout monorepo
   ```

4. In monorepo mode, verify the root contains `package.json`, `pnpm-workspace.yaml`, and a root `packageManager`; keep service dependencies in `packages/api/<package-name>/package.json`.
5. Read [references/conventions.md](references/conventions.md) before adding domain features or changing the generated architecture.
6. Use `$expressjs-setup-drizzle-postgres` to retrofit or repair database wiring in an existing service; the generated starter already includes it.
7. Use `$expressjs-add-api-resource` for complete CRUD or lookup resources, `$expressjs-setup-jwt-auth` for login/protected routes, `$expressjs-setup-i18n-context` for request translations, and `$expressjs-setup-drizzle-data-initializers` for seed workflows.
8. Replace the health example only when the user requests an initial domain feature.
9. Install dependencies with pnpm only when the request authorizes setup. Run it at the single-repo root or monorepo workspace root, and preserve the resulting lockfile. The generated API package must retain `drizzle-kit` as a development dependency and the `db-generate` script.
10. Read [references/environment.md](references/environment.md). Create `.env.dev` from `.env.example` and `.env.test` from `.env.test.example`; use an isolated test database and a test-only JWT secret. Never reuse development or production database values for tests.
11. Read [references/testing.md](references/testing.md). The template's Vitest global setup automatically migrates the isolated test database when a `drizzle/` migration directory exists.
12. Verify proportionally:
   - Run TypeScript compilation.
   - Run the health integration test.
   - Run Drizzle generation only after adding a domain schema and with the user's intended database setup.

## Adaptation Rules

- Preserve strict TypeScript, CommonJS output, `@/` aliases, two-space formatting, semicolons, and single quotes.
- Export factory functions named `create<Entity><Layer>` from `index.ts` files inside matching camel-case directories.
- Keep HTTP concerns in controllers, persistence in models, domain-facing error translation in repositories, and request validation in middleware plus Yup schemas.
- Instantiate dependencies once at module scope unless isolation or dependency injection is explicitly required.
- Mount public and authenticated routers under `/api`; apply authentication once to the private router.
- Use soft deletion and zero-based pagination for conventional CRUD resources unless the user specifies otherwise.
- Prefer integration tests through Supertest against the exported Express `app`.
- Keep test-database migration/seeding in `src/tests/globalSetup.ts`, authorization state in `src/tests/testsContext.ts`, and per-resource cleanup beside the integration test.

## Bundled Resources

- `scripts/scaffold.py`: Copy the starter safely and replace package-name tokens.
- `scripts/scaffold.py --layout`: Choose `single` or `monorepo` and create the required pnpm root configuration.
- `assets/template/`: Runnable, domain-neutral Express/TypeScript starter.
- `assets/template/package.json`: Includes `drizzle-kit` and the `db-generate` command for local migration generation.
- `references/conventions.md`: Layer responsibilities, naming rules, request flow, and feature checklist.
- `references/environment.md`: Development and test environment-variable contract.
- `references/testing.md`: Vitest global setup, seeded-test-data, and cleanup strategy.
