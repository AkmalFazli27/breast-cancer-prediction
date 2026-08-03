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
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/predict', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: /^Predict$/ }).click();
  await page.waitForTimeout(1600);

  const out = await page.evaluate(() => {
    const res = {};
    const verdict = [...document.querySelectorAll('h3')].map((h) => h.textContent.trim()).find((t) => t === 'Benign' || t === 'Malignant');
    const h3 = [...document.querySelectorAll('h3')].find((h) => h.textContent.trim() === verdict);
    res.verdict = verdict;
    res.verdictColor = h3 ? getComputedStyle(h3).color : null;
    const panel = h3 ? h3.closest('div.border.border-rule') : null;
    res.panelBg = panel ? getComputedStyle(panel.children[0]).backgroundColor : null;
    const badge = [...document.querySelectorAll('span')].find((s) => /confidence/.test(s.textContent));
    if (badge) {
      const cs = getComputedStyle(badge);
      res.badge = { text: badge.textContent.trim(), color: cs.color, bg: cs.backgroundColor, border: cs.borderColor };
    }
    const barLabels = [...document.querySelectorAll('div')].filter((d) => /Benign|Malignant/.test(d.textContent) && d.querySelector('span.size-2'));
    res.probBarText = document.body.textContent.includes('benign') && document.body.textContent.includes('malignant');
    res.radar = document.querySelectorAll('.recharts-surface').length;
    return res;
  });
  if (out.panelBg) out.panelContrast = contrast(out.verdictColor, out.panelBg).toFixed(2);
  if (out.badge) out.badgeContrast = contrast(out.badge.color, out.badge.bg).toFixed(2);
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();