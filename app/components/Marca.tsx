/**
 * La marca del sistema: la misma "M" de barreras que usa la app (ParkingMark), sobre su placa
 * oscura. El degradado lleva un id propio por instancia: dos <defs> con el mismo id en la página
 * hacen que el segundo dibujo tome el del primero.
 */
export default function Marca({ id }: { id: string }) {
  return (
    <svg className="marca__icono" width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="12" y1="16" x2="52" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffc91c"/>
          <stop offset="1" stopColor="#f36b2b"/>
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="14" fill="#121211" stroke="#2c2b27" strokeWidth="2"/>
      <path d="M15 47 V19 L25.5 33.5 L33.2 17.8 L40.9 33.5 L51.4 19 V47" fill="none" stroke={`url(#${id})`}
        strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}
