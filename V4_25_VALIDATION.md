# v4.25 HTTP asset error handling

Fixed missing allowed static assets returning HTTP 500 instead of HTTP 404. Added a live HTTP regression test confirming the server remains healthy.

This does not establish browser, Vitest, GitHub, or TestSprite readiness.
