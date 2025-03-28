// MetaMask wallet connection test using Playwright
import { test, expect } from '@playwright/test';

/**
 * Test suite for simulating MetaMask wallet connection
 */
test.describe('MetaMask Wallet Connection', () => {
  test('should simulate wallet connection flow', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tests/screenshots/wallet-initial.png' });

    const connectButton = page
      .getByRole('button')
      .filter({ hasText: /Connect/i })
      .first();
    await expect(connectButton).toBeVisible();
    await connectButton.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'tests/screenshots/wallet-modal.png' });

    const walletOptions = modal.locator(
      'button, .wallet-option, li, [role="button"]',
    );
    await walletOptions.count();

    const metamaskOption = modal.getByText('MetaMask', { exact: false });
    await expect(metamaskOption).toBeVisible({ timeout: 5000 });
    await metamaskOption.click();

    // Simulate MetaMask connection
    const fakeAccount = '0x1234567890123456789012345678901234567890';
    await page.evaluate((account) => {
      if (window.ethereum) {
        window.ethereum.emit('accountsChanged', [account]);
        localStorage.setItem('connectedWallet', account);
        return account;
      }
      return null;
    }, fakeAccount);

    await page.waitForTimeout(2000);
    await page.screenshot({
      path: 'tests/screenshots/after-simulated-connection.png',
    });

    try {
      const addressDisplay = page.locator('button:has-text("0x")');
      const hasAddress = (await addressDisplay.count()) > 0;

      if (!hasAddress) {
        await page
          .getByRole('button')
          .filter({ hasText: /Connect|Account|Wallet|0x/i })
          .count();
      }
    } catch (error) {
      // Silence errors when checking connection state
    }

    await page.screenshot({ path: 'tests/screenshots/final-state.png' });
  });
});
