const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  const sizes = await p.evaluate(() => {
    const set = new Set();
    document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span,a,li,td,th,label,button,div").forEach((el) => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs > 0 && fs < 200) set.add(Math.round(fs * 10) / 10);
    });
    return [...set].sort((a,b) => a-b);
  });
  console.log("sizes:", JSON.stringify(sizes));
  const h1 = await p.evaluate(() => {
    const el = document.querySelector("h1");
    return el ? { text: el.textContent.trim().slice(0,40), size: getComputedStyle(el).fontSize, font: getComputedStyle(el).fontFamily } : null;
  });
  console.log("h1:", JSON.stringify(h1));
  await b.close();
})();
