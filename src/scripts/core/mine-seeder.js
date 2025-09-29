const FIRST_CALL_SYMBOL = Symbol('minesSeeded');

function hashSeed(seed) {
  let hash = 0;
  const text = String(seed);
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0; // Convert to 32-bit integer
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let t = seed + 0x6d2b79f5;
  return function next() {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function validateInputs(board, config, safePosition) {
  if (!Array.isArray(board) || board.length === 0) {
    throw new Error('Board must be a non-empty 2D array.');
  }

  if (!config || typeof config.mineCount !== 'number') {
    throw new Error('Game configuration with mine count is required.');
  }

  if (!safePosition || typeof safePosition.row !== 'number' || typeof safePosition.column !== 'number') {
    throw new Error('Safe position with row and column is required.');
  }

  const rows = board.length;
  const columns = board[0].length;

  if (
    safePosition.row < 0 ||
    safePosition.row >= rows ||
    safePosition.column < 0 ||
    safePosition.column >= columns
  ) {
    throw new Error('Safe position must be within board bounds.');
  }
}

function getNeighbors(row, column, rows, columns) {
  const neighbors = [];
  for (let dRow = -1; dRow <= 1; dRow += 1) {
    for (let dColumn = -1; dColumn <= 1; dColumn += 1) {
      if (dRow === 0 && dColumn === 0) {
        continue;
      }
      const targetRow = row + dRow;
      const targetColumn = column + dColumn;
      if (targetRow >= 0 && targetRow < rows && targetColumn >= 0 && targetColumn < columns) {
        neighbors.push([targetRow, targetColumn]);
      }
    }
  }
  return neighbors;
}

function markAdjacentCounts(board, mineCoordinates) {
  const rows = board.length;
  const columns = board[0].length;

  for (const [row, column] of mineCoordinates) {
    const neighbors = getNeighbors(row, column, rows, columns);
    for (const [nRow, nColumn] of neighbors) {
      board[nRow][nColumn].adjacentMines += 1;
    }
  }
}

export function seedMines(board, config, safePosition) {
  validateInputs(board, config, safePosition);

  if (board[FIRST_CALL_SYMBOL]) {
    return board;
  }

  const rows = board.length;
  const columns = board[0].length;

  const available = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      available.push([row, column]);
    }
  }

  if (available.length < config.mineCount) {
    throw new Error('SeedCollision');
  }

  const rng = mulberry32(hashSeed(String(config.seed)));
  const mineCoordinates = [];
  const candidates = [...available];

  while (mineCoordinates.length < config.mineCount) {
    const index = Math.floor(rng() * candidates.length);
    const [row, column] = candidates[index];
    mineCoordinates.push([row, column]);
    candidates.splice(index, 1);
  }

  for (const [row, column] of mineCoordinates) {
    board[row][column].isMine = true;
  }

  markAdjacentCounts(board, mineCoordinates);

  Object.defineProperty(board, FIRST_CALL_SYMBOL, {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false
  });

  return board;
}

export default seedMines;
