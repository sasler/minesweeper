# Release Notes

## 2025-09-29

### Accessibility Audit

- Playwright axe smoke (chromium-desktop): 0 violations (`npm run test:e2e -- --project=chromium-desktop --grep "Accessibility smoke"`, 2025-09-29)
- Playwright axe smoke (chromium-mobile): 0 violations (`npm run test:e2e -- --project=chromium-mobile --grep "Accessibility smoke"`, 2025-09-29)

### Performance Benchmarks

- Lighthouse CI (`npm run test:perf`) – Performance 0.96, Accessibility 1.00
- Key metrics: FCP 2.1 s, TBT 90 ms, LCP 2.2 s, Speed Index 2.9 s, CLS 0.002
- Artifacts stored in `docs/performance/lighthouse-2025-09-29.json`

### Browser Compatibility

- Chromium desktop (Chrome/Edge) suite: pass (`npm run test:e2e -- --project=chromium-desktop`)
- Firefox desktop smoke: pass (`npx playwright test --config=playwright.cross.config.js --project=firefox-desktop --grep "Game play flow"`)
- Safari desktop smoke: pass (`npx playwright test --config=playwright.cross.config.js --project=webkit-desktop --grep "Game play flow"`)

### Mobile & Touch Validation

- Playwright Pixel 7 suite (`npm run test:e2e -- --project=chromium-mobile`) covers touch toggle, win/loss flows
- Mobile Safari emulation (`npx playwright test --config=playwright.cross.config.js --project=webkit-ios --grep "Game play flow"`) confirms pinch/zoom stability

### Test Summary

- Jest unit suite: pass (`npm run test:unit`)
- Playwright integration suite (chromium-desktop): pass (`npm run test:e2e -- --project=chromium-desktop`)
- Playwright integration suite (chromium-mobile): pass (`npm run test:e2e -- --project=chromium-mobile`)
