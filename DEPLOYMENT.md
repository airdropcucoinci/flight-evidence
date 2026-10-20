# CURRENT DEPLOYMENT STATUS — 20 October 2026

The instructions below describe the earlier bootstrap plan. Current project uses **npm ci**, a committed `package-lock.json`, and a verified GitHub Actions CI workflow. A public main demo address is documented, but its current availability and **PR branch-specific deployment** are not verified here. The outstanding Render operation is to deploy or obtain a URL serving the **exact PR #1 commit** for the TestSprite trigger. Do not substitute a main deployment for a PR preview. See [RELEASE_EVIDENCE_2026_10_20.md](RELEASE_EVIDENCE_2026_10_20.md).

---

# Flight Evidence — deployment and TestSprite checklist

## Local verification

1. `npm install` (creates `package-lock.json`; commit it).
2. `npm run typecheck && npm test && npm run test:smoke`.
3. `npm start`; verify `/`, `/health`, `/api/samples`, and `POST /api/analyze`.

## Publish

1. Create a **public** GitHub repository; push code and lockfile.
2. Connect the repository to Render using `render.yaml` (or an equivalent Node host). Do not deploy as static-only hosting: `/api/analyze` requires a Node process.
3. Check the live `/health` endpoint and a sample API request.
4. Connect TestSprite to the public URL and GitHub repository, configure its PR checks, and run real browser/API tests.
5. Demonstrate a clearly disclosed, intentionally introduced R1 boundary regression in a separate PR, then fix it; retain red/green evidence.

**Not completed by this package:** GitHub publishing, cloud deployment, TestSprite connection, live PR evidence. These require authenticated accounts.

## CI limitations

The workflow depends on a committed `package-lock.json`. It is not a substitute for TestSprite; GitHub Actions only runs TypeScript, Vitest and Node smoke tests.


## Lockfile bootstrap (required before final submission)

This environment could not resolve registry.npmjs.org (EAI_AGAIN), so no valid
package-lock.json has been generated. On a machine with npm registry access:

```bash
npm install --package-lock-only --ignore-scripts
npm ci
npm run typecheck
npm test
npm run test:smoke
```

Commit the resulting package-lock.json, then replace the temporary CI install
step with `npm ci` and restore npm caching. Do not claim CI or Vitest PASS
until the hosted workflow has run successfully.
