import { createInitialGameState, advanceState } from './state/game-state.js';
import { enhanceAccessibility } from './ui/accessibility.js';
import { render } from './ui/renderer.js';

const DIFFICULTY_PRESETS = {
  beginner: { difficulty: 'beginner', rows: 9, columns: 9, mineCount: 10 },
  intermediate: { difficulty: 'intermediate', rows: 16, columns: 16, mineCount: 40 },
  expert: { difficulty: 'expert', rows: 16, columns: 30, mineCount: 99 }
};

function randomSeed() {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const seedParam = params.get('seed');
      if (seedParam) {
        return seedParam;
      }
      const override = window.__minesweeper?.seedOverride;
      if (typeof override === 'string' && override.length > 0) {
        return override;
      }
    } catch (error) {
      console.warn('SeedOverrideError', error);
    }
  }
  return 'seed-10';
}

function createConfig(presetKey) {
  const preset = DIFFICULTY_PRESETS[presetKey] ?? DIFFICULTY_PRESETS.beginner;
  return {
    ...preset,
    seed: randomSeed()
  };
}

function queryMount(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Mount element not found for selector ${selector}`);
  }
  return element;
}

function createMounts() {
  return {
    gridRoot: queryMount('[data-mount="grid"]'),
    timerElement: queryMount('[data-mount="timer"]'),
    mineCounterElement: queryMount('[data-mount="mine-counter"]'),
    messageRegion: queryMount('[data-mount="status"]'),
    touchToggle: queryMount('[data-mount="touch-toggle"]'),
    newGameButton: queryMount('[data-action="restart"]'),
    difficultySelect: queryMount('[data-mount="difficulty"]')
  };
}

function createEmitter() {
  const listeners = new Map();

  return {
    on(type, handler) {
      const handlers = listeners.get(type) ?? new Set();
      handlers.add(handler);
      listeners.set(type, handlers);
      return () => handlers.delete(handler);
    },
    emit(type, payload) {
      const handlers = listeners.get(type);
      if (!handlers) {
        return;
      }
      handlers.forEach((handler) => handler(payload));
    }
  };
}

function attachDebugExport(getSnapshot) {
  if (typeof window !== 'undefined') {
    window.__minesweeper = {
      ...(window.__minesweeper ?? {}),
      debugExport: getSnapshot
    };
  }
}

function positionFromTarget(target) {
  const row = Number.parseInt(target.dataset.row, 10);
  const column = Number.parseInt(target.dataset.column, 10);
  if (Number.isNaN(row) || Number.isNaN(column)) {
    return null;
  }
  return { row, column };
}

function bootstrap() {
  const mounts = createMounts();
  let config = createConfig(mounts.difficultySelect.value);
  let currentState = createInitialGameState(config);
  const emitter = createEmitter();

  const accessibility = enhanceAccessibility({
    gridRoot: mounts.gridRoot,
    liveRegion: mounts.messageRegion,
    boardDimensions: { rows: config.rows, columns: config.columns }
  });

  function update(nextState) {
    currentState = nextState;
    render(currentState.board, currentState.hud, mounts, {
      applyTileAttributes: accessibility.applyTileAttributes
    });
  }

  function dispatch(action) {
    const shouldMeasure = action.type === 'reveal' || action.type === 'flag';
    const startMark = shouldMeasure ? `msw:${action.type}:start` : null;
    const endMark = shouldMeasure ? `msw:${action.type}:end` : null;
    const measureName = shouldMeasure ? `msw:${action.type}:duration` : null;

    if (shouldMeasure) {
      performance.mark(startMark);
    }

    const result = advanceState(currentState, action, config);
    update(result);
    emitter.emit('stateUpdated', result);

    if (shouldMeasure && measureName) {
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
      const [entry] = performance.getEntriesByName(measureName).slice(-1);
      if (entry) {
        console.info(`interaction latency (${action.type}): ${entry.duration.toFixed(2)} ms`);
      }
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);
    }
  }

  function restartGame(nextDifficultyKey = config.difficulty) {
    config = createConfig(nextDifficultyKey);
    currentState = createInitialGameState(config);
    update(currentState);
    accessibility.syncFocus({ row: 0, column: 0 });
  }

  let hasDirectedFirstTab = false;
  const handleInitialTab = (event) => {
    const activeElement = document.activeElement;
    const isPageRoot = !activeElement || activeElement === document.body || activeElement === document.documentElement;
    if (event.key === 'Tab' && !event.shiftKey && !hasDirectedFirstTab && isPageRoot) {
      event.preventDefault();
      hasDirectedFirstTab = true;
      accessibility.syncFocus({ row: 0, column: 0 });
      document.removeEventListener('keydown', handleInitialTab, true);
    }
  };
  document.addEventListener('keydown', handleInitialTab, true);

  mounts.gridRoot.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const position = positionFromTarget(target);
    if (!position) {
      return;
    }

    const actionType = currentState.hud.touchMode === 'flag' ? 'flag' : 'reveal';
    dispatch({
      type: actionType,
      position,
      source: event.pointerType === '' ? 'mouse' : event.pointerType,
      timestamp: performance.now()
    });
  });

  mounts.gridRoot.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const position = positionFromTarget(target);
    if (!position) {
      return;
    }
    dispatch({
      type: 'flag',
      position,
      source: 'mouse',
      timestamp: performance.now()
    });
  });

  mounts.gridRoot.addEventListener('keydown', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const position = positionFromTarget(target);
      if (!position) {
        return;
      }
      dispatch({
        type: currentState.hud.touchMode === 'flag' ? 'flag' : 'reveal',
        position,
        source: 'keyboard',
        timestamp: performance.now()
      });
    }
  });

  mounts.touchToggle.addEventListener('click', () => {
    dispatch({
      type: 'toggleTouchMode',
      source: 'touch',
      timestamp: performance.now()
    });
  });

  mounts.newGameButton.addEventListener('click', () => {
    restartGame(config.difficulty);
  });

  mounts.difficultySelect.addEventListener('change', (event) => {
    const { value } = event.target;
    restartGame(value);
  });

  attachDebugExport(() => {
    const snapshot = {
      board: currentState.board,
      hud: currentState.hud,
      config
    };
    if (typeof structuredClone === 'function') {
      return structuredClone(snapshot);
    }
    return JSON.parse(JSON.stringify(snapshot));
  });

  update(currentState);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
