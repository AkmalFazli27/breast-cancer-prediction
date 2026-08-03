const { chromium } = require('playwright');

function contrast(hex1, hex2) {
  const lum = (h) => {
    const c = h.match(/\w\w/g).map((x) => parseInt(x, 16) / 255);
    const l = c.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
  };
  const a = lum(hex1), b = lum(hex2);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const checks = {
  'landing-desktop': { url: '/', width: 1440 },
  'landing-mobile': { url: '/', width: 390 },
  'predict-desktop': { url: '/predict', width: 1440 },
  'predict-mobile': { url: '/predict', width: 390 },
};

(async () => {
  const browser = await chromium.launch();
  for (const [name, s] of Object.entries(checks)) {
    const page = await browser.newPage({ viewport: { width: s.width, height: 900 } });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('http://localhost:5173' + s.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const results = {};
      results.horizontalOverflow = doc.scrollWidth > doc.clientWidth + 1;
      results.headings = [...document.querySelectorAll('h1,h2,h3')].map((h) => h.textContent.trim().slice(0, 60));
      results.buttons = [...document.querySelectorAll('button')].length;
      results.inputs = [...document.querySelectorAll('input')].length;
      results.links = [...document.querySelectorAll('a')].length;
      results.imgs = [...document.querySelectorAll('img')].length;
      const hero = document.querySelector('h1');
      if (hero) {
        const cs = getComputedStyle(hero);
        results.heroFont = { family: cs.fontFamily.split(',')[0], size: cs.fontSize, weight: cs.fontWeight, color: cs.color, bg: getComputedStyle(document.body).backgroundColor };
      }
      // font check
      results.fontsLoaded = document.fonts ? document.fonts.status : 'n/a';
      return results;
    });
    // contrast check on body text vs body bg
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const txt = await page.evaluate(() => getComputedStyle(document.body).color);
    report.contrastBodyTextVsBg = contrast(txt, bg).toFixed(2);
    report.consoleErrors = errors;
    console.log('\n==', name, '==');
    console.log(JSON.stringify(report, null, 1));
    await page.close();
  }
  await browser.close();
})();