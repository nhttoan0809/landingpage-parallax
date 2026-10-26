/** Still assets are captured from exactly the live crystal geometry, lights and discovered state. */
import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const base = process.env.AETHER_QA_URL || "http://127.0.0.1:5184/";
const b = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});
const p = await b.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1.5,
});
await p.goto(base + "aether-story/");
await p.waitForSelector('[data-ready="true"] canvas[data-quality]');
await p.addStyleTag({
  content:
    '[data-crystal-slot]{width:300px!important;height:240px!important;margin:auto!important}html,body{background:#171522!important}.page,[class*="page_"]{background:#171522!important;visibility:visible!important}body *{visibility:hidden!important}canvas{visibility:visible!important}',
});
await p.evaluate(() =>
  scrollTo(0, document.getElementById("resonance").offsetTop),
);
await p.waitForTimeout(1000);
for (const [i, id] of ["sonora", "vela", "verdant"].entries()) {
  const slot = p.locator("[data-crystal-slot]").nth(i);
  for (const explored of [false, true]) {
    await slot.evaluate(
      (el, value) => (el.dataset.discovered = String(value)),
      explored,
    );
    await p.waitForTimeout(120);
    const bounds = await slot.boundingBox();
    const png = await p.screenshot({ clip: bounds });
    const webp = await p.evaluate(async (b64) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0);
      return c.toDataURL("image/webp", 0.99).split(",")[1];
    }, png.toString("base64"));
    await writeFile(
      `public/landings/aether-story/${id}-crystal${explored ? "-awakened" : ""}.webp`,
      Buffer.from(webp, "base64"),
    );
  }
}
await b.close();
