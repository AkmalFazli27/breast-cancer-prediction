const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const shots = [
    { name: 'landing-desktop', url: 'http://localhost:5173/', width: 1440, height: 900 },
    { name: 'landing-mobile', url: 'http://localhost:5173/', width: 390, height: 844 },
    { name: 'predict-desktop', url: 'http://localhost:5173/predict', width: 1440, height: 900 },
    { name: 'predict-mobile', url: 'http://localhost:5173/predict', width: 390, height: 844 },
  ];
  for (const s of shots) {
    const page = await browser.newPage({ viewport: { width: s.width, height: s.height } });
    await page.goto(s.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `shots/${s.name}.png`, fullPage: true });
    console.log('shot', s.name);
    await page.close();
  }
  await browser.close();
})();
