import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const base = process.env.AETHER_QA_URL || "http://127.0.0.1:4184/";
const tag = new URL(base).pathname === "/" ? "normal" : "pages";
const out = "docs/landings/aether-story/qa";
const b = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const report = {
  base,
  date: new Date().toISOString(),
  checks: [],
  errors: [],
  crystalComparison: [],
  portraits: [],
};
p.on("pageerror", (e) => report.errors.push(e.message));
p.on("console", (m) => {
  if (m.type() === "error") report.errors.push(m.text());
});
const ready = () =>
  p.waitForSelector('[data-ready="true"] canvas[data-quality]');
const scroll = async (id, delta = 0) => {
  await p.evaluate(
    ({ id, delta }) =>
      scrollTo(
        0,
        id === "footer"
          ? document.body.scrollHeight
          : document.getElementById(id).offsetTop + delta,
      ),
    { id, delta },
  );
  await p.waitForTimeout(850);
};
const shot = async (name) =>
  p.screenshot({ path: `${out}/${tag}-refined-${name}.png` });
const sampleSlot = async (i) => {
  const png = await p.locator("[data-crystal-slot]").nth(i).screenshot();
  return p.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let rgb = [0, 0, 0],
      count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.max(data[i], data[i + 1], data[i + 2]) > 45) {
        for (let j = 0; j < 3; j++) rgb[j] += data[i + j];
        count++;
      }
    }
    return { rgb: rgb.map((v) => v / count), count };
  }, png.toString("base64"));
};
const silhouette = async () => {
  const png = await p.screenshot();
  return p.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let left = c.width,
      right = 0,
      top = c.height,
      bottom = 0,
      count = 0,
      sumX = 0;
    for (let y = 90; y < c.height; y++)
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4,
          max = Math.max(data[i], data[i + 1], data[i + 2]),
          min = Math.min(data[i], data[i + 1], data[i + 2]);
        if (max - min > 70 && max > 135 && min < 190) {
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
          count++;
          sumX += x;
        }
      }
    return { left, right, top, bottom, count, centerX: sumX / count };
  }, png.toString("base64"));
};
try {
  await p.goto(base + "aether-story/");
  await ready();
  assert.equal(
    await p
      .getByRole("radiogroup", { name: "Phoenix appearance" })
      .getByRole("radio")
      .count(),
    3,
  );
  assert.equal(
    await p
      .getByRole("radio", { name: "Prismatic Glass", exact: true })
      .count(),
    0,
  );
  assert.equal(
    await p.getByText("Choose a palette", { exact: true }).count(),
    0,
  );
  report.checks.push(
    "Exactly three appearances; Glass and the palette chooser are removed",
  );
  // Sample the end of Formation and the entrance to Rebirth, in either scroll direction.
  const offsets = await p.evaluate(() =>
    ["spark", "formation", "resonance", "rebirth", "reimagine"].map(
      (id) => document.getElementById(id).offsetTop,
    ),
  );
  for (const [name, progress] of [
    ["leaving-left", 0.42],
    ["gone-left", 0.48],
    ["gallery", 0.56],
    ["returning-right", 0.72],
    ["returned", 0.8],
  ]) {
    const index = Math.min(3, Math.floor(progress * 4)),
      fraction = progress * 4 - index;
    await p.evaluate(
      (y) => scrollTo(0, y),
      offsets[index] + (offsets[index + 1] - offsets[index]) * fraction,
    );
    await p.waitForTimeout(850);
    await shot(name);
  }
  await scroll("resonance");
  await p.mouse.move(1400, 880);
  const before = [];
  for (let i = 0; i < 3; i++) before.push(await sampleSlot(i));
  await shot("crystals-motion");
  await p
    .getByRole("button", { name: "Explore Sonora case study", exact: true })
    .click();
  await p.keyboard.press("Escape");
  await expect(p.locator("[data-crystal-slot]").first()).toHaveAttribute(
    "data-discovered",
    "true",
  );
  await p.mouse.move(1400, 880);
  await p
    .getByRole("button", { name: "Explore Sonora case study", exact: true })
    .evaluate((e) => e.blur());
  await p.waitForTimeout(350);
  const discovered = await sampleSlot(0);
  assert(discovered.rgb.some((v, i) => Math.abs(v - before[0].rgb[i]) > 10));
  await shot("crystals-discovered");
  await p
    .getByRole("button", { name: "Read without motion", exact: true })
    .first()
    .click();
  await ready();
  await scroll("resonance");
  await p.mouse.move(1400, 880);
  assert.equal(
    await p.locator('[data-crystal-slot][data-discovered="true"]').count(),
    1,
  );
  for (let i = 0; i < 3; i++) {
    const still = await sampleSlot(i),
      reference = i === 0 ? discovered : before[i];
    const delta = still.rgb.map((v, j) => Math.abs(v - reference.rgb[j]));
    assert(
      Math.max(...delta) < 12,
      `Crystal ${i} static/motion colour must match`,
    );
    report.crystalComparison.push({
      i,
      motion: reference,
      static: still,
      absoluteChannelDelta: delta,
    });
  }
  await shot("crystals-static");
  report.checks.push(
    "Exploring a story awakens its core/orbit, and the discovered state survives switching to static reading; motion/static colours agree",
  );
  await p
    .getByRole("button", { name: "Explore with motion", exact: true })
    .first()
    .click();
  await ready();
  for (const [width, height] of [
    [1440, 900],
    [2404, 1268],
    [390, 844],
  ]) {
    await p.setViewportSize({ width, height });
    await ready();
    await scroll("reimagine");
    await shot(`portrait-${width}`);
    const slot = await p.locator("[data-final-slot]").boundingBox(),
      footer = await p.locator("footer").boundingBox();
    const bounds = await silhouette();
    assert(bounds.count > 500, "The final phoenix must be visibly present");
    if (width > 767) {
      assert(
        bounds.centerX < width * 0.55,
        "After resize the portrait must stay beside, not behind, its controls",
      );
      assert(
        bounds.right < slot.x + slot.width + 35 && bounds.left > slot.x - 35,
        "Full feather envelope must fit the portrait width",
      );
      assert(
        bounds.right - bounds.left > width * 0.23,
        "The desktop phoenix must occupy a substantial part of its column",
      );
    }
    report.portraits.push({ width, height, slot, footer, bounds });
    await scroll("footer");
    await shot(`footer-${width}`);
    if (width > 767) {
      const bounds = await silhouette(),
        footer = await p.locator("footer").boundingBox();
      assert(
        bounds.bottom < footer.y - 12,
        "The full tail must stay above the footer",
      );
    }
    assert(
      !(await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )),
    );
  }
  report.checks.push(
    "Larger final sculpture reviewed at 1440/2404 desktop and 390 mobile; footer states and overflow checked",
  );
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.getByRole("radio", { name: "Solar Magma GLSL", exact: true }).check();
  await p.getByRole("button", { name: /Save preset/ }).click();
  const saved = await p.evaluate(() =>
    JSON.parse(localStorage.getItem("aether.phoenix.v1")),
  );
  assert.equal(saved.version, 4);
  assert.equal(saved.appearance, "magma");
  assert(!("palette" in saved));
  await p.getByRole("button", { name: "Reset", exact: true }).click();
  await p.getByRole("button", { name: "Restore saved", exact: true }).click();
  await expect(
    p.getByRole("radio", { name: "Solar Magma GLSL", exact: true }),
  ).toBeChecked();
  report.checks.push(
    "Preset v4 persists appearance and numeric controls without a palette field",
  );
  assert.deepEqual(report.errors, []);
  report.pass = true;
  console.log(JSON.stringify(report, null, 2));
} catch (e) {
  report.pass = false;
  report.failure = e.stack;
  process.exitCode = 1;
  console.error(e);
} finally {
  await writeFile(
    `${out}/${tag}-refinement.json`,
    JSON.stringify(report, null, 2),
  );
  await b.close();
}
