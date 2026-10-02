import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3002/aprender', { waitUntil: 'domcontentloaded' });
  await page.locator('#guias').scrollIntoViewIfNeeded();
  for (const [index, label] of ['Entrada y comprobante', 'Turnos, búsqueda y salida', 'Precios por tiempo y estadía', 'Movimientos y planilla', 'Inquilinos', 'Acceso y configuración'].entries()) {
    await page.locator('.academy-guide-nav button').nth(index).click();
    await page.getByRole('button', { name: /Reproducir guía/ }).click();
    const video = page.locator('.academy-screen video');
    await video.evaluate(element => new Promise((resolve, reject) => {
      if (element.readyState >= 2) return resolve();
      element.addEventListener('loadeddata', resolve, { once: true });
      element.addEventListener('error', reject, { once: true });
    }));
    await page.waitForTimeout(5000);
    const details = await video.evaluate(element => ({ source: element.currentSrc, seconds: Math.round(element.duration), width: element.videoWidth, height: element.videoHeight, currentTime: Math.round(element.currentTime * 10) / 10, muted: element.muted, paused: element.paused, readyState: element.readyState, buffered: element.buffered.length ? Math.round(element.buffered.end(0) * 10) / 10 : 0 }));
    console.log(label, JSON.stringify(details));
    if (details.currentTime < 2 || details.muted || details.paused || !details.source.endsWith('.mp4')) throw new Error(`El video ${label} no avanzó con audio MP4.`);
    await page.getByRole('button', { name: /Cerrar video/ }).click();
  }
  await page.close();
} finally { await browser.close(); }

