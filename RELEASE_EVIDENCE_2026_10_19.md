# Flight Evidence — release verification and remaining external gates

**Prepared:** 19 October 2026  
**Target:** TestSprite Hackathon Season 4  
**Working pull request:** https://github.com/airdropcucoinci/flight-evidence/pull/1  
**Public repo:** https://github.com/airdropcucoinci/flight-evidence  
**Main demo (not a verified PR preview):** https://flight-evidence.onrender.com

## Verified directly on GitHub Actions

The branch has been built and tested with Node.js 22, locked npm dependencies (`npm ci`), TypeScript, Node's integrated HTTP/unit regression suite, Vitest and a **real Chromium headless browser**. A successful CI run:

https://github.com/airdropcucoinci/flight-evidence/actions/runs/39331554266

| Verification | Result from the linked run |
|---|---|
| Install packages using committed package-lock.json | PASS |
| TypeScript typecheck | PASS |
| Node HTTP/smoke tests | 13 / 13 PASS |
| Node regression/API/evidence tests | **163 / 163 PASS** |
| Vitest | PASS |
| Chromium Playwright browser user journeys | **6 / 6 PASS** |
| Competition test scenario contract | PASS (14 declared cases) |
| Release artifact security scanner | PASS |
| Auto-captured browser screenshots | PASS; artifact exists |

The screenshots are attached to the Actions run as `flight-evidence-demo-screenshots`, containing `L1-clean.png`, `L9-multi-finding.png`, `L10-invalid.png` and `mobile-L1.png`.

### Major changes since the initial local demonstration

1. **Professional responsive interface** with real data-derived schematic route and altitude visualizations.
2. **Data continuity honesty:** no rendered trajectory is interpolated through missing/nonmonotonic records.
3. **Source provenance correction:** a finding identifies its exact triggering row even if the timestamp occurs more than once; an R4 escalation updates that row.
4. **Intentionally invalid L10 handling:** no report or CSV export is allowed when the selected sample is invalid.
5. **Rejected user-upload handling:** a rejected CSV/JSON upload is called out explicitly and does not replace the previous *valid* analysis; the screen clearly labels the preserved analysis.
6. **Actual browser verification:** L1/L2/L8/L9/L10 interactions, filtering, upload, report download, and mobile layout are tested in Chromium.
7. **Reproducibility:** generated and committed npm lockfile; CI and Render build settings use `npm ci` rather than unpinned installation.
8. **Presentation:** test screenshots and [90-second judge script](DEMO_FOR_JUDGES.md).

## Honest limits: what is not complete here

**TestSprite portal:** Previous run had **44 planned: 29 PASS, 2 FAIL, 13 BLOCKED**. Despite successful local GitHub CI and Chromium E2E tests, the separate TestSprite portal test results have **not been re-run or certified green** after these changes. The two failed cases were reported around scenario selection L8/L10, and several blocked upload checks lacked test fixture files. A TestSprite result must be checked inside its own portal.

**TestSprite PR action:** GitHub App was visibly installed in the user's TestSprite workspace; the user reached the **Add Trigger** dialog and selected the GitHub Actions `validate` check. The unfinished Target URL pattern requires a URL actually running **this PR branch**. Do not enter a fabricated `pr-{pr}` hostname. Do not silently use the main demo as if it deployed this PR.

**Deployment:** The existing main Render service has previously been published, but **this PR branch has not been independently shown live on that URL**. A verified PR preview or temporary branch-specific Render service, followed by a live health and API check, is necessary for TestSprite's PR-specific run.

**Participation:** Discord membership was confirmed by the user; the X follow requirement and actual `#hackathon-submissions` message must be checked/submitted. The organizer's 17 October reply said GitHub + email alone do not meet Season 4 eligibility.

No competition placement, winning probability, TestSprite test outcome, live branch deployment, Discord submission or acceptance is invented in this document.

## Remaining user/account actions only

1. In Render, inspect **Previews**. If unavailable for the current plan, choose a branch-specific preview deployment compatible with the plan, without accidentally replacing the main production service.
2. Verify the branch's `/health` and `/api/analyze`, L8, L10 and fixture upload behavior at that URL.
3. In TestSprite Flight Evidence project → GitHub Action → Pull Request trigger, use PR #1 and the `validate` CI event; configure the verified **PR-branch** URL.
4. Rerun two failing and thirteen blocked TestSprite cases with actual CSV fixtures; then run the 44-case suite once corrected and capture results.
5. Confirm the **TestSprite GitHub App check/comment** really appears on PR #1, separately from GitHub Actions.
6. Confirm X participation and post [competition submission packet](HACKATHON_SUBMISSION_PACKET.md) in Discord `#hackathon-submissions` by the official deadline.

Do **not** merge PR #1 before obtaining TestSprite PR-test evidence if the competition requires a tested open PR. This release gate is an external account workflow; all described GitHub repository preparations and tests are autonomous.
