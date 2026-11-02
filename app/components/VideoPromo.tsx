'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './VideoPromo.module.css';

const VERSION = '20261102-producto';

type VideoConPantallaCompleta = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
type OrientacionBloqueable = ScreenOrientation & { lock?: (orientacion: string) => Promise<void> };
// espera: todavía no se vio · auto: corre solo y sin sonido · sonido: la persona lo activó (con controles)
// manual: no puede arrancar solo (reducir movimiento o el navegador no deja) · fin: terminó
type Modo = 'espera' | 'auto' | 'sonido' | 'manual' | 'fin';

/**
 * El video de presentación en la portada. Se empieza a descargar cuando está por aparecer y arranca solo, sin
 * sonido, al quedar a la vista: los navegadores no dejan reproducir con sonido sin un toque. Tocarlo lo vuelve a
 * empezar con sonido y controles; en celular además se abre a pantalla completa (y en Android intenta girar a
 * horizontal). Se pausa si la persona sigue bajando o cambia de pestaña, y sigue cuando vuelve.
 * Con «reducir movimiento», o si el navegador no deja arrancarlo solo, queda el botón grande de play.
 *
 * En celular baja la versión de 720p; el navegador que no entiende `media` en <source> toma la primera que pueda.
 */
export default function VideoPromo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [modo, setModo] = useState<Modo>('espera');
  const modoRef = useRef<Modo>('espera');
  const cambiar = (m: Modo) => { modoRef.current = m; setModo(m); };

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (quieto) cambiar('manual');
    let aLaVista = false;
    const arrancar = () => {
      const m = modoRef.current;
      if (quieto || document.hidden || !aLaVista || (m !== 'espera' && m !== 'auto')) return;
      video.muted = true;
      video.preload = 'auto';
      video.play().then(() => cambiar('auto')).catch((error: unknown) => {
        const nombre = (error as DOMException)?.name;
        // Si el navegador no lo deja arrancar solo (ahorro de batería, por ejemplo), queda el botón de play.
        if (nombre === 'NotAllowedError') cambiar('manual');
        // Una carga que empezó al mismo tiempo corta el play: se vuelve a intentar cuando ya puede reproducirse.
        else if (nombre === 'AbortError') video.addEventListener('canplay', arrancar, { once: true });
      });
    };
    // Se pide el archivo un poco antes de que aparezca, así arranca sin esperar. Si ya está a la vista, lo pide play().
    const cerca = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting && !aLaVista && video.preload !== 'auto') { video.preload = 'auto'; video.load(); }
    }, { rootMargin: '600px 0px' });
    // Arranca con la mitad del video a la vista; se pausa cuando casi no se ve.
    const vista = new IntersectionObserver(([entrada]) => {
      aLaVista = entrada.intersectionRatio >= 0.5;
      if (aLaVista) arrancar();
      else if (entrada.intersectionRatio < 0.2 && !document.fullscreenElement) video.pause();
    }, { threshold: [0, 0.2, 0.5] });
    cerca.observe(video);
    vista.observe(video);
    const alCambiarPestana = () => { if (document.hidden) video.pause(); else arrancar(); };
    const alTerminar = () => cambiar('fin');
    document.addEventListener('visibilitychange', alCambiarPestana);
    video.addEventListener('ended', alTerminar);
    return () => {
      cerca.disconnect();
      vista.disconnect();
      document.removeEventListener('visibilitychange', alCambiarPestana);
      video.removeEventListener('ended', alTerminar);
      video.removeEventListener('canplay', arrancar);
    };
  }, []);

  // Desde el principio, con sonido y controles. Tiene que pedirse dentro del mismo toque.
  const verConSonido = () => {
    const video = ref.current as VideoConPantallaCompleta | null;
    if (!video) return;
    cambiar('sonido');
    video.currentTime = 0;
    video.muted = false;
    video.play().catch(() => { cambiar('manual'); });
    // En el celular el video se disfruta a pantalla completa.
    if (window.matchMedia('(max-width: 820px)').matches) {
      const pedido = video.requestFullscreen ? video.requestFullscreen() : (video.webkitEnterFullscreen?.(), undefined);
      Promise.resolve(pedido)
        .then(() => (screen.orientation as OrientacionBloqueable | undefined)?.lock?.('landscape'))
        .catch(() => {});
    }
  };

  return (
    <figure className={`video-promo ${styles.frame}`}>
      <video
        ref={ref}
        className="video-promo__video"
        muted
        playsInline
        controls={modo === 'sonido'}
        preload="none"
        poster={`/videos/promo/estacionamiento-promo.webp?v=${VERSION}`}
        aria-label="Video de presentación: foto de patentes, comprobantes, avisos, cobros, tarifas, caja y dashboard"
      >
        <source src={`/videos/promo/estacionamiento-promo-720.mp4?v=${VERSION}`} type="video/mp4" media="(max-width: 820px)" />
        <source src={`/videos/promo/estacionamiento-promo-1080.mp4?v=${VERSION}`} type="video/mp4" />
      </video>
      {modo === 'auto' && (
        <button type="button" className={styles.sonido} onClick={verConSonido} aria-label="Activar el sonido y ver el video desde el principio">
          <span className={styles.pastilla}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" /><path d="m22 9-6 6M16 9l6 6" /></svg>
            Activar sonido
          </span>
        </button>
      )}
      {(modo === 'manual' || modo === 'fin') && (
        <button type="button" className={`video-promo__play ${styles.play}`} onClick={verConSonido}>
          <span className={`video-promo__circulo ${styles.circle}`} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
          </span>
          <span className={`video-promo__texto ${styles.text}`}>
            <strong>{modo === 'fin' ? 'Ver de nuevo' : 'Mirá el sistema en acción'}</strong>
            <span className="video-promo__duracion">1:18</span>
          </span>
        </button>
      )}
    </figure>
  );
}
