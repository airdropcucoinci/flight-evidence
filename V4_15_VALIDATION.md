# Flight Evidence v4.15 — Test contract audit

Added `npm run test:contract` to check the 14 documented TestSprite scenarios, referenced sample IDs, actual HTTP endpoints, stable UI selectors, and presence of the local HTTP acceptance suite. This is a static contract check, not a browser run or TestSprite run.

External gates remain: npm lockfile, Vitest execution, browser E2E, live deployment, GitHub PR/TestSprite checks, Discord submission or approved alternative.
