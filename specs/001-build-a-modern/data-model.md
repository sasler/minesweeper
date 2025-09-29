# Data Model: Modern Minesweeper Experience

## Entities

### GameConfig

- Description: Immutable configuration derived from difficulty selection.
- Fields:
  - `difficulty` ("beginner" | "intermediate" | "expert")
  - `rows` (number)
  - `columns` (number)
  - `mineCount` (number)
  - `seed` (string)
- Invariants:
  - Mine count matches canonical difficulty mapping.
  - Rows × columns ≥ mineCount + 1 to preserve first-click safety.

### BoardState

- Description: Aggregated state for the Minesweeper grid.
- Fields:
  - `tiles` (TileState[][])
  - `revealedSafeCount` (number)
  - `isFirstClickResolved` (boolean)
  - `status` ("idle" | "in-progress" | "won" | "lost")
- Invariants:
  - `revealedSafeCount` + `mineCount` = total tiles when `status === "won"`.
  - `status` transitions: idle → in-progress → (won | lost) only.

### TileState

- Description: Represents an individual cell.
- Fields:
  - `row` (number)
  - `column` (number)
  - `isMine` (boolean)
  - `adjacentMines` (number 0-8)
  - `isRevealed` (boolean)
  - `isFlagged` (boolean)
  - `isQuestioned` (boolean)
  - `ariaLabel` (string)
- Invariants:
  - `isFlagged` and `isQuestioned` cannot both be true.
  - `ariaLabel` derived from reveal state and must match WCAG guidelines.

### HUDState

- Description: Heads-up display metrics and controls.
- Fields:
  - `timeElapsedMs` (number)
  - `remainingMines` (number)
  - `isTimerRunning` (boolean)
  - `message` (string)
  - `touchMode` ("reveal" | "flag")
- Invariants:
  - `remainingMines` updates when flags toggle.
  - Timer starts on first reveal and stops on win/loss.

### InputAction

- Description: User intent emitted by UI layer.
- Fields:
  - `type` ("reveal" | "flag" | "question" | "chord" | "restart" | "toggleTouchMode")
  - `position` ({ row: number; column: number } | null)
  - `source` ("mouse" | "keyboard" | "touch" | "assistive")
  - `timestamp` (DOMHighResTimeStamp)
- Invariants:
  - `position` required when `type` relates to tile interactions.
  - `timestamp` monotonic to support latency measurement.

## Relationships

- `GameConfig` feeds into `BoardState` initialization and mine seeding.
- `BoardState.tiles` composed of `TileState` objects.
- `HUDState` derives values from `BoardState` and user actions, emitting updates to renderer.
- `InputAction` drives state transitions in both `BoardState` and `HUDState`.

## State Transitions

1. Idle → In-Progress: first `InputAction` of type `reveal` resolves first-click safety and starts timer.
2. In-Progress → Won: `revealedSafeCount` equals total safe tiles; HUD message updates and timer stops.
3. In-Progress → Lost: `InputAction` reveal mines; board reveals all mines; HUD message updates and timer stops.
4. Any state → Idle: `restart` resets `BoardState`, regenerates mines with preserved difficulty, clears HUD.

## Accessibility Metadata

- Each `TileState` maps to DOM button with `aria-pressed` for reveal status and `aria-describedby` linking to live region for HUD updates.
- `HUDState.message` announced via polite live region; all updates throttled to avoid chatter.
