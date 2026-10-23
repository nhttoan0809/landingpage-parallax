// Run while the Vite dev server is on port 5180. Renders the original model, not a reference image.
import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 900, height: 900 },
  deviceScaleFactor: 1,
});
await page.goto("http://127.0.0.1:5180/apex-velocity/");
await page.evaluate(async () => {
  const { mountViewer } = await import(
    "/src/landings/apex-velocity/viewer-engine.ts"
  );
  const { variants } = await import("/src/landings/apex-velocity/variants.ts");
  document.getElementById("root").remove();
  document.body.style.cssText = "margin:0;background:transparent";
  document.documentElement.style.background = "transparent";
  const host = document.createElement("div");
  host.style.cssText = "width:900px;height:900px";
  document.body.append(host);
  window.posterViewer = mountViewer(
    host,
    variants[0],
    { angle: -0.18, scale: 1.12, tilt: 0.04 },
    () => {},
    () => {},
  );
  window.posterVariants = variants;
});
for (let i = 0; i < 3; i++) {
  await page.evaluate(
    (i) => window.posterViewer.update(window.posterVariants[i]),
    i,
  );
  await page.waitForTimeout(500);
  await page.screenshot({
    path: `docs/landings/apex-velocity/qa/${["ignition", "afterhours", "saltline"][i]}-render.png`,
    omitBackground: true,
  });
  const encoded = await page.evaluate(
    () => window.posterViewer.capture().split(",")[1],
  );
  await writeFile(
    `public/landings/apex-velocity/${["ignition", "afterhours", "saltline"][i]}.webp`,
    Buffer.from(encoded, "base64"),
  );
}
await writeFile(
  "docs/landings/apex-velocity/qa/poster-renderer.json",
  JSON.stringify(
    await page.evaluate(() => ({
      userAgent: navigator.userAgent,
      dpr: devicePixelRatio,
    })),
    null,
    2,
  ),
);
await browser.close();
