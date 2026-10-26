import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const base=process.env.AETHER_QA_URL||'http://127.0.0.1:4183/landingpage-parallax/';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.addInitScript(()=>{
 window.__sceneFrames=0;const original=window.requestAnimationFrame;
 window.requestAnimationFrame=callback=>{const scene=new Error().stack?.includes('/assets/scene-');return original.call(window,time=>{if(scene)window.__sceneFrames++;callback(time)})};
 const Context=window.AudioContext;window.__contexts=[];window.AudioContext=class extends Context{constructor(...args){super(...args);window.__contexts.push(this)}};
});
try {
 await page.goto(base+'aether-story/');await page.waitForSelector('[data-ready="true"] canvas[data-quality]');await page.getByRole('button',{name:'Sound off',exact:true}).click();
 await page.waitForTimeout(250);const before=await page.evaluate(()=>({frames:window.__sceneFrames,audio:window.__contexts[0].state}));assert(before.frames>0);assert.equal(before.audio,'running');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});
 await page.waitForTimeout(150);const hiddenStart=await page.evaluate(()=>window.__sceneFrames);await page.waitForTimeout(350);
 const hidden=await page.evaluate(()=>({frames:window.__sceneFrames,audio:window.__contexts[0].state}));assert.equal(hidden.frames,hiddenStart);assert.equal(hidden.audio,'suspended');
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});await page.waitForTimeout(250);
 const resumed=await page.evaluate(()=>({frames:window.__sceneFrames,audio:window.__contexts[0].state}));assert(resumed.frames>hidden.frames);assert.equal(resumed.audio,'running');
 await page.getByRole('button',{name:'Sound on',exact:true}).click();
 await page.getByRole('button',{name:'Read without motion',exact:true}).first().click();await page.waitForSelector('[data-static="true"]');await page.waitForTimeout(350);
 const staticStart=await page.evaluate(()=>window.__sceneFrames);await page.waitForTimeout(350);const staticEnd=await page.evaluate(()=>window.__sceneFrames);assert.equal(staticStart,staticEnd);
 const report={base,method:'Real Chrome/WebGL and Web Audio. Instrumented scene-requested RAF only. Synthetic document.hidden visibilitychange verifies handlers; this is not a physical OS tab switch.',before,hidden,resumed,staticFrames:{start:staticStart,end:staticEnd},pass:true};
 await writeFile('docs/landings/aether-story/qa/lifecycle.json',JSON.stringify(report,null,2));console.log(report);
}finally{await browser.close()}
