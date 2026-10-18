# Flight Evidence v4.8 — CSV quoted-field validation

- CSV numeric fields enclosed in quotes are accepted.
- Unterminated quoted fields and characters following closing quotes are rejected.
- Existing BOM, duplicate-header, and 5,000-row checks remain.
- `npm run build`: PASS.
- `node --test tests/*.test.mjs`: 118/118 PASS.
- Not verified: Vitest, real browser, GitHub CI, TestSprite and live deployment.
- CSV with embedded newlines inside quoted fields is not supported in this minimal parser.
