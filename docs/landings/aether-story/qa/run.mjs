/** Real Chrome/WebGL acceptance checks. Run with AETHER_QA_URL pointing to a production preview. */
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
const base = process.env.AETHER_QA_URL || 'http://127.0.0.1:4182/';
const tag = new URL(base).pathname === '/' ? 'normal' : 'pages';
const out = 'docs/landings/aether-story/qa';
await mkdir(out,{recursive:true});
const browser = await chromium.launch({ channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist'] });
const report={base,date:new Date().toISOString(),browser:browser.version(),checks:[],errors:[],requests:[],responsive:[]};
const pass=(name,details={})=>{report.checks.push({name,...details});console.log('PASS',name)};
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on('pageerror',e=>report.errors.push(e.message));
page.on('console',m=>{if(m.type()==='error'||m.text().includes('GL_INVALID'))report.errors.push(m.text())});
page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`)});
const ready=async p=>p.waitForSelector('[data-ready="true"]',{timeout:20000});
const chapter=async(id,delta=0)=>{await page.evaluate(({id,delta})=>window.scrollTo(0,document.getElementById(id).offsetTop+delta),{id,delta});await page.waitForTimeout(650)};
try {
 await page.goto(base); await page.waitForLoadState('networkidle');
 const catalog=await page.evaluate(()=>({resources:performance.getEntriesByType('resource').map(r=>r.name),css:[...document.styleSheets].map(s=>s.href),lenis:document.documentElement.className}));
 assert(!catalog.resources.some(n=>/\/assets\/(scene|SceneView|aether-story)-.*\.js/.test(n)||/aether-story\/fonts/.test(n)));
 assert(!catalog.lenis.includes('lenis')); assert.equal(catalog.css.length,1);
 pass('Catalog owns its stylesheet and does not load Aether scene, fonts or Lenis',catalog);
 const origin=await page.evaluate(()=>performance.timeOrigin);
 await page.getByRole('heading',{name:'Aether Studio',exact:true}).click();await ready(page);
 assert((await page.evaluate(()=>performance.timeOrigin))!==origin); pass('Catalog → Aether loads an independent document');
 await page.reload();await ready(page);pass('Direct brand reload');
 const resources=await page.evaluate(()=>({resources:performance.getEntriesByType('resource').map(r=>({name:r.name,transfer:r.transferSize,decoded:r.decodedBodySize})),css:[...document.styleSheets].map(s=>s.href),metadata:{lang:document.documentElement.lang,title:document.title},quality:{...document.querySelector('canvas').dataset},gpu:(()=>{const gl=document.querySelector('canvas').getContext('webgl2');const ext=gl.getExtension('WEBGL_debug_renderer_info');return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)})()}));
 assert.equal(resources.css.length,1); assert(resources.css[0].includes('aether-story-'));assert.equal(resources.metadata.lang,'en');
 assert(!resources.resources.some(r=>r.name.includes('/luma')||r.name.includes('fonts.googleapis')||r.name.includes('fonts.gstatic')));
 report.requests=resources;pass('Aether owns its CSS, local fonts, metadata and providers');
 await page.screenshot({path:`${out}/${tag}-hero.png`});
 for (const id of ['formation','resonance','rebirth']) {await chapter(id);assert.equal(await page.locator(`[href="#${id}"][aria-current]`).count(),1);await page.screenshot({path:`${out}/${tag}-${id}.png`});}
 await chapter('formation');await page.screenshot({path:`${out}/${tag}-side-angle.png`});await chapter('spark');pass('Forward / reverse scroll and current chapter');
 await page.goto(base+'aether-story/#resonance');await ready(page);await page.waitForTimeout(800);
 assert(Math.abs(await page.evaluate(()=>document.getElementById('resonance').getBoundingClientRect().top))<3);pass('Section hash direct load');
 const trigger=page.getByRole('button',{name:'Explore Sonora case study'});await trigger.focus();await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog',{name:'Sonora',exact:true});await dialog.waitFor();await page.keyboard.press('Tab');assert(await dialog.getByRole('button',{name:'Close case study'}).evaluate(e=>e===document.activeElement));
 await page.mouse.wheel(0,400);assert(await dialog.isVisible());await page.keyboard.press('Escape');assert(await trigger.evaluate(e=>e===document.activeElement));pass('Case study Enter / focus trap / scroll persistence / Escape / focus return');
 // AudioContext instrumentation observes the actual browser audio graph lifecycle, without replacing it.
 await page.addInitScript(()=>{const Original=window.AudioContext;window.__aetherAudio=[];window.AudioContext=class extends Original{constructor(...args){super(...args);window.__aetherAudio.push(this)}}});
 await page.reload();await ready(page);
 assert.equal(await page.evaluate(()=>window.__aetherAudio.length),0);
 await page.getByRole('button',{name:'Sound off',exact:true}).click();await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.__aetherAudio[0].state),'running');
 await page.getByRole('button',{name:'Explore Vela Observatory case study'}).focus();
 await page.getByRole('button',{name:'Sound on',exact:true}).click();assert.equal(await page.evaluate(()=>window.__aetherAudio[0].state),'closed');pass('Sound is opt-in; focus chime runs in a user-activated graph; mute closes graph');
 await chapter('reimagine');
 const opal=await page.locator('canvas').screenshot();await page.getByRole('radio',{name:'Tide',exact:true}).check();await page.waitForTimeout(120);const tide=await page.locator('canvas').screenshot();assert(!opal.equals(tide));
 for(const name of ['Dispersion','Inner glow']) {const slider=page.getByRole('slider',{name,exact:true});await slider.fill(name==='Dispersion'?'0.9':'0.85');}
 await page.getByRole('button',{name:'Save preset',exact:false}).click();await page.getByRole('radio',{name:'Ember',exact:true}).check();await page.getByRole('button',{name:'Restore saved',exact:true}).click();assert(await page.getByRole('radio',{name:'Tide',exact:true}).isChecked());
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export JSON',exact:true}).click();const downloaded=await download;await downloaded.saveAs(`${out}/${tag}-export.json`);
 const upload=page.getByLabel('Import preset JSON');
 await upload.setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"schema":"bad","version":3}')});await page.getByRole('alert').waitFor();assert(await page.getByRole('radio',{name:'Tide',exact:true}).isChecked());
 await upload.setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from('{"schema":"aether.phoenix","version":1,"palette":"ember","dispersion":0.2,"glow":0.7}')});assert(await page.getByRole('radio',{name:'Ember',exact:true}).isChecked());
 await page.getByRole('button',{name:'Reset',exact:true}).click();assert(await page.getByRole('radio',{name:'Opal',exact:true}).isChecked());
 await page.getByLabel('Render quality').selectOption('low');await page.waitForSelector('canvas[data-quality="low"]');assert.equal(await page.locator('canvas').getAttribute('data-quality'),'low');
 await page.getByLabel('Render quality').selectOption('high');await page.waitForSelector('canvas[data-quality="high"]');pass('Live material changes; sliders; save / restore / export / validated import / reset / quality');
 await page.getByLabel('Render quality').selectOption('auto');
 await page.setViewportSize({width:390,height:844});await page.waitForSelector('canvas[data-quality="low"]');
 await page.setViewportSize({width:1440,height:900});await page.waitForSelector('canvas[data-quality="high"]');
 pass('Automatic quality changes across compact / desktop breakpoints');
 await chapter('reimagine');await page.screenshot({path:`${out}/${tag}-customizer.png`});
 await page.getByRole('link',{name:/Return to collection/}).click();await page.waitForURL(base);await page.goBack();await ready(page);pass('Return to collection and browser Back');
 await page.getByRole('button',{name:'Read without motion',exact:true}).first().click();assert.equal(await page.locator('[data-static]').getAttribute('data-static'),'true');assert.equal(await page.getByText('Imagined outcome',{exact:true}).count(),3);await ready(page);
 await page.getByRole('radio',{name:'Tide',exact:true}).check();await page.screenshot({path:`${out}/${tag}-static.png`});pass('Manual static reading exposes complete project stories and on-demand material study');
 // Context loss must release its canvas; a retry has to create a fresh, working context.
 await page.getByRole('button',{name:'Explore with motion',exact:true}).first().click();await ready(page);
 await page.evaluate(()=>document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());await page.getByRole('button',{name:'Retry 3D view'}).waitFor();assert.equal(await page.locator('[data-ready]').getAttribute('data-ready'),'false');
 await page.getByRole('button',{name:'Retry 3D view'}).click();await ready(page);pass('WebGL context loss fallback and retry');
 const loading=await browser.newPage({viewport:{width:390,height:844}});
 await loading.route('**/assets/scene-*.js',route=>route.abort('failed'));
 await loading.goto(base+'aether-story/');await loading.getByRole('button',{name:'Reload 3D view'}).waitFor();
 assert(await loading.getByRole('heading',{level:1}).isVisible());assert(await loading.getByRole('link',{name:'Start story',exact:false}).isVisible());
 await loading.unroute('**/assets/scene-*.js');await loading.getByRole('button',{name:'Reload 3D view'}).click();await ready(loading);await loading.close();pass('Scene-chunk network failure preserves content; explicit reload recovers');
 const noGPU=await browser.newContext({viewport:{width:390,height:844}});await noGPU.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl'||type==='webgl2'||type==='experimental-webgl')return null;return original.call(this,type,...args)}});
 const gpuFallback=await noGPU.newPage();await gpuFallback.goto(base+'aether-story/');await gpuFallback.getByRole('button',{name:'Retry 3D view'}).waitFor();assert(await gpuFallback.getByRole('heading',{level:1}).isVisible());await gpuFallback.getByRole('button',{name:'Read without motion',exact:true}).first().click();assert.equal(await gpuFallback.getByText('Imagined outcome',{exact:true}).count(),3);await gpuFallback.screenshot({path:`${out}/${tag}-no-gpu.png`});await noGPU.close();pass('No GPU preserves headline, CTA, static images and all semantic content');
 for(const [width,height,reduced] of [[360,800,false],[390,844,false],[768,1024,false],[1440,900,false],[844,390,false],[390,844,true]]) {
  const p=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:reduced?'reduce':'no-preference'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'aether-story/');await ready(p);
  const views=[];
  for(const id of ['spark','formation','resonance','rebirth','reimagine']) {
   await p.evaluate(id=>window.scrollTo(0,document.getElementById(id).offsetTop),id);await p.waitForTimeout(550);
   const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,static:document.querySelector('[data-static]').getAttribute('data-static'),quality:document.querySelector('canvas').dataset.quality}));assert(!state.overflow);if(reduced)assert.equal(state.static,'true');views.push({id,...state});
   if(width===390&&!reduced){await p.screenshot({path:`${out}/${tag}-mobile-${id}.png`});if(id==='formation'){await p.evaluate(()=>window.scrollBy(0,280));await p.waitForTimeout(550);await p.screenshot({path:`${out}/${tag}-mobile-formation-detail.png`});}}
  }
  assert.equal(errors.length,0);report.responsive.push({width,height,reduced,views});await p.close();
 }
 pass('360 / 390 / 768 / 1440 portrait, landscape and OS reduced-motion emulation');
 await page.goto(base+'luma/');await page.waitForLoadState('networkidle');assert((await page.locator('h1').textContent()).trim());await page.reload();await page.waitForLoadState('networkidle');
 const luma=await page.evaluate(()=>({css:[...document.styleSheets].map(s=>s.href),resources:performance.getEntriesByType('resource').map(r=>r.name)}));assert(!luma.resources.some(n=>n.includes('/aether-story/')||/\/assets\/(scene|SceneView|aether-story)-/.test(n)));pass('Existing Luma entry and reload remain isolated',luma);
 assert.equal(report.errors.length,0,report.errors.join('\n'));pass('No console errors, page errors, WebGL errors or failed requests in ordinary flow');
} catch(e) {report.failure=e.stack;console.error(e);process.exitCode=1;} finally {await writeFile(`${out}/${tag}-report.json`,JSON.stringify(report,null,2));await browser.close();}
