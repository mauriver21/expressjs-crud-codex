---
name: expressjs-add-data-initializer
description: Add one idempotent, ordered data initializer to a repository-style Express.js API using Drizzle/PostgreSQL. Use when seeding lookup data, default roles, bootstrap users, or external catalog data through `src/db/data-initializers`, the `data_initializers` tracking table, and the initialization runner.
---

# Add Data Initializer

Create one named initializer that can run repeatedly without duplicating data and is registered after every foreign-key dependency.

## Workflow

1. Run `scripts/validate_initializer_spec.py --name <initializeName> [--depends-on <initializer> ...]`.
2. Read [references/initializer-pattern.md](references/initializer-pattern.md).
3. Confirm `data_initializers`, `selectDataInitializer`, `insertDataInitializer`, `src/db/data-initializers/index.ts`, and `src/db/initializeData.ts` exist. Use `$expressjs-setup-drizzle-data-initializers` when they do not.
4. Inspect the target table, its uniqueness key, existing initializer names, and the initializer registry. Stop on a name collision.
5. Add `src/db/data-initializers/<initializeName>.ts`. Check the tracking record first; return if it exists.
6. Query existing target rows and normalize a stable business key before preparing inserts. For large input, insert in bounded batches.
7. Insert tracking data only after the initializer has completed successfully. Do not mark skipped work as complete when a missing dependency or unavailable source prevents completion.
8. Import and register the initializer after all of its dependencies in `data-initializers/index.ts`.
9. Add focused tests or a test-database verification when an isolated database is available. Do not run initializers, reset databases, or create migrations unless explicitly requested.

## Rules

- Use a stable `INITIALIZER_NAME` matching the exported function, such as `initializeRoles`.
- Keep seed data domain-specific to the target project; never copy CMS records blindly.
- Preserve the registry's foreign-key order: parents before children.
- Make reruns safe both through the tracking table and through duplicate detection based on the target table's business key.
- Log start, already-complete, no-op, batch, and completion states with the `[db]` prefix.
