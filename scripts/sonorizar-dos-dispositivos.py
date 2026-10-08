"""Voces para las nuevas grabaciones. Reutiliza las aprobadas si el texto coincide."""
import asyncio,json,re,shutil,sys
from pathlib import Path
import edge_tts
ROOT=Path(__file__).resolve().parents[1]
NAMES=sys.argv[1:] or ['operacion','cobro','tarifas','caja','administracion']
def norm(s): return re.sub(r'[^a-záéíóúñ0-9 ]','',s.lower().replace('→',' ').replace('·',' ')).strip()
async def main():
 sem=asyncio.Semaphore(3)
 async def one(name,scene,target,old):
  number=scene['number']; repair=ROOT/'.revision/voice-repair'/f'{name}-{number:02d}.mp3'
  if old and norm(old['text'])==norm(scene['text']):
   src=repair if repair.exists() else ROOT/'.revision/sonorizacion'/('' if name=='operacion' else name)/f'voz-{number:02d}.mp3'
   if src.exists(): shutil.copyfile(src,target);return
  if target.exists() and target.with_suffix(".json").exists():
   saved=json.loads(target.with_suffix(".json").read_text(encoding="utf8"))
   if norm(saved.get("text",""))==norm(scene["text"]):return
  async with sem:
   for attempt in range(5):
    try:
     voice=edge_tts.Communicate(scene['text'],voice='es-AR-TomasNeural',rate='-8%',pitch='-2Hz',boundary='WordBoundary')
     parts=[];words=[]
     async for chunk in voice.stream():
      if chunk['type']=='audio':parts.append(chunk['data'])
      elif chunk['type']=='WordBoundary':words.append(chunk['text'])
     expected=norm(scene['text']).split()[-1];heard=norm(' '.join(words)).split()
     if not parts or not heard or expected not in heard[-4:]:raise RuntimeError(f'Voz incompleta {name} {number}; no llegó la última palabra')
     target.write_bytes(b''.join(parts));target.with_suffix('.json').write_text(json.dumps({'text':scene['text'],'lastWords':heard[-5:]},ensure_ascii=False),encoding='utf8');print('VOZ',name,number,flush=True);return
    except Exception:
     if attempt==4:raise
     await asyncio.sleep(2+attempt)
 jobs=[]
 for name in NAMES:
  folder=ROOT/'.revision/dos-dispositivos'/name
  rec=json.loads((folder/'grabacion.json').read_text(encoding='utf8'))
  source=ROOT/'.revision/sonorizacion'/('' if name=='operacion' else name)/'guion.json'
  old=json.loads(source.read_text(encoding='utf8'))
  oldmap={i+1:{'text':item} for i,item in enumerate(old)} if old and isinstance(old[0],str) else {x['number']:x for x in old}
  (folder/'voces').mkdir(exist_ok=True)
  for scene in rec['scenes']:jobs.append(one(name,scene,folder/'voces'/f"voz-{scene['number']:02d}.mp3",oldmap.get(scene['number'])))
 await asyncio.gather(*jobs)
 print('Voces completas',len(jobs))
asyncio.run(main())