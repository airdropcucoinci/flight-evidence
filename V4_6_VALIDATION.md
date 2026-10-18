# Flight Evidence v4.6 — Parser Integrity

- CSV duplicate column names are rejected instead of silently overwriting values.
- CSV and JSON inputs are capped at 5000 rows directly in the parser.
- Existing HTTP error message contract is preserved (`Maximum 5000`).
- Verified locally on 2026-10-15: `npm run build` PASS; `node --test tests/*.test.mjs` 114/114 PASS.
- Not verified: Vitest, real browser, TestSprite, GitHub CI or deployment.
