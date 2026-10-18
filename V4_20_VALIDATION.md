# Flight Evidence v4.20 – continuity regression verification

- Base: v4.19.
- Added tests/continuity-edge.test.mjs: two edge cases for R2 and R6 with discontinuous timestamps.
- Verified: Node.js tests 136/136 PASS; TypeScript typecheck PASS; server and browser JavaScript syntax checks PASS.
- Initial R6 test failed due to an unintended second continuous segment crossing the synthetic polygon; fixture corrected and entire suite rerun. No production rule change was needed.
- Not verified: Vitest, browser E2E, GitHub CI, public deployment, TestSprite PR. package-lock.json still absent.
