# Flight Evidence — 90-second judge demonstration

**Use only after the PR branch is deployed and the TestSprite GitHub check is verified.** Current GitHub CI test evidence is not a replacement for TestSprite's own run.

## Problem and differentiation

A drone's flight log may contain physically inconsistent readings that are hard to audit manually. Flight Evidence does not classify cyberattacks. It makes seven **transparent, deterministic demonstration checks** and links each finding to its input row, timestamp, source measurements, and limitations.

The competition contribution is the combination of:
- reproducible, explainable multisensor checks;
- explicit **observation coverage and uncertainty**, rather than pretending missing telemetry is clean;
- readable, source-linked technical evidence;
- a real web interface and API that can be checked against the same scenario expectations every time;
- a verified browser regression suite (plus separate TestSprite PR verification, once completed).

We do **not** claim a novel detection algorithm, a validated false-positive rate, a forensic conclusion, or a real restricted-airspace database.

## Timed live walkthrough

| Seconds | Action on the branch-specific live build | What the judge should see |
|---|---|---|
| 0–10 | Open Flight Evidence and read the synthetic demo notice | Scope is clear, no attack attribution |
| 10–22 | L1 (Temiz uçuş) | TEMİZ, 301 rows, 0 findings; route and altitude views |
| 22–35 | L2 (GPS sıçraması) | KRİTİK, R1 finding; timeline and source-row evidence |
| 35–51 | L9 (Çoklu bulgu) | KRİTİK, three rule codes: R1, R3, R6 |
| 51–62 | Apply CRITICAL and R3 filters, then reset | Only displayed items change; analysis and JSON report remain stable |
| 62–72 | L8 (40 m/s sınır) | TEMİZ, explicitly selected L8; fixture is 39.999 m/s, not exact 40.000 |
| 72–82 | L10 (Bozuk dosya) | ANALİZ YAPILMADI; minimum 10 rows error; downloads disabled |
| 82–90 | Show GitHub PR checks | Actual GitHub CI and, **only when it exists**, the TestSprite App result |

If a video is recorded, leave the sample names, actual findings and the error clearly visible. Do not edit a passing/failing badge into the recording.

## Test data and reproducibility

- Ten deterministic samples generated in `src/samples.ts`
- `test-fixtures/valid-flight.csv` and `test-fixtures/invalid-flight.csv`
- `TESTSPRITE_SCENARIOS.md`: 14 independent browser/API test cases
- `e2e/flight-evidence.spec.mjs`: actual Chromium user journeys and screenshot production
- `tests/visual-evidence-provenance.test.mjs`: verifies exact report source rows even when timestamp values repeat
- `package-lock.json`: reproducible npm dependency resolution
- `.github/workflows/ci.yml`: typecheck, unit/API regressions, Vitest, Chromium E2E, security scan and screenshot artifact

Screenshots from GitHub Actions are generated automatically in the **flight-evidence-demo-screenshots** run artifact: `L1-clean.png`, `L9-multi-finding.png`, `L10-invalid.png`, `mobile-L1.png`. They are genuine headless Chromium captures of the PR code, not graphic mockups.

## Handling challenges honestly

**“Is an R1 finding a cyberattack?”** No. It is a defined position/time inconsistency in synthetic data that merits technical investigation. Other causes, such as measurement error or timestamp quality, remain possible.

**“Why is L10 intentionally invalid?”** A trustworthy import workflow must reject malformed telemetry instead of inventing a report. Browser UI and HTTP API both expose this boundary.

**“Why is an incomplete flight not just clean?”** Data gaps and unreliable timestamps invalidate continuity assumptions. A passing rule only describes available observations under demonstration thresholds.

**“What is the biggest limitation?”** Thresholds, sensor reference conventions, the synthetic restricted-zone rectangle and example data are not validated for live operations.

## Official submission handoff

Keep PR #1 open until the real TestSprite check appears. In TestSprite GitHub Action settings, choose the `validate` GitHub Actions completion event **and provide a reachable test URL for the PR code**. The production `main` Render deployment must **not** be mislabeled as the PR preview. On a free Render account, check whether previews are supported; if not, an isolated temporary web service deployed from the PR branch is a safer fallback than falsely testing a different commit.

After verification, submit the PR URL, true live demo URL, TestSprite name/email and optional video to Discord `#hackathon-submissions`. GitHub/email-only submission was explicitly declined by the organizer.
