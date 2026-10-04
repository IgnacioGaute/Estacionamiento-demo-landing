'use client';

import { useEffect, useState } from 'react';
import { CATALOGO_FIJO, type Catalogo, pedirCatalogo } from '../catalogo';
import { whatsapp } from '../contacto';
import { Check } from './Iconos';
import Counter from './reactbits/Counter';
import SpotlightCard from './reactbits/SpotlightCard';

// Los precios salen de la lista de precios de la plataforma (ver catalogo.ts): la página los trae
// al compilarse y acá se vuelven a pedir al abrirla, así un cambio de precio se ve sin volver a
// publicar la landing. Los períodos más largos se pagan completos y se coordinan por WhatsApp.

const pesos = (n: number) => '$' + new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n);
const posiciones = (n: number) => {
  const cifras = String(n).length;
  const lugares: (number | '.')[] = [];
  for (let exponente = cifras - 1; exponente >= 0; exponente--) {
    if (exponente % 3 === 2 && exponente !== cifras - 1) lugares.push('.');
    lugares.push(10 ** exponente);
  }
  return lugares;
};

export default function Planes({ inicial = CATALOGO_FIJO }: { inicial?: Catalogo }) {
  const [catalogo, setCatalogo] = useState(inicial);
  const [cocheras, setCocheras] = useState(false);
  const [codigo, setCodigo] = useState(inicial.periodos[0]?.codigo ?? 'MENSUAL');

  useEffect(() => {
    let vigente = true;
    pedirCatalogo().then((nuevo) => {
      if (vigente && nuevo) setCatalogo(nuevo);
    });
    return () => {
      vigente = false;
    };
  }, []);

  const ciclo = catalogo.periodos.find((p) => p.codigo === codigo) ?? catalogo.periodos[0] ?? CATALOGO_FIJO.periodos[0];
  const conCocheras = catalogo.planes.some((p) => p.cocheras !== null);
  const planes = catalogo.planes.filter((p) => !cocheras || p.cocheras !== null);
  const largos = catalogo.periodos.filter((p) => p.meses > 1).map((p) => p.consulta);

  return (
    <>
      <div className="planes__opciones">
        {conCocheras && (
          <div className="planes__opcion">
            <span className="planes__opcion-label">Qué incluye</span>
            <div className="selector" role="group" aria-label="Modalidad del plan">
              <button type="button" aria-pressed={!cocheras} onClick={() => setCocheras(false)}>Tickets y rotación</button>
              <button type="button" aria-pressed={cocheras} onClick={() => setCocheras(true)}>+ Cocheras mensuales</button>
            </div>
          </div>
        )}
        {catalogo.periodos.length > 1 && (
          <div className="planes__opcion">
            <span className="planes__opcion-label">Período de pago</span>
            <div className="selector selector--periodo" role="group" aria-label="Período de pago">
              {catalogo.periodos.map((opcion) => (
                <button key={opcion.codigo} type="button" aria-pressed={ciclo.codigo === opcion.codigo} onClick={() => setCodigo(opcion.codigo)}>
                  {opcion.etiqueta}
                  {opcion.descuento > 0 && <span className="selector__ahorro">−{Math.round(opcion.descuento * 100)}%</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="planes__grilla">
        {planes.map((plan) => {
          const base = cocheras && plan.cocheras !== null ? plan.cocheras : plan.rotacion;
          const total = Math.round(base * ciclo.meses * (1 - ciclo.descuento));
          const ahorro = base * ciclo.meses - total;
          const porMes = Math.round(total / ciclo.meses);
          return (
            <SpotlightCard key={plan.codigo} className={`plan${plan.destacado ? ' plan--destacado' : ''}`}
              spotlightColor="rgba(255, 201, 28, 0.32)">
              {plan.destacado && <span className="plan__distintivo">Más elegido</span>}
              <div className="plan__nombre">
                <h3>{plan.nombre}</h3>
                <p>{plan.tamano}</p>
              </div>
              <div className="plan__precio" aria-live="polite">
                <p className="plan__monto">
                  <span className="plan__cifra">
                    <span aria-hidden="true">$</span>
                    <span className="visualmente-oculto">{pesos(porMes)}</span>
                    <span aria-hidden="true"><Counter value={porMes} places={posiciones(porMes)} fontSize={38} padding={0} gap={0}
                      horizontalPadding={0} borderRadius={0} fontWeight={500} gradientHeight={0}/></span>
                  </span>
                  <span className="plan__por">por mes</span>
                </p>
                {ciclo.meses > 1 && (
                  <p className="plan__equivalente"><strong>{pesos(total)} {ciclo.precio}</strong>{ahorro > 0 && <> · Ahorrás {pesos(ahorro)}</>}</p>
                )}
                <p className="plan__modo">{cocheras ? 'Rotación + cocheras mensuales' : 'Tickets y rotación'}</p>
              </div>
              <ul className="puntos">
                <li><Check/><span>Entradas, salidas y cobros</span></li>
                <li><Check/><span>Tarifas, caja y turnos</span></li>
                <li><Check/><span>{cocheras ? 'Cocheras mensuales y cuenta corriente' : 'Comprobantes y reportes'}</span></li>
              </ul>
              <a className={`boton ${plan.destacado ? 'boton--oscuro' : 'boton--linea'}`}
                href={whatsapp(`Hola, quiero consultar por el plan ${plan.nombre}${cocheras ? ' con cocheras mensuales' : ''}, pago ${ciclo.consulta} de ${pesos(total)}.`)}
                target="_blank" rel="noopener noreferrer">
                Consultar este plan
              </a>
            </SpotlightCard>
          );
        })}
      </div>
      <p className="planes__periodo-nota">
        Los precios muestran el equivalente mensual.
        {largos.length > 0 && ` El pago ${largos.join(' o ')} se realiza por el período completo y se coordina por WhatsApp.`}
      </p>
    </>
  );
}
