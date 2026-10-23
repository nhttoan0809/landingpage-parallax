"""Original vector artwork. Run from worktree root. Python standard library only."""
from pathlib import Path
import math
out=Path('public/landings/aether-story')
out.mkdir(parents=True,exist_ok=True)
(out/'mark.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#eeedf4"/><path d="M10 42 23 16 32 32 41 16 54 42 32 53Z" fill="none" stroke="#785c91" stroke-width="2.5"/><path d="m10 42 22-10 22 10M23 16l9 37 9-37" fill="none" stroke="#785c91"/></svg>')
# Poster starts as a vector fallback; the final WebP is rendered from the real WebGL scene.
parts=[]
for side in [-1,1]:
 for i in range(15):
  x=400+side*(35+i*15); y=260-i*7; length=80+i*4
  parts.append(f'<path d="M{400+side*18} 290 Q{x} {y-70} {x+side*length*.6} {y-length} Q{x+side*50} {y+20} {400+side*18} 290Z" fill="url(#g)" stroke="#8d7cac" stroke-width=".8"/>')
for i in range(7):
 x=400+(i-3)*12
 parts.append(f'<path d="M400 310Q{x-35} 390 {x} {490+abs(i-3)*16}Q{x+25} 380 400 310Z" fill="url(#g)" stroke="#88789e" stroke-width=".8"/>')
parts.append('<path d="M399 338Q363 287 389 254L392 212Q390 185 408 182L420 191 442 198 418 202Q410 218 415 251Q437 292 399 338Z" fill="url(#g)" stroke="#88789e"/><path d="m396 186-12-29 20 23 14-25-3 29" fill="url(#g)" stroke="#88789e"/>')
(out/'poster.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#faf9ff"/><stop offset=".5" stop-color="#b7a5d0" stop-opacity=".65"/><stop offset=".7" stop-color="#f8f6ff"/><stop offset="1" stop-color="#8e78ab"/></linearGradient></defs>'+''.join(parts)+'</svg>')
for name,c1,c2 in [('sonora','#d2b9ed','#605080'),('vela','#a9e3ec','#416479'),('verdant','#c4ddb8','#536b57')]:
 shapes=[]
 if name=='sonora':
  for i in range(25):
   r=30+i*10
   shapes.append(f'<ellipse cx="400" cy="290" rx="{r*1.4}" ry="{r*.8}" fill="none" stroke="{c1}" stroke-opacity="{.65-i*.019}" transform="rotate(-25 400 290)"/>')
 elif name=='vela':
  for i in range(68):
   x=(i*137)%800;y=(i*i*31)%600
   shapes.append(f'<circle cx="{x}" cy="{y}" r="{1+i%3*.6}" fill="{c1}" opacity=".6"/>')
  shapes.append(f'<circle cx="400" cy="290" r="120" fill="none" stroke="{c1}"/><ellipse cx="400" cy="290" rx="240" ry="45" fill="none" stroke="{c1}" transform="rotate(-27 400 290)"/>')
 else:
  for i in range(12):
   x=190+i*38; y=440
   shapes.append(f'<path d="M{x} {y} Q{x-60} 300 {x+10} {140+i%4*45} Q{x+115} 300 {x} {y}Z" fill="{c1}" opacity=".14" stroke="{c1}"/><path d="M{x} 440 {x+10} {140+i%4*45}" stroke="{c1}" stroke-opacity=".4"/>')
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><radialGradient id="b"><stop stop-color="{c2}"/><stop offset="1" stop-color="#171522"/></radialGradient></defs><rect width="800" height="600" fill="url(#b)"/>'+''.join(shapes)+'</svg>'
 (out/(name+'.svg')).write_text(svg)
 # Faceted fallback crystal for unavailable GPU.
 (out/(name+'-crystal.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"><defs><linearGradient id="c"><stop stop-color="{c1}" stop-opacity=".9"/><stop offset=".5" stop-color="{c2}"/><stop offset="1" stop-color="{c1}" stop-opacity=".6"/></linearGradient></defs><path d="m150 20 67 68-15 100-52 40-59-44-9-96Z" fill="url(#c)" stroke="{c1}"/><path d="m150 20 24 79-24 129-24-129Z" fill="{c1}" opacity=".3"/><path d="m82 88 44 11 48 0 43-11M91 184l35-85m76 89-28-89" fill="none" stroke="{c1}" stroke-opacity=".7"/></svg>')
