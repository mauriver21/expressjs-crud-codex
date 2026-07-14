---
name: expressjs-setup-jwt-auth
description: Add the repository-style JWT authentication workflow to a TypeScript Express API. Use when implementing user login, bcrypt password hashing, signed JWT responses, authorization middleware, protected routes, sanitized user output, and authentication integration tests.
---

# Set Up Express JWT Auth

Add authentication as a complete user-boundary workflow. Inspect existing identity tables and routes before changing anything.

## Workflow

1. Read [references/auth-contract.md](references/auth-contract.md) and confirm `$expressjs-setup-drizzle-postgres` is complete.
2. Reuse a compatible user table (`email`, hashed `password`, stable ID); otherwise explain the required schema change and wait for authorization to create it.
3. Add `bcrypt`, `jsonwebtoken`, and TypeScript types only if absent. Add `JWT_SECRET_KEY` and an expiry setting to configuration.
4. Add login DTO/schema, user repository methods for hashing, credential verification, and sanitized responses, then expose `POST /login` on the public router.
5. Add `authMiddleware` and attach it once to the private router before private route registration.
6. Add integration tests for valid login, invalid credentials, missing bearer token, invalid token, and a protected route.
7. Compile and run relevant tests. Never generate a production secret; use an explicit local test value only in test fixtures.

## Rules

- Never return password hashes from create, read, list, update, or login responses.
- Return `401` for missing/malformed credentials and `403` for invalid JWTs.
- Keep password hashing and JWT creation in the repository; keep request/response code in controllers.
