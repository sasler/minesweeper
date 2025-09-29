import { describe, expect, it } from '@jest/globals';
import { createEmptyBoard } from '../../src/scripts/core/board-generator.js';

const beginnerConfig = Object.freeze({
  difficulty: 'beginner',
  rows: 9,
  columns: 9,
  mineCount: 10,
  seed: 'seed-beginner'
});

describe('createEmptyBoard', () => {
  it('creates a grid that matches the requested dimensions', () => {
    const board = createEmptyBoard(beginnerConfig);

    expect(board).toHaveLength(beginnerConfig.rows);
    board.forEach((row) => {
      expect(row).toHaveLength(beginnerConfig.columns);
    });
  });

  it('initializes every tile with safe defaults', () => {
    const board = createEmptyBoard(beginnerConfig);

    board.flat().forEach((tile, index) => {
      const expectedRow = Math.floor(index / beginnerConfig.columns);
      const expectedColumn = index % beginnerConfig.columns;

      expect(tile).toMatchObject({
        row: expectedRow,
        column: expectedColumn,
        isMine: false,
        adjacentMines: 0,
        isRevealed: false,
        isFlagged: false,
        isQuestioned: false
      });
      expect(typeof tile.ariaLabel).toBe('string');
    });
  });
});
