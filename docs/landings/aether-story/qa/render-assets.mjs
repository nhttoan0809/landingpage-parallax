import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1200,height:1200},deviceScaleFactor:1,reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:5182/aether-story/');
await page.waitForSelector('[data-ready="true"]');
await page.addStyleTag({content:'[class*="staticPreview"]{position:fixed!important;inset:0!important;width:1200px!important;height:1200px!important;margin:0!important;z-index:100!important;background:#eeedf4} body *{visibility:hidden!important} canvas{visibility:visible!important} [class*="sceneStatus"],[class*="chapterNav"]{display:none!important}'});
await page.waitForTimeout(1000);
const shot=await page.locator('canvas').screenshot();
// Encode an actual rendered canvas as WebP through the browser's native image encoder.
const base64=await page.evaluate(async b64=>{const img=new Image();img.src='data:image/png;base64,'+b64;await img.decode();const c=document.createElement('canvas');c.width=1200;c.height=1200;c.getContext('2d').drawImage(img,0,0);return c.toDataURL('image/webp',.92).split(',')[1];},shot.toString('base64'));
await writeFile('public/landings/aether-story/poster.webp',Buffer.from(base64,'base64'));
// Branded catalog preview rendered from the same original model, without application chrome.
const preview=await page.evaluate(async b64=>{const img=new Image();img.src='data:image/png;base64,'+b64;await img.decode();const c=document.createElement('canvas');c.width=900;c.height=600;const ctx=c.getContext('2d');ctx.fillStyle='#eeedf4';ctx.fillRect(0,0,900,600);ctx.drawImage(img,350,25,550,550);await document.fonts.ready;ctx.fillStyle='#272536';ctx.font='24px Manrope';ctx.fillText('Aether Studio',58,72);ctx.font='70px "Cormorant Garamond"';ctx.fillText('An idea',55,250);ctx.fillText('takes flight.',55,315);ctx.font='13px Manrope';ctx.fillText('An exploration of light & possibility.',58,540);return c.toDataURL('image/webp',.92).split(',')[1];},shot.toString('base64'));
await writeFile('public/landings/aether-story/preview.webp',Buffer.from(preview,'base64'));
await browser.close();
