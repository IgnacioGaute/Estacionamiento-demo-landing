'use client';

// Basado en TiltedCard de React Bits (https://reactbits.dev, licencia MIT), variante TS + CSS.
// Conserva sus resortes y la misma cuenta del giro según dónde está el mouse. Cambia en tres cosas:
// envuelve cualquier contenido (un equipo 3D) en vez de una imagen, parte de un ángulo de reposo
// en lugar de estar de frente, y en vez del cartelito que sigue al cursor mueve un reflejo
// (`--glare-*`) que el contenido puede usar sobre su pantalla.

import type { SpringOptions } from 'motion/react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import './TiltedCard.css';

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  baseRotateX?: number;
  baseRotateY?: number;
  baseRotateZ?: number;
  rotateAmplitude?: number;
  perspective?: number;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  children,
  className = '',
  innerClassName = '',
  baseRotateX = 0,
  baseRotateY = 0,
  baseRotateZ = 0,
  rotateAmplitude = 6,
  perspective = 1600
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(baseRotateX), springValues);
  const rotateY = useSpring(useMotionValue(baseRotateY), springValues);

  // Quien pidió menos movimiento en su sistema ve el equipo quieto en su ángulo de reposo.
  const quieto = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current || quieto()) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    rotateX.set(baseRotateX + (offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set(baseRotateY + (offsetX / (rect.width / 2)) * rotateAmplitude);

    ref.current.style.setProperty('--glare-x', `${50 + (offsetX / rect.width) * 90}%`);
    ref.current.style.setProperty('--glare-y', `${40 + (offsetY / rect.height) * 90}%`);
  }

  function handleMouseEnter() {
    if (quieto()) return;
    ref.current?.style.setProperty('--glare-o', '1');
  }

  function handleMouseLeave() {
    rotateX.set(baseRotateX);
    rotateY.set(baseRotateY);
    ref.current?.style.setProperty('--glare-o', '0');
  }

  return (
    <div
      ref={ref}
      className={`tilted-card-figure ${className}`}
      style={{ perspective }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div className={`tilted-card-inner ${innerClassName}`} style={{ rotateX, rotateY, rotateZ: baseRotateZ }}>
        {children}
      </motion.div>
    </div>
  );
}
