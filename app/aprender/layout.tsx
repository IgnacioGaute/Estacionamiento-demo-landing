import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Guías del sistema | Estacionamiento',
  description: 'Aprendé a registrar entradas, cobrar salidas, configurar tarifas y controlar turnos y caja. Guías narradas, con pasos directos y ejemplos en computadora y celular.',
};
export const viewport: Viewport = { themeColor: '#0b0e13' };

export default function LearningLayout({ children }: { children: ReactNode }) { return children; }
