# Flight Evidence v4.21 – JSON BOM compatibility

Change: JSON telemetry files beginning with a UTF-8 BOM are accepted, matching existing CSV BOM behavior. Invalid JSON still fails normally.

Verified in this environment (2026-10-17): `tsc -p tsconfig.browser.json` PASS; `node --test tests/*.test.mjs` 138/138 PASS. Two new JSON BOM regression tests. Browser/Vitest/TestSprite/GitHub CI/live deployment NOT verified. `package-lock.json` remains missing.
