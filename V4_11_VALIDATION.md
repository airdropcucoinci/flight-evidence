# Flight Evidence v4.11 — numeric input hardening

- Previous version: v4.10.
- The parser previously used JavaScript `Number(value)` on string fields, accepting hex (`0x10`), binary (`0b11`) and octal (`0o12`) numeric representations in telemetry. These are not part of the documented decimal CSV/JSON numeric input convention.
- String numeric fields now require decimal or scientific notation. Native JSON numbers remain accepted. Invalid numeric tokens produce a field-specific error.
- Added three Node.js regression tests for rejected numeric representations and valid decimal/scientific notation.
- Verified: `npm run build` PASS; `node --test tests/*.test.mjs` 126/126 PASS.
- Not verified: Vitest, real-browser interaction, GitHub Actions, TestSprite, deployment.
