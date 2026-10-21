# Flight Evidence — independent pre-submission audit, 20 October 2026

**Audit verdict:** **CODE / TEST PACKAGE READY; EXTERNAL SUBMISSION GATES PENDING.** Do not represent this as a complete TestSprite submission.

## Audit source and method

Reviewed public GitHub repository `airdropcucoinci/flight-evidence`, PR #1, branch `fix/invalid-upload-stale-report-20261019`, the 19 October generated source ZIP, CI workflow, deployment configuration, report/API modules, browser E2E tests, release notes, and the GitHub CI test result. The executable source ZIP was also inspected and tested after extraction, not only by reading PASS badges.

### Verified results

| Item | Evidence and status |
| --- | --- |
| PR #1 | OPEN, mergeable, not merged |
| GitHub CI | 163/163 Node tests, 6/6 real Chromium browser tests, TypeScript and Vitest PASS |
| HTML/JS behavior | L1/L2/L8/L9/L10 user flows, CSV upload, filter reset, report download, desktop/mobile tests PASS |
| API | Built-in /health, /api/samples, /api/analyze, /api/report HTTP regression suite PASS |
| Release package | New workflow builds TypeScript and stages fresh `dist/*.js` before packaging |
| Independent ZIP check | Downloaded CI artifact, validated ZIP integrity and SHA-256, extracted, reran **163/163 Node tests PASS** |
| Release security scanner | PASS (pattern scanner and safe package checks, not a full security penetration test) |
| Data limitations | Synthetic test scenarios and invented thresholds explicitly labeled |

**CI run proving the packaging correction:** https://github.com/airdropcucoinci/flight-evidence/actions/runs/39486893446

### Real audit finding resolved

An older generated ZIP had out-of-date checked-in compiled `dist` files. Running the ZIP's tests without rebuilding produced **160 PASS / 3 FAIL** because the tests expected source-row fields added to `src`, while `dist` still used older logic. Rebuilding the exact source passed **163/163**. The CI release workflow was changed to stage **freshly compiled JS** and re-run all Node tests **within the precise staged tree** before creating and uploading the release ZIP. The corrected CI ZIP was independently extracted and confirmed **163/163 PASS**. Do not distribute the older 19 October ZIP as the current final package.

### Documentation inconsistency corrected

Older root documents still described earlier local experiments as unverified. A current-status notice now appears at the top of `TEST_STATUS.md`, `BROWSER_TEST_STATUS.md`, `FINAL_HANDOFF.md`, and `DEPLOYMENT.md`; the historical notes remain in place so no results are silently rewritten.

## Remaining hard external gates (not a software build failure)

1. **PR deployment:** Show that a reachable HTTPS URL actually serves **this PR #1 commit**. The historical main Render URL does not prove this. Check Render's preview configuration, or deploy a branch-specific web service.
2. **TestSprite trigger:** The GitHub App was visibly installed in the workspace, but `Add Trigger` was blocked on `Target URL pattern`. After verifying a real PR URL, select `Pull Request`, PR #1, and the GitHub Actions `validate` check, enter the real target address, then save.
3. **TestSprite platform tests:** The previous portal count remained **29 PASS / 2 FAIL / 13 BLOCKED (44 total)**. A fresh 44-case run against the PR version is unverified. Fix actual failures and provide valid/invalid CSV fixtures to previously blocked uploads. No invented green TestSprite result.
4. **GitHub TestSprite evidence:** The PR currently has a GitHub Actions `validate` check; a **TestSprite App status/comment has not appeared**. A passing GitHub Actions check is not the required TestSprite proof.
5. **Official submission:** Discord membership was reported complete by the user. Confirm X following and actually submit required information to Discord `#hackathon-submissions` before the official deadline. Organizer's email stated that GitHub/email-only submission is not accepted.

## Recommended 21 October execution order

**(A)** Verify branch-specific deployment, **(B)** complete trigger, **(C)** rerun TestSprite suite and fix only verified defects, **(D)** verify TestSprite PR evidence, **(E)** Discord submission. Do not re-install GitHub App or restart the project.

## Demonstration and reproducibility materials

- [PR #1](https://github.com/airdropcucoinci/flight-evidence/pull/1)
- [90-second judge guide](DEMO_FOR_JUDGES.md)
- [TestSprite scenario inventory](TESTSPRITE_SCENARIOS.md)
- [Discord submission template](HACKATHON_SUBMISSION_PACKET.md)
- [Package CI run with SHA-256 and verified screenshot artifacts](https://github.com/airdropcucoinci/flight-evidence/actions/runs/39486893446)

### Scope and truthfulness

This tool analyzes **synthetic** drone telemetry consistency. Its alerts are not proof of attacks, tampering, flight safety, real airspace violations, or legal culpability. Current CI results demonstrate code and browser correctness within the defined synthetic suite, **not real drone telemetry validity and not completion of TestSprite's hosted 44-case run**.
