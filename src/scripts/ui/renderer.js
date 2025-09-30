function formatMinesRemaining(count) {
  return count.toString().padStart(3, '0');
}

function formatElapsedTime(timeMs) {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function buildTileClassList(tile) {
  const classes = ['tile'];
  if (tile.isRevealed) {
    classes.push('tile--revealed');
    if (!tile.isMine && tile.adjacentMines === 0) {
      classes.push('tile--revealed-empty');
    }
    if (tile.isMine) {
      classes.push('tile--mine');
    } else if (tile.adjacentMines > 0) {
      classes.push(`tile--hint-${tile.adjacentMines}`);
    }
  } else {
    classes.push('tile--hidden');
  }
  if (tile.isFlagged) {
    classes.push('tile--flagged');
  }
  if (tile.isQuestioned) {
    classes.push('tile--questioned');
  }
  return classes.join(' ');
}

function tileContent(tile) {
  if (tile.isRevealed) {
    if (tile.isMine) {
      return '💣';
    }
    return tile.adjacentMines > 0 ? String(tile.adjacentMines) : '';
  }
  if (tile.isFlagged) {
    return '🚩';
  }
  if (tile.isQuestioned) {
    return '?';
  }
  return '';
}

export function render(board, hud, mounts, helpers = {}) {
  if (!mounts?.gridRoot) {
    throw new Error('MountMissing');
  }

  const { gridRoot, timerElement, mineCounterElement, messageRegion, touchToggle, newGameButton } = mounts;
  const { applyTileAttributes } = helpers;

  gridRoot.setAttribute('role', 'grid');
  gridRoot.setAttribute('aria-label', 'Minesweeper board');
  gridRoot.style.setProperty('--rows', board.tiles.length);
  gridRoot.style.setProperty('--columns', board.tiles[0]?.length ?? 0);
  gridRoot.innerHTML = '';

  const fragment = document.createDocumentFragment();

  board.tiles.forEach((rowTiles) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'board__row';
    rowElement.setAttribute('role', 'row');

    rowTiles.forEach((tile) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.row = String(tile.row);
      button.dataset.column = String(tile.column);
      button.dataset.testid = `tile-${tile.row}-${tile.column}`;
      button.className = buildTileClassList(tile);
      button.textContent = tileContent(tile);

      if (typeof applyTileAttributes === 'function') {
        applyTileAttributes(tile, button);
      }

      rowElement.appendChild(button);
    });

    fragment.appendChild(rowElement);
  });

  gridRoot.appendChild(fragment);

  if (timerElement) {
    timerElement.textContent = formatElapsedTime(hud.timeElapsedMs ?? 0);
  }

  if (mineCounterElement) {
    mineCounterElement.textContent = formatMinesRemaining(hud.remainingMines ?? 0);
  }

  if (messageRegion) {
    messageRegion.textContent = hud.message ?? '';
  }

  if (touchToggle) {
    const isFlagMode = hud.touchMode === 'flag';
    touchToggle.setAttribute('aria-pressed', String(isFlagMode));
    touchToggle.textContent = isFlagMode ? 'Reveal Mode' : 'Flag Mode';
  }

  if (newGameButton) {
    const shouldShowRestart = board.status === 'won' || board.status === 'lost';
    const label = shouldShowRestart ? 'Restart' : 'New Game';
    newGameButton.textContent = label;
    newGameButton.setAttribute('aria-label', label);
  }
}

export default { render };
