# i18n Context Contract

Create `AsyncLocalStorage<RequestContext>` in `src/singletons/asyncLocalStorage`. The request context exposes `lng` and `t`. The provider wraps `asyncLocalStorage.run(context, callback)` and throws a clear error when `get()` is used outside request context.

Initialize i18next with resource exports from `src/i18n/translations`, `fallbackLng: 'en'`, and disabled interpolation escaping. The middleware derives the base language from `Accept-Language`; choose `en` when it is unsupported. Call `i18next.getFixedT(lng)` to populate the request context.

Keep each locale's namespaces aligned. Test a route that reaches a translation helper with `Accept-Language: es` and one unsupported header that falls back to English.
