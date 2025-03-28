import { test, expect } from '@playwright/test';

/**
 * Tests for the Connect Wallet Modal component
 */
test.describe('Connect Wallet Modal', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('should open wallet selection modal when button is clicked', async ({
    page,
  }) => {
    // Find the connect button by its test id
    const connectButton = page.getByTestId('connect-wallet-button');

    // Verify the button exists and has the correct text
    await expect(connectButton).toBeVisible();
    await expect(connectButton).toContainText('Connect Wallet');

    // Take a screenshot of the button before clicking (for debugging)
    await connectButton.screenshot({
      path: 'tests/screenshots/connect-button-before.png',
    });

    // Click the connect button to trigger the wallet modal
    await connectButton.click();

    // Wait for the modal dialog to appear
    // This selector may need adjustment based on your actual modal implementation
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Take a screenshot of the modal for debugging
    await page.screenshot({ path: 'tests/screenshots/wallet-modal.png' });

    // Verify the modal contains wallet connection options using various possible selectors
    const hasWalletOptions = await Promise.any([
      modal
        .locator(
          'img[alt*="wallet" i], img[alt*="metamask" i], img[alt*="connect" i]',
        )
        .count()
        .then((count) => count > 0),
      modal
        .getByText(/connect|wallet|metamask|coinbase|trust/i)
        .count()
        .then((count) => count > 0),
      modal
        .locator('.wallet-option, .wallet-list, .wallet-item')
        .count()
        .then((count) => count > 0),
    ]).catch(() => false);

    expect(hasWalletOptions).toBeTruthy();
  });

  test('should be able to close the modal', async ({ page }) => {
    // Open the modal first
    const connectButton = page.getByTestId('connect-wallet-button');
    await connectButton.click();

    // Wait for the modal to appear
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Take a screenshot of the modal for debugging
    await page.screenshot({
      path: 'tests/screenshots/wallet-modal-before-close.png',
    });

    // Try different closing mechanisms in sequence until one works
    await page.keyboard.press('Escape');
    await page.screenshot({ path: 'tests/screenshots/after-escape-key.png' });

    const modalVisibleAfterEscape = await modal.isVisible().catch(() => false);

    if (modalVisibleAfterEscape) {
      // Try clicking outside the modal
      await page.mouse.click(10, 10);
      await page.screenshot({
        path: 'tests/screenshots/after-outside-click.png',
      });

      const modalVisibleAfterOutsideClick = await modal
        .isVisible()
        .catch(() => false);

      if (modalVisibleAfterOutsideClick) {
        // Try clicking any visible close buttons
        const closeElements = [
          modal.locator('button[aria-label="Close"]'),
          modal.locator('button.close, .close-button, .close-icon'),
          modal.locator('svg[aria-label="Close"]'),
        ];

        for (const closeElement of closeElements) {
          if ((await closeElement.count()) > 0) {
            await closeElement.first().click();
            break;
          }
        }

        await page.screenshot({
          path: 'tests/screenshots/after-close-button.png',
        });
      }
    }

    // Verify the modal is closed after attempting various closing mechanisms
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });
});
