---
name: review-express-api-conventions
description: Review a TypeScript Express API against the portal-cms api-service conventions. Use when auditing a service or feature for factory layers, aliases, routing, validation, pagination, soft deletion, database lifecycle, authorization, and Vitest/Supertest integration-test coverage; operate read-only unless the user explicitly asks for fixes.
---

# Review Express API Conventions

Inspect first and report evidence, severity, and the smallest safe correction. Do not edit files unless explicitly asked.

## Workflow

1. Run `scripts/audit.py <project-root>` for structural signals.
2. Read [references/review-checklist.md](references/review-checklist.md).
3. Inspect representative route, controller, repository, model, schema, and test files for each reviewed resource.
4. Report findings grouped as blocking, inconsistency, or improvement. Cite exact files and explain the observed impact.
5. State checks that could not be confirmed instead of inferring compliance.

## Boundaries

- Do not run migrations, reset databases, alter configuration, or apply fixes in a review-only request.
- Treat intentional deviations as acceptable when the repository documents them.
