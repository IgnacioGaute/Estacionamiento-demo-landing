"""Genera la voz de los recorridos terminados, siguiendo sus carteles."""
import asyncio
import json
import re
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / 'scripts/grabar-tutoriales.mjs').read_text(encoding='utf-8')
OUT = ROOT / '.revision/sonorizacion'
TIMES = {
    'cobro': [6.5, 12.5, 28.5, 37.5, 68, 76, 83.5, 93, 101, 108.5, 118, 134.5, 145, 154, 161.5, 169.5, 178.5, 189],
    'tarifas': [5, 11, 19, 33.5, 42.5, 54, 65, 75, 84.5, 94, 104, 118, 129.5, 138.5, 149, 159.5, 170.5, 181, 192, 202, 211.5, 226, 232, 243, 254, 265, 276, 285.5, 297.5, 308],
    'caja': [4.5, 10.5, 20, 28.5, 37.5, 46.5, 56, 65, 75, 84, 94.5, 104.5, 114, 132, 138, 148, 157.5, 168.5],
    'administracion': [5.5, 15, 28.5, 40.5, 47, 96.5, 103, 112.5, 121.5, 166, 172.5, 183, 215.5, 222, 268.5, 274.5, 285.5, 295.5, 357, 363.5, 374.5, 426, 432, 457, 463, 474, 484.5],
    'inquilinos': [8, 14.5, 25, 36.5, 45.5, 56.5, 66, 75, 86, 97, 106, 117, 128, 139, 150, 159.5, 173, 179, 189.5, 200.5, 211, 222.5, 229, 241.5, 253, 264, 275.5, 287, 298.5],
}
FUNCTIONS = {
    'cobro': ['payment'],
    'tarifas': ['tariffs', 'plannedStay'],
    'caja': ['cash'],
    'administracion': ['administration', 'administrationNotes'],
    'inquilinos': ['renters'],
}
QUOTE = r"'((?:\\.|[^'\\])*)'"
CALL = re.compile(r'await (scene|showMenu)\(page,\s*(\d+),')


def lines_in(function):
    start = SOURCE.index(f'async function {function}()')
    end = SOURCE.find('\nasync function ', start + 1)
    return SOURCE[start:end if end != -1 else None].splitlines()


def get_script(name):
    if name == 'inquilinos':
        scenes = json.loads((ROOT / 'scripts/inquilinos-v3-scenes.json').read_text(encoding='utf-8'))
        return [{'number': scene['number'], 'start': scene['start'], 'text': scene['text']} for scene in scenes]
    captions = {}
    for function in FUNCTIONS[name]:
        for line in lines_in(function):
            match = CALL.search(line)
            if not match:
                continue
            number = int(match.group(2))
            args = re.findall(QUOTE, line[match.end():])
            if len(args) < 3:
                raise ValueError(f'No se pudo leer el cartel {name} #{number}: {line}')
            captions[number] = args[2].replace("\\'", "'")
    expected = list(range(1, len(TIMES[name]) + 1)) if TIMES[name] is not None else list(range(1, 30))
    if sorted(captions) != expected:
        raise ValueError(f'Carteles de {name}: {sorted(captions)}')
    starts = TIMES[name] if TIMES[name] is not None else [None] * len(expected)
    return [{'number': number, 'start': start, 'text': captions[number]}
            for number, start in zip(expected, starts)]


async def main():
    semaphore = asyncio.Semaphore(4)
    tasks = []
    for name in TIMES:
        folder = OUT / name
        folder.mkdir(parents=True, exist_ok=True)
        script = get_script(name)
        (folder / 'guion.json').write_text(json.dumps(script, ensure_ascii=False, indent=2), encoding='utf-8')
        for caption in script:
            target = folder / f"voz-{caption['number']:02d}.mp3"
            async def make(text=caption['text'], path=target, chapter=name):
                if path.exists() and chapter != 'inquilinos':
                    return
                async with semaphore:
                    for attempt in range(3):
                        try:
                            await edge_tts.Communicate(text=text, voice='es-AR-TomasNeural', rate='-8%', pitch='-2Hz').save(str(path))
                            return
                        except Exception:
                            if attempt == 2:
                                raise
                            await asyncio.sleep(attempt + 1)
            tasks.append(make())
    await asyncio.gather(*tasks)
    print('Voces generadas:', len(tasks))


if __name__ == '__main__':
    asyncio.run(main())



