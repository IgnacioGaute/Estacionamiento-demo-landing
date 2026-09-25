'use client';

import { useEffect, useRef, useState } from 'react';

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
    <article className="bento"><span className="icon"><Icon name="plate" /></span><p className="eyebrow">CÁMARA DEL CELULAR</p><h3>Sacale una foto y la patente se escribe sola</h3><p>El operador encuadra la chapa desde el celular y el sistema la lee. La muestra para revisar antes de confirmar: si salió movida, se corrige a mano.</p><div className="plate-demo"><span className="plate-demo__foto"><b/></span><span className="plate-demo__flecha">→</span><span className="plate-demo__patente">AA 123 BB</span></div></article>
  </div>;
}

// +54 9 261 485-9172. wa.me pide el número sin +, sin 0 y sin el 15: 549 + área + abonado.
const WSP = 'https://wa.me/5492614859172?text=' + encodeURIComponent(
  'Hola, vi la página del sistema para playas de estacionamiento y quiero saber más.',
);

/**
 * La marca del sistema: la misma "M" de barreras que usa la app (ParkingMark),
 * sobre la placa oscura para que se lea igual en el fondo claro del nav y en el
 * pie. El id del degradado se repite en la página, así que se declara una vez
 * acá y se reusa — dos <defs> con el mismo id no rompen nada, pero no hace falta.
 */
const Marca = () => (
  <span className="brand-mark" aria-hidden="true">
    <svg viewBox="0 0 84 72" fill="none">
      <defs>
        <linearGradient id="marca-grad" x1="0" y1="0" x2="84" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--yellow)"/>
          <stop offset="1" stopColor="var(--orange)"/>
        </linearGradient>
      </defs>
      <path d="M4 68 V10 L26 40 L42 8 L58 40 L80 10 V68" stroke="url(#marca-grad)" strokeWidth={10} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  </span>
);

/**
 * La captura del sistema andando en Garage Mitre. Mientras el archivo no esté en
 * /public, muestra el hueco marcado en vez de una imagen rota: es preferible un
 * cartel que diga que falta, a que el visitante vea el ícono de imagen caída.
 */
function CapturaCaso() {
  const img = useRef<HTMLImageElement>(null);
  const [falla, setFalla] = useState(false);

  // `onError` solo alcanza si la imagen falla DESPUÉS de hidratar. En la primera
  // carga el navegador ya intentó bajarla con el HTML del servidor, así que el
  // evento pasó antes de que React estuviera escuchando: hay que preguntarle al
  // elemento si quedó sin dibujar (complete + naturalWidth 0).
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFalla(true);
  }, []);

  if (falla) {
    return (
      <div className="caso-foto caso-foto--vacia">
        <span className="caso-foto__falta">
          FALTA LA CAPTURA<br/>
          <b>La pantalla de Garage Mitre andando</b><br/>
          Guardala como <code>/public/caso-garage-mitre.png</code>
        </span>
      </div>
    );
  }
  return (
    <div className="caso-foto">
      <img ref={img} src="/caso-garage-mitre.png" alt="El sistema funcionando en Garage Mitre: registro de estacionamiento con el ticket escaneado, la salida registrada y el precio calculado" onError={() => setFalla(true)}/>
    </div>
  );
}

const IconoWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z"/>
    <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.82 9.82 0 0 0 4.7 1.2h.01c5.43 0 9.85-4.42 9.85-9.86 0-2.63-1.02-5.1-2.88-6.96A9.78 9.78 0 0 0 12.04 2Zm0 17.94h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.16 8.16 0 0 1-1.25-4.36c0-4.52 3.68-8.19 8.2-8.19 2.19 0 4.25.86 5.8 2.4a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.19-8.2 8.19Z"/>
  </svg>
);

export default function Home() {
  return <main>
    <nav className="nav wrap"><a className="brand" href="#inicio"><Marca /> <span className="brand-nombre">Estacionamiento</span></a><div className="nav-links"><a href="#sistema">Sistema</a><a href="#funciones">Funciones</a><a href="#inquilinos">Inquilinos</a><a href="#planes">Planes</a></div></nav>

    <section id="inicio" className="hero wrap">
      <div className="hero-copy"><p className="kicker"><span/> HECHO PARA PLAYAS DE ESTACIONAMIENTO</p><h1>Sabé cuánto entró<br/><em>en cada turno.</em></h1><p className="hero-text">El sistema calcula la tarifa, realiza cierre de caja , saldo  inicial del dia siguiente y responsable de cada movimiento.</p><div className="hero-actions"><a className="button primary" href={WSP} target="_blank" rel="noopener noreferrer"><IconoWhatsApp /> Escribime por WhatsApp</a><a className="button ghost" href="#sistema">Ver el sistema</a></div><div className="trust"><span><b>✓</b> No hay que comprar nada</span><span><b>✓</b> Funciona en celular</span><span><b>✓</b> Una o varias playas</span></div></div>
      <div className="hero-visual d3-rig d3-rig--hero">
        <div className="d3-rig__orb"/>
        <Notebook src="/screens/operacion-desktop.png" alt="Pantalla de tickets y patentes del sistema, en una notebook"/>
        <Celular src="/screens/operacion-mobile.png" alt="La misma pantalla de tickets en un celular"/>
        <div className="floating-stat"><span><Icon name="car"/></span><div><strong>Responsive</strong><small>La misma operación en cada pantalla</small></div></div>
      </div>
    </section>

    <section className="proof"><div className="wrap proof-row"><p>UNA OPERACIÓN, DE PRINCIPIO A FIN</p><div><strong>01</strong><span>Registrá<br/>la entrada</span></div><i/><div><strong>02</strong><span>El sistema<br/>calcula</span></div><i/><div><strong>03</strong><span>Cobrá y<br/>cerrá</span></div></div></section>

    <section id="sistema" className="showcase wrap"><div className="section-head"><div><p className="kicker"><span/> SE ADAPTA AL TRABAJO REAL</p><h2>Grande cuando administrás.<br/><em>Rápido cuando operás.</em></h2></div><p>La notebook muestra el espacio completo de trabajo, con teclado y trackpad. En el celular, el sistema ocupa toda la pantalla y deja las acciones importantes al alcance del pulgar.</p></div><div className="d3-rig d3-rig--panel"><Notebook src="/screens/tarifas-desktop.png" alt="Pantalla de precios por duración, con las franjas de tarifa cargadas"/><Celular src="/screens/activos-mobile.png" alt="Lista de vehículos activos en el celular"/><div className="device-note"><b>100%</b><span>adaptado<br/>a mobile</span></div></div></section>

    <section className="caso wrap">
      <CapturaCaso />
      <div className="caso-texto">
        <p className="kicker"><span/> ANDANDO HOY</p>
        <h2>CLIENTES QUE YA USAN <br/><em>EL SISTEMA.</em></h2>
        <p className="caso-texto__cuerpo">En Garage Mitre todo esto se llevaba a mano: anotar cada auto, sacar la cuenta del tiempo, cobrar y después tratar de que el día cerrara. Hoy el operador registra la entrada y la salida, y de ahí sale todo lo demás solo — el precio, el cobro, la caja del turno y el histórico. Todo automático, sin error humano</p>
        <p className="caso-firma"><b>Garage Mitre</b> · Mendoza</p>
      </div>
    </section>

    <section id="funciones" className="features"><div className="wrap"><div className="section-head compact"><div><p className="kicker"><span/> TODO LO QUE NECESITÁS</p><h2>Potente por dentro.<br/><em>Claro por fuera.</em></h2></div></div><BentoGlow/></div></section>

    <section className="comp wrap">
      <div className="section-head compact">
        <div>
          <p className="kicker"><span/> COMPROBANTES</p>
          <h2>Un comprobante al entrar<br/><em>y otro al salir.</em></h2>
        </div>
        <p>Se genera solo al registrar el movimiento, con la patente, los horarios, la tarifa aplicada y el importe. Elegís cómo entregarlo — o combinás varias.</p>
      </div>
      <div className="comp-grid">
        <article><b>01</b><div><h3>QR en pantalla</h3><p>El cliente lo escanea con su celular y ve el comprobante. No hace falta pedirle ningún dato ni comprar nada.</p></div></article>
        <article><b>02</b><div><h3>Enlace por WhatsApp</h3><p>Tocás el botón y se abre el chat del cliente con el mensaje y el enlace ya escritos, desde el WhatsApp de la empresa. No hay que buscar el contacto ni copiar nada: solo enviar.</p></div></article>
        <article><b>03</b><div><h3>Impresora por USB <span className="comp-hw">Requiere impresora</span></h3><p>Imprimís desde la computadora del mostrador conectada a una impresora térmica.</p></div></article>
        <article><b>04</b><div><h3>Impresora por Bluetooth <span className="comp-hw comp-hw--pend">Próximamente</span></h3><p>Imprimir desde el celular, automáticamente al registrar la entrada o la salida. Requiere impresora y depende del equipo: estamos confirmando con cuáles funciona y en qué teléfonos.</p></div></article>
      </div>
      <p className="comp-nota"><b>La impresora se compra aparte.</b> No está incluida en la suscripción, ni la de USB ni la de Bluetooth. Decime cómo trabaja tu playa y te recomiendo cuál conviene: son equipos comunes y no hacen falta modelos caros.</p>
    </section>

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

    <section id="inquilinos" className="admin-section wrap">
      <div className="section-head">
        <div>
          <p className="kicker"><span/> COCHERAS MENSUALES</p>
          <h2>Quién alquila,<br/>cuánto paga<br/><em>y quién debe.</em></h2>
        </div>
        <p>Los abonados no se cobran por hora ni entran en la caja del día como una estadía. Llevan su propia ficha, su recibo numerado y su cuenta corriente: en qué mes quedaron, cuánto pagaron y cuánto falta.</p>
      </div>
      <div className="admin-grid">
        <article><span>01</span><div><h3>La ficha del inquilino</h3><p>Nombre, teléfono, número de cliente y desde cuándo alquila. Más las observaciones que quieras dejarle anotadas para acordarte de lo que arreglaron.</p></div></article>
        <article><span>02</span><div><h3>Su cochera y su patente</h3><p>Número de cochera, patente del vehículo e importe mensual. Un mismo inquilino puede tener más de una cochera, cada una con lo suyo.</p></div></article>
        <article><span>03</span><div><h3>Precios por tipo</h3><p>Creás tipos de inquilino con su precio y se lo asignás a cada uno. Cuando sube el valor del mes, cambiás el tipo y no ficha por ficha.</p></div></article>
        <article><span>04</span><div><h3>Recibos numerados</h3><p>Cada recibo lleva su número correlativo y la fecha del período. Generás los del mes de una vez para todos los abonados, no uno por uno.</p></div></article>
        <article><span>05</span><div><h3>Se cobra con el mismo lector</h3><p>El recibo lleva código de barras. El operador lo pasa por el mismo lector con el que escanea los tickets y el sistema abre directo ese recibo para cobrarlo.</p></div></article>
        <article><span>06</span><div><h3>Pagos parciales y a cuenta</h3><p>Si el cliente paga una parte, se registra contra ese recibo con su importe, su fecha y su medio de pago. El recibo sigue pendiente hasta que se completa, y queda el detalle de cada entrega.</p></div></article>
        <article><span>07</span><div><h3>La deuda, mes por mes</h3><p>La ficha del cliente lista qué meses quedaron adeudados y por cuánto, no un total suelto. Al abrirla ves de dónde viene la deuda y desde cuándo.</p></div></article>
        <article><span>08</span><div><h3>Saldo a favor</h3><p>Si un cliente pagó de más o adelantó un mes, queda registrado a su favor y se descuenta del próximo recibo en lugar de perderse en una anotación aparte.</p></div></article>
      </div>
      <p className="comp-nota"><b>Solo el efectivo entra a la caja del día.</b> Un recibo cobrado por transferencia o cheque queda registrado igual, con su medio y su fecha, pero no infla el arqueo del turno. Así el efectivo que contás al cerrar es el que tenés en el cajón.</p>
    </section>

    <section className="roles-section"><div className="wrap"><div className="section-head compact"><div><p className="kicker"><span/> ACCESO SEGÚN RESPONSABILIDAD</p><h2>Cada persona ve<br/><em>lo que necesita.</em></h2></div><p>Los permisos no dependen de esconder botones: el servidor valida cada acción y cada registro solicitado.</p></div><div className="roles-table"><div className="role-row role-head"><span>Función</span><b>Operador</b><b>Admin</b></div><div className="role-row"><span>Entradas, salidas y cobros</span><b className="yes">Sí</b><b className="yes">Sí</b></div><div className="role-row"><span>Turno y caja propia</span><b className="yes">Sí</b><b className="yes">Sí</b></div><div className="role-row"><span>Tickets por día, semana o mes</span><b className="yes">Sí</b><b className="yes">Sí</b></div><div className="role-row"><span>Tarifas y configuración</span><b>—</b><b className="yes">Sí</b></div><div className="role-row"><span>Usuarios y accesos</span><b>—</b><b className="yes">Sí</b></div><div className="role-row"><span>Reportes e historial completo</span><b>—</b><b className="yes">Sí</b></div><div className="role-row"><span>Todas las playas de la empresa</span><b>Solo la suya</b><b className="yes">Sí</b></div></div></div></section>

    <section className="security wrap"><div className="security-card"><div><p className="kicker light"><span/> LO QUE EL EMPLEADO NO PUEDE HACER</p><h2>Vos ponés las reglas.<br/><em>El sistema las hace cumplir.</em></h2><p>No es que los botones estén escondidos: aunque alguien sepa por dónde entrar, el sistema no lo deja. Estas cuatro cosas son las que más tranquilidad te van a dar.</p></div><div className="security-points"><p><b>01</b><span><strong>No puede tocar las tarifas</strong>El operador cobra lo que el sistema calcula. No puede cambiar un precio, ni ver la configuración, ni aplicar un importe a mano sin que quede registrado.</span></p><p><b>02</b><span><strong>No se puede borrar un movimiento de caja</strong>Lo que se cobró, quedó. Si hubo un error, se corrige con un ajuste que lleva el motivo escrito y el nombre de quien lo hizo. El número original nunca desaparece.</span></p><p><b>03</b><span><strong>Si un empleado es despedido, queda afuera al instante</strong>Le cambiás la contraseña o le das de baja el usuario y se cierran todas sus sesiones, en todos los dispositivos, aunque haya dejado el celular con el sistema abierto.</span></p><p><b>04</b><span><strong>Cada playa ve lo suyo y nada más</strong>Si tenés dos playas, el operador de una no ve los tickets, la caja ni los turnos de la otra. Vos las ves todas.</span></p></div></div></section>

    <section className="ia wrap">
      <div className="ia-card">
        <div className="ia-copy">
          <p className="kicker"><span/> ASISTENTE INCLUIDO</p>
          <h2>Preguntale al sistema.</h2>
          <p>Un asistente en cada pantalla. Explica cómo funciona cada sección y consulta los datos de tu playa para responder con números reales.</p>
          <p className="ia-limite">Solo lectura: no cobra, no modifica tarifas ni cierra turnos. Cada persona ve únicamente lo que su rol permite.</p>
        </div>
        <div className="ia-chat">
          <div className="ia-chat__barra"><Marca /><span>Asistente</span><i/></div>
          <div className="ia-chat__hilo" aria-hidden="true">
            <div className="ia-burbuja ia-burbuja--vos">¿Cómo cambio el precio de la hora?</div>
            <div className="ia-burbuja ia-burbuja--ia">Administración → Tickets, pestaña <b>«Precios por duración»</b>. Abrí el menú <b>…</b> de la franja y tocá <b>Editar</b>.</div>
            <div className="ia-burbuja ia-burbuja--vos">¿Y si la cambio con autos adentro?</div>
            <div className="ia-burbuja ia-burbuja--ia">Cada auto guarda los precios de cuando entró: al que ya está se le cobra la tarifa vieja. La nueva rige para los que entren después.</div>
            <div className="ia-burbuja ia-burbuja--vos">¿Cuánto efectivo debería haber en la caja?</div>
            <div className="ia-burbuja ia-burbuja--ia">Fondo inicial $30.000 más $56.400 cobrados desde que abrió el turno: <b>$86.400</b>.</div>
          </div>
        </div>
      </div>
    </section>

    <section className="details wrap"><div className="details-copy"><p className="kicker"><span/> COBROS SIN SORPRESAS</p><h2>El sistema explica<br/><em>cada importe.</em></h2><p>Antes de cerrar una estadía se ve el tiempo, la tarifa aplicada, lo que ya fue pagado y lo que falta cobrar.</p><ul><li><b>Anticipos controlados.</b> Cobra o devuelve únicamente la diferencia.</li><li><b>Cortesías registradas.</b> Quedan visibles sin inflar el efectivo.</li><li><b>Cierre transaccional.</b> La salida, el cobro y la caja se guardan juntos.</li></ul></div><div className="calculation"><div className="calc-head"><span><Icon name="plate"/></span><div><small>PATENTE</small><strong>AA 123 BB</strong></div><b>EN LA PLAYA</b></div><div className="calc-time"><div><small>ENTRADA</small><strong>09:42</strong></div><div><small>TIEMPO</small><strong>2 h 18 min</strong></div></div><div className="calc-lines"><p><span>Primer período</span><b>$ 3.000</b></p><p><span>Período adicional</span><b>$ 3.000</b></p><p><span>Anticipo</span><b>− $ 1.000</b></p></div><div className="calc-total"><span>Falta cobrar ahora</span><strong>$ 5.000</strong></div></div></section>

<section id="planes" className="pricing wrap">
  <div className="price-glow">
    <div className="price-head">
      <p className="kicker light"><span/> PLANES Y MODULOS</p>
      <h2>Elegí las funciones que tu playa necesita.<br/><em>Pagás por el tamaño y módulo.</em></h2>
      <p>Todos los planes incluyen el sistema base de rotación y tickets. Si además administrás alquileres fijos, podés sumar el módulo de gestión de mensuales.</p>
    </div>

    <div className="plan-grid">
      {/* Plan Chica */}
      <article className="plan">
        <p className="plan__nombre">Playa Chica</p>
        <p className="plan__tamano">Hasta 50 lugares</p>
        <div className="plan__opcion">
          <small>Solo Tickets / Rotación</small>
          <p className="plan__pesos">$46.000<span>/mes</span></p>
          <p className="plan__usd">USD 30 por mes</p>
        </div>
        <hr className="plan__divider" />
        <div className="plan__opcion plan__opcion--full">
          <small>+ Módulo Alquileres Mensuales</small>
          <p className="plan__pesos">$69.000<span>/mes</span></p>
          <p className="plan__usd">USD 45 por mes</p>
        </div>
      </article>

      {/* Plan Mediana */}
      <article className="plan plan--destacado">
        <span className="plan__tag">Más elegido</span>
        <p className="plan__nombre">Playa Mediana</p>
        <p className="plan__tamano">51 a 120 lugares</p>
        <div className="plan__opcion">
          <small>Solo Tickets / Rotación</small>
          <p className="plan__pesos">$69.000<span>/mes</span></p>
          <p className="plan__usd">USD 45 por mes</p>
        </div>
        <hr className="plan__divider" />
        <div className="plan__opcion plan__opcion--full">
          <small>+ Módulo Alquileres Mensuales</small>
          <p className="plan__pesos">$92.000<span>/mes</span></p>
          <p className="plan__usd">USD 60 por mes</p>
        </div>
      </article>

      {/* Plan Grande */}
      <article className="plan">
        <p className="plan__nombre">Playa Grande</p>
        <p className="plan__tamano">Más de 120 lugares</p>
        <div className="plan__opcion">
          <small>Solo Tickets / Rotación</small>
          <p className="plan__pesos">$107.000<span>/mes</span></p>
          <p className="plan__usd">USD 70 por mes</p>
        </div>
        <hr className="plan__divider" />
        <div className="plan__opcion plan__opcion--full">
          <small>+ Módulo Alquileres Mensuales</small>
          <p className="plan__pesos">$138.000<span>/mes</span></p>
          <p className="plan__usd">USD 90 por mes</p>
        </div>
      </article>
    </div>

    <p className="plan-extra">
      <b>¿Tenés más de una playa?</b> Cada playa adicional paga <b>30% menos</b> que su plan, sin preguntar ni negociar.
    </p>

    <p className="plan-nota">
      Los valores en pesos son una referencia al dólar vendedor BNA de $1.535 y se actualizan según la cotización vigente.
    </p>

    <div className="plan-incluido">
      <p className="plan-incluido__titulo">¿Qué incluye cada modalidad?</p>
      <ul>
        <li><b>✓ Plan Base (Tickets y Rotación):</b> Entradas/salidas, cálculo de tarifas, cobros por hora/fracción, lectura de patentes, control de caja de turnos, comprobantes por QR/WhatsApp/USB y reportes.</li>
        <li><b>✓ Módulo Mensuales (Adicional):</b> Registro completo de clientes fijos, control de pagos mensuales y vencimientos, resúmenes históricos de pagos por cliente e integración a la caja.</li>
        <li><b>✓ En todos los casos:</b> Asistente IA incluido, puesta en marcha sin costo, soporte directo por WhatsApp y sin contrato de permanencia.</li>
      </ul>
    </div>

    <p className="plan-aparte">
      <b>¿Necesitás que funcione distinto?</b> El abono es el sistema tal como está. Si tu playa necesita una adaptación a medida, se cotiza aparte y se paga una sola vez.
    </p>
  </div>
</section>

    <section className="faq wrap">
      <div className="section-head compact"><div><p className="kicker"><span/> LO QUE TODOS PREGUNTAN</p><h2>Antes de que<br/><em>me escribas.</em></h2></div><p>Las cuatro dudas que aparecen siempre, contestadas sin vueltas.</p></div>
      <div className="faq-grid">
        <article><h3>¿Qué necesito para empezar?</h3><p>Nada que no tengas. Funciona en la computadora del mostrador o en el celular, con el navegador que ya usás. No hay que comprar equipos, ni instalar programas, ni contratar internet aparte. Si querés usar tickets con código de barras, alcanza con un lector común por USB.</p></article>
        <article><h3>¿Y si se corta internet?</h3><p>El sistema necesita conexión para trabajar. Lo que sí te garantizo es que <b>nada de lo ya registrado se pierde</b> — está guardado en el servidor, no en la computadora del mostrador. Cuando vuelve la conexión seguís donde estabas, sin recargar nada a mano. Si el corte es largo, se anota en papel y se carga después.</p></article>
        <article><h3>¿Puedo darme de baja cuando quiera?</h3><p>Sí. No hay permanencia ni multa por irte. Avisás y el mes siguiente no se cobra. Los datos de tu playa son tuyos: si te vas, te los exporto.</p></article>
        <article><h3>¿Cuánto tarda en funcionar?</h3><p>El mismo día. Lo que lleva tiempo no es instalarlo, es cargar bien tus tarifas y tus tipos de vehículo — y eso lo hacemos juntos en una videollamada o yendo a la playa. Al terminar ya podés registrar la primera entrada.</p></article>
      </div>
    </section>

    <section className="autor wrap">
      <div className="autor-marca"><Marca /></div>
      <div>
        <p className="kicker"><span/> QUIÉN ESTÁ DETRÁS</p>
        <h3>DESARROLLADOR  A TU SERVICIO</h3>
        <p>Soy Ignacio Gaute, de Mendoza. Este sistema esta diseñado  y desarrollado por mi, conociendo el funcionamiento desde adentro de una playa familiar. Cuando tenes una duda me escribis al WhatsApp , te soluciono lo que necesites sin mesa de ayuda impersonal ni Ticket de soporte. La solución está a tu alcance.</p>
      </div>
    </section>

    <section id="contacto" className="cta wrap"><div><p className="kicker light"><span/> LISTO PARA TU PLAYA</p><h2>Menos explicaciones.<br/><em>Más control.</em></h2><p>Escribime y lo vemos funcionando con tus tarifas y tus vehículos. Contesto yo, que soy el que lo hizo.</p></div><a className="button dark wsp-cta" href={WSP} target="_blank" rel="noopener noreferrer"><IconoWhatsApp /> Escribime por WhatsApp</a></section>
    <footer className="wrap footer"><a className="brand" href="#inicio"><Marca /> <span className="brand-nombre">Estacionamiento</span></a><p>Software para operar playas de estacionamiento.</p><a className="footer-wsp" href={WSP} target="_blank" rel="noopener noreferrer"><IconoWhatsApp /> 261 485-9172</a><span>© {new Date().getFullYear()}</span></footer>

    {/* Botón flotante: la página se lee de arriba abajo y el contacto tiene que estar
        siempre a un toque, no solo al final. */}
    <a className="wsp-flotante" href={WSP} target="_blank" rel="noopener noreferrer" aria-label="Escribinos por WhatsApp al 261 485-9172">
      <IconoWhatsApp />
      <span>Escribinos</span>
    </a>
  </main>;
}

