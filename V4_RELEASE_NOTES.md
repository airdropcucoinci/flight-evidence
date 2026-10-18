# Flight Evidence v4.0 – R2 continuity correction

- Corrected R2 so an altitude discrepancy is counted only on the first record or when the timestamp gap to the preceding record is strictly positive and at most 5 seconds.
- Added a regression test confirming that the first reading after a long gap is not counted as a contiguous measurement, and that three subsequent valid readings trigger R2.
- Verified locally with `tsc -p tsconfig.browser.json` and `node --test tests/*.test.mjs`: 104/104 tests pass.
- Not yet verified: Vitest, browser E2E, TestSprite, GitHub CI, public deployment.
- All thresholds remain synthetic demonstration rules; no inference of cyberattack or flight safety is warranted.
