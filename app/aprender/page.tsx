'use client';

import { useRef, useState } from 'react';
import Encabezado from '../components/Encabezado';
import { CelularAcostado, Flecha, IconoWhatsApp, Reproducir } from '../components/Iconos';
import { DEMO_WSP } from '../contacto';
import { guides } from '../tutorial-data';
import './learn.css';

const segundos = (duracion: string) => {
  const [minutos, resto] = duracion.split(':').map(Number);
  return minutos * 60 + resto;
};
const MINUTOS_TOTALES = Math.round(guides.reduce((total, guia) => total + segundos(guia.duration), 0) / 60);

export default function AprenderPage() {
  const [indice, setIndice] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const principal = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const guia = guides[indice];
  const siguiente = guides[(indice + 1) % guides.length];

  // Elegir una guía es pedir verla: arranca sola. En el celular la lista queda debajo del video,
  // así que además se sube hasta el reproductor si quedó fuera de la pantalla.
  const elegir = (nuevo: number) => {
    setIndice(nuevo);
    setReproduciendo(true);
    const caja = principal.current?.getBoundingClientRect();
    if (caja && (caja.top < 0 || caja.top > window.innerHeight * 0.6)) principal.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reproducir = () => {
    setReproduciendo(true);
    void video.current?.play().catch(() => {});
  };

  return <div className="aprender">
    <Encabezado tono="oscuro" actual="guias"/>
    <main>
      <section className="contenedor aprender__cabeza">
        <p className="aprender__etiqueta">Centro de aprendizaje</p>
        <h1>Aprendé a usar el sistema</h1>
        <p>Seis guías en video, grabadas sobre el sistema real y narradas paso a paso. Elegí un tema y volvé cuando lo necesites.</p>
        <p className="aprender__datos">
          <span>{guides.length} guías</span><span aria-hidden="true">·</span>
          <span>{MINUTOS_TOTALES} minutos en total</span><span aria-hidden="true">·</span>
          <span>Para operadores y administradores</span>
        </p>
      </section>

      <section className="contenedor aprender__cuerpo">
        <div className="aprender__principal" ref={principal}>
          <div className="reproductor">
            <video key={guia.file} ref={video} poster={`/video-posters/${guia.poster}.jpg`} controls={reproduciendo}
              autoPlay={reproduciendo} playsInline preload="metadata" onPlay={() => setReproduciendo(true)}
              aria-label={`Guía en video: ${guia.title}`}>
              <source src={`/videos/${guia.file}.mp4`} type="video/mp4"/>
              Tu navegador no puede reproducir este video.
            </video>
            {!reproduciendo && <button type="button" className="reproductor__portada" onClick={reproducir} aria-label={`Reproducir: ${guia.title}`}>
              <span className="reproductor__boton"><Reproducir/></span>
              <span className="reproductor__duracion">{guia.duration}</span>
            </button>}
          </div>

          <div className="guia">
            <p className="guia__meta">
              <span>Guía {guia.number} de {String(guides.length).padStart(2, '0')}</span><span aria-hidden="true">·</span><span>{guia.category}</span>
            </p>
            <div className="guia__titulo">
              <h2>{guia.title}</h2>
              <button type="button" className="boton boton--chico boton--linea-oscura" onClick={() => elegir((indice + 1) % guides.length)}
                aria-label={`Siguiente guía: ${siguiente.title}`}>
                Siguiente guía<Flecha/>
              </button>
            </div>
            <p className="guia__descripcion">{guia.description}</p>
          </div>

          <div className="temas">
            <h3>En esta guía</h3>
            <ol>
              {guia.topics.map((tema, i) => <li key={tema}><span>{String(i + 1).padStart(2, '0')}</span>{tema}</li>)}
            </ol>
          </div>

          <p className="consejo"><CelularAcostado/>Girá el celular para ver los textos del video más grandes.</p>
        </div>

        <aside className="lista" aria-label="Todas las guías">
          <div className="lista__cabeza">
            <h2>Todas las guías</h2>
            <span>{guides.length} · {MINUTOS_TOTALES} min</span>
          </div>
          <ol>
            {guides.map((item, i) => {
              const actual = i === indice;
              return <li key={item.number}>
                <button type="button" onClick={() => elegir(i)} aria-current={actual ? 'true' : undefined}>
                  <img src={`/video-posters/${item.poster}.jpg`} alt="" loading="lazy"/>
                  <span className="lista__texto">
                    <span className="lista__tema">{item.number} · {item.category}</span>
                    <span className="lista__titulo">{item.title}</span>
                    {actual
                      ? <span className="lista__viendo">Viendo ahora</span>
                      : <span className="lista__duracion">{item.duration}</span>}
                  </span>
                </button>
              </li>;
            })}
          </ol>
        </aside>
      </section>

      <section className="contenedor aprender__cierre">
        <div className="aprender__tarjeta">
          <div>
            <h2>¿Querés verlo con tus tarifas?</h2>
            <p>Te mostramos el sistema con un ejemplo parecido al de tu playa.</p>
          </div>
          <a className="boton boton--acento" href={DEMO_WSP} target="_blank" rel="noopener noreferrer"><IconoWhatsApp/>Pedir una demo por WhatsApp</a>
        </div>
      </section>
    </main>

    <footer className="aprender__pie">
      <div className="contenedor">
        <span>© {new Date().getFullYear()} Estacionamiento · Mendoza, Argentina</span>
        <a href="/">Volver al inicio</a>
      </div>
    </footer>
  </div>;
}
