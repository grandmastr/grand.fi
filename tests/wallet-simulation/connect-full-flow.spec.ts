import { test, expect } from '@playwright/test';

test.describe('Wallet Connection Full Flow', () => {
  test('should simulate the entire wallet connection flow', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // 1. Initial state - Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/initial-state.png' });
    console.log('1. Initial page loaded');
    
    // Find the connect wallet button
    const connectButton = page.getByRole('button').filter({ hasText: /Connect/i }).first();
    await expect(connectButton).toBeVisible();
    
    // 2. Click the connect button
    await connectButton.click();
    console.log('2. Clicked connect button');
    
    // Wait for the wallet modal to appear
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // 3. Take a screenshot of the wallet selection modal
    await page.screenshot({ path: 'tests/screenshots/wallet-selection-modal.png' });
    console.log('3. Wallet selection modal opened');
    
    // Find and list all available wallet options
    const walletOptions = modal.locator('button, .wallet-option, li, [role="button"]');
    const count = await walletOptions.count();
    console.log(`Found ${count} wallet options in the modal`);
    
    // Print names/descriptions of the first few wallet options
    for (let i = 0; i < Math.min(count, 5); i++) {
      const option = walletOptions.nth(i);
      const text = await option.textContent();
      console.log(`Wallet option ${i + 1}: ${text?.trim() || 'No text content'}`);
    }
    
    // 4. Select the first wallet option (this would typically be MetaMask)
    if (count > 0) {
      await walletOptions.first().click();
      console.log('4. Selected first wallet option');
      
      // In a real scenario, MetaMask would now prompt for connection
      // We're simulating successful connection by checking for UI changes
      
      // Wait briefly to allow UI to update
      await page.waitForTimeout(2000);
      
      // 5. Take screenshot after wallet selection
      await page.screenshot({ path: 'tests/screenshots/after-wallet-selection.png' });
      
      // Check if the UI updates to reflect connection (address displayed, etc.)
      // This will depend on your app's specific behavior
      const addressDisplay = page.locator('button span:has-text("0x")');
      
      // If address display is found, wallet connected successfully
      if (await addressDisplay.count() > 0) {
        console.log('5. Wallet connected successfully! Address is displayed');
      } else {
        // Check if connect button text changed
        const buttonAfterConnection = page.getByRole('button').filter({ hasText: /Connect|Connected|Account|Wallet/i }).first();
        const buttonText = await buttonAfterConnection.textContent();
        console.log(`5. Connection result - Button text now: ${buttonText}`);
      }
      
      // 6. Final state screenshot
      await page.screenshot({ path: 'tests/screenshots/final-state.png' });
    } else {
      console.log('No wallet options found to select');
    }
  });
}); 