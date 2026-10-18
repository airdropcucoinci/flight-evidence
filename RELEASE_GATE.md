# Flight Evidence — release gate

## Verified locally
- TypeScript build
- Node.js unit/integration suite including live localhost HTTP requests
- Sample verdicts and reproducibility

## Still requires external access
- Install pinned npm dependencies and commit generated package-lock.json; switch CI to `npm ci`
- Run Vitest and browser E2E tests in a browser
- Publish public GitHub repository and public live URL
- Create TestSprite 3.0 suite, install GitHub App, enable PR and blocking checks
- Demonstrate failed check followed by fixed, passing check in a real PR
- Submit via Discord or obtain explicit written permission for another channel

Never report local Node.js checks as TestSprite results. Do not publish a fake PR URL or live URL.
