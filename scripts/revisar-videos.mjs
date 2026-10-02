import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const names = ['operacion', 'cobro', 'tarifas', 'caja', 'inquilinos', 'administracion'];
const output = join(process.cwd(), 'public', 'video-posters');
const revision = join(process.cwd(), '.revision');
await mkdir(output, { recursive: true });
await mkdir(revision, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const name of names) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.setContent(`<style>html,body{margin:0;background:#17140f}video{display:block;width:1280px;height:720px;object-fit:contain}</style><video src="http://localhost:3002/videos/${name}-real.webm" preload="auto"></video>`);
    const video = page.locator('video');
    const duration = await video.evaluate(async (element) => {
      if (element.readyState < 1) await new Promise((resolve, reject) => {
        element.addEventListener('loadedmetadata', resolve, { once: true });
        element.addEventListener('error', reject, { once: true });
      });
      return element.duration;
    });
    for (const [label, second, path] of [
      ['poster', Math.min(3.4, duration * .12), join(output, `${name}.jpg`)],
      ['middle', duration * .58, join(revision, `video-${name}-medio.jpg`)],
    ]) {
      await video.evaluate(async (element, time) => {
        element.currentTime = time;
        await new Promise(resolve => element.addEventListener('seeked', resolve, { once: true }));
      }, second);
      await video.screenshot({ path, type: 'jpeg', quality: 83 });
    }
    console.log(name, Math.round(duration) + 's', await video.evaluate(element => `${element.videoWidth}x${element.videoHeight}`));
    await page.close();
  }
} finally {
  await browser.close();
}
