# Implementation Plan: Modern Minesweeper Experience

**Branch**: `001-build-a-modern` | **Date**: 2025-09-29 | **Spec**: specs/001-build-a-modern/spec.md
**Input**: Feature specification from `specs/001-build-a-modern/spec.md`

## Execution Flow (/plan command scope)

```text
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Build a faithful Minesweeper web app using semantic HTML, responsive CSS, and modular vanilla JavaScript. Deliver canonical gameplay across Beginner, Intermediate, and Expert boards with first-click safety, auto-flood reveal, persistent HUD (timer, mine counter, restart), touch-friendly flag toggles, WCAG 2.1 AA accessibility, and cross-device performance budgets.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2020)  
**Primary Dependencies**: None (vanilla JS only)  
**Storage**: In-memory browser state (no persistence)  
**Testing**: Jest (DOM environment) + Playwright for accessibility/performance smoke tests  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge) on desktop, tablet, mobile  
**Project Type**: Single-page web application  
**Performance Goals**: ≤100 ms input latency, 60 FPS desktop, 30 FPS low-power mobile, <1 MB initial payload  
**Constraints**: WCAG 2.1 AA compliance, deterministic seeded boards with first-click safety, no external frameworks  
**Scale/Scope**: 3 difficulty presets, single-player session, offline-capable static bundle

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Gameplay fidelity covered via deterministic seeding, canonical mine counts, and rule-compliant reveal logic (FR-001 to FR-004, FR-011).
- Responsive layout plan ensures board and HUD stay visible from 320 px to desktop using CSS grid + flex, with shared design tokens.
- Accessibility mitigations include ARIA roles for tiles/status, keyboard focus model, persistent touch toggle, contrast tokens, and automated axe scans.
- Code structure organized into ES module layers (grid generation, mine seeding, tile reveal, game state, HUD) with Jest unit coverage and Playwright flows; no external deps.
- Performance budgets enforced via build size checks (<1 MB), interaction latency instrumentation, and Lighthouse/RAIL metrics collected in CI.

Initial Constitution Check: PASS (meets principles with planned mitigations, no deviations).

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```text
src/
├── index.html
├── assets/
│   └── icons/
├── styles/
│   ├── tokens.css
│   ├── layout.css
│   └── components/
│       └── board.css
└── scripts/
      ├── core/
      │   ├── board-generator.js
      │   ├── mine-seeder.js
      │   └── tile-reveal.js
      ├── state/
      │   ├── game-state.js
      │   └── hud-state.js
      ├── ui/
      │   ├── renderer.js
      │   └── accessibility.js
      └── main.js

tests/
├── unit/
│   ├── board-generator.test.js
│   ├── mine-seeder.test.js
│   └── tile-reveal.test.js
├── integration/
│   └── game-playflow.test.js
└── accessibility/
      └── axe-smoke.test.js
```

**Structure Decision**: Single-page web app under `src/` with ES module folders for core logic, state, and UI. Tests mirror module topology to support targeted Jest and Playwright suites.

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:

   - Validate deterministic seeding + first-click safety algorithm for classic difficulties.
   - Identify responsive layout strategy for board scaling across breakpoints.
   - Confirm accessibility patterns (ARIA roles, keyboard navigation, touch toggle UX).
   - Determine benchmarking approach for measuring latency/FPS/build size in CI.

2. **Generate and dispatch research agents**:

   ```text
   Task: "Research deterministic Minesweeper seeding with first-click safety for vanilla JS implementation"
   Task: "Identify responsive CSS grid techniques to scale Minesweeper boards at 320px, 768px, 1024px"
   Task: "Document ARIA roles and keyboard patterns for grid-based games with touch toggle modes"
   Task: "Outline tooling to measure Lighthouse performance, RAIL metrics, and interaction latency in CI"
   ```

3. **Consolidate findings** in `research.md` using format:

   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

Prerequisites: research.md complete.

1. **Extract entities from feature spec** → `data-model.md`:

   - Capture `GameConfig`, `BoardState`, `TileState`, `HUDState`, and `InputAction` schemas.
   - Document invariants: mine counts, reveal statuses, timer lifecycle, accessibility labels.

2. **Generate API contracts** from functional requirements:

   - Define ES module interfaces for `boardGenerator`, `mineSeeder`, `tileRevealer`, and `gameState`.
   - Document module inputs/outputs/events in `/contracts/module-contracts.md`.
   - Specify DOM event contracts for HUD updates and touch toggle state.

3. **Generate contract tests** from contracts:

   - Plan Jest unit stubs ensuring modules enforce invariants before implementation.
   - Outline Playwright scenario verifying HUD updates and accessibility events.

4. **Extract test scenarios** from user stories:

   - Map acceptance scenarios into Playwright flows for win/loss conditions.
   - Document edge-case tests (first-click mine, rapid interactions, keyboard navigation).

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

Post-Design Constitution Check: PASS (design artifacts uphold gameplay fidelity, responsiveness, accessibility, maintainability, and performance budgets).

## Phase 2: Task Planning Approach

Scope note: This section describes what the /tasks command will do - DO NOT execute during /plan.

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base.
- Derive setup tasks for static site tooling (linting, format, test harness).
- Create unit test tasks for each module contract (board generator, mine seeder, tile reveal, game state, HUD).
- Generate integration tasks for Playwright flows (win, loss, accessibility checks).
- Add implementation tasks per module followed by styling and accessibility polish.
- Include performance validation task to capture Lighthouse and interaction metrics.

**Ordering Strategy**:

- TDD cadence: write Jest/Playwright tests prior to implementing modules.
- Module dependency order: core logic → state management → UI renderer → accessibility layer → HUD integration → styling.
- Mark [P] where files do not overlap (e.g., different modules/tests).

**Estimated Output**: 26-30 numbered tasks covering setup, tests, implementation, accessibility, performance, and documentation.

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan.

## Phase 3+: Future Implementation

These phases are beyond the scope of the /plan command.

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

Fill this table only if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|



## Progress Tracking

This checklist is updated during execution flow.

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
