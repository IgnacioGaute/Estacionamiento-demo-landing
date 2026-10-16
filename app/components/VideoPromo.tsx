'use client';

import { useEffect, useRef, useState } from 'react';

const VERSION = '20261015';

type VideoConPantallaCompleta = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
type OrientacionBloqueable = ScreenOrientation & { lock?: (orientacion: string) => Promise<void> };

/**
 * El video de presentación en la portada: imagen de portada con un botón grande de play. No se descarga hasta
 * que alguien lo pide (preload="none"), así la portada carga liviana. Al tocar play arranca desde el principio,
 * con sonido y controles; en celular se abre a pantalla completa (y en Android intenta girar a horizontal).
 * Se pausa si la persona sigue bajando o cambia de pestaña, y al terminar vuelve el botón para verlo de nuevo.
 *
 * En celular baja la versión de 720p; el navegador que no entiende `media` en <source> toma la primera que pueda.
 */
export default function VideoPromo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observador = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting && !document.fullscreenElement) video.pause();
    }, { threshold: 0.2 });
    observador.observe(video);
    const alCambiarPestana = () => { if (document.hidden) video.pause(); };
    const alTerminar = () => { setReproduciendo(false); setVisto(true); };
    document.addEventListener('visibilitychange', alCambiarPestana);
    video.addEventListener('ended', alTerminar);
    return () => {
      observador.disconnect();
      document.removeEventListener('visibilitychange', alCambiarPestana);
      video.removeEventListener('ended', alTerminar);
    };
  }, []);

  const reproducir = () => {
    const video = ref.current as VideoConPantallaCompleta | null;
    if (!video) return;
    setReproduciendo(true);
    video.currentTime = 0;
    video.muted = false;
    video.play().catch(() => {});
    // En el celular el video se disfruta a pantalla completa. Tiene que pedirse dentro del mismo toque.
    if (window.matchMedia('(max-width: 820px)').matches) {
      const pedido = video.requestFullscreen ? video.requestFullscreen() : (video.webkitEnterFullscreen?.(), undefined);
      Promise.resolve(pedido)
        .then(() => (screen.orientation as OrientacionBloqueable | undefined)?.lock?.('landscape'))
        .catch(() => {});
    }
  };

  return (
    <figure className="video-promo">
      <video
        ref={ref}
        className="video-promo__video"
        playsInline
        controls={reproduciendo}
        preload="none"
        poster={`/videos/promo/estacionamiento-promo.webp?v=${VERSION}`}
        aria-label="Video de presentación: escáner de patentes, comprobantes, cobros, alertas, tarifas, caja y dashboard"
      >
        <source src={`/videos/promo/estacionamiento-promo-720.mp4?v=${VERSION}`} type="video/mp4" media="(max-width: 820px)" />
        <source src={`/videos/promo/estacionamiento-promo-1080.mp4?v=${VERSION}`} type="video/mp4" />
      </video>
      {!reproduciendo && (
        <button type="button" className="video-promo__play" onClick={reproducir}>
          <span className="video-promo__circulo" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
          </span>
          <span className="video-promo__texto">
            <strong>{visto ? 'Ver de nuevo' : 'Mirá el sistema en acción'}</strong>
            <span className="video-promo__duracion">1:42</span>
          </span>
        </button>
      )}
    </figure>
  );
}
