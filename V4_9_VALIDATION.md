# Flight Evidence v4.9 — CSV logical records

- Quoted fields spanning CRLF/LF physical lines are parsed as one logical record.
- Unterminated multiline quotes and nonnumeric multiline numeric fields are rejected.
- CSV row error messages refer to the starting physical line of the logical record.
- Verified locally: TypeScript build PASS; Node.js 121/121 PASS (118 existing + 3 new).
- Not verified: Vitest, browser E2E, GitHub CI, TestSprite, live deployment.
