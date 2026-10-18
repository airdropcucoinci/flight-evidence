# Flight Evidence v4.14 — release gate

This is a preparation release, **not** a verified hackathon submission.

## Local gates
- `npm run build`
- `npm run test:node`
- `npm test` (Vitest; requires npm install)
- `npm run preflight` (intentionally fails until a real lockfile exists)

## External gates — not completed
- Create and commit `package-lock.json` with `npm install`, then switch CI from `npm install --no-package-lock` to `npm ci`.
- Deploy public URL; run browser E2E and TestSprite V3 suite.
- Install TestSprite GitHub App, enable PR checks, capture real passing PR check.
- Submit PR URL, live URL, account identity through the official accepted submission channel.

The release preflight intentionally reports FAIL for missing lockfile; never represent this as a passing release.
