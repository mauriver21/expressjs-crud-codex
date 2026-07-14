# Authentication Contract

Use `bcrypt.hash(password, 10)` before persistence and `bcrypt.compare` during login. Sanitize users by removing `password` before every response. Sign a JWT with the sanitized user's `id`, `email`, and, when present, `roleId`; use `config.jwtSecretKey` and `config.jwtExpiresIn`.

The middleware reads `Authorization: Bearer <token>`, returns 401 if absent/malformed, returns 403 if verification fails, and calls `next()` only after `jwt.verify` succeeds. Mount it once with `privateRouter.use(authMiddleware)`.

The login controller validates a Yup `{ email, password }` body, calls the repository, and returns `{ token, user }` with 200. Translate invalid login into 401 without exposing whether an email exists.
