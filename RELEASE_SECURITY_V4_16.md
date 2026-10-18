# Flight Evidence v4.16 — Release artifact check

Added `npm run check:release` to detect common secret filenames, private-key markers, GitHub token patterns, symlinks, oversized files, and accidental `node_modules` or `.git` folders in release packages. The CI workflow runs this check after existing contract tests.

This is a heuristic check, not a full secret scanner. It cannot establish that a public repository is free of all secrets. Before publishing, review `git status`, tracked files, and repository history.

Verified locally: `npm run test:node` 130/130 PASS; `node scripts/check-release-artifacts.mjs` PASS. GitHub-hosted CI, Vitest, browser tests and TestSprite remain unverified. `package-lock.json` is still missing.
