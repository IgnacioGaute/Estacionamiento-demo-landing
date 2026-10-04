'use client';

import { useState } from 'react';
import { whatsapp } from '../contacto';
import { Check } from './Iconos';
import Counter from './reactbits/Counter';
import SpotlightCard from './reactbits/SpotlightCard';

// Los importes mensuales coinciden con el catálogo del backend. Los períodos más largos
// se muestran solo como propuesta comercial y se coordinan por WhatsApp.
const PLANES = [
  { nombre: 'Playa chica', tamano: 'Hasta 30 vehículos a la vez', rotacion: 50_000, cocheras: 70_000 },
  { nombre: 'Playa mediana', tamano: 'Hasta 100 vehículos a la vez', rotacion: 70_000, cocheras: 95_000, destacado: true },
  { nombre: 'Playa grande', tamano: 'Sin límite de vehículos', rotacion: 110_000, cocheras: 140_000 },
] as const;

const PERIODOS = {
  mensual: { etiqueta: 'Mensual', meses: 1, descuento: 0, precio: 'por mes', consulta: 'mensual' },
  trimestral: { etiqueta: 'Trimestral', meses: 3, descuento: 0.10, precio: 'por 3 meses', consulta: 'trimestral' },
  anual: { etiqueta: 'Anual', meses: 12, descuento: 0.15, precio: 'por año', consulta: 'anual' },
} as const;

type Periodo = keyof typeof PERIODOS;

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

export default function Planes() {
  const [cocheras, setCocheras] = useState(false);
  const [periodo, setPeriodo] = useState<Periodo>('mensual');
  const ciclo = PERIODOS[periodo];

  return (
    <>
      <div className="planes__opciones">
        <div className="planes__opcion">
          <span className="planes__opcion-label">Qué incluye</span>
          <div className="selector" role="group" aria-label="Modalidad del plan">
            <button type="button" aria-pressed={!cocheras} onClick={() => setCocheras(false)}>Tickets y rotación</button>
            <button type="button" aria-pressed={cocheras} onClick={() => setCocheras(true)}>+ Cocheras mensuales</button>
          </div>
        </div>
        <div className="planes__opcion">
          <span className="planes__opcion-label">Período de pago</span>
          <div className="selector selector--periodo" role="group" aria-label="Período de pago">
            {(Object.keys(PERIODOS) as Periodo[]).map(opcion => (
              <button key={opcion} type="button" aria-pressed={periodo === opcion} onClick={() => setPeriodo(opcion)}>
                {PERIODOS[opcion].etiqueta}
                {opcion !== 'mensual' && <span className="selector__ahorro">−{Math.round(PERIODOS[opcion].descuento * 100)}%</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="planes__grilla">
        {PLANES.map(plan => {
          const base = cocheras ? plan.cocheras : plan.rotacion;
          const total = Math.round(base * ciclo.meses * (1 - ciclo.descuento));
          const ahorro = base * ciclo.meses - total;
          const porMes = Math.round(total / ciclo.meses);
          const destacado = 'destacado' in plan;
          return (
            <SpotlightCard key={plan.nombre} className={`plan${destacado ? ' plan--destacado' : ''}`}
              spotlightColor="rgba(255, 201, 28, 0.32)">
              {destacado && <span className="plan__distintivo">Más elegido</span>}
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
                {periodo !== 'mensual' && (
                  <p className="plan__equivalente"><strong>{pesos(total)} {ciclo.precio}</strong> · Ahorrás {pesos(ahorro)}</p>
                )}
                <p className="plan__modo">{cocheras ? 'Rotación + cocheras mensuales' : 'Tickets y rotación'}</p>
              </div>
              <ul className="puntos">
                <li><Check/><span>Entradas, salidas y cobros</span></li>
                <li><Check/><span>Tarifas, caja y turnos</span></li>
                <li><Check/><span>{cocheras ? 'Cocheras mensuales y cuenta corriente' : 'Comprobantes y reportes'}</span></li>
              </ul>
              <a className={`boton ${destacado ? 'boton--oscuro' : 'boton--linea'}`}
                href={whatsapp(`Hola, quiero consultar por el plan ${plan.nombre}${cocheras ? ' con cocheras mensuales' : ''}, pago ${ciclo.consulta} de ${pesos(total)}.`)}
                target="_blank" rel="noopener noreferrer">
                Consultar este plan
              </a>
            </SpotlightCard>
          );
        })}
      </div>
      <p className="planes__periodo-nota">Los precios muestran el equivalente mensual. El pago trimestral o anual se realiza por el período completo y se coordina por WhatsApp.</p>
    </>
  );
}