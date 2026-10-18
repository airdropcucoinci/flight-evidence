# Test status — v3.6

- TypeScript build: PASS (local)
- Node.js tests: 99/99 PASS (local, includes four HTTP UI contract tests)
- Browser E2E: NOT RUN
- Vitest: NOT RUN
- TestSprite / GitHub PR: NOT RUN
- Public deployment: NOT DONE

A passing local suite does not prove browser UI functionality or hackathon eligibility.

## v3.9 verified locally
- TypeScript build: PASS (2026-10-15)
- Node test runner: 103/103 PASS, including three R2 continuity regression tests
- Vitest, browser E2E, TestSprite and remote GitHub CI: NOT VERIFIED

## v4.1 verification
Run `npm run test:node` and `npm run typecheck` for current evidence. Vitest, browser E2E and TestSprite are not yet verified.


## v4.7 local verification
2026-10-16: `npm run test:node`: 115/115 PASS. Browser, Vitest, TestSprite, deployment not verified.
