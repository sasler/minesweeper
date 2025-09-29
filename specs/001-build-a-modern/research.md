# Research: Modern Minesweeper Experience

## Deterministic Seeding & First-Click Safety

- Decision: Seed boards with `GameSession.seed` per difficulty and regenerate placement when the first reveal targets a mine, swapping mine with a safe tile.
- Rationale: Matches canonical gameplay, guarantees reproducibility for QA, and preserves first-click safety without distorting mine counts.
- Alternatives considered: Delayed mine placement until first click (simpler) but complicates deterministic seeding for debugging.

## Responsive Layout Strategy

- Decision: Use CSS Grid for the board with dynamic `fr` sizing and clamp-based scaling, wrapped in a flex container that reflows HUD above (mobile) or beside (desktop).
- Rationale: Grid simplifies square cell sizing while clamps prevent overflow on 320 px devices; flex allows HUD repositioning without DOM duplication.
- Alternatives considered: Canvas rendering (performance) but harder for accessibility and responsive semantics.

## Accessibility Interaction Model

- Decision: Represent the board as a `role="grid"` with `gridcell` buttons, manage focus via arrow keys, provide status updates via `aria-live="polite"`, and expose a persistent touch-mode toggle.
- Rationale: Aligns with WAI-ARIA Authoring Practices, supports keyboard and assistive tech parity, and reflects clarification answer for touch controls.
- Alternatives considered: Custom key bindings without ARIA semantics (lighter) but fails WCAG keyboard operability.

## Performance & Observability Tooling

- Decision: Instrument interaction latency via `performance.mark` around reveal/flag handlers, run Lighthouse CI with RAIL metrics, and enforce <1 MB bundle via build script check.
- Rationale: Provides measurable verification of constitution performance budgets and prevents regressions in load size.
- Alternatives considered: Manual spot checks (lower effort) but insufficient for ongoing compliance.

## Testing Approach

- Decision: Use Jest with JSDOM for unit coverage, Playwright for end-to-end (win, loss, accessibility), and axe-core automated accessibility checks in CI.
- Rationale: Offers fast feedback for logic while ensuring accessibility/performance validations before release.
- Alternatives considered: Cypress (similar coverage) but heavier dependency footprint for a vanilla JS stack.
