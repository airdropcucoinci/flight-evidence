# CURRENT HANDOFF — 20 October 2026

The 17 October handoff instructions below are preserved for history; several earlier blockers have since been resolved. **Public GitHub repository, GitHub Actions CI, npm lockfile, Vitest, real Chromium E2E tests and CI-generated source ZIP are now verified.** Latest CI: https://github.com/airdropcucoinci/flight-evidence/actions/runs/39486893446 . **Still outstanding:** verify PR-branch Render deployment URL, configure TestSprite target trigger, rerun TestSprite's failed/blocked scenarios, obtain the actual TestSprite PR check, and complete X/Discord submission. The release ZIP now contains freshly built JavaScript and passed independent 163/163 tests after extraction. See [RELEASE_EVIDENCE_2026_10_20.md](RELEASE_EVIDENCE_2026_10_20.md).

---

# Flight Evidence — yarışma devri / 17 Ekim 2026

## Yerel ortamda doğrulanabilecekler
- `npm run build` (TypeScript compiler varsa)
- `node --test tests/*.test.mjs` (mevcut regresyon takımı)
- `node scripts/offline-acceptance.mjs` (gerçek yerel HTTP üzerinden kabul senaryosu + sözleşme + sır taraması)
- `node scripts/release-preflight.mjs` (bilinçli olarak eksik kilit dosyasında FAIL)

## Dış ortam gerektiren blokajlar
1. İnternet erişimli bilgisayarda `npm install` ile **gerçek** `package-lock.json` üret ve commit et; ardından CI'da `npm ci` kullan.
2. `npm test` (Vitest) ve gerçek Firefox/Chromium tarayıcı testlerini çalıştır.
3. Herkese açık GitHub deposu ve canlı URL oluştur; canlı URL'de `npm run verify:deployment` kullan.
4. TestSprite GitHub App'i bağla; gerçek PR üzerinde kırmızı→yeşil test kanıtını oluştur.
5. Discord ve X katılım şartlarını tamamla; resmî teslim kanalından son tarih öncesi gönder.

## Dürüst kapsam
Bu yazılım sentetik uçuş verilerinde kural tabanlı tutarlılık kontrolüdür. Gerçek saldırı, hava sahası ihlali veya uçuş güvenliği kanıtı değildir. Yerel Node testleri, gerçek tarayıcı veya TestSprite testlerinin yerine geçmez.
