# Flight Evidence — Season 4 submission packet

**Updated:** 21 October 2026
**Submission status:** NOT SUBMITTED. The Discord stage is reserved for the user's Firefox session. A green TestSprite check has NOT been achieved.

## Verified links and results

- Repository: https://github.com/airdropcucoinci/flight-evidence
- PR #1 (open, unmerged): https://github.com/airdropcucoinci/flight-evidence/pull/1
- Competition PR preview: https://flight-evidence-pr-1.onrender.com
- Main demo, separate and unchanged: https://flight-evidence.onrender.com
- GitHub CI: https://github.com/airdropcucoinci/flight-evidence/actions/runs/39491238129
- GitHub CI on commit c84c494b1bcf508f01c567440e8bb06f704d6060: 163 Node regression/API tests, 41 Chromium tests, 17 Vitest tests, typecheck, scenario contract and security scan passed.
- Real TestSprite PR report: https://github.com/airdropcucoinci/flight-evidence/pull/1#issuecomment-6323885567
- Latest completed full TestSprite PR run at this checkpoint: **32 passed / 0 failed / 12 blocked / 44 total**. TestSprite V3 status: **failure**.
- Previous full run: 29 passed / 2 failed / 13 blocked. Do not claim an all-green cycle.
- Portal report: https://www.testsprite.com/dashboard-v3/o/39625253-9b9d-5533-ac49-7d8fddc2cb0c/projects/09d4374a-03fb-4b6c-8ead-97f09ba95e98/execution/705a4149-87de-4723-8b05-efd92165da86

## Completed integration

The existing project and suite are preserved. The active PR trigger is **validate**, with target pattern `https://flight-evidence-pr-{pr}.onrender.com`; merge-blocking status reporting is enabled. Manual TestSprite runs now target the same PR preview. No paid plan or free-trial subscription was accepted.

## Remaining verification limits

Nine blocked test cases require uploaded files; three concern normal interactions including exports. The portal's Free plan blocks test-file uploads. The generated narrative's count of eight blocked tests conflicts with its counter and list of twelve; use twelve. A normal-interaction test unexpectedly attempted file-upload coverage and reported export-click timeouts. Its plan was clarified without removing export or runtime-error assertions. A manual diagnostic rerun began before the default environment changed, so that run uses the main demo and is not PR-head verification. Any new run must be checked separately.

A direct browser check on the PR preview downloaded the selected L1 CSV (22,075 bytes, 301 data rows, expected nine columns) and JSON report (1,985 bytes, parsed successfully with coverage/evidence/rule fields). These are independent checks, not TestSprite passes.

Fixtures remain available in the repository at [valid-flight.csv](test-fixtures/valid-flight.csv) and [invalid-flight.csv](test-fixtures/invalid-flight.csv). L10 is intentionally malformed and must be rejected; a built-in invalid sample does not replace a real invalid-file upload test. Do not remove blocked tests merely to obtain a green badge.

## Official handoff

Official rules: https://www.testsprite.com/hackathon-s4

The page requires a public repository, live URL, generated TestSprite suite, PR carrying a TestSprite result, and a post to Discord **#hackathon-submissions** including PR URL, live URL, TestSprite name and email. Tests should pass. The current red status remains a submission-quality/eligibility risk; no acceptance is claimed. Confirm Discord's pinned final rules and any participation requirements before posting.

Published deadline: **22 October 2026, 23:59 Pacific Daylight Time**, equivalent to **23 October 2026, 09:59 Türkiye time**. Final schedule is confirmed in Discord. A video is optional.

## Discord text — review latest results before posting

**TestSprite Hackathon Season 4 — Flight Evidence**

**Project:** Flight Evidence — Drone Telemetry Consistency Lab
**PR:** https://github.com/airdropcucoinci/flight-evidence/pull/1
**Live PR demo:** https://flight-evidence-pr-1.onrender.com
**Repository:** https://github.com/airdropcucoinci/flight-evidence
**TestSprite account name:** airdropcu coinci
**TestSprite account email:** [verify the exact TestSprite sign-in email before posting]

Flight Evidence examines synthetic drone telemetry using seven deterministic consistency checks. Findings link back to input rows, timestamps and observation coverage. The dashboard includes ten reproducible scenarios, schematic route/altitude plots, CSV/JSON import, filters and report exports.

The TestSprite GitHub App automatically runs on the validate CI event against the PR deployment, with merge-blocking status reporting enabled. Latest completed full PR run at this checkpoint: **32 passed, 0 failed, 12 blocked out of 44**. The check remains red. Missing upload fixtures (file uploads are not included in our Free plan) and unresolved export automation block full verification. Separate GitHub CI passes 163 Node/API, 41 Chromium and 17 Vitest tests; these are not replacements for TestSprite results. Full evidence is in the PR.

**Scope:** synthetic educational demo, not operational drone control, attack attribution, legal forensic evidence or flight safety certification.
