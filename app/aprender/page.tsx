'use client';

import { useEffect, useRef, useState } from 'react';
import Encabezado from '../components/Encabezado';
import { CelularAcostado, Flecha, Reproducir } from '../components/Iconos';
import { DEMO_WSP } from '../contacto';
import { guides } from '../tutorial-data';
import { chapters } from './chapters';
import './learn.css';

const seconds = (value: string) => { const [m, s] = value.split(':').map(Number); return m * 60 + s; };
const clock = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
const totalMinutes = Math.round(guides.reduce((sum, guide) => sum + seconds(guide.duration), 0) / 60);
const storageKey = 'estacionamiento-aprender-v2';

function Assistant({ talking }: { talking: boolean }) {
  return <div className={`learn-assistant${talking ? ' is-talking' : ''}`} aria-hidden="true">
    <div className="learn-assistant__bubble">{talking ? 'Te acompaño en cada paso.' : 'Vamos paso a paso.'}<span>Tu guía, a tu ritmo.</span></div>
    <div className="learn-assistant__character"><div className="learn-assistant__orb"><div className="learn-assistant__aura"/><div className="learn-assistant__highlight"/><div className="learn-assistant__led"/><i className="learn-assistant__screw left"/><i className="learn-assistant__screw right"/><i className="learn-assistant__vent left"/><i className="learn-assistant__vent right"/><div className="learn-assistant__visor"><div className="learn-assistant__eyes"><span><i/></span><span><i/></span></div><div className="learn-assistant__reflection"/></div><div className="learn-assistant__mouth"/></div><span className="learn-assistant__label">Tu asistente</span></div>
  </div>;
}

export default function AprenderPage() {
  const [selected, setSelected] = useState(0);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [startAt, setStartAt] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [slow, setSlow] = useState(false);
  const [positions, setPositions] = useState<Record<string, number>>({});
  const frame = useRef<HTMLIFrameElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const principal = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<Record<string, number>>({});
  const storedAt = useRef(0);
  const guide = guides[selected];
  const steps = chapters[guide.number] ?? [];
  const duration = seconds(guide.duration);
  const resume = (positions[guide.number] ?? 0) < duration - 3 ? positions[guide.number] ?? 0 : 0;
  const activeStep = Math.max(0, steps.reduce((last, step, index) => step.start <= time + .15 ? index : last, 0));
  const finished = started && time >= duration - 1;

  useEffect(() => {
    try { const value = JSON.parse(localStorage.getItem(storageKey) ?? '{}'); if (value && typeof value === 'object') { positionsRef.current = value; setPositions(value); } } catch { /* El reproductor también funciona sin almacenamiento local. */ }
    const readHash = () => {
      const match = location.hash.match(/^#guia-(\d\d)$/);
      const index = match ? guides.findIndex(item => item.number === match[1]) : -1;
      if (index >= 0) { setSelected(index); setStarted(false); setReady(false); setPlaying(false); setTime(0); }
    };
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  const persist = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return;
    positionsRef.current[guide.number] = value;
    if (Date.now() - storedAt.current > 5000) {
      storedAt.current = Date.now();
      setPositions({ ...positionsRef.current });
      try { localStorage.setItem(storageKey, JSON.stringify(positionsRef.current)); } catch { /* Opcional. */ }
    }
  };

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || event.data?.source !== 'estacionamiento-guia') return;
      const message = event.data;
      if (message.type === 'ready') { setReady(true); setSlow(false); }
      if (message.type === 'loading-slow') setSlow(true);
      if (message.type === 'blocked') setPlaying(false);
      if (message.type === 'state' && typeof message.time === 'number') {
        setTime(message.time); setPlaying(message.paused === false); persist(message.time);
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [guide.number]);

  const send = (action: string, value?: number) => frame.current?.contentWindow?.postMessage({ source: 'estacionamiento-aprender', action, time: value }, location.origin);
  const play = (at = resume) => { setStartAt(at); setTime(at); setReady(false); setSlow(false); setStarted(true); setPlaying(false); setNonce(value => value + 1); };
  const choose = (index: number) => {
    if (index === selected) { if (!started) play(); else if (guide.player) send('play'); else void video.current?.play(); return; }
    const item = guides[index], saved = positionsRef.current[item.number] ?? 0;
    const at = saved < seconds(item.duration) - 3 ? saved : 0;
    setSelected(index); setStarted(true); setReady(false); setSlow(false); setPlaying(false); setTime(at); setStartAt(at); setNonce(value => value + 1);
    history.replaceState(null, '', `#guia-${item.number}`);
    const box = principal.current?.getBoundingClientRect();
    if (box && (box.top < 0 || box.top > innerHeight * .5)) principal.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };
  const seek = (at: number) => {
    if (!started || !ready) { play(at); return; }
    setTime(at);
    if (guide.player) { send('seek', at); send('play'); }
    else if (video.current) { video.current.currentTime = at; void video.current.play(); }
  };

  return <div className="aprender">
    <div className="learn-ambient" aria-hidden="true"/>
    <Encabezado tono="oscuro" actual="guias"/>
    <main>
      <section className="contenedor aprender__cabeza">
        <div className="learn-intro"><p className="aprender__etiqueta"><span/>Centro de aprendizaje</p><h1>Todo el sistema.<br/><span>Paso a paso.</span></h1><p className="learn-intro__copy">Mirá cómo se hace en computadora y celular. Elegí una guía o andá directo al paso que necesitás.</p><div className="aprender__datos"><span><b>06</b> guías completas</span><i/><span><b>{totalMinutes}</b> minutos para aprender</span></div></div>
        <Assistant talking={playing}/>
      </section>

      <nav className="contenedor learn-mobile-nav" aria-label="Acceso rápido a las guías">{guides.map((item, index) => <button type="button" key={item.number} aria-current={index === selected ? 'true' : undefined} onClick={() => choose(index)}><span>{item.number}</span>{item.category}</button>)}</nav>
      <section className="contenedor aprender__cuerpo" aria-label="Guías del sistema">
        <div className="aprender__principal" ref={principal}>
          <div className="learn-player-card">
            <div className="learn-player-bar"><span className="learn-player-bar__tag"><i/>{guide.category}</span><span>Guía {guide.number} <span className="muted">/ 06</span></span><span className="learn-player-bar__duration">{guide.duration}</span></div>
            <div className="reproductor" aria-label={`Reproductor: ${guide.title}`}>
              {started ? guide.player ? <iframe key={`${guide.file}-${nonce}`} ref={frame} src={`${guide.player}?autoplay=1&t=${startAt}`} title={`Guía en video: ${guide.title}`} allow="autoplay; fullscreen" allowFullScreen/> : <video key={`${guide.file}-${nonce}`} ref={video} controls autoPlay playsInline preload="metadata" poster={`/video-posters/${guide.poster}.jpg`} aria-label={`Guía en video: ${guide.title}`} onLoadedMetadata={event => { event.currentTarget.currentTime = startAt; setReady(true); }} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onTimeUpdate={event => { setTime(event.currentTarget.currentTime); persist(event.currentTarget.currentTime); }}><source src={`/videos/${guide.file}.mp4`} type="video/mp4"/>Tu navegador no puede reproducir este video.</video> : <><img className="reproductor__imagen" src={`/video-posters/${guide.poster}.jpg`} alt={`Vista previa: ${guide.title}`} fetchPriority="high"/><button type="button" className="reproductor__portada" onClick={() => play()} aria-label={`${resume > 10 ? 'Continuar' : 'Reproducir'}: ${guide.title}`}><span className="reproductor__boton"><Reproducir/></span><span className="reproductor__invitacion">{resume > 10 ? `Continuar desde ${clock(resume)}` : 'Empezar la guía'}</span><span className="reproductor__duracion">{guide.duration}</span></button></>}
              {started && !ready && <div className="learn-loading" role="status"><span className="learn-spinner"/><span>{slow ? 'La primera carga está tardando un poco.' : 'Preparando tu guía…'}</span>{slow && <button type="button" onClick={() => play(startAt)}>Volver a intentar</button>}</div>}
            </div>
            <div className="learn-player-foot"><span><span className="learn-monitor" aria-hidden="true"/>Computadora + celular</span>{started ? <button type="button" onClick={() => seek(0)}>Volver al inicio</button> : resume > 10 ? <button type="button" onClick={() => play(0)}>Empezar desde el inicio</button> : <span>Con voz y explicación paso a paso</span>}</div>
          </div>

          <div className="guia"><div className="guia__meta"><span>ESTÁS APRENDIENDO</span><span>{steps.length ? `${steps.length} pasos explicados` : 'Guía completa'}</span></div><h2>{guide.title}</h2><p className="guia__descripcion">{guide.description}</p></div>

          {steps.length > 0 ? <section className="learn-chapters" aria-label="Pasos de esta guía"><div className="learn-section-head"><h3>Andá directo al paso.</h3><span>{steps.length} pasos · {guide.duration}</span></div><div className="learn-chapters__list"><ol>{steps.map((step, index) => <li key={`${guide.number}-${index}`}><button type="button" aria-current={started && activeStep === index ? 'step' : undefined} onClick={() => seek(step.start)}><span className="learn-step-number">{String(index + 1).padStart(2, '0')}</span><span className="learn-step-copy"><span>{step.section}</span><strong>{step.title}</strong></span><time>{clock(step.start)}</time><span className="learn-step-play" aria-hidden="true"><Reproducir/></span></button></li>)}</ol></div><details className="learn-transcript"><summary>Leer la explicación de este paso <span>↗</span></summary><p>{steps[activeStep]?.narration}</p></details></section> : <section className="temas"><div className="learn-section-head"><h3>En esta guía</h3></div><ol>{guide.topics.map((topic, index) => <li key={topic}><span>{String(index + 1).padStart(2, '0')}</span>{topic}</li>)}</ol></section>}

          <div className="learn-next"><div><span>{finished ? 'GUÍA COMPLETADA' : 'SEGUÍ APRENDIENDO'}</span><p>{guides[(selected + 1) % guides.length].title}</p></div><button type="button" onClick={() => choose((selected + 1) % guides.length)}>Siguiente guía <Flecha/></button></div>
          <p className="consejo"><CelularAcostado/><span>En el celular, girá la pantalla y ampliá el reproductor para ver mejor los detalles.</span></p>
          <p className="learn-demo-note">Ejemplos grabados en una cuenta de demostración.</p>
        </div>

        <aside className="lista" aria-label="Todas las guías"><div className="lista__cabeza"><span className="learn-overline">TU RECORRIDO</span><h2>Elegí qué aprender.</h2><p>De la primera entrada al control de tu playa.</p></div><ol>{guides.map((item, index) => { const active = index === selected, percent = Math.min(100, (positions[item.number] ?? 0) / seconds(item.duration) * 100); return <li key={item.number}><button type="button" aria-current={active ? 'true' : undefined} onClick={() => choose(index)}><span className="lista__numero">{percent >= 98 ? '✓' : item.number}</span><span className="lista__texto"><span className="lista__tema">{item.category}</span><span className="lista__titulo">{item.title}</span><span className={active ? 'lista__viendo' : 'lista__duracion'}>{active ? 'Viendo ahora' : item.duration}</span></span><img src={`/video-posters/${item.poster}.jpg`} alt="" loading="lazy"/>{percent > 0 && <span className="lista__track" aria-hidden="true"><span style={{ width: `${percent}%` }}/></span>}</button></li>; })}</ol><div className="lista__ayuda"><span>↳</span><p>A tu ritmo.<br/><span>Podés pausar, repetir o retomar donde te quedaste.</span></p></div></aside>
      </section>

      <section className="contenedor aprender__cierre"><div className="aprender__tarjeta"><div><span className="learn-overline">EL PRÓXIMO PASO</span><h2>Ahora, con tu estacionamiento.</h2><p>Te mostramos el sistema con un ejemplo parecido al de tu playa.</p></div><a className="boton boton--acento" href={DEMO_WSP} target="_blank" rel="noopener noreferrer">Pedir una demo <Flecha/></a></div></section>
    </main><footer className="aprender__pie"><div className="contenedor"><span>© {new Date().getFullYear()} Estacionamiento · Mendoza, Argentina</span><a href="/">Volver al inicio <span aria-hidden="true">↗</span></a></div></footer>
  </div>;
}
