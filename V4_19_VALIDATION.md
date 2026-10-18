# v4.19 — Deployment verification expansion

Adds three read-only live endpoint checks: L2 GPS anomaly, L9 multi-finding, and evidence report/source-row traceability. These checks do not replace browser, Vitest, GitHub CI, or TestSprite validation.

Run: `node scripts/verify-deployment.mjs http://127.0.0.1:3000` after `npm run build` and `npm start`.
