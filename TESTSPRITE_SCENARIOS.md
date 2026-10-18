# TestSprite test plan (not yet executed on TestSprite)

Use a public deployment and stable `data-testid` selectors. Test the UI and API independently.

| Case | Action | Expected result |
|---|---|---|
| TS-01 | Load home | Disclaimer and sample buttons visible |
| TS-02 | Select L1 | TEMİZ, no findings |
| TS-03 | Select L2 | KRİTİK, R1 evidence |
| TS-04 | Select L3 | DİKKAT, R2 evidence |
| TS-05 | Select L7 | KRİTİK, R6 evidence |
| TS-06 | Select L8 | TEMİZ at speed boundary |
| TS-07 | Select L9 | R1, R3 and R6 findings |
| TS-08 | Select L10 | Invalid data; report download disabled |
| TS-09 | L9 + critical filter | Only critical findings shown; report unchanged |
| TS-10 | L9 + R3 filter | Only R3 shown; reset restores all |
| TS-11 | POST /api/report L2 | HTTP 200; evidence and source rows present |
| TS-12 | POST /api/report L10 | HTTP 422 with error |
| TS-13 | POST /api/analyze L2 | Legacy API still works |
| TS-14 | GET /health | HTTP 200, status ok |

For the red-to-green PR demonstration, use a dedicated branch and disclose the deliberately introduced boundary error. Do not merge an intentionally failing branch.

## API competition acceptance gate (local, before TestSprite)

`tests/competition-journeys.test.mjs` launches the real HTTP server and checks L1–L9 verdicts, L9's exact three-rule set, deterministic repeat results, malformed L10, conflicting inputs, and report consistency. It is **not** a TestSprite run or browser E2E test. Do not represent it as one.
