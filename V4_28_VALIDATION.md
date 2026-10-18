# Flight Evidence v4.28 – HTTP competition acceptance checks

Added four executable HTTP tests: all sample IDs are listed, unsupported methods return 405 without killing the server, internal project files return 404, and invalid report sample IDs return 422.

These are local Node.js HTTP integration tests, not browser tests or TestSprite runs. The project still requires npm lockfile generation, browser/Vitest execution, a public GitHub repo, deployment and a TestSprite PR check.
