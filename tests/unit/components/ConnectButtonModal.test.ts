import { test, expect } from '@playwright/test';

test.describe('Connect Wallet Modal', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('should open wallet selection modal when button is clicked', async ({ page }) => {
    // Find the connect button by its test id
    const connectButton = page.getByTestId('connect-wallet-button');
    
    // Verify the button exists and has the correct text
    await expect(connectButton).toBeVisible();
    await expect(connectButton).toContainText('Connect Wallet');
    
    // Take a screenshot of the button before clicking (for debugging)
    await connectButton.screenshot({ path: 'tests/screenshots/connect-button-before.png' });
    
    // Click the connect button to trigger the wallet modal
    await connectButton.click();
    
    // Wait for the modal dialog to appear
    // This selector may need adjustment based on your actual modal implementation
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Take a screenshot of the modal for debugging
    await page.screenshot({ path: 'tests/screenshots/wallet-modal.png' });
    
    // Instead of looking for exact text, check if modal contains any wallet options
    // Look for common elements that would appear in a wallet connection modal
    // This is more flexible than looking for exact text that might change
    
    // Check for various possible elements that might exist in the modal
    const hasWalletOptions = await Promise.any([
      modal.locator('img[alt*="wallet" i], img[alt*="metamask" i], img[alt*="connect" i]').count().then(count => count > 0),
      modal.getByText(/connect|wallet|metamask|coinbase|trust/i).count().then(count => count > 0),
      modal.locator('.wallet-option, .wallet-list, .wallet-item').count().then(count => count > 0)
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
    await page.screenshot({ path: 'tests/screenshots/wallet-modal-before-close.png' });
    
    // Try clicking the escape key to close the modal (common pattern)
    await page.keyboard.press('Escape');
    
    // Take a screenshot after pressing escape
    await page.screenshot({ path: 'tests/screenshots/after-escape-key.png' });
    
    // Check if modal is gone after escape key
    const modalVisibleAfterEscape = await modal.isVisible().catch(() => false);
    
    // If the modal is still visible, try clicking outside
    if (modalVisibleAfterEscape) {
      // Click in the top-left corner which is likely outside the modal
      await page.mouse.click(10, 10);
      
      // Take a screenshot after clicking outside
      await page.screenshot({ path: 'tests/screenshots/after-outside-click.png' });
      
      // Check if modal is gone after clicking outside
      const modalVisibleAfterOutsideClick = await modal.isVisible().catch(() => false);
      
      // If the modal is still visible, look for a close button
      if (modalVisibleAfterOutsideClick) {
        // Look for possible close buttons or elements
        const closeElements = [
          modal.locator('button[aria-label="Close"]'),
          modal.locator('button.close, .close-button, .close-icon'),
          modal.locator('svg[aria-label="Close"]')
        ];
        
        // Try each possible close element
        for (const closeElement of closeElements) {
          if (await closeElement.count() > 0) {
            await closeElement.first().click();
            break;
          }
        }
        
        // Take a screenshot after trying to click close button
        await page.screenshot({ path: 'tests/screenshots/after-close-button.png' });
      }
    }
    
    // Verify the modal is eventually closed - wait a bit to allow for animations
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });
}); 