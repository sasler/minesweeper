# Module Contracts: Modern Minesweeper Experience

## board-generator.js

- Purpose: Produce a 2D array of `TileState` shells with coordinates and default flags.
- Signature: `createEmptyBoard(config: GameConfig): TileState[][]`
- Preconditions:
  - `config.rows`, `config.columns`, `config.mineCount` validated against canonical presets.
- Postconditions:
  - Returns array sized `rows × columns` with `isMine=false`, `adjacentMines=0`, `isRevealed=false`, `isFlagged=false`, `isQuestioned=false`.
- Errors:
  - Throws `RangeError` if dimensions invalid.

## mine-seeder.js

- Purpose: Place mines deterministically based on `config.seed` while honoring first-click safety.
- Signature: `seedMines(board: TileState[][], config: GameConfig, safePosition: { row: number; column: number }): TileState[][]`
- Preconditions:
  - `safePosition` within board bounds.
  - `BoardState.isFirstClickResolved === false`.
- Postconditions:
  - Exactly `config.mineCount` tiles flagged with `isMine=true` excluding `safePosition` and its eight neighbors on first invocation.
  - Subsequent calls return board unchanged if seeding already performed.
- Errors:
  - Throws `Error('SeedCollision')` if deterministic placement cannot satisfy safety (should trigger fallback swap).

## tile-reveal.js

- Purpose: Resolve reveal logic, auto-flood empty tiles, and emit reveal events.
- Signature: `revealTile(board: TileState[][], position: { row: number; column: number }): RevealResult`
- RevealResult:
  - `updatedBoard`: TileState[][]
  - `revealedPositions`: Array<{ row: number; column: number }>
  - `hitMine`: boolean
- Preconditions:
  - Position within bounds.
  - Tile not already revealed or flagged.
- Postconditions:
  - Returns updated board with flood fill applied when `adjacentMines === 0`.
  - Emits all revealed positions for HUD updates.
- Errors:
  - Throws `Error('InvalidReveal')` if tile already revealed.

## game-state.js

- Purpose: Central orchestrator handling `InputAction` events and producing new `BoardState`/`HUDState` snapshots.
- Signature: `advanceState(prev: { board: BoardState; hud: HUDState }, action: InputAction, config: GameConfig): { board: BoardState; hud: HUDState }`
- Preconditions:
  - `config` matches existing session difficulty.
  - `action.timestamp` ≥ previous action timestamp.
- Postconditions:
  - Maintains state machine transitions defined in data-model.
  - Updates HUD timer/mine counter/touch mode per action.
  - When `hitMine`, sets `board.status='lost'` and reveals all mines.
  - When all safe tiles revealed, sets `board.status='won'` and freezes timer.
- Errors:
  - Throws `Error('IllegalAction')` for interactions inconsistent with current status (e.g., reveal after win).

## renderer.js

- Purpose: Translate state into DOM updates without mutating source data.
- Signature: `render(board: BoardState, hud: HUDState, mounts: RenderMounts): void`
- RenderMounts:
  - `gridRoot`: HTMLElement
  - `timerElement`: HTMLElement
  - `mineCounterElement`: HTMLElement
  - `messageRegion`: HTMLElement (aria-live)
  - `touchToggle`: HTMLButtonElement
- Preconditions:
  - Mount elements exist and are focusable as required.
- Postconditions:
  - DOM reflects latest state including focus indicators, aria attributes, and classes for styling.
  - Renderer preserves existing event listeners (delegated to main.js).
- Errors:
  - Throws `Error('MountMissing')` if required mount not supplied.

## accessibility.js

- Purpose: Provide helpers for focus management, aria labels, and live region messaging.
- Signature: `enhanceAccessibility(options: AccessibilityOptions): AccessibilityAPI`
- AccessibilityOptions includes references to mounts and board dimensions.
- AccessibilityAPI exports:
  - `applyTileAttributes(tile: TileState, element: HTMLElement): void`
  - `announceStatus(message: string): void`
  - `syncFocus(position: { row: number; column: number }): void`
- Postconditions:
  - Tiles receive correct aria attributes, `aria-pressed`, and `aria-describedby` references.
  - Status announcements batched to avoid screen reader chatter.
- Errors:
  - Throws `Error('AccessibilityInit')` if required DOM hooks missing.

## Event Contracts

- `GameStateEvents`
  - `type`: "stateUpdated"
  - `payload`: { board: BoardState; hud: HUDState }
- `HudEvents`
  - `type`: "hudUpdated"
  - `payload`: { remainingMines: number; timeElapsedMs: number; message: string }
- `TouchToggleEvents`
  - `type`: "touchModeChanged"
  - `payload`: { mode: "reveal" | "flag" }

All events dispatched via a shared emitter exposed from `main.js` to keep modules decoupled while supporting instrumentation hooks.
