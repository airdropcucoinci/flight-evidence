# v4.5 — Browser response hardening

- Added restrictive Content-Security-Policy for served HTML and JavaScript. Only same-origin module scripts are permitted; inline CSS remains allowed because the current single-page HTML contains a style block.
- Added X-Content-Type-Options: nosniff, Referrer-Policy: no-referrer, X-Frame-Options: DENY to static responses.
- Added real local HTTP regression test verifying headers and the module script endpoint.
- Node test suite: 112/112 PASS (2026-10-15). Browser E2E, Vitest, GitHub CI and TestSprite remain unverified.
- This does not replace a browser security review or production penetration test.
