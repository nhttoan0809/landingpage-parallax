/** Chapter controls and footer regression checks in real Chrome/WebGL. */
import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
const base = process.env.AETHER_QA_URL || "http://127.0.0.1:4184/";
const tag = new URL(base).pathname === "/" ? "normal" : "pages";
const out = "docs/landings/aether-story/qa";
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});
const report = {
  base,
  date: new Date().toISOString(),
  browser: browser.version(),
  checks: [],
  errors: [],
};
const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
p.on("pageerror", (e) => report.errors.push(e.message));
p.on("console", (m) => {
  if (m.type() === "error") report.errors.push(m.text());
});
const ready = () =>
  p.waitForSelector('[data-ready="true"] canvas[data-quality]');
const scroll = async (id, extra = 0) => {
  await p.evaluate(
    ({ id, extra }) =>
      scrollTo(
        0,
        id === "footer"
          ? document.body.scrollHeight
          : document.getElementById(id).offsetTop + extra,
      ),
    { id, extra },
  );
  await p.waitForTimeout(800);
};
const shot = async (name) =>
  p.screenshot({ path: `${out}/${tag}-workshop-${name}.png` });
const field = (name) => p.getByRole("slider", { name, exact: true });
const wingbeats = () => p.getByRole("switch", { name: /Allow wingbeats/ });
try {
  await p.goto(base + "aether-story/");
  await ready();
  await shot("spark");
  const crossing = await p.evaluate(
    () => document.getElementById("formation").offsetTop * 0.56,
  );
  await p.evaluate((y) => scrollTo(0, y), crossing);
  await p.waitForTimeout(800);
  await shot("bank");
  await scroll("formation");
  await shot("formation");
  assert((await p.locator("#formation h2").boundingBox()).x > 720);
  assert((await p.locator("#spark h1").boundingBox()).x < 432);
  const canvas = await p.locator("canvas").elementHandle();
  await field("Wingbeat speed").focus();
  await p.keyboard.press("ArrowRight");
  assert.equal(await field("Wingbeat speed").inputValue(), "1.05");
  await field("Wingbeat speed").fill("1.65");
  await field("Wing openness").fill("0.38");
  await wingbeats().focus();
  await p.keyboard.press("Space");
  assert(await field("Wingbeat speed").isDisabled());
  assert.equal(
    await p.locator("canvas").getAttribute("data-flap-enabled"),
    "false",
  );
  await wingbeats().check();
  assert(await field("Wingbeat speed").isEnabled());
  await scroll("rebirth");
  await shot("rebirth");
  for (const [name, value, key] of [
    ["Iridescence", "0.91", "iridescence"],
    ["Dispersion", "0.22", "dispersion"],
    ["Inner glow", "0.7", "glow"],
  ]) {
    await field(name).fill(value);
    assert.equal(await p.locator("canvas").getAttribute("data-" + key), value);
  }
  assert(
    await canvas.evaluate((c) => c === document.querySelector("canvas")),
    "Inputs must update the existing scene, without replacing its canvas",
  );
  await scroll("reimagine");
  await p.getByRole("radio", { name: "Holo Wireframe", exact: true }).check();
  await p.getByRole("button", { name: /Save preset/ }).click();
  const saved = await p.evaluate(() =>
    JSON.parse(localStorage.getItem("aether.phoenix.v1")),
  );
  assert.deepEqual(saved, {
    schema: "aether.phoenix",
    version: 4,
    appearance: "holo",
    dispersion: 0.22,
    glow: 0.7,
    iridescence: 0.91,
    flapEnabled: true,
    flapSpeed: 1.65,
    wingSpread: 0.38,
  });
  const download = p.waitForEvent("download");
  await p.getByRole("button", { name: "Export JSON", exact: true }).click();
  const file = await download;
  await file.saveAs(`${out}/${tag}-workshop-export.json`);
  assert.deepEqual(
    JSON.parse(await readFile(`${out}/${tag}-workshop-export.json`, "utf8")),
    saved,
  );
  await p.getByRole("button", { name: "Reset", exact: true }).click();
  await p.getByRole("button", { name: "Restore saved", exact: true }).click();
  assert.equal(await field("Wingbeat speed").inputValue(), "1.65");
  assert.equal(await field("Iridescence").inputValue(), "0.91");
  report.checks.push(
    "Both chapter controls update one live scene; native keyboard switch/range controls; all settings survive save/reset/restore and JSON export",
  );
  await p.getByLabel("Import preset JSON").setInputFiles({
    name: "legacy.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        schema: "aether.phoenix",
        version: 1,
        palette: "ember",
        dispersion: 0.2,
        glow: 0.7,
      }),
    ),
  });
  await expect(
    p.getByRole("radio", { name: "Iridescent GLSL", exact: true }),
  ).toBeChecked();
  assert.equal(await field("Wingbeat speed").inputValue(), "1");
  assert.equal(await field("Iridescence").inputValue(), "0.45");
  report.checks.push(
    "Legacy v1 JSON imports with safe defaults for new attributes",
  );
  await p.getByRole("button", { name: "Reset", exact: true }).click();
  await scroll("reimagine");
  await shot("portrait");
  await scroll("footer");
  await shot("footer");
  report.footer = await p.locator("footer").boundingBox();
  report.checks.push(
    "Captured full-page-bottom portrait above footer for visual inspection",
  );
  await p
    .getByRole("button", { name: "Read without motion", exact: true })
    .first()
    .click();
  await ready();
  assert(await wingbeats().isDisabled());
  assert(await field("Wingbeat speed").isDisabled());
  report.staticChanges = [];
  for (const name of [
    "Wing openness",
    "Iridescence",
    "Dispersion",
    "Inner glow",
  ]) {
    await field(name).fill("0");
    const before = await p.locator("canvas").screenshot();
    await field(name).fill("1");
    const after = await p.locator("canvas").screenshot();
    assert(
      !before.equals(after),
      `${name} must change the actual frozen material-study canvas`,
    );
    report.staticChanges.push(name);
  }
  const frozen = await p.locator("canvas").screenshot();
  await p.waitForTimeout(500);
  assert(frozen.equals(await p.locator("canvas").screenshot()));
  report.checks.push(
    "Each wing/light attribute changes the frozen WebGL preview independently; reduced motion remains pixel-still",
  );
  await p
    .getByRole("button", { name: "Explore with motion", exact: true })
    .first()
    .click();
  await ready();
  await p.getByRole("button", { name: "Reset", exact: true }).click();
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForSelector('canvas[data-quality="low"]');
  for (const id of ["formation", "rebirth"]) {
    await scroll(id);
    await shot("mobile-" + id);
    const slot =
      id === "formation" ? "[data-formation-slot]" : "[data-rebirth-slot]";
    await p.locator(slot).scrollIntoViewIfNeeded();
    await p.waitForTimeout(800);
    await shot("mobile-" + id + "-sculpture");
  }
  await scroll("reimagine");
  await shot("mobile-portrait");
  await scroll("footer");
  await shot("mobile-footer");
  assert(
    !(await p.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    )),
  );
  report.checks.push(
    "Mobile chapter sculpture slots, final portrait and footer captured; no horizontal overflow",
  );
  assert.deepEqual(report.errors, []);
  report.pass = true;
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  report.pass = false;
  report.failure = error.stack;
  process.exitCode = 1;
  console.error(error);
} finally {
  await writeFile(
    `${out}/${tag}-workshop.json`,
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
