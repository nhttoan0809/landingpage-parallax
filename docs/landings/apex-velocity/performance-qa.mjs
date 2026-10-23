import { chromium, expect } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const base = process.env.QA_URL || "http://127.0.0.1:5180/";
const label = process.env.QA_LABEL || "dev";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto(base + "apex-velocity/");
await expect(page.locator('[aria-label="Hero helmet viewer"]')).toHaveAttribute(
  "data-viewer-state",
  "ready",
);
await page.locator("#configure").scrollIntoViewIfNeeded();
await expect(
  page.locator('[aria-label="Configuration helmet viewer"]'),
).toHaveAttribute("data-viewer-state", "ready");
await page.locator("#story").scrollIntoViewIfNeeded();
await expect(
  page.locator('[aria-label="Story helmet viewer"]'),
).toHaveAttribute("data-viewer-state", "ready");
await page.waitForTimeout(1000);
const result = await page.evaluate(async () => {
  const story = document.getElementById("story"),
    canvas = document.querySelector(
      '[aria-label="Story helmet viewer"] canvas',
    );
  const startY = story.getBoundingClientRect().top + scrollY - 78;
  const gl = canvas.getContext("webgl2"),
    ext = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = ext
    ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
    : gl.getParameter(gl.RENDERER);
  document.documentElement.style.scrollBehavior = "auto";
  scrollTo(0, startY + 400);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const initial = Number(canvas.dataset.frames),
    intervals = [];
  let start = 0,
    previous = 0;
  await new Promise((resolve) => {
    function sample(t) {
      if (!start) {
        start = t;
        previous = t;
      } else {
        intervals.push(t - previous);
        previous = t;
      }
      const elapsed = t - start;
      scrollTo(0, startY + 450 + Math.sin(elapsed / 1900) * 350);
      if (elapsed < 30000) requestAnimationFrame(sample);
      else resolve();
    }
    requestAnimationFrame(sample);
  });
  const final = Number(canvas.dataset.frames),
    duration = intervals.reduce((a, b) => a + b, 0),
    sorted = [...intervals].sort((a, b) => a - b);
  return {
    durationMs: duration,
    rafFrames: intervals.length,
    averageRafFps: intervals.length / (duration / 1000),
    renderedFrames: final - initial,
    averageViewerFps: (final - initial) / (duration / 1000),
    p95FrameIntervalMs: sorted[Math.floor(sorted.length * 0.95)],
    maxFrameIntervalMs: sorted.at(-1),
    viewport: [innerWidth, innerHeight],
    devicePixelRatio: devicePixelRatio,
    canvasPixels: [canvas.width, canvas.height],
    gpu: renderer,
    userAgent: navigator.userAgent,
    resources: performance.getEntriesByType("resource").map((r) => ({
      url: r.name,
      encodedBodySize: r.encodedBodySize,
      decodedBodySize: r.decodedBodySize,
      transferSize: r.transferSize,
    })),
    test: "30s warmed desktop story viewer; sinusoidal scroll through pinned scrub range; browser RAF intervals plus actual viewer frame counter",
  };
});
result.networkSummary = {
  encodedResourceBytes: result.resources.reduce(
    (sum, item) => sum + item.encodedBodySize,
    0,
  ),
  encodedVisualFontBytes: result.resources
    .filter((item) => /\.(webp|svg|ttf)$/.test(item.url))
    .reduce((sum, item) => sum + item.encodedBodySize, 0),
  resourceCount: result.resources.length,
};
await writeFile(
  `docs/landings/apex-velocity/qa/${label}-performance.json`,
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify({ ...result, resources: undefined }, null, 2));
await browser.close();
