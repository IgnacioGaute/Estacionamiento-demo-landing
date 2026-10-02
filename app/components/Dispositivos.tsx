import type { CSSProperties } from 'react';
import './dispositivos.css';

/**
 * Equipos dibujados con CSS. Las capturas van dentro de una pantalla que recorta y tiene su misma
 * proporción (16/10 la notebook, 390/844 el celular, 1180/820 la tablet), así que nunca quedan
 * estiradas ni se salen del marco.
 *
 * Los de 3D son sólidos de verdad: el espesor sale de varias copias del contorno apiladas hacia
 * atrás (translateZ), así el canto se ve bien en cualquier ángulo, también mientras giran con el
 * mouse. Tienen que quedar dentro de un padre con preserve-3d (TiltedCard ya lo es).
 */

type Captura = { src: string; alt: string };
type Capa = readonly [z: number, color: string];

const Capas = ({ capas }: { capas: readonly Capa[] }) => (
  <>
    {capas.map(([z, color]) => (
      <span key={z} className="capa" aria-hidden="true" style={{ '--z': `${z}px`, '--c': color } as CSSProperties}/>
    ))}
  </>
);

const Reflejo = () => <span className="reflejo" aria-hidden="true"/>;

export function NotebookFrente({ src, alt }: Captura) {
  return (
    <div className="notebook-frente">
      <div className="notebook-frente__tapa">
        <div className="pantalla notebook-frente__pantalla"><img src={src} alt={alt}/></div>
      </div>
      <div className="notebook-frente__base"/>
    </div>
  );
}

export function CelularFrente({ src, alt }: Captura) {
  return (
    <div className="celular-frente">
      <div className="pantalla celular-frente__pantalla">
        <img src={src} alt={alt}/>
        <span className="isla" aria-hidden="true"/>
      </div>
    </div>
  );
}

const CANTO_CELULAR: readonly Capa[] = [[-9, '#1b1b1a'], [-7.5, '#2a2a28'], [-6, '#3a3936'], [-4.5, '#4a4945'], [-3, '#57564f'], [-1.5, '#3f3e3a']];

export function Celular3D({ src, alt }: Captura) {
  return (
    <div className="celular3d">
      <Capas capas={CANTO_CELULAR}/>
      <div className="celular3d__frente">
        <div className="pantalla celular3d__pantalla">
          <img src={src} alt={alt} loading="lazy"/>
          <span className="isla" aria-hidden="true"/>
          <Reflejo/>
        </div>
      </div>
    </div>
  );
}

const CANTO_BASE: readonly Capa[] = [[-6, '#8f8e89'], [-4.5, '#a3a29d'], [-3, '#b3b2ad'], [-1.5, '#c2c1bc']];
const CANTO_TAPA: readonly Capa[] = [[-6, '#d2d1cc'], [-4.5, '#c3c2bd'], [-3, '#b6b5b0'], [-1.5, '#3a3936']];

/**
 * La base es un plano aparte, abisagrado en el borde de abajo de la tapa y girado 90°: queda
 * horizontal de verdad, con el teclado mirando hacia arriba. Es apenas más ancha que la tapa, como
 * en un equipo real; si se la agranda, al estar más cerca de la cámara parece más ancha que la
 * pantalla.
 */
export function Notebook3D({ src, alt }: Captura) {
  return (
    <div className="notebook3d">
      <div className="notebook3d__base" aria-hidden="true">
        <span className="notebook3d__sombra"/>
        <Capas capas={CANTO_BASE}/>
        <div className="notebook3d__cubierta">
          <span className="notebook3d__bisagra"/>
          <span className="notebook3d__teclado"/>
          <span className="notebook3d__trackpad"/>
        </div>
      </div>
      <div className="notebook3d__tapa">
        <Capas capas={CANTO_TAPA}/>
        <div className="notebook3d__marco">
          <div className="pantalla notebook3d__pantalla">
            <img src={src} alt={alt} loading="lazy"/>
            <Reflejo/>
          </div>
        </div>
      </div>
    </div>
  );
}

const CANTO_TABLET: readonly Capa[] = [[-7, '#9a9994'], [-5.5, '#a9a8a3'], [-4, '#b6b5b0'], [-2.5, '#c4c3be'], [-1, '#2a2a28']];

export function Tablet3D({ src, alt }: Captura) {
  return (
    <div className="tablet3d">
      <Capas capas={CANTO_TABLET}/>
      <div className="tablet3d__frente">
        <span className="tablet3d__camara" aria-hidden="true"/>
        <div className="pantalla tablet3d__pantalla">
          <img src={src} alt={alt} loading="lazy"/>
          <Reflejo/>
        </div>
      </div>
    </div>
  );
}
