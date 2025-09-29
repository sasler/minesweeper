import { describe, expect, it } from '@jest/globals';
import { advanceState, createInitialGameState } from '../../src/scripts/state/game-state.js';

const baseConfig = Object.freeze({
  difficulty: 'beginner',
  rows: 9,
  columns: 9,
  mineCount: 10,
  seed: 'state-seed'
});

describe('advanceState', () => {
  it('starts the timer and moves to in-progress on first reveal', () => {
    const initial = createInitialGameState(baseConfig);
    const { board, hud } = advanceState(initial, {
      type: 'reveal',
      position: { row: 0, column: 0 },
      source: 'mouse',
      timestamp: 100
    }, baseConfig);

    expect(board.status).toBe('in-progress');
    expect(board.isFirstClickResolved).toBe(true);
    expect(hud.isTimerRunning).toBe(true);
    expect(hud.timeElapsedMs).toBe(0);
  });

  it('announces a win and stops the timer when all safe tiles are revealed', () => {
    const initial = createInitialGameState(baseConfig);
    const firstReveal = advanceState(initial, {
      type: 'reveal',
      position: { row: 0, column: 0 },
      source: 'mouse',
      timestamp: 50
    }, baseConfig);

    const totalSafeTiles = baseConfig.rows * baseConfig.columns - baseConfig.mineCount;
    const boardClone = {
      ...firstReveal.board,
      tiles: firstReveal.board.tiles.map((row) => row.map((tile) => ({ ...tile }))),
      revealedSafeCount: totalSafeTiles - 1,
      status: 'in-progress'
    };
    const hudClone = {
      ...firstReveal.hud,
      isTimerRunning: true,
      timeElapsedMs: 1_200
    };

    const nextTarget = boardClone.tiles
      .flat()
      .find((tile) => !tile.isMine && !tile.isRevealed);

    const { board, hud } = advanceState({ board: boardClone, hud: hudClone }, {
      type: 'reveal',
      position: { row: nextTarget.row, column: nextTarget.column },
      source: 'mouse',
      timestamp: 1_300
    }, baseConfig);

    expect(board.status).toBe('won');
    expect(hud.isTimerRunning).toBe(false);
    expect(hud.message.toLowerCase()).toContain('won');
  });
});
