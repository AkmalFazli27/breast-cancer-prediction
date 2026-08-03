const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/predict', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  await page.getByRole('button', { name: /II.*Standard Error.*8 features/i }).click();
  await page.waitForTimeout(150);
  await page.getByRole('button', { name: /III.*Worst.*8 features/i }).click();
  await page.waitForTimeout(150);

  const set = async (id, val) => {
    await page.fill(`[id="${id}"]`, String(val));
    await page.waitForTimeout(80);
  };
  await set('concave points_mean', '0.2012');
  await set('concave points_worst', '0.291');
  await set('area_worst', '4254');
  await set('concavity_worst', '1.252');
  await set('area_se', '542.2');

  await page.getByRole('button', { name: /^Predict$/ }).click();
  await page.waitForTimeout(1600);
  const heading = await page.evaluate(() =>
    [...document.querySelectorAll('h3')].map((h) => h.textContent.trim()).find((t) => t === 'Benign' || t === 'Malignant')
  );
  console.log('extreme-case verdict:', heading);
  await browser.close();
})();