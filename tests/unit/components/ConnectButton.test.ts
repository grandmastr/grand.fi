import { test, expect } from '@playwright/test';

test.describe('ConnectButton', () => {
  test('should show wallet connection modal when clicked', async ({ page }) => {
    // Navigate to the page where the connect button is rendered
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Find the connect button by its test ID
    const connectButton = page.getByTestId('connect-wallet-button');
    
    // Make sure the button is visible
    await expect(connectButton).toBeVisible();
    
    // The button text should contain "Connect"
    await expect(connectButton).toContainText('Connect');
    
    // Take a screenshot before clicking
    await page.screenshot({ path: 'tests/screenshots/before-click.png' });
    
    // Click the connect button
    await connectButton.click();
    
    // Wait for any modal/dialog to appear
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Take a screenshot after clicking showing the modal
    await page.screenshot({ path: 'tests/screenshots/after-click-with-modal.png' });
    
    // Success if we get to this point - modal is visible
  });
}); 