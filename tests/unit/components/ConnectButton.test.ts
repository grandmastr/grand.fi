import { test, expect } from '@playwright/test';

/**
 * Tests for the ConnectButton component
 */
test.describe('ConnectButton', () => {
  test('should show wallet connection modal when clicked', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const connectButton = page.getByTestId('connect-wallet-button');
    await expect(connectButton).toBeVisible();
    await expect(connectButton).toContainText('Connect');

    await page.screenshot({ path: 'tests/screenshots/before-click.png' });
    await connectButton.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    await page.screenshot({
      path: 'tests/screenshots/after-click-with-modal.png',
    });
  });
});
