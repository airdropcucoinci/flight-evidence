# Flight Evidence v4.13 — release readiness

## Verified locally
- Node.js built-in suite (130 tests) is runnable against the bundled dist.
- Source/HTML version label now matches the release.
- GitHub Actions invokes `test:node` instead of only `test:smoke`, so it targets the full Node regression suite.

## External gates still OPEN
- Install dependencies with internet; generate and commit `package-lock.json`; switch CI from `npm install --no-package-lock` to `npm ci`.
- Run `npm run typecheck`, `npm test` (Vitest), `npm run test:node` and real browser tests after install.
- Confirm CI is green in GitHub, deploy a public URL, connect TestSprite GitHub App, and obtain an actual passing TestSprite PR check.
- Confirm accepted submission method if Discord remains inaccessible.

Do not report this package as a completed competition entry.
