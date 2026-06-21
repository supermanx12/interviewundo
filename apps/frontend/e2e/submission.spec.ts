import { test, expect, type Page } from '@playwright/test';

// Helper to set Monaco Editor value
async function setMonacoValue(page: Page, value: string) {
  // Wait for Monaco to load
  await page.waitForSelector('.monaco-editor');
  // Wait for model initialization
  await page.waitForFunction(() => {
    const monacoWindow = window as Window & {
      monaco?: {
        editor?: {
          getModels: () => Array<{ setValue: (value: string) => void }>;
        };
      };
    };
    return (monacoWindow.monaco?.editor?.getModels()?.length ?? 0) > 0;
  });
  // Set value directly in the model
  await page.evaluate((val: string) => {
    const monacoWindow = window as Window & {
      monaco?: {
        editor?: {
          getModels: () => Array<{ setValue: (value: string) => void }>;
        };
      };
    };
    monacoWindow.monaco?.editor?.getModels()[0]?.setValue(val);
  }, value);
}

test.describe('E2E Submission & Run Code Flow', () => {
  const password = 'Password123!';

  test.beforeEach(async ({ page }) => {
    // Generate a unique email for every single test run to prevent DB conflicts
    const testEmail = `e2e-user-${Date.now()}-${Math.floor(Math.random() * 1000000)}@example.com`;

    // 1. Go to register page
    await page.goto('/register');

    // 2. Fill registration details
    await page.fill('#name', 'E2E Tester');
    await page.fill('#email', testEmail);
    await page.fill('#password', password);

    // 3. Click Create Account
    await page.click('button:has-text("Create Account")');

    // 4. Wait for redirection to dashboard
    await page.waitForURL('**/dashboard');
  });

  test('should execute playground run code (Run Code) successfully', async ({ page }) => {
    // 1. Go to challenges page
    await page.goto('/problems');
    await page.waitForURL('**/problems');

    // Search for "Two Sum" to bring it onto the first page
    await page.fill('input[placeholder*="Search challenges"]', 'Two Sum');
    await page.waitForTimeout(600); // wait for search debounce

    // 2. Click on the Two Sum challenge
    await page.click('a:has-text("Two Sum")');
    await page.waitForURL('**/problems/two-sum');

    // 3. Set Monaco Editor code to a simple runner code
    await setMonacoValue(
      page,
      `function twoSum(nums, target) {
  return [0, 1];
}`,
    );

    // 4. Click Run Code
    await page.click('button:has-text("Run Code")');

    // 5. Verify it changes console tab to Result and starts queueing
    await expect(page.locator('button:has-text("Result")')).toHaveClass(/bg-zinc-800/);

    // 6. Wait for the processing to complete and show results
    await page.waitForSelector('.font-mono:has-text("FINISHED")', { timeout: 15000 });

    // 7. Verify the output displays passed test cases
    const consoleText = await page.locator('.font-mono').innerText();
    expect(consoleText).toContain('FINISHED');
    expect(consoleText).toContain('Test Case 1: PASSED');
  });

  test('should submit a correct solution and get ACCEPTED status', async ({ page }) => {
    // 1. Go directly to Two Sum challenge page
    await page.goto('/problems/two-sum');
    await page.waitForURL('**/problems/two-sum');

    // 3. Set Monaco Editor code to a correct Two Sum solution
    const correctSolution = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;
    await setMonacoValue(page, correctSolution);

    // 4. Click Submit
    await page.click('button:has-text("Submit")');

    // 5. Wait for the final ACCEPTED status
    await page.waitForSelector('.font-mono:has-text("ACCEPTED")', { timeout: 15000 });

    // 6. Verify the output contains metrics (Passed Cases, Runtime, Memory)
    const consoleText = await page.locator('.font-mono').innerText();
    expect(consoleText).toContain('ACCEPTED');
    expect(consoleText).toContain('Passed Cases: 5 / 5');
  });

  test('should handle wrong answer and get WRONG_ANSWER status', async ({ page }) => {
    await page.goto('/problems/two-sum');

    // Set Monaco Editor code to a wrong solution
    const wrongSolution = `function twoSum(nums, target) {
  return [9, 9];
}`;
    await setMonacoValue(page, wrongSolution);

    // Click Submit
    await page.click('button:has-text("Submit")');

    // Wait for the final WRONG_ANSWER status
    await page.waitForSelector('.font-mono:has-text("WRONG_ANSWER")', { timeout: 15000 });

    const consoleText = await page.locator('.font-mono').innerText();
    expect(consoleText).toContain('WRONG_ANSWER');
    expect(consoleText).toContain('Passed Cases: 0 / 5');
  });

  test('should handle compilation/syntax error and get COMPILATION_ERROR status', async ({
    page,
  }) => {
    await page.goto('/problems/two-sum');

    // Set Monaco Editor code to a syntax error code
    const syntaxErrorSolution = `function twoSum(nums, target) {
      const map = new Map();
      // Missing syntax`;
    await setMonacoValue(page, syntaxErrorSolution);

    // Click Submit
    await page.click('button:has-text("Submit")');

    // Wait for the final COMPILATION_ERROR status
    await page.waitForSelector('.font-mono:has-text("COMPILATION_ERROR")', { timeout: 15000 });

    const consoleText = await page.locator('.font-mono').innerText();
    expect(consoleText).toContain('COMPILATION_ERROR');
    expect(consoleText).toContain('SyntaxError');
  });

  test('should handle infinite loops and get TIME_LIMIT_EXCEEDED status', async ({ page }) => {
    await page.goto('/problems/two-sum');

    // Set Monaco Editor code to an infinite loop
    const infiniteLoopSolution = `function twoSum(nums, target) {
  while (true) {}
}`;
    await setMonacoValue(page, infiniteLoopSolution);

    // Click Submit
    await page.click('button:has-text("Submit")');

    // Wait for the final TIME_LIMIT_EXCEEDED status (sandbox limits timeout to 10s + buffer)
    await page.waitForSelector('.font-mono:has-text("TIME_LIMIT_EXCEEDED")', { timeout: 20000 });

    const consoleText = await page.locator('.font-mono').innerText();
    expect(consoleText).toContain('TIME_LIMIT_EXCEEDED');
    expect(consoleText).toContain('Time Limit Exceeded');
  });
});
