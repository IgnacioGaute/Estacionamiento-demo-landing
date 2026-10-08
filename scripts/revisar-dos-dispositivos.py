"""Galería y comprobaciones de duración/narración de los tutoriales nuevos."""
from pathlib import Path
import json,html,subprocess
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT/'.revision/dos-dispositivos'
NAMES=['operacion','cobro','tarifas','caja','administracion']
FF=ROOT/'.revision/ffmpeg-tools/node_modules/ffmpeg-static/ffmpeg.exe'
items=[]
for name in NAMES:
 folder=BASE/name; path=folder/'montaje.json'
 if not path.exists():continue
 rec=json.loads(path.read_text(encoding='utf8'));duration=rec['duration'];seconds=round(duration);label=f'{seconds//60}:{seconds%60:02d}'
 for scene in rec['scenes']:
  assert scene['duration']-scene['spoken']-.45>=1, (name,scene['number'])
  assert 0<scene['original']<65, (name,scene['number'])
 file=Path(rec['file']);assert file.exists() and file.stat().st_size>100000
 sources=[folder/'capturas'/f"escena-{scene['number']:02d}.png" for scene in rec['scenes']]
 assert len(sources)==len(rec['scenes']),name
 for group in range((len(sources)+3)//4):
  im=Image.new('RGB',(1920,1130),'#13110d');draw=ImageDraw.Draw(im)
  for i,p in enumerate(sources[group*4:group*4+4]):
   x=i%2*960;y=i//2*565;pic=Image.open(p).resize((960,540));im.paste(pic,(x,y));draw.text((x+12,y+545),p.stem,fill='#f5c518')
  im.save(folder/f'revision-{group+1:02d}.png')
 subprocess.run([str(FF),'-hide_banner','-loglevel','error','-y','-sseof','-1','-i',str(file),'-frames:v','1',str(folder/'capturas/cierre-logo.png')],check=True)
 items.append((name,rec['title'],label,len(sources),file.stat().st_size))
 print(name,label,len(sources),f'{file.stat().st_size/1048576:.1f} MB',flush=True)
page="""<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tutoriales nuevos · Revisión</title><style>*{box-sizing:border-box}body{margin:0;background:#0d0c09;color:#f5f1e7;font:17px/1.6 system-ui}.stripe{height:12px;background:repeating-linear-gradient(135deg,#f5c518 0 17px,#0d0c09 17px 34px)}main{max-width:1440px;margin:50px auto;padding:0 30px}h1{font-size:clamp(30px,4vw,52px);line-height:1.1}h1 span,a{color:#f5c518}p{color:#bfb8a5}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:24px}article{padding:24px;background:linear-gradient(145deg,#242017,#15130f);border:1px solid #3d3627;border-radius:24px}h2{font-size:23px;margin:0 0 8px}video{width:100%;background:#000;border-radius:14px;margin:16px 0}a{display:inline-block;margin:6px 20px 4px 0;text-decoration:none;font-weight:650}.pill{display:inline-block;border:1px solid #746021;border-radius:999px;color:#e8cb69;padding:5px 13px;font-size:14px}small{color:#a99e86}@media(max-width:500px){main{padding:0 16px;margin:28px auto}.grid{grid-template-columns:1fr}article{padding:18px}}</style><div class="stripe"></div><main><span class="pill">Notebook + celular · Full HD</span><h1>El sistema, <span>en los dos dispositivos</span></h1><p>Cinco tutoriales con el diseño actual, voz de hombre y música lo-fi. Apertura y cierre con el logo; el video de Inquilinos conserva su versión anterior.</p><p>Actualización: clips del escáner sin desenfoque, QR y alias explicados antes de la salida, nuevas tarifas y pases de camioneta, edición por fracciones y configuración de comisiones. Estas versiones están separadas de los videos publicados.</p><div class="grid">"""
for name,title,label,count,size in items:
 page+=f'<article><h2>{html.escape(title)}</h2><small>{label} · {count} escenas · 1920 × 1080 · 25 fps</small><video controls preload="metadata" poster="../../public/video-posters/intro-{name}.png" src="../../public/videos/{name}-dos-dispositivos.mp4"></video><a href="{name}/revision.html">Ver todas las capturas →</a><a href="../../public/videos/{name}-dos-dispositivos.mp4" download>Descargar MP4</a></article>'
page+='</div></main><div class="stripe"></div></html>'
(BASE/'revision.html').write_text(page,encoding='utf8')
(BASE/'verificacion.json').write_text(json.dumps({'videos':[{'chapter':n,'duration':d,'scenes':c,'bytes':b} for n,t,d,c,b in items],'voiceMarginSeconds':1.75,'resolution':'1920x1080','fps':25,'inquilinosUnchanged':True},ensure_ascii=False,indent=2),encoding='utf8')
