---
name: scaffold-expressjs-app
description: Scaffold a TypeScript Express.js API that follows the portal-cms api-service conventions, including factory-based layers, path aliases, public/private routers, PostgreSQL with Drizzle ORM, Yup validation, environment configuration, and Vitest/Supertest integration tests. Use when creating a new Express API, bootstrapping an api-service package, or establishing the initial server and folder structure before adding domain features.
---

# Scaffold Express.js App

Create a runnable API baseline from the bundled template, then adapt it to the user's requested domain without carrying over portal-cms entities.

## Workflow

1. Inspect the destination and its package-manager/workspace conventions. Do not overwrite a non-empty directory.
2. Run:

   ```bash
   python3 <skill-directory>/scripts/scaffold.py <destination> --name <package-name>
   ```

3. Read [references/conventions.md](references/conventions.md) before adding domain features or changing the generated architecture.
4. Use `$setup-drizzle-postgres` to retrofit or repair database wiring in an existing service; the generated starter already includes it.
5. Use `$add-express-api-resource` for complete CRUD or lookup resources, `$setup-express-jwt-auth` for login/protected routes, `$setup-express-i18n-context` for request translations, and `$setup-drizzle-data-initializers` for seed workflows.
6. Replace the health example only when the user requests an initial domain feature.
7. Install dependencies with the repository's package manager only when the request authorizes setup. Preserve workspace ownership of lockfiles.
8. Copy `.env.example` to the environment-specific file expected by the target runtime and use safe local values; never invent production secrets.
9. Verify proportionally:
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

## Bundled Resources

- `scripts/scaffold.py`: Copy the starter safely and replace package-name tokens.
- `assets/template/`: Runnable, domain-neutral Express/TypeScript starter.
- `references/conventions.md`: Layer responsibilities, naming rules, request flow, and feature checklist.
