const LAST_TICK = Symbol('lastTick');

function attachLastTick(state, value = null) {
  Object.defineProperty(state, LAST_TICK, {
    value,
    enumerable: false,
    configurable: true,
    writable: true
  });
  return state;
}

function cloneState(state) {
  const clone = { ...state };
  attachLastTick(clone, state[LAST_TICK] ?? null);
  return clone;
}

export function createInitialHudState(config) {
  const initial = {
    timeElapsedMs: 0,
    remainingMines: config.mineCount,
    isTimerRunning: false,
    message: 'Ready to play',
    touchMode: 'reveal'
  };

  return cloneState(attachLastTick(initial));
}

export function reduceHudState(state, event) {
  if (!event || !event.type) {
    return state;
  }

  const next = cloneState(state);

  switch (event.type) {
    case 'flag-change': {
      const nextCount = next.remainingMines + event.delta;
      next.remainingMines = Math.max(0, nextCount);
      next.message = `Mines remaining: ${next.remainingMines}`;
      break;
    }
    case 'touch-mode': {
      next.touchMode = event.mode;
      if (event.mode === 'flag') {
        next.message = 'Flag mode enabled';
      }
      break;
    }
    case 'timer-start': {
      next.isTimerRunning = true;
      next[LAST_TICK] = event.timestamp ?? null;
      break;
    }
    case 'timer-tick': {
      if (next.isTimerRunning && typeof event.deltaMs === 'number' && event.deltaMs > 0) {
        next.timeElapsedMs += event.deltaMs;
      }
      break;
    }
    case 'timer-stop': {
      next.isTimerRunning = false;
      if (typeof event.finalMessage === 'string') {
        next.message = event.finalMessage;
      }
      break;
    }
    case 'status-message': {
      next.message = event.message;
      break;
    }
    default:
      break;
  }

  return next;
}

export default {
  createInitialHudState,
  reduceHudState
};
