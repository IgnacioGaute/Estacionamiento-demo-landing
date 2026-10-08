"""Renderiza una copia visual de la planilla y oculta identificadores para el tutorial."""
import sys,re
from pathlib import Path
import fitz
from PIL import Image,ImageFilter
source=Path(sys.argv[1]); target=source.with_suffix('.png')
doc=fitz.open(source); page=doc[0]; scale=2
pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
for block in page.get_text('dict')['blocks']:
 for line in block.get('lines',[]):
  for span in line['spans']:
   text=span['text']; x0,y0,x1,y1=span['bbox']
   private=('@' in text or bool(re.search(r'Andres|Alvaro|Graciela|Gaute|Bertolo',text,re.I)) or (125<x0<350 and y0>160 and span['size']<=10.1 and not re.fullmatch(r'[0-9 /:.,$?-]+',text) and text not in ['DESCRIPCIÓN','No se registraron datos'] and span['size']>=9.4))
   if private:
    box=(max(0,int(x0*scale)-2),max(0,int(y0*scale)-2),min(im.width,int(x1*scale)+2),min(im.height,int(y1*scale)+2))
    im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(9)),box)
im.save(target)
print(target.name)
