import { describe, expect, it } from 'vitest';
import { computeTrackScroll, documentProgress, findActiveIndex } from './scrollMath';

const VH = 1000;

describe('computeTrackScroll', () => {
  const track = { top: 2000, height: 4000 }; // pinned span = 3000

  it('is fully before the track when the track is below the viewport', () => {
    const s = computeTrackScroll(0, VH, track);
    expect(s).toEqual({ progress: 0, enter: 0, exit: 0, visible: false });
  });

  it('enters linearly as the track top crosses the viewport', () => {
    expect(computeTrackScroll(1500, VH, track).enter).toBeCloseTo(0.5);
    expect(computeTrackScroll(2000, VH, track).enter).toBe(1);
    expect(computeTrackScroll(1500, VH, track).visible).toBe(true);
  });

  it('progresses through the pinned span', () => {
    expect(computeTrackScroll(2000, VH, track).progress).toBe(0);
    expect(computeTrackScroll(3500, VH, track).progress).toBeCloseTo(0.5);
    expect(computeTrackScroll(5000, VH, track).progress).toBe(1);
  });

  it('exits after the pinned span and stops being visible past the bottom', () => {
    expect(computeTrackScroll(5000, VH, track).exit).toBe(0);
    expect(computeTrackScroll(5500, VH, track).exit).toBeCloseTo(0.5);
    expect(computeTrackScroll(6000, VH, track).exit).toBe(1);
    expect(computeTrackScroll(6000, VH, track).visible).toBe(false);
  });

  it('is reversible: identical output for identical input regardless of direction', () => {
    const down = computeTrackScroll(3210, VH, track);
    computeTrackScroll(5800, VH, track);
    const up = computeTrackScroll(3210, VH, track);
    expect(up).toEqual(down);
  });

  it('handles tracks shorter than the viewport without dividing by zero', () => {
    const s = computeTrackScroll(100, VH, { top: 100, height: 500 });
    expect(Number.isFinite(s.progress)).toBe(true);
  });
});

describe('findActiveIndex', () => {
  const tracks = [
    { top: 0, height: 3000 },
    { top: 3000, height: 3000 },
    { top: 6000, height: 2000 },
  ];
  it('uses the viewport centre as the probe', () => {
    expect(findActiveIndex(0, VH, tracks)).toBe(0);
    expect(findActiveIndex(2499, VH, tracks)).toBe(0);
    expect(findActiveIndex(2500, VH, tracks)).toBe(1);
    expect(findActiveIndex(7000, VH, tracks)).toBe(2);
  });
});

describe('documentProgress', () => {
  it('maps scroll to 0..1', () => {
    expect(documentProgress(0, VH, 11000)).toBe(0);
    expect(documentProgress(5000, VH, 11000)).toBeCloseTo(0.5);
    expect(documentProgress(99999, VH, 11000)).toBe(1);
  });
});
