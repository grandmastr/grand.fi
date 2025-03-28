import { test, expect } from '@playwright/test';

test.describe('Wallet Connection', () => {
  test('should successfully open the wallet modal', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Find the connect wallet button
    const connectButton = page
      .getByRole('button')
      .filter({ hasText: /Connect/i })
      .first();
    await expect(connectButton).toBeVisible();

    // Take a screenshot before clicking
    await page.screenshot({
      path: 'tests/screenshots/wallet-before-click.png',
    });

    // Click the connect button
    await connectButton.click();

    // Wait for the wallet modal to appear
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Take a screenshot of the modal
    await page.screenshot({ path: 'tests/screenshots/wallet-modal-open.png' });

    // Find wallet options in the modal
    const walletOptions = modal.locator('button, .wallet-option');

    // Verify that wallet options are displayed
    const count = await walletOptions.count();
    expect(count).toBeGreaterThan(0);
    console.log(`Found ${count} wallet options in the modal`);

    // For demonstration, log names of the wallet options if possible
    for (let i = 0; i < Math.min(count, 5); i++) {
      const option = walletOptions.nth(i);
      const text = await option.textContent();
      console.log(
        `Wallet option ${i + 1}: ${text?.trim() || 'No text content'}`,
      );
    }

    // Simulate selecting the first wallet option (this is a simplification)
    if (count > 0) {
      await walletOptions.first().click();
      console.log('Clicked the first wallet option');

      // Wait briefly to see what happens
      await page.waitForTimeout(2000);

      // Take a final screenshot
      await page.screenshot({
        path: 'tests/screenshots/after-wallet-selection.png',
      });
    }
  });
});
