import { describe, expect, it } from 'vitest';
import type { ChapterDef } from '@/chapters/types';
import type { ChapterId } from '@/data/types';
import { CHAPTERS } from '@/chapters/chapterData';
import { computeSchedule, mountWindow } from './sceneSchedule';

const defs = new Map<ChapterId, Pick<ChapterDef, 'scene' | 'transition'>>([
  ['prologue', { scene: 'prologue', transition: 'fade' }],
  ['notebook', { scene: 'notebook', transition: 'ink' }],
  ['shinigami', { scene: 'realm', transition: 'smoke' }],
  ['light', { scene: 'realm', transition: 'pageTurn' }],
]);

const t = (id: ChapterId, enter: number, exit = 0) => ({ id, enter, exit });

describe('computeSchedule', () => {
  it('shows only the first scene at the top of the page', () => {
    const s = computeSchedule([t('prologue', 1), t('notebook', 0), t('shinigami', 0)], defs);
    expect(s.b.key).toBe('prologue');
    expect(s.mix).toBe(1);
  });

  it('blends outgoing and incoming scenes during the hand-off', () => {
    const s = computeSchedule([t('prologue', 1, 0.4), t('notebook', 0.4), t('shinigami', 0)], defs);
    expect(s.a.key).toBe('prologue');
    expect(s.b.key).toBe('notebook');
    expect(s.mix).toBeCloseTo(0.4);
    expect(s.kind).toBe('ink');
    expect(s.a.dim).toBeGreaterThan(0);
  });

  it('does not transition between chapters that share a scene', () => {
    const s = computeSchedule([t('prologue', 1, 1), t('notebook', 1, 1), t('shinigami', 1), t('light', 0.5)], defs);
    expect(s.b.key).toBe('realm');
    expect(s.mix).toBe(1);
  });

  it('is symmetric when scrolling back up (pure function of state)', () => {
    const tracks = [t('prologue', 1, 0.7), t('notebook', 0.7)];
    expect(computeSchedule(tracks, defs)).toEqual(computeSchedule(tracks, defs));
  });
});

describe('mountWindow', () => {
  it('mounts the active scene and its neighbours, deduplicated', () => {
    const keys = mountWindow(CHAPTERS, 1);
    expect(keys).toContain('prologue');
    expect(keys).toContain('notebook');
    expect(keys).toContain('realm');
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('never mounts distant scenes', () => {
    const keys = mountWindow(CHAPTERS, 0);
    expect(keys).not.toContain('warehouse');
  });
});
