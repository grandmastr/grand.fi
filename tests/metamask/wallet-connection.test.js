// testing wallet connection
import { test } from '@playwright/test';
import { testWithSynpress } from '@synthetixio/synpress';
import { expect } from '@playwright/test';

const test_with_synpress = testWithSynpress(test);

test_with_synpress.describe('Wallet Connection Tests', () => {
  test_with_synpress(
    'should connect wallet and show account address',
    async ({ page, metamask }) => {
      await page.goto('/');
      console.log('Application loaded');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: 'tests/screenshots/metamask-test-initial.png',
      });

      const connectButton = page
        .getByRole('button')
        .filter({ hasText: /Connect/i })
        .first();
      await expect(connectButton).toBeVisible();
      await connectButton.click();
      console.log('Clicked connect button');

      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).toBeVisible({ timeout: 5000 });
      console.log('Wallet selection modal opened');

      await page.screenshot({
        path: 'tests/screenshots/metamask-test-modal.png',
      });

      const metamaskOption = modal.getByText('MetaMask', { exact: false });
      await expect(metamaskOption).toBeVisible({ timeout: 5000 });
      await metamaskOption.click();
      console.log('Selected MetaMask option');

      try {
        // Synpress will automatically handle the MetaMask popup
        await metamask.acceptAccess();
        console.log('Approved connection in MetaMask');

        // 6. Wait for connected state
        await page.waitForTimeout(3000); // Wait for UI to update

        // Take screenshot after connection
        await page.screenshot({
          path: 'tests/screenshots/metamask-test-connected.png',
        });

        // 7. Verify connection was successful
        // This will depend on how your UI shows a connected wallet
        const addressDisplay = page.locator('button:has-text("0x")');

        if ((await addressDisplay.count()) > 0) {
          console.log('Wallet connected! Address is displayed');
          // Success - we have a connected wallet with an address
        } else {
          // Check if button text changed to indicate connection
          const updatedButton = page
            .getByRole('button')
            .filter({ hasText: /Connect|Connected|Account|Wallet/i })
            .first();
          const buttonText = await updatedButton.textContent();
          console.log(`Connection state - Button text now: ${buttonText}`);

          // This should fail the test if we're still showing "Connect Wallet"
          await expect(updatedButton).not.toContainText('Connect Wallet', {
            timeout: 5000,
          });
        }
      } catch (error) {
        console.error('Error during wallet connection:', error);
        await page.screenshot({
          path: 'tests/screenshots/metamask-test-error.png',
        });
        throw error;
      }
    },
  );
});
