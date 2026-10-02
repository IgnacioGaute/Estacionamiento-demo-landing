import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Estacionamiento | Operá tu playa sin complicaciones',
  description: 'Tickets, patentes, tarifas, turnos y caja en un sistema simple, rápido y preparado para celular.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f5f4f0' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
