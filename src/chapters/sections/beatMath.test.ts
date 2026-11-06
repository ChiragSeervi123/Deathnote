import { describe, expect, it } from 'vitest';
import { beatVisual } from './beatMath';

const at = (progress: number, enter = 1, exit = 0) => ({ progress, enter, exit });

describe('beatVisual', () => {
  it('hides a mid-chapter beat before and after its window', () => {
    const beat = { at: [0.4, 0.5] as const };
    expect(beatVisual(beat, at(0.2)).opacity).toBe(0);
    expect(beatVisual(beat, at(0.45)).opacity).toBe(1);
    expect(beatVisual(beat, at(0.7)).opacity).toBe(0);
  });

  it('rises in from below and leaves upward', () => {
    const beat = { at: [0.4, 0.5] as const };
    expect(beatVisual(beat, at(0.41)).offset).toBeGreaterThan(0);
    expect(beatVisual(beat, at(0.49)).offset).toBeLessThan(0);
  });

  it('ties a beat starting at 0 to the chapter arrival', () => {
    const beat = { at: [0, 0.1] as const };
    expect(beatVisual(beat, at(0, 0.2)).opacity).toBe(0);
    expect(beatVisual(beat, at(0, 1)).opacity).toBe(1);
  });

  it('ties a beat ending at 1 to the chapter departure', () => {
    const beat = { at: [0.9, 1] as const };
    expect(beatVisual(beat, at(1, 1, 0)).opacity).toBe(1);
    expect(beatVisual(beat, at(1, 1, 0.8)).opacity).toBe(0);
  });

  it('is reversible', () => {
    const beat = { at: [0.3, 0.6] as const };
    const a = beatVisual(beat, at(0.31));
    beatVisual(beat, at(0.9));
    expect(beatVisual(beat, at(0.31))).toEqual(a);
  });
});
