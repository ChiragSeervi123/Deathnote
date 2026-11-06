import type { Page } from '@playwright/test';

declare global {
  interface Window {
    __DN__?: { geometries: number; textures: number; ready: string[] };
  }
}

/** Known third-party noise that is not an application error. */
const IGNORED = [/THREE\.Clock: This module has been deprecated/];

export function collectProblems(page: Page): string[] {
  const problems: string[] = [];
  page.on('console', (m) => {
    if (
      (m.type() === 'error' || m.type() === 'warning') &&
      !IGNORED.some((r) => r.test(m.text()))
    ) {
      problems.push(`[${m.type()}] ${m.text()}`);
    }
  });
  page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', (r) => problems.push(`[requestfailed] ${r.url()}`));
  return problems;
}

/** Scroll so a chapter's track is at `progress` (0..1). */
export async function scrollToChapter(page: Page, id: string, progress = 0): Promise<void> {
  await page.locator(`#chapter-${id}`).waitFor({ state: 'attached' });
  await page.evaluate(
    ({ id, progress }) => {
      const el =
        document.querySelector<HTMLElement>(`#chapter-${id} .chapter__track`) ??
        document.getElementById(`chapter-${id}`);
      if (!el) throw new Error(`no chapter ${id}`);
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      window.scrollTo({
        top: top + progress * Math.max(0, r.height - window.innerHeight),
        behavior: 'instant',
      });
    },
    { id, progress },
  );
  await page.waitForTimeout(400);
}

export async function activeChapterLabel(page: Page): Promise<string> {
  return (await page.locator('.topbar__chapter').textContent()) ?? '';
}
