'use client';

import { useState } from 'react';
import { whatsapp } from '../contacto';
import { Check } from './Iconos';
import Counter from './reactbits/Counter';
import SpotlightCard from './reactbits/SpotlightCard';

// Los mismos importes que siembra la migración de planes del backend (src/saas): si cambian allá,
// tienen que cambiar acá.
const PLANES = [
  { nombre: 'Playa chica', tamano: 'Hasta 30 vehículos a la vez', rotacion: 50_000, cocheras: 70_000 },
  { nombre: 'Playa mediana', tamano: 'Hasta 100 vehículos a la vez', rotacion: 70_000, cocheras: 95_000, destacado: true },
  { nombre: 'Playa grande', tamano: 'Sin límite de vehículos', rotacion: 110_000, cocheras: 140_000 },
] as const;

const pesos = (n: number) => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// Las posiciones que muestra el Counter, con el punto de miles donde va en castellano: 70.000.
const posiciones = (n: number) => {
  const cifras = String(n).length;
  const lista: (number | '.')[] = [];
  for (let exponente = cifras - 1; exponente >= 0; exponente--) {
    if (exponente === 2 && cifras > 3) lista.push('.');
    lista.push(10 ** exponente);
  }
  return lista;
};

export default function Planes() {
  const [mensual, setMensual] = useState(false);

  return (
    <>
      <div className="selector" role="group" aria-label="Modalidad del plan">
        <button type="button" aria-pressed={!mensual} onClick={() => setMensual(false)}>Tickets y rotación</button>
        <button type="button" aria-pressed={mensual} onClick={() => setMensual(true)}>+ Cocheras mensuales</button>
      </div>

      <div className="planes__grilla">
        {PLANES.map(plan => {
          const precio = mensual ? plan.cocheras : plan.rotacion;
          const destacado = 'destacado' in plan;
          return (
            <SpotlightCard key={plan.nombre} className={`plan${destacado ? ' plan--destacado' : ''}`}
              spotlightColor="rgba(255, 201, 28, 0.32)">
              {destacado && <span className="plan__distintivo">Más elegido</span>}
              <div className="plan__nombre">
                <h3>{plan.nombre}</h3>
                <p>{plan.tamano}</p>
              </div>
              <div className="plan__precio">
                <p className="plan__monto">
                  <span className="visualmente-oculto">{pesos(precio)} por mes</span>
                  <span className="plan__cifra" aria-hidden="true">
                    <span>$</span>
                    <Counter value={precio} places={posiciones(precio)} fontSize={44} padding={0} gap={0}
                      horizontalPadding={0} borderRadius={0} fontWeight={600} gradientHeight={0}/>
                  </span>
                  <span className="plan__por" aria-hidden="true">por mes</span>
                </p>
                <p className="plan__modo">{mensual ? 'Rotación + cocheras mensuales' : 'Tickets y rotación'}</p>
              </div>
              <ul className="puntos">
                <li><Check/><span>Entradas, salidas y cobros</span></li>
                <li><Check/><span>Tarifas, caja y turnos</span></li>
                <li><Check/><span>{mensual ? 'Cocheras mensuales y cuenta corriente' : 'Comprobantes y reportes'}</span></li>
              </ul>
              <a className={`boton ${destacado ? 'boton--oscuro' : 'boton--linea'}`}
                href={whatsapp(`Hola, quiero consultar por el plan ${plan.nombre}${mensual ? ' con cocheras mensuales' : ''}.`)}
                target="_blank" rel="noopener noreferrer">
                Consultar este plan
              </a>
            </SpotlightCard>
          );
        })}
      </div>
    </>
  );
}
