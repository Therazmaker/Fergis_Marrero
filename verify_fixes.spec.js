const { test, expect } = require('@playwright/test');
const path = require('path');

test('verify fixes in admin.html', async ({ page }) => {
  const filePath = `file://${path.resolve('admin.html')}`;

  // Mock API responses
  await page.route('**/admin/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: '1', email: 'user1@test.com', credits: 10, premium_credits: 5, created_at: new Date().toISOString() },
        { id: '2', email: 'user2@test.com', credits: 2, premium_credits: 0, created_at: new Date().toISOString() }
      ])
    });
  });

  await page.route('**/admin/history/1', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ question: '¿Amor?', created_at: new Date().toISOString() }])
    });
  });

  await page.route('**/admin/history/2', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ question: '¿Trabajo?', created_at: new Date().toISOString() }])
    });
  });

  await page.goto(filePath);

  // Login
  await page.fill('#adminKeyInput', 'secret');
  await page.click('button:has-text("Entrar")');

  // 1. Verify UI Regression fix (Tabs)
  // Initially "Usuarios" is active
  await expect(page.locator('.main-tab:has-text("Usuarios")')).toHaveClass(/active/);

  // Click on activity sub-tabs shouldn't affect main tabs
  await page.click('#btnShowLatestQuestions');
  await expect(page.locator('.main-tab:has-text("Usuarios")')).toHaveClass(/active/);
  await expect(page.locator('#btnShowLatestQuestions')).toHaveClass(/active/);

  // Switch main tab
  await page.click('.main-tab:has-text("Análisis de Consultas")');
  await expect(page.locator('.main-tab:has-text("Análisis de Consultas")')).toHaveClass(/active/);
  await expect(page.locator('.main-tab:has-text("Usuarios")')).not.toHaveClass(/active/);
  // Sub-tabs state should remain (not influenced by switchTab unless intentional, but switchTab logic was fixing the generic .tab selector)
  await expect(page.locator('#btnShowLatestQuestions')).toHaveClass(/active/);

  // 2. Verify Global Analysis (Syntax & Reference Errors)
  await page.click('#startAnalysisBtn');

  // Wait for analysis to complete
  await expect(page.locator('#analysisProgress')).toHaveText(/completado/i, { timeout: 10000 });

  // Check results visible
  await expect(page.locator('#analysisResults')).toBeVisible();
  await expect(page.locator('#topKeywordsTable')).toContainText('amor');
  await expect(page.locator('#topKeywordsTable')).toContainText('trabajo');

  // Verify chart update didn't crash (we can't easily check canvas content but we can check if console is clean)
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));

  // Run analysis again to trigger chart update logic
  await page.click('#startAnalysisBtn');
  await expect(page.locator('#analysisProgress')).toHaveText(/completado/i, { timeout: 10000 });

  expect(logs.filter(l => l.includes('Error') || l.includes('ReferenceError') || l.includes('SyntaxError'))).toHaveLength(0);

  await page.screenshot({ path: '/home/jules/verification/fixes_verified.png', fullPage: true });
});
