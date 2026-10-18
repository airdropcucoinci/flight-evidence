# Flight Evidence v4.4 — verification increment

## Scope
Added three behavioral report-invariant tests in `tests/report-invariants.test.mjs`:
- Every reported finding maps to a valid source row in L1–L9 samples.
- Interrupted time-series data is not labelled as a complete clean assessment.
- R1–R7 report order is stable.

## Verified in this environment
- `node --test tests/*.test.mjs`: **111/111 passed**.
- `tsc -p tsconfig.browser.json --noEmit`: **passed**.

## Not verified
- Vitest (`npm install`/registry unavailable in prior attempts).
- Chromium E2E (environment denied loopback browser navigation).
- GitHub Actions, deployed public URL, TestSprite PR checks.

## Limitations
These are deterministic synthetic-fixture tests; they do not validate real drone telemetry, safety, or security attack attribution.
