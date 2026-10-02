import { DEMO_WSP } from '../contacto';
import Marca from './Marca';

/**
 * Barra de arriba de las dos páginas. Los links van siempre a "/#…": desde la landing el navegador
 * solo baja hasta la sección, y desde /aprender vuelve a la landing en el lugar correcto.
 */
export default function Encabezado({ tono = 'claro', actual }: { tono?: 'claro' | 'oscuro'; actual?: 'guias' }) {
  return (
    <header className={`encabezado encabezado--${tono}`}>
      <div className="contenedor encabezado__fila">
        <a className="marca" href="/">
          <Marca id={`marca-encabezado-${tono}`}/>
          <span>Estacionamiento</span>
        </a>
        <nav className="encabezado__nav" aria-label="Principal">
          <div className="encabezado__links">
            <a href="/#sistema">Sistema</a>
            <a href="/#planes">Planes</a>
            <a href="/aprender" aria-current={actual === 'guias' ? 'page' : undefined}>Guías</a>
            <a href="/#preguntas">Preguntas</a>
          </div>
          <a className={`boton boton--chico ${tono === 'claro' ? 'boton--oscuro' : 'boton--linea-oscura'}`} href={DEMO_WSP}
            target="_blank" rel="noopener noreferrer">
            Pedir una demo
          </a>
        </nav>
      </div>
    </header>
  );
}
