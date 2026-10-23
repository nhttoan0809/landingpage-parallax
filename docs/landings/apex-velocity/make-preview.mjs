import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
await page.goto("http://127.0.0.1:5180/apex-velocity/");
await page.evaluate(() => document.fonts.ready);
const data = await page.evaluate(async () => {
  const image = new Image();
  image.src = "/landings/apex-velocity/ignition.webp";
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f0eee7";
  ctx.fillRect(0, 0, 1200, 800);
  ctx.strokeStyle = "#e85928";
  ctx.lineWidth = 90;
  ctx.beginPath();
  ctx.arc(920, 410, 260, 0.4, Math.PI * 1.85);
  ctx.stroke();
  ctx.fillStyle = "#25282a";
  ctx.font = 'italic 800 130px "Barlow Condensed"';
  ctx.fillText("CHASE", 55, 315);
  ctx.fillText("THE EDGE.", 55, 430);
  ctx.font = "28px Barlow";
  ctx.fillText("APEX VELOCITY", 58, 90);
  ctx.font = "22px Barlow";
  ctx.fillText("Alex Vale / Driver 27", 58, 703);
  ctx.drawImage(image, 540, 100, 640, 640);
  return canvas.toDataURL("image/webp", 0.91).split(",")[1];
});
await writeFile(
  "public/landings/apex-velocity/preview.webp",
  Buffer.from(data, "base64"),
);
await browser.close();
