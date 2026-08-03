const { chromium } = require('playwright');

function toRgb(str) {
  const m = str.match(/\d+(\.\d+)?/g);
  return m ? m.slice(0, 3).map(Number) : null;
}
function lum(rgb) {
  const c = rgb.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(str1, str2) {
  const a = lum(toRgb(str1)), b = lum(toRgb(str2));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

(async () => {
  const browser = await chromium.launch();

  // --- Landing checks ---
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const landing = await page.evaluate(() => {
    const pairs = [
      ['bodyText', 'body'],
      ['faded', '.small-notation'],
      ['inkSoft', '.text-ink-soft'],
      ['hematoxylinText', '.text-hematoxylin'],
    ];
    const bg = getComputedStyle(document.body).backgroundColor;
    const out = { pairs: {} };
    for (const [k, sel] of pairs) {
      const el = document.querySelector(sel);
      if (el) out.pairs[k] = { color: getComputedStyle(el).color, bg };
    }
    // figure plates + radar presence
    out.figures = document.querySelectorAll('figure').length;
    out.radarSvgs = document.querySelectorAll('.recharts-surface').length;
    out.radarPathCount = document.querySelectorAll('.recharts-surface path').length;
    const cta = [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Start prediction'));
    if (cta) {
      const cs = getComputedStyle(cta);
      out.cta = { bg: cs.backgroundColor, color: cs.color, padding: cs.padding };
    }
    return out;
  });
  landing.contrast = {};
  landing.contrast.bodyText = contrast(landing.pairs.bodyText.color, landing.pairs.bodyText.bg).toFixed(2);
  landing.contrast.faded = contrast(landing.pairs.faded.color, landing.pairs.faded.bg).toFixed(2);
  landing.contrast.inkSoft = contrast(landing.pairs.inkSoft.color, landing.pairs.inkSoft.bg).toFixed(2);
  landing.contrast.hematoxylinText = contrast(landing.pairs.hematoxylinText.color, landing.pairs.hematoxylinText.bg).toFixed(2);
  landing.consoleErrors = errors;
  console.log('\n== LANDING ==');
  console.log(JSON.stringify(landing, null, 1));
  await page.close();

  // --- Predict flow: submit with defaults -> verdict ---
  const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs2 = [];
  p2.on('console', (m) => m.type() === 'error' && errs2.push(m.text()));
  p2.on('pageerror', (e) => errs2.push(String(e)));
  await p2.goto('http://localhost:5173/predict', { waitUntil: 'networkidle' });
  await p2.waitForTimeout(800);
  const formBefore = await p2.evaluate(() => ({
    inputs: document.querySelectorAll('input').length,
    submitDisabled: (() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Predict')); return b ? b.disabled : null; })(),
  }));
  await p2.getByRole('button', { name: /Predict/ }).click();
  await p2.waitForTimeout(1600);
  const verdict = await p2.evaluate(() => ({
    heading: [...document.querySelectorAll('h3')].map((h) => h.textContent.trim()).find((t) => t === 'Benign' || t === 'Malignant') || null,
    badge: document.querySelector('.inline-flex')?.textContent.trim() || null,
    barWidths: [...document.querySelectorAll('.recharts-surface')].length,
    radarPaths: document.querySelectorAll('.recharts-surface path').length,
    demoBanner: document.body.textContent.includes('synthetic demo'),
  }));
  // invalid input test — open the Worst group first (collapsed by default)
  await p2.getByRole('button', { name: /III.*Worst.*8 features/i }).click();
  await p2.waitForTimeout(200);
  await p2.fill('#area_worst', '9999');
  await p2.waitForTimeout(300);
  const invalid = await p2.evaluate(() => ({
    errText: document.querySelector('[role="alert"]')?.textContent.trim() || null,
    submitDisabled: (() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Predict')); return b ? b.disabled : null; })(),
  }));
  console.log('\n== PREDICT FLOW ==');
  console.log(JSON.stringify({ formBefore, verdict, invalid, consoleErrors: errs2 }, null, 1));
  await p2.close();

  await browser.close();
})();