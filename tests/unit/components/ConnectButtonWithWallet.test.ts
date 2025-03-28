import { test, expect } from '@playwright/test';
import '@synthetixio/synpress';

/**
 * Tests for ConnectButton with wallet simulation
 */
test.describe('ConnectButton with wallet simulation', () => {
  test('should connect wallet when clicking the connect button', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'tests/screenshots/before-connect.png' });

    const connectButton =
      page.getByTestId('connect-wallet-button') ||
      page.getByText('Connect Wallet', { exact: false }) ||
      page
        .getByRole('button')
        .filter({ hasText: /Connect/i })
        .first();

    await expect(connectButton).toBeVisible();
    await connectButton.click();

    const modal = page.locator('[role="dialog"], .wallet-modal').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: 'tests/screenshots/modal-open.png' });
  });
});
