import { createEmptyBoard } from '../core/board-generator.js';
import { seedMines } from '../core/mine-seeder.js';
import { revealTile } from '../core/tile-reveal.js';
import { createInitialHudState, reduceHudState } from './hud-state.js';

const ILLEGAL_ACTION_ERROR = 'IllegalAction';

function cloneTiles(tiles) {
  if (!tiles || tiles.length === 0) {
    return [];
  }
  return tiles.map((row) => row.map((tile) => ({ ...tile })));
}

function ensurePosition(position, config) {
  if (!position) {
    throw new Error(ILLEGAL_ACTION_ERROR);
  }
  const { row, column } = position;
  if (row < 0 || row >= config.rows || column < 0 || column >= config.columns) {
    throw new Error(ILLEGAL_ACTION_ERROR);
  }
}

function initializeBoard(config) {
  return {
    tiles: createEmptyBoard(config),
    revealedSafeCount: 0,
    isFirstClickResolved: false,
    status: 'idle'
  };
}

function revealAllMines(board) {
  board.tiles.forEach((row) => {
    row.forEach((tile) => {
      if (tile.isMine) {
        tile.isRevealed = true;
      }
    });
  });
}

function getSafeTileTarget(config) {
  return config.rows * config.columns - config.mineCount;
}

export function advanceState(previous, action, config) {
  if (!action || !config) {
    throw new Error(ILLEGAL_ACTION_ERROR);
  }

  const prevBoard = previous.board ?? initializeBoard(config);
  const prevHud = previous.hud ?? createInitialHudState(config);

  const board = {
    ...prevBoard,
    tiles: cloneTiles(prevBoard.tiles)
  };
  let hud = { ...prevHud };

  if (action.type === 'restart') {
    return {
      board: initializeBoard(config),
      hud: createInitialHudState(config)
    };
  }

  if (board.status === 'won' || board.status === 'lost') {
    throw new Error(ILLEGAL_ACTION_ERROR);
  }

  switch (action.type) {
    case 'reveal': {
      ensurePosition(action.position, config);

      if (!board.isFirstClickResolved) {
        seedMines(board.tiles, config, action.position);
        board.isFirstClickResolved = true;
        board.status = 'in-progress';
        hud = reduceHudState(hud, { type: 'timer-start' });
      }

      const { updatedBoard, revealedPositions, hitMine } = revealTile(board.tiles, action.position);
      board.tiles = updatedBoard;

      const revealedSafe = revealedPositions.filter(({ row, column }) => !board.tiles[row][column].isMine).length;
      board.revealedSafeCount += revealedSafe;

      if (hitMine) {
        board.status = 'lost';
        revealAllMines(board);
        hud = reduceHudState(hud, { type: 'timer-stop', finalMessage: 'Boom! You lost.' });
      } else {
        board.status = 'in-progress';
        const totalSafeTiles = getSafeTileTarget(config);
        if (board.revealedSafeCount >= totalSafeTiles) {
          board.status = 'won';
          hud = reduceHudState(hud, { type: 'timer-stop', finalMessage: 'You won!' });
        } else if (revealedSafe > 0) {
          hud = reduceHudState(hud, { type: 'timer-tick', deltaMs: 0 });
        }
      }

      break;
    }
    case 'flag': {
      ensurePosition(action.position, config);
      const tile = board.tiles[action.position.row][action.position.column];
      if (tile.isRevealed) {
        throw new Error(ILLEGAL_ACTION_ERROR);
      }
      tile.isFlagged = !tile.isFlagged;
      hud = reduceHudState(hud, { type: 'flag-change', delta: tile.isFlagged ? -1 : 1 });
      break;
    }
    case 'toggleTouchMode': {
      const nextMode = action.mode ?? (hud.touchMode === 'reveal' ? 'flag' : 'reveal');
      hud = reduceHudState(hud, { type: 'touch-mode', mode: nextMode });
      break;
    }
    default: {
      throw new Error(ILLEGAL_ACTION_ERROR);
    }
  }

  return { board, hud };
}

export function createInitialGameState(config) {
  return {
    board: initializeBoard(config),
    hud: createInitialHudState(config)
  };
}

export default advanceState;
