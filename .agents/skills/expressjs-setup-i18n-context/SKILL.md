---
name: expressjs-setup-i18n-context
description: Add repository-style request-scoped i18next translation support to a TypeScript Express API. Use when introducing AsyncLocalStorage request context, language middleware, translations, localized error helpers, and integration tests for API localization.
---

# Set Up Express i18n Context

Use request-scoped context so repository and utility code can translate without passing language through every call.

## Workflow

1. Read [references/i18n-contract.md](references/i18n-contract.md).
2. Add `i18next` if missing. Add `RequestContext` and `RequestContextProvider` interfaces, the `asyncLocalStorage` singleton, and `createRequestContextProvider`.
3. Configure i18next resources with `en`, `es`, `fr`, and `it`; begin with only the namespaces/messages required by current callers.
4. Add `i18nMiddleware` before JSON parsing and routes. Read `Accept-Language`, choose a supported base language, and fall back to `en`.
5. Add a `t` utility that reads the current context. Convert repository error text only where translation keys exist; do not bulk-rewrite unrelated messages.
6. Add integration tests for a supported language and fallback behavior. Compile and run them.

## Rules

- Keep i18next initialization in `src/i18n/index.ts`; import it for startup side effects from the app singleton.
- Never let malformed or unsupported language headers crash a request.
- Keep translation keys stable and namespace them by concern such as `errors:repository.user.notRegistered`.
