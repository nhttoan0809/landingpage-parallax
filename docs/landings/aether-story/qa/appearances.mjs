import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
const base = process.env.AETHER_QA_URL || "http://127.0.0.1:4184/";
const tag = new URL(base).pathname === "/" ? "normal" : "pages";
const out = "docs/landings/aether-story/qa";
const modes = [
  ["iridescent", "Iridescent GLSL"],
  ["holo", "Holo Wireframe"],
  ["magma", "Solar Magma GLSL"],
];
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});
const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const report = {
  base,
  date: new Date().toISOString(),
  browser: browser.version(),
  checks: [],
  errors: [],
  modes: [],
};
p.on("pageerror", (e) => report.errors.push(e.message));
p.on("console", (m) => {
  if (m.type() === "error") report.errors.push(m.text());
});
await p.addInitScript(() => {
  window.__draws = { lines: 0, triangles: 0 };
  window.__programCount = 0;
  for (const key of [
    "drawElements",
    "drawElementsInstanced",
    "drawArrays",
    "drawArraysInstanced",
  ]) {
    const original = WebGL2RenderingContext.prototype[key];
    WebGL2RenderingContext.prototype[key] = function (mode, ...args) {
      if (mode === this.LINES) window.__draws.lines++;
      if (mode === this.TRIANGLES) window.__draws.triangles++;
      return original.call(this, mode, ...args);
    };
  }
  for (const [key, direction] of [
    ["createProgram", 1],
    ["deleteProgram", -1],
  ]) {
    const original = WebGL2RenderingContext.prototype[key];
    WebGL2RenderingContext.prototype[key] = function (...args) {
      window.__programCount += direction;
      return original.apply(this, args);
    };
  }
});
const ready = () =>
  p.waitForSelector('[data-ready="true"] canvas[data-quality]');
const select = async (name) => {
  await p.getByRole("radio", { name, exact: true }).check();
  await p.waitForTimeout(180);
};
const chapter = async (id) => {
  await p.evaluate(
    (id) =>
      scrollTo(
        0,
        id === "footer"
          ? document.body.scrollHeight
          : document.getElementById(id).offsetTop,
      ),
    id,
  );
  await p.waitForTimeout(750);
};
const shot = async (name) =>
  p.screenshot({ path: `${out}/${tag}-appearance-${name}.png` });
try {
  await p.goto(base + "aether-story/");
  await ready();
  await shot("hero");
  const canvas = await p.locator("canvas").elementHandle();
  for (const [key, name] of modes) {
    await select(name);
    await chapter("rebirth");
    await p.evaluate(() => scrollBy(0, 220));
    await p.waitForTimeout(650);
    await p.evaluate(() => (window.__draws = { lines: 0, triangles: 0 }));
    await p.waitForTimeout(150);
    const draws = await p.evaluate(() => window.__draws);
    assert.equal(
      await p.locator("canvas").getAttribute("data-appearance"),
      key,
    );
    if (key === "holo")
      assert(draws.lines > 0, "Holo must issue actual GL.LINES draws");
    else assert.equal(draws.lines, 0);
    assert(
      await canvas.evaluate((c) => c === document.querySelector("canvas")),
    );
    await shot(key);
    report.modes.push({ key, name, draws });
  }
  await select("Solar Magma GLSL");
  await p.getByRole("button", { name: /Save preset/ }).click();
  await select("Iridescent GLSL");
  await p.getByRole("button", { name: "Restore saved", exact: true }).click();
  await expect(
    p.getByRole("radio", { name: "Solar Magma GLSL", exact: true }),
  ).toBeChecked();
  const download = p.waitForEvent("download");
  await p.getByRole("button", { name: "Export JSON", exact: true }).click();
  await (await download).saveAs(`${out}/${tag}-appearance-export.json`);
  const exported = JSON.parse(
    await readFile(`${out}/${tag}-appearance-export.json`, "utf8"),
  );
  assert.equal(exported.version, 4);
  assert.equal(exported.appearance, "magma");
  await p.getByLabel("Import preset JSON").setInputFiles({
    name: "bad-look.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({ ...exported, appearance: "__proto__" }),
    ),
  });
  await p.getByRole("alert").waitFor();
  assert(
    await p
      .getByRole("radio", { name: "Solar Magma GLSL", exact: true })
      .isChecked(),
  );
  await p.getByLabel("Import preset JSON").setInputFiles({
    name: "legacy-v2.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        ...exported,
        version: 2,
        appearance: undefined,
        palette: "opal",
      }),
    ),
  });
  await expect(
    p.getByRole("radio", { name: "Iridescent GLSL", exact: true }),
  ).toBeChecked();
  report.checks.push(
    "Three live finishes reuse one canvas; Holo uses real GL.LINES; v4 save/restore/export/invalid import and v2 migration pass",
  );
  await select("Solar Magma GLSL");
  await chapter("footer");
  await shot("magma-footer");
  await p
    .getByRole("button", { name: "Read without motion", exact: true })
    .first()
    .click();
  await ready();
  const images = [];
  for (const [key, name] of modes) {
    await select(name);
    const first = await p.locator("canvas").screenshot();
    await p.waitForTimeout(350);
    assert(
      first.equals(await p.locator("canvas").screenshot()),
      `${key} must freeze time in reduced motion`,
    );
    images.push(first);
    await p
      .locator("canvas")
      .screenshot({ path: `${out}/${tag}-appearance-static-${key}.png` });
  }
  for (let i = 0; i < images.length; i++)
    for (let j = i + 1; j < images.length; j++)
      assert(
        !images[i].equals(images[j]),
        "Each finish must have a distinct actual rendered preview",
      );
  await select("Iridescent GLSL");
  const slider = p.getByRole("slider", { name: "Iridescence", exact: true });
  const samples = [];
  for (const value of ["0", "1"]) {
    await slider.fill(value);
    const pixels = await p.locator("canvas").screenshot();
    await writeFile(`${out}/${tag}-iridescence-${value}.png`, pixels);
    const stats = await p.evaluate(async (b64) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, c.width, c.height);
      let sum = 0,
        count = 0,
        chroma = 0;
      for (let i = 0; i < data.length; i += 4) {
        const max = Math.max(data[i], data[i + 1], data[i + 2]),
          min = Math.min(data[i], data[i + 1], data[i + 2]);
        if (max - min > 35) {
          sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          chroma += max - min;
          count++;
        }
      }
      return {
        colouredPixels: count,
        meanColouredLuma: sum / count,
        meanChroma: chroma / count,
      };
    }, pixels.toString("base64"));
    samples.push({ value, ...stats });
  }
  report.iridescence = samples;
  assert(
    samples[1].meanColouredLuma > samples[0].meanColouredLuma,
    "Maximum iridescence should visibly raise the coloured highlight luminance",
  );
  for (const [, name] of modes) await select(name);
  const warmed = await p.evaluate(() => window.__programCount);
  for (let cycle = 0; cycle < 3; cycle++)
    for (const [, name] of modes) await select(name);
  assert.equal(await p.evaluate(() => window.__programCount), warmed);
  report.warmedProgramCount = warmed;
  report.checks.push(
    "All three static WebGL finishes remain pixel-still and distinct; iridescence 0→1 raises measured coloured-pixel luminance; repeated switches reuse warmed shader programs",
  );
  await p
    .getByRole("button", { name: "Explore with motion", exact: true })
    .first()
    .click();
  await ready();
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForSelector('canvas[data-quality="low"]');
  for (const [key, name] of modes) {
    await select(name);
    await p.locator("[data-rebirth-slot]").scrollIntoViewIfNeeded();
    await p.waitForTimeout(750);
    await shot("mobile-" + key);
    assert(
      !(await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )),
    );
  }
  await p.getByLabel("Render quality").selectOption("high");
  await p.waitForSelector('canvas[data-quality="high"]');
  assert.equal(
    await p.locator("canvas").getAttribute("data-appearance"),
    "magma",
  );
  report.checks.push(
    "All finishes work on compact low tier, retain selected appearance through quality reload, and do not overflow",
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
    `${out}/${tag}-appearances.json`,
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
