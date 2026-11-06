import { expect, test } from '@playwright/test';
import { scrollToChapter } from './helpers';

test('mobile: no horizontal overflow, navigation usable, beats readable', async ({ page }) => {
  await page.goto('/?gate=0');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator('.rail')).toBeHidden();
  await page.getByRole('button', { name: /Index/ }).click();
  await page
    .getByRole('dialog', { name: 'The notebook' })
    .getByRole('button', { name: /Light Yagami/ })
    .click();
  await expect(page.locator('#chapter-light-title')).toBeFocused({ timeout: 8000 });
  await scrollToChapter(page, 'light', 0.2);
  const beat = page.locator('#chapter-light .beat__inner').nth(1);
  await expect(beat).toBeVisible();
});
