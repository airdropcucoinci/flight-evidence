# Flight Evidence deployment verification

Run after publishing the application:

```bash
npm run verify:deployment -- https://YOUR-REAL-DEPLOYMENT-URL
```

The tool makes read-only or sample-analysis requests to `/health`, `/api/samples`, and `/api/analyze`. It checks a clean sample and malformed JSON rejection. It does not verify TestSprite, GitHub PR checks, browser rendering, or Discord submission. Do not interpret a PASS as competition eligibility.

For local verification, run `npm run build` and `npm start` in a separate terminal, then `npm run verify:deployment -- http://localhost:3000`.
