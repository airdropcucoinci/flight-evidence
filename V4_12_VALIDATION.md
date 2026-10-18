# v4.12 API contract and error handling

- Internal server exceptions no longer expose error messages to API clients; details are logged server-side.
- Four HTTP contract tests added: health security/cache headers, sample listing, malformed payloads, static response security headers.
- Tests are local Node HTTP tests, not browser E2E or TestSprite.
