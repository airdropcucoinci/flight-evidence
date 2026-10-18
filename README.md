# Flight Evidence v0.6 — local demonstration

Synthetic drone telemetry consistency checks (R1–R7). Findings are **not** proof of cyberattack, equipment failure or flight safety. Thresholds and airspace polygon are demonstration-only.

## Run

Requires Node.js 20+ and TypeScript compiler. From this directory:

```sh
npm install
npm run build
npm run test:smoke
npm test
npm start
```

Open http://localhost:3000 (or the port in `PORT`). `npm test` requires the Vitest development dependency to be installed. `test:smoke` uses Node's built-in test runner and exercises the API and core engine.

## Scope and status

CSV/JSON parsing, synthetic sample selection, core consistency rules, and local HTTP API are included. No public deployment, GitHub PR checks, TestSprite execution, or live drone integration has been performed. No actual restricted airspace is represented.

## Known limitations

The 40 m/s boundary is exercised at 39.999 and 40.001 m/s rather than a bit-exact 40.000 measurement; altitude reference datum and battery voltage assumptions require external calibration for real-world use. The local demo is not a forensic-grade tool.

## v0.7 regression fixes
- R4 now escalates from WARNING to CRITICAL when a backward timestamp follows an earlier duplicate.
- JSON boolean values in numeric fields are rejected.
- Added two regression tests; 8/8 Node smoke tests pass with TypeScript build.
- Vitest not verified; dependency installation timed out. Live deployment and TestSprite PR integration remain outstanding.

## v0.8 doğrulama notu (14 Ekim 2026)
- Test dosyasındaki eksik `parseTelemetry` importu düzeltildi.
- `npm run build` başarılı.
- `node --test tests/smoke.test.mjs`: 8/8 PASS.
- Vitest, gerçek tarayıcı E2E, TestSprite, GitHub PR ve canlı dağıtım henüz doğrulanmadı.
- L8 tam 40 m/s matematiksel eşitlik sınırı henüz kanıtlanmadı; alt/üst yakın değerler test edildi.


## v0.9 changes (2026-10-14)
- V0 input checks now reject motor command outside 0–100% and negative voltage.
- Added deterministic Node regression tests for invalid physical inputs and near-40 m/s boundary.
- Floating-point geodesic distance means a nominally exact 40 m/s test is not proof of bit-exact equality; test asserts against the actual computed speed.
- External TestSprite, GitHub PR and live deployment remain unverified.

## v1.0.0-rc.1 verification (14 Oct 2026)
- Direct API `rows` input now passes through the same strict parser as JSON uploads; boolean numeric fields are rejected with HTTP 422.
- Added API regression tests for malformed direct rows/CSV and 1 MB payload limit.
- `npm run build`: PASS. `node --test tests/smoke.test.mjs`: 12/12 PASS.
- Not yet verified: Vitest, browser E2E, public deployment, GitHub/TestSprite PR integration.


## Release v1.2 deployment preparation

Added `/health`, GitHub Actions workflow, Render blueprint and `DEPLOYMENT.md`. These are templates, **not proof of deployment or TestSprite integration**.

## v1.5 — Evidence report (offline development)
- Deterministic `createReport` helper returns a seven-rule PASS/WARNING/CRITICAL matrix and timestamped findings.
- Browser offers downloadable JSON report; no network calls or personal data storage are added.
- Reports are *consistency screening*, not proof of attack, physical fault, or legal responsibility.
- Run `npm run test:node` to validate with Node built-in tests; Vitest and real browser E2E remain pending.

## v1.6 continuity check
R5 no longer treats a missing telemetry interval (>5 seconds) as continuous battery observation. See CHANGELOG.md and tests/continuity.test.mjs.

### v2.0 report additions
The downloaded JSON report includes `timeline` events and `dataQuality` counts. A data gap means the route was not observed; it does **not** establish a geofence violation or prove a cyberattack. All thresholds are demonstration values.

### v2.1 evidence entries
JSON reports include `evidence[]` with rule, time, source observation and applicable metric/threshold. These are traceability aids, not forensic proof or flight-safety certification.

### Observation coverage (v2.2)
`coverage.complete` is false if the log contains a time gap (>5 seconds), repeated timestamp, or backward timestamp. The `coverage.note` explains that PASS states apply only to observed data and demo rules. This is **not** a safety certification or proof that no anomaly occurred during missing intervals.

### v2.3 coverage UI
The interface now displays report coverage (complete/interrupted/invalid) using `data-testid="coverage-status"`. This is an observation-quality indicator, not safety certification.

## v3.2 API
`POST /api/report` accepts the same JSON body as `/api/analyze` and returns a structured evidence report. See `TESTSPRITE_SCENARIOS.md`.

### Public demo resource limit
Maximum 5,000 telemetry rows per analysis request. Larger datasets are rejected; this is a demo resource limit, not an aviation standard.


## Pre-GitHub validation handoff
See [PRE_GITHUB_CHECKLIST.md](PRE_GITHUB_CHECKLIST.md) for verified local tests and pending external setup.

## v4.6 parser integrity
Duplicate CSV headers are rejected; parser input is capped at 5000 rows. See V4_6_VALIDATION.md.


## v4.8
CSV quoted numeric cells supported; malformed quotes rejected. See V4_8_VALIDATION.md.


## v4.9
CSV quoted multiline records supported; see V4_9_VALIDATION.md.


### v4.21
JSON telemetry with UTF-8 BOM is supported; 138 Node.js tests pass locally. See V4_21_VALIDATION.md.
