"""Copias sin máscaras de los clips del escáner autorizadas por el usuario."""
from pathlib import Path
from shutil import copyfile
root=Path(__file__).resolve().parents[1]
source=Path(r'C:/Users/nachi/OneDrive/Escritorio/escaner patente')
out=root/'.revision/dos-dispositivos/escaner'
out.mkdir(parents=True,exist_ok=True)
for name in ['entrada','salida']:
 filename=f'escaner-{name}-vehiculo.mp4'
 copyfile(source/filename,out/filename)
 print('Escáner sin máscaras:',name,flush=True)
