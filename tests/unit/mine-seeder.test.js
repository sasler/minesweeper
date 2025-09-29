import { describe, expect, it } from '@jest/globals';
import { seedMines } from '../../src/scripts/core/mine-seeder.js';

const config = Object.freeze({
  difficulty: 'beginner',
  rows: 9,
  columns: 9,
  mineCount: 10,
  seed: 'seed-beginner'
});

function createMockBoard(rows, columns) {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, column) => ({
      row,
      column,
      isMine: false,
      adjacentMines: 0,
      isRevealed: false,
      isFlagged: false,
      isQuestioned: false,
      ariaLabel: ''
    }))
  );
}

describe('seedMines', () => {
  it('places the same mine pattern for deterministic inputs', () => {
    const safePosition = { row: 0, column: 0 };
    const firstPass = seedMines(createMockBoard(config.rows, config.columns), config, safePosition);
    const secondPass = seedMines(createMockBoard(config.rows, config.columns), config, safePosition);

    const firstPattern = firstPass.flat().map((tile) => tile.isMine);
    const secondPattern = secondPass.flat().map((tile) => tile.isMine);

    expect(firstPattern).toEqual(secondPattern);
    expect(firstPattern.filter(Boolean)).toHaveLength(config.mineCount);
  });

  it('ignores the safe position when computing mine layout', () => {
    const centerSeeded = seedMines(
      createMockBoard(config.rows, config.columns),
      config,
      { row: 4, column: 4 }
    );
    const cornerSeeded = seedMines(
      createMockBoard(config.rows, config.columns),
      config,
      { row: 0, column: 0 }
    );

    const centerPattern = centerSeeded.flat().map((tile) => tile.isMine);
    const cornerPattern = cornerSeeded.flat().map((tile) => tile.isMine);

    expect(centerPattern).toEqual(cornerPattern);
  });
});
