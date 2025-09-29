function ensureValidTarget(board, position) {
  if (!position) {
    throw new Error('Position is required.');
  }

  const { row, column } = position;
  if (row < 0 || row >= board.length || column < 0 || column >= board[0].length) {
    throw new Error('InvalidReveal');
  }

  const tile = board[row][column];
  if (tile.isRevealed || tile.isFlagged) {
    throw new Error('InvalidReveal');
  }
}

function createKey(row, column) {
  return `${row}:${column}`;
}

function getNeighbors(row, column, rows, columns) {
  const neighbors = [];
  for (let dRow = -1; dRow <= 1; dRow += 1) {
    for (let dColumn = -1; dColumn <= 1; dColumn += 1) {
      if (dRow === 0 && dColumn === 0) {
        continue;
      }
      const nextRow = row + dRow;
      const nextColumn = column + dColumn;
      if (nextRow >= 0 && nextRow < rows && nextColumn >= 0 && nextColumn < columns) {
        neighbors.push([nextRow, nextColumn]);
      }
    }
  }
  return neighbors;
}

function updateAriaLabel(tile) {
  if (tile.isMine) {
    tile.ariaLabel = 'Mine';
  } else if (tile.adjacentMines > 0) {
    tile.ariaLabel = `${tile.adjacentMines} adjacent mines`;
  } else {
    tile.ariaLabel = 'Empty tile';
  }
}

export function revealTile(board, position) {
  ensureValidTarget(board, position);

  const rows = board.length;
  const columns = board[0].length;
  const queue = [position];
  const visited = new Set();
  const revealedPositions = [];
  let hitMine = false;

  while (queue.length > 0) {
    const current = queue.shift();
    const key = createKey(current.row, current.column);
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    const tile = board[current.row][current.column];

    if (tile.isFlagged || tile.isRevealed) {
      continue;
    }

    tile.isRevealed = true;
    tile.isQuestioned = false;
    updateAriaLabel(tile);
    revealedPositions.push({ row: tile.row, column: tile.column });

    if (tile.isMine) {
      hitMine = true;
      continue;
    }

    if (tile.adjacentMines === 0) {
      const neighbors = getNeighbors(tile.row, tile.column, rows, columns);
      neighbors.forEach(([nRow, nColumn]) => {
        const neighborTile = board[nRow][nColumn];
        if (!neighborTile.isRevealed && !neighborTile.isMine && !neighborTile.isFlagged) {
          queue.push({ row: nRow, column: nColumn });
        }
      });
    }
  }

  return { updatedBoard: board, revealedPositions, hitMine };
}

export default revealTile;
