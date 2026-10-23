import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";
const base = process.env.QA_URL || "http://127.0.0.1:4181/";
const label = process.env.QA_LABEL || "production";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
await page.goto(base + "apex-velocity/");
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);
const start = await page
  .locator("#story")
  .evaluate((el) => el.getBoundingClientRect().top + scrollY - 78);
await page.evaluate((y) => {
  document.documentElement.style.scrollBehavior = "auto";
  scrollTo(0, y);
}, start + 50);
await expect(
  page.locator('[aria-label="Story helmet viewer"]'),
).toHaveAttribute("data-viewer-state", "ready");
await page.waitForTimeout(1000);
const sample = () =>
  page.locator("[data-story-heading]").evaluate((el) => ({
    x: new DOMMatrix(getComputedStyle(el).transform).m41,
    mask: getComputedStyle(document.querySelector("[data-story-track]"))
      .clipPath,
    panelTop: document
      .querySelector("[data-story-panel]")
      .getBoundingClientRect().top,
  }));
const first = await sample();
await page.screenshot({
  path: `docs/landings/apex-velocity/qa/${label}-story-start.png`,
});
await page.evaluate((y) => scrollTo(0, y), start + 850);
await page.waitForTimeout(1200);
const forward = await sample();
await page.screenshot({
  path: `docs/landings/apex-velocity/qa/${label}-story-forward.png`,
});
const axe = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
  .analyze();
assert.equal(axe.violations.length, 0, JSON.stringify(axe.violations));
assert(forward.x < first.x - 15);
assert.notEqual(first.mask, forward.mask);
assert(Math.abs(forward.panelTop - 78) < 2);
await page.evaluate((y) => scrollTo(0, y), start + 50);
await page.waitForTimeout(1200);
const reversed = await sample();
assert(Math.abs(reversed.x - first.x) < 1);
await page.screenshot({
  path: `docs/landings/apex-velocity/qa/${label}-story-reversed.png`,
});
await page.evaluate((y) => scrollTo(0, y), start + 2000);
await page.waitForTimeout(500);
const released = await sample();
assert(released.panelTop < 0);
await writeFile(
  `docs/landings/apex-velocity/qa/${label}-scroll.json`,
  JSON.stringify(
    {
      first,
      forward,
      reversed,
      released,
      method:
        "Finite 1000px pin; bidirectional headline transform/mask assertions and real model screenshots at each sampled pose.",
    },
    null,
    2,
  ),
);
console.log(
  "PASS scroll scrub reverses headline/background and helmet poses; finite pin releases",
  label,
);
await browser.close();
