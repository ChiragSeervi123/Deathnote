import type { ChapterId } from '@/data/types';
import { isReducedMotion } from '@/state/runtime';
import { trackElement } from './chapterTracker';
import { getLenis } from './smoothScroll';
import { scrollState } from './scrollState';

/**
 * Chapter navigation (SPEC §6.1/6.2). Short hops glide; long jumps cut through
 * a brief black veil so we never fly through (and mount) ten scenes on the way.
 */

const VEIL_ID = 'dn-veil';

function veil(): HTMLElement | null {
  return document.getElementById(VEIL_ID);
}

function nextFrame(): Promise<void> {
  return new Promise((r) => requestAnimationFrame(() => r()));
}

function fadeVeil(to: 0 | 1, ms: number): Promise<void> {
  const el = veil();
  if (!el) return Promise.resolve();
  el.style.transition = `opacity ${ms}ms cubic-bezier(0.65, 0, 0.35, 1)`;
  el.style.opacity = String(to);
  return new Promise((r) => window.setTimeout(r, ms));
}

function jumpImmediate(y: number): void {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
}

export async function scrollToY(y: number): Promise<void> {
  const target = Math.max(0, Math.round(y));
  const distance = Math.abs(target - window.scrollY);
  const vh = scrollState.viewportH || window.innerHeight;
  const lenis = getLenis();

  if (!isReducedMotion() && lenis && distance <= vh * 2.5) {
    await new Promise<void>((resolve) => {
      lenis.scrollTo(target, {
        duration: Math.min(1.8, 0.6 + distance / vh / 2),
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        onComplete: () => resolve(),
        force: true,
      });
    });
    return;
  }

  await fadeVeil(1, isReducedMotion() ? 120 : 260);
  jumpImmediate(target);
  await nextFrame();
  await nextFrame();
  await fadeVeil(0, isReducedMotion() ? 160 : 520);
}

export async function scrollToChapter(id: ChapterId, opts: { focus?: boolean } = {}): Promise<void> {
  const el = trackElement(id) ?? document.getElementById(`chapter-${id}`);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  await scrollToY(top);
  if (opts.focus !== false) {
    const heading = document.getElementById(`chapter-${id}-title`);
    heading?.focus({ preventScroll: true });
  }
}

export async function scrollToTop(): Promise<void> {
  await scrollToY(0);
  document.getElementById('content')?.focus({ preventScroll: true });
}
