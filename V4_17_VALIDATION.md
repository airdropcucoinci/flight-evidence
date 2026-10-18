# v4.17 release scanner verification

Adds four behavioral tests of the release-artifact scanner using isolated temporary directories: clean files, forbidden `.env`, embedded private key header, and bundled `node_modules`. This verifies the scanner actually rejects unsafe fixtures rather than merely checking that the script exists.

The scanner remains a heuristic; it does not guarantee secret detection. Vitest, browser E2E, live hosting, GitHub CI and TestSprite PR execution remain unverified. `package-lock.json` remains missing.
