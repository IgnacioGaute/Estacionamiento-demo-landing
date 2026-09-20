import type { Metadata, Viewport } from 'next';
import './globals.css';
import './extras.css';
import './devices.css';

export const metadata: Metadata = {
  title: 'Estacionamiento | Operá tu playa sin complicaciones',
  description: 'Tickets, patentes, tarifas, turnos y caja en un sistema simple, rápido y preparado para celular.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b0b0a' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
