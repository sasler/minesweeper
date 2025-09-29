# Manual QA Checklist

## Session Setup

- [ ] Run `npm install`
- [ ] Launch `npm run dev` and open the served URL on desktop and mobile emulation

## Gameplay

- [ ] Start Beginner game, confirm first click never reveals a mine
- [ ] Complete a win in Beginner and verify victory message plus timer stop
- [ ] Trigger a loss and ensure all mines reveal with loss message
- [ ] Use Restart button and verify mine counter/timer reset

## Accessibility

- [ ] Navigate tiles with arrow keys and activate using Space/Enter
- [ ] Confirm screen reader announces status updates via live region
- [ ] Validate touch toggle button exposes pressed state
- [ ] Run `npm run test:e2e -- --grep @axe` to execute automated axe scans

## Touch & Responsiveness

- [x] Switch touch toggle to Flag mode and place/remove flags via touch emulation (`npm run test:e2e -- --project=chromium-mobile`, 2025-09-29)
- [x] Verify layout at 320px, 768px, and 1024px viewports without overflow (Playwright Pixel 7 + Desktop suites, 2025-09-29)
- [x] Test zooming/pinch gestures maintain grid usability (Safari iPhone emulation `npx playwright test --config=playwright.cross.config.js --project=webkit-ios --grep "Game play flow"`, 2025-09-29)

## Performance

- [x] Run `npm run test:perf` and ensure budgets pass (Performance 0.96 / Accessibility 1.00, 2025-09-29)
- [x] Observe console for `interaction latency` logs under 100 ms (Playwright performance-smoke test)

## Cross-Browser

- [x] Chromium (Chrome/Edge) – `npm run test:e2e -- --project=chromium-desktop` (2025-09-29)
- [x] Firefox – `npx playwright test --config=playwright.cross.config.js --project=firefox-desktop --grep "Game play flow"` (2025-09-29)
- [x] Safari (WebKit) – `npx playwright test --config=playwright.cross.config.js --project=webkit-desktop --grep "Game play flow"` (2025-09-29)
