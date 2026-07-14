# API Service Conventions

## Architecture

Use this request flow for domain features:

`route -> middleware -> controller -> repository -> model -> Drizzle/PostgreSQL`

- `routes`: Instantiate controller factories and map HTTP verbs and paths. Keep separate `publicRouter` and `privateRouter`; attach authentication to `privateRouter` once.
- `controllers/create<Entity>Controller/index.ts`: Parse typed Express inputs, choose status codes, call the repository, and serialize responses. Return methods such as `create`, `read`, `update`, `delete`, and `list` from a factory.
- `repositories/create<Entity>Repository/index.ts`: Wrap the model, enforce not-found behavior, translate persistence failures into contextual errors, and expose domain-facing return types.
- `models/create<Entity>Model/index.ts`: Contain Drizzle queries only. Return records or `undefined`; implement pagination and soft deletion here.
- `db/schema/<entities>.ts`: Define PostgreSQL tables with camel-case property names and snake-case column names.
- `interfaces`: Keep one exported type or interface per PascalCase file, including operation-specific shapes such as `ProductCreate`, `ProductUpdate`, and `ProductList`.
- `validators/<entity>Schema/index.ts`: Export Yup create/update schemas. Use `validateBodyMiddleware` at the route boundary.
- `controllers/create<Entity>Controller/index.test.ts`: Colocate Supertest integration tests with the controller.

## Naming and Layout

- Use camel-case factory directories: `createProductController`, `createProductRepository`, `createProductModel`.
- Export named factories: `createProductController`, never default exports.
- Use `index.ts` as each module entry point.
- Import internal code through `@/` aliases; update both `tsconfig.json` and `vitest.config.ts` when adding a new top-level alias.
- Keep route paths plural and lowercase, for example `/products` and `/products/:id`.
- Use `delete` as the public method key even when the local function is named `logicalDelete`.

## CRUD Behavior

- Create: return `201` and the created row.
- Read, update, soft delete, and list: return `200`.
- Validation failures: return `400` with `{ errors: string[] }`.
- List: accept `page` and `pageSize`, default to `0` and `10`, and return:

  ```ts
  {
    data,
    pagination: { totalPages, size: pageSize, page, totalElements },
  }
  ```

- Soft delete: set `deletedAt`; exclude deleted rows from list queries with `isNull(table.deletedAt)`.
- Update: set `updatedAt` explicitly.

## Startup and Configuration

- Keep `src/index.ts` minimal: call `startServer()` and terminate on bootstrap failure.
- Export `app` separately from `startServer` so Supertest can exercise it without listening on a port.
- Connect the PostgreSQL client before listening.
- Resolve `.env.test`, `.env.dev`, or `.env.prod` from `NODE_ENV`.
- Keep database variables split into host, port, user, password, and database fields to match the source repository.

## Feature Checklist

For each initial CRUD entity:

1. Add operation-specific interfaces and list pagination types.
2. Add a Drizzle table with UUID ID and created, updated, and deleted timestamps.
3. Add model, repository, controller, and Yup validators.
4. Register public/private routes according to authorization requirements.
5. Generate and inspect the Drizzle migration.
6. Add integration tests for valid create, invalid create, list, read, update, and soft delete.
7. Ensure tests use unique data and clean it in `afterAll`.
