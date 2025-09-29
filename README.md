# Modern Minesweeper

Modern, accessible Minesweeper built with vanilla HTML, CSS, and JavaScript.

## Getting Started

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173` in your browser.

## Quality Gates

- `npm run lint` – ESLint (flat config)
- `npm run test:unit` – Jest unit suite
- `npm run test:e2e -- --project=chromium-desktop` – Playwright desktop smoke
- `npm run test:e2e -- --project=chromium-mobile` – Playwright mobile viewport smoke
- `npm run test:perf` – Build + Lighthouse CI (requires Playwright browsers)

## Performance Snapshot (2025-09-29)

- Lighthouse performance score: **0.96**
- Lighthouse accessibility score: **1.00**
- Key metrics:
  - First Contentful Paint: 2.1 s
  - Speed Index: 2.9 s
  - Total Blocking Time: 90 ms
  - Largest Contentful Paint: 2.2 s
  - Cumulative Layout Shift: 0.002
- Artifact: `docs/performance/lighthouse-2025-09-29.json`

## Accessibility Audit

- Playwright axe smoke (Chromium desktop & mobile) reports: 0 violations
- Keyboard trap prevention: initial Tab focuses tile `0,0`
- Touch toggle announces mode changes via polite live region

## Debugging Tips

- Use `window.__minesweeper.debugExport()` to capture board/hud snapshots
- Performance markers: check devtools console for `interaction latency` logs after flag/reveal actions
