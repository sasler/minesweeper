import { describe, expect, it } from '@jest/globals';
import { createInitialHudState, reduceHudState } from '../../src/scripts/state/hud-state.js';

const config = Object.freeze({
  difficulty: 'beginner',
  rows: 9,
  columns: 9,
  mineCount: 10,
  seed: 'hud-seed'
});

describe('HUD state helpers', () => {
  it('initializes remaining mines and message defaults', () => {
    const hud = createInitialHudState(config);

    expect(hud.remainingMines).toBe(config.mineCount);
    expect(hud.isTimerRunning).toBe(false);
    expect(hud.touchMode).toBe('reveal');
    expect(hud.message.length).toBeGreaterThan(0);
  });

  it('adjusts remaining mines when flags toggle', () => {
    const initial = createInitialHudState(config);
    const flagged = reduceHudState(initial, { type: 'flag-change', delta: -1 });
    const unflagged = reduceHudState(flagged, { type: 'flag-change', delta: 1 });

    expect(flagged.remainingMines).toBe(config.mineCount - 1);
    expect(unflagged.remainingMines).toBe(config.mineCount);
  });

  it('switches touch mode between reveal and flag', () => {
    const initial = createInitialHudState(config);
    const flaggedMode = reduceHudState(initial, { type: 'touch-mode', mode: 'flag' });
    const revealMode = reduceHudState(flaggedMode, { type: 'touch-mode', mode: 'reveal' });

    expect(flaggedMode.touchMode).toBe('flag');
    expect(revealMode.touchMode).toBe('reveal');
  });

  it('tracks timer deltas while running', () => {
    const initial = reduceHudState(createInitialHudState(config), { type: 'timer-start' });
    const afterTicks = reduceHudState(initial, { type: 'timer-tick', deltaMs: 250 });
    const stopped = reduceHudState(afterTicks, { type: 'timer-stop', finalMessage: 'Game over' });

    expect(afterTicks.timeElapsedMs).toBe(250);
    expect(stopped.isTimerRunning).toBe(false);
    expect(stopped.message).toBe('Game over');
  });
});
