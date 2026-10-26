import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile, rename } from 'node:fs/promises';
const base=process.env.AETHER_QA_URL||'http://127.0.0.1:4184/';
const out='docs/landings/aether-story/qa';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const report={base,date:new Date().toISOString(),browser:browser.version(),checks:[],errors:[]};
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out,size:{width:1440,height:900}}});
 const page=await context.newPage();const video=page.video();
 page.on('pageerror',error=>report.errors.push(error.message));
 page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text())});
 await page.goto(base+'aether-story/');await page.waitForSelector('[data-ready="true"] canvas[data-quality]');
 const high=await page.locator('canvas').evaluate(canvas=>({...canvas.dataset}));
 assert.equal(Number(high.feathers),701);assert.equal(Number(high.featherBatches),17);assert.equal(Number(high.tailRibbons),9);report.high=high;
 const moving=await page.locator('canvas').screenshot();await page.waitForTimeout(800);
 assert(!moving.equals(await page.locator('canvas').screenshot()));report.checks.push('Real rendered canvas changes during idle flight');
 for(const [id,extra] of [['spark',260],['formation',0],['resonance',0],['rebirth',0],['reimagine',0]]){
  const start=await page.evaluate(()=>scrollY), end=await page.evaluate(({id,extra})=>document.getElementById(id).offsetTop+extra,{id,extra});
  for(let step=1;step<=20;step++){await page.evaluate(y=>scrollTo(0,y),start+(end-start)*step/20);await page.waitForTimeout(45);}
  await page.waitForTimeout(700);
 }
 await page.getByRole('button',{name:'Read without motion',exact:true}).first().click();await page.waitForSelector('[data-static="true"]');await page.waitForSelector('[data-ready="true"] canvas[data-quality]');await page.waitForTimeout(300);
 const still=await page.locator('canvas').screenshot();await page.waitForTimeout(700);assert(still.equals(await page.locator('canvas').screenshot()));report.checks.push('Static render is pixel-identical across time');
 await page.getByRole('radio',{name:'Holo Wireframe',exact:true}).check();const tide=await page.locator('canvas').screenshot();assert(!still.equals(tide));report.checks.push('Appearance changes rendering even with motion frozen');
 await page.getByLabel('Render quality').selectOption('low');await page.waitForSelector('canvas[data-quality="low"]');
 const low=await page.locator('canvas').evaluate(canvas=>({...canvas.dataset}));assert.equal(Number(low.feathers),276);assert.equal(Number(low.tailRibbons),9);report.low=low;report.checks.push('Low tier retains all joints and nine ribbons with reduced feather density');
 assert.deepEqual(report.errors,[]);
 await context.close();await rename(await video.path(),out+'/phoenix-v2-motion.webm');
 const p=await browser.newPage();await p.goto(base);await p.waitForLoadState('networkidle');
 for(const [name,slug] of [['Aether Studio','aether-story'],['Apex Velocity','apex-velocity'],['Luma Field','luma']]){
  await p.goto(base);await p.getByRole('heading',{name,exact:true}).click();await p.waitForLoadState('networkidle');assert(new URL(p.url()).pathname.endsWith('/'+slug+'/'));await p.reload();assert(await p.locator('h1').count()>0);
 }
 report.checks.push('Catalog links and direct reload work for all three brands');
 report.pass=true;console.log(JSON.stringify(report,null,2));
}catch(error){report.pass=false;report.failure=error.stack;throw error;}finally{await writeFile(out+'/phoenix-v2.json',JSON.stringify(report,null,2));await browser.close();}
