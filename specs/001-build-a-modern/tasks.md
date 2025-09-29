# Tasks: Modern Minesweeper Experience

**Input**: Design documents from `C:/src/minesweeper/specs/001-build-a-modern/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Phase 3.1: Setup

- [X] T001 Scaffold project folders `src/` and `tests/` plus subdirectories per plan (`assets/`, `styles/`, `scripts/`, `tests/unit`, `tests/integration`, `tests/accessibility`).
- [X] T002 Initialize npm project, add scripts (`dev`, `build`, `test:unit`, `test:e2e`), install dev dependencies (Vite, Jest, Playwright, axe-core integrations, ESLint, Prettier).
- [X] T003 [P] Configure ESLint + Prettier with rules for ES2020 modules, accessibility linting, and integrate with npm scripts.
- [X] T004 [P] Set up Jest (JSDOM environment) with coverage thresholds and module path aliases for `src/scripts` modules.
- [X] T005 [P] Configure Playwright project with desktop/mobile matrix, axe-core fixtures, and performance trace collection.
- [X] T006 Establish npm script or CI check to enforce <1 MB bundle size using `npm run build` output.

## Phase 3.2: Tests First (TDD)

- [X] T007 Create Jest unit test skeleton for `src/scripts/core/board-generator.js` covering board dimensions and defaults.
- [X] T008 [P] Create Jest unit test skeleton for `src/scripts/core/mine-seeder.js` validating deterministic placement + first-click safety.
- [X] T009 [P] Create Jest unit test skeleton for `src/scripts/core/tile-reveal.js` covering flood-fill and invalid reveal errors.
- [X] T010 [P] Create Jest unit test skeleton for `src/scripts/state/game-state.js` asserting state machine transitions and HUD updates.
- [X] T011 [P] Create Jest unit test skeleton for `src/scripts/state/hud-state.js` ensuring timer, remaining mines, and touch toggle logic.
- [X] T012 [P] Create Jest unit test skeleton for `src/scripts/ui/accessibility.js` verifying aria attribute application and status announcements.
- [X] T013 [P] Create Playwright scenario `tests/integration/game-playflow.test.js` for win condition, HUD update, and restart flow.
- [X] T014 [P] Create Playwright scenario `tests/integration/game-loss-flow.test.js` for mine reveal, loss messaging, and restart reset.
- [X] T015 [P] Create Playwright accessibility suite `tests/accessibility/axe-smoke.test.js` asserting keyboard navigation, contrast, and touch toggle accessibility.
- [X] T016 Add performance smoke test in Playwright measuring reveal latency and FPS budget logging.

## Phase 3.3: Core Implementation

- [X] T017 Implement `src/scripts/core/board-generator.js` to produce empty board grid with TileState defaults.
- [X] T018 Implement `src/scripts/core/mine-seeder.js` with deterministic seeding, safety swap, and memoization after first run.
- [X] T019 Implement `src/scripts/core/tile-reveal.js` handling reveal logic, flood fill, and reveal event payloads.
- [X] T020 Implement `src/scripts/state/game-state.js` to process InputAction events and update BoardState/HUDState.
- [X] T021 Implement `src/scripts/state/hud-state.js` to manage timer, remaining mines, status messaging, and touch mode.
- [X] T022 Implement `src/scripts/ui/renderer.js` to render DOM grid, HUD, and respect focus + aria labels.
- [X] T023 Implement `src/scripts/ui/accessibility.js` helper functions for aria attributes, live announcements, and focus management.
- [X] T024 Implement `src/scripts/main.js` wiring event handlers, shared emitter, and debug export hook.
- [X] T025 Build `src/styles/tokens.css`, `layout.css`, and `components/board.css` to deliver responsive layout at 320px/768px/1024px targets.
- [X] T026 Construct semantic `src/index.html` with board container, HUD, status live region, touch toggle, and script/style references.

## Phase 3.4: Integration & Instrumentation

- [X] T027 Integrate performance instrumentation (`performance.mark/measure`) in reveal/flag handlers and expose logs in console.
- [X] T028 Wire Lighthouse CI script or npm task to capture performance + accessibility metrics and assert thresholds.
- [X] T029 Add debug export API `window.__minesweeper.debugExport()` for QA board inspection without revealing spoilers.
- [X] T030 Configure CI workflow (GitHub Actions) to run lint, Jest, Playwright (with traces), and bundle size check on pull requests.

## Phase 3.5: Polish & Validation

- [X] T031 [P] Create manual QA checklist (`docs/manual-testing.md`) referencing quickstart validation items and constitution principles.
- [X] T032 [P] Document architecture and module contracts in `docs/architecture.md`, linking to data model and event contracts.
- [X] T033 [P] Run final accessibility audit with Playwright axe suite and document results in release notes template.
- [X] T034 [P] Capture Lighthouse report artifacts and update README with performance metrics + instructions.
- [X] T035 Perform cross-browser smoke tests (Chrome, Firefox, Safari, Edge) and log findings in QA checklist.
- [X] T036 Conduct mobile touch testing (Chrome DevTools, iOS Simulator) ensuring touch toggle usability and update QA log.

## Dependencies

- Setup tasks (T001-T006) must complete before tests.
- Tests (T007-T016) must exist/fail before implementation tasks (T017-T026).
- Core modules T017-T024 depend on respective tests and should follow order: board-generator → mine-seeder → tile-reveal → game-state → hud-state → renderer → accessibility → main wiring.
- Styling (T025) depends on renderer scaffolding.
- Index HTML (T026) depends on structure decisions from renderer/styles.
- Integration tasks (T027-T030) depend on core implementation and tests.
- Polish tasks (T031-T036) depend on all prior tasks completing.

## Parallel Execution Example

```text
# After setup complete, run test skeleton tasks in parallel:
/specs 001-build-a-modern/tasks T008
/specs 001-build-a-modern/tasks T009
/specs 001-build-a-modern/tasks T010
/specs 001-build-a-modern/tasks T011
/specs 001-build-a-modern/tasks T012
/specs 001-build-a-modern/tasks T013
/specs 001-build-a-modern/tasks T014
/specs 001-build-a-modern/tasks T015
```

```text
# During polish phase, execute parallel documentation and audit updates:
/specs 001-build-a-modern/tasks T031
/specs 001-build-a-modern/tasks T032
/specs 001-build-a-modern/tasks T033
/specs 001-build-a-modern/tasks T034
```

## Notes

- [P] tasks operate on distinct files or artifacts.
- Ensure Jest/Playwright tests fail before implementing corresponding modules (TDD discipline).
- Commit after each task or logical grouping.
- Maintain constitution adherence: gameplay fidelity, responsive UI, accessibility, maintainable code, performance budgets.
- Keep bundle size and performance logs under version control for traceability.
