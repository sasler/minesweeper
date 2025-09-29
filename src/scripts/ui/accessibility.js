function ensureOptions(options) {
  if (!options?.gridRoot || !options?.liveRegion || !options?.boardDimensions) {
    throw new Error('AccessibilityInit');
  }
}

function setGridMetadata(gridRoot, boardDimensions) {
  gridRoot.setAttribute('role', 'grid');
  gridRoot.setAttribute('aria-rowcount', String(boardDimensions.rows));
  gridRoot.setAttribute('aria-colcount', String(boardDimensions.columns));
  gridRoot.tabIndex = 0;
}

export function enhanceAccessibility(options) {
  ensureOptions(options);
  const { gridRoot, liveRegion, boardDimensions } = options;
  setGridMetadata(gridRoot, boardDimensions);

  const announceStatus = (message) => {
    if (typeof message !== 'string') {
      return;
    }
    liveRegion.textContent = '';
    liveRegion.textContent = message;
  };

  const applyTileAttributes = (tile, element) => {
    element.setAttribute('role', 'gridcell');
    element.setAttribute('data-row', String(tile.row));
    element.setAttribute('data-column', String(tile.column));
    element.setAttribute('aria-label', tile.ariaLabel ?? '');
    element.setAttribute('aria-selected', tile.isRevealed ? 'true' : 'false');
    element.setAttribute('tabindex', tile.isRevealed ? '-1' : '0');
  };

  const syncFocus = (position) => {
    if (!position) {
      return;
    }
    const selector = `[data-row="${position.row}"][data-column="${position.column}"]`;
    const nextFocus = gridRoot.querySelector(selector);
    if (nextFocus instanceof HTMLElement) {
      nextFocus.focus();
    }
  };

  const handleGridFocus = (event) => {
    if (event.target === gridRoot) {
      syncFocus({ row: 0, column: 0 });
    }
  };

  gridRoot.addEventListener('focus', handleGridFocus);

  return {
    applyTileAttributes,
    announceStatus,
    syncFocus
  };
}

export default enhanceAccessibility;
