# Architecture Overview

## Module Layers

- **Core** (`src/scripts/core/`): board generation, deterministic seeding, reveal mechanics.
- **State** (`src/scripts/state/`): orchestrates BoardState/HUDState and timers.
- **UI** (`src/scripts/ui/`): renderer and accessibility helpers.
- **Entry Point** (`src/scripts/main.js`): event wiring, performance instrumentation, debug hooks.

## Data Flow

1. `main.js` dispatches `InputAction` events based on user interaction.
2. `state/game-state.js` seeds mines as needed and advances `BoardState` + `HUDState`.
3. `ui/renderer.js` translates state to DOM updates; `ui/accessibility.js` augments ARIA metadata.
4. HUD metrics update timers/mine counts; performance logs surfaced via `performance.measure`.

## Key Documents

- [Data Model](../specs/001-build-a-modern/data-model.md)
- [Module Contracts](../specs/001-build-a-modern/contracts/module-contracts.md)
- [Manual QA Checklist](./manual-testing.md)

## Testing Strategy

- **Jest** (`tests/unit/`): Validates core logic, state transitions, and accessibility helpers.
- **Playwright** (`tests/integration/`, `tests/accessibility/`): Exercises win/loss flows, axe scans, and performance smoke checks.
- **Lighthouse CI** (`lighthouserc.json`): Enforces performance ≥0.9 and accessibility ≥0.95 scores.

## Performance & Observability

- `performance.mark`/`measure` capture reveal + flag latency, logged to console.
- Bundle size capped at 1 MB via `tools/check-bundle-size.mjs` invoked post-build.
- Debug export available through `window.__minesweeper.debugExport()`.
