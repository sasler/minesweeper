import { describe, expect, it } from '@jest/globals';
import { revealTile } from '../../src/scripts/core/tile-reveal.js';

const baseBoard = [
  [
    { row: 0, column: 0, isMine: false, adjacentMines: 0, isRevealed: false, isFlagged: false, isQuestioned: false, ariaLabel: '' },
    { row: 0, column: 1, isMine: false, adjacentMines: 1, isRevealed: false, isFlagged: false, isQuestioned: false, ariaLabel: '' },
    { row: 0, column: 2, isMine: true, adjacentMines: 0, isRevealed: false, isFlagged: false, isQuestioned: false, ariaLabel: '' }
  ],
  [
    { row: 1, column: 0, isMine: false, adjacentMines: 0, isRevealed: false, isFlagged: false, isQuestioned: false, ariaLabel: '' },
    { row: 1, column: 1, isMine: false, adjacentMines: 1, isRevealed: false, isFlagged: false, isQuestioned: false, ariaLabel: '' },
    { row: 1, column: 2, isMine: false, adjacentMines: 1, isRevealed: false, isFlagged: false, isQuestioned: false, ariaLabel: '' }
  ],
  [
    { row: 2, column: 0, isMine: false, adjacentMines: 0, isRevealed: false, isFlagged: false, isQuestioned: false, ariaLabel: '' },
    { row: 2, column: 1, isMine: false, adjacentMines: 0, isRevealed: false, isFlagged: false, isQuestioned: false, ariaLabel: '' },
    { row: 2, column: 2, isMine: false, adjacentMines: 1, isRevealed: false, isFlagged: false, isQuestioned: false, ariaLabel: '' }
  ]
];

function cloneBoard() {
  return baseBoard.map((row) => row.map((tile) => ({ ...tile })));
}

describe('revealTile', () => {
  it('reveals contiguous empty tiles and stops at numbered edges', () => {
    const { updatedBoard, revealedPositions, hitMine } = revealTile(cloneBoard(), { row: 0, column: 0 });

    expect(hitMine).toBe(false);
    const revealedCoordinates = new Set(revealedPositions.map(({ row, column }) => `${row}:${column}`));
    expect(revealedCoordinates.has('0:0')).toBe(true);
    expect(revealedCoordinates.has('1:0')).toBe(true);
    expect(revealedCoordinates.has('2:0')).toBe(true);
    expect(revealedCoordinates.has('0:1')).toBe(true);
    expect(updatedBoard[0][1].isRevealed).toBe(true);
    expect(updatedBoard[0][2].isRevealed).toBe(false);
  });

  it('throws when attempting to reveal an already revealed tile', () => {
    const board = cloneBoard();
    board[0][0].isRevealed = true;

    expect(() => revealTile(board, { row: 0, column: 0 })).toThrow('InvalidReveal');
  });
});
