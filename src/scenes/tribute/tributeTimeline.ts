import { clamp, range } from '@/utils/math';

/**
 * Scroll → tribute timeline. A single mutable object (never React state) read
 * by the scene every frame.
 *
 * `T` is a continuous section index measured at the reading line (middle of
 * the viewport): 0..1 opening, 1..2 Ohba, 2..3 Obata, 3..4 Together,
 * 4..5 The work, 5..6 the final page. At the very top of the page T = 0.5.
 */
export interface TributeTimeline {
  /** Scroll-derived target. */
  target: number;
  /** Section tops / heights in document pixels, in DOM order. */
  tops: number[];
  heights: number[];
  vh: number;
  measured: boolean;
}

export const timeline: TributeTimeline = {
  target: 0.5,
  tops: [],
  heights: [],
  vh: 1,
  measured: false,
};

/** Measure the six tribute sections (direct <section> children of <main>). */
export function measureSections(main: HTMLElement): void {
  const secs = Array.from(main.querySelectorAll<HTMLElement>(':scope > section'));
  const y = window.scrollY;
  timeline.tops = secs.map((s) => s.getBoundingClientRect().top + y);
  timeline.heights = secs.map((s) => Math.max(1, s.offsetHeight));
  timeline.vh = window.innerHeight;
  timeline.measured = secs.length > 0;
}

/** Window scroll → T (pure). */
export function scrollToT(scrollY: number): number {
  const { tops, heights, vh } = timeline;
  if (!tops.length) return 0.5;
  const line = scrollY + vh * 0.5;
  let t = 0;
  for (let i = 0; i < tops.length; i++) {
    t += clamp((line - tops[i]!) / heights[i]!);
  }
  return t;
}

/** Reveal windows, in T. Every visual is a pure function of T. */
export const WINDOWS = {
  story: [1.02, 1.86],
  art: [2.02, 2.88],
  together: [3.0, 3.72],
  close: [5.02, 5.55],
  quiet: [4.9, 5.75],
} as const satisfies Record<string, readonly [number, number]>;

export const win = (T: number, w: readonly [number, number]): number => range(T, w[0], w[1]);
