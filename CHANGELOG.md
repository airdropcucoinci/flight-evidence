# v3.2
- Added `/api/report` with complete evidence, provenance, timeline and coverage.
- Preserved `/api/analyze` compatibility.
- Added four API integration tests and TestSprite test plan.

# v3.1
- R1–R7 kural filtresi, önem seviyesi filtresiyle birlikte çalışır.
- Filtreleri sıfırlama butonu eklendi.
- JSON rapor ve analiz bulguları filtrelerden etkilenmez.

## v3.3 — API request safety
- Enforce JSON Content-Type for POST requests.
- Enforce payload limit in UTF-8 bytes rather than JavaScript string length.
- Reject ambiguous input bodies specifying multiple source types.
- Remove permissive wildcard CORS header and add nosniff.
- Add five integration regression tests.

## v3.4 — Public demo row limit
- Reject input with more than 5,000 telemetry rows before analysis or report generation.
- Add boundary tests for 5,000 and 5,001 rows.
- Local verification: TypeScript build PASS; Node.js 92/92 PASS.
- Browser, Vitest, TestSprite and remote CI not verified.

## v3.5 — 15 October 2026
- Added three live HTTP integration tests for 5000/5001 row limits across `/api/analyze` and `/api/report`.
- Verified HTTP 200 for 5000 valid rows and HTTP 422 with explanatory message for 5001 rows.
- Local verification: TypeScript build PASS; Node.js 95/95 PASS. Vitest, browser E2E, TestSprite and hosted deployment remain unverified.

## v3.6 — HTTP UI contract
- Four HTTP-level regression checks: homepage, browser bundle, blocked source-file routes, health response.
- Updated stale UI version label to v3.6.
- These are HTTP integration tests, not a real browser or TestSprite run.

## v3.8 — competition acceptance gate
- Added localhost HTTP competition-journey acceptance test for L1–L10, repeatability, conflict rejection and report consistency.
- Added RELEASE_GATE.md with verified versus external pending requirements.
- Verified `tsc -p tsconfig.browser.json` and `node --test tests/*.test.mjs`: 100/100 pass (15 October 2026).

## v3.9
- R2 altitude streak excludes samples with duplicate/backwards timestamps or >5 s gaps.
- Three executable regression tests for continuity.

## v4.1 — Geodesic numerical stability
- Clamp haversine intermediate to [0,1] to avoid NaN at antipodal coordinates due to floating-point rounding.
- Add geodesic extremes and coordinate-range regression tests.
