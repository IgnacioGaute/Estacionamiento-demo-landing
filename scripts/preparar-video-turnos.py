"""Une los bloques reales y conserva sus marcas de tiempo y archivos de origen."""
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1]
folder=root/'.revision/dos-dispositivos/cobro-20261012'
folder.mkdir(exist_ok=True)
recording={'chapter':'cobro','base':'https://estacionamiento-front-demo-production.up.railway.app','scenes':[]}
parts=['configuracion','apertura','salida','pago','cierre']
for part in parts:
 path=root/f'.revision/dos-dispositivos/cobro-20261012-{part}/grabacion.json'
 if not path.exists():
  if '--parcial' in sys.argv:continue
  raise FileNotFoundError(path)
 source=json.loads(path.read_text(encoding='utf8'))
 assert not source.get('error'),part
 for index,scene in enumerate(source['scenes']):
  scene['number']=len(recording['scenes'])+1
  scene['endAt']=scene.get('endAt') or (source['scenes'][index+1]['startAt'] if index+1<len(source['scenes']) else source['endedAt'])
  assert 0<scene['endAt']-scene['startAt']<65000,(part,scene['number'])
  scene['recordingDevices']=source['devices']
  recording['scenes'].append(scene)
 recording['devices']=source['devices'];recording['endedAt']=source['endedAt']
(folder/'grabacion.json').write_text(json.dumps(recording,ensure_ascii=False,indent=2),encoding='utf8')
print('Escenas:',len(recording['scenes']))
