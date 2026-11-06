import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { activeChapterLabel, collectProblems, scrollToChapter } from './helpers';

test.describe('main experience', () => {
  test('spoiler gate shows on first visit, is dismissed, and is remembered', async ({ page }) => {
    const problems = collectProblems(page);
    await page.goto('/');
    const gate = page.getByRole('dialog', { name: /whole story/i });
    await expect(gate).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enter the experience' })).toBeFocused();
    await page.getByRole('button', { name: 'Enter the experience' }).click();
    await expect(gate).toBeHidden();
    await page.reload();
    await expect(page.getByRole('dialog', { name: /whole story/i })).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Death');
    expect(problems).toEqual([]);
  });

  test('chapter index jumps to a chapter, focuses its heading and updates the active label', async ({
    page,
  }) => {
    await page.goto('/?gate=0');
    await page.getByRole('button', { name: /Index/ }).click();
    const dialog = page.getByRole('dialog', { name: 'The notebook' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /Misa Amane/ }).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator('#chapter-misa-title')).toBeFocused({ timeout: 8000 });
    await expect.poll(() => activeChapterLabel(page)).toContain('Misa Amane');
  });

  test('index dialog closes with Escape and returns focus to its trigger', async ({ page }) => {
    await page.goto('/?gate=0');
    const trigger = page.getByRole('button', { name: /Index/ });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog', { name: 'The notebook' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'The notebook' })).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('scrolling down and back up updates the active chapter both ways', async ({ page }) => {
    await page.goto('/?gate=0');
    await scrollToChapter(page, 'light', 0.5);
    await expect.poll(() => activeChapterLabel(page)).toContain('Light Yagami');
    await scrollToChapter(page, 'yotsuba', 0.5);
    await expect.poll(() => activeChapterLabel(page)).toContain('Yotsuba');
    await scrollToChapter(page, 'notebook', 0.5);
    await expect.poll(() => activeChapterLabel(page)).toContain('The Death Note');
  });

  test('sound is off by default and can be toggled', async ({ page }) => {
    await page.goto('/?gate=0');
    const toggle = page.locator('.topbar__sound');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('reduced motion disables smooth scrolling', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/?gate=0');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await ctx.close();
  });

  test('without WebGL the full story is still readable and navigable', async ({ page }) => {
    const problems = collectProblems(page);
    await page.goto('/?gate=0&webgl=0');
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.locator('.backdrop')).toBeVisible();
    await expect(page.locator('section.chapter')).toHaveCount(20);
    await scrollToChapter(page, 'fall', 0.5);
    await expect.poll(() => activeChapterLabel(page)).toContain('Fall of Kira');
    expect(problems).toEqual([]);
  });

  test('the rulebook filters and searches', async ({ page }) => {
    await page.goto('/?gate=0&webgl=0');
    await scrollToChapter(page, 'rulebook', 0.05);
    const count = page.locator('.rulebook__count').first();
    await expect(count).toContainText('of 65');
    await page.getByRole('radio', { name: 'Fake rules' }).check({ force: true });
    await expect(count).toContainText('Showing 2 of 65');
    await page.getByRole('radio', { name: 'All rules' }).check({ force: true });
    await page.getByLabel('Search the rules').fill('forty seconds');
    await expect(page.locator('.rule').first()).toBeVisible();
  });

  test('the character archive opens a profile and follows a relationship', async ({ page }) => {
    await page.goto('/?gate=0&webgl=0');
    await scrollToChapter(page, 'archive', 0.05);
    await page.getByRole('button', { name: /^Light Yagami/ }).click();
    const dialog = page.locator('.profile-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { level: 3 })).toContainText('Light Yagami');
    await dialog.locator('.link-button').first().click();
    await expect(dialog.getByRole('heading', { level: 3 })).not.toContainText('Light Yagami');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('no serious accessibility violations on first view', async ({ page }) => {
    await page.goto('/?gate=0&webgl=0');
    const results = await new AxeBuilder({ page }).disableRules(['region']).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(serious.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });

  test('3D scenes unmount and remount without leaking GPU resources', async ({ page }) => {
    await page.goto('/?gate=0&debug');
    const stats = () => page.evaluate(() => window.__DN__ ?? null);
    await expect
      .poll(async () => (await stats())?.ready.length ?? 0, { timeout: 30_000 })
      .toBeGreaterThanOrEqual(2);
    await page.waitForTimeout(1500);
    const before = await stats();
    expect(before).not.toBeNull();
    await scrollToChapter(page, 'rulebook', 0.1);
    await page.waitForTimeout(1500);
    await scrollToChapter(page, 'prologue', 0.05);
    await expect
      .poll(async () => (await stats())?.ready.length ?? 0, { timeout: 30_000 })
      .toBeGreaterThanOrEqual(2);
    await page.waitForTimeout(1500);
    const after = await stats();
    expect(Math.abs((after?.geometries ?? 0) - (before?.geometries ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((after?.textures ?? 0) - (before?.textures ?? 0))).toBeLessThanOrEqual(2);
  });
});

test.describe('other routes', () => {
  test('the creator tribute works directly by URL with no prior state', async ({ page }) => {
    const problems = collectProblems(page);
    await page.goto('/tribute');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'A tribute to its creators',
    );
    await expect(
      page.getByText('Thank you, Tsugumi Ohba and Takeshi Obata', { exact: false }),
    ).toBeAttached();
    await expect(page.getByText(/not affiliated with, endorsed by/)).toBeAttached();
    expect(problems).toEqual([]);
  });

  test('unknown routes show the designed 404', async ({ page }) => {
    await page.goto('/no-such-page');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'No name is written on this page',
    );
    await expect(page.getByRole('link', { name: 'Enter the main experience' })).toBeVisible();
  });
});
