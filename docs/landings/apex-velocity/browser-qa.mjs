import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { writeFile, readFile } from "node:fs/promises";
const base = process.env.QA_URL || "http://127.0.0.1:5180/";
const label = process.env.QA_LABEL || "dev";
const qa = "docs/landings/apex-velocity/qa";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  acceptDownloads: true,
});
const page = await context.newPage();
const errors = [],
  failures = [],
  requests = [],
  consoleErrors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("response", (r) => {
  if (r.status() >= 400) failures.push([r.status(), r.url()]);
});
page.on("request", (r) => requests.push(r.url()));
const checks = [];
const check = (name) => {
  checks.push(name);
  console.log("PASS", label, name);
};
try {
  await page.goto(base);
  await expect(
    page.getByRole("heading", { name: "Apex Velocity", exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(400);
  const catalogRequests = [...requests];
  assert(
    !catalogRequests.some((u) =>
      /viewer-engine|apex-velocity-.*\.js|Barlow|three|gsap|luma-.*\.js/.test(
        u,
      ),
    ),
  );
  assert.equal(await page.locator("html.lenis").count(), 0);
  check("catalog isolated; static preview only");
  await page
    .getByRole("heading", { name: "Apex Velocity", exact: true })
    .click();
  await expect(page).toHaveURL(base + "apex-velocity/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "CHASE THE EDGE.",
  );
  await expect(
    page.locator('[aria-label="Hero helmet viewer"]'),
  ).toHaveAttribute("data-viewer-state", "ready");
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${qa}/${label}-hero-desktop.png` });
  check("catalog → Apex with live 3D");
  const hero = page.locator('[aria-label="Hero helmet viewer"]');
  await hero.getByRole("button", { name: "Rotate helmet right" }).click();
  await page.waitForTimeout(200);
  await hero.screenshot({ path: `${qa}/${label}-helmet-angle-right.png` });
  await hero.getByRole("button", { name: "Rotate helmet left" }).click();
  await hero.getByRole("button", { name: "Rotate helmet left" }).click();
  await page.waitForTimeout(200);
  await hero.screenshot({ path: `${qa}/${label}-helmet-angle-left.png` });
  await hero.getByRole("button", { name: "Reset helmet rotation" }).click();
  const rect = await hero.locator("canvas").boundingBox();
  await page.mouse.move(rect.x + rect.width * 0.5, rect.y + rect.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width * 0.7, rect.y + rect.height * 0.5, {
    steps: 10,
  });
  await page.mouse.up();
  check("viewer buttons/reset and pointer drag");
  await page.getByRole("link", { name: "Explore the helmets" }).click();
  await expect(page).toHaveURL(base + "apex-velocity/#collection");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${qa}/${label}-collection-desktop.png` });
  await page.getByRole("button", { name: /AV–02.*Afterhours/ }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: "Afterhours" }),
  ).toBeVisible();
  await expect(
    page.locator('[aria-label="Configuration helmet viewer"]'),
  ).toHaveAttribute("data-viewer-state", "ready");
  await page.getByRole("button", { name: /AV–03.*Saltline/ }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: "Saltline" }),
  ).toBeVisible();
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download your configuration" })
    .click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), "apex-velocity-saltline.json");
  await download.saveAs(`${qa}/${label}-configuration.json`);
  const json = JSON.parse(
    await readFile(`${qa}/${label}-configuration.json`, "utf8"),
  );
  assert.equal(json.variant.id, "saltline");
  assert.equal(json.colors.shell, "#e8e4d8");
  assert.equal(json.schemaVersion, "1.0");
  check("three editions update live studio; real JSON download");
  await page.goto(base + "apex-velocity/#configure");
  await page.reload();
  await expect(page.locator("#configure")).toBeInViewport();
  check("direct hash URL/reload");
  await page.getByRole("link", { name: "Return to collection" }).click();
  await expect(page).toHaveURL(base);
  await page.goBack();
  await expect(page).toHaveURL(base + "apex-velocity/#configure");
  await expect(page.locator("#configure")).toBeInViewport();
  check("return to catalog and browser Back");
  await page.goto(base + "apex-velocity/");
  await expect(
    page.locator('[aria-label="Hero helmet viewer"]'),
  ).toHaveAttribute("data-viewer-state", "ready");
  await page
    .locator('[aria-label="Hero helmet viewer"] canvas')
    .evaluate((canvas) =>
      canvas
        .getContext("webgl2")
        .getExtension("WEBGL_lose_context")
        .loseContext(),
    );
  await expect(hero).toHaveAttribute("data-viewer-state", "error");
  await expect(hero.getByRole("img")).toBeVisible();
  await page.getByRole("button", { name: "Use static view" }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Enable 3D" }).click();
  await expect(hero).toHaveAttribute("data-viewer-state", "ready");
  check("GPU context loss, local poster and static/restart controls");
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  await writeFile(
    `${qa}/${label}-axe.json`,
    JSON.stringify(axe.violations, null, 2),
  );
  assert.equal(
    axe.violations.length,
    0,
    JSON.stringify(
      axe.violations.map((x) => ({
        id: x.id,
        nodes: x.nodes.map((n) => n.target),
      })),
    ),
  );
  check("desktop automated accessibility");
  const widths = [360, 390, 768, 1440],
    layouts = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto(base + "apex-velocity/");
    await expect(
      page.locator('[aria-label="Hero helmet viewer"]'),
    ).toHaveAttribute("data-viewer-state", "ready");
    await page.waitForTimeout(1500);
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    layouts.push(layout);
    assert(layout.scrollWidth <= layout.width);
    if (width === 390) {
      await page.screenshot({ path: `${qa}/${label}-hero-mobile.png` });
      const trigger = page.getByRole("button", {
        name: "Open navigation menu",
      });
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("dialog")).toBeVisible();
      for (let i = 0; i < 9; i++) {
        await page.keyboard.press("Tab");
        assert(
          await page.evaluate(() => !!document.activeElement.closest("dialog")),
        );
      }
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "The helmets" })
        .click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${qa}/${label}-collection-mobile.png` });
    }
  }
  check("360 / 390 / 768 / 1440 overflow and mobile menu focus containment");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base + "apex-velocity/#story");
  await page.waitForTimeout(500);
  assert.equal(await page.locator(".pin-spacer").count(), 0);
  await expect(page.getByRole("heading", { name: /A FRACTION/ })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Rotate helmet right" }).first(),
  ).toBeAttached();
  check("reduced motion: natural flow and manual viewer");
  await page.goto(base + "luma/");
  await page.waitForTimeout(600);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Đi xa hơn.",
  );
  await page.getByRole("tab", { name: "Sương núi" }).click();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Nắng rừng" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("button", { name: "Đá núi", exact: true }).click();
  await page.getByRole("button", { name: "Chọn bộ máy của bạn" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Đóng tùy chọn bộ máy" }).click();
  const lumaAssets = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((r) => r.name),
  );
  assert(!lumaAssets.some((u) => /apex-velocity|Barlow|viewer-engine/.test(u)));
  check("Luma gallery, edition dialog and brand isolation");
  const fallback = await context.newPage();
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === "webgl" || type === "webgl2") return null;
      return original.call(this, type, ...args);
    };
  });
  await fallback.goto(base + "apex-velocity/");
  await expect(
    fallback.locator('[aria-label="Hero helmet viewer"]'),
  ).toHaveAttribute("data-viewer-state", "error");
  await expect(fallback.getByRole("heading", { level: 1 })).toBeVisible();
  await fallback.getByRole("button", { name: /AV–02.*Afterhours/ }).click();
  await expect(
    fallback.getByRole("heading", { level: 2, name: "Afterhours" }),
  ).toBeVisible();
  await fallback.screenshot({ path: `${qa}/${label}-no-webgl.png` });
  await fallback.close();
  check("WebGL unavailable: poster, narrative and configuration remain usable");
  const loadingContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const loading = await loadingContext.newPage();
  await loading.route("**/*viewer-engine*", (route) => route.abort());
  await loading.goto(base + "apex-velocity/");
  await expect(
    loading.locator('[aria-label="Hero helmet viewer"]'),
  ).toHaveAttribute("data-viewer-state", "error");
  await expect(
    loading.getByRole("link", { name: "Explore the helmets" }),
  ).toBeVisible();
  await expect(
    loading.locator('[aria-label="Hero helmet viewer"]').getByRole("img"),
  ).toBeVisible();
  await loadingContext.close();
  check("engine chunk load error keeps a poster and working collection CTA");
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  assert.deepEqual(consoleErrors, []);
  await writeFile(
    `${qa}/${label}-browser-results.json`,
    JSON.stringify(
      {
        base,
        checks,
        layouts,
        errors,
        failures,
        consoleErrors,
        catalogRequests,
        lumaAssets,
        userAgent: await page.evaluate(() => navigator.userAgent),
      },
      null,
      2,
    ),
  );
  console.log("ALL PASS", label);
} catch (error) {
  await page.screenshot({ path: `${qa}/${label}-failure.png` });
  console.error(error);
  await writeFile(
    `${qa}/${label}-failure.json`,
    JSON.stringify({ checks, errors, failures, error: String(error) }, null, 2),
  );
  process.exitCode = 1;
} finally {
  await browser.close();
}
