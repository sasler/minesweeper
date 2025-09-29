import { describe, expect, it, beforeEach } from '@jest/globals';
import { enhanceAccessibility } from '../../src/scripts/ui/accessibility.js';

describe('Accessibility helpers', () => {
  let liveRegion;
  let mounts;

  beforeEach(() => {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    document.body.append(liveRegion);

    mounts = {
      gridRoot: document.createElement('div'),
      liveRegion,
      boardDimensions: { rows: 3, columns: 3 }
    };
  });

  it('applies aria metadata to tile elements', () => {
    const accessibility = enhanceAccessibility(mounts);
    const tile = document.createElement('button');

    accessibility.applyTileAttributes(
      {
        row: 1,
        column: 2,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        isQuestioned: false,
        adjacentMines: 2,
        ariaLabel: 'Tile at row 2 column 3 with 2 adjacent mines'
      },
      tile
    );

    expect(tile.getAttribute('role')).toBe('gridcell');
    expect(tile.getAttribute('data-row')).toBe('1');
    expect(tile.getAttribute('aria-label')).toContain('2 adjacent mines');
  });

  it('announces status updates through the live region', () => {
    const accessibility = enhanceAccessibility(mounts);

    accessibility.announceStatus('Timer started');

    expect(liveRegion.textContent).toContain('Timer started');
  });
});
