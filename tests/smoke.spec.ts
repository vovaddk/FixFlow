import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PATH = '/FixFlow/';

test('loads under the base path without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (err) => errors.push(err.message));

  const response = await page.goto(PATH);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/FixFlow/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});

for (const width of [375, 768, 1440]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(PATH);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('has no serious or critical axe violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(PATH);
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((v) =>
    ['serious', 'critical'].includes(v.impact ?? ''),
  );
  expect(blocking.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});

test('mobile menu opens, closes with Escape and on link click', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(PATH);
  const toggle = page.locator('[data-menu-toggle]');
  await expect(toggle).toHaveAccessibleName('Open menu');
  const nav = page.getByRole('navigation', { name: 'Main' });

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Close menu');
  await expect(nav.getByRole('link', { name: 'Pricing' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();

  await toggle.click();
  await nav.getByRole('link', { name: 'FAQ' }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#faq$/);
});

test('FAQ accordion opens one answer at a time by keyboard', async ({ page }) => {
  await page.goto(PATH);
  const first = page.locator('#faq summary').first();
  const second = page.locator('#faq summary').nth(1);

  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#faq details').first()).toHaveAttribute('open', '');

  await second.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#faq details').nth(1)).toHaveAttribute('open', '');
  await expect(page.locator('#faq details').first()).not.toHaveAttribute('open', '');
});
