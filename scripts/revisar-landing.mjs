/**
 * Saca capturas de la landing para revisarla sin abrir el navegador a mano, y
 * avisa si alguna sección se desborda a lo ancho.
 *   node scripts/revisar-landing.mjs [url]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const URL_LANDING = process.argv[2] ?? 'http://localhost:3002/';
const SALIDA = join(dirname(dirname(fileURLToPath(import.meta.url))), '.revision');

const main = async () => {
  await mkdir(SALIDA, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });

  for (const [nombre, ancho, alto, movil] of [['escritorio', 1366, 900, false], ['celular', 390, 844, true]]) {
    const ctx = await browser.newContext({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 2, isMobile: movil, hasTouch: movil });
    const page = await ctx.newPage();
    await page.goto(URL_LANDING, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(2500);

    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${nombre}: desborde horizontal = ${desborde}px`);

    for (const sel of ['.hero', '.caso', '.bento-grid', '.ia-card', '.price-glow', '.faq', '.cta']) {
      const loc = page.locator(sel).first();
      if (await loc.count() === 0) { console.log(`  ! falta ${sel}`); continue; }
      await loc.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(400);
      await loc.screenshot({ path: join(SALIDA, `${nombre}${sel.replace(/[.#]/g, '-')}.png`) }).catch(() => {});
    }
    await ctx.close();
  }

  await browser.close();
  console.log(`\nCapturas en ${SALIDA}`);
};

main().catch(error => { console.error('Falló:', error.message); process.exit(1); });
