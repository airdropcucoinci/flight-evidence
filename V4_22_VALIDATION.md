# v4.22 — Battery observation window correction

R5 now starts a new 60-second observation window when reported voltage changes, telemetry continuity breaks, or high motor command resumes. Earlier code could miss a valid later constant-voltage interval after a voltage change. This is a demonstration heuristic, not evidence of tampering.

Local verification: see execution results reported alongside the ZIP. Vitest, browser E2E, GitHub CI, live hosting and TestSprite remain unverified.
