import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.LANDING_QA_URL || 'http://localhost:3001';
const expected = [
  ['operacion-dos-dispositivos', 189],
  ['cobro-dos-dispositivos', 367],
  ['tarifas-dos-dispositivos', 458],
  ['caja-dos-dispositivos', 222],
  ['administracion-dos-dispositivos', 506],
  ['inquilinos-con-audio', 691],
];
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/aprender`, { waitUntil: 'domcontentloaded' });
  const choices = page.getByRole('complementary', { name: 'Todas las guías' }).getByRole('button');
  await choices.first().waitFor();
  await page.waitForFunction(() => {
    const button = document.querySelector('.lista button');
    return button && Object.keys(button).some(key => key.startsWith('__reactProps') && typeof button[key]?.onClick === 'function');
  });
  assert.equal(await choices.count(), expected.length);
  for (const [index, [file, seconds]] of expected.entries()) {
    await choices.nth(index).click();
    const video = page.locator('.reproductor video');
    await video.evaluate(element => new Promise((resolve, reject) => {
      if (element.readyState >= 2) return resolve();
      element.addEventListener('loadeddata', resolve, { once: true });
      element.addEventListener('error', () => reject(new Error(element.error?.message || 'Error de video')), { once: true });
    }));
    await page.waitForFunction(() => document.querySelector('.reproductor video')?.currentTime > 1);
    const details = await video.evaluate(element => ({ source: element.currentSrc, seconds: Math.round(element.duration), width: element.videoWidth, height: element.videoHeight, currentTime: element.currentTime, muted: element.muted, paused: element.paused }));
    assert.ok(details.source.endsWith(`/videos/${file}.mp4`), details.source);
    assert.ok(Math.abs(details.seconds - seconds) <= 1, `${file}: duración ${details.seconds}`);
    assert.equal(details.muted, false);
    assert.equal(details.paused, false);
    if (index < 5) {
      assert.equal(details.width, 1920);
      assert.equal(details.height, 1080);
    }
    console.log(file, JSON.stringify(details));
    await video.evaluate(element => element.pause());
  }
  assert.match(await choices.last().innerText(), /Inquilinos/);
  await page.setViewportSize({ width: 390, height: 844 });
  await choices.first().click();
  await page.waitForTimeout(800);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Desborde horizontal en celular');
  console.log('6 videos reproducidos; Inquilinos último; diseño móvil sin desborde.');
} finally {
  await browser.close();
}
