# Flight Evidence v4.27

- Malformed HTTP request-target URLs now return HTTP 400 with a generic error instead of HTTP 500.
- Regression test checks the 400 response and verifies the server remains available afterward.
- Node.js test suite and TypeScript typecheck were executed locally; see release summary.
- Browser, Vitest, GitHub CI and TestSprite PR checks remain unverified.
