import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const base = process.env.QA_URL || "http://127.0.0.1:5180/";
const label = process.env.QA_LABEL || "dev";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
await page.goto(base + "apex-velocity/");
await expect(page.locator('[aria-label="Hero helmet viewer"]')).toHaveAttribute(
  "data-viewer-state",
  "ready",
);
await page.waitForTimeout(600);
const cdp = await context.newCDPSession(page);
const swipe = async (x1, y1, x2, y2) => {
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: x1, y: y1 }],
  });
  for (let i = 1; i <= 12; i++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { x: x1 + ((x2 - x1) * i) / 12, y: y1 + ((y2 - y1) * i) / 12 },
      ],
    });
    await page.waitForTimeout(16);
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await page.waitForTimeout(350);
};
const before = await page.evaluate(() => scrollY);
await swipe(100, 680, 280, 682);
const afterHorizontal = await page.evaluate(() => scrollY);
assert(Math.abs(afterHorizontal - before) < 20);
await page.screenshot({
  path: `docs/landings/apex-velocity/qa/${label}-touch-drag.png`,
});
await swipe(190, 700, 192, 400);
const afterVertical = await page.evaluate(() => scrollY);
assert(afterVertical > before + 100);
const measurements = await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  return {
    viewport: [innerWidth, innerHeight],
    dpr: devicePixelRatio,
    canvasPixels: [canvas.width, canvas.height],
    touchAction: getComputedStyle(canvas).touchAction,
  };
});
await writeFile(
  `docs/landings/apex-velocity/qa/${label}-touch.json`,
  JSON.stringify(
    {
      before,
      afterHorizontal,
      afterVertical,
      ...measurements,
      method:
        "Chrome CDP trusted touch input in responsive emulation. Not a physical mobile GPU test.",
    },
    null,
    2,
  ),
);
console.log(
  "PASS touch horizontal drag retains page position; vertical swipe scrolls",
  measurements,
);
await browser.close();
