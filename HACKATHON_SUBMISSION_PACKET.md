# Flight Evidence — Season 4 submission packet

**Prepared:** 19 October 2026  
**Submission status:** NOT SUBMITTED. Only submit after TestSprite PR results and Discord/X eligibility steps are confirmed.

## Public links

- GitHub repository: https://github.com/airdropcucoinci/flight-evidence
- Pull request (keep open for the actual TestSprite App check): https://github.com/airdropcucoinci/flight-evidence/pull/1
- Demo URL: https://flight-evidence.onrender.com
- GitHub Actions evidence: https://github.com/airdropcucoinci/flight-evidence/actions/runs/39314284032
- Prior TestSprite run: **29 PASS, 2 FAIL, 13 BLOCKED out of 44**. These are NOT final passing results.
- 14 manually specified acceptance cases: [TESTSPRITE_SCENARIOS.md](TESTSPRITE_SCENARIOS.md)
- Sample upload files: [valid-flight.csv](test-fixtures/valid-flight.csv) and [invalid-flight.csv](test-fixtures/invalid-flight.csv).

## Final independent quality gates

1. Check the live URL loads, `GET /health` returns JSON `status: ok`, and `POST /api/analyze` with `{"sampleId":2}` returns CRITICAL/R1.
2. In TestSprite Portal, under **Workspace Settings → Connections → Integrations**, connect GitHub App with access to this repository. In the project GitHub/CI area configure a trigger to run after the correct deployment is reachable; use **Send Test Event** on PR #1. Enable **Block PR until tests pass** where supported.
3. **Do not mistake a main-branch Render URL for a PR preview.** A TestSprite PR trigger must point at a deployment of the changes under review, or an explicitly documented/tested branch environment. The current Render URL is known as the shared/main demo; PR preview availability is unverified.
4. Re-check the 2 prior failed scenarios (L8 and L10) and 13 blocked scenarios. Provide the fixture files to any tests which need actual file uploads, and only rerun the complete suite after addressing blockers. In particular:
   - L8 uses a **39.999 m/s** synthetic boundary fixture and must be CLEAN with no findings; the selection indicator must show L8.
   - L10 is an **intentionally malformed sample** (only 5 records), expected to show `ANALİZ YAPILMADI` and API `422` with `Minimum 10 rows required`. It is *not* intended to analyze successfully.
   - Rejecting an uploaded invalid CSV/JSON should clearly explain the rejection and keep the prior valid result explicitly identified (not quietly misattribute its report to the invalid file).
5. Confirm the PR has a **TestSprite GitHub App comment or status check** tied to the correct deployment and run; a plain GitHub Actions check does not satisfy this evidence.
6. Confirm both Discord membership and following TestSprite on X. The organizer explicitly rejected GitHub/email-only submissions for this hackathon (reply received 17 October).
7. **Post in Discord `#hackathon-submissions` before October 22 at 23:59 Pacific Time** (October 23, 09:59 Turkey time), including PR, demo URL, TestSprite account name/email and optional video. Do not publicly post an account password, token or private API key.

## Paste-ready Discord submission (after QA gates)

**TestSprite Hackathon Season 4 — Flight Evidence**

**Project:** Flight Evidence — Drone Telemetry Consistency Lab

**Public GitHub repository:** https://github.com/airdropcucoinci/flight-evidence

**TestSprite-tested PR:** https://github.com/airdropcucoinci/flight-evidence/pull/1

**Live demo:** https://flight-evidence.onrender.com

**TestSprite account name:** [enter the exact public name shown in your portal]

**TestSprite account email:** [enter the email used to sign in to TestSprite]

Flight Evidence is an explainable, deterministic web app that examines synthetic drone flight records for GPS/speed, altitude, sensor, time, motor/battery and synthetic geofence consistency. Seven rule checks output traceable findings linked to source rows, timestamps and observation coverage. The interface includes 10 example scenarios, CSV/JSON upload, filters and an exportable evidence report.

Our GitHub CI includes type checks, Node regression/API tests, Vitest and test-contract checks. TestSprite PR verification evidence should be linked from the PR once it runs.

**Safety and scope:** Synthetic education-only demo; not a real-drone control tool, intrusion proof, regulatory geofence, forensic conclusion or flight safety certification.

---

**Do not paste this document as a claim of final successful TestSprite tests.** Verify status on the actual PR before posting. 
