/** Recorridos reales del entorno de prueba. Credenciales: solo variables de entorno. */
import { chromium } from 'playwright';
import { mkdir, rename } from 'node:fs/promises';
import { join } from 'node:path';

const base = 'http://localhost:3000';
const output = join(process.cwd(), '.revision', 'tutoriales');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });

async function authenticate(role) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  for (let attempt = 1; attempt <= 2; attempt++) {
    await page.goto(base + '/auth/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => {
      const form = document.querySelector('form');
      return form && Object.keys(form).some(key => key.startsWith('__reactProps$') && typeof form[key]?.onSubmit === 'function');
    }, null, { timeout: 60000 });
    await page.locator('input[name="identifier"]').fill(process.env[role + '_USER']);
    await page.locator('input[name="password"]').fill(process.env[role + '_PASS']);
    await page.getByRole('button', { name: 'Entrar al sistema' }).click();
    try { await page.waitForURL('**/tickets', { waitUntil: 'domcontentloaded', timeout: 45000 }); break; }
    catch (error) { if (attempt === 2) throw error; await page.waitForTimeout(1500); }
  }
  const state = await context.storageState();
  await context.close();
  return state;
}

async function recordedPage(name, role) {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    recordVideo: { dir: output, size: { width: 1600, height: 900 } },
    storageState: await authenticate(role),
    serviceWorkers: 'block',
    reducedMotion: 'no-preference',
    acceptDownloads: true,
  });
  return { name, context, page: await context.newPage() };
}

async function caption(page, number, chapter, title, detail) {
  await page.evaluate(({ number, chapter, title, detail }) => {
    let style = document.querySelector('#tutorial-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'tutorial-style';
      style.textContent = `
        nextjs-portal{display:none!important}
        #tutorial-caption{position:fixed;left:24px;bottom:22px;z-index:2147483647;pointer-events:none;width:480px;max-width:calc(100vw - 48px);padding:22px 26px 24px;border:2px solid #ffd13d;border-radius:20px;background:rgba(8,8,7,.97);box-shadow:0 20px 65px rgba(0,0,0,.68),inset 0 1px rgba(255,255,255,.1);color:#fff;font-family:Arial,sans-serif}
        #tutorial-caption::before{content:'';position:absolute;left:0;top:0;right:0;height:6px;border-radius:18px 18px 0 0;background:linear-gradient(90deg,#ffd13d,#ff8a29)}
        #tutorial-caption .meta{display:flex;align-items:center;gap:12px;margin-bottom:10px;color:#ffd13d;font-size:15px;font-weight:800;letter-spacing:.11em;text-transform:uppercase}
        #tutorial-caption .num{display:grid;place-items:center;width:33px;height:33px;flex:none;border-radius:9px;background:#ffd13d;color:#12100b;font-size:18px;letter-spacing:0}
        #tutorial-caption strong{display:block;font-size:34px;line-height:1.1;letter-spacing:-.025em}
        #tutorial-caption p{margin:10px 0 0;color:#ede6d9;font-size:20px;line-height:1.4}
        .tutorial-focus{outline:4px solid #ffd13d!important;outline-offset:5px!important;box-shadow:0 0 0 10px rgba(255,209,61,.2),0 0 32px rgba(255,209,61,.5)!important}
      `;
      document.head.appendChild(style);
    }
    let box = document.querySelector('#tutorial-caption');
    if (!box) {
      box = document.createElement('div');
      box.id = 'tutorial-caption';
      box.innerHTML = '<div class="meta"><span class="num"></span><span class="chapter"></span></div><strong></strong><p></p>';
      document.body.appendChild(box);
    }
    box.querySelector('.num').textContent = String(number).padStart(2, '0');
    box.querySelector('.chapter').textContent = chapter;
    box.querySelector('strong').textContent = title;
    box.querySelector('p').textContent = detail;
  }, { number, chapter, title, detail });
}

async function scene(page, number, chapter, title, detail, target = null, ms = 6500) {
  console.log('ESCENA', String(number).padStart(2, '0'), chapter, title);
  await caption(page, number, chapter, title, detail);
  if (target && await target.count()) await target.first().evaluate(node => node.classList.add('tutorial-focus'));
  await page.waitForTimeout(ms);
  if (target && await target.count()) await target.first().evaluate(node => node.classList.remove('tutorial-focus')).catch(() => {});
}

async function goto(page, route, heading) {
  await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (heading) await page.getByRole('heading', { name: heading, exact: false }).first().waitFor({ state: 'visible', timeout: 45000 });
  await page.waitForTimeout(1000);
}

async function openMenu(page) {
  const profile = page.getByRole('button', { name: /Alvaro Garcia|Andres Gaute/ }).first();
  const menu = page.locator('[role="menu"]');
  for (let attempt = 1; attempt <= 3; attempt++) {
    await profile.waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(1500);
    await profile.click();
    try { await menu.waitFor({ state: 'visible', timeout: 5500 }); break; }
    catch (error) {
      if (attempt === 3) {
        console.log('MENU_DEBUG', page.url(), await profile.evaluate(node => Object.keys(node).filter(key => key.startsWith('__react'))));
        await page.screenshot({ path: join(output, 'menu-error.png') });
        throw error;
      }
    }
  }
  await menu.evaluate(root => [...root.querySelectorAll('span')].filter(node => node.textContent?.includes('@')).forEach(node => { node.style.filter = 'blur(8px)'; }));
  return menu;
}

async function showMenu(page, number, chapter, route, detail) {
  const menu = await openMenu(page);
  const link = menu.locator(`a[href="${route}"]`).first();
  if (!(await link.isVisible().catch(() => false))) {
    await menu.getByRole('menuitem', { name: route.startsWith('/admin') ? /Administración/i : /Operación/i }).first().click();
  }
  await link.waitFor({ state: 'visible', timeout: 10000 });
  await scene(page, number, chapter, 'Dónde estamos', detail, link, 5900);
  await page.keyboard.press('Escape');
  await menu.waitFor({ state: 'hidden', timeout: 6000 });
}

async function navigateMenu(page, number, chapter, route, title, detail) {
  const menu = await openMenu(page);
  const link = menu.locator(`a[href="${route}"]`).first();
  if (!(await link.isVisible().catch(() => false))) {
    await menu.getByRole('menuitem', { name: route.startsWith('/admin') ? /Administración/i : /Operación/i }).first().click();
  }
  await link.waitFor({ state: 'visible', timeout: 10000 });
  await scene(page, number, chapter, title, detail, link, 5900);
  await link.click();
  await page.waitForURL(url => url.pathname === route, { timeout: 45000 });
  await page.waitForTimeout(900);
}

async function scrollPage(page, amount, wait = 1500) {
  await page.evaluate(y => window.scrollBy({ top: y, behavior: 'smooth' }), amount);
  await page.waitForTimeout(wait);
}

async function finish(recording) {
  const video = recording.page.video();
  await recording.context.close();
  await rename(await video.path(), join(output, recording.name + '.webm'));
  console.log('VIDEO', recording.name + '.webm');
}

async function operation() {
  const recording = await recordedPage('operacion-v2', 'OPERATOR');
  const { page } = recording;
  const plate = 'ZZ' + String(Math.floor(Math.random() * 900) + 100) + 'ZX';
  await goto(page, '/tickets', 'Entradas y salidas');
  await showMenu(page, 1, 'OPERACIÓN', '/tickets', 'En el menú del operador, Operación → Tickets lleva a las entradas, las salidas y los vehículos activos.');
  const entry = page.getByRole('button', { name: /Registrar entrada/ }).first();
  await scene(page, 2, 'OPERACIÓN', 'Registrar una entrada', 'Tocamos “Registrar entrada”. El sistema guardará la hora y el operador que recibe el vehículo.', entry);
  await entry.click();
  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor();
  const frequent = dialog.locator('#frequent-entry-search');
  await scene(page, 3, 'CLIENTES FRECUENTES', 'Primero podés buscar', 'Buscá una patente, apellido o teléfono ya conocido: al elegirlo, se completan sus datos y el tipo de vehículo.', frequent, 7500);
  await frequent.fill(plate);
  await scene(page, 4, 'CLIENTES FRECUENTES', 'Si no aparece, cargalo manualmente', 'Como esta patente de prueba no tiene visitas anteriores, usamos el campo “Patente” de abajo.', frequent, 6500);
  await frequent.clear();
  const plateInput = dialog.locator('input[name="licensePlate"]');
  await scene(page, 5, 'ENTRADA POR PATENTE', 'Escribí la patente', 'También podés leerla con la cámara del celular. Para este ejemplo escribimos una patente de prueba.', plateInput, 6500);
  await plateInput.fill(plate);
  const vehicle = dialog.locator('select').first();
  await scene(page, 6, 'TIPO DE VEHÍCULO', 'Elegí el vehículo', 'Auto y camioneta pueden tener tarifas distintas. El apellido y el teléfono de WhatsApp son opcionales.', vehicle, 7000);
  await vehicle.selectOption('AUTO');
  const submit = dialog.getByRole('button', { name: 'REGISTRAR ENTRADA' });
  await scene(page, 7, 'GUARDAR', 'Confirmá la entrada', 'Revisamos los datos y presionamos “Registrar entrada”. La estadía queda activa para encontrarla después por patente.', submit, 6300);
  await submit.click();
  const receipt = page.locator('[role="dialog"]').filter({ hasText: 'Entregar comprobante' });
  await receipt.waitFor({ state: 'visible', timeout: 30000 });
  await scene(page, 8, 'COMPROBANTE DE ENTRADA', 'El registro ya quedó hecho', 'El comprobante muestra patente, hora, playa y operador. El código QR abre el enlace del comprobante.', receipt.locator('svg[title="Escaneá para ver el comprobante"]'), 7700);
  await receipt.evaluate(node => node.scrollTo({ top: node.scrollHeight * 0.55, behavior: 'smooth' }));
  await page.waitForTimeout(1500);
  await scene(page, 9, 'ENTREGA', 'Desplazate para ver las opciones', 'Más abajo aparecen el QR y los medios de entrega habilitados para esta playa.', receipt, 6800);
  await receipt.evaluate(node => node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' }));
  await page.waitForTimeout(1600);
  await scene(page, 10, 'ENTREGA', 'QR, enlace o impresión', 'El administrador elige en Configuración → Comprobantes si se muestra QR, WhatsApp o impresión térmica. El ingreso se puede volver a consultar.', receipt, 8500);
  await finish(recording);
  console.log('DEMO_PLATE', plate);
}

async function operationReceipt() {
  const plate = process.env.DEMO_PLATE;
  if (!plate) throw new Error('Falta DEMO_PLATE.');
  const recording = await recordedPage('operacion-comprobante-v2', 'OPERATOR');
  const { page } = recording;
  await goto(page, '/tickets', 'Entradas y salidas');
  await page.locator('input[placeholder^="Patente o apellido"]').first().fill(plate);
  await page.getByRole('button', { name: new RegExp(plate) }).first().click();
  await page.getByRole('button', { name: /Abrir comprobante de entrada/ }).click();
  const receipt = page.locator('[role="dialog"]').filter({ hasText: 'Entregar comprobante' });
  await receipt.waitFor({ state: 'visible' });
  console.log('SCROLL', await receipt.evaluate(node => ({ height: node.clientHeight, scroll: node.scrollHeight })));
  await scene(page, 9, 'COMPROBANTE', 'Todo el papel se puede ver', 'Desplazamos el comprobante para llegar al QR y a las acciones de entrega.', null, 6000);
  await receipt.evaluate(node => [...node.children].find(child => getComputedStyle(child).overflowY === 'auto')?.scrollTo({ top: 240, behavior: 'smooth' }));
  await page.waitForTimeout(1800);
  await scene(page, 10, 'CÓDIGO QR', 'El cliente abre el enlace', 'El QR lleva al comprobante digital. También queda disponible para volver a abrirlo más tarde.', null, 7000);
  await receipt.evaluate(node => { const inner = [...node.children].find(child => getComputedStyle(child).overflowY === 'auto'); inner?.scrollTo({ top: inner.scrollHeight, behavior: 'smooth' }); });
  await page.waitForTimeout(1800);
  await scene(page, 11, 'FORMAS DE ENTREGA', 'Las opciones se configuran', 'El administrador puede habilitar QR, enlace por WhatsApp e impresión térmica desde Configuración → Comprobantes.', null, 8500);
  await finish(recording);
}

async function operationHistory() {
  const plate = process.env.DEMO_PLATE;
  if (!plate) throw new Error('Falta DEMO_PLATE.');
  const recording = await recordedPage('operacion-historial-v2', 'OPERATOR');
  const { page } = recording;
  await goto(page, '/tickets', 'Entradas y salidas');
  await showMenu(page, 12, 'COMPROBANTES ANTERIORES', '/tickets', 'Seguimos en Operación → Tickets. Los comprobantes quedan en una lista para volver a consultarlos cuando se necesiten.');
  const tab = page.getByRole('tab', { name: 'Comprobantes' });
  await scene(page, 13, 'HISTORIAL', 'Abrí “Comprobantes”', 'Esta pestaña muestra los comprobantes de la fecha elegida. Se puede cambiar el día con el calendario y buscar por patente o apellido.', tab, 10000);
  await tab.click();
  const history = page.getByRole('region', { name: 'Comprobantes' });
  await scene(page, 14, 'BÚSQUEDA', 'Encontrá una patente', 'Escribimos la patente que acabamos de cobrar. La lista muestra quién registró la entrada y quién registró la salida.', history.getByPlaceholder('Buscar comprobantes…'), 10000);
  await history.getByPlaceholder('Buscar comprobantes…').fill(plate);
  const exit = page.getByRole('button', { name: `Abrir comprobante de salida de ${plate}` });
  await exit.waitFor({ state: 'visible', timeout: 30000 });
  await scene(page, 15, 'ENTRADA Y SALIDA', 'Los dos papeles siguen disponibles', 'Desde esta ficha se vuelve a abrir el comprobante de entrada o el de salida. Sirve para descargar el PDF o imprimirlo más tarde.', history, 11500);
  await exit.click();
  const receipt = page.locator('[role="dialog"]').filter({ hasText: 'Entregar comprobante' });
  await receipt.waitFor({ state: 'visible' });
  await scene(page, 16, 'REIMPRESIÓN', 'Abrí el comprobante de salida', 'Se conserva la información del cobro, el operador responsable y el código QR. Podés entregarlo nuevamente sin alterar el registro.', receipt, 10500);
  await finish(recording);
}

async function payment() {
  const plate = process.env.DEMO_PLATE;
  if (!plate) throw new Error('Falta DEMO_PLATE.');
  const recording = await recordedPage('cobro-v2', 'OPERATOR');
  const { page } = recording;
  await goto(page, '/tickets', 'Entradas y salidas');
  await showMenu(page, 1, 'COBRO Y TURNOS', '/tickets', 'Estamos en Operación → Tickets. Acá se buscan los vehículos activos y se registran las salidas.');
  const openShift = page.getByRole('button', { name: /Abrir turno/ }).first();
  console.log('SHIFT_AFTER_MENU', await openShift.count(), await page.locator('[role="menu"]').isVisible().catch(() => false));
  await scene(page, 2, 'TURNO OPCIONAL', 'La playa decide si usa turnos', 'El administrador puede activar o desactivar los turnos en Configuración → Operación. Si están activos, el cobro en efectivo requiere un turno abierto.', openShift, 8500);
  await openShift.click();
  const shiftDialog = page.locator('[role="dialog"]');
  await shiftDialog.getByRole('button', { name: 'Abrir mi turno' }).waitFor({ state: 'visible' });
  await scene(page, 3, 'APERTURA DE CAJA', 'Contá el efectivo inicial', 'El sistema muestra lo que dejó el turno anterior y cuándo cerró. El operador escribe el efectivo real con el que empieza.', shiftDialog.locator('#cash-initial'), 8500);
  await scene(page, 4, 'APERTURA DE CAJA', 'Abrimos el turno de prueba', 'Desde ahora los cobros en efectivo quedan asociados a este operador y se reflejan en la planilla y el cierre.', shiftDialog.getByRole('button', { name: 'Abrir mi turno' }), 7200);
  await shiftDialog.getByRole('button', { name: 'Abrir mi turno' }).click();
  try {
    await shiftDialog.waitFor({ state: 'hidden', timeout: 25000 });
  } catch (error) {
    console.log('SHIFT_DIALOG_AFTER_SUBMIT', (await shiftDialog.innerText()).slice(0, 1200));
    await page.screenshot({ path: join(output, 'shift-open-error.png') });
    throw error;
  }
  const search = page.locator('input[placeholder^="Patente o apellido"]').first();
  await scene(page, 5, 'VEHÍCULOS ACTIVOS', 'Buscá la patente', 'En la columna “Vehículos activos” filtramos por patente o apellido. En el celular primero se toca la pestaña “Activos”.', search, 7800);
  await search.fill(plate);
  const card = page.getByRole('button', { name: new RegExp(plate) }).first();
  await scene(page, 6, 'VEHÍCULOS ACTIVOS', 'Elegí el resultado', 'Presionamos el vehículo encontrado. Se abre su estadía con la hora de ingreso, el tiempo transcurrido y el importe.', card, 7200);
  await card.click();
  const continueButton = page.getByRole('button', { name: /Continuar con el cobro/ });
  await scene(page, 7, 'REVISIÓN', 'Mirá el total antes de cobrar', 'El sistema calcula el importe con la tarifa fijada para esta entrada. Desde aquí también se puede volver a abrir el comprobante de ingreso.', continueButton, 8500);
  await continueButton.click();
  const dialog = page.locator('[role="dialog"]');
  await dialog.getByRole('button', { name: 'EFECTIVO' }).waitFor();
  await scene(page, 8, 'MEDIOS DE PAGO', 'Efectivo', 'Marcá efectivo cuando recibís billetes: el cobro entra en la caja del turno y en la planilla diaria.', dialog.getByRole('button', { name: 'EFECTIVO' }), 7600);
  await scene(page, 9, 'MEDIOS DE PAGO', 'Transferencia', 'Esta opción se usa cuando ya verificaste la transferencia por tu cuenta; el sistema registra el medio elegido.', dialog.getByRole('button', { name: /Transferencia que ya verificaste/ }), 7600);
  await scene(page, 10, 'MEDIOS DE PAGO', 'QR de Mercado Pago, opcional', 'Si el administrador vinculó Mercado Pago en Configuración, el cliente puede pagar con QR y el sistema verifica la acreditación.', dialog.getByRole('button', { name: /QR \/ CELULAR/ }), 9000);
  await dialog.getByRole('button', { name: 'EFECTIVO' }).click();
  const confirm = dialog.getByRole('button', { name: /Confirmar cobro de/ });
  await scene(page, 11, 'CONFIRMACIÓN', 'Registrá la salida', 'Elegimos efectivo para el ejemplo. Revisá el importe y confirmá solo después de recibir el pago.', confirm, 7600);
  await confirm.click();
  const receipt = page.locator('[role="dialog"]').filter({ hasText: 'Entregar comprobante' });
  await receipt.waitFor({ state: 'visible', timeout: 30000 });
  await scene(page, 12, 'COMPROBANTE DE SALIDA', 'Pago y operador registrados', 'El papel de salida identifica la patente, la hora, el importe cobrado, el medio de pago y quién hizo el registro.', null, 8500);
  await receipt.evaluate(node => { const inner = [...node.children].find(child => getComputedStyle(child).overflowY === 'auto'); inner?.scrollTo({ top: inner.scrollHeight, behavior: 'smooth' }); });
  await page.waitForTimeout(1700);
  await scene(page, 13, 'COMPROBANTE DE SALIDA', 'También se puede entregar o consultar', 'Desplazamos hasta el QR y el enlace. Los comprobantes anteriores siguen disponibles en la lista para volver a verlos o imprimirlos.', null, 8500);
  await receipt.getByRole('button', { name: 'Cerrar' }).last().click();
  const currentShift = page.getByRole('button', { name: /Turno actual/ }).first();
  await scene(page, 14, 'CIERRE DE TURNO', 'Al terminar, abrí “Turno actual”', 'Muestra cuánto efectivo debería haber: fondo inicial más los cobros en efectivo, con los movimientos registrados.', currentShift, 7600);
  await currentShift.click();
  const currentDialog = page.locator('[role="dialog"]');
  await scene(page, 15, 'CIERRE DE TURNO', 'Revisá el esperado', 'El operador cuenta el efectivo físico y desde aquí pasa al arqueo y al cierre. El turno no se cierra solo por hora.', currentDialog.getByRole('button', { name: 'Cerrar este turno' }), 7600);
  await currentDialog.getByRole('button', { name: 'Cerrar este turno' }).click();
  await scene(page, 16, 'ARQUEO', 'Compará lo contado', 'Si el conteo coincide, marcás la opción. Si falta o sobra dinero, cargás el importe contado y explicás la diferencia.', currentDialog.locator('#cash-matches'), 8500);
  await currentDialog.locator('#cash-matches').click();
  await scene(page, 17, 'CIERRE', 'Elegí si retirás efectivo', 'Podés dejarlo para el siguiente turno o registrar un retiro. En este ejemplo el conteo coincide y no retiramos nada.', currentDialog.getByRole('button', { name: 'Confirmar cierre' }), 7600);
  await currentDialog.getByRole('button', { name: 'Confirmar cierre' }).click();
  await page.getByRole('button', { name: /Abrir turno/ }).first().waitFor({ timeout: 20000 });
  await scene(page, 18, 'TURNO CERRADO', 'Todo queda en el historial', 'El administrador podrá ver el cierre, el efectivo contado y lo entregado para el turno siguiente en Caja → Turnos.', null, 7200);
  await finish(recording);
}

async function tariffs() {
  const recording = await recordedPage('tarifas-v2', 'ADMIN');
  const { page } = recording;
  await goto(page, '/admin/tarifas', 'Tarifas');
  await showMenu(page, 1, 'TARIFAS', '/admin/tarifas', 'En el menú del administrador, Administración → Tarifas reúne los precios por tiempo y los pases por día, semana o mes.');
  const summary = page.locator('[data-tariff-summary]');
  await scene(page, 2, 'PRECIOS VIGENTES', 'Primero vemos lo que se cobra hoy', 'La tabla muestra la tarifa publicada. Cada vehículo y cada horario se consultan por separado.', summary, 8000);
  const firstRow = summary.locator('tbody tr').first();
  await scene(page, 3, 'LISTA DE PRECIOS', '“Hasta” es el precio total', 'Por ejemplo, “Hasta 15 min” cobra el importe de esa fila a una estadía que entra en ese tramo. No se suma a las filas anteriores.', firstRow, 10500);
  for (const index of [1, 2, 3, 4]) {
    await summary.locator('tbody tr').nth(index).scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
  }
  await scene(page, 4, 'LISTA DE PRECIOS', 'Los tramos crecen con el tiempo', 'Podés cargar minutos, horas y días. Al pasar el límite de una fila, el sistema busca la siguiente duración aplicable.', summary.locator('tbody tr').nth(4), 9000);
  await summary.locator('tbody tr').last().scrollIntoViewIfNeeded();
  await scene(page, 5, 'DESPUÉS DE LA LISTA', '“Cada” cubre el tiempo adicional', 'Cuando se supera el último “Hasta”, esta regla indica cuánto tiempo se agrega en cada paso. Puede tener un precio fijo o calcularse con la lista.', summary.locator('tbody tr').last(), 11000);
  await summary.getByText('Precios según horario', { exact: false }).scrollIntoViewIfNeeded();
  await scene(page, 6, 'HORARIO Y TOLERANCIA', 'Leé la regla debajo de la tabla', 'Acá se ve el horario de día, qué precio rige si la estadía cruza a la noche y los minutos de tolerancia antes de avanzar de tramo.', summary.getByText('Precios según horario', { exact: false }), 11000);
  await summary.scrollIntoViewIfNeeded();
  await page.getByRole('switch', { name: 'Mostrar tarifas de noche' }).click();
  await scene(page, 7, 'DÍA Y NOCHE', 'Tocá la luna para ver la noche', 'El fondo y el encabezado cambian para distinguir el horario. Los precios nocturnos pueden ser distintos para cada duración.', summary, 9500);
  await page.getByRole('tab', { name: 'Camioneta' }).first().click();
  await scene(page, 8, 'TIPO DE VEHÍCULO', 'Cada vehículo tiene su lista', 'Cambiamos a Camioneta sin salir de la página. Este selector separa los precios de Auto y Camioneta.', summary, 8500);
  await page.getByRole('switch', { name: 'Mostrar tarifas de noche' }).click();
  await page.getByRole('tab', { name: 'Auto' }).first().click();
  await page.getByRole('button', { name: 'Editar tarifas' }).click();
  const editor = page.locator('section[aria-labelledby="tariff-draft-heading"]');
  await editor.scrollIntoViewIfNeeded();
  await scene(page, 9, 'EDITAR TARIFAS', 'Trabajás en un borrador', 'Cambiar estos campos no modifica los cobros actuales. El administrador aplica todo junto al final, para los próximos ingresos.', editor.locator('h2'), 9500);
  await scene(page, 10, 'MODALIDAD', 'Lista de precios', 'Es la opción predeterminada: definís importes finales para distintas duraciones. La playa decide qué duraciones ofrecer.', editor.locator('input[value="CUSTOM"]'), 10000);
  await editor.getByText('2. Cargá tus precios').scrollIntoViewIfNeeded();
  await scene(page, 11, 'EDITOR DE LISTA', 'Precios por vehículo y horario', 'Cada fila define “Hasta” y “Precio total”. Si activás “Cobro distinto de noche”, podés asignar el mismo tramo al día, a la noche o a ambos.', editor.getByText('2. Cargá tus precios'), 11000);
  await scrollPage(page, 430, 2200);
  await scene(page, 12, 'EDITOR DE LISTA', 'Revisá todos los tramos', 'Desplazate despacio por los minutos, las horas y los días; también podés copiar una fila para crear más rápido su versión nocturna.', null, 9000);
  await scrollPage(page, 430, 2200);
  await scene(page, 13, 'EDITOR DE LISTA', 'Orden y regla final', 'Las filas se ordenan por duración, aunque se hayan creado en otro orden. La regla adicional resuelve las estadías que exceden la lista.', null, 9000);
  await editor.getByText('3. Horarios y tolerancia').scrollIntoViewIfNeeded();
  await scene(page, 14, 'HORARIOS', 'Elegí cuándo empieza el día', 'Fuera del rango elegido se aplican precios de noche. También definís qué pasa si un vehículo entra en un horario y sale en otro.', editor.getByText('3. Horarios y tolerancia'), 10000);
  await scene(page, 15, 'TOLERANCIA', 'Minutos antes del tramo siguiente', 'La tolerancia permite pasarse unos minutos de un límite sin avanzar todavía al próximo precio; no vuelve gratuita la primera duración.', editor.getByLabel('Tolerancia en minutos'), 10000);
  await editor.locator('input[value="STARTED"]').check();
  await editor.getByText('Por hora o fracción', { exact: true }).first().scrollIntoViewIfNeeded();
  await scene(page, 16, 'OTRA MODALIDAD', 'Por hora o fracción', 'En esta modalidad se fija un importe por período. Cada período que comienza se cobra completo; por ejemplo, 1 h 05 puede contar como dos horas.', editor.locator('input[value="STARTED"]'), 11000);
  await editor.getByText('Duración de cada período').scrollIntoViewIfNeeded();
  await scene(page, 17, 'OTRA MODALIDAD', 'Duración y precio del período', 'Podés cambiar cuánto dura cada período y el precio por vehículo, de día y de noche. La tolerancia retrasa el salto al siguiente período.', editor.getByText('Duración de cada período'), 10000);
  await editor.getByRole('button', { name: 'Descartar cambios' }).click();
  await page.getByRole('button', { name: 'Descartar borrador' }).click();
  const simulator = page.getByText('Probá cuánto cobrarías', { exact: true }).first();
  await simulator.scrollIntoViewIfNeeded();
  await scene(page, 18, 'SIMULADOR', 'Probá antes de cobrar', 'Elegí vehículo, hora de entrada y permanencia. “Calcular ejemplo” muestra el total sin registrar un vehículo ni un cobro.', simulator, 10500);
  await page.getByRole('tab', { name: 'Día / semana / mes' }).first().click();
  const passes = page.locator('[data-tariff-passes]');
  await passes.scrollIntoViewIfNeeded();
  await scene(page, 19, 'PASES POR ESTADÍA', 'Otra lista para día, semana o mes', 'Estos importes son por unidad contratada: dos días cuestan dos veces el precio diario. Se usan cuando registrás una estadía planificada.', passes, 10000);
  await scene(page, 20, 'PASES POR VEHÍCULO', 'Elegí Auto o Camioneta', 'Los pases también tienen precios independientes por tipo. Las acciones de cada fila permiten editar o quitar un importe.', passes.getByRole('tab', { name: 'Camioneta' }), 9000);
  await passes.getByRole('tab', { name: 'Camioneta' }).click();
  await scene(page, 21, 'PASES POR VEHÍCULO', 'Revisá la otra lista', 'Un pase de un día no se aplica automáticamente a un vehículo cobrado por tiempo: se elige al crear la estadía.', passes, 9000);
  await finish(recording);
}

async function cash() {
  const recording = await recordedPage('caja-v2', 'ADMIN');
  const { page } = recording;
  await goto(page, '/admin/caja', 'Caja');
  await showMenu(page, 1, 'CAJA', '/admin/caja', 'En el menú del administrador, Administración → Caja reúne los movimientos adicionales, la planilla diaria y el historial de turnos.');
  await scene(page, 2, 'INGRESOS Y GASTOS', 'Movimientos fuera de los tickets', 'Los cobros de estacionamiento se registran con la salida. Esta tabla sirve para otros ingresos y egresos de la playa.', page.getByText('Ingresos y gastos adicionales'), 9500);
  const create = page.getByRole('button', { name: 'Crear', exact: true }).first();
  await scene(page, 3, 'NUEVO MOVIMIENTO', 'Tocá “Crear”', 'Se abre un formulario para registrar, por ejemplo, un gasto de insumos o un ingreso que no proviene de un vehículo.', create, 8000);
  await create.click();
  const dialog = page.locator('[role="dialog"]');
  await dialog.getByText('Registrar Ingreso o Egreso').waitFor();
  await scene(page, 4, 'NUEVO MOVIMIENTO', 'Primero indicá ingreso o egreso', 'Un ingreso suma efectivo o transferencia; un egreso registra dinero que salió. Elegí el tipo correcto antes de guardar.', dialog.getByText('Tipo', { exact: true }), 9000);
  await scene(page, 5, 'NUEVO MOVIMIENTO', 'Elegí el medio de pago', 'El movimiento puede ser en efectivo o por transferencia. Así la planilla separa lo que pasó por caja de otros medios.', dialog.getByText('Forma de pago'), 9000);
  await scene(page, 6, 'NUEVO MOVIMIENTO', 'Descripción e importe', 'Escribí un motivo reconocible y el monto. Al confirmar, el movimiento aparece en la tabla y en la fecha correspondiente.', dialog.getByText('Descripcion'), 9000);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  const daily = page.getByRole('button', { name: 'Planilla diaria' }).first();
  await scene(page, 7, 'PLANILLA DIARIA', 'Abrí el resumen de un día', 'Desde Caja podés consultar cualquier fecha y descargar el PDF para entregar o imprimir.', daily, 8500);
  await daily.click();
  const sheet = page.locator('[role="dialog"]').filter({ hasText: 'Planilla diaria de caja' });
  await sheet.waitFor({ state: 'visible' });
  const dateButton = sheet.getByRole('button', { name: /Cambiar fecha:/ });
  await scene(page, 8, 'FECHA DE LA PLANILLA', 'Elegí qué jornada consultar', 'Las flechas cambian un día; “Hoy” y “Ayer” son accesos rápidos. El botón de fecha abre el calendario.', dateButton, 9500);
  await dateButton.click();
  const calendar = page.locator('[role="dialog"]').filter({ hasText: 'Fecha de la planilla' });
  await scene(page, 9, 'CALENDARIO', 'Seleccioná la fecha', 'Podés buscar meses anteriores y tocar el día. Cerramos este calendario para seguir con la jornada actual.', calendar, 8500);
  await calendar.getByText('Cerrar', { exact: true }).click();
  await sheet.getByText('Efectivo neto del día').waitFor({ state: 'visible', timeout: 90000 });
  await scene(page, 10, 'RESUMEN DIARIO', 'Efectivo neto de esa fecha', 'La cifra reúne entradas y salidas de efectivo del día. No es el dinero disponible en el cajón: no incluye el fondo inicial ni retiros de cierre.', sheet.getByText('Efectivo neto del día'), 10500);
  const byShift = sheet.getByText('Efectivo del día por turno');
  if (await byShift.count()) {
    await scene(page, 11, 'DETALLE DE LA PLANILLA', 'Movimientos por turno', 'Cada línea muestra responsable, horario y efectivo de esa jornada. Un turno puede abarcar varios días.', byShift, 9500);
  }
  await scene(page, 12, 'PDF DE CAJA', 'Tocá “Imprimir planilla”', 'El sistema genera un PDF con el detalle de la fecha. Se descarga y también se puede abrir para imprimir en papel.', sheet.getByRole('button', { name: 'Imprimir planilla' }), 9000);
  await page.evaluate(() => { window.__tutorialOpen = window.open; window.open = url => { window.__tutorialPdfUrl = url; return null; }; });
  const download = page.waitForEvent('download', { timeout: 45000 });
  await sheet.getByRole('button', { name: 'Imprimir planilla' }).click();
  await download;
  await page.evaluate(() => {
    const overlay = document.createElement('div');
    overlay.id = 'tutorial-pdf-preview';
    overlay.style.cssText = 'position:fixed;inset:18px 18px 18px 655px;z-index:2147483600;background:#242424;border:3px solid #ffd13d;border-radius:14px;overflow:hidden;box-shadow:0 20px 80px #000';
    const iframe = document.createElement('iframe');
    iframe.src = window.__tutorialPdfUrl;
    iframe.title = 'PDF real de la planilla diaria';
    iframe.style.cssText = 'width:100%;height:100%;border:0';
    overlay.appendChild(iframe);
    const privacy = document.createElement('span');
    privacy.textContent = 'Usuario: administración (demo)';
    privacy.style.cssText = 'position:absolute;left:37%;top:20%;min-width:275px;padding:4px 8px;background:#fff;color:#34302a;font:11px Arial,sans-serif';
    overlay.appendChild(privacy);
    document.body.appendChild(overlay);
  });
  await scene(page, 13, 'PDF GENERADO', 'Así se ve la planilla descargada', 'El PDF documenta la fecha, los importes y los movimientos. Se puede conservar digitalmente o imprimir cuando haga falta.', null, 12000);
  await page.evaluate(() => { document.querySelector('#tutorial-pdf-preview')?.remove(); window.open = window.__tutorialOpen; });
  await sheet.getByRole('button', { name: 'Cerrar', exact: true }).last().click();
  await goto(page, '/admin/caja?tab=turnos', 'Caja');
  await showMenu(page, 14, 'TURNOS', '/admin/caja', 'Seguimos en Administración → Caja. La pestaña “Turnos” aparece cuando la playa tiene esta función activada.');
  await scene(page, 15, 'TURNO ACTUAL', 'Estado de la caja', 'Se ve quién abrió el turno, a qué hora y si sigue en curso. El turno se cierra con un conteo, no automáticamente por horario.', page.getByText('Turno actual').first(), 9500);
  const history = page.getByText('Historial de turnos');
  await history.scrollIntoViewIfNeeded();
  await scene(page, 16, 'HISTORIAL', 'Elegí el período', 'Los filtros Hoy, 7 días, 30 días y Todos acotan los cierres. Cada tarjeta resume quién contó y cuánto dejó.', page.locator('[data-tour="caja-rangos"]'), 9500);
  let shift = page.locator('details').filter({ hasText: 'Alvaro Garcia' }).first();
  if (!(await shift.count())) shift = page.locator('details').first();
  if (await shift.count()) {
    await shift.locator('summary').click();
    await shift.scrollIntoViewIfNeeded();
    await scene(page, 17, 'DETALLE DEL CIERRE', 'Abrí un turno del historial', 'Acá se compara con cuánto abrió, cuánto se esperaba al cerrar, cuánto se contó y qué efectivo se retiró.', shift, 11000);
  }
  await scene(page, 18, 'CONTROL DE CAJA', 'El cierre conserva responsables y fechas', 'El administrador puede revisar una diferencia y rastrear quién abrió o cerró. La planilla diaria muestra los movimientos por fecha.', history, 9500);
  await finish(recording);
}

async function hideRenterContact(page) {
  await page.evaluate(() => {
    for (const node of document.querySelectorAll('span, a, p')) {
      if (node.children.length) continue;
      const value = node.textContent?.trim().replace(/[\s()+-]/g, '') || '';
      if (/^\d{9,13}$/.test(value) || /@/.test(value)) node.style.filter = 'blur(10px)';
    }
  });
}

async function renters() {
  const recording = await recordedPage('inquilinos-v2', 'ADMIN');
  const { page } = recording;
  await goto(page, '/renters', 'Inquilinos');
  await page.addStyleTag({ content: '[role="table"][aria-label="Inquilinos"] [role="row"] [role="cell"]:first-child {filter:blur(9px)!important}' });
  await showMenu(page, 1, 'INQUILINOS', '/renters', 'En el menú, Operación → Inquilinos abre las cocheras mensuales. El módulo aparece cuando está habilitado para la playa.');
  await scene(page, 2, 'RESUMEN', 'Leé la situación de la playa', 'Arriba se separan los saldos pendientes, lo cobrado este mes, el abono del mes y los saldos a favor.', page.getByText('Saldo pendiente').first(), 10500);
  await scene(page, 3, 'ABONOS', 'Lo cobrado no es lo mismo que lo adeudado', '“Cobrado en el mes” incluye pagos de cualquier período; el indicador del abono muestra cuánto del mes actual ya está saldado.', page.getByText('Cobrado en').first(), 10500);
  const search = page.getByRole('textbox', { name: 'Buscar inquilino' });
  await search.scrollIntoViewIfNeeded();
  await scene(page, 4, 'BÚSQUEDA', 'Buscá por varios datos', 'Escribí nombre, patente o número de cochera. La lista se filtra sin perder el estado de la cuenta.', search, 9000);
  await scene(page, 5, 'FILTROS', 'Separá los casos urgentes', 'Podés ver todos, quienes tienen saldo pendiente o quienes ya tienen deuda vencida. “Más filtros” incluye al día, a favor y dados de baja.', page.getByText('Con saldo pendiente').first(), 10500);
  const list = page.getByRole('table', { name: 'Inquilinos' });
  await scene(page, 6, 'LISTADO', 'Cada fila resume una cuenta', 'Se ven cochera, abono mensual y saldo. Desde la derecha podés cobrar o abrir el estado completo.', list, 9500);
  const abonos = page.getByRole('button', { name: 'Cargar abonos' });
  await scene(page, 7, 'ABONOS MENSUALES', 'Prepará el mes', 'El administrador carga los cargos mensuales cuando corresponde. Abrimos la vista previa antes de confirmar.', abonos, 8500);
  await abonos.click();
  const abonoDialog = page.locator('[role="dialog"]').filter({ hasText: 'Cargar abonos de' });
  await abonoDialog.waitFor({ state: 'visible' });
  await scene(page, 8, 'ABONOS MENSUALES', 'Elegí mes y vencimiento', 'Se puede preparar el mes actual o el próximo y definir el día de vencimiento. Cargar el abono crea una deuda, no un pago.', abonoDialog.getByText('Vence el día'), 11000);
  await scene(page, 9, 'VISTA PREVIA', 'Revisá antes de cargar', 'La ventana calcula cuántos abonos faltan, el total y cuáles ya estaban cargados. El mismo mes no se cobra dos veces.', abonoDialog, 10500);
  await page.keyboard.press('Escape');
  await abonoDialog.waitFor({ state: 'hidden' });
  const newRenter = page.getByRole('button', { name: 'Nuevo inquilino' });
  await scene(page, 10, 'ALTA', 'Abrí “Nuevo inquilino”', 'El alta tiene dos pasos: primero identidad y contacto; después cochera, precio mensual y saldo inicial.', newRenter, 8500);
  await newRenter.click();
  const editor = page.locator('[role="dialog"]').filter({ hasText: 'Nuevo inquilino' });
  await scene(page, 11, 'IDENTIDAD', 'Nombre y apellido', 'Cargamos datos de ejemplo en el formulario. El número de celular permite entregar recibos por WhatsApp.', editor.getByText('Identidad').first(), 10000);
  await editor.locator('input[name="firstName"]').fill('Cliente');
  await editor.locator('input[name="lastName"]').fill('Ejemplo');
  await scene(page, 12, 'COCHERAS', 'Indicá cuántas alquila', 'La cantidad de cocheras determina cuántas filas tendrás en el paso siguiente. Las notas internas quedan para el equipo.', editor.getByText('Número de cocheras'), 10000);
  await editor.getByRole('button', { name: 'Siguiente' }).click();
  await editor.getByText('Cocheras y saldo').first().waitFor({ state: 'visible' });
  await scene(page, 13, 'COCHERA Y ABONO', 'Asigná número y precio mensual', 'Cada cochera tiene su propio número y precio. El abono mensual de este inquilino es la suma de esos precios.', editor.getByLabel('Precio mensual de la cochera 1'), 11000);
  await scene(page, 14, 'SALDO INICIAL', 'Definí cómo empieza la cuenta', 'Si ya debe meses anteriores o tiene crédito a favor, se carga acá. Si está al día, no hace falta agregar nada.', editor.getByText('¿Cómo está su cuenta hoy?'), 10500);
  await scene(page, 15, 'REVISIÓN DEL ALTA', 'Confirmá solo cuando esté completo', 'Al crear se abre la cuenta corriente. Este ejemplo queda sin guardar para no incorporar un cliente ficticio.', editor.getByRole('button', { name: 'Crear inquilino' }), 9000);
  await page.keyboard.press('Escape');
  await editor.waitFor({ state: 'hidden' });
  const accounts = list.getByRole('link', { name: 'Ver cuenta' });
  const firstAccount = accounts.nth(Math.min(4, (await accounts.count()) - 1));
  await scene(page, 16, 'CUENTA CORRIENTE', 'Abrí el detalle de un inquilino', 'El administrador puede ver todos los cargos, pagos y ajustes de la cuenta, con sus fechas y saldos.', firstAccount, 9000);
  const firstHref = await firstAccount.getAttribute('href');
  await firstAccount.click();
  try { await page.waitForFunction(() => /^\/renters\/[^/]+$/.test(window.location.pathname), null, { timeout: 8000 }); }
  catch { await goto(page, firstHref); }
  await page.addStyleTag({ content: 'h1, h1+div span:has(svg), .gm-display + div .text-muted-foreground {filter:blur(8px)!important}' });
  await hideRenterContact(page);
  await showMenu(page, 17, 'CUENTA CORRIENTE', '/renters', 'Seguimos dentro de Operación → Inquilinos. Esta página es la cuenta individual que el administrador abre desde la lista.');
  await scene(page, 18, 'RESUMEN PERSONAL', 'Abono, cocheras y saldo', 'La cabecera muestra cuánto paga por mes, sus cocheras asignadas y si debe, está al día o tiene saldo a favor.', page.getByText('Abono mensual').first(), 10500);
  await scene(page, 19, 'ESTADO DE CUENTA', 'Resumen de movimientos', 'La pestaña Resumen ordena cargos, pagos y ajustes y permite seguir cómo cambió el saldo en el tiempo.', page.getByText('Resumen', { exact: true }).first(), 10500);
  await page.getByRole('button', { name: /Cargos/ }).first().click();
  await scene(page, 20, 'CARGOS', 'Lo que se le cobró por período', 'Cada cargo indica concepto, vencimiento, cuánto pagó y qué saldo queda. Un pago parcial no borra el resto.', page.getByText('Cargos', { exact: true }).first(), 10500);
  await page.getByRole('button', { name: /Pagos/ }).first().click();
  await scene(page, 21, 'PAGOS', 'El dinero recibido queda trazado', 'La pestaña Pagos conserva importe, fecha y medio. Desde “Recibo” se puede volver a entregar un comprobante anterior.', page.getByText('Pagos', { exact: true }).first(), 10500);
  await goto(page, '/renters', 'Inquilinos');
  await page.addStyleTag({ content: '[role="table"][aria-label="Inquilinos"] [role="row"] [role="cell"]:first-child {filter:blur(9px)!important}' });
  const pendingAccount = page.getByRole('table', { name: 'Inquilinos' }).getByRole('link', { name: 'Ver cuenta' }).nth(1);
  const pendingHref = await pendingAccount.getAttribute('href');
  await pendingAccount.click();
  try { await page.waitForFunction(() => /^\/renters\/[^/]+$/.test(window.location.pathname), null, { timeout: 8000 }); }
  catch { await goto(page, pendingHref); }
  await page.addStyleTag({ content: 'h1, h1+div span:has(svg), .gm-display + div .text-muted-foreground {filter:blur(8px)!important}' });
  await hideRenterContact(page);
  await showMenu(page, 22, 'CUENTA CON SALDO PENDIENTE', '/renters', 'Abrimos otra cuenta que tiene un abono pendiente. El menú confirma que seguimos en Operación → Inquilinos.');
  const charge = page.getByRole('button', { name: 'Cobrar', exact: true }).first();
  await scene(page, 23, 'COBRAR', 'Elegí “Cobrar” desde la cuenta', 'Tocamos Cobrar en esta cuenta. La ventana propone los cargos pendientes y el total que falta pagar.', charge, 8500);
  await charge.click();
  const chargeDialog = page.locator('[role="dialog"]').filter({ hasText: 'Cobrar a' });
  await chargeDialog.getByText('Cómo paga').waitFor({ state: 'visible', timeout: 30000 });
  await chargeDialog.getByRole('heading').first().evaluate(node => { node.style.filter = 'blur(9px)'; });
  await scene(page, 24, 'QUÉ PAGA', 'Marcá los cargos', 'Podés cobrar todo o elegir cargos específicos. Si recibe un importe parcial, editás el total y se aplica a los más antiguos primero.', chargeDialog.getByText('Qué paga'), 11000);
  await scene(page, 25, 'MEDIOS DE PAGO', 'Efectivo, transferencia, ambos o QR', 'El efectivo entra en caja; una transferencia se verifica por fuera. Si vinculaste Mercado Pago, el QR espera la acreditación automática.', chargeDialog.getByRole('radiogroup', { name: 'Medio de pago' }), 11000);
  await scene(page, 26, 'RECIBO Y SALDO', 'Revisá cómo quedará la cuenta', 'Antes de confirmar, el pie dice cuánto recibís y qué saldo quedará. Al cobrar se genera un recibo que se puede volver a consultar.', chargeDialog.getByText('Recibís', { exact: false }).first(), 10500);
  await page.keyboard.press('Escape');
  await chargeDialog.waitFor({ state: 'hidden' });
  const actions = page.getByRole('button', { name: 'Acciones de administración' });
  await actions.click();
  await scene(page, 27, 'CORRECCIONES', 'Ajustes y saldo inicial', 'Desde estas acciones podés aplicar una bonificación, cargar un recargo, registrar saldo inicial o editar los datos. Todo queda en el historial.', page.getByText('Cargar un ajuste'), 10500);
  await page.keyboard.press('Escape');
  await goto(page, '/renters', 'Inquilinos');
  await showMenu(page, 28, 'CONTROL', '/renters', 'Volvemos a Operación → Inquilinos para revisar el control general de anulaciones.');
  await page.getByRole('button', { name: /Anulaciones/ }).first().click();
  const cancellations = page.locator('[role="dialog"]').filter({ hasText: 'Anulaciones' });
  await scene(page, 29, 'ANULACIONES', 'Los errores se corrigen con rastro', 'El administrador puede revisar qué se anuló, por qué, cuándo y por quién. Una anulación no borra silenciosamente la cuenta.', cancellations, 11000);
  await finish(recording);
}

async function administration() {
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 }, recordVideo: { dir: output, size: { width: 1600, height: 900 } }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const recording = { name: 'administracion-v2', context, page };
  await goto(page, '/auth/login', 'INICIAR SESIÓN');
  await page.locator('input[name="identifier"]').waitFor({ state: 'visible' });
  await page.waitForTimeout(4000);
  await scene(page, 1, 'ACCESO', 'Cada persona entra con su usuario', 'El operador y el administrador tienen cuentas distintas. El sistema muestra las herramientas que corresponden a su rol.', page.locator('form'), 9500);
  await page.addStyleTag({ content: 'input[name="identifier"],input[name="password"]{color:transparent!important;text-shadow:0 0 12px #fff!important}' });
  await page.locator('input[name="identifier"]').fill(process.env.ADMIN_USER);
  await page.locator('input[name="password"]').fill(process.env.ADMIN_PASS);
  await scene(page, 2, 'INICIO DE SESIÓN', 'Completá usuario y contraseña', 'Para esta guía ingresamos como administrador. El operador ve Tickets, Inquilinos si está habilitado y Avisos, sin acceso a los ajustes administrativos.', page.getByRole('button', { name: 'Entrar al sistema' }), 9500);
  await page.getByRole('button', { name: 'Entrar al sistema' }).click();
  await page.waitForURL('**/tickets', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await showMenu(page, 3, 'ROL ADMINISTRADOR', '/tickets', 'El menú muestra las secciones disponibles. Administración despliega Panel, Usuarios, Tarifas, Frecuentes, Caja y Configuración.');
  await goto(page, '/admin/dashboard', 'Dashboard');
  await showMenu(page, 4, 'PANEL', '/admin/dashboard', 'Entramos a Administración → Panel. El menú desplegado marca la sección actual para que siempre sepas dónde estás.');
  await scene(page, 5, 'PANEL', 'Indicadores de la playa', 'El tablero reúne la actividad para supervisar la operación sin entrar en cada registro. Desde el menú se pasa al detalle.', page.getByRole('heading', { name: 'Dashboard' }).first(), 9500);
  await goto(page, '/admin/frecuentes', 'Clientes frecuentes');
  await page.addStyleTag({ content: 'table tbody,[role="rowgroup"] [role="row"]{filter:blur(9px)!important}' });
  await showMenu(page, 6, 'FRECUENTES', '/admin/frecuentes', 'Ahora estamos en Administración → Frecuentes. Acá se reúnen los clientes que vuelven y sus visitas.');
  await scene(page, 7, 'CLIENTES FRECUENTES', 'Consultá visitas e historial', 'La tabla permite identificar patentes habituales, cantidad de visitas y patrones de permanencia, sin revisar ticket por ticket.', page.getByRole('heading', { name: 'Clientes frecuentes' }), 9500);
  const filters = page.getByRole('button', { name: 'Mostrar filtros' });
  await scene(page, 8, 'FILTROS', 'Mostrá solo los que necesitás', 'Abrimos los filtros para acotar fechas, tipo de vehículo y mínimo de visitas. La lista está paginada.', filters, 8500);
  await filters.click();
  await scene(page, 9, 'FILTROS', 'Elegí y aplicá', 'Podés consultar un período concreto o un tipo de vehículo. El resultado se actualiza al aplicar los filtros.', page.locator('[data-tour="frecuentes-filtros"]'), 9500);
  await goto(page, '/admin/users', 'Usuarios del sistema');
  await page.addStyleTag({ content: 'table tbody td:nth-child(2),[role="row"] [role="cell"]:nth-child(2){filter:blur(9px)!important}' });
  await showMenu(page, 10, 'USUARIOS', '/admin/users', 'En Administración → Usuarios se crean cuentas y se ve qué rol y qué playa tiene asignado cada operador.');
  await scene(page, 11, 'ROLES', 'Administrador y operador', 'El administrador configura la empresa y sus playas. El operador se concentra en entradas, cobros y tareas cotidianas de la playa asignada.', page.getByRole('heading', { name: 'Usuarios del sistema' }), 10500);
  await scene(page, 12, 'ASIGNACIÓN', 'Cada operador trabaja en su playa', 'La columna “Playa del operador” permite revisar o cambiar su asignación; el rol se distingue en la misma tabla.', page.getByText('PLAYA DEL OPERADOR'), 9500);
  await goto(page, '/admin/configuracion', 'Configuración');
  await showMenu(page, 13, 'CONFIGURACIÓN', '/admin/configuracion', 'En Administración → Configuración están los ajustes operativos, la entrega de comprobantes y la conexión de Mercado Pago.');
  await scene(page, 14, 'CONFIGURACIÓN', 'Tres grupos fáciles de ubicar', 'Operación define turnos y tarjetas; Comprobantes define cómo entregarlos; Mercado Pago define dónde se acreditan los cobros QR.', page.getByRole('heading', { name: 'Configuración' }), 10000);
  await goto(page, '/admin/configuracion/operacion', 'Operación');
  await showMenu(page, 15, 'CONFIGURACIÓN · OPERACIÓN', '/admin/configuracion', 'Seguimos dentro de Administración → Configuración, en la página Operación.');
  await scene(page, 16, 'TURNOS OPCIONALES', 'Activá o desactivá turnos', 'Si están activos, el efectivo de una salida requiere un turno abierto y cada operador rinde su caja. Si están desactivados, se cobra igual y se usa la planilla diaria.', page.locator('#shifts-enabled'), 11000);
  await scene(page, 17, 'FICHAS FÍSICAS', 'También son opcionales', 'La playa puede trabajar solo por patente. Si activa tickets por código de barras, administra las tarjetas físicas de esta sección.', page.locator('#tickets-enabled'), 10000);
  await scene(page, 18, 'VEHÍCULOS', 'Definí qué tipos acepta la playa', 'Auto, camioneta u otros tipos habilitados aparecen luego en la entrada y en el editor de tarifas.', page.getByRole('heading', { name: /Qué vehículos recibís/ }).first(), 9500);
  await goto(page, '/admin/configuracion/comprobantes', 'Comprobantes');
  await showMenu(page, 19, 'CONFIGURACIÓN · COMPROBANTES', '/admin/configuracion', 'Estamos en Administración → Configuración → Comprobantes. Las opciones se guardan por playa.');
  await scene(page, 20, 'ENTREGA', 'Elegí los canales', 'WhatsApp prepara el enlace, QR permite que el cliente lo escanee e impresora USB entrega papel. Se pueden combinar.', page.getByRole('heading', { name: 'Entrega de comprobantes' }), 11000);
  await scene(page, 21, 'IMPRESIÓN', 'Papel térmico y descarga digital', 'Si se habilita impresión, se elige ancho de 58 u 80 mm. Los enlaces digitales permiten descargar el comprobante en PDF o imagen.', page.getByText('Impresora USB'), 10500);
  await goto(page, '/admin/configuracion/mercadopago', 'Cobro con MercadoPago');
  await showMenu(page, 22, 'CONFIGURACIÓN · MERCADO PAGO', '/admin/configuracion', 'Seguimos en Configuración, ahora en Cobro con Mercado Pago. La conexión la hace el administrador una vez por empresa.');
  await scene(page, 23, 'QR DE COBRO', 'Conectá la cuenta de la empresa', 'Los QR de salidas y de inquilinos acreditan en esa cuenta. El sistema espera la confirmación del pago antes de registrarlo.', page.getByRole('heading', { name: 'Cobro con MercadoPago' }), 10500);
  await goto(page, '/notes', 'Avisos');
  await showMenu(page, 24, 'AVISOS', '/notes', 'Terminamos en Operación → Avisos. Es el tablón que comparten los operadores y el administrador.');
  await scene(page, 25, 'AVISOS', 'Indicaciones para el próximo turno', 'Un aviso conserva mensaje, autor y fecha para que una novedad importante no dependa de una conversación informal.', page.getByRole('heading', { name: 'Avisos' }), 10500);
  const newNote = page.getByRole('button', { name: 'Nuevo aviso' }).first();
  await scene(page, 26, 'NUEVO AVISO', 'Tocá “Nuevo aviso”', 'Escribí una instrucción para el equipo. También podés buscar avisos anteriores y marcar como leído lo que ya revisaste.', newNote, 9000);
  await newNote.click();
  await scene(page, 27, 'NUEVO AVISO', 'Revisá antes de publicar', 'El texto se comparte con toda la playa. Esta guía solo muestra el formulario y no publica un mensaje de prueba.', page.locator('[role="dialog"]').filter({ hasText: 'Nuevo aviso' }), 10000);
  await finish(recording);
}

async function administrationNotes() {
  const recording = await recordedPage('administracion-notes-v2', 'ADMIN');
  const { page } = recording;
  await goto(page, '/notes', 'Avisos');
  await showMenu(page, 24, 'AVISOS', '/notes', 'Terminamos en Operación → Avisos. El menú desplegado muestra dónde estamos dentro del sistema.');
  await scene(page, 25, 'AVISOS', 'Indicaciones para el equipo', 'Los avisos conservan mensaje, autor y fecha. El siguiente operador puede leer una novedad sin depender de una conversación informal.', page.getByRole('heading', { name: 'Avisos' }), 11000);
  const newNote = page.getByRole('button', { name: 'Nuevo aviso' }).first();
  await scene(page, 26, 'NUEVO AVISO', 'Tocá “Nuevo aviso”', 'Acá se escribe una instrucción para todos los que trabajan en la playa. También se pueden buscar avisos anteriores.', newNote, 10000);
  await newNote.click();
  await scene(page, 27, 'NUEVO AVISO', 'Revisá antes de publicar', 'Escribís el título y el mensaje, y lo publicás cuando esté listo. Esta guía muestra el formulario sin compartir un aviso de prueba.', page.locator('[role="dialog"]').filter({ hasText: 'Nuevo aviso' }), 11000);
  await finish(recording);
}

async function plannedStay() {
  const recording = await recordedPage('pases-operacion-v2', 'OPERATOR');
  const { page } = recording;
  await goto(page, '/tickets', 'Entradas y salidas');
  await showMenu(page, 22, 'ESTADÍA PLANIFICADA', '/tickets', 'Volvemos a Operación → Tickets para ver cómo el operador usa los precios por día, semana o mes configurados en Tarifas.');
  const trigger = page.getByRole('button', { name: /Estadía por día, semana o mes/ }).first();
  await scene(page, 23, 'ESTADÍA PLANIFICADA', 'Abrí el alta de larga duración', 'Este flujo sirve cuando el cliente contrata un pase de días, semanas o meses. No se mezcla con el cobro por tiempo de una salida normal.', trigger, 10500);
  await trigger.click();
  const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Estadía por día, semana o mes' });
  await scene(page, 24, 'TIPO DE PASE', 'Elegí la unidad contratada', 'Podés elegir días, semanas, meses o una combinación. La duración define qué precio de pase se usa.', dialog.getByText('Tipo de ticket'), 10500);
  await dialog.getByRole('combobox').first().click();
  await page.getByRole('option', { name: 'Día/s', exact: true }).click();
  await scene(page, 25, 'CANTIDAD', 'Indicá cuántas unidades', 'Si contrató dos días, escribís 2. El precio diario configurado para el tipo de vehículo se multiplica por esa cantidad.', dialog.getByText('Cantidad de día/s'), 10500);
  await dialog.getByRole('spinbutton').fill('2');
  await scene(page, 26, 'VEHÍCULO', 'Elegí el tipo correspondiente', 'Auto y camioneta pueden tener precios diferentes también para los pases. Después cargás la patente y, si querés, nombre y apellido.', dialog.getByText('Tipo de vehículo'), 10500);
  await dialog.getByPlaceholder('Ej: AB123CD').fill('ZZ999ZZ');
  await scene(page, 27, 'DATOS', 'La patente identifica la estadía', 'El registro queda en activos hasta su salida. Usamos una patente de ejemplo pero no guardamos esta operación.', dialog.getByPlaceholder('Ej: AB123CD'), 9500);
  await scene(page, 28, 'PAGO AL INGRESAR', 'Indicá si ya pagó', 'Si el cliente pagó al contratar el pase, elegís “Sí” y registrás efectivo o transferencia. Si todavía no pagó, elegís “No” y se cobrará después.', dialog.getByText('¿El cliente realizó el pago?'), 11000);
  await dialog.getByRole('combobox').nth(2).click();
  await page.getByRole('option', { name: 'Sí' }).click();
  await scene(page, 29, 'MEDIO DE PAGO', 'Registrá cómo pagó', 'El sistema asocia el medio al pase y genera su comprobante al guardar. Revisá todo antes de crear el ticket.', dialog.getByText('¿Cómo pagó?'), 10500);
  await scene(page, 30, 'REVISIÓN', 'El precio viene de Tarifas', 'Los valores se editan en Administración → Tarifas → Día / semana / mes. No confirmamos este ejemplo para no crear una estadía ficticia.', dialog.getByRole('button', { name: 'Crear ticket' }), 10500);
  await finish(recording);
}

try {
  const chapter = process.argv[2];
  if (chapter === 'operacion') await operation();
  else if (chapter === 'operacion-comprobante') await operationReceipt();
  else if (chapter === 'operacion-historial') await operationHistory();
  else if (chapter === 'cobro') await payment();
  else if (chapter === 'tarifas') await tariffs();
  else if (chapter === 'caja') await cash();
  else if (chapter === 'inquilinos') await renters();
  else if (chapter === 'administracion') await administration();
  else if (chapter === 'administracion-notas') await administrationNotes();
  else if (chapter === 'pases-operacion') await plannedStay();
  else throw new Error('Capítulo desconocido: ' + chapter);
} finally { await browser.close(); }


