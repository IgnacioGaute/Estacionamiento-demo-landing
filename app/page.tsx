import type { ReactNode } from 'react';
import { CONSULTA_WSP, DEMO_WSP, WHATSAPP_VISIBLE } from './contacto';
import { Celular3D, CelularFrente, Notebook3D, NotebookFrente, Tablet3D } from './components/Dispositivos';
import Encabezado from './components/Encabezado';
import { Calendario, Charla, Check, Comprobante, Escudo, Flecha, IconoWhatsApp, SinConexion, Ubicacion } from './components/Iconos';
import Marca from './components/Marca';
import Planes from './components/Planes';
import SpotlightCard from './components/reactbits/SpotlightCard';
import TiltedCard from './components/reactbits/TiltedCard';
import TituloPortada from './components/TituloPortada';
import { guides } from './tutorial-data';
import './landing.css';

const INCLUIDOS: { icono: ReactNode; titulo: string; texto: string }[] = [
  { icono: <Comprobante/>, titulo: 'Comprobantes por QR, WhatsApp o papel', texto: 'En cada entrada y salida. El cliente lo abre en su celular y, si querés copia física, sale por una impresora térmica USB.' },
  { icono: <Calendario/>, titulo: 'Estadías por día, semana o mes', texto: 'Con su propio precio según el tipo de vehículo. Se cobran al ingresar y entran en la caja como cualquier otro cobro.' },
  { icono: <SinConexion/>, titulo: 'Sigue andando sin internet', texto: 'Si se corta la conexión, seguís registrando entradas y salidas. Todo se sincroniza cuando vuelve.' },
  { icono: <Escudo/>, titulo: 'Cada persona ve lo que le toca', texto: 'El operador cobra; el administrador configura. Los permisos se validan en el servidor, no solo escondiendo botones.' },
  { icono: <Ubicacion/>, titulo: 'Una o varias playas', texto: 'Cada playa con sus precios, su caja y su equipo, sin mezclar movimientos. Las administrás desde un mismo lugar.' },
  { icono: <Charla/>, titulo: 'Asistente incluido', texto: 'Explica cada pantalla y responde con los datos de tu playa. Es solo de lectura: no cobra ni modifica nada.' },
];

const PREGUNTAS = [
  { pregunta: '¿Qué necesito para empezar?', respuesta: 'Nada que no tengas. Funciona en la computadora del mostrador o en el celular, con el navegador que ya usás: no hay que comprar equipos ni instalar programas. Para tickets con código de barras alcanza con un lector USB común.' },
  { pregunta: '¿Y si se corta internet?', respuesta: 'En un equipo donde ya abriste el sistema, seguís registrando entradas y salidas sin conexión. Los movimientos se guardan ahí y se sincronizan cuando vuelve internet. El cobro con QR de Mercado Pago sí necesita conexión.' },
  { pregunta: '¿Puedo darme de baja cuando quiera?', respuesta: 'Sí. No hay permanencia ni multa: avisás y el mes siguiente no se cobra. Los datos de tu playa son tuyos; si te vas, te los exporto.' },
  { pregunta: '¿Cuánto tarda en funcionar?', respuesta: 'El mismo día. Lo que lleva tiempo es cargar bien tus tarifas y tus tipos de vehículo, y eso lo hacemos juntos por videollamada o en la playa.' },
];

const Puntos = ({ items }: { items: string[] }) => (
  <ul className="puntos">
    {items.map(item => <li key={item}><Check/><span>{item}</span></li>)}
  </ul>
);

export default function Home() {
  return <>
    <Encabezado/>
    <main>
      <section id="inicio" className="contenedor portada">
        <p className="portada__pastilla">Playas por hora y cocheras mensuales</p>
        <TituloPortada/>
        <p className="portada__bajada">Registrá entradas y salidas, cobrá la tarifa correcta y seguí cada movimiento de caja con el nombre de quien lo hizo.</p>
        <div className="portada__acciones">
          <a className="boton boton--oscuro" href={DEMO_WSP} target="_blank" rel="noopener noreferrer"><IconoWhatsApp/>Pedir una demo</a>
          <a className="boton boton--linea" href="#sistema">Ver el sistema</a>
        </div>
        <ul className="portada__confianza">
          <li><Check/>Funciona en celular o PC</li>
          <li><Check/>Sin instalación</li>
          <li><Check/>Una o varias playas</li>
        </ul>
      </section>

      <div className="contenedor">
        <div className="escenario">
          <div className="escenario__notebook">
            <NotebookFrente src="/screens/operacion-desktop.png" alt="Pantalla de entradas y salidas del sistema, en una notebook"/>
          </div>
          <div className="escenario__celular">
            <CelularFrente src="/screens/operacion-mobile.png" alt="La misma pantalla en un celular"/>
          </div>
        </div>
      </div>

      <section id="sistema" className="contenedor seccion">
        <div className="seccion__cabeza">
          <div className="seccion__titulo">
            <p className="etiqueta">El sistema</p>
            <h2 className="titulo-2">Rápido cuando operás. Completo cuando administrás.</h2>
          </div>
          <p className="seccion__bajada">El operador registra y cobra desde el celular o la computadora del mostrador. El administrador configura precios, revisa la caja y sigue cada playa desde el mismo lugar.</p>
        </div>

        <div className="filas">
          <article className="fila">
            <div className="fila__texto">
              <p className="fila__tema">Operación</p>
              <h3>Entrada y cobro, en dos pasos</h3>
              <p>Por patente o con ficha física. El primer registro abre la estadía y el siguiente lleva al cobro, con el importe ya calculado.</p>
              <Puntos items={[
                'El buscador encuentra la patente aunque esté mal escrita',
                'Con la cámara del celular, la patente se escribe sola',
                'Efectivo, transferencia o QR de Mercado Pago, que se verifica solo',
              ]}/>
            </div>
            <TiltedCard className="fila__equipo fila__equipo--celular" innerClassName="rig-celular"
              baseRotateX={6} baseRotateY={-20} baseRotateZ={1} perspective={1400}>
              <Celular3D src="/screens/activos-mobile.png" alt="Lista de vehículos activos en el celular"/>
            </TiltedCard>
          </article>

          <article className="fila fila--invertida">
            <div className="fila__texto">
              <p className="fila__tema">Tarifas</p>
              <h3>Cobrá como trabaja tu playa</h3>
              <p>Precios por duración o por período iniciado, con valores distintos de día y de noche. También por día, semana o mes.</p>
              <Puntos items={[
                'Cada ingreso guarda sus precios: cambiar una tarifa no afecta a los autos que ya entraron',
                'Simulador para probar el cálculo antes de aplicarlo',
                'Si el precio cambia mientras confirmás, el cierre se frena y muestra el nuevo importe',
              ]}/>
            </div>
            <TiltedCard className="fila__equipo" innerClassName="rig-notebook"
              baseRotateX={-13} baseRotateY={16} perspective={3600}>
              <Notebook3D src="/screens/tarifas-desktop.png" alt="Lista de precios por duración para autos: hasta 15 minutos, 45 minutos, 1 hora, 2 horas y 1 día"/>
            </TiltedCard>
          </article>

          <article className="fila">
            <div className="fila__texto">
              <p className="fila__tema">Caja y turnos</p>
              <h3>La caja cierra, turno por turno</h3>
              <p>Uno, tres o los turnos que necesites. Con qué abrió, cuánto se esperaba, cuánto se contó y qué se entregó al siguiente operador.</p>
              <Puntos items={[
                'Cada cierre con el nombre del operador y si la caja dio bien',
                'Ingresos y gastos del día en la misma caja',
                'Planilla diaria en PDF, lista para imprimir',
              ]}/>
            </div>
            <TiltedCard className="fila__equipo fila__equipo--tablet" innerClassName="rig-tablet"
              baseRotateX={8} baseRotateY={-20} perspective={1600}>
              <Tablet3D src="/screens/turnos-tablet.png" alt="Historial de turnos: cada cierre con el operador, lo contado y lo entregado"/>
            </TiltedCard>
          </article>
        </div>
      </section>

      <section className="contenedor seccion">
        <div className="seccion__cabeza">
          <div className="seccion__titulo">
            <p className="etiqueta">Incluido en todos los planes</p>
            <h2 className="titulo-2">Todo lo demás, sin módulos extra.</h2>
          </div>
        </div>
        <div className="incluidos">
          {INCLUIDOS.map(({ icono, titulo, texto }) => (
            <SpotlightCard key={titulo} className="incluido" spotlightColor="rgba(255, 201, 28, 0.32)">
              <span className="incluido__icono">{icono}</span>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      <section id="cocheras" className="contenedor seccion">
        <div className="modulo">
          <div className="modulo__intro">
            <p className="etiqueta">Módulo opcional</p>
            <h2>Cocheras mensuales, en orden.</h2>
            <p>Cada inquilino con su cochera, sus recibos y su cuenta. El abono mensual se lleva aparte de los tickets de rotación.</p>
          </div>
          <ul className="modulo__lista">
            <li><strong>Quién ocupa cada cochera</strong><span>Inquilino, patente, cochera asignada y abono mensual en un solo lugar.</span></li>
            <li><strong>Cuenta corriente</strong><span>Cargos de cada mes, pagos parciales y saldo pendiente o a favor.</span></li>
            <li><strong>Recibos de pago</strong><span>Por WhatsApp, QR o impresos. También se pueden cobrar con QR de Mercado Pago.</span></li>
          </ul>
        </div>
      </section>

      <section className="caso">
        <div className="contenedor caso__contenido">
          <p className="etiqueta">Andando hoy</p>
          <p className="caso__texto">En Garage Mitre todo se hacía a mano: anotar cada auto, sacar la cuenta del tiempo, cobrar y después lograr que el día cerrara. Hoy el operador registra la entrada y la salida, y el resto sale solo: el precio, el cobro, la caja del turno y el historial.</p>
          <p className="caso__firma"><strong>Garage Mitre</strong> · Mendoza</p>
        </div>
      </section>

      <section id="planes" className="contenedor seccion planes">
        <div className="planes__cabeza">
          <p className="etiqueta">Planes</p>
          <h2 className="titulo-2">Precios simples. Sin contar las salidas.</h2>
          <p>El plan depende de cuántos vehículos de rotación tenés estacionados al mismo tiempo, no de cuántos entran por día.</p>
        </div>
        <Planes/>
        <div className="planes__notas">
          <div>
            <h3>¿Qué cuenta como «a la vez»?</h3>
            <p>Los vehículos de rotación que están dentro de la playa en ese momento. Los mensuales no cuentan, y si un día superás el rango seguís registrando normalmente.</p>
          </div>
          <div>
            <h3>¿Tenés más de una playa?</h3>
            <p>Cada playa adicional paga un 30% menos que su plan, sin negociar.</p>
          </div>
          <div>
            <h3>En todos los planes</h3>
            <p>Puesta en marcha sin costo, soporte directo por WhatsApp, asistente incluido y sin permanencia.</p>
          </div>
        </div>
      </section>

      <section className="contenedor seccion">
        <div className="guias">
          <div className="guias__texto">
            <p className="fila__tema">Guías en video</p>
            <h2>Miralo en acción antes de probarlo.</h2>
            <p>Seis recorridos narrados paso a paso sobre el sistema real: entrada, cobro, tarifas, caja, inquilinos y administración.</p>
            <a className="boton boton--linea" href="/aprender">Ver las guías<Flecha/></a>
          </div>
          <div className="guias__miniaturas">
            {guides.slice(0, 3).map(guia => (
              <a key={guia.number} href="/aprender">
                <img src={`/video-posters/${guia.poster}.jpg`} alt="" loading="lazy"/>
                <span>{guia.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="preguntas" className="contenedor seccion">
        <div className="seccion__titulo preguntas__titulo">
          <p className="etiqueta">Preguntas frecuentes</p>
          <h2 className="titulo-2">Antes de que me escribas.</h2>
        </div>
        <div className="preguntas">
          {PREGUNTAS.map(({ pregunta, respuesta }) => (
            <div key={pregunta}><h3>{pregunta}</h3><p>{respuesta}</p></div>
          ))}
        </div>
      </section>

      <section id="demo" className="contenedor cierre">
        <div className="cierre__tarjeta">
          <div className="cierre__demo">
            <p className="etiqueta">Demo sin compromiso</p>
            <h2 className="titulo-2">Hablemos de tu playa.</h2>
            <p>Te muestro el sistema con un ejemplo armado con tus precios: registramos una entrada, simulamos el cobro y vemos cómo queda en la caja.</p>
            <a className="boton boton--acento" href={DEMO_WSP} target="_blank" rel="noopener noreferrer"><IconoWhatsApp/>Pedir una demo por WhatsApp</a>
            <ol className="pasos">
              <li><span className="pasos__numero">01</span><strong>Cargamos tus tarifas</strong><span>Vehículos, horarios y precios.</span></li>
              <li><span className="pasos__numero">02</span><strong>Registrás una entrada</strong><span>Por patente o con ficha.</span></li>
              <li><span className="pasos__numero">03</span><strong>Cobrás y controlás</strong><span>El cobro queda en la caja.</span></li>
            </ol>
          </div>
          <div className="cierre__autor">
            <div className="autor">
              <span className="autor__iniciales" aria-hidden="true">IG</span>
              <div><strong>Ignacio Gaute</strong><span>Creador del sistema · Mendoza</span></div>
            </div>
            <p>Diseñé y desarrollé el sistema conociendo desde adentro cómo trabaja una playa familiar. Si tenés una duda, me escribís por WhatsApp y te respondo yo, sin mesa de ayuda ni tickets de soporte.</p>
            <a href={CONSULTA_WSP} target="_blank" rel="noopener noreferrer">WhatsApp {WHATSAPP_VISIBLE}</a>
          </div>
        </div>
      </section>
    </main>

    <footer className="pie">
      <div className="contenedor pie__contenido">
        <div className="pie__arriba">
          <div className="pie__marca">
            <a className="marca" href="#inicio"><Marca id="marca-pie"/><span>Estacionamiento</span></a>
            <p>Entradas, cobros y caja en un solo lugar. Hecho en Mendoza para el trabajo real de una playa.</p>
          </div>
          <div className="pie__columnas">
            <nav className="pie__columna" aria-label="Pie">
              <strong>Producto</strong>
              <a href="#sistema">Sistema</a>
              <a href="#planes">Planes</a>
              <a href="/aprender">Guías</a>
              <a href="#preguntas">Preguntas</a>
            </nav>
            <div className="pie__columna">
              <strong>Contacto</strong>
              <a href={CONSULTA_WSP} target="_blank" rel="noopener noreferrer">WhatsApp {WHATSAPP_VISIBLE}</a>
              <span>Mendoza, Argentina</span>
            </div>
          </div>
        </div>
        <div className="pie__abajo">
          <span>© {new Date().getFullYear()} Estacionamiento</span>
          <span>Desarrollado por Ignacio Gaute · Mendoza, Argentina</span>
        </div>
      </div>
    </footer>
  </>;
}
