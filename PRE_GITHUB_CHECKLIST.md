# Flight Evidence — Pre-GitHub handoff

## Verified locally (2026-10-15)
- `npm run test:node`: 99/99 Node tests passed; this invokes TypeScript build.
- This is **not** a Vitest, browser, hosted CI, or TestSprite result.
- `npm install --package-lock-only` failed with `EAI_AGAIN` resolving registry.npmjs.org; no lockfile is included.

## On a computer with npm access
1. `npm install --no-audit --no-fund` to create package-lock.json.
2. `npm ci && npm run typecheck && npm run test:node && npm test`.
3. If all pass, commit `package-lock.json` and replace the temporary CI install command with `npm ci`.
4. Start with `npm start`, verify `/health`, sample L1/L2/L9 and the browser UI.
5. Deploy to a public URL, configure TestSprite suite, then GitHub App and PR checks. Never claim TestSprite success before the real check runs.

## Caveats
- This is an educational telemetry-consistency demo, not proof of intrusion or flight safety.
- The 99 Node tests are a mixture of functional and source-contract checks, not 99 independent E2E scenarios.
