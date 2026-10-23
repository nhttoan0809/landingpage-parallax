import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const base=process.env.AETHER_QA_URL||'http://127.0.0.1:4182/';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const results=[];
for(const {name,width,height,dpr,quality} of [{name:'desktop-high',width:1440,height:900,dpr:2,quality:'high'},{name:'desktop-mobile-emulation-low',width:390,height:844,dpr:3,quality:'low'}]) {
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr});
 await page.goto(base+'aether-story/');await page.waitForSelector('[data-ready="true"]');
 await page.getByLabel('Render quality').selectOption(quality);await page.waitForTimeout(800);await page.waitForSelector(`[data-quality="${quality}"]`);
 await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(1000);
 const info=await page.evaluate(()=>{const c=document.querySelector('canvas'),gl=c.getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');return {gpu:gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),devicePixelRatio,backing:[c.width,c.height],canvas:{...c.dataset},visibility:document.visibilityState,userAgent:navigator.userAgent}});
 console.log('Measuring 30 seconds:',name);
 const measurement=await page.evaluate(()=>new Promise(resolve=>{
  const offsets=['spark','formation','resonance','rebirth','reimagine'].map(id=>document.getElementById(id).offsetTop);
  let start=0,last=0;const intervals=[];
  function tick(now){
   if(!start){start=now;last=now;}else{intervals.push(now-last);last=now;}
   const elapsed=now-start;
   const cycle=Math.min(1,elapsed/30000)*8;
   const p=cycle<=4?cycle:8-cycle;
   const i=Math.min(3,Math.floor(p)), fraction=p-i;
   const t=Math.max(0,Math.min(1,(fraction-.22)/.68));const eased=t*t*(3-2*t);
   window.scrollTo(0,offsets[i]+(offsets[i+1]-offsets[i])*eased);
   if(elapsed<30000)requestAnimationFrame(tick);else{
    const sorted=[...intervals].sort((a,b)=>a-b);
    resolve({durationMs:elapsed,frames:intervals.length,averageFps:1000*intervals.length/elapsed,p95FrameIntervalMs:sorted[Math.ceil(sorted.length*.95)-1],maxIntervalMs:Math.max(...intervals),method:'requestAnimationFrame intervals, 30 s after warm-up; programmed native scroll through four chapters forward and reverse; reading holds in each segment',realMobileDevice:false});
   }
  }requestAnimationFrame(tick);
 }));
 results.push({name,viewport:{width,height},dpr,quality,...info,...measurement});await page.close();
}
await writeFile('docs/landings/aether-story/qa/performance.json',JSON.stringify({base,browser:browser.version(),date:new Date().toISOString(),results},null,2));
console.log(JSON.stringify(results,null,2));await browser.close();
