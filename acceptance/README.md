# Independent equivalents of the 44 TestSprite plans

This suite preserves the 44 IDs, names, goals and steps exported from the TestSprite
project on 2026-10-21. The original YAML is retained verbatim. The JSON manifest is
a lossless representation of its test cases. These are independently authored
Playwright implementations, **not TestSprite-generated code or portal results**.
Several original cases repeat workflows across five use cases; 44 is the number
of original case identities, not 44 distinct features.

Source project: https://www.testsprite.com/dashboard-v3/o/39625253-9b9d-5533-ac49-7d8fddc2cb0c/projects/09d4374a-03fb-4b6c-8ead-97f09ba95e98/test-cases

Portal checkpoint: run `f8acdebb-9e8a-4607-b005-e3968b8090eb` reported
31 passed, 0 failed and 13 blocked. Independent results do not change that result,
satisfy its merge gate, or guarantee acceptance by contest judges.

## Run

```sh
npm ci --no-audit --no-fund
npx playwright install --with-deps --only-shell chromium
npm run test:portal44
node scripts/summarize-portal44.mjs
```

The default target is a fresh local server built from the checked-out PR code.
Set `PORTAL44_BASE_URL` to test a deployed instance instead; its version must be
verified separately. `PORTAL44_CHROMIUM_PATH` optionally selects an installed
Chromium executable. No browser mocks, skipped cases, retries or app-engine
generated expected results are used.

CI publishes `independent-portal44-evidence`: a per-case summary, HTML/JSON report,
traces, screenshots, original plans, and actual downloaded CSV/JSON files. The
report records its target, checked-out commit and source-plan SHA-256. A passing
summary requires exactly 44 uniquely matched cases and 44 first-attempt passes.

## Mapping and interpretation

| Original IDs | Implementation |
|---|---|
| Each group's 001 | Select all L1–L10 and assert selection, status and exact finding rules |
| Each group's 002–004 | L1 clean, L2 GPS speed anomaly, L9 exactly R1/R3/R6 |
| Each group's 005 | Severity + rule intersection, then reset both filters |
| Each group's 006 | Coverage, all seven rule records, source indices and timeline; BUL/OBS use L2, others L9 |
| Each group's 007 | Upload fixture, verify analysis, capture both exports and validate their content; FLG additionally rejects invalid file type before exporting |
| BUL/OBS/UPL/UX-008 | Reject unsupported file type, preserve valid analysis, verify continued interaction |
| FLG-008 | L1/L2/L9, findings scroll, both exports, continued use and runtime errors |
| BUL-009 | L1/L2, filters, valid upload, continued use and runtime errors |
| OBS-009 | L1/L2, filters, both exports while L2 is selected; no upload |
| UPL-009 | L1/L2, filters, valid upload, both exports and runtime errors |
| UX-009 | L2, filters/reset, L1 and runtime errors |

L10 is intentionally malformed. A correct analysis view for L10 shows rejection
and disabled exports, not a successful flight analysis. All three L9 findings
are CRITICAL: selecting CRITICAL alone does not reduce their count. The suite
checks WARNING yields zero, then CRITICAL + R3 yields one, then reset yields three.
These interpretations preserve the documented product contract.

Valid uploads use the existing deterministic 20-row fixture. Export checks compare
every uploaded numeric cell with the downloaded CSV, parse JSON, verify row counts,
rule identities, timestamps, and evidence indices. Invalid-type tests use an actual
`.txt` file through the native file input. All 44 cases capture page exceptions
and console errors in a fresh browser context.
