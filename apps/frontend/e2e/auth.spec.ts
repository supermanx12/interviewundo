import { expect, test } from '@playwright/test';

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
}

test.describe('E2E Auth Flow', () => {
  const password = 'Password123!';

  test('should register a user and redirect to the dashboard', async ({ page }) => {
    await page.goto('/register');

    await page.fill('#name', 'Auth E2E Tester');
    await page.fill('#email', uniqueEmail('auth-register'));
    await page.fill('#password', password);
    await page.click('button:has-text("Create Account")');

    await page.waitForURL('**/dashboard');
    await expect(page.getByText('Welcome back, Auth E2E Tester!')).toBeVisible();
  });

  test('should log in an existing user and land on the dashboard', async ({ page }) => {
    const email = uniqueEmail('auth-login');

    await page.goto('/register');
    await page.fill('#name', 'Returning Tester');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button:has-text("Create Account")');
    await page.waitForURL('**/dashboard');

    await page.goto('/login');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button:has-text("Sign In")');

    await page.waitForURL('**/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Daily Challenge')).toBeVisible();
  });
});
