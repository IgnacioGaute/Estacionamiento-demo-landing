/**
 * Saca las cuatro capturas que usan los dispositivos 3D de la landing.
 *
 * Las medidas NO son arbitrarias: cada imagen tiene que salir en la proporción
 * exacta de la pantalla donde se va a meter, porque los marcos de la landing
 * recortan con `object-fit: cover`. La notebook es 16/10 y el celular 390/844.
 *   escritorio  1440 x 900  a 2x  ->  2880 x 1800
 *   celular      390 x 844  a 3x  ->  1170 x 2532
 *
 * Uso:
 *   node scripts/capturar-pantallas.mjs
 *
 * Variables (opcionales, con estos valores por defecto):
 *   APP_URL=http://localhost:3000
 *   APP_USER=...   APP_PASS=...
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const APP = process.env.APP_URL ?? 'http://localhost:3000';
const USER = process.env.APP_USER ?? '';
const PASS = process.env.APP_PASS ?? '';
const DESTINO = join(dirname(dirname(fileURLToPath(import.meta.url))), 'public', 'screens');

// El indicador de desarrollo de Next y las barras de scroll no van en una captura
// de venta. El asistente flotante SÍ: es lo que queremos mostrar.
const LIMPIEZA = `
  nextjs-portal { display: none !important; }
  html { scrollbar-width: none; }
  ::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }
`;

async function entrar(page) {
  await page.goto(`${APP}/auth/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  for (let intento = 0; intento < 4 && page.url().includes('/auth/login'); intento++) {
    await page.fill('input[name="identifier"]', USER).catch(() => {});
    await page.fill('input[name="password"]', PASS).catch(() => {});
    await page.click('button:has-text("Entrar al sistema")').catch(() => {});
    await page.waitForTimeout(3500);
  }
  if (page.url().includes('/auth/login')) throw new Error('No se pudo iniciar sesión. Revisá APP_USER y APP_PASS.');
}

async function preparar(page, esperar) {
  await page.getByText(esperar).first().waitFor({ timeout: 45000 }).catch(() => {});
  // El widget del asistente monta después de la sesión: hay que darle su tiempo.
  await page.locator('[data-assistant-ui]').waitFor({ timeout: 20000 })
    .catch(() => console.warn('  ! No apareció el asistente. ¿La cuenta tiene playa asignada?'));
  await page.waitForTimeout(2500);
  await page.addStyleTag({ content: LIMPIEZA });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

const main = async () => {
  if (!USER || !PASS) throw new Error('Faltan APP_USER y APP_PASS.');
  await mkdir(DESTINO, { recursive: true });
  // Usa el Chrome ya instalado en la máquina: evita bajar otro navegador de 150 MB.
  const browser = await chromium.launch({ channel: 'chrome' });

  // ── Escritorio ───────────────────────────────────────────────────────────
  const escritorio = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const p = await escritorio.newPage();
  await entrar(p);

  await p.goto(`${APP}/tickets`, { waitUntil: 'domcontentloaded' });
  await preparar(p, 'Tickets y patentes');
  await p.screenshot({ path: join(DESTINO, 'operacion-desktop.png') });
  console.log('✓ operacion-desktop.png');

  await p.goto(`${APP}/admin/tickets`, { waitUntil: 'domcontentloaded' });
  await preparar(p, 'ADMINISTRAR TICKETS');
  await p.locator('button:has-text("Precios por duración")').first().click().catch(() => {});
  await p.waitForTimeout(1800);
  await p.screenshot({ path: join(DESTINO, 'tarifas-desktop.png') });
  console.log('✓ tarifas-desktop.png');

  const cookies = await escritorio.cookies();
  await escritorio.close();

  // ── Celular ──────────────────────────────────────────────────────────────
  const celular = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  await celular.addCookies(cookies);
  const m = await celular.newPage();

  await m.goto(`${APP}/tickets`, { waitUntil: 'domcontentloaded' });
  await preparar(m, 'Tickets y patentes');
  await m.screenshot({ path: join(DESTINO, 'operacion-mobile.png') });
  console.log('✓ operacion-mobile.png');

  await m.locator('button:has-text("Activos")').first().click().catch(() => {});
  await m.waitForTimeout(1500);
  await m.screenshot({ path: join(DESTINO, 'activos-mobile.png') });
  console.log('✓ activos-mobile.png');

  await celular.close();
  await browser.close();
  console.log(`\nListo. Las cuatro quedaron en ${DESTINO}`);
};

main().catch(error => { console.error('\nFalló:', error.message); process.exit(1); });
