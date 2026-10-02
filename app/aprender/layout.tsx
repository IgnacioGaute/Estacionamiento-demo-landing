import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Aprender | Estacionamiento',
  description: 'Seis guías en video, grabadas sobre el sistema real y narradas paso a paso.',
};
// La página es oscura: la barra del navegador en el celular tiene que acompañarla.
export const viewport: Viewport = { themeColor: '#0c0c0b' };

export default function AprenderLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
