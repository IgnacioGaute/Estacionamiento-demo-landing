/**
 * Graba recorridos del sistema local con Playwright.
 * Requiere ADMIN_USER, ADMIN_PASS, OPERATOR_USER y OPERATOR_PASS en el entorno.
 * Las credenciales y sesiones permanecen en memoria; nunca se escriben al disco.
 *
 * node scripts/grabar-demo-real.mjs operacion
 */
import { chromium } from 'playwright';
import { mkdir, rename } from 'node:fs/promises';
import { join } from 'node:path';

const base = 'http://localhost:3000';
const output = join(process.cwd(), 'public', 'videos');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });

async function authenticate(role) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.goto(base + '/auth/login', { waitUntil: 'networkidle' });
  await page.locator('input[name="identifier"]').fill(process.env[role + '_USER']);
  await page.locator('input[name="password"]').fill(process.env[role + '_PASS']);
  await page.getByRole('button', { name: 'Entrar al sistema' }).click();
  await page.waitForURL('**/tickets', { timeout: 20000 });
  const state = await context.storageState();
  await context.close();
  return state;
}

async function recordedPage(name, role) {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    recordVideo: { dir: output, size: { width: 1600, height: 900 } },
    ...(role ? { storageState: await authenticate(role) } : {}),
    reducedMotion: 'no-preference',
    serviceWorkers: 'block',
  });
  return { context, page: await context.newPage(), name };
}

async function caption(page, eyebrow, title, detail) {
  await page.evaluate(({ eyebrow, title, detail }) => {
    if (!document.querySelector('#landing-video-caption')) {
      const style = document.createElement('style');
      style.textContent = `
        nextjs-portal{display:none!important}
        #landing-video-caption{position:fixed;left:30px;bottom:26px;z-index:2147483647;pointer-events:none;width:480px;max-width:calc(100vw - 60px);padding:17px 22px 20px;border:1px solid rgba(255,201,28,.5);border-radius:16px;background:rgba(13,12,10,.94);box-shadow:0 18px 45px rgba(0,0,0,.45);color:#fffdf6;font-family:Arial,sans-serif;backdrop-filter:blur(14px);transition:opacity .25s ease}
        #landing-video-caption i{display:block;width:32px;height:3px;margin-bottom:13px;background:linear-gradient(90deg,#ffc91c,#f36b2b)}
        #landing-video-caption small{display:block;margin-bottom:5px;color:#ffc91c;font-size:11px;font-weight:800;letter-spacing:.14em}
        #landing-video-caption strong{display:block;font-size:26px;line-height:1.13}
        #landing-video-caption p{margin:6px 0 0;color:#c7c0b5;font-size:15px;line-height:1.35}
      `;
      document.head.appendChild(style);
      const box = document.createElement('div');
      box.id = 'landing-video-caption';
      box.innerHTML = '<i></i><small></small><strong></strong><p></p>';
      document.body.appendChild(box);
    }
    const box = document.querySelector('#landing-video-caption');
    box.querySelector('small').textContent = eyebrow;
    box.querySelector('strong').textContent = title;
    box.querySelector('p').textContent = detail;
  }, { eyebrow, title, detail });
}

async function scene(page, eyebrow, title, detail, duration = 2400) {
  await caption(page, eyebrow, title, detail);
  await page.waitForTimeout(duration);
}

async function goto(page, route) {
  await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1100);
}

async function finish(recording) {
  const video = recording.page.video();
  await recording.context.close();
  await rename(await video.path(), join(output, recording.name + '.webm'));
  console.log('Generado:', recording.name + '.webm');
}

async function operation() {
  const recording = await recordedPage('operacion-real', 'OPERATOR');
  const { page } = recording;
  const plate = 'ZZ' + String(Math.floor(Math.random() * 900) + 100) + 'ZX';
  await goto(page, '/tickets');
  await scene(page, 'OPERACIÓN · ROL OPERADOR', 'Entradas y salidas', 'Las acciones principales están en la primera pantalla.', 2800);

  await page.getByRole('button', { name: /Registrar entrada/ }).first().click();
  await page.locator('[role=dialog] select').waitFor({ state: 'visible' });
  await scene(page, 'PASO 1', 'Registrar por patente', 'Ingresá la patente y elegí el tipo de vehículo.', 2200);
  await page.locator('[role=dialog] input[name="licensePlate"]').fill(plate);
  await page.locator('[role=dialog] select').selectOption('AUTO');
  await scene(page, 'PASO 2', 'Datos del vehículo', 'El apellido y el teléfono son opcionales.', 2000);
  await page.locator('[role=dialog]').getByRole('button', { name: 'REGISTRAR ENTRADA' }).click();
  await page.waitForTimeout(1600);
  await scene(page, 'PASO 3', 'Entrada registrada', 'El vehículo queda activo y se genera su comprobante.', 2600);
  console.log('AFTER_ENTRY', (await page.locator('body').innerText()).slice(-650));
  await finish(recording);
}

async function payment() {
  const plate = process.env.DEMO_PLATE;
  if (!plate) throw new Error('Falta DEMO_PLATE para buscar la entrada de prueba.');
  const recording = await recordedPage('cobro-real', 'OPERATOR');
  const { page } = recording;
  await goto(page, '/tickets');
  await page.getByRole('button', { name: /Abrir turno/ }).click();
  await page.getByRole('button', { name: 'Abrir mi turno' }).waitFor({ state: 'visible' });
  await scene(page, 'CAJA · ROL OPERADOR', 'Abrir el turno', 'La playa tiene turnos activos: el operador cuenta el efectivo que recibe antes de cobrar.', 2800);
  await page.getByRole('button', { name: 'Abrir mi turno' }).click();
  await page.locator('[role=dialog]').waitFor({ state: 'hidden', timeout: 15000 });
  await page.waitForTimeout(750);
  await scene(page, 'VEHÍCULOS ACTIVOS', 'Buscar por patente', 'Encontrá el vehículo sin recorrer toda la lista.', 2300);
  await page.locator('input[placeholder^="Patente o apellido"]').first().fill(plate);
  await page.waitForTimeout(950);
  await page.getByRole('button', { name: new RegExp(plate) }).first().click();
  await scene(page, 'ESTADÍA ACTIVA', 'Tiempo e importe a la vista', 'Revisá la entrada y el total calculado antes de cobrar.', 2700);
  await page.getByRole('button', { name: /Abrir comprobante de entrada/ }).click();
  await scene(page, 'COMPROBANTE DE ENTRADA', 'Siempre disponible', 'Podés volver a abrir el QR y el comprobante original.', 2700);
  await page.getByRole('button', { name: 'Cerrar' }).last().click();
  await page.getByRole('button', { name: /Continuar con el cobro/ }).click();
  await scene(page, 'MEDIOS DE PAGO', 'Elegí cómo te pagó', 'Efectivo, transferencia verificada o QR si Mercado Pago está conectado.', 3200);
  await page.locator('[role=dialog]').getByRole('button', { name: 'EFECTIVO' }).click();
  await scene(page, 'COBRO DE PRUEBA', 'Confirmar la salida', 'El ejemplo se cobra en efectivo; no se genera ningún pago de Mercado Pago.', 2000);
  await page.locator('[role=dialog]').getByRole('button', { name: /Confirmar cobro de/ }).click();
  await page.getByText(/Entregar comprobante/i).first().waitFor({ state: 'visible', timeout: 15000 });
  await scene(page, 'COMPROBANTE DE SALIDA', 'El cierre queda registrado', 'El importe, el medio de pago y el operador figuran en el comprobante.', 3200);
  console.log('PAYMENT_DONE', plate);
  await finish(recording);
}

async function tariffs() {
  const recording = await recordedPage('tarifas-real', 'ADMIN');
  const { page } = recording;
  await goto(page, '/admin/tarifas');
  await page.getByRole('tab', { name: 'Por tiempo' }).first().waitFor();
  await scene(page, 'ADMINISTRACIÓN · TARIFAS', 'Precios por duración', 'La tabla vigente muestra qué importe corresponde a cada duración.', 3000);
  await page.getByRole('switch', { name: 'Mostrar tarifas de noche' }).click();
  await scene(page, 'DÍA Y NOCHE', 'Cambiá de horario', 'Los precios de noche se consultan sin mezclar los del día.', 2900);
  await page.getByRole('tab', { name: 'Camioneta' }).first().click();
  await scene(page, 'TIPO DE VEHÍCULO', 'Cada tipo tiene sus precios', 'Auto y camioneta se muestran por separado.', 2400);
  await page.getByRole('tab', { name: 'Día / semana / mes' }).first().click();
  await scene(page, 'ESTADÍAS LARGAS', 'Día, semana o mes', 'También podés consultar los abonos por tipo de vehículo.', 3000);
  await page.getByRole('tab', { name: /Por tiempo/ }).first().click();
  await page.getByRole('button', { name: 'Editar tarifas' }).click();
  await scene(page, 'EDITOR DE TARIFAS', 'Cambios en un borrador', 'Elegí la modalidad y cargá precios antes de aplicar los cambios.', 3000);
  await page.getByRole('button', { name: 'Cancelar' }).last().click();
  await page.getByText('Probá cuánto cobrarías').first().scrollIntoViewIfNeeded();
  await scene(page, 'SIMULADOR', 'Probá un importe', 'Podés comprobar un cálculo sin registrar una entrada real.', 2700);
  await finish(recording);
}

async function cash() {
  const recording = await recordedPage('caja-real', 'ADMIN');
  const { page } = recording;
  await goto(page, '/admin/caja');
  await scene(page, 'ADMINISTRACIÓN · CAJA', 'Ingresos y gastos', 'Los movimientos adicionales se consultan separados de los cobros de estacionamiento.', 3300);
  await page.getByRole('button', { name: 'Planilla diaria' }).click();
  await scene(page, 'PLANILLA DIARIA', 'Elegí una fecha', 'El resumen muestra el efectivo registrado y el detalle de ese día.', 3400);
  await page.getByRole('button', { name: /fecha|calendario/i }).last().click().catch(() => {});
  await scene(page, 'CALENDARIO', 'Consultá otros días', 'Podés retroceder o avanzar sin perder de vista la caja.', 2500);
  await goto(page, '/admin/caja?tab=turnos');
  await scene(page, 'TURNOS', 'Cada operador rinde su caja', 'El administrador ve el turno en curso y los cierres anteriores.', 3400);
  await finish(recording);
}

async function administration() {
  const recording = await recordedPage('administracion-real', null);
  const { page } = recording;
  await goto(page, '/auth/login');
  await scene(page, 'ACCESO · ROL ADMINISTRADOR', 'Ingresá con tu cuenta', 'Cada persona entra con su usuario y ve las funciones de su rol.', 2700);
  await page.addStyleTag({ content: 'input[name="identifier"], input[name="password"] {color:transparent!important;text-shadow:0 0 10px #d7c7a2!important}' });
  await page.locator('input[name="identifier"]').fill(process.env.ADMIN_USER);
  await page.locator('input[name="password"]').fill(process.env.ADMIN_PASS);
  await page.getByRole('button', { name: 'Entrar al sistema' }).click();
  await page.waitForURL('**/tickets', { timeout: 20000 });
  await scene(page, 'SESIÓN INICIADA', 'Entradas y salidas', 'El acceso principal reúne la operación cotidiana.', 2300);
  await goto(page, '/admin/dashboard');
  await scene(page, 'ROL ADMINISTRADOR', 'Visión general de la playa', 'Desde el panel se accede a la operación y a los indicadores.', 3000);
  await goto(page, '/admin/frecuentes');
  await page.addStyleTag({ content: 'table tbody, [role="rowgroup"] [role="row"] {filter:blur(8px)!important}' });
  await scene(page, 'CLIENTES FRECUENTES', 'Historial y visitas', 'Buscá patrones de uso y consultá los clientes que vuelven.', 2600);
  await page.getByRole('button', { name: 'Mostrar filtros' }).click();
  await scene(page, 'FILTROS', 'Acotá la consulta', 'Filtrá por período, vehículo o cantidad mínima de visitas.', 2200);
  await goto(page, '/admin/users');
  await page.addStyleTag({ content: 'table tbody td:nth-child(2), [role="row"] [role="cell"]:nth-child(2) {filter:blur(9px)!important}' });
  await scene(page, 'USUARIOS Y ROLES', 'Administrador u operador', 'Cada cuenta tiene su rol y los operadores se asignan a una playa.', 3400);
  await goto(page, '/admin/configuracion');
  await scene(page, 'CONFIGURACIÓN', 'Ajustes en un solo lugar', 'Operación, comprobantes y cobro con Mercado Pago.', 2800);
  await goto(page, '/admin/configuracion/operacion');
  await scene(page, 'OPERACIÓN', 'Adaptá el sistema a tu playa', 'Definí vehículos, turnos y uso de fichas físicas.', 2600);
  await goto(page, '/admin/configuracion/comprobantes');
  await scene(page, 'COMPROBANTES', 'Elegí cómo entregarlos', 'Podés compartir el enlace o imprimir desde la computadora.', 2700);
  await goto(page, '/admin/parking-type');
  await scene(page, 'TIPOS DE ESTACIONAMIENTO', 'Dueños e inquilinos', 'Administrá las cocheras y las personas asociadas a cada espacio.', 2700);
  await finish(recording);
}

async function access() {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    recordVideo: { dir: output, size: { width: 1600, height: 900 } },
    serviceWorkers: 'block',
  });
  const page = await context.newPage();
  const recording = { context, page, name: 'acceso-real' };
  await goto(page, '/auth/login');
  await scene(page, 'ACCESO AL SISTEMA', 'Cada persona entra con su cuenta', 'El usuario inicia sesión y ve las funciones que le corresponden.', 3400);
  await page.addStyleTag({ content: 'input[name="identifier"], input[name="password"] {color:transparent!important;text-shadow:0 0 10px #d7c7a2!important}' });
  await page.locator('input[name="identifier"]').fill(process.env.OPERATOR_USER);
  await page.locator('input[name="password"]').fill(process.env.OPERATOR_PASS);
  await page.getByRole('button', { name: 'Entrar al sistema' }).click();
  await page.waitForURL('**/tickets', { timeout: 20000 });
  await scene(page, 'ROL OPERADOR', 'Acceso directo a la operación', 'El operador registra vehículos, cobra salidas y consulta sus herramientas diarias.', 3800);
  await finish(recording);
}

async function renters() {
  const recording = await recordedPage('inquilinos-real', 'ADMIN');
  const { page } = recording;
  await goto(page, '/renters');
  await page.addStyleTag({ content: '[role="row"] [role="cell"]:first-child > span:last-child, [aria-label="Inquilinos"] li > div:first-child > span {filter:blur(10px)!important}' });
  await scene(page, 'COCHERAS MENSUALES', 'Cuentas corrientes', 'El tablero resume abonos, saldos pendientes y pagos del mes.', 3200);
  await page.getByRole('button', { name: 'Nuevo inquilino' }).first().click();
  await scene(page, 'ALTA DE INQUILINO', 'Datos y cochera', 'El formulario reúne el contacto, la cochera y el abono.', 3500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  await goto(page, '/notes');
  await page.addStyleTag({ content: 'table tbody, [role="rowgroup"] [role="row"] {filter:blur(9px)!important}' });
  await scene(page, 'AVISOS DEL EQUIPO', 'Novedades internas', 'El personal comparte indicaciones que quedan visibles para el equipo.', 2900);
  await page.getByRole('button', { name: 'Nuevo aviso' }).first().click();
  await scene(page, 'NUEVO AVISO', 'Dejá una indicación', 'Los avisos ayudan a coordinar el trabajo entre operadores.', 3000);
  await finish(recording);
}

try {
  const chapter = process.argv[2];
  if (chapter === 'operacion') await operation();
  else if (chapter === 'cobro') await payment();
  else if (chapter === 'tarifas') await tariffs();
  else if (chapter === 'caja') await cash();
  else if (chapter === 'administracion') await administration();
  else if (chapter === 'inquilinos') await renters();
  else if (chapter === 'acceso') await access();
  else throw new Error('Capítulo desconocido: ' + chapter);
} finally {
  await browser.close();
}
