"""Genera la narración de prueba del primer recorrido.

Requiere edge-tts (instalado localmente en .revision/tts-tools para este proyecto).
La voz no contiene credenciales ni datos de clientes reales.
"""

import asyncio
import json
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / ".revision" / "sonorizacion"
OUT.mkdir(parents=True, exist_ok=True)

LINES = [
    "En el menú del operador, Operación, Tickets, lleva a las entradas, las salidas y los vehículos activos.",
    "Tocamos Registrar entrada. El sistema guardará la hora y el operador que recibe el vehículo.",
    "Buscá una patente, apellido o teléfono ya conocido. Al elegirlo, se completan sus datos y el tipo de vehículo.",
    "Como esta patente de prueba no tiene visitas anteriores, usamos el campo Patente de abajo.",
    "También podés leer la patente con la cámara del celular. Para este ejemplo escribimos una patente de prueba.",
    "Auto y camioneta pueden tener tarifas distintas. El apellido y el teléfono de WhatsApp son opcionales.",
    "Revisamos los datos y presionamos Registrar entrada. La estadía queda activa para encontrarla después por patente.",
    "El comprobante muestra patente, hora, playa y operador. El código QR abre el enlace del comprobante.",
    "Desplazamos el comprobante para llegar al QR y a las acciones de entrega.",
    "El QR lleva al comprobante digital. También queda disponible para volver a abrirlo más tarde.",
    "El administrador puede habilitar QR, enlace por WhatsApp e impresión térmica desde Configuración, Comprobantes.",
    "Seguimos en Operación, Tickets. Los comprobantes quedan en una lista para volver a consultarlos cuando se necesiten.",
    "Esta pestaña muestra los comprobantes de la fecha elegida. Se puede cambiar el día con el calendario y buscar por patente o apellido.",
    "Escribimos la patente que acabamos de cobrar. La lista muestra quién registró la entrada y quién registró la salida.",
    "Desde esta ficha se vuelve a abrir el comprobante de entrada o el de salida. Sirve para descargar el PDF o imprimirlo más tarde.",
    "Se conserva la información del cobro, el operador responsable y el código QR. Podés entregarlo nuevamente sin alterar el registro.",
]


async def main():
    semaphore = asyncio.Semaphore(3)

    async def make(index: int, line: str):
        target = OUT / f"voz-{index:02d}.mp3"
        async with semaphore:
            for attempt in range(3):
                try:
                    await edge_tts.Communicate(
                        text=line,
                        voice="es-AR-TomasNeural",
                        rate="-8%",
                        pitch="-2Hz",
                    ).save(str(target))
                    return
                except Exception:
                    if attempt == 2:
                        raise
                    await asyncio.sleep(attempt + 1)

    await asyncio.gather(*(make(i, line) for i, line in enumerate(LINES, 1)))
    (OUT / "guion.json").write_text(json.dumps(LINES, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Narración generada: {len(LINES)} fragmentos en {OUT}")


if __name__ == "__main__":
    asyncio.run(main())
