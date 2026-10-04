// La lista de precios de la plataforma: planes y períodos de pago. La edita el super admin en el
// panel (Planes y cobros) y el backend la publica en GET /public/planes. La landing es una
// exportación estática: la lee al compilarse y el navegador de cada visitante la vuelve a pedir,
// así un cambio de precio se ve sin volver a publicar la landing. Si el backend no está configurado
// (NEXT_PUBLIC_PLATAFORMA_API_URL) o no responde, quedan los valores de acá.

export type PlanLanding = {
  codigo: string;
  nombre: string;
  tamano: string;
  rotacion: number;
  // null: ese tamaño no se ofrece con cocheras mensuales.
  cocheras: number | null;
  destacado: boolean;
};

export type PeriodoLanding = {
  codigo: string;
  etiqueta: string;
  meses: number;
  // Fracción: 0.10 = 10% menos.
  descuento: number;
  precio: string;
  consulta: string;
};

export type Catalogo = { planes: PlanLanding[]; periodos: PeriodoLanding[] };

export const CATALOGO_FIJO: Catalogo = {
  planes: [
    { codigo: 'CHICA', nombre: 'Playa chica', tamano: 'Hasta 30 vehículos a la vez', rotacion: 50_000, cocheras: 70_000, destacado: false },
    { codigo: 'MEDIANA', nombre: 'Playa mediana', tamano: 'Hasta 100 vehículos a la vez', rotacion: 70_000, cocheras: 95_000, destacado: true },
    { codigo: 'GRANDE', nombre: 'Playa grande', tamano: 'Sin límite de vehículos', rotacion: 110_000, cocheras: 140_000, destacado: false },
  ],
  periodos: [
    { codigo: 'MENSUAL', etiqueta: 'Mensual', meses: 1, descuento: 0, precio: 'por mes', consulta: 'mensual' },
    { codigo: 'TRIMESTRAL', etiqueta: 'Trimestral', meses: 3, descuento: 0.1, precio: 'por 3 meses', consulta: 'trimestral' },
    { codigo: 'ANUAL', etiqueta: 'Anual', meses: 12, descuento: 0.15, precio: 'por año', consulta: 'anual' },
  ],
};

type PlanApi = { codigo: string; nombre: string; maxActivos: number | null; incluyeCocheras: boolean; precioMensual: number };
type PeriodoApi = { codigo: string; nombre: string; meses: number; descuento: number };

const tamanoDe = (max: number | null) => (max === null ? 'Sin límite de vehículos' : `Hasta ${max} vehículos a la vez`);
const precioDe = (meses: number) => (meses === 1 ? 'por mes' : meses === 12 ? 'por año' : `por ${meses} meses`);

/** De la respuesta del backend a las tarjetas: un plan por tamaño, con su precio solo tickets y con cocheras. */
export function aCatalogo(datos: { planes?: PlanApi[]; periodos?: PeriodoApi[] } | null): Catalogo | null {
  const planes = Array.isArray(datos?.planes) ? datos.planes : [];
  const periodos = Array.isArray(datos?.periodos) ? datos.periodos : [];
  const porTamano = new Map<string, { base?: PlanApi; cocheras?: PlanApi }>();
  for (const p of planes) {
    if (typeof p?.codigo !== 'string' || !Number.isFinite(p.precioMensual) || p.precioMensual <= 0) continue;
    const tamano = p.codigo.replace(/_COCHERAS$/, '');
    const grupo = porTamano.get(tamano) ?? {};
    if (p.incluyeCocheras) grupo.cocheras = p;
    else grupo.base = p;
    porTamano.set(tamano, grupo);
  }
  const lista: PlanLanding[] = [...porTamano.entries()]
    .filter(([, g]) => g.base)
    .sort(([, a], [, b]) => (a.base!.maxActivos ?? Infinity) - (b.base!.maxActivos ?? Infinity))
    .map(([codigo, g]) => ({
      codigo,
      nombre: g.base!.nombre,
      tamano: tamanoDe(g.base!.maxActivos),
      rotacion: g.base!.precioMensual,
      cocheras: g.cocheras?.precioMensual ?? null,
      destacado: codigo === 'MEDIANA',
    }));
  if (!lista.length) return null;
  const opciones: PeriodoLanding[] = periodos
    .filter((p) => typeof p?.nombre === 'string' && Number.isInteger(p.meses) && p.meses >= 1)
    .map((p) => ({
      codigo: p.codigo,
      etiqueta: p.nombre,
      meses: p.meses,
      descuento: Math.min(Math.max(Number(p.descuento) || 0, 0), 90) / 100,
      precio: precioDe(p.meses),
      consulta: p.nombre.toLowerCase(),
    }));
  return { planes: lista, periodos: opciones.length ? opciones : CATALOGO_FIJO.periodos };
}

/** La lista de precios del backend, o null si no está configurado o no responde a tiempo. */
export async function pedirCatalogo(): Promise<Catalogo | null> {
  const api = process.env.NEXT_PUBLIC_PLATAFORMA_API_URL?.replace(/\/$/, '');
  if (!api) return null;
  try {
    const respuesta = await fetch(`${api}/public/planes`, { signal: AbortSignal.timeout(5000) });
    if (!respuesta.ok) return null;
    return aCatalogo(await respuesta.json());
  } catch {
    return null;
  }
}
