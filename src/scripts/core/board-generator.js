const MIN_ROWS = 1;
const MIN_COLUMNS = 1;

function validateConfig(config) {
  if (!config) {
    throw new RangeError('Game configuration is required.');
  }

  const { rows, columns, mineCount } = config;

  if (!Number.isInteger(rows) || rows < MIN_ROWS) {
    throw new RangeError('Rows must be a positive integer.');
  }

  if (!Number.isInteger(columns) || columns < MIN_COLUMNS) {
    throw new RangeError('Columns must be a positive integer.');
  }

  if (!Number.isInteger(mineCount) || mineCount < 0) {
    throw new RangeError('Mine count must be a non-negative integer.');
  }

  const totalTiles = rows * columns;
  if (totalTiles <= mineCount) {
    throw new RangeError('Mine count leaves no safe tiles.');
  }
}

export function createEmptyBoard(config) {
  validateConfig(config);

  const { rows, columns } = config;

  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, column) => ({
      row,
      column,
      isMine: false,
      adjacentMines: 0,
      isRevealed: false,
      isFlagged: false,
      isQuestioned: false,
      ariaLabel: `Hidden tile at row ${row + 1} column ${column + 1}`
    }))
  );
}

export default createEmptyBoard;
