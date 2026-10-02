'use client';

import { useEffect, useRef, useState } from 'react';
import TechText from './reactbits/TechText';

const TITULO = 'Gestión de estacionamientos';
const EN_DOS_LINEAS = ['Gestión de', 'estacionamientos'];
const TAMANO_MAXIMO = 80;
// Por debajo de esto, en una sola línea el título deja de leerse como título: va en dos.
const TAMANO_MINIMO_UNA_LINEA = 44;
const ESPACIADO = -0.04;
const FUENTE = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif";

type Vista = { lineas: string[]; tamano: number };

/**
 * TechText dibuja una sola línea en un canvas y la achica hasta que entra en el ancho. En un
 * celular eso dejaba el título en unos 20px, así que acá se decide si va en una o en dos líneas y
 * se calcula un tamaño común: si cada línea se ajustara sola, «Gestión de» saldría bastante más
 * grande que «estacionamientos».
 *
 * El texto real queda en el h1 para buscadores y lectores de pantalla; el canvas es decorativo.
 */
export default function TituloPortada() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [vista, setVista] = useState<Vista>({ lineas: [TITULO], tamano: 76 });

  useEffect(() => {
    const titulo = ref.current;
    const medidor = document.createElement('canvas').getContext('2d');
    if (!titulo || !medidor) return;

    // Ancho de cada texto a 1px, con la misma fuente y el mismo espaciado que usa TechText.
    const anchoPorPixel = (texto: string) => {
      medidor.font = `600 100px ${FUENTE}`;
      if ('letterSpacing' in medidor) medidor.letterSpacing = `${ESPACIADO * 100}px`;
      const m = medidor.measureText(texto);
      return Math.max(1, m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / 100;
    };

    const calcular = () => {
      // TechText deja un 10% de aire a los costados: se mide contra el mismo ancho útil.
      const ancho = titulo.clientWidth * 0.9;
      const enUna = Math.min(TAMANO_MAXIMO, ancho / anchoPorPixel(TITULO));
      const lineas = enUna >= TAMANO_MINIMO_UNA_LINEA ? [TITULO] : EN_DOS_LINEAS;
      const tamano = Math.floor(Math.min(TAMANO_MAXIMO, ...lineas.map(linea => ancho / anchoPorPixel(linea))));
      setVista(actual => (actual.tamano === tamano && actual.lineas.length === lineas.length ? actual : { lineas, tamano }));
    };

    calcular();
    const observador = new ResizeObserver(calcular);
    observador.observe(titulo);
    // Se vuelve a medir cuando llega el peso 600 de Archivo: con la fuente de reemplazo el ancho es otro.
    document.fonts?.load(`600 100px ${FUENTE}`, TITULO).then(calcular, () => {});
    return () => observador.disconnect();
  }, []);

  // Alto de cada línea: deja lugar arriba para el rótulo y los puntitos del recuadro de selección.
  const alto = Math.round(vista.tamano * (vista.lineas.length > 1 ? 1.3 : 1.5));

  return (
    <h1 ref={ref} className="portada__titulo">
      <span className="visualmente-oculto">{TITULO}</span>
      <span className="portada__lineas" aria-hidden="true">
        {vista.lineas.map(linea => (
          <span key={linea} className="portada__linea" style={{ height: alto }}>
            <TechText
              text={linea}
              fontSize={vista.tamano}
              fontFamily={FUENTE}
              fontWeight={600}
              letterSpacing={ESPACIADO}
              color="#121211"
              accentColor="#f36b2b"
              reveal="letter"
              lineStyle="dashed"
              dashLength={4}
              dashGap={2}
              strokeWidth={1.5}
              specks={15}
              reach={200}
              softness={0.7}
              speed={1}
              selection
              labels
              draggable
              sweep
            />
          </span>
        ))}
      </span>
    </h1>
  );
}
