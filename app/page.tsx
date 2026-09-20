'use client';

import { useEffect, useRef } from 'react';

const Icon = ({ name }: { name: 'scan'|'plate'|'cash'|'price'|'shield'|'chart'|'clock'|'car' }) => {
  const paths = {
    scan: <><path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3"/><path d="M7 12h10"/></>,
    plate: <><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 12h10M6 10h.01M18 14h.01"/></>,
    cash: <><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M7 9h.01M17 15h.01"/></>,
    price: <><path d="M20 12 12 20l-8-8V4h8Z"/><circle cx="9" cy="9" r="1"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    car: <><path d="m5 17-1-2v-4l2-5h12l2 5v4l-1 2"/><path d="M6 17v2M18 17v2M4 12h16M7 14h.01M17 14h.01"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

/**
 * Notebook y celular armados con CSS en perspectiva (ver devices.css).
 * La captura va adentro de la pantalla, que recorta y tiene su misma proporción,
 * así que nunca se sale del marco ni queda estirada, entre en el ancho que entre.
 */
const Notebook = ({ src, alt }: { src: string; alt: string }) => (
  <div className="d3-laptop">
    <div className="d3-laptop__body">
      <div className="d3-laptop__lid">
        <span className="d3-laptop__cam"/>
        <div className="d3-screen"><img src={src} alt={alt}/><span className="d3-screen__glare"/></div>
        <span className="d3-laptop__mark">Estacionamiento</span>
      </div>
      <div className="d3-laptop__deck">
        <span className="d3-laptop__hinge"/>
        <span className="d3-laptop__keys"/>
        <span className="d3-laptop__space"/>
        <span className="d3-laptop__pad"/>
      </div>
    </div>
    <div className="d3-laptop__shadow"/>
  </div>
);

const Celular = ({ src, alt }: { src: string; alt: string }) => (
  <div className="d3-phone">
    <div className="d3-phone__body">
      <div className="d3-phone__screen"><img src={src} alt={alt}/><span className="d3-screen__glare"/></div>
      <span className="d3-phone__island"/>
      <span className="d3-phone__bar"/>
    </div>
    <div className="d3-phone__shadow"/>
  </div>
);

function BentoGlow() {
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const move = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${event.clientX-r.left}px`);
      el.style.setProperty('--my', `${event.clientY-r.top}px`);
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, []);
  return <div ref={grid} className="bento-grid">
    <article className="bento bento-lead"><span className="icon"><Icon name="scan" /></span><p className="eyebrow">DOS FORMAS DE ENTRAR</p><h3>Ficha o patente.<br/>El mismo flujo simple.</h3><p>Primer escaneo abre. El siguiente lleva al cobro. Con patente, el buscador tolera errores comunes al escribir.</p><div className="mini-flow"><span>Entrada</span><i/><span>Estadía</span><i/><span>Cobro</span></div></article>
    <article className="bento"><span className="icon"><Icon name="price" /></span><p className="eyebrow">TARIFAS FLEXIBLES</p><h3>Cobrá como trabaja tu playa</h3><p>Por duración, períodos iniciados, períodos completos o minutos exactos. Día y noche incluidos.</p></article>
    <article className="bento"><span className="icon"><Icon name="shield" /></span><p className="eyebrow">PRECIO CONGELADO</p><h3>Sin discusiones al cambiar una tarifa</h3><p>Cada ingreso guarda los precios vigentes. Una actualización nunca cambia lo que corresponde cobrarle al auto que ya entró.</p></article>
    <article className="bento bento-wide"><div><span className="icon"><Icon name="cash" /></span><p className="eyebrow">CAJA Y TURNOS</p><h3>El efectivo pasa de un turno al siguiente</h3><p>Uno, tres o los turnos que necesites. Contado, retirado y fondo entregado quedan claros para cada operador.</p></div><div className="cash-card"><small>EFECTIVO DISPONIBLE</small><strong>$ 86.400</strong><span><b/> Caja en orden</span></div></article>
    <article className="bento"><span className="icon"><Icon name="clock" /></span><p className="eyebrow">CIERRE SEGURO</p><h3>Vista previa antes de cobrar</h3><p>Si el precio cambia mientras confirmás, el sistema frena el cierre y muestra el nuevo importe.</p></article>
    <article className="bento"><span className="icon"><Icon name="chart" /></span><p className="eyebrow">CONTROL</p><h3>Todo explicado</h3><p>Desglose de cálculo, anticipos, cortesías, actividad por horario y reportes por rango.</p></article>
    <article className="bento"><span className="icon"><Icon name="car" /></span><p className="eyebrow">DÍA, SEMANA O MES</p><h3>No todo se cobra por hora</h3><p>Registrá un vehículo por día, por semana o por mes, con su propio precio según el tipo. Se cobra al ingresar y entra en la caja como cualquier otro cobro.</p></article>
  </div>;
}

export default function Home() {
  return <main>
    <nav className="nav wrap"><a className="brand" href="#inicio"><span>ES</span> Estacionamiento</a><div className="nav-links"><a href="#sistema">Sistema</a><a href="#funciones">Funciones</a><a className="nav-cta" href="#contacto">Solicitar demo</a></div></nav>

    <section id="inicio" className="hero wrap">
      <div className="hero-copy"><p className="kicker"><span/> HECHO PARA PLAYAS DE ESTACIONAMIENTO</p><h1>Tu playa,<br/><em>más simple.</em></h1><p className="hero-text">Tickets, patentes, tarifas y caja en una pantalla que cualquier operador puede entender desde el primer día.</p><div className="hero-actions"><a className="button primary" href="#sistema">Ver el sistema <b>↘</b></a><a className="button ghost" href="#funciones">Explorar funciones</a></div><div className="trust"><span><b>✓</b> Funciona en celular</span><span><b>✓</b> Sin instalaciones</span><span><b>✓</b> Una o varias playas</span></div></div>
      <div className="hero-visual d3-rig d3-rig--hero">
        <div className="d3-rig__orb"/>
        <Notebook src="/screens/operacion-desktop.png" alt="Pantalla de tickets y patentes del sistema, en una notebook"/>
        <Celular src="/screens/operacion-mobile.png" alt="La misma pantalla de tickets en un celular"/>
        <div className="floating-stat"><span><Icon name="car"/></span><div><strong>Responsive</strong><small>La misma operación en cada pantalla</small></div></div>
      </div>
    </section>

    <section className="proof"><div className="wrap proof-row"><p>UNA OPERACIÓN, DE PRINCIPIO A FIN</p><div><strong>01</strong><span>Registrá<br/>la entrada</span></div><i/><div><strong>02</strong><span>El sistema<br/>calcula</span></div><i/><div><strong>03</strong><span>Cobrá y<br/>cerrá</span></div></div></section>

    <section id="sistema" className="showcase wrap"><div className="section-head"><div><p className="kicker"><span/> SE ADAPTA AL TRABAJO REAL</p><h2>Grande cuando administrás.<br/><em>Rápido cuando operás.</em></h2></div><p>La notebook muestra el espacio completo de trabajo, con teclado y trackpad. En el celular, el sistema ocupa toda la pantalla y deja las acciones importantes al alcance del pulgar.</p></div><div className="d3-rig d3-rig--panel"><Notebook src="/screens/tarifas-desktop.png" alt="Pantalla de precios por duración, con las franjas de tarifa cargadas"/><Celular src="/screens/activos-mobile.png" alt="Lista de vehículos activos en el celular"/><div className="device-note"><b>100%</b><span>adaptado<br/>a mobile</span></div></div></section>

    <section id="funciones" className="features"><div className="wrap"><div className="section-head compact"><div><p className="kicker"><span/> TODO LO QUE NECESITÁS</p><h2>Potente por dentro.<br/><em>Claro por fuera.</em></h2></div><p>La complejidad vive en el motor. El operador ve decisiones simples y datos fáciles de comprobar.</p></div><BentoGlow/></div></section>

    <section className="admin-section wrap"><div className="section-head"><div><p className="kicker"><span/> ADMINISTRACIÓN COMPLETA</p><h2>Configurá una vez.<br/><em>Operá todos los días.</em></h2></div><p>Cada pantalla administrativa tiene un objetivo concreto. Los cambios de configuración quedan separados de la operación diaria.</p></div><div className="admin-grid">
      <article><span>01</span><div><h3>Tickets y tarifas</h3><p>Crea fichas físicas, tipos de vehículo y precios por día, noche, duración, período iniciado, período completo o minuto exacto. Y aparte, precios por día, semana y mes para las estadías largas.</p></div></article>
      <article><span>02</span><div><h3>Horarios y cruces</h3><p>Define cuándo empieza el día y la noche, y si una estadía usa el precio de entrada, salida o se divide por cada tramo.</p></div></article>
      <article><span>03</span><div><h3>Simulador de precios</h3><p>Prueba cuánto se cobraría antes de guardar. Muestra el cálculo paso a paso y no registra entradas ni movimientos.</p></div></article>
      <article><span>04</span><div><h3>Caja y turnos</h3><p>Consulta cierres, diferencias, efectivo retirado y fondo entregado al siguiente turno. Admite jornadas de 24 horas o varios turnos diarios.</p></div></article>
      <article><span>05</span><div><h3>Usuarios y accesos</h3><p>Crea administradores y operadores. Asigna a cada operador una playa concreta y revoca su acceso cuando sea necesario.</p></div></article>
      <article><span>06</span><div><h3>Ingresos y egresos</h3><p>Registra movimientos adicionales, distingue efectivo y transferencia, y conserva el motivo de cada ajuste.</p></div></article>
      <article><span>07</span><div><h3>Reportes</h3><p>Compara recaudación, actividad por hora, medios de pago y movimientos dentro del rango de fechas elegido.</p></div></article>
      <article><span>08</span><div><h3>Varias playas</h3><p>Una misma empresa puede manejar más de una playa. Cada una lleva sus propios tickets, tarifas, caja y usuarios, sin mezclarse entre sí.</p></div></article>
    </div></section>

    <section className="roles-section"><div className="wrap"><div className="section-head compact"><div><p className="kicker"><span/> ACCESO SEGÚN RESPONSABILIDAD</p><h2>Cada persona ve<br/><em>lo que necesita.</em></h2></div><p>Los permisos no dependen de esconder botones: el servidor valida cada acción y cada registro solicitado.</p></div><div className="roles-table"><div className="role-row role-head"><span>Función</span><b>Operador</b><b>Admin</b></div><div className="role-row"><span>Entradas, salidas y cobros</span><b className="yes">Sí</b><b className="yes">Sí</b></div><div className="role-row"><span>Turno y caja propia</span><b className="yes">Sí</b><b className="yes">Sí</b></div><div className="role-row"><span>Tickets por día, semana o mes</span><b className="yes">Sí</b><b className="yes">Sí</b></div><div className="role-row"><span>Tarifas y configuración</span><b>—</b><b className="yes">Sí</b></div><div className="role-row"><span>Usuarios y accesos</span><b>—</b><b className="yes">Sí</b></div><div className="role-row"><span>Reportes e historial completo</span><b>—</b><b className="yes">Sí</b></div><div className="role-row"><span>Todas las playas de la empresa</span><b>Solo la suya</b><b className="yes">Sí</b></div></div></div></section>

    <section className="security wrap"><div className="security-card"><div><p className="kicker light"><span/> SEGURIDAD DE LOS REGISTROS</p><h2>La información de cada empresa,<br/><em>aislada desde la base.</em></h2><p>No alcanza con ocultar una pantalla. El sistema valida la empresa, la playa, el usuario y su rol en cada pedido.</p></div><div className="security-points"><p><b>01</b><span><strong>Aislamiento por empresa y playa</strong>Cada consulta opera dentro del alcance autorizado. Una empresa no ve registros de otra, y una playa tampoco ve los de la playa de al lado.</span></p><p><b>02</b><span><strong>Sesiones revocables</strong>Un cambio de contraseña invalida las sesiones anteriores, incluso cuando lo realiza un administrador.</span></p><p><b>03</b><span><strong>Cobros consistentes</strong>Entrada, salida, movimientos y caja se confirman juntos. Un cierre repetido no vuelve a cobrar.</span></p><p><b>04</b><span><strong>Permisos en tiempo real</strong>Los eventos entre dispositivos también verifican usuario, empresa y playa antes de mostrar información.</span></p></div></div></section>

    <section className="details wrap"><div className="details-copy"><p className="kicker"><span/> COBROS SIN SORPRESAS</p><h2>El sistema explica<br/><em>cada importe.</em></h2><p>Antes de cerrar una estadía se ve el tiempo, la tarifa aplicada, lo que ya fue pagado y lo que falta cobrar.</p><ul><li><b>Anticipos controlados.</b> Cobra o devuelve únicamente la diferencia.</li><li><b>Cortesías registradas.</b> Quedan visibles sin inflar el efectivo.</li><li><b>Cierre transaccional.</b> La salida, el cobro y la caja se guardan juntos.</li></ul></div><div className="calculation"><div className="calc-head"><span><Icon name="plate"/></span><div><small>PATENTE</small><strong>AA 123 BB</strong></div><b>EN LA PLAYA</b></div><div className="calc-time"><div><small>ENTRADA</small><strong>09:42</strong></div><div><small>TIEMPO</small><strong>2 h 18 min</strong></div></div><div className="calc-lines"><p><span>Primer período</span><b>$ 3.000</b></p><p><span>Período adicional</span><b>$ 3.000</b></p><p><span>Anticipo</span><b>− $ 1.000</b></p></div><div className="calc-total"><span>Falta cobrar ahora</span><strong>$ 5.000</strong></div></div></section>

    <section className="pricing wrap"><div className="price-glow"><div className="price-copy"><p className="kicker light"><span/> PLAN COMPLETO</p><h2>Todo incluido.<br/><em>Un precio por playa.</em></h2><p>Sin módulos separados ni costos ocultos. La suscripción incluye el sistema completo y el acompañamiento para empezar a usarlo. El precio es por playa: si tu empresa maneja más de una, cada playa adicional se suma al plan.</p><ul><li><b>✓</b> Tickets por ficha y patente</li><li><b>✓</b> Día, semana y mes además de la hora</li><li><b>✓</b> Tarifas, caja, turnos y reportes</li><li><b>✓</b> Usuarios, roles y accesos</li><li><b>✓</b> Mantenimiento y actualizaciones</li><li><b>✓</b> Capacitación inicial</li></ul></div><div className="price-box"><span>PLAN MENSUAL · POR PLAYA</span><div><small>USD</small><strong>30</strong><i>/mes</i></div><p>≈ $46.050 ARS por mes, por playa</p><em>Referencia al dólar vendedor BNA de $1.535. El equivalente en pesos se actualiza según la cotización vigente.</em><b>Sin costo de instalación<br/>¿Más de una playa? Se cotiza cada una</b></div></div></section>

    <section id="contacto" className="cta wrap"><div><p className="kicker light"><span/> LISTO PARA TU PLAYA</p><h2>Menos explicaciones.<br/><em>Más control.</em></h2><p>Conocé cómo se adapta el sistema a tus tarifas, vehículos y forma de trabajar.</p></div><a className="button dark" href="#sistema">Ver demostración visual <b>↑</b></a></section>
    <footer className="wrap footer"><a className="brand" href="#inicio"><span>ES</span> Estacionamiento</a><p>Software para operar playas de estacionamiento.</p><span>© {new Date().getFullYear()}</span></footer>
  </main>;
}

