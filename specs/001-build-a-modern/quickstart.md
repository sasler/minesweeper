# Quickstart: Modern Minesweeper Experience

## Prerequisites

- Node.js 20+
- npm or pnpm
- Modern browser (Chrome, Firefox, Safari, Edge)

## Setup

1. `npm install` (initializes linting, Jest, Playwright tooling)
2. `npm run build` (bundles static assets, validates bundle size)
3. `npm run test:unit` (runs Jest suite)
4. `npm run test:e2e` (runs Playwright flows with axe checks)

## Local Development

1. `npm run dev` launches Vite (or equivalent static dev server) at `http://localhost:5173`.
2. Open the URL in desktop and mobile emulation to verify responsive layout.
3. Toggle the touch-mode button and ensure flag placement works via touch emulation.

## Validation Checklist

- **Gameplay**: Winning reveals all safe tiles; losing reveals mines; restart resets timer while keeping difficulty.
- **Accessibility**: Keyboard navigation covers entire grid, live region announces timer updates, contrast tokens verify via axe reports.
- **Performance**: Lighthouse score ≥ 90 on Performance; interaction latency logs remain under 100 ms (check console output).
- **Debug Export**: Use devtools command `window.__minesweeper.debugExport()` to review board state without exposing spoilers to players.
