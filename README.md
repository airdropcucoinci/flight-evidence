# Flight Evidence — Drone Telemetry Consistency Lab

**Competition PR preview:** https://flight-evidence-pr-1.onrender.com  
**Main demo (separate deployment):** https://flight-evidence.onrender.com  
**Repository:** https://github.com/airdropcucoinci/flight-evidence  
**Release track:** TestSprite Hackathon Season 4 (October 16–22, 2026)  
**Current application package version:** 4.28.0

Flight Evidence examines **synthetic** drone telemetry for rule-based consistency issues, provides explainable findings linked to source rows and timestamps, and exposes the same analysis through a browser interface and JSON API. It is a **training demonstration**, not cyberattack detection, legally admissible forensic evidence, flight certification, or an operational airspace service.

## Live walkthrough (no account required)

1. Open the [competition PR demonstration](https://flight-evidence-pr-1.onrender.com).
2. Select **L1 – Temiz uçuş**: expected **TEMİZ** (no findings).
3. Select **L2 – GPS sıçraması**: expected **KRİTİK**, rule **R1**.
4. Select **L9 – Çoklu bulgu**: expected **KRİTİK** with **R1, R3 and R6**.
5. Select **L8 – 40 m/s sınır**: expected **TEMİZ**. This fixture uses 39.999 m/s, immediately below the demonstration threshold; it does not assert exact mathematical equality.
6. Select **L10 – Bozuk dosya**: expected **ANALİZ YAPILMADI** and a minimum 10 rows validation error. **This is a successful rejection of deliberately invalid test input**, not a broken button.
7. Upload a valid CSV from [test-fixtures/valid-flight.csv](test-fixtures/valid-flight.csv); separately upload [test-fixtures/invalid-flight.csv](test-fixtures/invalid-flight.csv) to verify clear error handling. A rejected upload keeps the previous valid analysis visible and explicitly identifies that the new file was rejected.
8. Test the critical/warning and R1–R7 filters, download sample CSV or a report JSON, and inspect the timeline, observation coverage, and evidence rows.

## Deterministic demonstration rules

| ID | Check | Demonstration rule |
| --- | --- | --- |
| R1 | GPS position jump | Derived speed **>40 m/s** |
| R2 | GPS / barometer altitude discrepancy | `abs(gpsAlt - baroAlt) >30 m` for **3 consecutive** valid samples |
| R3 | Frozen IMU | Same accelerometer/gyroscope readings for **15+ consecutive** rows while moving |
| R4 | Timestamp consistency | Nonmonotonic, duplicate, or gap **>5 s** |
| R5 | Battery / motor consistency | Sustained **≥80% motor** and constant voltage for **60 s**, respecting data gaps |
| R6 | Example geofence | Observed route point/continuous segment intersects an **invented** polygon |
| R7 | Example altitude ceiling | Barometric altitude **>120 m** |

Thresholds and geofence are **synthetic demo values**, not legal limits or validated standards. GPS and barometric altitudes may use different datums; battery readings may legitimately remain stable; missing observations are never treated as a verified safe route. See source in `src/engine.ts` for exact implementation.

## API and formats

The server accepts CSV/JSON telemetry and prebuilt synthetic sample IDs. Valid telemetry columns include `t, lat, lon, gpsAlt, baroAlt, ax, gx, motor, voltage` (see parser and fixtures). File row count is limited to **5,000** and request size to **1 MB**.

- `GET /health` — public service health.
- `GET /api/samples` — ten built-in sample identifiers.
- `POST /api/analyze` — JSON body such as `{"sampleId":2}`, returns findings and overall status.
- `POST /api/report` — same input, returns explainable report with coverage, evidence and timeline.
- Invalid `{"sampleId":10}` intentionally produces **HTTP 422**, not `200`.

## New: explainable dashboard and real browser tests

The responsive Turkish dashboard now includes a data-derived schematic route (which does not connect unobserved telemetry gaps), an altitude comparison, evidence-linked alert markers, rule-level explanations and source-row traceability. **No real map provider or live-drone service is required.** The original sample APIs and deterministic rules are retained.

The browser suite in `e2e/flight-evidence.spec.mjs` tests actual clicks on L1/L2/L8/L9/L10, invalid/valid CSV upload, download behavior, filters, chart rendering and mobile overflow using Chromium. GitHub Actions also uploads real screenshots as `flight-evidence-demo-screenshots`.

**Verified CI on 21 October 2026:** https://github.com/airdropcucoinci/flight-evidence/actions/runs/39491238129 — **163/163** Node regression/API tests, **41/41** Chromium tests, **17/17** Vitest tests, typecheck, scenario contract and release security scan passed on commit `c84c494b1bcf508f01c567440e8bb06f704d6060`. These are **not** TestSprite portal results.

See [release evidence](RELEASE_EVIDENCE_2026_10_19.md), [judge demo script](DEMO_FOR_JUDGES.md), and [competition submission packet](HACKATHON_SUBMISSION_PACKET.md). The competition build is served at https://flight-evidence-pr-1.onrender.com. The main Render URL is a separate deployment. PR #1 stays open; main has not been changed for this integration.

## Test and CI instructions

Node.js 22+ recommended. In the repository root:

```bash
npm ci --no-audit --no-fund
npm run typecheck
npm run test:node
npm test
npx playwright install --with-deps --only-shell chromium
npm run test:e2e
npm run test:contract
npm run check:release
npm start
```

The GitHub Actions workflow in `.github/workflows/ci.yml` executes type checking, Node integration/regression tests, Vitest, documented TestSprite scenario contract checks, and a release artifact scanner on pushes and pull requests. `TESTSPRITE_SCENARIOS.md` defines **14 intended TestSprite browser/API scenarios**. GitHub Actions results **are not TestSprite results**.

**External TestSprite status, 21 October 2026:** the real GitHub App ran **44** tests on PR #1: **32 passed, 0 failed, 12 blocked**. [TestSprite's PR report](https://github.com/airdropcucoinci/flight-evidence/pull/1#issuecomment-6323885567). The TestSprite V3 commit status is **failure**, not green. Nine blocked cases cover uploaded files; three cover normal interactions including downloads. TestSprite's Free plan does not include test-file uploads. Missing fixtures and unresolved export automation prevent a complete pass; separate GitHub tests do not substitute for these cases.

The active GitHub App trigger listens for **validate**, targets `https://flight-evidence-pr-{pr}.onrender.com`, and reports failures as a merge-blocking status. The manual TestSprite environment has also been pointed to the PR preview. One existing export/runtime test plan was clarified to use the real download controls and download-event waiting; any new result must be read from the portal/PR, not inferred from this edit.

**Contest PR:** https://github.com/airdropcucoinci/flight-evidence/pull/1

## Security and limitations

- No live drone connections, SDR, radio interception, firmware access, surveillance, or real restricted-airspace polygons.
- No sensitive data or credentials are required; tests use fictional coordinates and synthetic values.
- Findings identify defined telemetry **inconsistencies**, not proof of manipulation, legal liability or drone compromise.
- CSV/JSON values are validated; malformed telemetry produces an error and does not replace valid analysis.
- Source/version history is maintained under `CHANGELOG.md` and `V4_*.md`. The UI's historical version label may differ from the `package.json` version; release notes are authoritative for code status.

## Season 4 submission status

This public repository, demo URL and PR alone **do not complete submission**. The organizer requires a generated TestSprite suite, a **TestSprite GitHub App result on a PR**, participation on Discord and X, and a **Discord #hackathon-submissions post** including the PR URL, live URL, TestSprite account name and email by **Oct 22, 2026 23:59 Pacific**. See [official rules](https://www.testsprite.com/hackathon-s4). Do not treat email/GitHub alone as an accepted alternative without written organizer approval.
