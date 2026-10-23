import { readFile, stat, readdir, writeFile } from 'node:fs/promises';
const manifest=JSON.parse(await readFile('dist/.vite/manifest.json','utf8'));
const files=new Set(['aether-story/index.html']),visited=new Set();
function walk(key){if(visited.has(key))return;visited.add(key);const chunk=manifest[key];if(!chunk)throw Error('Missing manifest chunk '+key);files.add(chunk.file);for(const css of chunk.css||[])files.add(css);for(const next of [...chunk.imports||[],...chunk.dynamicImports||[]])walk(next);}
walk('aether-story/index.html');
const items=[];for(const file of files)items.push({file:'dist/'+file,bytes:(await stat('dist/'+file)).size});
for(const file of await readdir('public/landings/aether-story',{recursive:true})){const path='public/landings/aether-story/'+file;const entry=await stat(path);if(entry.isFile())items.push({file:path,bytes:entry.size});}
const total=items.reduce((sum,item)=>sum+item.bytes,0);
const perf=JSON.parse(await readFile('docs/landings/aether-story/qa/performance.json','utf8'));
const resources=perf.results.map(r=>({tier:r.quality,geometryBytes:Number(r.canvas.geometryBytes),environmentBytes:Number(r.canvas.environmentBytes),fieldBytes:Number(r.canvas.fieldBytes)}));
const report={method:'Conservative raw file total: Aether HTML, all static and dynamic JS/CSS manifest dependencies, and EVERY file in the Aether public namespace, including unused previews, licenses and fallback assets. No gzip or cache discount. Generated GPU scene resources are counted separately; framebuffer allocations are excluded from geometry/texture counts.',totalBytes:total,totalMiB:total/1048576,firstExperienceLimitMiB:18,resources:resources.map(r=>({...r,totalBytes:r.geometryBytes+r.environmentBytes+r.fieldBytes,totalMiB:(r.geometryBytes+r.environmentBytes+r.fieldBytes)/1048576,limitMiB:8})),files:items};
if(total>18*1048576||report.resources.some(r=>r.totalBytes>8*1048576))throw Error('Aether budget exceeded');
await writeFile('docs/landings/aether-story/qa/budget.json',JSON.stringify(report,null,2));console.log(JSON.stringify({firstExperienceMiB:report.totalMiB,scene:report.resources},null,2));
